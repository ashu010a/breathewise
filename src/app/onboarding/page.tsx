'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Users,
  Home,
  Sliders,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Shield,
  Locate,
} from 'lucide-react';
import { useUserStore } from '@/lib/store/user-store';
import { HouseholdProfile, LocationItem } from '@/lib/types';
import { PRESET_LOCATIONS } from '@/lib/services/air-quality-service';

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, updateProfile, setLocation } = useUserStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<HouseholdProfile>(profile);
  const [geoLocating, setGeoLocating] = useState(false);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      updateProfile(formData);
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleDeviceGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const customLoc: LocationItem = {
          id: 'device-geo',
          name: 'Device Current Location',
          city: 'Current Area',
          country: 'Local',
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          isDefault: true,
        };
        setFormData(prev => ({ ...prev, location: customLoc }));
        setGeoLocating(false);
      },
      err => {
        console.warn(err);
        setGeoLocating(false);
        alert('Could not retrieve device location. You can select from preset metropolitan cities.');
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Wizard Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          <span>Personalization Wizard</span>
          <span>Step {step} of 4</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Card Content */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        {/* Step 1: Location */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>Step 1: Environmental Location</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                Where does your family live?
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                We calibrate real-time meteorological boundary layers and atmospheric sensor readings to your exact coordinates.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Select from Major Metropolitan Smog Basins:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PRESET_LOCATIONS.map(loc => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, location: loc })}
                    className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
                      formData.location.id === loc.id
                        ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                        {loc.name}
                      </span>
                      <span className="text-[10px] text-slate-400">{loc.city}, {loc.country}</span>
                    </div>
                    {formData.location.id === loc.id && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-400">Or use optional device GPS:</span>
              <button
                type="button"
                onClick={handleDeviceGeolocation}
                disabled={geoLocating}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold flex items-center gap-1.5 text-slate-700 dark:text-slate-300 transition"
              >
                <Locate className="w-3.5 h-3.5 text-emerald-600" />
                <span>{geoLocating ? 'Acquiring GPS...' : 'Use My Coordinates'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Household Composition */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2">
                <Users className="w-3.5 h-3.5" />
                <span>Step 2: Household & Health</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                Who lives in your home?
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Children and older adults require strictly calibrated particulate exposure thresholds.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Family / Household Name
                </label>
                <input
                  type="text"
                  value={formData.familyName}
                  onChange={e => setFormData({ ...formData, familyName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Total Family Members
                </label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={formData.familyMembersCount}
                  onChange={e => setFormData({ ...formData, familyMembersCount: Number(e.target.value) })}
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
                  value={formData.childrenCount}
                  onChange={e => setFormData({ ...formData, childrenCount: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Older Adults (over 65 yrs)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.elderlyCount}
                  onChange={e => setFormData({ ...formData, elderlyCount: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id="hasSensitiveOnboard"
                  checked={formData.hasSensitiveMembers}
                  onChange={e => setFormData({ ...formData, hasSensitiveMembers: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <label htmlFor="hasSensitiveOnboard" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                  A member has respiratory or cardiovascular sensitivity (Asthma, COPD, etc.)
                </label>
              </div>

              {formData.hasSensitiveMembers && (
                <input
                  type="text"
                  placeholder="Specify conditions (e.g., Mild Pediatric Asthma)"
                  value={formData.sensitiveConditions.join(', ')}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      sensitiveConditions: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                />
              )}
            </div>
          </div>
        )}

        {/* Step 3: Lifestyle & Housing */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2">
                <Home className="w-3.5 h-3.5" />
                <span>Step 3: Lifestyle & Housing</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                Daily Habits & Living Space
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Allows BreatheWise to provide tailored ventilation and low-emission commute alternatives.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Primary Commute Method
                </label>
                <select
                  value={formData.commuteMode}
                  onChange={e => setFormData({ ...formData, commuteMode: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                >
                  <option value="private_car">Private Petrol/Diesel Car</option>
                  <option value="two_wheeler">Two-Wheeler / Scooter</option>
                  <option value="metro_bus">Public Metro / Bus</option>
                  <option value="carpool">Carpooling / Rideshare</option>
                  <option value="walk">Walking</option>
                  <option value="bicycle">Bicycle</option>
                  <option value="remote">Remote Work</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Home Type
                </label>
                <select
                  value={formData.homeType}
                  onChange={e => setFormData({ ...formData, homeType: e.target.value as any })}
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
                  Do You Own an Air Purifier?
                </label>
                <select
                  value={formData.purifierFilterType}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      hasIndoorAirPurifier: e.target.value !== 'none',
                      purifierFilterType: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                >
                  <option value="hepa">Yes, Certified True HEPA Purifier</option>
                  <option value="basic_mesh">Yes, Basic Carbon/Mesh Purifier</option>
                  <option value="none">No, Currently No Purifier</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Cooking & Heating Source
                </label>
                <select
                  value={formData.cookingHeating}
                  onChange={e => setFormData({ ...formData, cookingHeating: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                >
                  <option value="lpg_induction">LPG Gas & Electric Induction</option>
                  <option value="natural_gas">Piped Natural Gas (PNG)</option>
                  <option value="electric_heating">Electric Space Radiators</option>
                  <option value="biomass_wood">Biomass, Wood, or Chulha</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Preferences & Confirmation */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2">
                <Sliders className="w-3.5 h-3.5" />
                <span>Step 4: Preferences & Confirmation</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                You&apos;re Ready to Breathe Better!
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Confirm your preferences to generate your initial household dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Preferred Interface Language
                </label>
                <select
                  value={formData.language}
                  onChange={e => setFormData({ ...formData, language: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="es">Español</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Budget Strategy
                </label>
                <select
                  value={formData.budgetLevel}
                  onChange={e => setFormData({ ...formData, budgetLevel: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                >
                  <option value="budget_conscious">Budget-Conscious (Low-cost/DIY)</option>
                  <option value="moderate">Moderate Standard Solutions</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2 text-xs">
              <span className="font-bold text-emerald-900 dark:text-emerald-300 block">
                Profile Configuration Summary:
              </span>
              <ul className="space-y-1 text-emerald-950 dark:text-emerald-200 text-[11px]">
                <li>• <strong>Location:</strong> {formData.location.name}</li>
                <li>• <strong>Family:</strong> {formData.familyMembersCount} members ({formData.childrenCount} children, {formData.elderlyCount} seniors)</li>
                <li>• <strong>Purifier:</strong> {formData.hasIndoorAirPurifier ? 'HEPA Protected' : 'Sanctuary Protocol Active'}</li>
                <li>• <strong>Commute:</strong> {formData.commuteMode.replace('_', ' ')}</li>
              </ul>
            </div>
          </div>
        )}

        {/* Wizard Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-2 shadow-md transition"
          >
            <span>{step === 4 ? 'Complete Onboarding' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
