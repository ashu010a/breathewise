'use client';

import React, { useState } from 'react';
import { AqiStandard } from '@/lib/types';
import { BookOpen, HelpCircle, ArrowRightLeft } from 'lucide-react';

interface AqiScaleExplainerProps {
  currentStandard: AqiStandard;
  onStandardChange: (standard: AqiStandard) => void;
}

export default function AqiScaleExplainer({ currentStandard, onStandardChange }: AqiScaleExplainerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span className="font-bold text-slate-800 dark:text-slate-200">
            AQI Scale Standard: {currentStandard === 'IN_CPCB' ? 'India National AQI (CPCB)' : 'US EPA Air Quality Index'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{isOpen ? 'Hide Scale Details' : 'Why Scales Differ'}</span>
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 space-y-3 animate-in fade-in duration-150">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Different countries adopt different statutory thresholds based on their local climate, background particulate regimes, and epidemiological studies. <strong>BreatheWise never blends scales</strong> and dynamically computes exact sub-indices based on official linear piecewise interpolation equations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            <div className={`p-3 rounded-lg border ${currentStandard === 'IN_CPCB' ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20' : 'border-slate-200 dark:border-slate-700'}`}>
              <div className="flex items-center justify-between mb-1.5 font-bold text-slate-800 dark:text-slate-100">
                <span>India CPCB NAQI (6 Categories)</span>
                {currentStandard === 'IN_CPCB' && <span className="text-[10px] text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded">Active</span>}
              </div>
              <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                <li>• 0–50: Good (PM2.5: 0–30 µg/m³)</li>
                <li>• 51–100: Satisfactory (PM2.5: 31–60 µg/m³)</li>
                <li>• 101–200: Moderate (PM2.5: 61–90 µg/m³)</li>
                <li>• 201–300: Poor (PM2.5: 91–120 µg/m³)</li>
                <li>• 301–400: Very Poor (PM2.5: 121–250 µg/m³)</li>
                <li>• 401–500: Severe (PM2.5: &gt; 250 µg/m³)</li>
              </ul>
            </div>

            <div className={`p-3 rounded-lg border ${currentStandard === 'US_EPA' ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20' : 'border-slate-200 dark:border-slate-700'}`}>
              <div className="flex items-center justify-between mb-1.5 font-bold text-slate-800 dark:text-slate-100">
                <span>US EPA AQI (6 Categories)</span>
                {currentStandard === 'US_EPA' && <span className="text-[10px] text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded">Active</span>}
              </div>
              <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                <li>• 0–50: Good (PM2.5: 0–9.0 µg/m³)</li>
                <li>• 51–100: Moderate (PM2.5: 9.1–35.4 µg/m³)</li>
                <li>• 101–150: Unhealthy for Sensitive Groups (35.5–55.4)</li>
                <li>• 151–200: Unhealthy (PM2.5: 55.5–125.4 µg/m³)</li>
                <li>• 201–300: Very Unhealthy (PM2.5: 125.5–225.4 µg/m³)</li>
                <li>• 301–500: Hazardous (PM2.5: &gt; 225.5 µg/m³)</li>
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onStandardChange(currentStandard === 'IN_CPCB' ? 'US_EPA' : 'IN_CPCB')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 flex items-center gap-1.5 transition"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Switch to {currentStandard === 'IN_CPCB' ? 'US EPA' : 'India CPCB'} Standard</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
