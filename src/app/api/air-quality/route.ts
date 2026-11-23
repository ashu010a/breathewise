import { NextRequest, NextResponse } from 'next/server';
import { getAirQuality } from '@/lib/services/air-quality-service';
import { AqiStandard } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const latStr = searchParams.get('lat') || '28.6139'; // Default Delhi
    const lonStr = searchParams.get('lon') || '77.2090';
    const city = searchParams.get('city') || 'Delhi NCR';
    const standard = (searchParams.get('standard') as AqiStandard) || 'IN_CPCB';

    const lat = parseFloat(latStr);
    const lon = parseFloat(lonStr);

    if (isNaN(lat) || isNaN(lon)) {
      return NextResponse.json({ error: 'Invalid latitude or longitude' }, { status: 400 });
    }

    const data = await getAirQuality(lat, lon, city, standard);

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=120',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch air quality data';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
