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
import type { Location, NaturalTime } from './useNaturalTime';
import SunCalc from 'suncalc';

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

/**
 * Convert standard time to natural time (sunset = 00:00)
 */
function toNaturalTime(
  prayerTime: Date, 
  location: Location,
  useSeasonalHours: boolean = false
): { hours: number; minutes: number; seconds: number } {
  const sunTimes = SunCalc.getTimes(prayerTime, location.latitude, location.longitude);
  
  // Find the relevant sunset (either today's or yesterday's)
  let sunset = sunTimes.sunset;
  if (prayerTime < sunset) {
    // Prayer is before today's sunset, use yesterday's sunset
    const yesterday = new Date(prayerTime);
    yesterday.setDate(yesterday.getDate() - 1);
    sunset = SunCalc.getTimes(yesterday, location.latitude, location.longitude).sunset;
  }
  
  const msSinceSunset = prayerTime.getTime() - sunset.getTime();
  
  if (useSeasonalHours) {
    // Seasonal hours calculation
    const isNight = prayerTime < sunTimes.sunrise || prayerTime >= sunTimes.sunset;
    
    if (isNight) {
      // Night: 12 hours from sunset to sunrise
      const tomorrow = new Date(prayerTime);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowSunrise = SunCalc.getTimes(tomorrow, location.latitude, location.longitude).sunrise;
      const nightDurationMs = tomorrowSunrise.getTime() - sunset.getTime();
      const progress = msSinceSunset / nightDurationMs;
      const totalSeasonalSeconds = progress * 12 * 3600;
      
      return {
        hours: Math.floor(totalSeasonalSeconds / 3600),
        minutes: Math.floor((totalSeasonalSeconds % 3600) / 60),
        seconds: Math.floor(totalSeasonalSeconds % 60),
      };
    } else {
      // Day: 12 hours from sunrise to sunset
      const sunrise = sunTimes.sunrise;
      const sunsetToday = sunTimes.sunset;
      const dayDurationMs = sunsetToday.getTime() - sunrise.getTime();
      const msSinceSunrise = prayerTime.getTime() - sunrise.getTime();
      const progress = msSinceSunrise / dayDurationMs;
      const totalSeasonalSeconds = progress * 12 * 3600;
      
      return {
        hours: 12 + Math.floor(totalSeasonalSeconds / 3600),
        minutes: Math.floor((totalSeasonalSeconds % 3600) / 60),
        seconds: Math.floor(totalSeasonalSeconds % 60),
      };
    }
  } else {
    // Standard natural time
    const secondsSinceSunset = msSinceSunset / 1000;
    const totalSeconds = secondsSinceSunset % 86400;
    
    return {
      hours: Math.floor(totalSeconds / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: Math.floor(totalSeconds % 60),
    };
  }
}

export function usePrayerTimes(
  location: Location | null,
  useSeasonalHours: boolean = false
): UsePrayerTimesResult | null {
  const [config, setConfig] = useState<PrayerTimeConfig>(getDefaultPrayerConfig);
  
  const result = useMemo(() => {
    if (!location) return null;
    
    const now = new Date();
    const prayerTimes = calculatePrayerTimes(
      now,
      location.latitude,
      location.longitude,
      config
    );
    
    const prayers: PrayerTimeDisplay[] = (Object.keys(prayerTimes) as Array<keyof PrayerTimesResult>)
      .map(key => ({
        name: key,
        nameAr: PRAYER_INFO[key].nameAr,
        icon: PRAYER_INFO[key].icon,
        time: prayerTimes[key],
        naturalTime: toNaturalTime(prayerTimes[key], location, useSeasonalHours),
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
  }, [location, config, useSeasonalHours]);
  
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
