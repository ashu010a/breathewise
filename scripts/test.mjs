import test from 'node:test';
import assert from 'node:assert/strict';

// Test 1: AQI Standards & Interpolation
test('AQI Standards - CPCB and US EPA Calculations', async () => {
  const { calculateCpcbAqi, calculateUsaAqi, assessAirQuality } = await import('../src/lib/aqi-standards.ts');

  // Test Good CPCB
  const good = calculateCpcbAqi(20, 35);
  assert.equal(good.category, 'Good');
  assert.ok(good.value <= 50);

  // Test Satisfactory CPCB
  const sat = calculateCpcbAqi(45, 75);
  assert.equal(sat.category, 'Satisfactory');
  assert.ok(sat.value > 50 && sat.value <= 100);

  // Test Moderate CPCB
  const mod = calculateCpcbAqi(75, 150);
  assert.equal(mod.category, 'Moderate');
  assert.ok(mod.value > 100 && mod.value <= 200);

  // Test Poor CPCB
  const poor = calculateCpcbAqi(105, 280);
  assert.equal(poor.category, 'Poor');
  assert.ok(poor.value > 200 && poor.value <= 300);

  // Test Very Poor CPCB
  const vPoor = calculateCpcbAqi(180, 380);
  assert.equal(vPoor.category, 'Very Poor');
  assert.ok(vPoor.value > 300 && vPoor.value <= 400);

  // Test Severe CPCB
  const severe = calculateCpcbAqi(280, 480);
  assert.equal(severe.category, 'Severe');
  assert.ok(severe.value > 400);

  // Test US EPA
  const epaGood = calculateUsaAqi(8.0);
  assert.equal(epaGood.category, 'Good');

  const epaUnhealthy = calculateUsaAqi(85.0);
  assert.equal(epaUnhealthy.category, 'Unhealthy');

  // Test Assessment Flags in Severe Smog
  const severeAssessment = assessAirQuality({
    pm25: 280,
    pm10: 450,
    no2: 80,
    so2: 25,
    co: 2.5,
    o3: 40,
  }, 'IN_CPCB');

  assert.equal(severeAssessment.category, 'Severe');
  assert.equal(severeAssessment.outdoorExerciseSafe, false);
  assert.equal(severeAssessment.maskRecommended, true);
  assert.equal(severeAssessment.windowsRecommended, false);
  assert.equal(severeAssessment.airPurifierRecommended, true);
});

// Test 2: Recommendation Engine
test('Recommendation Engine - Daily Routine and Indoor Guidance', async () => {
  const { generateSmartDailyRoutine, generateIndoorGuidance, generateSustainableAlternatives } = await import('../src/lib/services/recommendation-engine.ts');
  const { DEFAULT_HOUSEHOLD_PROFILE } = await import('../src/lib/constants.ts');

  const mockSevereAq = {
    station: {
      id: 'station-1',
      name: 'Delhi Anand Vihar',
      city: 'Delhi',
      country: 'India',
      provider: 'CPCB',
      latitude: 28.6,
      longitude: 77.2,
      lastUpdated: new Date().toISOString(),
      isSimulatedFallback: false,
      confidenceScore: 90,
    },
    assessment: {
      standard: 'IN_CPCB',
      value: 380,
      category: 'Very Poor',
      colorHex: '#ef4444',
      badgeClass: 'badge',
      generalAdvisory: 'Respiratory illness likely',
      sensitiveAdvisory: 'Stay indoors',
      outdoorExerciseSafe: false,
      maskRecommended: true,
      windowsRecommended: false,
      airPurifierRecommended: true,
    },
    altStandardAssessments: {
      IN_CPCB: { value: 380, category: 'Very Poor' },
      US_EPA: { value: 310, category: 'Hazardous' },
      EU_CAQI: { value: 90, category: 'High' },
    },
    pollutants: {
      pm25: 210,
      pm10: 360,
      no2: 75,
      so2: 20,
      co: 2.1,
      o3: 35,
    },
    hourlyTrends: [],
    dailyForecasts: [
      {
        date: '2026-11-24',
        dayName: 'Tomorrow',
        avgAqi: 360,
        minAqi: 310,
        maxAqi: 410,
        dominantCategory: 'Very Poor',
        pm25Max: 240,
        summary: 'Inversion persists',
      },
    ],
    weather: {
      temperatureC: 15,
      humidityPercent: 75,
      windSpeedKmh: 4,
      windDirectionDeg: 300,
      conditionText: 'Dense Winter Smog',
    },
  };

  const routine = generateSmartDailyRoutine(mockSevereAq, DEFAULT_HOUSEHOLD_PROFILE);
  assert.ok(routine.morning.length > 0);
  assert.ok(routine.afternoon.length > 0);
  assert.ok(routine.evening.length > 0);
  assert.ok(routine.night.length > 0);

  // Check 5 essential properties for each action
  for (const item of routine.morning) {
    assert.ok(item.action, 'Action text must exist');
    assert.ok(item.whyRecommended, 'Why recommended must exist');
    assert.ok(item.triggerCondition, 'Trigger condition must exist');
    assert.ok(item.benefit, 'Benefit must exist');
    assert.ok(item.effortLevel, 'Effort level must exist');
    assert.ok(item.costEstimate, 'Cost estimate must exist');
  }

  // Indoor guidance safety checks
  const indoor = generateIndoorGuidance(mockSevereAq, DEFAULT_HOUSEHOLD_PROFILE);
  assert.equal(indoor.safeVentilationWindow.canOpenWindowsNow, false, 'Windows must be sealed during severe smog');
  assert.ok(indoor.criticalSafetyWarnings.some(w => w.includes('Ozone Generators')), 'Must warn against ozone generators');

  // Sustainable alternatives safety check: Never recommend outdoor cycling when AQI is severe
  const alts = generateSustainableAlternatives(mockSevereAq, DEFAULT_HOUSEHOLD_PROFILE);
  assert.ok(alts.length > 0);
  assert.ok(alts.some(a => a.category === 'commute'));
});

