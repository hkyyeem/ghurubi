import { useState, useEffect, useMemo } from 'react';
import { 
  calculatePrayerTimes, 
  getDefaultPrayerConfig, 
  toHijriDate,
  isRamadan,
  type PrayerTimeConfig, 
  type PrayerTimesResult,
  type HijriDate,
  type PrayerAdjustments 
} from '@/lib/prayerCalculations';
import type { Location } from './useNaturalTime';
import { toGhurubiClock } from '@/lib/ghurubiClock';

export interface PrayerTimeDisplay {
  name: string;
  nameAr: string;
  icon: string;
  time: Date;
  naturalTime: { hours: number; minutes: number; seconds: number };
}

export interface UsePrayerTimesResult {
  prayers: PrayerTimeDisplay[];
  hijriDate: HijriDate;
  config: PrayerTimeConfig;
  updateAdjustment: (prayer: keyof PrayerAdjustments, minutes: number) => void;
  setMethod: (method: PrayerTimeConfig['method']) => void;
  setAsrJuristic: (juristic: PrayerTimeConfig['asrJuristic']) => void;
}

const PRAYER_INFO: Record<string, { nameAr: string; icon: string }> = {
  fajr: { nameAr: 'الفجر', icon: '🌙' },
  sunrise: { nameAr: 'الشروق', icon: '🌅' },
  dhuhr: { nameAr: 'الظهر', icon: '☀️' },
  asr: { nameAr: 'العصر', icon: '🌤️' },
  maghrib: { nameAr: 'المغرب', icon: '🌇' },
  isha: { nameAr: 'العشاء', icon: '🌃' },
};

/** Sunset is 00:00. Seasonal mode stretches night and day to twelve hours each. */
function toNaturalTime(
  prayerTime: Date,
  latitude: number,
  longitude: number,
  useSeasonalHours: boolean = false
): { hours: number; minutes: number; seconds: number } {
  return toGhurubiClock(prayerTime, latitude, longitude, useSeasonalHours);
}

export function usePrayerTimes(
  location: Location | null,
  useSeasonalHours: boolean = false
): UsePrayerTimesResult | null {
  const [config, setConfig] = useState<PrayerTimeConfig>(getDefaultPrayerConfig);
  // Primitives, not the location object: a new city must recompute even when a
  // parent reuses the same object and only replaces its coordinates.
  const latitude = location?.latitude;
  const longitude = location?.longitude;

  const result = useMemo(() => {
    if (latitude == null || longitude == null) return null;

    const now = new Date();
    const prayerTimes = calculatePrayerTimes(
      now,
      latitude,
      longitude,
      config
    );

    const prayers: PrayerTimeDisplay[] = (Object.keys(prayerTimes) as Array<keyof PrayerTimesResult>)
      .map(key => ({
        name: key,
        nameAr: PRAYER_INFO[key].nameAr,
        icon: PRAYER_INFO[key].icon,
        time: prayerTimes[key],
        naturalTime: toNaturalTime(prayerTimes[key], latitude, longitude, useSeasonalHours),
      }));
    
    const hijriDate = toHijriDate(now);
    
    return {
      prayers,
      hijriDate,
      config,
      updateAdjustment: (prayer: keyof PrayerAdjustments, minutes: number) => {
        setConfig(prev => ({
          ...prev,
          adjustments: {
            ...prev.adjustments,
            [prayer]: minutes,
          },
        }));
      },
      setMethod: (method: PrayerTimeConfig['method']) => {
        setConfig(prev => ({ ...prev, method }));
      },
      setAsrJuristic: (juristic: PrayerTimeConfig['asrJuristic']) => {
        setConfig(prev => ({ ...prev, asrJuristic: juristic }));
      },
    };
  }, [latitude, longitude, config, useSeasonalHours]);
  
  // Update Ramadan status daily
  useEffect(() => {
    const checkRamadan = () => {
      const ramadan = isRamadan();
      setConfig(prev => {
        if (prev.isRamadan !== ramadan) {
          return { ...prev, isRamadan: ramadan };
        }
        return prev;
      });
    };
    
    checkRamadan();
    const interval = setInterval(checkRamadan, 60 * 60 * 1000); // Check hourly
    
    return () => clearInterval(interval);
  }, []);
  
  return result;
}
