'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Home,
  Calendar,
  Bot,
  Info,
  Thermometer,
  Droplets,
  Wind,
} from 'lucide-react';
import { useUserStore } from '@/lib/store/user-store';
import { AirQualityData } from '@/lib/types';
import AqiGauge from '@/components/aqi/AqiGauge';
import PollutantCard from '@/components/aqi/PollutantCard';
import HourlyTrendChart from '@/components/aqi/HourlyTrendChart';
import ForecastCards from '@/components/aqi/ForecastCards';
import AqiScaleExplainer from '@/components/aqi/AqiScaleExplainer';

export default function DashboardPage() {
  const { profile, standard, updateStandard } = useUserStore();
  const [aqData, setAqData] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAqi = async () => {
    setLoading(true);
    setError(null);
    try {
      const lat = profile.location?.latitude ?? 28.6139;
      const lon = profile.location?.longitude ?? 77.2090;
      const city = profile.location?.city ?? 'Delhi NCR';

      const res = await fetch(`/api/air-quality?lat=${lat}&lon=${lon}&city=${encodeURIComponent(city)}&standard=${standard}`);
      if (!res.ok) throw new Error('Failed to fetch air quality data');
      const data = await res.json();
      setAqData(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to retrieve environmental data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAqi();
  }, [profile.location, standard]);

  const greeting = getGreeting();

  return (
    <div className="space-y-6 py-2">
      {/* Top Banner: Greeting & Location Summary */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>Environmental Intelligence Center</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {greeting}, {profile.familyName || 'Family'}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
            <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {profile.location.name} ({profile.location.city}, {profile.location.country})
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {aqData?.station.lastUpdated ? new Date(aqData.station.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={fetchAqi}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            title="Refresh live environmental data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <Link
            href="/routine"
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>View Today&apos;s Plan</span>
          </Link>
        </div>
      </div>

      {/* Station Metadata & Attribution Strip */}
      {aqData && (
        <div className="px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600 dark:text-slate-300">Station & Provider:</span>
            <span className="text-slate-800 dark:text-slate-100 font-medium">
              {aqData.station.name} — {aqData.station.provider}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {aqData.weather && (
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                  <span>{aqData.weather.temperatureC}°C</span>
                </span>
                <span className="flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-500" />
                  <span>{aqData.weather.humidityPercent}% Humidity</span>
                </span>
                <span className="flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-teal-500" />
                  <span>{aqData.weather.windSpeedKmh} km/h Wind</span>
                </span>
              </div>
            )}

            {aqData.station.isSimulatedFallback ? (
              <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold border border-amber-300 dark:border-amber-800">
                Calibrated Offline Benchmark Mode
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Live Atmospheric Feed
              </span>
            )}
          </div>
        </div>
      )}

      {/* Household Vulnerability Alert if sensitive */}
      {profile.hasSensitiveMembers && aqData && aqData.assessment.value >= 150 && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-900 dark:text-rose-200">
            <span className="font-bold block text-sm">
              High Risk Advisory for {profile.familyName} Sensitive Members
            </span>
            <p className="mt-0.5 leading-relaxed">
              Air quality has entered the <strong>{aqData.assessment.category}</strong> category (AQI {aqData.assessment.value}). With {profile.childrenCount} child(ren), {profile.elderlyCount} senior(s), and registered conditions ({profile.sensitiveConditions.join(', ') || 'respiratory vulnerability'}), maintain strict indoor HEPA filtration and suspend strenuous outdoor play.
            </p>
          </div>
        </div>
      )}

      {/* Core Grid: AQI Gauge + Pollutant Cards */}
      {loading && !aqData ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            Fetching real-time atmospheric measurements and computing regional AQI...
          </p>
        </div>
      ) : aqData ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <AqiGauge
                assessment={aqData.assessment}
                locationName={profile.location.name}
              />
            </div>
            <div className="lg:col-span-2">
              <PollutantCard pollutants={aqData.pollutants} />
            </div>
          </div>

          {/* Diurnal Trend Chart */}
          <HourlyTrendChart hourlyTrends={aqData.hourlyTrends} />

          {/* 3-Day Forecast */}
          <ForecastCards dailyForecasts={aqData.dailyForecasts} />

          {/* Scale Explainer */}
          <AqiScaleExplainer
            currentStandard={standard}
            onStandardChange={updateStandard}
          />
        </>
      ) : null}

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <Link
          href="/routine"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition shadow-sm flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
              Step-by-Step
            </span>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Smart Daily Routine Planner
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Time-blocked Morning, Afternoon, Evening routines
            </p>
          </div>
          <Calendar className="w-6 h-6 text-emerald-600 group-hover:scale-110 transition-transform" />
        </Link>

        <Link
          href="/indoor"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 transition shadow-sm flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block">
              Home Sanctuary
            </span>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Indoor Sanctuary & Ventilation
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Window schedule and True HEPA filter maintenance
            </p>
          </div>
          <Home className="w-6 h-6 text-teal-600 group-hover:scale-110 transition-transform" />
        </Link>

        <Link
          href="/assistant"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 transition shadow-sm flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider block">
              Ask Questions
            </span>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              AI Air Quality Companion
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Natural language answers with CPCB & WHO citations
            </p>
          </div>
          <Bot className="w-6 h-6 text-cyan-600 group-hover:scale-110 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