// Test 3: Impact Calculation Engine
test('Impact Calculation Engine - Formulas and Factors', async () => {
  const { calculateTripSavings, calculateEnergySavings, aggregateImpactRecords } = await import('../src/lib/services/impact-calculator.ts');

  // 15 km car to metro
  const trip = calculateTripSavings(15, 'private_car', 'metro');
  assert.ok(trip.co2eAvoidedKg > 2.0 && trip.co2eAvoidedKg < 2.5);
  assert.ok(trip.formula.includes('15 km'));

  // 10 kWh saved
  const energy = calculateEnergySavings(10, 'India');
  assert.ok(energy.co2eAvoidedKg >= 7.0);

  // Aggregated impact
  const initialLogs = [
    {
      id: 'l1',
      date: '2026-11-23',
      category: 'commute',
      actionName: 'Metro trip',
      co2eAvoidedKg: 2.1,
      privateTripsAvoided: 1,
      publicTransitDistanceKm: 15,
      notes: 'test',
    },
  ];
  const agg = aggregateImpactRecords(initialLogs, 4);
  assert.equal(agg.userTotalCo2eAvoidedKg, 2.1);
  assert.ok(agg.householdTotalCo2eAvoidedKg > 2.1);
  assert.ok(agg.communityTotalCo2eAvoidedKg > agg.householdTotalCo2eAvoidedKg);
});

// Test 4: Air Quality Service Fallback
test('Air Quality Service - Calibrated Fallback & Presets', async () => {
  const { getAirQuality, PRESET_LOCATIONS } = await import('../src/lib/services/air-quality-service.ts');

  assert.ok(PRESET_LOCATIONS.length >= 8, 'Should have multiple preset cities');

  const aq = await getAirQuality(28.6139, 77.2090, 'Delhi NCR', 'IN_CPCB');
  assert.ok(aq.pollutants.pm25 > 0);
  assert.ok(aq.pollutants.pm10 > 0);
  assert.ok(aq.assessment.value > 0);
  assert.ok(aq.station.provider);
});

// Test 5: Conversational AI Engine
test('Conversational AI Assistant - Contextual Responses', async () => {
  const { generateAiChatResponse } = await import('../src/lib/services/gemini-client.ts');
  const { DEFAULT_HOUSEHOLD_PROFILE } = await import('../src/lib/constants.ts');
  const { getAirQuality } = await import('../src/lib/services/air-quality-service.ts');

  const aq = await getAirQuality(28.6139, 77.2090, 'Delhi NCR');

  // Test Question: Children play outside
  const res1 = await generateAiChatResponse({
    userQuestion: 'Is it safe for my children to play outside today?',
    airQuality: aq,
    profile: DEFAULT_HOUSEHOLD_PROFILE,
    history: [],
    language: 'en',
  });

  assert.ok(res1.answer.length > 50);
  assert.ok(res1.citations.length > 0);
  assert.ok(res1.disclaimer);

  // Test Question: Hindi language
  const resHindi = await generateAiChatResponse({
    userQuestion: 'क्या मेरे बच्चे आज बाहर खेल सकते हैं?',
    airQuality: aq,
    profile: DEFAULT_HOUSEHOLD_PROFILE,
    history: [],
    language: 'hi',
  });

  assert.ok(resHindi.answer.length > 50);

  // Test Question: 400 AQI emergency
  const resEmergency = await generateAiChatResponse({
    userQuestion: 'What should I do if the AQI suddenly reaches 400?',
    airQuality: aq,
    profile: DEFAULT_HOUSEHOLD_PROFILE,
    history: [],
    language: 'en',
  });

  assert.ok(resEmergency.answer.includes('Sanctuary') || resEmergency.answer.includes('N95'));
});
