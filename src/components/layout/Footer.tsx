import React from 'react';
import Link from 'next/link';
import { Wind, ShieldCheck, HeartPulse, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Wind className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
                BreatheWise
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              AI-Powered Winter Smog & Urban Air Pollution Companion. Empowering families with real-time environmental intelligence, daily routines, and explainable sustainability guidance.
            </p>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">
              Application Modules
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link href="/dashboard" className="hover:text-emerald-600">Real-Time Intelligence Dashboard</Link></li>
              <li><Link href="/routine" className="hover:text-emerald-600">Smart Daily Routine Planner</Link></li>
              <li><Link href="/indoor" className="hover:text-emerald-600">Indoor Sanctuary & Ventilation</Link></li>
              <li><Link href="/sustainable" className="hover:text-emerald-600">Sustainable Commute & Lifestyle</Link></li>
              <li><Link href="/impact" className="hover:text-emerald-600">Explainable Impact Tracker</Link></li>
              <li><Link href="/assistant" className="hover:text-emerald-600">AI Air Quality Assistant</Link></li>
            </ul>
          </div>

          {/* Environmental Standards */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">
              Verified Data Standards
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>India CPCB National AQI (NAQI)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>US EPA AirNow Standard 2024</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Copernicus Atmospheric CAMS Models</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>WHO 2021 Global Air Quality Guidelines</span>
              </li>
            </ul>
          </div>

          {/* Health Disclaimer */}
          <div className="bg-amber-50 dark:bg-amber-950/40 p-3.5 rounded-xl border border-amber-200 dark:border-amber-800/60">
            <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-300 font-semibold text-xs mb-1.5">
              <HeartPulse className="w-4 h-4 text-amber-600" />
              <span>Medical & Health Notice</span>
            </div>
            <p className="text-[11px] text-amber-800/90 dark:text-amber-400/90 leading-normal">
              BreatheWise is an educational decision-support companion and does not provide medical diagnosis or treatment plans. Individuals with severe asthma, COPD, or cardiovascular distress should follow their physician&apos;s directives.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} BreatheWise Technologies. Built with scientific responsibility and practical value.
          </div>
          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
            <Link href="/onboarding" className="hover:text-emerald-600">Onboarding Wizard</Link>
            <Link href="/profile" className="hover:text-emerald-600">Household Profile</Link>
            <Link href="/notifications" className="hover:text-emerald-600">Alert Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
