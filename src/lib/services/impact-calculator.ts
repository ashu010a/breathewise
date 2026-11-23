import { EMISSION_FACTORS } from '../constants';
import { ImpactRecord, AggregatedImpact } from '../types';

export function calculateTripSavings(
  distanceKm: number,
  fromMode: 'private_car' | 'two_wheeler' | 'diesel_car',
  toMode: 'metro' | 'bus' | 'walk_bike' | 'none_wfh'
): { co2eAvoidedKg: number; formula: string } {
  let baseFactor = EMISSION_FACTORS.PETROL_CAR_PER_KM;
  if (fromMode === 'diesel_car') baseFactor = EMISSION_FACTORS.DIESEL_CAR_PER_KM;
  if (fromMode === 'two_wheeler') baseFactor = EMISSION_FACTORS.TWO_WHEELER_PETROL_PER_KM;

  let targetFactor = 0;
  if (toMode === 'metro') targetFactor = EMISSION_FACTORS.METRO_RAIL_PER_KM;
  if (toMode === 'bus') targetFactor = EMISSION_FACTORS.BUS_TRANSIT_PER_KM;
  if (toMode === 'walk_bike' || toMode === 'none_wfh') targetFactor = 0;

  const avoidedPerKm = Math.max(0, baseFactor - targetFactor);
  const totalAvoided = Math.round(distanceKm * avoidedPerKm * 100) / 100;

  const formula = `${distanceKm} km × (${baseFactor} - ${targetFactor} kg CO2e/km) = ${totalAvoided} kg CO2e avoided`;

  return {
    co2eAvoidedKg: totalAvoided,
    formula,
  };
}

export function calculateEnergySavings(
  kwh: number,
  country: string = 'India'
): { co2eAvoidedKg: number; formula: string } {
  const factor = country.toLowerCase() === 'united states'
    ? EMISSION_FACTORS.GRID_ELECTRICITY_US_PER_KWH
    : EMISSION_FACTORS.GRID_ELECTRICITY_INDIA_PER_KWH;

  const total = Math.round(kwh * factor * 100) / 100;
  const formula = `${kwh} kWh × ${factor} kg CO2e/kWh (Grid Avg) = ${total} kg CO2e avoided`;

  return {
    co2eAvoidedKg: total,
    formula,
  };
}

export function aggregateImpactRecords(
  records: ImpactRecord[],
  familyMemberCount: number = 4
): AggregatedImpact {
  let userTotal = 0;
  let totalTrips = 0;
  let transitKm = 0;

  for (const r of records) {
    userTotal += r.co2eAvoidedKg || 0;
    if (r.privateTripsAvoided) totalTrips += r.privateTripsAvoided;
    if (r.publicTransitDistanceKm) transitKm += r.publicTransitDistanceKm;
  }

  // Household aggregates family actions (scaled by member engagement)
  const householdTotal = Math.round(userTotal * Math.min(3.2, 1 + (familyMemberCount - 1) * 0.6) * 10) / 10;
  
  // Community aggregate benchmark (~120 active participating households in local sector)
  const communityTotal = Math.round((householdTotal * 85 + 420) * 10) / 10;

  return {
    userTotalCo2eAvoidedKg: Math.round(userTotal * 10) / 10,
    householdTotalCo2eAvoidedKg: householdTotal,
    communityTotalCo2eAvoidedKg: communityTotal,
    totalTripsAvoided: totalTrips,
    publicTransitKm: transitKm,
    activeHabitsStreakDays: Math.min(21, records.length + 3),
    recentLogs: records.slice(-8).reverse(),
  };
}

export const SAMPLE_INITIAL_IMPACT_LOGS: ImpactRecord[] = [
  {
    id: 'log-1',
    date: '2026-11-20',
    category: 'commute',
    actionName: 'Metro Commute instead of Petrol Car (14 km)',
    co2eAvoidedKg: 1.98,
    privateTripsAvoided: 1,
    publicTransitDistanceKm: 14,
    notes: 'Used Delhi Metro Blue Line instead of driving during morning peak smog.',
  },
  {
    id: 'log-2',
    date: '2026-11-21',
    category: 'commute',
    actionName: 'Remote Work / Avoided 22 km Highway Trip',
    co2eAvoidedKg: 3.74,
    privateTripsAvoided: 1,
    notes: 'Severe winter smog day; worked from home with bedroom purifier.',
  },
  {
    id: 'log-3',
    date: '2026-11-22',
    category: 'energy',
    actionName: 'Thermostat Lowered 2°C & Thermal Curtains Sealed',
    co2eAvoidedKg: 2.16,
    notes: 'Saved ~3 kWh of electric space heating load.',
  },
  {
    id: 'log-4',
    date: '2026-11-23',
    category: 'waste',
    actionName: 'Composted Garden Clippings (Prevented Burning)',
    co2eAvoidedKg: 2.90,
    notes: 'Community green waste pit instead of burning dry foliage.',
  },
];
