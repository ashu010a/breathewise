import { AirQualityData, HouseholdProfile, SmartDailyRoutine, RoutineActionItem, IndoorAirGuidance, SustainableAlternative } from '../types';
import { EMISSION_FACTORS } from '../constants';

export function generateSmartDailyRoutine(
  aq: AirQualityData,
  profile: HouseholdProfile
): SmartDailyRoutine {
  const aqi = aq.assessment.value;
  const isSevere = aqi >= 300 || aq.pollutants.pm25 >= 120;
  const isPoor = aqi >= 200 || aq.pollutants.pm25 >= 90;
  const isModerate = aqi >= 100;
  const hasVulnerable = profile.hasSensitiveMembers || profile.childrenCount > 0 || profile.elderlyCount > 0;

  // Morning Actions
  const morning: RoutineActionItem[] = [];

  // Morning Exercise
  if (isSevere || isPoor) {
    morning.push({
      id: 'm-exercise-indoor',
      timeOfDay: 'morning',
      title: 'Switch to Indoor Aerobics or Yoga',
      action: 'Cancel all outdoor jogging, walking, or park exercise. Exercise in a closed room with air purifier running.',
      whyRecommended: `Morning thermal inversion has trapped fine particulates (PM2.5: ${aq.pollutants.pm25} µg/m³). Deep breathing during outdoor exercise increases alveolar particulate deposition by up to 400%.`,
      triggerCondition: `AQI ${aqi} (${aq.assessment.category}) with stagnant morning boundary layer`,
      benefit: 'Prevents acute airway inflammation, bronchospasm, and cardiovascular strain.',
      effortLevel: 'low',
      costEstimate: 'free',
    });
  } else if (isModerate) {
    morning.push({
      id: 'm-exercise-moderate',
      timeOfDay: 'morning',
      title: 'Moderate Low-Intensity Morning Exercise',
      action: 'Keep outdoor exercise brisk but avoid intense HIIT training. Consider wearing an N95 if jogging near major roadways.',
      whyRecommended: `Moderate air pollution (${aq.assessment.category}) can cause airway irritation in sensitive individuals.`,
      triggerCondition: `AQI ${aqi} Moderate level`,
      benefit: 'Maintains cardiovascular fitness while minimizing pollutant intake.',
      effortLevel: 'medium',
      costEstimate: 'free',
    });
  } else {
    morning.push({
      id: 'm-exercise-good',
      timeOfDay: 'morning',
      title: 'Outdoor Morning Activity Permitted',
      action: 'Safe for morning jogging, walking, and outdoor sports.',
      whyRecommended: `Air quality is ${aq.assessment.category}. Atmospheric dispersion is favorable.`,
      triggerCondition: `AQI ${aqi} (${aq.assessment.category})`,
      benefit: 'Cardiovascular health and natural Vitamin D exposure.',
      effortLevel: 'low',
      costEstimate: 'free',
    });
  }

  // Morning Ventilation & Windows
  if (isPoor || isSevere) {
    morning.push({
      id: 'm-windows-closed',
      timeOfDay: 'morning',
      title: 'Keep Windows and Balcony Doors Sealed',
      action: 'Keep exterior windows firmly closed between 6:00 AM and 11:00 AM. Run HEPA filtration in bedrooms.',
      whyRecommended: 'Morning smog concentration peaks due to commuter traffic and nocturnal inversion trapping.',
      triggerCondition: `Outdoor PM2.5 is ${aq.pollutants.pm25} µg/m³, exceeding safe indoor limits by multiple times.`,
      benefit: 'Reduces indoor particulate infiltration by 60–80%.',
      effortLevel: 'low',
      costEstimate: 'free',
    });
  }

  // Morning Commute
  if (profile.commuteMode === 'two_wheeler' || profile.commuteMode === 'walk') {
    if (isPoor || isSevere) {
      morning.push({
        id: 'm-commute-protect',
        timeOfDay: 'morning',
        title: 'Wear Certified N95/FFP2 Mask During Commute',
        action: 'Wear a well-fitted N95/KN95 respirator mask with snug nasal wire. If possible, opt for the metro or carpool.',
        whyRecommended: 'Two-wheeler and pedestrian commuters experience direct tailpipe exhaust and suspended road dust.',
        triggerCondition: 'Severe particulate matter on transit corridors.',
        benefit: 'Filters at least 95% of airborne fine particulates (0.3 µm).',
        effortLevel: 'low',
        costEstimate: 'low',
      });
    }
  } else if (profile.commuteMode === 'private_car') {
    morning.push({
      id: 'm-car-recirculate',
      timeOfDay: 'morning',
      title: 'Set Vehicle Cabin AC to Recirculation Mode',
      action: 'Press the cabin air recirculation button. Ensure the car cabin pollen/HEPA filter was serviced recently.',
      whyRecommended: 'Drawing outside air into the car cabin pulls toxic NO2 and diesel particulates directly into breathing space.',
      triggerCondition: `High ambient particulate levels along traffic arterials`,
      benefit: 'Reduces in-cabin PM2.5 levels by over 75% within 5 minutes.',
      effortLevel: 'low',
      costEstimate: 'free',
    });
  }

  // Afternoon Actions
  const afternoon: RoutineActionItem[] = [];

  // Schoolchildren / work recommendation
  if (profile.childrenCount > 0 && (isPoor || isSevere)) {
    afternoon.push({
      id: 'a-children-indoor',
      timeOfDay: 'afternoon',
      title: 'Request Indoor Play for School & Recess',
      action: 'Advise children to spend lunch breaks and physical education in indoor halls rather than open dusty sports fields.',
      whyRecommended: "Children breathe more air per kilogram of body weight than adults and have developing lung tissue.",
      triggerCondition: `AQI ${aqi} exceeding safe thresholds for pediatric pulmonary health`,
      benefit: 'Prevents acute asthma flares and exercise-induced cough.',
      effortLevel: 'medium',
      costEstimate: 'free',
    });
  }

  // Afternoon ventilation check
  if (!isSevere && aq.pollutants.pm25 < 80) {
    afternoon.push({
      id: 'a-ventilation-burst',
      timeOfDay: 'afternoon',
      title: 'Short 15-Minute Cross-Ventilation Flush',
      action: 'Open opposite windows briefly between 1:00 PM and 2:30 PM to purge indoor CO2 and cooking moisture, then seal and re-purify.',
      whyRecommended: 'Solar heating elevates the mixing height in mid-afternoon, making pollution concentrations relatively lower.',
      triggerCondition: 'Midday solar mixing improves surface dispersion.',
      benefit: 'Lowers indoor carbon dioxide and VOCs without letting excessive smog accumulate.',
      effortLevel: 'low',
      costEstimate: 'free',
    });
  } else {
    afternoon.push({
      id: 'a-stay-hydrated',
      timeOfDay: 'afternoon',
      title: 'Hydration & Mucosal Barrier Support',
      action: 'Drink warm water, herbal tea, and maintain indoor humidity between 40% and 55% using a clean cool-mist humidifier if dry.',
      whyRecommended: 'Winter smog dry air parches airway mucus membranes, reducing natural cilia particle clearance.',
      triggerCondition: `Dry winter air with elevated particulate pollution`,
      benefit: 'Enhances respiratory mucociliary clearance of inhaled particulate matter.',
      effortLevel: 'low',
      costEstimate: 'free',
    });
  }

  // Evening Actions
  const evening: RoutineActionItem[] = [];

  // Evening cooking practices
  evening.push({
    id: 'e-kitchen-exhaust',
    timeOfDay: 'evening',
    title: 'Run Kitchen Exhaust 15 Mins Post-Cooking',
    action: 'Cover pans with lids during frying/sautéing, run exhaust chimney at maximum, and keep kitchen doors closed from living areas.',
    whyRecommended: 'High-heat oil frying generates ultrafine PM2.5 exceeding 400 µg/m³ inside unventilated kitchens.',
    triggerCondition: 'Evening domestic cooking peak in sealed homes.',
    benefit: 'Prevents cooking fumes from contaminating bedrooms.',
    effortLevel: 'low',
    costEstimate: 'free',
  });

  // Sensitive group evening check
  if (hasVulnerable && (isPoor || isSevere)) {
    evening.push({
      id: 'e-vulnerable-indoors',
      timeOfDay: 'evening',
      title: 'Keep Elderly and Asthmatic Members Indoors',
      action: 'Avoid evening neighborhood strolls between 6:30 PM and 9:30 PM when nocturnal inversion begins.',
      whyRecommended: 'Cooling evening ground causes temperature inversion, trapping vehicle emissions and cooking smoke at chest height.',
      triggerCondition: `Rapid evening cooling with falling atmospheric boundary layer`,
      benefit: 'Protects vulnerable family members from peak evening smog exposure.',
      effortLevel: 'low',
      costEstimate: 'free',
    });
  }

  // Night Actions
  const night: RoutineActionItem[] = [];

  // Bedroom sanctuary preparation
  night.push({
    id: 'n-bedroom-purifier',
    timeOfDay: 'night',
    title: 'Establish Bedroom Clean Air Sanctuary',
    action: profile.hasIndoorAirPurifier
      ? 'Turn bedroom air purifier to Sleep or Medium mode at least 45 minutes before sleep with door closed.'
      : 'Keep bedroom door closed, clean dust surfaces with damp cloth, and block door drafts with a rolled towel.',
    whyRecommended: 'Humans spend 7–9 continuous hours in the bedroom; clean night air allows alveolar and bronchial recovery.',
    triggerCondition: 'Overnight accumulation of fine particulates indoors.',
    benefit: 'Reduces nocturnal cough, improves deep sleep quality, and lowers systemic inflammation.',
    effortLevel: 'low',
    costEstimate: profile.hasIndoorAirPurifier ? 'free' : 'low',
  });

  // Next-day forecast preparation
  night.push({
    id: 'n-forecast-prep',
    timeOfDay: 'night',
    title: 'Review Tomorrow Morning Smog Outlook',
    action: `Tomorrow's forecast indicates ${aq.dailyForecasts[0]?.dominantCategory || 'Unfavorable'} conditions. Prepare N95 masks and plan departure times.`,
    whyRecommended: 'Early preparation prevents rushed commutes and unprotected exposure.',
    triggerCondition: 'Upcoming 24-hour meteorological smog advisory.',
    benefit: 'Smooth morning routine with minimum pollution exposure.',
    effortLevel: 'low',
    costEstimate: 'free',
  });

  let summary = 'Moderate air quality: take sensible precautions during outdoor transit.';
  if (isSevere) {
    summary = `Severe Smog Advisory (AQI ${aqi}): Strict indoor protection protocol active for ${profile.familyName}. Keep purifiers running.`;
  } else if (isPoor) {
    summary = `Poor Air Quality Alert (AQI ${aqi}): Outdoor physical exertion restricted. N95 masks recommended outside.`;
  } else if (aqi <= 100) {
    summary = `Clean Air Window (AQI ${aqi}): Favorable conditions for outdoor recreation and home ventilation.`;
  }

  return {
    date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
    summary,
    morning,
    afternoon,
    evening,
    night,
  };
}

