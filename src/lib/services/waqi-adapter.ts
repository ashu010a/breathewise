import { PollutantValues } from '../types';

export interface WaqiResult {
  aqi: number;
  stationName: string;
  pollutants: Partial<PollutantValues>;
  dominentPol: string;
  provider: string;
}

export async function fetchWaqiAirQuality(
  latitude: number,
  longitude: number
): Promise<WaqiResult | null> {
  const token = process.env.WAQI_API_KEY;
  if (!token) return null;

  try {
    const url = `https://api.waqi.info/feed/geo:${latitude};${longitude}/?token=${token}`;
    const res = await fetch(url, { next: { revalidate: 600 } } as any);
    if (!res.ok) return null;

    const json = await res.json();
    if (json.status !== 'ok' || !json.data) return null;

    const data = json.data;
    const iaqi = data.iaqi || {};

    const pollutants: Partial<PollutantValues> = {
      pm25: iaqi.pm25?.v,
      pm10: iaqi.pm10?.v,
      no2: iaqi.no2?.v,
      so2: iaqi.so2?.v,
      co: iaqi.co?.v,
      o3: iaqi.o3?.v,
    };

    return {
      aqi: data.aqi,
      stationName: data.city?.name || 'Local Official Station',
      pollutants,
      dominentPol: data.dominentpol || 'pm25',
      provider: 'World Air Quality Index (WAQI / EPA-CPCB Sensor Network)',
    };
  } catch {
    return null;
  }
}
