export type AqiStandard = 'IN_CPCB' | 'US_EPA' | 'EU_CAQI';

export type AqiCategory =
  | 'Good'
  | 'Satisfactory'
  | 'Moderate'
  | 'Poor'
  | 'Very Poor'
  | 'Severe'
  | 'Unhealthy for Sensitive Groups'
  | 'Unhealthy'
  | 'Very Unhealthy'
  | 'Hazardous';

export interface PollutantValues {
  pm25: number;      // µg/m³
  pm10: number;      // µg/m³
  no2: number;       // µg/m³
  so2: number;       // µg/m³
  co: number;        // mg/m³
  o3: number;        // µg/m³
}

export interface AqiAssessment {
  standard: AqiStandard;
  value: number;
  category: AqiCategory;
  colorHex: string;
  badgeClass: string;
  generalAdvisory: string;
  sensitiveAdvisory: string;
  outdoorExerciseSafe: boolean;
  maskRecommended: boolean;
  windowsRecommended: boolean;
  airPurifierRecommended: boolean;
}

export interface MonitoringStation {
  id: string;
  name: string;
  city: string;
  country: string;
  provider: string; // e.g., 'Open-Meteo Atmospheric / Copernicus CAMS', 'CPCB India', 'US EPA AirNow'
  latitude: number;
  longitude: number;
  elevationMeters?: number;
  lastUpdated: string;
  isSimulatedFallback: boolean;
  confidenceScore: number; // 0 - 100
}

export interface HourlyTrendPoint {
  time: string;
  aqi: number;
  pm25: number;
  pm10: number;
  no2?: number;
  o3?: number;
}

export interface DailyForecastPoint {
  date: string;
  dayName: string;
  avgAqi: number;
  minAqi: number;
  maxAqi: number;
  dominantCategory: AqiCategory;
  pm25Max: number;
  summary: string;
}

export interface AirQualityData {
  station: MonitoringStation;
  assessment: AqiAssessment;
  altStandardAssessments: Record<AqiStandard, { value: number; category: string }>;
  pollutants: PollutantValues;
  hourlyTrends: HourlyTrendPoint[];
  dailyForecasts: DailyForecastPoint[];
  weather: {
    temperatureC: number;
    humidityPercent: number;
    windSpeedKmh: number;
    windDirectionDeg: number;
    conditionText: string;
  };
}

export interface LocationItem {
  id: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  isDefault?: boolean;
}

export interface HouseholdProfile {
  id: string;
  familyName: string;
  location: LocationItem;
  familyMembersCount: number;
  childrenCount: number;
  elderlyCount: number;
  hasSensitiveMembers: boolean;
  sensitiveConditions: string[]; // e.g. 'Asthma', 'COPD', 'Heart Disease', 'Allergic Rhinitis'
  commuteMode: 'walk' | 'bicycle' | 'metro_bus' | 'carpool' | 'private_car' | 'two_wheeler' | 'remote';
  cookingHeating: 'lpg_induction' | 'natural_gas' | 'biomass_wood' | 'electric_heating' | 'coal_kerosene';
  outdoorExerciseFrequency: 'daily' | 'several_times_week' | 'rarely' | 'never';
  budgetLevel: 'budget_conscious' | 'moderate' | 'flexible';
  hasIndoorAirPurifier: boolean;
  purifierFilterType: 'hepa' | 'basic_mesh' | 'electrostatic' | 'none';
  homeType: 'small_apartment' | 'medium_apartment' | 'large_house' | 'independent_villa';
  language: 'en' | 'hi' | 'es';
  recommendationStyle: 'action_oriented' | 'detailed_scientific' | 'gentle_encouraging';
  notificationPreferences: {
    alertThresholdAqi: number;
    morningRoutineReminder: boolean;
    spikeAlerts: boolean;
    filterMaintenanceReminders: boolean;
    quietHoursStart: string; // e.g., '22:00'
    quietHoursEnd: string;   // e.g., '07:00'
  };
}

export interface RoutineActionItem {
  id: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  title: string;
  action: string;
  whyRecommended: string;
  triggerCondition: string;
  benefit: string;
  effortLevel: 'low' | 'medium' | 'high';
  costEstimate: 'free' | 'low' | 'moderate' | 'investment';
  completed?: boolean;
}

export interface SmartDailyRoutine {
  date: string;
  summary: string;
  morning: RoutineActionItem[];
  afternoon: RoutineActionItem[];
  evening: RoutineActionItem[];
  night: RoutineActionItem[];
}

export interface IndoorAirGuidance {
  safeVentilationWindow: {
    canOpenWindowsNow: boolean;
    recommendedHoursText: string;
    reasoning: string;
  };
  hepaFiltrationAdvice: {
    recommendedSpeed: string;
    runtimeHours: string;
    filterConditionNotice: string;
  };
  kitchenGuidance: string[];
  roomSpecificTips: {
    roomType: string;
    tips: string[];
  }[];
  criticalSafetyWarnings: string[];
}

export interface SustainableAlternative {
  id: string;
  category: 'commute' | 'energy' | 'cooking_heating' | 'waste_consumption';
  currentBehavior: string;
  suggestedAlternative: string;
  estimatedCostDifference: string;
  environmentalBenefit: string;
  practicalSteps: string[];
  estimatedCo2eSavingsKg: number;
  applicabilityNote: string;
}

export interface ImpactRecord {
  id: string;
  date: string;
  category: 'commute' | 'energy' | 'heating' | 'waste' | 'community';
  actionName: string;
  co2eAvoidedKg: number;
  privateTripsAvoided?: number;
  publicTransitDistanceKm?: number;
  notes: string;
}

export interface AggregatedImpact {
  userTotalCo2eAvoidedKg: number;
  householdTotalCo2eAvoidedKg: number;
  communityTotalCo2eAvoidedKg: number;
  totalTripsAvoided: number;
  publicTransitKm: number;
  activeHabitsStreakDays: number;
  recentLogs: ImpactRecord[];
}

export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  category: string;
  targetGoal: string;
  participantsCount: number;
  startDate: string;
  endDate: string;
  progressPercent: number;
  estimatedCo2SavedKg: number;
  isUserJoined: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: string[];
  actionTips?: string[];
  disclaimer?: string;
  language?: 'en' | 'hi' | 'es';
}
