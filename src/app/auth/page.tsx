'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Wind,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useUserStore } from '@/lib/store/user-store';
import { DEFAULT_HOUSEHOLD_PROFILE } from '@/lib/constants';
import { PRESET_LOCATIONS } from '@/lib/services/air-quality-service';

export default function AuthPage() {
  const router = useRouter();
  const { updateProfile } = useUserStore();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister && name) {
      updateProfile({
        ...DEFAULT_HOUSEHOLD_PROFILE,
        familyName: `${name} Household`,
      });
      router.push('/onboarding');
    } else {
      router.push('/dashboard');
    }
  };

  const handleDemoAccount = (type: 'delhi' | 'mumbai' | 'guest') => {
    if (type === 'delhi') {
      updateProfile({
        ...DEFAULT_HOUSEHOLD_PROFILE,
        familyName: 'Sharma Household (Delhi NCR)',
        location: PRESET_LOCATIONS[0],
        childrenCount: 2,
        hasSensitiveMembers: true,
        sensitiveConditions: ['Pediatric Asthma'],
      });
    } else if (type === 'mumbai') {
      updateProfile({
        ...DEFAULT_HOUSEHOLD_PROFILE,
        familyName: 'Mehta Household (Mumbai)',
        location: PRESET_LOCATIONS[1],
        childrenCount: 0,
        elderlyCount: 1,
        hasSensitiveMembers: false,
      });
    }
    router.push('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-md">
            <Wind className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {isRegister ? 'Create BreatheWise Account' : 'Welcome to BreatheWise'}
          </h1>
          <p className="text-xs text-slate-500">
            {isRegister
              ? 'Join our community-first air pollution intelligence platform'
              : 'Sign in to access your household protection and routine planner'}
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Fast 1-Click Evaluation Accounts</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleDemoAccount('delhi')}
              className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-slate-800 dark:text-slate-200 font-semibold text-[11px] hover:bg-emerald-100 dark:hover:bg-slate-800 transition"
            >
              Delhi Family (Asthma)
            </button>
            <button
              type="button"
              onClick={() => handleDemoAccount('mumbai')}
              className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-slate-800 dark:text-slate-200 font-semibold text-[11px] hover:bg-emerald-100 dark:hover:bg-slate-800 transition"
            >
              Mumbai Urban Household
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Your Full Name / Family Identifier
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Sharma Family"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition flex items-center justify-center gap-1.5 shadow-md mt-2"
          >
            <span>{isRegister ? 'Continue to Onboarding' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
          >
            {isRegister
              ? 'Already registered? Sign in here'
              : 'First time here? Create a household account'}
          </button>
        </div>
      </div>
    </div>
  );
}
