'use client';

import React, { useState } from 'react';
import { HourlyTrendPoint } from '@/lib/types';
import { TrendingUp, Clock, Info } from 'lucide-react';

interface HourlyTrendChartProps {
  hourlyTrends: HourlyTrendPoint[];
}

export default function HourlyTrendChart({ hourlyTrends }: HourlyTrendChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<HourlyTrendPoint | null>(null);

  if (!hourlyTrends || hourlyTrends.length === 0) {
    return null;
  }

  // Take the most relevant 18 points for clean display
  const points = hourlyTrends.slice(-18);
  const maxAqi = Math.max(100, ...points.map(p => p.aqi));
  const minAqi = Math.max(0, Math.min(...points.map(p => p.aqi)) - 20);

  // Chart dimensions
  const width = 640;
  const height = 180;
  const padLeft = 35;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 30;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  // Scale coordinates
  const coords = points.map((p, idx) => {
    const x = padLeft + (idx / (points.length - 1)) * chartW;
    const yRatio = (p.aqi - minAqi) / (maxAqi - minAqi || 1);
    const y = padTop + chartH - yRatio * chartH;
    return { x, y, p };
  });

  // SVG polyline string
  const polylineStr = coords.map(c => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');

  // Gradient area path string
  const areaPathStr = `M ${coords[0].x},${coords[0].y} ` +
    coords.map(c => `L ${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ') +
    ` L ${coords[coords.length - 1].x},${padTop + chartH} L ${coords[0].x},${padTop + chartH} Z`;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>24-Hour Pollution Inversion & Forecast Curve</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Diurnal curve showing morning & night thermal inversion particulate spikes
          </p>
        </div>

        {hoveredPoint && (
          <div className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
            <span>{hoveredPoint.time.slice(11, 16)}</span>: AQI <strong className="text-emerald-600 dark:text-emerald-400">{hoveredPoint.aqi}</strong> (PM2.5: {hoveredPoint.pm25} µg/m³)
          </div>
        )}
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 overflow-visible select-none"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={padLeft}
            y1={padTop}
            x2={width - padRight}
            y2={padTop}
            stroke="currentColor"
            className="text-slate-100 dark:text-slate-800"
            strokeDasharray="4 4"
          />
          <line
            x1={padLeft}
            y1={padTop + chartH / 2}
            x2={width - padRight}
            y2={padTop + chartH / 2}
            stroke="currentColor"
            className="text-slate-100 dark:text-slate-800"
            strokeDasharray="4 4"
          />
          <line
            x1={padLeft}
            y1={padTop + chartH}
            x2={width - padRight}
            y2={padTop + chartH}
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-700"
          />

          {/* Area fill */}
          <path d={areaPathStr} fill="url(#areaGradient)" />

          {/* Line stroke */}
          <polyline
            points={polylineStr}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {coords.map((c, i) => {
            const isHovered = hoveredPoint?.time === c.p.time;
            const hour = c.p.time.slice(11, 16);
            const isMorningRush = hour >= '07:00' && hour <= '09:30';
            const isEveningPeak = hour >= '20:00' && hour <= '22:30';

            return (
              <g key={i}>
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={isHovered ? 6 : isMorningRush || isEveningPeak ? 4.5 : 3}
                  className={`transition-all cursor-pointer ${
                    isMorningRush || isEveningPeak
                      ? 'fill-rose-500 stroke-white dark:stroke-slate-900 stroke-2'
                      : 'fill-emerald-600 stroke-white dark:stroke-slate-900 stroke-2'
                  }`}
                  onMouseEnter={() => setHoveredPoint(c.p)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                {/* X Axis time labels every 3 items */}
                {i % 3 === 0 && (
                  <text
                    x={c.x}
                    y={height - 8}
                    textAnchor="middle"
                    className="text-[10px] fill-slate-400 font-medium"
                  >
                    {hour}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Morning & Evening Inversion Trapping</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Afternoon Solar Dispersion</span>
          </span>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <Info className="w-3.5 h-3.5" />
          <span>Hover points for readings</span>
        </div>
      </div>
    </div>
  );
}
