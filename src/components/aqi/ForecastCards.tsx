import React from 'react';
import { DailyForecastPoint } from '@/lib/types';
import { CalendarDays, AlertCircle } from 'lucide-react';

interface ForecastCardsProps {
  dailyForecasts: DailyForecastPoint[];
}

export default function ForecastCards({ dailyForecasts }: ForecastCardsProps) {
  if (!dailyForecasts || dailyForecasts.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4 text-emerald-600" />
            <span>3-Day Atmospheric Smog Outlook</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Meteorological dispersion forecast based on atmospheric boundary modeling
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {dailyForecasts.map((f, i) => {
          let badgeColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
          if (f.dominantCategory === 'Severe') {
            badgeColor = 'bg-rose-950 text-rose-200 border border-rose-800';
          } else if (f.dominantCategory === 'Very Poor' || f.dominantCategory === 'Unhealthy') {
            badgeColor = 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
          } else if (f.dominantCategory === 'Poor' || f.dominantCategory === 'Unhealthy for Sensitive Groups') {
            badgeColor = 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300';
          } else if (f.dominantCategory === 'Moderate') {
            badgeColor = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
          }

          return (
            <div
              key={f.date || i}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {f.dayName}
                  </span>
                  <span className="text-[11px] text-slate-400">{f.date}</span>
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-black text-slate-800 dark:text-slate-100">
                    ~{f.avgAqi}
                  </span>
                  <span className="text-xs text-slate-400">
                    (Range: {f.minAqi} - {f.maxAqi})
                  </span>
                </div>

                <div className="mb-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>
                    {f.dominantCategory}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60">
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                  {f.summary}
                </p>
                <div className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-slate-400" />
                  <span>Max Peak PM2.5: {f.pm25Max} µg/m³</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
