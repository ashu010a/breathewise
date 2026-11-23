'use client';

import React from 'react';
import { AqiAssessment } from '@/lib/types';
import { ShieldAlert, ShieldCheck, Wind, AlertTriangle } from 'lucide-react';

interface AqiGaugeProps {
  assessment: AqiAssessment;
  locationName: string;
}

export default function AqiGauge({ assessment, locationName }: AqiGaugeProps) {
  const { value, category, standard, colorHex, generalAdvisory, maskRecommended, windowsRecommended, airPurifierRecommended, outdoorExerciseSafe } = assessment;

  // Gauge angle calculation (0 to 180 degrees)
  // Max AQI mapped to 500
  const normalizedValue = Math.min(500, Math.max(0, value));
  const angle = (normalizedValue / 500) * 180;

  // Arc path math
  const radius = 95;
  const cx = 120;
  const cy = 115;
  const strokeWidth = 18;

  // Circumference of semi-circle
  const semiCircumference = Math.PI * radius;
  const strokeDashoffset = semiCircumference - (semiCircumference * (normalizedValue / 500));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center relative overflow-hidden transition-all">
      {/* Background ambient glow based on AQI color */}
      <div
        className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: colorHex }}
      />

      <div className="w-full flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Live Air Quality Index
        </span>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          Standard: {standard === 'IN_CPCB' ? 'India CPCB' : 'US EPA'}
        </span>
      </div>

      {/* Semi-circle Gauge SVG */}
      <div className="relative w-60 h-36 flex items-center justify-center">
        <svg className="w-60 h-36 overflow-visible" viewBox="0 0 240 130">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="25%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="75%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#881337" />
            </linearGradient>
          </defs>

          {/* Background Track */}
          <path
            d="M 25 115 A 95 95 0 0 1 215 115"
            fill="none"
            stroke="currentColor"
            className="text-slate-100 dark:text-slate-800"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active Colored Arc */}
          <path
            d="M 25 115 A 95 95 0 0 1 215 115"
            fill="none"
            stroke={colorHex}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={semiCircumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center AQI value */}
        <div className="absolute bottom-2 flex flex-col items-center">
          <span className="text-5xl font-black tracking-tight" style={{ color: colorHex }}>
            {value}
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-0.5">
            AQI Points
          </span>
        </div>
      </div>

      {/* Category Pill */}
      <div
        className="px-4 py-1.5 rounded-full text-sm font-bold shadow-sm border mt-3 flex items-center gap-1.5"
        style={{
          backgroundColor: `${colorHex}18`,
          color: colorHex,
          borderColor: `${colorHex}40`,
        }}
      >
        {value >= 300 ? (
          <ShieldAlert className="w-4 h-4" />
        ) : value >= 100 ? (
          <AlertTriangle className="w-4 h-4" />
        ) : (
          <ShieldCheck className="w-4 h-4" />
        )}
        <span>{category}</span>
      </div>

      {/* Health Advisory Text */}
      <p className="text-xs text-center text-slate-600 dark:text-slate-300 mt-3 px-2 line-clamp-2">
        {generalAdvisory}
      </p>

      {/* Immediate Protection Badges */}
      <div className="grid grid-cols-2 gap-2 w-full mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px]">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300">
          <span className={`w-2 h-2 rounded-full ${outdoorExerciseSafe ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
          <span>{outdoorExerciseSafe ? 'Outdoor Exercise OK' : 'Indoor Workout Only'}</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300">
          <span className={`w-2 h-2 rounded-full ${maskRecommended ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
          <span>{maskRecommended ? 'N95 Mask Needed' : 'No Mask Required'}</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300">
          <span className={`w-2 h-2 rounded-full ${windowsRecommended ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
          <span>{windowsRecommended ? 'Windows Can Open' : 'Keep Windows Sealed'}</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300">
          <span className={`w-2 h-2 rounded-full ${airPurifierRecommended ? 'bg-blue-500' : 'bg-slate-400'}`}></span>
          <span>{airPurifierRecommended ? 'Run HEPA Purifier' : 'Purifier Optional'}</span>
        </div>
      </div>
    </div>
  );
}
