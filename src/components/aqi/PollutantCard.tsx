import React from 'react';
import { PollutantValues } from '@/lib/types';
import { Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface PollutantCardProps {
  pollutants: PollutantValues;
}

interface PollutantMeta {
  key: keyof PollutantValues;
  name: string;
  fullName: string;
  unit: string;
  whoLimit: number; // 24-hr guideline
  description: string;
}

const POLLUTANT_METADATA: PollutantMeta[] = [
  {
    key: 'pm25',
    name: 'PM2.5',
    fullName: 'Fine Inhalable Particulate Matter (< 2.5 µm)',
    unit: 'µg/m³',
    whoLimit: 15,
    description: 'Penetrates deep into alveolar gas-exchange tissues and enters bloodstream.',
  },
  {
    key: 'pm10',
    name: 'PM10',
    fullName: 'Coarse Particulate Matter (< 10 µm)',
    unit: 'µg/m³',
    whoLimit: 45,
    description: 'Road dust, construction debris, pollen, and coarse vehicular tire wear.',
  },
  {
    key: 'no2',
    name: 'NO2',
    fullName: 'Nitrogen Dioxide',
    unit: 'µg/m³',
    whoLimit: 25,
    description: 'Combustion gas from motor vehicles, diesel power, and gas appliances.',
  },
  {
    key: 'so2',
    name: 'SO2',
    fullName: 'Sulfur Dioxide',
    unit: 'µg/m³',
    whoLimit: 40,
    description: 'Emitted from thermal coal plants, industrial furnaces, and heavy fuel oils.',
  },
  {
    key: 'co',
    name: 'CO',
    fullName: 'Carbon Monoxide',
    unit: 'mg/m³',
    whoLimit: 4.0,
    description: 'Incomplete combustion byproduct; binds with blood hemoglobin reducing oxygen.',
  },
  {
    key: 'o3',
    name: 'O3',
    fullName: 'Ground-Level Ozone (Tropospheric)',
    unit: 'µg/m³',
    whoLimit: 100,
    description: 'Secondary photochemical pollutant formed by sunlight reacting with NOx and VOCs.',
  },
];

export default function PollutantCard({ pollutants }: PollutantCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Key Atmospheric Pollutant Concentrations</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compared with WHO 24-hour recommended safe ceiling thresholds
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {POLLUTANT_METADATA.map(meta => {
          const val = pollutants[meta.key];
          const isAboveWho = val > meta.whoLimit;
          const ratio = Math.round((val / meta.whoLimit) * 10) / 10;

          return (
            <div
              key={meta.key}
              className={`p-3.5 rounded-xl border transition-all ${
                isAboveWho && ratio >= 2
                  ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                  : isAboveWho
                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
                  : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {meta.name}
                </span>
                {isAboveWho ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                    {ratio}× WHO limit
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Within limit
                  </span>
                )}
              </div>

              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-800 dark:text-slate-100">
                  {val}
                </span>
                <span className="text-xs text-slate-500 font-medium">{meta.unit}</span>
              </div>

              <div className="text-[10px] text-slate-400 mt-1 line-clamp-1" title={meta.fullName}>
                {meta.fullName}
              </div>

              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                WHO safe guideline: <span className="font-semibold">{meta.whoLimit} {meta.unit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
