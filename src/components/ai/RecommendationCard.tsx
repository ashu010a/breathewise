'use client';

import React, { useState } from 'react';
import { RoutineActionItem } from '@/lib/types';
import { CheckCircle2, Circle, AlertCircle, Sparkles, Tag, DollarSign } from 'lucide-react';

interface RecommendationCardProps {
  item: RoutineActionItem;
  onToggleComplete?: (id: string, completed: boolean) => void;
}

export default function RecommendationCard({ item, onToggleComplete }: RecommendationCardProps) {
  const [completed, setCompleted] = useState(item.completed || false);

  const handleToggle = () => {
    const newState = !completed;
    setCompleted(newState);
    if (onToggleComplete) {
      onToggleComplete(item.id, newState);
    }
  };

  let effortColor = 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300';
  if (item.effortLevel === 'medium') effortColor = 'text-amber-700 bg-amber-100 dark:bg-amber-950 dark:text-amber-300';
  if (item.effortLevel === 'high') effortColor = 'text-purple-700 bg-purple-100 dark:bg-purple-950 dark:text-purple-300';

  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        completed
          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 opacity-90'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 flex-1">
          <button
            type="button"
            onClick={handleToggle}
            className="mt-0.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
            title={completed ? 'Mark pending' : 'Mark done'}
          >
            {completed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>
          <div className="flex-1">
            <h4 className={`text-sm font-bold ${completed ? 'line-through text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>
              {item.title}
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-medium leading-relaxed">
              {item.action}
            </p>
          </div>
        </div>

        {/* Metadata badges: Effort & Cost */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 shrink-0">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${effortColor}`}>
            {item.effortLevel} effort
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {item.costEstimate} cost
          </span>
        </div>
      </div>

      {/* Explanatory Grid: The 5 core requirement points */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
          <span className="font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
            Why Recommended:
          </span>
          <span className="text-slate-700 dark:text-slate-300 leading-tight">
            {item.whyRecommended}
          </span>
        </div>

        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
          <span className="font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
            Trigger Condition:
          </span>
          <span className="text-slate-700 dark:text-slate-300 leading-tight">
            {item.triggerCondition}
          </span>
        </div>

        <div className="p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
          <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600" /> Expected Benefit:
          </span>
          <span className="text-emerald-900 dark:text-emerald-200 leading-tight">
            {item.benefit}
          </span>
        </div>
      </div>
    </div>
  );
}
