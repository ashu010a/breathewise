import { AqiStandard, AqiCategory, AqiAssessment, PollutantValues } from './types';

// CPCB Breakpoints for PM2.5 (24h µg/m³) -> Sub-index
const CPCB_PM25_BREAKPOINTS = [
  { cLow: 0, cHigh: 30, iLow: 0, iHigh: 50, category: 'Good' as AqiCategory },
  { cLow: 30.1, cHigh: 60, iLow: 51, iHigh: 100, category: 'Satisfactory' as AqiCategory },
  { cLow: 60.1, cHigh: 90, iLow: 101, iHigh: 200, category: 'Moderate' as AqiCategory },
  { cLow: 90.1, cHigh: 120, iLow: 201, iHigh: 300, category: 'Poor' as AqiCategory },
  { cLow: 120.1, cHigh: 250, iLow: 301, iHigh: 400, category: 'Very Poor' as AqiCategory },
  { cLow: 250.1, cHigh: 500, iLow: 401, iHigh: 500, category: 'Severe' as AqiCategory },
];

// CPCB Breakpoints for PM10 (24h µg/m³) -> Sub-index
const CPCB_PM10_BREAKPOINTS = [
  { cLow: 0, cHigh: 50, iLow: 0, iHigh: 50 },
  { cLow: 51, cHigh: 100, iLow: 51, iHigh: 100 },
  { cLow: 101, cHigh: 250, iLow: 101, iHigh: 200 },
  { cLow: 251, cHigh: 350, iLow: 201, iHigh: 300 },
  { cLow: 351, cHigh: 430, iLow: 301, iHigh: 400 },
  { cLow: 430.1, cHigh: 600, iLow: 401, iHigh: 500 },
];

// US EPA Breakpoints for PM2.5 (µg/m³) -> AQI (Updated EPA 2024 revised standard)
const EPA_PM25_BREAKPOINTS = [
  { cLow: 0, cHigh: 9.0, iLow: 0, iHigh: 50, category: 'Good' as AqiCategory },
  { cLow: 9.1, cHigh: 35.4, iLow: 51, iHigh: 100, category: 'Moderate' as AqiCategory },
  { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150, category: 'Unhealthy for Sensitive Groups' as AqiCategory },
  { cLow: 55.5, cHigh: 125.4, iLow: 151, iHigh: 200, category: 'Unhealthy' as AqiCategory },
  { cLow: 125.5, cHigh: 225.4, iLow: 201, iHigh: 300, category: 'Very Unhealthy' as AqiCategory },
  { cLow: 225.5, cHigh: 500, iLow: 301, iHigh: 500, category: 'Hazardous' as AqiCategory },
];

// Linear interpolation helper
function interpolate(c: number, cLow: number, cHigh: number, iLow: number, iHigh: number): number {
  if (c <= cLow) return iLow;
  if (c >= cHigh) return iHigh;
  const ratio = (c - cLow) / (cHigh - cLow);
  return Math.round(iLow + ratio * (iHigh - iLow));
}

export function calculateCpcbAqi(pm25: number, pm10: number): { value: number; category: AqiCategory } {
  // PM2.5 Sub-index
  let subPm25 = 0;
  let catPm25: AqiCategory = 'Good';
  for (const bp of CPCB_PM25_BREAKPOINTS) {
    if (pm25 <= bp.cHigh || bp === CPCB_PM25_BREAKPOINTS[CPCB_PM25_BREAKPOINTS.length - 1]) {
      subPm25 = interpolate(pm25, bp.cLow, bp.cHigh, bp.iLow, bp.iHigh);
      catPm25 = bp.category;
      break;
    }
  }

  // PM10 Sub-index
  let subPm10 = 0;
  for (const bp of CPCB_PM10_BREAKPOINTS) {
    if (pm10 <= bp.cHigh || bp === CPCB_PM10_BREAKPOINTS[CPCB_PM10_BREAKPOINTS.length - 1]) {
      subPm10 = interpolate(pm10, bp.cLow, bp.cHigh, bp.iLow, bp.iHigh);
      break;
    }
  }

  const finalValue = Math.max(subPm25, subPm10);
  let finalCategory: AqiCategory = 'Good';
  if (finalValue <= 50) finalCategory = 'Good';
  else if (finalValue <= 100) finalCategory = 'Satisfactory';
  else if (finalValue <= 200) finalCategory = 'Moderate';
  else if (finalValue <= 300) finalCategory = 'Poor';
  else if (finalValue <= 400) finalCategory = 'Very Poor';
  else finalCategory = 'Severe';

  return { value: finalValue, category: finalCategory };
}

