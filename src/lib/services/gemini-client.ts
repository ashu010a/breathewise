import { AirQualityData, HouseholdProfile, ChatMessage } from '../types';

export interface ChatCompletionRequest {
  userQuestion: string;
  airQuality: AirQualityData;
  profile: HouseholdProfile;
  history: ChatMessage[];
  language?: 'en' | 'hi' | 'es';
}

export interface ChatCompletionResponse {
  answer: string;
  citations: string[];
  actionTips: string[];
  disclaimer: string;
  provider: string;
}

export async function generateAiChatResponse(
  req: ChatCompletionRequest
): Promise<ChatCompletionResponse> {
  const { userQuestion, airQuality, profile, language = 'en' } = req;

  // 1. Check if Gemini API Key is provided
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const response = await callGeminiApi(geminiKey, userQuestion, airQuality, profile, language);
      if (response) return response;
    } catch (e) {
      console.warn('Gemini API call failed, trying OpenRouter or expert fallback:', e);
    }
  }

  // 2. Check OpenRouter API Key
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (openRouterKey) {
    try {
      const response = await callOpenRouterApi(openRouterKey, userQuestion, airQuality, profile, language);
      if (response) return response;
    } catch (e) {
      console.warn('OpenRouter API call failed, falling back to expert environmental engine:', e);
    }
  }

  // 3. Calibrated Rule-based Environmental Knowledge Engine (Fallback)
  return generateExpertEnvironmentalResponse(userQuestion, airQuality, profile, language);
}

async function callGeminiApi(
  apiKey: string,
  userQuestion: string,
  aq: AirQualityData,
  profile: HouseholdProfile,
  language: string
): Promise<ChatCompletionResponse | null> {
  const systemPrompt = `You are BreatheWise AI, an authoritative, empathetic environmental intelligence assistant.
Current Live Context:
- Location: ${profile.location.city}, ${profile.location.country}
- Air Quality: AQI ${aq.assessment.value} (${aq.assessment.category}, Standard: ${aq.assessment.standard})
- PM2.5: ${aq.pollutants.pm25} µg/m³, PM10: ${aq.pollutants.pm10} µg/m³, NO2: ${aq.pollutants.no2} µg/m³
- Household: ${profile.familyMembersCount} members (${profile.childrenCount} children, ${profile.elderlyCount} seniors). Sensitive conditions: ${profile.sensitiveConditions.join(', ') || 'None reported'}.
- Purifier: ${profile.hasIndoorAirPurifier ? 'Has HEPA Purifier' : 'No purifier'}.
- Home Type: ${profile.homeType}. Budget: ${profile.budgetLevel}.

Guidelines:
1. Translate scientific environmental parameters into practical, actionable advice.
2. Adhere strictly to WHO, US EPA, and India CPCB air quality guidelines.
3. NEVER prescribe medicines or diagnose disease. Recommend doctor consultation for acute symptoms.
4. NEVER recommend ozone-generating purifiers or unvented heaters.
5. Language: Answer in ${language === 'hi' ? 'Hindi (Devanagari)' : language === 'es' ? 'Spanish' : 'English'}.
6. Structure your response as JSON with:
   - "answer": Markdown formatted response explaining reasoning clearly.
   - "citations": Array of authoritative sources cited (e.g. ["CPCB National AQI Guidelines", "WHO 2021 Air Quality Limits"]).
   - "actionTips": 2 to 4 bullet points of immediate actions.
   - "disclaimer": Standard health safety disclaimer.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${userQuestion}` }] }],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  try {
    const parsed = JSON.parse(text);
    return {
      answer: parsed.answer || text,
      citations: parsed.citations || ['CPCB India Guidelines', 'WHO Global Air Quality Guidelines'],
      actionTips: parsed.actionTips || [],
      disclaimer: parsed.disclaimer || 'BreatheWise provides educational guidance, not medical diagnosis. Consult healthcare professionals for respiratory symptoms.',
      provider: 'Google Gemini 1.5 Flash (Live LLM)',
    };
  } catch {
    return {
      answer: text,
      citations: ['CPCB India Guidelines', 'WHO Global Air Quality Guidelines'],
      actionTips: [],
      disclaimer: 'BreatheWise provides educational guidance, not medical diagnosis.',
      provider: 'Google Gemini 1.5 Flash',
    };
  }
}

