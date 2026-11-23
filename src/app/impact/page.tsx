'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingDown,
  Leaf,
  Users,
  Car,
  Zap,
  Info,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Flame,
  Award,
} from 'lucide-react';
import { useUserStore } from '@/lib/store/user-store';
import { AggregatedImpact } from '@/lib/types';
import { aggregateImpactRecords } from '@/lib/services/impact-calculator';
import { EMISSION_FACTORS } from '@/lib/constants';

export default function ImpactTrackerPage() {
  const { profile, impactLogs } = useUserStore();
  const [aggregated, setAggregated] = useState<AggregatedImpact>(() =>
    aggregateImpactRecords(impactLogs, profile.familyMembersCount)
  );

  useEffect(() => {
    setAggregated(aggregateImpactRecords(impactLogs, profile.familyMembersCount));
  }, [impactLogs, profile.familyMembersCount]);

  return (
    <div className="space-y-6 py-2">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Explainable Environmental Impact</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Carbon & Sustainability Ledger
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Verifiable greenhouse gas emission reductions achieved through everyday household decisions
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 self-start md:self-auto">
          <Award className="w-4 h-4 text-emerald-600" />
          <span>Active Streak: {aggregated.activeHabitsStreakDays} Days</span>
        </div>
      </div>

      {/* Critical Scientific Attribution Notice (Requirement 7 & 12) */}
      <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-950 dark:text-blue-200 leading-relaxed">
          <span className="font-bold block text-sm">
            Scientific Attribution Notice & Methodology
          </span>
          <p className="mt-0.5">
            <strong>Personal Emissions Avoided vs Ambient Air Quality:</strong> Taking public transit or reducing home heating directly eliminates personal greenhouse gas (CO2e) emissions and tailpipe precursors. However, ambient urban air quality (AQI) depends on regional atmospheric thermal inversion, transboundary particulate transport, and industrial activity. An individual choice mitigates systemic climate impact but does not single-handedly reduce neighborhood AQI.
          </p>
        </div>
      </div>

      {/* Three Pillars: Personal, Household, Community */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Personal Impact */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              <span>Personal Contribution</span>
              <Leaf className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-4xl font-black text-slate-900 dark:text-slate-100 my-1">
              {aggregated.userTotalCo2eAvoidedKg} <span className="text-base font-bold text-slate-400">kg CO2e</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Emissions directly avoided through your logged transit, energy, and zero-burning actions.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <span>Logged Habits:</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">{impactLogs.length} actions</span>
          </div>
        </div>

        {/* 2. Household Impact */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              <span>Household Aggregate</span>
              <Users className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-4xl font-black text-slate-900 dark:text-slate-100 my-1">
              {aggregated.householdTotalCo2eAvoidedKg} <span className="text-base font-bold text-slate-400">kg CO2e</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Collective environmental contribution of the {profile.familyName} ({profile.familyMembersCount} members).
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <span>Avoided Car Trips:</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">{aggregated.totalTripsAvoided} trips</span>
          </div>
        </div>

        {/* 3. Community Impact */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              <span>Neighborhood Sector</span>
              <Award className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-4xl font-black text-slate-900 dark:text-slate-100 my-1">
              {aggregated.communityTotalCo2eAvoidedKg} <span className="text-base font-bold text-slate-400">kg CO2e</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Anonymized aggregate participation across ~120 registered households in {profile.location.city}.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <span>Public Transit Traveled:</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">{aggregated.publicTransitKm} km</span>
          </div>
        </div>
      </div>

      {/* Documented Calculation Factors & Assumptions */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Documented Emission Factors & Standards Applied</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-slate-400 block mb-1">Petrol Vehicle Commute</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 block text-sm">
              {EMISSION_FACTORS.PETROL_CAR_PER_KM} kg CO2e / km
            </span>
            <span className="text-[10px] text-slate-500">Source: US EPA GHG Emission Hub</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-slate-400 block mb-1">Electric Metro Rail</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 block text-sm">
              {EMISSION_FACTORS.METRO_RAIL_PER_KM} kg CO2e / passenger-km
            </span>
            <span className="text-[10px] text-slate-500">Source: CPCB Clean Transit Baseline</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-slate-400 block mb-1">Grid Electricity</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 block text-sm">
              {EMISSION_FACTORS.GRID_ELECTRICITY_INDIA_PER_KWH} kg CO2e / kWh
            </span>
            <span className="text-[10px] text-slate-500">Source: Central Electricity Authority (CEA)</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-slate-400 block mb-1">Waste Burning Prevention</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 block text-sm">
              {EMISSION_FACTORS.OPEN_BURNING_AVOIDED_PER_KG_WASTE} kg CO2e / kg waste
            </span>
            <span className="text-[10px] text-slate-500">Source: IPCC Waste Chapter Guidelines</span>
          </div>
        </div>
      </div>

      {/* Recent Impact Activity Logs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Verified Personal Sustainability Activity History</span>
          </h3>
          <span className="text-xs text-slate-400">{aggregated.recentLogs.length} recent entries</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {aggregated.recentLogs.map(log => (
            <div key={log.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                  {log.category === 'commute' ? (
                    <Car className="w-4 h-4" />
                  ) : log.category === 'energy' ? (
                    <Zap className="w-4 h-4" />
                  ) : (
                    <Leaf className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    {log.actionName}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {log.notes}
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {log.date} • Category: {log.category}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                  +{log.co2eAvoidedKg} kg CO2e
                </span>
                <span className="text-[10px] text-slate-400">Avoided</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
