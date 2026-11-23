import { PollutantValues, HourlyTrendPoint, DailyForecastPoint, AqiCategory } from '../types';
import { calculateCpcbAqi } from '../aqi-standards';

export interface OpenMeteoResult {
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
  provider: string;
  stationName: string;
}

export async function fetchOpenMeteoAirQuality(
  latitude: number,
  longitude: number,
  cityName: string = 'Current Location'
): Promise<OpenMeteoResult> {
  // 1. Fetch Air Quality data from Open-Meteo
  const aqUrl = new URL('https://air-quality-api.open-meteo.com/v1/air-quality');
  aqUrl.searchParams.set('latitude', latitude.toString());
  aqUrl.searchParams.set('longitude', longitude.toString());
  aqUrl.searchParams.set(
    'current',
    'pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi,european_aqi'
  );
  aqUrl.searchParams.set(
    'hourly',
    'pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi'
  );
  aqUrl.searchParams.set('past_days', '1');
  aqUrl.searchParams.set('forecast_days', '3');

  // 2. Fetch basic weather condition
  const weatherUrl = new URL('https://api.open-meteo.com/v1/forecast');
  weatherUrl.searchParams.set('latitude', latitude.toString());
  weatherUrl.searchParams.set('longitude', longitude.toString());
  weatherUrl.searchParams.set(
    'current',
    'temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code'
  );

  // Parallel fetch with 6 second timeout
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const [aqRes, weatherRes] = await Promise.all([
      fetch(aqUrl.toString(), { signal: controller.signal, next: { revalidate: 600 } } as any),
      fetch(weatherUrl.toString(), { signal: controller.signal, next: { revalidate: 600 } } as any),
    ]);

    clearTimeout(timeout);

    if (!aqRes.ok) {
      throw new Error(`Open-Meteo AQ API returned HTTP ${aqRes.status}`);
    }

    const aqData = await aqRes.json();
    const weatherData = weatherRes.ok ? await weatherRes.json() : null;

    // Parse current pollutant readings
    const current = aqData.current || {};
    const pollutants: PollutantValues = {
      pm25: Math.round(Number(current.pm2_5 || 25) * 10) / 10,
      pm10: Math.round(Number(current.pm10 || 45) * 10) / 10,
      no2: Math.round(Number(current.nitrogen_dioxide || 20) * 10) / 10,
      so2: Math.round(Number(current.sulphur_dioxide || 8) * 10) / 10,
      co: Math.round((Number(current.carbon_monoxide || 400) / 1000) * 100) / 100, // convert µg/m³ to mg/m³
      o3: Math.round(Number(current.ozone || 30) * 10) / 10,
    };

    // Parse hourly trends (take last 24 hours up to next 12 hours)
    const hourly = aqData.hourly || {};
    const hourlyTimes: string[] = hourly.time || [];
    const hourlyTrends: HourlyTrendPoint[] = [];

    const nowIso = new Date().toISOString().slice(0, 13);
    const startIndex = Math.max(0, hourlyTimes.findIndex(t => t.startsWith(nowIso)) - 18);
    const endIndex = Math.min(hourlyTimes.length, startIndex + 36);

    for (let i = startIndex; i < endIndex; i++) {
      const pm25 = hourly.pm2_5 ? Number(hourly.pm2_5[i]) : 25;
      const pm10 = hourly.pm10 ? Number(hourly.pm10[i]) : 45;
      const cpcb = calculateCpcbAqi(pm25, pm10);

      hourlyTrends.push({
        time: hourlyTimes[i],
        aqi: cpcb.value,
        pm25: Math.round(pm25 * 10) / 10,
        pm10: Math.round(pm10 * 10) / 10,
        no2: hourly.nitrogen_dioxide ? Math.round(Number(hourly.nitrogen_dioxide[i])) : undefined,
        o3: hourly.ozone ? Math.round(Number(hourly.ozone[i])) : undefined,
      });
    }

    // Aggregate into 3 daily forecasts
    const dailyForecasts: DailyForecastPoint[] = [];
    const daysMap = new Map<string, { pm25List: number[]; pm10List: number[] }>();

    for (let i = 0; i < hourlyTimes.length; i++) {
      const dateKey = hourlyTimes[i].split('T')[0];
      if (!daysMap.has(dateKey)) {
        daysMap.set(dateKey, { pm25List: [], pm10List: [] });
      }
      const entry = daysMap.get(dateKey)!;
      if (hourly.pm2_5 && hourly.pm2_5[i] != null) entry.pm25List.push(Number(hourly.pm2_5[i]));
      if (hourly.pm10 && hourly.pm10[i] != null) entry.pm10List.push(Number(hourly.pm10[i]));
    }

    const dateKeys = Array.from(daysMap.keys()).slice(1, 4); // Next 3 days
    for (const dKey of dateKeys) {
      const { pm25List, pm10List } = daysMap.get(dKey)!;
      const avgPm25 = pm25List.length > 0 ? pm25List.reduce((a, b) => a + b, 0) / pm25List.length : 35;
      const maxPm25 = pm25List.length > 0 ? Math.max(...pm25List) : 40;
      const avgPm10 = pm10List.length > 0 ? pm10List.reduce((a, b) => a + b, 0) / pm10List.length : 60;
      const assessed = calculateCpcbAqi(avgPm25, avgPm10);

      const d = new Date(dKey);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

      let summary = 'Moderate air quality expected.';
      if (assessed.category === 'Severe' || assessed.category === 'Very Poor') {
        summary = 'Severe winter smog event expected; limit outdoor activities.';
      } else if (assessed.category === 'Poor') {
        summary = 'Unfavorable meteorological dispersion; elevated particulate levels.';
      } else if (assessed.category === 'Satisfactory' || assessed.category === 'Good') {
        summary = 'Favorable dispersion conditions with low smog index.';
      }

      dailyForecasts.push({
        date: dKey,
        dayName,
        avgAqi: assessed.value,
        minAqi: Math.max(10, assessed.value - 25),
        maxAqi: assessed.value + 35,
        dominantCategory: assessed.category,
        pm25Max: Math.round(maxPm25 * 10) / 10,
        summary,
      });
    }

    // Weather condition
    const wCurrent = weatherData?.current || {};
    const weather = {
      temperatureC: Math.round(Number(wCurrent.temperature_2m || 22)),
      humidityPercent: Math.round(Number(wCurrent.relative_humidity_2m || 55)),
      windSpeedKmh: Math.round(Number(wCurrent.wind_speed_10m || 8)),
      windDirectionDeg: Math.round(Number(wCurrent.wind_direction_10m || 180)),
      conditionText: getWeatherConditionText(wCurrent.weather_code),
    };

    return {
      pollutants,
      hourlyTrends,
      dailyForecasts,
      weather,
      provider: 'European Copernicus / CAMS Model via Open-Meteo API',
      stationName: `${cityName} Atmospheric Grid [${latitude.toFixed(2)}, ${longitude.toFixed(2)}]`,
    };
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

function getWeatherConditionText(code?: number): string {
  if (code == null) return 'Partly Cloudy';
  if (code === 0) return 'Clear Sky';
  if (code === 1 || code === 2) return 'Mostly Sunny';
  if (code === 3) return 'Overcast / Smog Haze';
  if (code >= 45 && code <= 48) return 'Dense Winter Fog / Smog';
  if (code >= 51 && code <= 67) return 'Rain / Drizzle';
  if (code >= 71 && code <= 77) return 'Snow';
  return 'Overcast';
}
