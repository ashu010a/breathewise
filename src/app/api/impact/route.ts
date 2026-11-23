import { NextRequest, NextResponse } from 'next/server';
import { calculateTripSavings, calculateEnergySavings, aggregateImpactRecords, SAMPLE_INITIAL_IMPACT_LOGS } from '@/lib/services/impact-calculator';
import { ImpactRecord } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, params, currentLogs, familyCount } = body;

    if (action === 'calculate_trip') {
      const { distanceKm, fromMode, toMode } = params;
      const result = calculateTripSavings(Number(distanceKm), fromMode, toMode);
      return NextResponse.json(result);
    }

    if (action === 'calculate_energy') {
      const { kwh, country } = params;
      const result = calculateEnergySavings(Number(kwh), country);
      return NextResponse.json(result);
    }

    if (action === 'log_habit') {
      const newLog: ImpactRecord = {
        id: `log-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        category: params.category || 'commute',
        actionName: params.actionName,
        co2eAvoidedKg: Number(params.co2eAvoidedKg || 0),
        privateTripsAvoided: params.privateTripsAvoided ? Number(params.privateTripsAvoided) : undefined,
        publicTransitDistanceKm: params.publicTransitDistanceKm ? Number(params.publicTransitDistanceKm) : undefined,
        notes: params.notes || '',
      };

      const updated = [...(currentLogs || SAMPLE_INITIAL_IMPACT_LOGS), newLog];
      const aggregated = aggregateImpactRecords(updated, familyCount || 4);

      return NextResponse.json({
        newLog,
        aggregated,
      });
    }

    // Default: aggregate existing logs
    const logsToAggregate = currentLogs || SAMPLE_INITIAL_IMPACT_LOGS;
    const aggregated = aggregateImpactRecords(logsToAggregate, familyCount || 4);
    return NextResponse.json({ aggregated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Impact calculation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