export function calculateUsaAqi(pm25: number): { value: number; category: AqiCategory } {
  for (const bp of EPA_PM25_BREAKPOINTS) {
    if (pm25 <= bp.cHigh || bp === EPA_PM25_BREAKPOINTS[EPA_PM25_BREAKPOINTS.length - 1]) {
      const val = interpolate(pm25, bp.cLow, bp.cHigh, bp.iLow, bp.iHigh);
      return { value: val, category: bp.category };
    }
  }
  return { value: 500, category: 'Hazardous' };
}

export function assessAirQuality(
  pollutants: PollutantValues,
  standard: AqiStandard = 'IN_CPCB'
): AqiAssessment {
  const cpcb = calculateCpcbAqi(pollutants.pm25, pollutants.pm10);
  const epa = calculateUsaAqi(pollutants.pm25);

  const value = standard === 'US_EPA' ? epa.value : cpcb.value;
  const category = standard === 'US_EPA' ? epa.category : cpcb.category;

  // Visual styling & threshold actions
  let colorHex = '#10b981'; // green
  let badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300';
  let generalAdvisory = 'Air quality is satisfactory and poses little or no risk to the general public.';
  let sensitiveAdvisory = 'Safe for outdoor activities.';
  let outdoorExerciseSafe = true;
  let maskRecommended = false;
  let windowsRecommended = true;
  let airPurifierRecommended = false;

  if (standard === 'IN_CPCB') {
    if (category === 'Good') {
      colorHex = '#10b981';
      badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300';
      generalAdvisory = 'Minimal health impact. Enjoy outdoor ventilation.';
      sensitiveAdvisory = 'Completely safe for children and seniors.';
    } else if (category === 'Satisfactory') {
      colorHex = '#22c55e';
      badgeClass = 'bg-green-100 text-green-800 border-green-300 dark:bg-green-950 dark:text-green-300';
      generalAdvisory = 'Minor breathing discomfort to sensitive individuals.';
      sensitiveAdvisory = 'Sensitive individuals can do normal outdoor recreation.';
    } else if (category === 'Moderate') {
      colorHex = '#f59e0b';
      badgeClass = 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300';
      generalAdvisory = 'Breathing discomfort likely for individuals with asthma or lung conditions.';
      sensitiveAdvisory = 'Limit intense prolonged outdoor exertion.';
      outdoorExerciseSafe = true;
      airPurifierRecommended = true;
    } else if (category === 'Poor') {
      colorHex = '#f97316';
      badgeClass = 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-300';
      generalAdvisory = 'Breathing discomfort to most people on prolonged exposure.';
      sensitiveAdvisory = 'Children and elderly should strictly limit outdoor activities.';
      outdoorExerciseSafe = false;
      maskRecommended = true;
      windowsRecommended = false;
      airPurifierRecommended = true;
    } else if (category === 'Very Poor') {
      colorHex = '#ef4444';
      badgeClass = 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300';
      generalAdvisory = 'Respiratory illness likely upon prolonged exposure. Keep windows closed.';
      sensitiveAdvisory = 'Stay indoors; sensitive members must use HEPA-purified rooms.';
      outdoorExerciseSafe = false;
      maskRecommended = true;
      windowsRecommended = false;
      airPurifierRecommended = true;
    } else {
      // Severe
      colorHex = '#881337';
      badgeClass = 'bg-rose-950 text-rose-200 border-rose-700';
      generalAdvisory = 'Public health emergency. Seriously impacts healthy individuals and vulnerable groups.';
      sensitiveAdvisory = 'Immediate avoidance of outdoor air. Keep air purifiers at max power.';
      outdoorExerciseSafe = false;
      maskRecommended = true;
      windowsRecommended = false;
      airPurifierRecommended = true;
    }
  } else {
    // US EPA
    if (category === 'Good') {
      colorHex = '#10b981';
      badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300';
      generalAdvisory = 'Air quality is considered satisfactory, and air pollution poses little or no risk.';
      sensitiveAdvisory = 'Safe for all groups.';
    } else if (category === 'Moderate') {
      colorHex = '#f59e0b';
      badgeClass = 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300';
      generalAdvisory = 'Air quality is acceptable; however, some sensitive people may feel mild discomfort.';
      sensitiveAdvisory = 'Unusually sensitive people should consider reducing prolonged heavy outdoor exertion.';
    } else if (category === 'Unhealthy for Sensitive Groups') {
      colorHex = '#f97316';
      badgeClass = 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-300';
      generalAdvisory = 'General public is less likely to be affected. Sensitive groups may experience health effects.';
      sensitiveAdvisory = 'Children, seniors, and people with heart/lung disease should cut back outdoor exertion.';
      outdoorExerciseSafe = false;
      airPurifierRecommended = true;
    } else if (category === 'Unhealthy') {
      colorHex = '#ef4444';
      badgeClass = 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300';
      generalAdvisory = 'Everyone may begin to experience health effects; sensitive groups may experience more serious effects.';
      sensitiveAdvisory = 'Avoid prolonged outdoor exertion. Sensitive groups should stay indoors.';
      outdoorExerciseSafe = false;
      maskRecommended = true;
      windowsRecommended = false;
      airPurifierRecommended = true;
    } else if (category === 'Very Unhealthy') {
      colorHex = '#8b5cf6';
      badgeClass = 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300';
      generalAdvisory = 'Health alert: The risk of health effects is increased for everyone.';
      sensitiveAdvisory = 'Stay inside and keep activity levels low.';
      outdoorExerciseSafe = false;
      maskRecommended = true;
      windowsRecommended = false;
      airPurifierRecommended = true;
    } else {
      // Hazardous
      colorHex = '#881337';
      badgeClass = 'bg-rose-950 text-rose-200 border-rose-700';
      generalAdvisory = 'Health warning of emergency conditions: Everyone is more likely to be affected.';
      sensitiveAdvisory = 'Avoid all physical outdoor activities. Remain in well-sealed indoor spaces.';
      outdoorExerciseSafe = false;
      maskRecommended = true;
      windowsRecommended = false;
      airPurifierRecommended = true;
    }
  }

  return {
    standard,
    value,
    category,
    colorHex,
    badgeClass,
    generalAdvisory,
    sensitiveAdvisory,
    outdoorExerciseSafe,
    maskRecommended,
    windowsRecommended,
    airPurifierRecommended,
  };
}

export function getAqiScaleExplanation(standard: AqiStandard): string {
  if (standard === 'IN_CPCB') {
    return 'India Central Pollution Control Board (CPCB) NAQI: 0-500 scale calibrated specifically for tropical winter inversion and dust regimes. PM2.5 breakpoint for "Moderate" is 60-90 µg/m³, and "Severe" is >250 µg/m³.';
  }
  return 'US EPA AQI: 0-500 scale calibrated with 2024 annual particulate limits. PM2.5 >35.5 µg/m³ triggers "Unhealthy for Sensitive Groups", and >125.5 µg/m³ triggers "Very Unhealthy".';
}
