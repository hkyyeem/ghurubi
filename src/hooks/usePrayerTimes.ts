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
 * 
 * In Seasonal Hours mode:
 * - Night (Sunset to Sunrise) = 00:00 to 12:00 (12 stretched hours)
 * - Day (Sunrise to Sunset) = 12:00 to 24:00 (12 stretched hours)
 * 
 * Fajr occurs BEFORE sunrise, so it's during the night period,
 * and should appear around 10:00-11:00 seasonal time (end of night).
 */
function toNaturalTime(
  prayerTime: Date, 
  location: Location,
  useSeasonalHours: boolean = false
): { hours: number; minutes: number; seconds: number } {
  const sunTimes = SunCalc.getTimes(prayerTime, location.latitude, location.longitude);
  
  // Determine if prayer time is during night or day
  // Night: from sunset to next sunrise
  // Day: from sunrise to sunset
  const isBeforeSunrise = prayerTime < sunTimes.sunrise;
  const isAfterSunset = prayerTime >= sunTimes.sunset;
  const isNight = isBeforeSunrise || isAfterSunset;
  
  if (useSeasonalHours) {
    if (isNight) {
      // Night period: 00:00 to 12:00 (seasonal)
      let relevantSunset: Date;
      let relevantSunrise: Date;
      
      if (isAfterSunset) {
        // After today's sunset - use today's sunset and tomorrow's sunrise
        relevantSunset = sunTimes.sunset;
        const tomorrow = new Date(prayerTime);
        tomorrow.setDate(tomorrow.getDate() + 1);
        relevantSunrise = SunCalc.getTimes(tomorrow, location.latitude, location.longitude).sunrise;
      } else {
        // Before today's sunrise - use yesterday's sunset and today's sunrise
        const yesterday = new Date(prayerTime);
        yesterday.setDate(yesterday.getDate() - 1);
        relevantSunset = SunCalc.getTimes(yesterday, location.latitude, location.longitude).sunset;
        relevantSunrise = sunTimes.sunrise;
      }
      
      const nightDurationMs = relevantSunrise.getTime() - relevantSunset.getTime();
      const msSinceSunset = prayerTime.getTime() - relevantSunset.getTime();
      
      // Progress through the night (0 = sunset, 1 = sunrise)
      const progress = Math.max(0, Math.min(1, msSinceSunset / nightDurationMs));
      
      // Night = 12 seasonal hours (00:00 to 12:00)
      const totalSeasonalSeconds = progress * 12 * 3600;
      
      return {
        hours: Math.floor(totalSeasonalSeconds / 3600),
        minutes: Math.floor((totalSeasonalSeconds % 3600) / 60),
        seconds: Math.floor(totalSeasonalSeconds % 60),
      };
    } else {
      // Day period: 12:00 to 24:00 (seasonal)
      const sunrise = sunTimes.sunrise;
      const sunset = sunTimes.sunset;
      const dayDurationMs = sunset.getTime() - sunrise.getTime();
      const msSinceSunrise = prayerTime.getTime() - sunrise.getTime();
      
      // Progress through the day (0 = sunrise, 1 = sunset)
      const progress = Math.max(0, Math.min(1, msSinceSunrise / dayDurationMs));
      
      // Day = 12 seasonal hours (12:00 to 24:00)
      const totalSeasonalSeconds = progress * 12 * 3600;
      
      return {
        hours: 12 + Math.floor(totalSeasonalSeconds / 3600),
        minutes: Math.floor((totalSeasonalSeconds % 3600) / 60),
        seconds: Math.floor(totalSeasonalSeconds % 60),
      };
    }
  } else {
    // Standard natural time (fixed 24 hours starting at sunset)
    let relevantSunset: Date;
    
    if (prayerTime >= sunTimes.sunset) {
      relevantSunset = sunTimes.sunset;
    } else {
      const yesterday = new Date(prayerTime);
      yesterday.setDate(yesterday.getDate() - 1);
      relevantSunset = SunCalc.getTimes(yesterday, location.latitude, location.longitude).sunset;
    }
    
    const msSinceSunset = prayerTime.getTime() - relevantSunset.getTime();
    const secondsSinceSunset = msSinceSunset / 1000;
    const totalSeconds = Math.max(0, secondsSinceSunset % 86400);
    
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
