'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Wind,
  Compass,
  Calendar,
  Home,
  Bike,
  BarChart3,
  Users,
  Bot,
  Bell,
  User,
  Menu,
  X,
  MapPin,
  SlidersHorizontal,
} from 'lucide-react';
import { useUserStore } from '@/lib/store/user-store';

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: Compass },
  { href: '/routine', label: 'Daily Routine', icon: Calendar },
  { href: '/indoor', label: 'Indoor Sanctuary', icon: Home },
  { href: '/sustainable', label: 'Sustainable Eco', icon: Bike },
  { href: '/impact', label: 'Impact Tracker', icon: BarChart3 },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/assistant', label: 'AI Companion', icon: Bot, isHighlight: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const { profile, standard, updateStandard, setLocation, savedLocations } = useUserStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Wind className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  BreatheWise
                </span>
                <span className="hidden sm:inline-block ml-1.5 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  AI Smog Assistant
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {NAV_LINKS.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60'
                      : item.isHighlight
                      ? 'text-teal-700 dark:text-teal-300 bg-teal-50/70 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/60'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Controls: Location Selector + AQI Standard Switch + Notifications + Profile */}
          <div className="flex items-center gap-2">
            {/* Location Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span className="max-w-[100px] truncate">{profile.location.city}</span>
              </button>

              {locationDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    Switch Monitoring Location
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {savedLocations.map(loc => (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => {
                          setLocation(loc);
                          setLocationDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 ${
                          profile.location.id === loc.id ? 'font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div>
                          <div>{loc.name}</div>
                          <div className="text-[10px] text-slate-400">{loc.city}, {loc.country}</div>
                        </div>
                        {profile.location.id === loc.id && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-800 px-3 pt-2">
                    <Link
                      href="/profile"
                      onClick={() => setLocationDropdownOpen(false)}
                      className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1"
                    >
                      <SlidersHorizontal className="w-3 h-3" /> Manage Locations & Preferences
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* AQI Standard Toggle */}
            <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-300 dark:border-slate-700">
              <button
                type="button"
                onClick={() => updateStandard('IN_CPCB')}
                className={`px-2 py-1 text-[11px] font-semibold rounded-md transition ${
                  standard === 'IN_CPCB'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="Indian National Air Quality Index (CPCB NAQI)"
              >
                CPCB
              </button>
              <button
                type="button"
                onClick={() => updateStandard('US_EPA')}
                className={`px-2 py-1 text-[11px] font-semibold rounded-md transition ${
                  standard === 'US_EPA'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="United States Environmental Protection Agency AQI"
              >
                US EPA
              </button>
            </div>

            {/* Notifications */}
            <Link
              href="/notifications"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition"
              title="Notification Center"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900"></span>
            </Link>

            {/* Profile Avatar */}
            <Link
              href="/profile"
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 transition"
              title="Household Profile & Settings"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                {profile.familyName ? profile.familyName.charAt(0) : 'U'}
              </div>
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1">
          {NAV_LINKS.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 text-emerald-600" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">AQI Standard:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => updateStandard('IN_CPCB')}
                className={`px-3 py-1 text-xs rounded font-semibold ${standard === 'IN_CPCB' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}
              >
                India CPCB
              </button>
              <button
                type="button"
                onClick={() => updateStandard('US_EPA')}
                className={`px-3 py-1 text-xs rounded font-semibold ${standard === 'US_EPA' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}
              >
                US EPA
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