async function callOpenRouterApi(
  apiKey: string,
  userQuestion: string,
  aq: AirQualityData,
  profile: HouseholdProfile,
  language: string
): Promise<ChatCompletionResponse | null> {
  const model = process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash';
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: `You are BreatheWise AI assistant. Provide scientifically sound, empathetic air quality advice. Current AQI is ${aq.assessment.value} (${aq.assessment.category}). Language: ${language}. Always include citations and practical steps.`,
        },
        { role: 'user', content: userQuestion },
      ],
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) return null;

  return {
    answer: content,
    citations: ['OpenRouter API Model', 'WHO Air Quality Standards'],
    actionTips: ['Check indoor air filtration', 'Keep doors sealed during peak inversion hours'],
    disclaimer: 'Educational environmental guidance. Not medical diagnosis.',
    provider: `OpenRouter (${model})`,
  };
}

/**
 * Built-in Calibrated Expert Environmental Knowledge Engine
 * Provides rich, domain-accurate, contextual responses when external API keys are not supplied.
 */
function generateExpertEnvironmentalResponse(
  question: string,
  aq: AirQualityData,
  profile: HouseholdProfile,
  language: 'en' | 'hi' | 'es' = 'en'
): ChatCompletionResponse {
  const q = question.toLowerCase();
  const aqi = aq.assessment.value;
  const pm25 = aq.pollutants.pm25;
  const isSevere = aqi >= 300 || pm25 >= 120;
  const isPoor = aqi >= 200 || pm25 >= 90;

  // Question 1: Children / School / Outdoor Play
  if (q.includes('children') || q.includes('kid') || q.includes('play outside') || q.includes('school')) {
    if (language === 'hi') {
      return {
        answer: isSevere || isPoor
          ? `**बच्चों को आज बाहर खेलने की अनुमति नहीं दी जानी चाहिए।**\n\nवर्तमान में वायु गुणवत्ता सूचकांक (AQI) **${aqi} (${aq.assessment.category})** पर है और PM2.5 सांद्रता **${pm25} µg/m³** है।\n\nबच्चों के फेफड़े अभी विकसित हो रहे होते हैं और वे वयस्कों की तुलना में अपने शरीर के वजन के अनुपात में अधिक हवा सांस में लेते हैं। आज बाहर दौड़ने या खेलने से उनके फेफड़ों की गहराई में खतरनाक कण जमा हो सकते हैं।\n\n**सलाह:** बच्चों के लिए घर के अंदर बोर्ड गेम्स, पेंटिंग या इनडोर व्यायाम की व्यवस्था करें और इनडोर एयर प्यूरीफायर चालू रखें।`
          : `**हाँ, बच्चे सीमित समय के लिए बाहर खेल सकते हैं।**\n\nवर्तमान AQI **${aqi} (${aq.assessment.category})** है। हालांकि, यदि बच्चे को अस्थमा या एलर्जी है, तो दोपहर के समय खेलें जब प्रदूषण कम होता है।`,
        citations: ['केंद्रीय प्रदूषण नियंत्रण बोर्ड (CPCB) दिशानिर्देश', 'विश्व स्वास्थ्य संगठन (WHO) बाल स्वास्थ्य रिपोर्ट'],
        actionTips: [
          'सभी आउटडोर स्पोर्ट्स और दौड़ को स्थगित करें',
          'घर के अंदर HEPA प्यूरीफायर वाले कमरे में रखें',
          'यदि बाहर जाना आवश्यक हो तो बाल-आकार का N95 मास्क पहनाएं',
        ],
        disclaimer: 'यह सुझाव सामान्य वायु गुणवत्ता दिशानिर्देशों पर आधारित है, चिकित्सीय परामर्श नहीं।',
        provider: 'BreatheWise Expert Environmental Engine (Deterministic Rule Layer)',
      };
    }

    return {
      answer: isSevere || isPoor
        ? `**No, it is not safe for children to engage in outdoor play today.**\n\n### Scientific Assessment:\nYour local air quality index is currently **AQI ${aqi} (${aq.assessment.category})** with a hazardous PM2.5 level of **${pm25} µg/m³** (nearly ${Math.round(pm25 / 15)}× higher than WHO safe 24-hour guidelines).\n\n### Why Children are Uniquely Vulnerable:\n1. **Higher Inhalation Rate:** Children breathe 50% more air per pound of body weight than adults.\n2. **Narrow Airways:** Particulate inflammation causes greater percentage narrowing of pediatric bronchial passages.\n3. **Developing Alveoli:** Over 80% of alveoli are formed after birth; chronic winter smog exposure stunts irreversible vital capacity.\n\n### Recommended Actions:\n- Transition playtime entirely indoors to a room with HEPA air filtration.\n- Notify school teachers or daycare coordinators to enforce indoor recess.\n- Keep children well hydrated with warm liquids to maintain bronchial mucosal barrier function.`
        : `**Yes, outdoor play is generally acceptable under current conditions.**\n\nAmbient air quality is currently **AQI ${aqi} (${aq.assessment.category})**. However, schedule vigorous sports around midday (12:00 PM – 3:30 PM) when atmospheric mixing is optimal, and avoid heavy-traffic roadways.`,
      citations: [
        'CPCB National Air Quality Advisory (Health Effects Matrix)',
        'WHO 2021 Global Air Quality Guidelines - Children Pulmonary Vulnerability',
        'American Academy of Pediatrics (AAP) Pediatric Environmental Health',
      ],
      actionTips: [
        'Keep children indoors with mechanical HEPA filtration',
        'Avoid strenuous aerobic exertion outdoor sports',
        'If transit is necessary, equip with a properly sealed child-sized N95/KN95 respirator',
      ],
      disclaimer: 'Educational health advice based on CPCB and WHO environmental criteria. Consult your pediatrician for asthma action plans.',
      provider: 'BreatheWise Expert Environmental Engine (Deterministic Rule Layer)',
    };
  }

  // Question 2: Windows / Ventilation
  if (q.includes('window') || q.includes('ventilate') || q.includes('fresh air') || q.includes('open')) {
    return {
      answer: isSevere || isPoor
        ? `**Keep all exterior windows and balcony doors firmly closed right now.**\n\n### Why Keeping Windows Closed is Critical Now:\nOutdoor particulate concentration is **${pm25} µg/m³ PM2.5**. In winter, cooler dense air traps vehicular exhaust, road dust, and smoke close to the surface (thermal inversion).\n\nOpening windows during this period rapidly saturates your living space with toxic particulates, forcing your lungs and air purifiers to work significantly harder.\n\n### How to Handle Indoor Stale Air / CO2:\n- Run kitchen range hoods or bathroom exhaust for localized moisture and cooking smoke removal.\n- If the indoor room feels stuffy, wait until **1:30 PM – 3:00 PM** when solar warming raises the inversion ceiling, open opposite windows for **10 minutes max**, then seal and run your air purifier on High.`
        : `**You can safely open windows for cross-ventilation right now.**\n\nOutdoor air quality is **AQI ${aqi} (${aq.assessment.category})**, which is favorable. Open opposite windows for 20–30 minutes to purge accumulated carbon dioxide, indoor moisture, and volatile organic compounds (VOCs).`,
      citations: [
        'US EPA Guide to Air Cleaners and Ventilation in the Home',
        'ASHRAE 62.2 Indoor Air Quality Ventilation Standards',
      ],
      actionTips: [
        'Keep exterior windows sealed during morning and evening rush hours',
        'Use door draft stoppers or weather stripping on loose window frames',
        'Rely on localized kitchen exhausts rather than whole-house open windows',
      ],
      disclaimer: 'Ventilation recommendations are tailored to ambient outdoor particulate sensors and meteorological boundary data.',
      provider: 'BreatheWise Expert Environmental Engine (Deterministic Rule Layer)',
    };
  }

  // Question 3: Sudden Spike to 400 AQI / Emergency
  if (q.includes('400') || q.includes('spike') || q.includes('emergency') || q.includes('hazardous')) {
    return {
      answer: `### Immediate Emergency Protocol for AQI 400+ (Severe Smog Event):\n\nWhen AQI reaches 400+, particulate concentrations enter the **Emergency / Severe Public Health Hazard** category. Follow these five immediate steps:\n\n1. **Establish a Clean Air Sanctuary Room:**\n   Pick a single bedroom with the tightest doors and windows. Move your air purifier there, shut all interior and exterior doors, and set the purifier to Maximum / Turbo speed.\n\n2. **Suspend All Outdoor Exposure:**\n   Cancel all outdoor recreation, morning jogs, neighborhood walks, and unnecessary market errands. Vulnerable members (seniors, asthmatics, pregnant women) must stay inside.\n\n3. **Mandatory N95 Masking for Essential Commutes:**\n   Cloth and standard 3-ply surgical masks offer virtually zero protection against ultrafine PM2.5. Only snug, well-fitted **N95, FFP2, or KF94 respirators** filter particles down to 0.3 microns.\n\n4. **Eliminate All Indoor Combustion:**\n   Zero incense burning (agarbatti), zero scented candles, no deep oil frying, and avoid lighting gas heaters in unventilated rooms.\n\n5. **Monitor Warning Signs:**\n   Watch for wheezing, chest tightness, persistent dry coughing, or shortness of breath. Seek emergency medical attention if rescue inhalers fail to provide relief.`,
      citations: [
        'CPCB Graded Response Action Plan (GRAP Stage IV Protocol)',
        'Indian Council of Medical Research (ICMR) Air Pollution Health Advisory',
        'US EPA AirNow Emergency Air Quality Action Guidelines',
      ],
      actionTips: [
        'Seal the primary bedroom as a Clean Air Sanctuary with HEPA filtration',
        'Wear certified N95 respirators with tight facial seal for any outdoor movement',
        'Eliminate indoor incense, frying smoke, and candle burning completely',
        'Ensure prescription rescue inhalers are readily accessible',
      ],
      disclaimer: 'Severe smog poses acute cardiovascular and pulmonary risks. Seek medical help immediately if experiencing severe breathing distress.',
      provider: 'BreatheWise Expert Environmental Engine (Deterministic Rule Layer)',
    };
  }

  // Question 4: Elderly family protection
  if (q.includes('elderly') || q.includes('senior') || q.includes('grandparent') || q.includes('heart') || q.includes('asthma')) {
    return {
      answer: `### Protecting Elderly and High-Risk Family Members During Smog Episodes:\n\nWith an ambient AQI of **${aqi} (${aq.assessment.category})**, older adults face elevated risk due to physiological aging of the lung parenchyma and underlying vascular conditions.\n\n### Clinical Impact of PM2.5 on Seniors:\n- Fine particulates cross the alveolar membrane directly into the bloodstream, triggering vascular oxidative stress and arterial constriction, which elevates blood pressure and cardiac event risk.\n\n### Actionable Protection Plan:\n1. **Relocate Daily Walks Indoors:** Replace outdoor morning strolls with light walking in a corridor or living room with filtered air.\n2. **Nocturnal Air Quality:** Seniors should sleep in a bedroom where an air purifier runs continuously on sleep/quiet mode.\n3. **Medication Adherence:** Ensure high-blood-pressure and pulmonary maintenance medications (e.g., bronchodilator inhalers) are taken precisely as prescribed by their physician.\n4. **Maintain Optimal Humidity:** Keep room humidity at 45%–50%. Extremely dry winter heating can irritate aged mucus membranes.\n5. **Hydration & Warm Fluids:** Regular warm water or herbal infusions soothe throat dryness caused by sulfur dioxide and ozone traces.`,
      citations: [
        'American Heart Association (AHA) Scientific Statement: Particulate Matter Air Pollution and Cardiovascular Disease',
        'CPCB Guidelines for Sensitive & Elderly Populations',
      ],
      actionTips: [
        'Move physical walking indoors to filtered spaces',
        'Ensure continuous bedroom HEPA air filtration during overnight sleep',
        'Strict adherence to daily cardiovascular and pulmonary prescriptions',
      ],
      disclaimer: 'This guidance supports preventive environmental protection. It does not replace guidance from a cardiologist or pulmonologist.',
      provider: 'BreatheWise Expert Environmental Engine (Deterministic Rule Layer)',
    };
  }

  // Question 5: Limited budget / Affordable options
  if (q.includes('budget') || q.includes('cheap') || q.includes('cost') || q.includes('affordable') || q.includes('money')) {
    return {
      answer: `### Maximum Air Quality Protection on a Limited Budget:\n\nYou do not need expensive luxury appliances to significantly reduce your family's smog exposure. Here are evidence-based, low-cost interventions:\n\n1. **Build a DIY Corsi-Rosenthal Box (~$25–$35 / ₹2,000–₹3,000):**\n   Mount a standard MERV-13 furnace filter or automotive HEPA filter to the intake side of an inexpensive box fan or pedestal fan using duct tape. Independent university tests demonstrate CADR (Clean Air Delivery Rate) comparable to $300 commercial units.\n\n2. **Draft Proofing with Rolled Towels & Foam Tape ($2 / ₹150):**\n   Place rolled damp towels or foam weatherstripping at the bottom gap of entrance doors and around drafty window edges to stop outdoor particulate infiltration.\n\n3. **Damp Mopping Instead of Sweeping ($0):**\n   Dry broom sweeping resuspends settled toxic PM2.5 and heavy metals back into your breathing zone for hours. Use a damp cloth or microfiber mop to trap and discard dust permanently.\n\n4. **Certified N95 / FFP2 Masks ($0.50 / ₹40 each):**\n   N95 masks can be reused safely 4–5 times if stored in a breathable paper bag between uses and the elastic straps maintain a tight seal.\n\n5. **Zero-Cost Indoor Pollution Elimination ($0):**\n   Stop burning agarbatti (incense), eliminate mosquito coils, and cover pans during stovetop cooking with exhaust running.`,
      citations: [
        'UC Davis & EPA Corsi-Rosenthal Box Filtration Efficacy Studies',
        'CDC/NIOSH Extended Use and Reuse of N95 Respirators Guidelines',
      ],
      actionTips: [
        'Construct a low-cost DIY box fan with MERV-13 filter',
        'Seal bottom door gaps with weather tape or rolled towels',
        'Clean surfaces with damp mopping; never dry broom sweep indoors',
      ],
      disclaimer: 'Low-cost physical barrier and filtration measures are scientifically validated for particulate reduction.',
      provider: 'BreatheWise Expert Environmental Engine (Deterministic Rule Layer)',
    };
  }

  // Question 6: Explain PM2.5 like I am 10 years old
  if (q.includes('10 years old') || q.includes('child') || q.includes('explain pm2.5') || q.includes('simple')) {
    return {
      answer: `### Imagine a Single Strand of Hair on Your Head!\n\nLook closely at a single hair from your head. It looks super skinny, right? \n\nNow imagine splitting that one hair into **30 tiny slices**! \n\nOne of those tiny invisible slices is the size of **PM2.5**! 😮\n\n### Why Does Something So Tiny Matter?\n- **The Big Dust (PM10):** When you breathe in regular dirt or sand, the little hairs inside your nose (cilia) catch them and make you sneeze or blow your nose.\n- **The Super-Tiny Dust (PM2.5):** Because PM2.5 is so microscopically tiny, it sneaks right past your nose hairs, travels down your windpipe, and lands deep inside your lungs where your body takes in oxygen!\n\n### Where Does It Come From?\nIn winter, PM2.5 comes from car exhaust pipes, factory smoke, and people burning dry leaves or wood. When cold winter air acts like a heavy blanket over the city, that smoke gets trapped right where we walk and play!\n\n### What Can You Do?\nWhen the BreatheWise app shows an **Orange or Red** face, wear your special superhero N95 mask outside, and play cool games inside where the air purifier keeps the air fresh and clean!`,
      citations: [
        'US EPA Particulate Matter (PM) Basics for Students',
        'NASA Earth Observatory - Aerosols and Particulates Educational Primer',
      ],
      actionTips: [
        'Think of PM2.5 as invisible dust 30 times thinner than human hair',
        'Wear an N95 superhero mask when outside in smog',
        'Enjoy indoor games when the air quality color is orange or red',
      ],
      disclaimer: 'Educational simplification for children and science learning.',
      provider: 'BreatheWise Expert Environmental Engine (Deterministic Rule Layer)',
    };
  }

  // Question 7: Why is pollution so severe in winter?
  if (q.includes('winter') || q.includes('why') || q.includes('severe in my city') || q.includes('inversion')) {
    return {
      answer: `### The Science of Severe Winter Smog (Thermal Inversion & Stagnation):\n\nWinter smog in cities like Delhi, Lahore, Beijing, or salt-lake valleys is driven by a combination of atmospheric physics and concentrated urban emissions:\n\n1. **Thermal Inversion (The Atmospheric "Lid"):**\n   Normally, warm air near the ground rises into the cooler upper atmosphere, carrying pollutants away with it. In winter, the ground cools rapidly overnight. This creates a layer of cold, heavy air trapped underneath a warmer layer above. This inversion acts like a giant glass lid over the city, trapping all emissions close to the ground.\n\n2. **Low Planetary Boundary Layer (PBL):**\n   During summer, the mixing height reaches 2,000 to 3,000 meters. In winter, the PBL drops as low as **100 to 200 meters**, compressing the same volume of daily emissions into a space 10 times smaller.\n\n3. **Calm Wind Speeds (Stagnation):**\n   Winter weather is dominated by anticyclonic high-pressure systems with near-zero surface wind speeds (< 5 km/h), preventing horizontal dispersion.\n\n4. **Seasonal Emission Spikes:**\n   - Increased vehicle cold-starts.\n   - Open biomass and waste burning for warmth.\n   - Agricultural post-harvest stubble clearing in regional hinterlands.\n   - Brick kilns and thermal power generating stations.`,
      citations: [
        'India Meteorological Department (IMD) Winter Inversion Dynamics Report',
        'CPCB Atmospheric Dispersion and Planetary Boundary Layer Studies',
        'Nature Climate Change - Urban Wintertime Meteorological Stagnation',
      ],
      actionTips: [
        'Anticipate peak smog hours during early mornings and late nights',
        'Support community bans on open waste burning',
        'Use the BreatheWise daily planner to time necessary outdoor transitions',
      ],
      disclaimer: 'Meteorological and atmospheric science explanation based on IMD and environmental studies.',
      provider: 'BreatheWise Expert Environmental Engine (Deterministic Rule Layer)',
    };
  }

  // Default General Advice
  return {
    answer: `### Personalized Guidance for ${profile.location.city}:\n\nCurrent environmental readings indicate **AQI ${aqi} (${aq.assessment.category})** with PM2.5 at **${pm25} µg/m³**.\n\n${aq.assessment.generalAdvisory}\n\n### Key Considerations for Your Household:\n- **Household Vulnerability:** With ${profile.familyMembersCount} family members including ${profile.childrenCount} child(ren) and ${profile.elderlyCount} senior(s), preventive indoor protection should take priority.\n- **Ventilation Status:** ${aq.assessment.windowsRecommended ? 'Natural ventilation is safe.' : 'Keep exterior windows closed; run HEPA air filtration.'}\n- **Mask Guidance:** ${aq.assessment.maskRecommended ? 'Certified N95/FFP2 respirators strongly recommended when outside.' : 'Masking optional under current particulate readings.'}\n\nFeel free to ask specific questions about your daily commute, indoor filtration setup, or safe exercise timing!`,
    citations: ['CPCB NAQI Standards', 'WHO Global Air Quality Guidelines 2021'],
    actionTips: [
      `Maintain indoor particulate levels below 25 µg/m³ using HEPA filtration`,
      `Track the hourly forecast curve before planning outdoor travel`,
    ],
    disclaimer: 'BreatheWise provides educational decision-support tools. Consult a healthcare provider for any respiratory distress.',
    provider: 'BreatheWise Expert Environmental Engine (Deterministic Rule Layer)',
  };
}
