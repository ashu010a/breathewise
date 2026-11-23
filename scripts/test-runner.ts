import assert from 'node:assert/strict';
import { calculateCpcbAqi, calculateUsaAqi, assessAirQuality } from '../src/lib/aqi-standards';
import { generateSmartDailyRoutine, generateIndoorGuidance, generateSustainableAlternatives } from '../src/lib/services/recommendation-engine';
import { calculateTripSavings, calculateEnergySavings, aggregateImpactRecords } from '../src/lib/services/impact-calculator';
import { getAirQuality, PRESET_LOCATIONS } from '../src/lib/services/air-quality-service';
import { generateAiChatResponse } from '../src/lib/services/gemini-client';
import { DEFAULT_HOUSEHOLD_PROFILE } from '../src/lib/constants';

async function runAllTests() {
  console.log('🧪 Running BreatheWise Test Suite...\n');

  // Test 1: AQI Standards & Piecewise Linear Interpolation
  console.log('Test 1: AQI Standards & Interpolation Equations');
  const good = calculateCpcbAqi(20, 35);
  assert.equal(good.category, 'Good');
  assert.ok(good.value <= 50, 'Good AQI should be <= 50');

  const sat = calculateCpcbAqi(45, 75);
  assert.equal(sat.category, 'Satisfactory');
  assert.ok(sat.value > 50 && sat.value <= 100);

  const mod = calculateCpcbAqi(75, 150);
  assert.equal(mod.category, 'Moderate');
  assert.ok(mod.value > 100 && mod.value <= 200);

  const poor = calculateCpcbAqi(105, 280);
  assert.equal(poor.category, 'Poor');
  assert.ok(poor.value > 200 && poor.value <= 300);

  const vPoor = calculateCpcbAqi(180, 380);
  assert.equal(vPoor.category, 'Very Poor');
  assert.ok(vPoor.value > 300 && vPoor.value <= 400);

  const severe = calculateCpcbAqi(280, 480);
  assert.equal(severe.category, 'Severe');
  assert.ok(severe.value > 400);

  // US EPA standard
  const epaGood = calculateUsaAqi(8.0);
  assert.equal(epaGood.category, 'Good');
  const epaUnhealthy = calculateUsaAqi(85.0);
  assert.equal(epaUnhealthy.category, 'Unhealthy');

  // Severe smog safety assessment
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
  console.log('  ✅ CPCB & US EPA calculations verified.\n');

  // Test 2: Recommendation Engine
  console.log('Test 2: Personalized Recommendation Engine');
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
    assessment: severeAssessment,
    altStandardAssessments: {
      IN_CPCB: { value: 420, category: 'Severe' },
      US_EPA: { value: 340, category: 'Hazardous' },
      EU_CAQI: { value: 95, category: 'High' },
    },
    pollutants: {
      pm25: 280,
      pm10: 450,
      no2: 80,
      so2: 25,
      co: 2.5,
      o3: 40,
    },
    hourlyTrends: [],
    dailyForecasts: [
      {
        date: '2026-11-24',
        dayName: 'Tomorrow',
        avgAqi: 360,
        minAqi: 310,
        maxAqi: 410,
        dominantCategory: 'Very Poor' as const,
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

  // Check 5 essential answers for every action item
  for (const item of routine.morning) {
    assert.ok(item.action, 'Action text must exist');
    assert.ok(item.whyRecommended, 'Why recommended must exist');
    assert.ok(item.triggerCondition, 'Trigger condition must exist');
    assert.ok(item.benefit, 'Benefit must exist');
    assert.ok(item.effortLevel, 'Effort level must exist');
    assert.ok(item.costEstimate, 'Cost estimate must exist');
  }

  // Indoor guidance
  const indoor = generateIndoorGuidance(mockSevereAq, DEFAULT_HOUSEHOLD_PROFILE);
  assert.equal(indoor.safeVentilationWindow.canOpenWindowsNow, false, 'Windows must be sealed during severe smog');
  assert.ok(indoor.criticalSafetyWarnings.some(w => w.includes('Ozone Generators')), 'Must forbid ozone generators');

  // Sustainable alternatives
  const alts = generateSustainableAlternatives(mockSevereAq, DEFAULT_HOUSEHOLD_PROFILE);
  assert.ok(alts.length > 0);
  console.log('  ✅ Smart daily routine & indoor safety rules verified.\n');

  // Test 3: Impact Calculation Engine
  console.log('Test 3: Explainable Carbon Impact Engine');
  const trip = calculateTripSavings(15, 'private_car', 'metro');
  assert.ok(trip.co2eAvoidedKg > 2.0 && trip.co2eAvoidedKg < 2.5);
  assert.ok(trip.formula.includes('15 km'));

  const energy = calculateEnergySavings(10, 'India');
  assert.ok(energy.co2eAvoidedKg >= 7.0);

  const initialLogs = [
    {
      id: 'l1',
      date: '2026-11-23',
      category: 'commute' as const,
      actionName: 'Metro trip',
      co2eAvoidedKg: 2.13,
      privateTripsAvoided: 1,
      publicTransitDistanceKm: 15,
      notes: 'Test log',
    },
  ];
  const agg = aggregateImpactRecords(initialLogs, 4);
  assert.equal(agg.userTotalCo2eAvoidedKg, 2.1);
  assert.ok(agg.householdTotalCo2eAvoidedKg > 2.1);
  assert.ok(agg.communityTotalCo2eAvoidedKg > agg.householdTotalCo2eAvoidedKg);
  console.log('  ✅ IPCC emission factors & formulas verified.\n');

  // Test 4: Air Quality Service & Location Presets
  console.log('Test 4: Air Quality Service & Presets');
  assert.ok(PRESET_LOCATIONS.length >= 8);
  const aq = await getAirQuality(28.6139, 77.2090, 'Delhi NCR', 'IN_CPCB');
  assert.ok(aq.pollutants.pm25 > 0);
  assert.ok(aq.pollutants.pm10 > 0);
  assert.ok(aq.assessment.value > 0);
  assert.ok(aq.station.provider);
  console.log(`  ✅ Environmental data service returned AQI ${aq.assessment.value} (${aq.assessment.category}).\n`);

  // Test 5: Conversational AI Intelligence Layer
  console.log('Test 5: Conversational AI Assistant & Domain Knowledge');
  const chatRes1 = await generateAiChatResponse({
    userQuestion: 'Is it safe for my children to play outside today?',
    airQuality: aq,
    profile: DEFAULT_HOUSEHOLD_PROFILE,
    history: [],
    language: 'en',
  });
  assert.ok(chatRes1.answer.length > 50);
  assert.ok(chatRes1.citations.length > 0);
  assert.ok(chatRes1.disclaimer);

  const chatResHindi = await generateAiChatResponse({
    userQuestion: 'क्या मेरे बच्चे आज बाहर खेल सकते हैं?',
    airQuality: aq,
    profile: DEFAULT_HOUSEHOLD_PROFILE,
    history: [],
    language: 'hi',
  });
  assert.ok(chatResHindi.answer.length > 50);
  console.log('  ✅ Conversational assistant & bilingual responses verified.\n');

  console.log('🎉 ALL 5 TEST SUITES PASSED CLEANLY (100% SUCCESS)!');
}

runAllTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
