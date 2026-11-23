'use client';

import React, { useState, useEffect } from 'react';
import {
  Bike,
  Train,
  Car,
  Flame,
  Zap,
  Trash2,
  DollarSign,
  Leaf,
  CheckCircle2,
  AlertCircle,
  Calculator,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useUserStore } from '@/lib/store/user-store';
import { SustainableAlternative, AirQualityData } from '@/lib/types';
import { calculateTripSavings } from '@/lib/services/impact-calculator';

export default function SustainableAlternativesPage() {
  const { profile, addImpactLog } = useUserStore();
  const [alternatives, setAlternatives] = useState<SustainableAlternative[]>([]);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(true);

  // Commute Calculator State
  const [distanceKm, setDistanceKm] = useState('15');
  const [fromMode, setFromMode] = useState<'private_car' | 'two_wheeler' | 'diesel_car'>('private_car');
  const [toMode, setToMode] = useState<'metro' | 'bus' | 'walk_bike' | 'none_wfh'>('metro');
  const [calcResult, setCalcResult] = useState<{ co2eAvoidedKg: number; formula: string } | null>(null);
  const [logSuccess, setLogSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile }),
        });
        if (res.ok) {
          const data = await res.json();
          setAlternatives(data.sustainable || []);
          setAirQuality(data.airQuality);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [profile]);

  useEffect(() => {
    const res = calculateTripSavings(Number(distanceKm) || 10, fromMode, toMode);
    setCalcResult(res);
  }, [distanceKm, fromMode, toMode]);

  const handleLogCustomAction = () => {
    if (!calcResult) return;
    addImpactLog({
      id: `custom-log-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      category: 'commute',
      actionName: `Switched ${fromMode.replace('_', ' ')} to ${toMode.replace('_', ' ')} (${distanceKm} km)`,
      co2eAvoidedKg: calcResult.co2eAvoidedKg,
      privateTripsAvoided: 1,
      publicTransitDistanceKm: toMode === 'metro' || toMode === 'bus' ? Number(distanceKm) : undefined,
      notes: `Logged via BreatheWise Commute Calculator. Avoided ${calcResult.co2eAvoidedKg} kg CO2e.`,
    });
    setLogSuccess(true);
    setTimeout(() => setLogSuccess(false), 3000);
  };

  const isOutdoorUnsafe = airQuality && airQuality.assessment.value >= 200;

  return (
    <div className="space-y-6 py-2">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Bike className="w-3.5 h-3.5" />
            <span>Sustainable Alternatives Engine</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Low-Emission Habits & Commute Calculator
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Practical, cost-effective lifestyle modifications that cut greenhouse emissions without compromising respiratory safety
          </p>
        </div>
      </div>

      {/* Safety Guard: Never advise cycling/walking in toxic air */}
      {isOutdoorUnsafe && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 dark:text-amber-200">
            <span className="font-bold block text-sm">Health-First Sustainable Policy</span>
            <p className="mt-0.5 leading-relaxed">
              Ambient air quality is currently <strong>{airQuality?.assessment.category} (AQI {airQuality?.assessment.value})</strong>. BreatheWise does NOT recommend walking or cycling commutes today despite zero emissions. Opt for <strong>sealed AC Metro transit</strong> or <strong>Remote Work (WFH)</strong> to protect your lungs while lowering vehicular traffic.
            </p>
          </div>
        </div>
      )}

      {/* Interactive Commute Carbon Savings Calculator */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Interactive Commute Emissions & Fuel Savings Calculator
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Round-Trip Commute Distance (km)
            </label>
            <input
              type="number"
              min="1"
              max="200"
              value={distanceKm}
              onChange={e => setDistanceKm(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Current Commute Mode
            </label>
            <select
              value={fromMode}
              onChange={e => setFromMode(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="private_car">Petrol Car (Single Occupancy)</option>
              <option value="diesel_car">Diesel Car / SUV</option>
              <option value="two_wheeler">Petrol Scooter / Two-Wheeler</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Eco-Friendly Alternative
            </label>
            <select
              value={toMode}
              onChange={e => setToMode(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="metro">Electric Metro Rail (AC Sealed)</option>
              <option value="bus">Electric / CNG Public Bus</option>
              <option value="none_wfh">Remote Work (Avoided Trip)</option>
              <option value="walk_bike" disabled={Boolean(isOutdoorUnsafe)}>
                Bicycle / Walk {isOutdoorUnsafe ? '(Disabled: Unsafe AQI)' : ''}
              </option>
            </select>
          </div>
        </div>

        {/* Calculation Result Banner */}
        {calcResult && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block mb-0.5">
                Calculated Environmental Savings
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-700 dark:text-emerald-300">
                  {calcResult.co2eAvoidedKg} kg CO2e
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-300">avoided per daily commute</span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono mt-1">
                Formula: {calcResult.formula}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogCustomAction}
              disabled={logSuccess}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition shadow-sm flex items-center gap-1.5 shrink-0"
            >
              {logSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Logged to Impact Tracker!</span>
                </>
              ) : (
                <>
                  <Leaf className="w-4 h-4" />
                  <span>Log This Action to My Impact</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Sustainable Alternatives Cards List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Leaf className="w-4 h-4 text-emerald-600" />
          <span>Curated Sustainable Alternatives for {profile.familyName}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alternatives.map(alt => (
            <div
              key={alt.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  <span>{alt.category.replace('_', ' ')}</span>
                  <span className="text-emerald-600 font-semibold">{alt.estimatedCostDifference}</span>
                </div>

                <div className="text-xs text-rose-600 dark:text-rose-400 font-medium mb-1">
                  Current: {alt.currentBehavior}
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-2">
                  {alt.suggestedAlternative}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  {alt.environmentalBenefit}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                    Actionable Steps:
                  </span>
                  {alt.practicalSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <span className="text-emerald-600 font-bold shrink-0">•</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-700 dark:text-emerald-300">
                  ~{alt.estimatedCo2eSavingsKg} kg CO2e saved / action
                </span>
                <span className="text-[10px] text-slate-400 italic">
                  {alt.applicabilityNote}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
