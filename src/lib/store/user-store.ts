'use client';

import { useState, useEffect } from 'react';
import { HouseholdProfile, LocationItem, AqiStandard, ImpactRecord } from '../types';
import { DEFAULT_HOUSEHOLD_PROFILE } from '../constants';
import { SAMPLE_INITIAL_IMPACT_LOGS } from '../services/impact-calculator';
import { PRESET_LOCATIONS } from '../services/air-quality-service';

const PROFILE_KEY = 'breathewise_profile_v1';
const STANDARD_KEY = 'breathewise_aqi_standard_v1';
const IMPACT_LOGS_KEY = 'breathewise_impact_logs_v1';
const SAVED_LOCATIONS_KEY = 'breathewise_saved_locations_v1';

export function useUserStore() {
  const [profile, setProfileState] = useState<HouseholdProfile>(DEFAULT_HOUSEHOLD_PROFILE);
  const [standard, setStandardState] = useState<AqiStandard>('IN_CPCB');
  const [impactLogs, setImpactLogsState] = useState<ImpactRecord[]>(SAMPLE_INITIAL_IMPACT_LOGS);
  const [savedLocations, setSavedLocationsState] = useState<LocationItem[]>(PRESET_LOCATIONS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem(PROFILE_KEY);
      if (storedProfile) {
        setProfileState(JSON.parse(storedProfile));
      }

      const storedStandard = localStorage.getItem(STANDARD_KEY);
      if (storedStandard === 'IN_CPCB' || storedStandard === 'US_EPA') {
        setStandardState(storedStandard);
      }

      const storedLogs = localStorage.getItem(IMPACT_LOGS_KEY);
      if (storedLogs) {
        setImpactLogsState(JSON.parse(storedLogs));
      }

      const storedLocations = localStorage.getItem(SAVED_LOCATIONS_KEY);
      if (storedLocations) {
        setSavedLocationsState(JSON.parse(storedLocations));
      }
    } catch (e) {
      console.error('Failed to load user store from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const updateProfile = (newProfile: HouseholdProfile) => {
    setProfileState(newProfile);
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));
    } catch (e) {
      console.error(e);
    }
  };

  const updateStandard = (newStandard: AqiStandard) => {
    setStandardState(newStandard);
    try {
      localStorage.setItem(STANDARD_KEY, newStandard);
    } catch (e) {
      console.error(e);
    }
  };

  const setLocation = (loc: LocationItem) => {
    const updated = {
      ...profile,
      location: loc,
    };
    updateProfile(updated);
  };

  const addImpactLog = (log: ImpactRecord) => {
    const updated = [log, ...impactLogs];
    setImpactLogsState(updated);
    try {
      localStorage.setItem(IMPACT_LOGS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const addSavedLocation = (loc: LocationItem) => {
    const updated = [...savedLocations, loc];
    setSavedLocationsState(updated);
    try {
      localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  return {
    profile,
    updateProfile,
    standard,
    updateStandard,
    setLocation,
    impactLogs,
    addImpactLog,
    savedLocations,
    addSavedLocation,
    isLoaded,
  };
}
