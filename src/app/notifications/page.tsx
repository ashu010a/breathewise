'use client';

import React, { useState } from 'react';
import {
  Bell,
  Sliders,
  ShieldAlert,
  Wrench,
  Calendar,
  Award,
  Clock,
  CheckCircle2,
  Moon,
  Save,
} from 'lucide-react';
import { useUserStore } from '@/lib/store/user-store';

interface InAppNotification {
  id: string;
  type: 'aqi_spike' | 'filter_maintenance' | 'forecast_alert' | 'community_event';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  severity: 'info' | 'warning' | 'urgent';
}

const INITIAL_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif-1',
    type: 'aqi_spike',
    title: 'Severe Smog Inversion Warning',
    message: 'Morning boundary layer has fallen below 180 meters. PM2.5 has crossed 210 µg/m³ along regional traffic arterials. Keep windows sealed.',
    timestamp: '25 mins ago',
    isRead: false,
    severity: 'urgent',
  },
  {
    id: 'notif-2',
    type: 'filter_maintenance',
    title: 'Bi-Weekly True HEPA Pre-Filter Vacuum Due',
    message: 'Your primary bedroom purifier has operated for 14 continuous days during winter smog. Vacuum the pre-filter mesh today to maintain 99.97% airflow efficiency.',
    timestamp: '3 hours ago',
    isRead: false,
    severity: 'warning',
  },
  {
    id: 'notif-3',
    type: 'forecast_alert',
    title: 'Western Disturbance Wind Shift Expected in 48h',
    message: 'Meteorological models predict incoming 12 km/h north-westerly surface breezes that will improve dispersion by Friday afternoon.',
    timestamp: 'Yesterday',
    isRead: true,
    severity: 'info',
  },
  {
    id: 'notif-4',
    type: 'community_event',
    title: 'Clean Transit Triplet Challenge Update',
    message: '412 families in your sector have logged over 1,240 kg of avoided CO2e this week. You have completed 2 of 3 target trips.',
    timestamp: '2 days ago',
    isRead: true,
    severity: 'info',
  },
];

export default function NotificationsPage() {
  const { profile, updateProfile } = useUserStore();
  const [notifications, setNotifications] = useState<InAppNotification[]>(INITIAL_NOTIFICATIONS);
  const [threshold, setThreshold] = useState(profile.notificationPreferences.alertThresholdAqi);
  const [quietStart, setQuietStart] = useState(profile.notificationPreferences.quietHoursStart);
  const [quietEnd, setQuietEnd] = useState(profile.notificationPreferences.quietHoursEnd);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleSaveSettings = () => {
    const updated = {
      ...profile,
      notificationPreferences: {
        ...profile.notificationPreferences,
        alertThresholdAqi: Number(threshold),
        quietHoursStart: quietStart,
        quietHoursEnd: quietEnd,
      },
    };
    updateProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 py-2">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5" />
            <span>Intelligent Alert Engine</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Notifications & Protection Alerts
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time threshold alerts, pre-filter reminders, and quiet hours configuration
          </p>
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition self-start md:self-auto"
        >
          Mark All as Read
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications Feed */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Recent Alerts & Maintenance Notices</span>
            <span className="text-xs text-slate-400">({notifications.filter(n => !n.isRead).length} unread)</span>
          </h2>

          <div className="space-y-3">
            {notifications.map(notif => {
              let borderClass = 'border-slate-200 dark:border-slate-800';
              let icon = <Bell className="w-4 h-4 text-slate-500" />;
              if (notif.severity === 'urgent') {
                borderClass = 'border-rose-300 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20';
                icon = <ShieldAlert className="w-4 h-4 text-rose-600" />;
              } else if (notif.severity === 'warning') {
                borderClass = 'border-amber-300 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20';
                icon = <Wrench className="w-4 h-4 text-amber-600" />;
              } else {
                icon = <Calendar className="w-4 h-4 text-blue-600" />;
              }

              return (
                <div
                  key={notif.id}
                  className={`p-4 rounded-xl border bg-white dark:bg-slate-900 transition flex items-start gap-3.5 ${borderClass} ${notif.isRead ? 'opacity-70' : 'shadow-sm'}`}
                >
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                    {icon}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 h-fit">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sliders className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Notification Preferences
            </h3>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              AQI Alert Threshold Trigger
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              Send immediate alert when local air quality surpasses:
            </p>
            <select
              value={threshold}
              onChange={e => setThreshold(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-slate-100"
            >
              <option value="100">AQI 100 (Moderate threshold)</option>
              <option value="150">AQI 150 (Sensitive groups threshold)</option>
              <option value="200">AQI 200 (Poor / Unhealthy threshold)</option>
              <option value="300">AQI 300 (Severe smog emergency threshold)</option>
            </select>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-500" />
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Quiet Hours (Silence Non-Critical Alerts)
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block mb-1">Start Time</span>
                <input
                  type="time"
                  value={quietStart}
                  onChange={e => setQuietStart(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                />
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block mb-1">End Time</span>
                <input
                  type="time"
                  value={quietEnd}
                  onChange={e => setQuietEnd(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveSettings}
            className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Alert Rules</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
