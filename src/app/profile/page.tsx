'use client';

import React, { useState } from 'react';
import {
  User,
  Home,
  MapPin,
  HeartPulse,
  SlidersHorizontal,
  Save,
  CheckCircle2,
  Trash2,
  Plus,
  Shield,
  Download,
} from 'lucide-react';
import { useUserStore } from '@/lib/store/user-store';
import { HouseholdProfile, LocationItem } from '@/lib/types';
import { PRESET_LOCATIONS } from '@/lib/services/air-quality-service';

export default function ProfilePage() {
  const { profile, updateProfile, standard, updateStandard, savedLocations, addSavedLocation, setLocation } = useUserStore();
  const [form, setForm] = useState<HouseholdProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [newCityName, setNewCityName] = useState('');
  const [newLat, setNewLat] = useState('');
  const [newLon, setNewLon] = useState('');
  const [showAddLoc, setShowAddLoc] = useState(false);

  const handleSave = () => {
    updateProfile(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddLocation = () => {
    if (!newCityName || !newLat || !newLon) return;
    const loc: LocationItem = {
      id: `custom-loc-${Date.now()}`,
      name: newCityName,
      city: newCityName,
      country: 'Custom',
      latitude: parseFloat(newLat),
      longitude: parseFloat(newLon),
    };
    addSavedLocation(loc);
    setLocation(loc);
    setNewCityName('');
    setNewLat('');
    setNewLon('');
    setShowAddLoc(false);
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(form, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `breathewise_profile_${form.familyName || 'export'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 py-2">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span>Household Profile & Preferences</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Account & Environmental Configuration
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Maintain your household demographic profile to ensure all AI routines remain accurate and medically responsible
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-sm self-start md:self-auto"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Profile Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Household Profile</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Household Composition */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Home className="w-4 h-4 text-emerald-600" />
              <span>1. Household Demographic Profile</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Family / Household Name
                </label>
                <input
                  type="text"
                  value={form.familyName}
                  onChange={e => setForm({ ...form, familyName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Home Space Architecture
                </label>
                <select
                  value={form.homeType}
                  onChange={e => setForm({ ...form, homeType: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                >
                  <option value="small_apartment">Small Apartment (1-2 BHK)</option>
                  <option value="medium_apartment">Medium Apartment (3 BHK)</option>
                  <option value="large_house">Large Independent Floor</option>
                  <option value="independent_villa">Multi-story House / Villa</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Total Household Members
                </label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={form.familyMembersCount}
                  onChange={e => setForm({ ...form, familyMembersCount: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Children Count (under 12 yrs)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={form.childrenCount}
                  onChange={e => setForm({ ...form, childrenCount: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Older Adults / Seniors (over 65 yrs)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={form.elderlyCount}
                  onChange={e => setForm({ ...form, elderlyCount: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Household Budget Orientation
                </label>
                <select
                  value={form.budgetLevel}
                  onChange={e => setForm({ ...form, budgetLevel: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                >
                  <option value="budget_conscious">Budget-Conscious (Prefer DIY / Low-cost)</option>
                  <option value="moderate">Moderate (Standard commercial solutions)</option>
                  <option value="flexible">Flexible (High-end automated air systems)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Health Vulnerability Profile */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <HeartPulse className="w-4 h-4 text-rose-600" />
              <span>2. Respiratory & Health Sensitivity Profile</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hasSensitive"
                  checked={form.hasSensitiveMembers}
                  onChange={e => setForm({ ...form, hasSensitiveMembers: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <label htmlFor="hasSensitive" className="font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                  A family member has pre-existing respiratory or cardiovascular sensitivity
                </label>
              </div>

              {form.hasSensitiveMembers && (
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Registered Conditions (e.g., Asthma, Bronchitis, COPD, Hypertension)
                  </label>
                  <input
                    type="text"
                    value={form.sensitiveConditions.join(', ')}
                    onChange={e =>
                      setForm({
                        ...form,
                        sensitiveConditions: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="Asthma, Elderly Hypertension, Allergic Rhinitis"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Private data stored only on your local client instance. Used strictly to customize routine warnings.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Lifestyle & Commute Habits */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <SlidersHorizontal className="w-4 h-4 text-teal-600" />
              <span>3. Lifestyle, Commute & Air Purifier Assets</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Primary Commute Method
                </label>
                <select
                  value={form.commuteMode}
                  onChange={e => setForm({ ...form, commuteMode: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                >
                  <option value="private_car">Private Petrol/Diesel Car</option>
                  <option value="two_wheeler">Two-Wheeler / Motorcycle</option>
                  <option value="metro_bus">Public Metro / Bus</option>
                  <option value="carpool">Carpooling / Rideshare</option>
                  <option value="walk">Walking</option>
                  <option value="bicycle">Bicycle</option>
                  <option value="remote">Remote Work (Home)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Indoor Air Purifier Status
                </label>
                <select
                  value={form.purifierFilterType}
                  onChange={e =>
                    setForm({
                      ...form,
                      hasIndoorAirPurifier: e.target.value !== 'none',
                      purifierFilterType: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                >
                  <option value="hepa">Certified True HEPA (H13 / H14)</option>
                  <option value="basic_mesh">Basic Mesh / Carbon Sponge</option>
                  <option value="none">No Indoor Air Purifier</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Cooking & Heating Fuel
                </label>
                <select
                  value={form.cookingHeating}
                  onChange={e => setForm({ ...form, cookingHeating: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                >
                  <option value="lpg_induction">LPG Gas & Electric Induction</option>
                  <option value="natural_gas">Piped Natural Gas (PNG)</option>
                  <option value="electric_heating">Electric Space Radiators</option>
                  <option value="biomass_wood">Biomass, Wood, or Chulha</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  AI Recommendation Tone
                </label>
                <select
                  value={form.recommendationStyle}
                  onChange={e => setForm({ ...form, recommendationStyle: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                >
                  <option value="action_oriented">Action-Oriented & Crisp</option>
                  <option value="detailed_scientific">Detailed Scientific Analysis</option>
                  <option value="gentle_encouraging">Gentle & Encouraging</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Location Management & Privacy Export */}
        <div className="space-y-6">
          {/* Location Management */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Monitored Locations</span>
              </h2>
              <button
                type="button"
                onClick={() => setShowAddLoc(!showAddLoc)}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            {showAddLoc && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <input
                  type="text"
                  placeholder="City / Station Name (e.g. Pune)"
                  value={newCityName}
                  onChange={e => setNewCityName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="Latitude"
                    value={newLat}
                    onChange={e => setNewLat(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="Longitude"
                    value={newLon}
                    onChange={e => setNewLon(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddLocation}
                  className="w-full py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition"
                >
                  Save Location
                </button>
              </div>
            )}

            <div className="space-y-2">
              {savedLocations.map(loc => (
                <div
                  key={loc.id}
                  onClick={() => setLocation(loc)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition ${
                    profile.location.id === loc.id
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-100 block">
                      {loc.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {loc.city}, {loc.country} [{loc.latitude.toFixed(2)}, {loc.longitude.toFixed(2)}]
                    </span>
                  </div>
                  {profile.location.id === loc.id && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Privacy & Data Ownership */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Data Privacy & Sovereignty</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              BreatheWise stores your demographic profiles in your local browser sandbox. We never harvest real home street addresses.
            </p>

            <button
              type="button"
              onClick={handleExportData}
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Download className="w-4 h-4" />
              <span>Export My Data (JSON)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