export function generateIndoorGuidance(
  aq: AirQualityData,
  profile: HouseholdProfile
): IndoorAirGuidance {
  const aqi = aq.assessment.value;
  const isSevere = aqi >= 300 || aq.pollutants.pm25 >= 120;
  const isPoor = aqi >= 200 || aq.pollutants.pm25 >= 90;

  // Ventilation window analysis
  const canOpen = !isPoor && !isSevere && aq.pollutants.pm25 < 60;
  let recommendedHoursText = 'Keep sealed during morning and evening rush hours. Best slot: 1:30 PM - 3:00 PM for 10-15 minutes max.';
  let reasoning = 'Outdoor PM2.5 is high; opening windows will cause rapid indoor contamination.';

  if (canOpen) {
    recommendedHoursText = '11:00 AM - 4:00 PM (Solar heating maximizes vertical dispersion)';
    reasoning = `Outdoor air is ${aq.assessment.category} (PM2.5: ${aq.pollutants.pm25} µg/m³). Fresh air exchange will reduce indoor CO2 without harmful particulate buildup.`;
  } else if (isSevere) {
    recommendedHoursText = 'Windows should remain fully closed throughout the day.';
    reasoning = `Severe outdoor smog (PM2.5: ${aq.pollutants.pm25} µg/m³). Natural ventilation must be suspended in favor of mechanical HEPA recirculation.`;
  }

  // HEPA guidance
  const hepaFiltrationAdvice = {
    recommendedSpeed: isSevere ? 'High / Turbo for 1 hour, then continuous Medium' : isPoor ? 'Continuous Medium / Auto' : 'Low / Sleep mode',
    runtimeHours: isSevere ? '20 - 24 hours (continuous)' : isPoor ? '14 - 18 hours' : '8 - 10 hours',
    filterConditionNotice: 'Vacuum pre-filter mesh every 2 weeks to extend HEPA life. Replace True HEPA H13 cartridge when airflow drops or after 6 months of winter smog.',
  };

  // Kitchen tips
  const kitchenGuidance = [
    'Always switch on the exhaust chimney or window exhaust fan 2 minutes before igniting burners.',
    'Keep exhaust running for at least 10–15 minutes after cooking finishes to remove invisible ultrafine aerosols.',
    'Use covered lids on pots and frying pans to contain splatter and oil vaporization.',
    'Prefer boiling, steaming, or pressure cooking over open charring, deep frying, or high-smoke grilling.',
    'If using LPG gas, ensure blue flame (complete combustion); yellow/orange flame emits hazardous carbon monoxide.',
  ];

  // Room specific
  const roomSpecificTips = [
    {
      roomType: 'Primary Bedroom (Clean Air Sanctuary)',
      tips: [
        'Place air purifier at least 1 meter away from walls and near breathing zone height.',
        'Install weather-stripping or draft-stopper snakes at the bottom of the bedroom door.',
        'Avoid dry dusting or vigorous broom sweeping; use damp microfiber mops to prevent resuspending settled PM2.5.',
        'Keep pets out of the bedroom during severe winter smog episodes to minimize allergen load.',
      ],
    },
    {
      roomType: 'Living Room & Entryway',
      tips: [
        'Place a heavy doormat outside and inside; adopt a strict shoes-off policy at the doorway.',
        'Avoid synthetic room fresheners, incense sticks (agarbatti), and mosquito coils (one coil emits PM2.5 equivalent to 75 cigarettes).',
        'Clean air intake vents and ceiling fan blades with a damp cloth monthly.',
      ],
    },
    {
      roomType: 'Children & Elderly Rooms',
      tips: [
        'Ensure continuous air filtration with low noise levels so sleep is undisturbed.',
        'Maintain room temperature between 20°C and 23°C to prevent bronchoconstriction.',
        'Keep prescribed rescue inhalers or medication easily accessible in bedside drawers.',
      ],
    },
  ];

  // Critical Safety Warnings
  const criticalSafetyWarnings = [
    'NEVER use "Ozone Generators", "Ozone Air Purifiers", or Ionizers that emit ozone as a byproduct. Ozone is a potent lung irritant that damages epithelial tissue.',
    'NEVER burn mosquito coils, candles, or incense in closed rooms. They emit high concentrations of benzene, toluene, and particulate matter.',
    'Do NOT use unvented kerosene or gas heaters in closed bedrooms due to deadly Carbon Monoxide (CO) poisoning risks.',
    'Do NOT rely on cheap washable sponge filters alone for PM2.5. True particulate protection requires certified HEPA (H13 or MERV-13) or well-constructed DIY Corsi-Rosenthal boxes.',
  ];

  return {
    safeVentilationWindow: {
      canOpenWindowsNow: canOpen,
      recommendedHoursText,
      reasoning,
    },
    hepaFiltrationAdvice,
    kitchenGuidance,
    roomSpecificTips,
    criticalSafetyWarnings,
  };
}

