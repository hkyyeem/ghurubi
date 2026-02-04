import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for persistent localStorage with SSR support
 * Reads synchronously on initialization to prevent UI flickering
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Initialize with value from localStorage (sync read to prevent flicker)
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  // Update localStorage when state changes
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove item from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(defaultValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, defaultValue]);

  return [storedValue, setValue, removeValue];
}

// Storage keys
export const STORAGE_KEYS = {
  SEASONAL_HOURS: 'earthclock_seasonal_hours',
  SHOW_PRAYER_TIMES: 'earthclock_show_prayer_times',
  SAVED_LOCATION: 'earthclock_saved_location',
  PRAYER_OFFSETS: 'earthclock_prayer_offsets',
  MADHAB: 'earthclock_madhab',
} as const;

// Types for stored data
export interface SavedLocation {
  latitude: number;
  longitude: number;
  cityName?: string;
  cityNameAr?: string;
}

export interface PrayerOffsets {
  fajr: number;
  sunrise: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

export type Madhab = 'shafii' | 'hanafi';

// Default values
export const DEFAULT_PRAYER_OFFSETS: PrayerOffsets = {
  fajr: 0,
  sunrise: 0,
  dhuhr: 0,
  asr: 0,
  maghrib: 0,
  isha: 0,
};

export const DEFAULT_MADHAB: Madhab = 'shafii';
