'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Award,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Flame,
  ArrowRight,
  Sparkles,
  MapPin,
  Lock,
} from 'lucide-react';
import { useUserStore } from '@/lib/store/user-store';
import { CommunityChallenge } from '@/lib/types';

export default function CommunityPage() {
  const { profile } = useUserStore();
  const [challenges, setChallenges] = useState<CommunityChallenge[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/community');
        if (res.ok) {
          const data = await res.json();
          setChallenges(data.challenges || []);
          setStats(data.neighborhoodStats || null);
          setInitiatives(data.localInitiatives || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleJoinToggle = (challengeId: string) => {
    setChallenges(prev =>
      prev.map(c => {
        if (c.id === challengeId) {
          const isJoined = !c.isUserJoined;
          return {
            ...c,
            isUserJoined: isJoined,
            participantsCount: isJoined ? c.participantsCount + 1 : c.participantsCount - 1,
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="space-y-6 py-2">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Community Collective Action</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Neighborhood Clean-Air Movement
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Empowering citizen cooperation in {profile.location.city} while preserving complete personal privacy
          </p>
        </div>

        {/* Privacy badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold self-start md:self-auto border border-slate-200 dark:border-slate-700">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Privacy Guaranteed: Zero Address Exposure</span>
        </div>
      </div>

      {/* Neighborhood Impact Statistics */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-bold text-slate-400 block mb-1">Participating Families</span>
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100">
              {stats.participatingHouseholds.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-600 block mt-1 font-semibold">Active this week</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-bold text-slate-400 block mb-1">Community CO2e Avoided</span>
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100">
              {stats.totalCo2eAvoidedKg.toLocaleString()} <span className="text-sm font-bold text-slate-400">kg</span>
            </span>
            <span className="text-[10px] text-emerald-600 block mt-1 font-semibold">Clean transit + WFH</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-bold text-slate-400 block mb-1">Open Fires Extinguished</span>
            <span className="text-3xl font-black text-rose-600 dark:text-rose-400">
              {stats.openFiresReportedAndDoused}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">Zero open burning patrols</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-bold text-slate-400 block mb-1">Indoor PM2.5 Drop</span>
            <span className="text-3xl font-black text-teal-600 dark:text-teal-400">
              {stats.averageIndoorPm25ReductionPercent}%
            </span>
            <span className="text-[10px] text-teal-600 block mt-1 font-semibold">Average sanctuary drop</span>
          </div>
        </div>
      )}

      {/* Community Sustainability Challenges */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-600" />
            <span>Active Community Sustainability Challenges</span>
          </h2>
          <span className="text-xs text-slate-400">Join anonymously with 1 click</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.map(chal => (
            <div
              key={chal.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                chal.isUserJoined
                  ? 'bg-purple-50/40 dark:bg-purple-950/20 border-purple-300 dark:border-purple-800 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {chal.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-purple-600" />
                    <span>{chal.participantsCount} households joined</span>
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">
                  {chal.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  {chal.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-1 mb-3">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span>Goal: {chal.targetGoal}</span>
                    <span className="text-purple-600">{chal.progressPercent}% Completed</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-purple-600 rounded-full transition-all duration-500"
                      style={{ width: `${chal.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Ends {chal.endDate}
                </span>

                <button
                  type="button"
                  onClick={() => handleJoinToggle(chal.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    chal.isUserJoined
                      ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 border border-purple-300 dark:border-purple-700'
                      : 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm'
                  }`}
                >
                  {chal.isUserJoined ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300" />
                      <span>Participating</span>
                    </>
                  ) : (
                    <span>Join Challenge</span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Local Clean-Air Public Initiatives */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>Local Ward Clean-Air Public Infrastructure & Initiatives</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {initiatives.map((init, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
              <span className="font-bold text-slate-900 dark:text-slate-100 block">
                {init.title}
              </span>
              <p className="text-slate-500 text-[11px]">
                Location: <strong className="text-slate-700 dark:text-slate-300">{init.location}</strong>
              </p>
              <div className="text-[11px] text-slate-400">Schedule: {init.schedule}</div>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                {init.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
