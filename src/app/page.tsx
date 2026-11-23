'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Wind,
  Shield,
  Bot,
  Calendar,
  Home,
  Bike,
  BarChart3,
  Users,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HeartPulse,
} from 'lucide-react';
import { PRESET_LOCATIONS } from '@/lib/services/air-quality-service';

export default function LandingPage() {
  const [cityData, setCityData] = useState<{ city: string; aqi: number; category: string }[]>([
    { city: 'Delhi NCR', aqi: 342, category: 'Very Poor' },
    { city: 'Mumbai', aqi: 128, category: 'Moderate' },
    { city: 'Lahore', aqi: 388, category: 'Very Poor' },
    { city: 'New York', aqi: 42, category: 'Good' },
    { city: 'London', aqi: 36, category: 'Good' },
  ]);

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white p-8 sm:p-12 md:p-16 border border-emerald-900/40 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI-Powered Winter Smog & Urban Air Companion</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Clear Guidance in a{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Hazy World.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
            BreatheWise transforms complex meteorological sensors into actionable, household-specific routines. From timing morning ventilation to bedroom sanctuaries and sustainable commutes, protect your family with explainable environmental intelligence.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/dashboard"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition group"
            >
              <span>Explore Live Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/onboarding"
              className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition"
            >
              Start Household Personalization
            </Link>
          </div>

          {/* Quick Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Real-Time Sensors</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>GenAI Companion</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Sanctuary Advice</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>CO2e Impact Tracker</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Global & Regional City Ticker */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Live Urban Air Quality Benchmarks
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-time particulate concentrations across representative global metropolitan regions
            </p>
          </div>
          <Link href="/dashboard" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
            View All Cities →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {cityData.map(c => {
            let catColor = 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300';
            if (c.aqi >= 300) catColor = 'border-rose-400 bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300';
            else if (c.aqi >= 200) catColor = 'border-orange-400 bg-orange-50 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300';
            else if (c.aqi >= 100) catColor = 'border-amber-400 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300';

            return (
              <div
                key={c.city}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                  {c.city}
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-slate-100 my-1">
                  {c.aqi}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catColor}`}>
                  {c.category}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* The 5 Core Mission Questions */}
      <section className="bg-slate-100 dark:bg-slate-900/60 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            5 Questions Every Family Needs Answered
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            We don’t just report numbers. We tell you exactly what actions to take, why they matter, and how to verify their impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              How safe or unhealthy is the air right now?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Clear multi-pollutant AQI (PM2.5, PM10, NO2, O3) following official CPCB NAQI or US EPA standards with zero confusion or hidden conversions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              What should my family do today?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Smart daily routine planner providing tailored Morning, Afternoon, Evening, and Night routines for children, seniors, and active commuters.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              How can I improve air quality inside my home?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Safe ventilation window calculator, HEPA filter maintenance guides, and zero-chemical sanctuary practices for apartments and homes.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              What lifestyle changes reduce pollution?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Realistic, affordable sustainable alternatives—from clean transit and WFH during peak smog to induction cooking and zero open waste burning.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 md:col-span-2 lg:col-span-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
              5
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              What measurable positive impact can I create?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Transparent, explainable impact tracker displaying personal, household, and community CO2e avoided using IPCC-verified calculations.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Navigation Grid */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Dedicated Intelligence Modules
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Engineered for families, sensitive populations, and neighborhood communities
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Link
            href="/routine"
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition shadow-sm hover:shadow-md group block"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-1">
              Smart Daily Routine Planner
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Step-by-step action plan for morning commutes, afternoon ventilation, evening cooking, and overnight bedroom protection.
            </p>
          </Link>

          <Link
            href="/indoor"
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition shadow-sm hover:shadow-md group block"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Home className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-1">
              Indoor Air Sanctuary Assistant
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Ventilation timing algorithms, True HEPA guidance, DIY budget air cleaners, and critical warnings against ozone generators.
            </p>
          </Link>

          <Link
            href="/assistant"
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition shadow-sm hover:shadow-md group block"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-1">
              Conversational AI Companion
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Ask natural language questions in English or Hindi. Powered by Gemini & CPCB expert rules with scientific citations.
            </p>
          </Link>

          <Link
            href="/sustainable"
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition shadow-sm hover:shadow-md group block"
          >
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Bike className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-1">
              Sustainable Alternatives
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Compare transit, heating, and waste habits. Calculate cost differences and carbon emissions avoided without compromising safety.
            </p>
          </Link>

          <Link
            href="/impact"
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition shadow-sm hover:shadow-md group block"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-1">
              Explainable Impact Tracker
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Transparent greenhouse gas calculations with documented emission factors and zero confusion between emissions avoided and ambient AQI.
            </p>
          </Link>

          <Link
            href="/community"
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition shadow-sm hover:shadow-md group block"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-1">
              Community Clean-Air Drives
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Join neighborhood sustainability challenges, zero-waste burning patrols, and collective clean transit initiatives without exposing privacy.
            </p>
          </Link>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="rounded-3xl bg-emerald-600 text-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-emerald-600/20">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to Protect Your Household Today?
          </h2>
          <p className="text-sm text-emerald-100 max-w-xl">
            Complete the 2-minute personalized onboarding to get custom daily protection advice tailored to your children, seniors, and home type.
          </p>
        </div>
        <Link
          href="/onboarding"
          className="px-6 py-3 rounded-xl bg-white text-emerald-800 font-bold text-sm hover:bg-emerald-50 shrink-0 shadow-md transition"
        >
          Begin Onboarding Wizard
        </Link>
      </section>
    </div>
  );
}
