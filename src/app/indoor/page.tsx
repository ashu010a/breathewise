'use client';

import React, { useState, useEffect } from 'react';
import {
  Home,
  Wind,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Wrench,
  Sparkles,
  RefreshCw,
  Clock,
  DoorClosed,
  Layers,
} from 'lucide-react';
import { useUserStore } from '@/lib/store/user-store';
import { IndoorAirGuidance, AirQualityData } from '@/lib/types';

export default function IndoorSanctuaryPage() {
  const { profile } = useUserStore();
  const [guidance, setGuidance] = useState<IndoorAirGuidance | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchGuidance = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });
      if (!res.ok) throw new Error('Failed to load indoor guidance');
      const data = await res.json();
      setGuidance(data.indoor);
      setAirQuality(data.airQuality);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuidance();
  }, [profile]);

  return (
    <div className="space-y-6 py-2">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5" />
            <span>Indoor Sanctuary Assistant</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Indoor Air Quality & Ventilation Guide
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Engineered indoor protocols tailored for {profile.homeType.replace('_', ' ')} living in {profile.location.city}
          </p>
        </div>

        <button
          type="button"
          onClick={fetchGuidance}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Analysis</span>
        </button>
      </div>

      {/* Critical Safety Warning Banner (Rule 12: Never recommend ozone generators or unsafe chemicals) */}
      {guidance && (
        <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 space-y-2">
          <div className="flex items-center gap-2 text-rose-900 dark:text-rose-200 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            <span>Critical Health Safety Disclaimers (Indoor Space)</span>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-rose-800 dark:text-rose-300 pt-1">
            {guidance.criticalSafetyWarnings.map((warn, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold shrink-0">•</span>
                <span>{warn}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Ventilation Window Calculator */}
      {guidance && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-2xl border ${
            guidance.safeVentilationWindow.canOpenWindowsNow
              ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
              : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Window Ventilation Decision
              </span>
              <DoorClosed className="w-5 h-5 text-slate-500" />
            </div>

            <div className="text-xl font-black text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
              {guidance.safeVentilationWindow.canOpenWindowsNow ? (
                <>
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-700 dark:text-emerald-400">Windows Can Open</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span className="text-amber-800 dark:text-amber-300">Keep Windows Sealed</span>
                </>
              )}
            </div>

            <div className="text-xs text-slate-700 dark:text-slate-300 space-y-2 mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
              <div>
                <span className="font-bold text-slate-500 block text-[11px]">Recommended Window Timing:</span>
                <span className="font-medium">{guidance.safeVentilationWindow.recommendedHoursText}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 block text-[11px]">Reasoning:</span>
                <span>{guidance.safeVentilationWindow.reasoning}</span>
              </div>
            </div>
          </div>

          {/* HEPA Filtration Optimizer */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm md:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Wind className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  HEPA Air Purifier Operational Protocol
                </h3>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                {profile.purifierFilterType === 'hepa' ? 'True HEPA Active' : 'Standard Setup'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-500 block mb-1">Recommended Fan Speed</span>
                <span className="font-bold text-base text-slate-900 dark:text-slate-100 block">
                  {guidance.hepaFiltrationAdvice.recommendedSpeed}
                </span>
                <span className="text-slate-400 text-[11px]">
                  Calibrated to current outdoor PM2.5 infiltration pressure
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-500 block mb-1">Daily Runtime Goal</span>
                <span className="font-bold text-base text-slate-900 dark:text-slate-100 block">
                  {guidance.hepaFiltrationAdvice.runtimeHours}
                </span>
                <span className="text-slate-400 text-[11px]">
                  Ensure continuous overnight bedroom purification
                </span>
              </div>
            </div>

            <div className="mt-3.5 p-3 rounded-xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/60 text-xs text-teal-950 dark:text-teal-200 flex items-start gap-2">
              <Wrench className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>{guidance.hepaFiltrationAdvice.filterConditionNotice}</span>
            </div>
          </div>
        </div>
      )}

      {/* Kitchen Fume & Exhaust Protocols */}
      {guidance && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
            <Flame className="w-5 h-5 text-amber-600" />
            <span>Kitchen Exhaust & Cooking Particle Control</span>
          </div>
          <p className="text-xs text-slate-500">
            Unventilated indoor frying and oil sautéing can generate PM2.5 spikes surpassing 500 µg/m³ inside the home.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-slate-700 dark:text-slate-300 pt-2">
            {guidance.kitchenGuidance.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/70">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Room-by-Room Specific Guidance */}
      {guidance && (
        <div className="space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Room-Specific Sanctuary Architecture</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {guidance.roomSpecificTips.map((room, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                    {room.roomType}
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    {room.tips.map((t, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DIY Budget-Friendly Alternative: Corsi-Rosenthal Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 border border-blue-200 dark:border-slate-700 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Budget Alternative: The DIY Corsi-Rosenthal Air Filter Box (~$25–$35)
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
            Scientifically Validated by UC Davis
          </span>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          For budget-constrained households, commercial air purifiers can be cost-prohibitive. A Corsi-Rosenthal box uses four MERV-13 furnace filters taped into a cube with a standard 20-inch box fan on top. It produces over <strong>600 CFM (Cubic Feet per Minute)</strong> of clean air—exceeding many expensive luxury purifiers at 10% of the cost.
        </p>
      </div>
    </div>
  );
}
