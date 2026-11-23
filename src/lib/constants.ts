import { HouseholdProfile } from './types';

// Emission factors documented from IPCC, US EPA GHG Hub, and India Central Electricity Authority
export const EMISSION_FACTORS = {
  // Transport (kg CO2e per passenger-km)
  PETROL_CAR_PER_KM: 0.170,
  DIESEL_CAR_PER_KM: 0.185,
  TWO_WHEELER_PETROL_PER_KM: 0.055,
  METRO_RAIL_PER_KM: 0.028,
  BUS_TRANSIT_PER_KM: 0.045,
  BICYCLE_OR_WALK_PER_KM: 0.000,

  // Household Electricity (kg CO2e per kWh)
  GRID_ELECTRICITY_INDIA_PER_KWH: 0.720,
  GRID_ELECTRICITY_US_PER_KWH: 0.380,

  // Cooking & Heating (kg CO2e per day / fuel change)
  BIOMASS_WOOD_TO_LPG_PER_DAY_KG: 1.85,
  OPEN_BURNING_AVOIDED_PER_KG_WASTE: 1.45,
};

// Default template profile for demo or onboarding initial state
export const DEFAULT_HOUSEHOLD_PROFILE: HouseholdProfile = {
  id: 'household-demo-01',
  familyName: 'Sharma Family',
  location: {
    id: 'delhi',
    name: 'Delhi NCR (Central)',
    city: 'New Delhi',
    country: 'India',
    latitude: 28.6139,
    longitude: 77.2090,
    isDefault: true,
  },
  familyMembersCount: 4,
  childrenCount: 1,
  elderlyCount: 1,
  hasSensitiveMembers: true,
  sensitiveConditions: ['Mild Asthma', 'Elderly Hypertension'],
  commuteMode: 'private_car',
  cookingHeating: 'lpg_induction',
  outdoorExerciseFrequency: 'several_times_week',
  budgetLevel: 'moderate',
  hasIndoorAirPurifier: true,
  purifierFilterType: 'hepa',
  homeType: 'medium_apartment',
  language: 'en',
  recommendationStyle: 'action_oriented',
  notificationPreferences: {
    alertThresholdAqi: 200,
    morningRoutineReminder: true,
    spikeAlerts: true,
    filterMaintenanceReminders: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
  },
};
