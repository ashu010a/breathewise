import { NextRequest, NextResponse } from 'next/server';
import { getAirQuality } from '@/lib/services/air-quality-service';
import { generateSmartDailyRoutine, generateIndoorGuidance, generateSustainableAlternatives } from '@/lib/services/recommendation-engine';
import { DEFAULT_HOUSEHOLD_PROFILE } from '@/lib/constants';
import { HouseholdProfile } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const profile: HouseholdProfile = body.profile || DEFAULT_HOUSEHOLD_PROFILE;
    const lat = profile.location?.latitude ?? 28.6139;
    const lon = profile.location?.longitude ?? 77.2090;
    const city = profile.location?.city ?? 'Delhi NCR';

    const aq = await getAirQuality(lat, lon, city);

    const routine = generateSmartDailyRoutine(aq, profile);
    const indoor = generateIndoorGuidance(aq, profile);
    const sustainable = generateSustainableAlternatives(aq, profile);

    return NextResponse.json({
      routine,
      indoor,
      sustainable,
      airQuality: aq,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to generate recommendations';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '28.6139');
    const lon = parseFloat(searchParams.get('lon') || '77.2090');
    const city = searchParams.get('city') || 'Delhi NCR';

    const aq = await getAirQuality(lat, lon, city);
    const routine = generateSmartDailyRoutine(aq, DEFAULT_HOUSEHOLD_PROFILE);
    const indoor = generateIndoorGuidance(aq, DEFAULT_HOUSEHOLD_PROFILE);
    const sustainable = generateSustainableAlternatives(aq, DEFAULT_HOUSEHOLD_PROFILE);

    return NextResponse.json({
      routine,
      indoor,
      sustainable,
      airQuality: aq,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to generate recommendations';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
