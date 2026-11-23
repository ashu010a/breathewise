'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Sparkles,
  CheckCircle2,
  Clock,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { useUserStore } from '@/lib/store/user-store';
import { SmartDailyRoutine, AirQualityData } from '@/lib/types';
import RecommendationCard from '@/components/ai/RecommendationCard';

export default function RoutinePage() {
  const { profile, standard } = useUserStore();
  const [routine, setRoutine] = useState<SmartDailyRoutine | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});

  const fetchRoutine = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });
      if (!res.ok) throw new Error('Failed to generate daily routine');
      const data = await res.json();
      setRoutine(data.routine);
      setAirQuality(data.airQuality);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutine();
  }, [profile]);

  const handleToggle = (id: string, completed: boolean) => {
    setCompletedMap(prev => ({
      ...prev,
      [id]: completed,
    }));
  };

  // Calculate completion progress
  const allItems = routine
    ? [...routine.morning, ...routine.afternoon, ...routine.evening, ...routine.night]
    : [];
  const completedCount = allItems.filter(i => completedMap[i.id]).length;
  const progressPercent = allItems.length > 0 ? Math.round((completedCount / allItems.length) * 100) : 0;

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Smart Routine Planner</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Personalized Daily Protection Plan
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Dynamic action items tailored for {profile.familyName} in {profile.location.city} based on real-time environmental data
          </p>
        </div>

        <button
          type="button"
          onClick={fetchRoutine}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Regenerate Routine</span>
        </button>
      </div>

      {/* Routine Summary & Progress Bar */}
      {routine && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Today&apos;s Meteorological Directive</span>
            </div>
            <p className="text-xs text-emerald-950 dark:text-emerald-200 font-medium">
              {routine.summary}
            </p>
          </div>

          <div className="w-full sm:w-64 shrink-0 bg-white dark:bg-slate-900 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-300">
              <span>Daily Completion</span>
              <span className="text-emerald-600">{completedCount} / {allItems.length} ({progressPercent}%)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Time-of-Day Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('morning')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
            activeTab === 'morning'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sunrise className="w-4 h-4" />
          <span>Morning Routine ({routine?.morning.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('afternoon')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
            activeTab === 'afternoon'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sun className="w-4 h-4" />
          <span>Afternoon Routine ({routine?.afternoon.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('evening')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
            activeTab === 'evening'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sunset className="w-4 h-4" />
          <span>Evening Routine ({routine?.evening.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('night')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
            activeTab === 'night'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Moon className="w-4 h-4" />
          <span>Overnight Sanctuary ({routine?.night.length || 0})</span>
        </button>
      </div>

      {/* Routine Cards List */}
      {loading ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <RefreshCw className="w-7 h-7 text-emerald-600 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Formulating personalized multi-factor routine...</p>
        </div>
      ) : routine ? (
        <div className="space-y-4">
          {routine[activeTab].map(item => (
            <RecommendationCard
              key={item.id}
              item={{
                ...item,
                completed: completedMap[item.id] || false,
              }}
              onToggleComplete={handleToggle}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