export function generateSustainableAlternatives(
  aq: AirQualityData,
  profile: HouseholdProfile
): SustainableAlternative[] {
  const isAqiHazardous = aq.assessment.value >= 250;

  const alternatives: SustainableAlternative[] = [
    {
      id: 'alt-metro-transit',
      category: 'commute',
      currentBehavior: 'Driving a single-occupancy petrol/diesel car for daily urban commute (15 km round trip)',
      suggestedAlternative: 'Switch to AC Metro Rail or Electric Rapid Transit with N95 mask',
      estimatedCostDifference: 'Saves ~$45 / ₹3,200 per month in fuel and parking charges',
      environmentalBenefit: 'Avoids ~2.1 kg of CO2e and 18g of direct NOx/tailpipe PM emissions daily.',
      practicalSteps: [
        'Locate the nearest metro station or rapid transit hub.',
        'Use smart transit card or mobile ticketing for zero queue delays.',
        'Wear an N95 mask during platform transitions and first/last mile walking.',
      ],
      estimatedCo2eSavingsKg: 2.1,
      applicabilityNote: isAqiHazardous
        ? 'Safe because modern metro coaches feature multi-stage in-cabin filtration and air conditioning.'
        : 'Highly recommended for daily commute efficiency.',
    },
    {
      id: 'alt-remote-work',
      category: 'commute',
      currentBehavior: 'Daily 25 km round-trip highway office commute',
      suggestedAlternative: 'Request 2 days of Remote Work (WFH) weekly during Winter Smog Emergency',
      estimatedCostDifference: 'Saves ~$60 / ₹4,500 monthly in transit costs and 2 hours daily commute time',
      environmentalBenefit: 'Avoids 4.25 kg CO2e per remote work day and completely eliminates personal traffic exposure.',
      practicalSteps: [
        'Share local municipal air quality advisories with team leads or HR.',
        'Shift deep-focus tasks and asynchronous reporting to WFH days.',
      ],
      estimatedCo2eSavingsKg: 4.25,
      applicabilityNote: 'Directly protects health during severe winter inversion episodes while reducing city road congestion.',
    },
    {
      id: 'alt-clean-cooking',
      category: 'cooking_heating',
      currentBehavior: 'Using biomass, coal chulha, or open kerosene heating',
      suggestedAlternative: 'Switch to Electric Induction Cooktop and Star-Rated Oil-Filled Electric Radiator',
      estimatedCostDifference: 'Moderate initial equipment cost, 30% lower operating cost than refill canisters',
      environmentalBenefit: 'Avoids ~1.85 kg CO2e per day and eliminates toxic indoor carbon monoxide & black carbon.',
      practicalSteps: [
        'Procure a standard 1800W induction cooktop with flat stainless-steel or cast cookware.',
        'Use programmable timers to prevent dry burning.',
      ],
      estimatedCo2eSavingsKg: 1.85,
      applicabilityNote: 'Essential for respiratory safety in homes with young children and elderly residents.',
    },
    {
      id: 'alt-zero-waste-burning',
      category: 'waste_consumption',
      currentBehavior: 'Open burning of dry leaves, garden clippings, or domestic plastic waste in neighborhood',
      suggestedAlternative: 'Aerobic backyard composting and municipal segregated dry recycling',
      estimatedCostDifference: 'Free. Yields rich organic compost for plants',
      environmentalBenefit: 'Avoids up to 1.45 kg CO2e and dioxins/furans per kg of waste.',
      practicalSteps: [
        'Segregate wet kitchen greens from dry brown paper and garden foliage.',
        'Deposit garden trimmings in community composting pits instead of lighting fires.',
        'Report open municipal fires through local pollution control board apps (e.g., Sameer App in India).',
      ],
      estimatedCo2eSavingsKg: 2.9,
      applicabilityNote: 'Open waste burning is illegal in major metropolitan areas and is a leading trigger of winter smog spikes.',
    },
    {
      id: 'alt-energy-conservation',
      category: 'energy',
      currentBehavior: 'Leaving electric room heaters and geysers on high temperature continuously',
      suggestedAlternative: 'Install plug-in timers, drop thermostat by 2°C, and use thermal curtains',
      estimatedCostDifference: 'Reduces monthly electric utility bill by 15–25%',
      environmentalBenefit: 'Saves 3.6 kWh daily, avoiding ~2.6 kg CO2e from thermal power plants.',
      practicalSteps: [
        'Close heavy insulated curtains at sundown to trap radiant warmth.',
        'Set water geysers to 50°C instead of maximum 75°C.',
      ],
      estimatedCo2eSavingsKg: 2.6,
      applicabilityNote: 'Thermal energy conservation lowers peak grid electricity demand during winter months.',
    },
  ];

  return alternatives;
}
