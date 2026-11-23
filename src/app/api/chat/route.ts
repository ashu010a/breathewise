import { NextRequest, NextResponse } from 'next/server';
import { generateAiChatResponse } from '@/lib/services/gemini-client';
import { getAirQuality } from '@/lib/services/air-quality-service';
import { DEFAULT_HOUSEHOLD_PROFILE } from '@/lib/constants';
import { HouseholdProfile, ChatMessage } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, profile = DEFAULT_HOUSEHOLD_PROFILE, history = [], language = 'en' } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message text is required' }, { status: 400 });
    }

    const typedProfile = profile as HouseholdProfile;
    const lat = typedProfile.location?.latitude ?? 28.6139;
    const lon = typedProfile.location?.longitude ?? 77.2090;
    const city = typedProfile.location?.city ?? 'Delhi NCR';

    // Fetch up-to-date live environmental conditions for context
    const aq = await getAirQuality(lat, lon, city);

    const aiResponse = await generateAiChatResponse({
      userQuestion: message,
      airQuality: aq,
      profile: typedProfile,
      history: history as ChatMessage[],
      language,
    });

    return NextResponse.json(aiResponse);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Chat assistant failed';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
