import { useState, useEffect, useMemo, useCallback } from 'react';
import SunCalc from 'suncalc';

export interface NaturalTime {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isNight: boolean;
  phase: 'night' | 'dawn' | 'day' | 'dusk';
  phaseProgress: number; // 0-1 progress through current phase
  sunsetCountdown: {
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
  };
  nextSunset: Date;
  lastSunset: Date;
  sunrise: Date;
  dayLength: number; // in hours
  nightLength: number; // in hours
}

export interface SeasonalTime extends NaturalTime {
  seasonalHours: number; // Hours in seasonal/temporal system
  seasonalMinutes: number;
  hourDuration: number; // Length of current hour in standard minutes
}

interface Location {
  latitude: number;
  longitude: number;
  altitude?: number;
}

const DEFAULT_LOCATION: Location = {
  latitude: 21.4225, // Mecca
  longitude: 39.8262,
  altitude: 277,
};

export function useGeolocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setLocation(DEFAULT_LOCATION);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude || 0,
        });
        setLoading(false);
      },
      (err) => {
        console.warn('Geolocation error, using default:', err.message);
        setLocation(DEFAULT_LOCATION);
        setError(err.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return { location, error, loading };
}

function getSunTimes(date: Date, location: Location) {
  const times = SunCalc.getTimes(date, location.latitude, location.longitude, location.altitude || 0);
  return times;
}

function getPreviousSunset(now: Date, location: Location): Date {
  const todayTimes = getSunTimes(now, location);
  
  if (now >= todayTimes.sunset) {
    return todayTimes.sunset;
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayTimes = getSunTimes(yesterday, location);
  return yesterdayTimes.sunset;
}

function getNextSunset(now: Date, location: Location): Date {
  const todayTimes = getSunTimes(now, location);
  
  if (now < todayTimes.sunset) {
    return todayTimes.sunset;
  }
  
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowTimes = getSunTimes(tomorrow, location);
  return tomorrowTimes.sunset;
}

function getNextSunrise(now: Date, location: Location): Date {
  const todayTimes = getSunTimes(now, location);
  
  if (now < todayTimes.sunrise) {
    return todayTimes.sunrise;
  }
  
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowTimes = getSunTimes(tomorrow, location);
  return tomorrowTimes.sunrise;
}

function calculateNaturalTime(now: Date, location: Location): NaturalTime {
  const lastSunset = getPreviousSunset(now, location);
  const nextSunset = getNextSunset(now, location);
  const nextSunrise = getNextSunrise(now, location);
  
  // Calculate time since last sunset in seconds
  const secondsSinceSunset = (now.getTime() - lastSunset.getTime()) / 1000;
  
  // Full day is 24 hours from sunset to sunset
  const fullDaySeconds = (nextSunset.getTime() - lastSunset.getTime()) / 1000;
  
  // Convert to Natural Time (12:00 at sunset)
  // Each natural hour = fullDaySeconds / 24
  const naturalSecondsPerHour = fullDaySeconds / 24;
  const naturalSecondsPerMinute = naturalSecondsPerHour / 60;
  
  const totalNaturalSeconds = secondsSinceSunset;
  const totalNaturalMinutes = totalNaturalSeconds / 60;
  const totalNaturalHours = totalNaturalMinutes / 60;
  
  // Start from 12:00 at sunset
  const rawHours = 12 + (secondsSinceSunset / naturalSecondsPerHour);
  const hours = rawHours % 24;
  const minutes = (secondsSinceSunset % naturalSecondsPerHour) / naturalSecondsPerMinute;
  const seconds = (secondsSinceSunset % 60);
  
  // Determine if night or day based on actual sun position
  const isNight = now < nextSunrise && now >= lastSunset && nextSunrise.getTime() > now.getTime();
  const actualIsNight = now < nextSunrise || now >= getPreviousSunset(now, location);
  
  // More accurate night check
  const todayTimes = getSunTimes(now, location);
  const isActuallyNight = now < todayTimes.sunrise || now >= todayTimes.sunset;
  
  // Calculate phase
  let phase: 'night' | 'dawn' | 'day' | 'dusk';
  let phaseProgress: number;
  
  const dawnStart = new Date(todayTimes.sunrise.getTime() - 60 * 60 * 1000); // 1 hour before sunrise
  const duskStart = new Date(todayTimes.sunset.getTime() - 60 * 60 * 1000); // 1 hour before sunset
  
  if (now >= todayTimes.sunset || now < dawnStart) {
    phase = 'night';
    if (now >= todayTimes.sunset) {
      const nightEnd = new Date(todayTimes.sunset);
      nightEnd.setDate(nightEnd.getDate() + 1);
      const tomorrowTimes = getSunTimes(nightEnd, location);
      const nightDuration = tomorrowTimes.sunrise.getTime() - todayTimes.sunset.getTime();
      phaseProgress = (now.getTime() - todayTimes.sunset.getTime()) / nightDuration;
    } else {
      phaseProgress = 0.8;
    }
  } else if (now >= dawnStart && now < todayTimes.sunrise) {
    phase = 'dawn';
    phaseProgress = (now.getTime() - dawnStart.getTime()) / (60 * 60 * 1000);
  } else if (now >= duskStart && now < todayTimes.sunset) {
    phase = 'dusk';
    phaseProgress = (now.getTime() - duskStart.getTime()) / (60 * 60 * 1000);
  } else {
    phase = 'day';
    const dayDuration = duskStart.getTime() - todayTimes.sunrise.getTime();
    phaseProgress = (now.getTime() - todayTimes.sunrise.getTime()) / dayDuration;
  }
  
  // Sunset countdown
  const sunsetDiff = nextSunset.getTime() - now.getTime();
  const countdownHours = Math.floor(sunsetDiff / (1000 * 60 * 60));
  const countdownMinutes = Math.floor((sunsetDiff % (1000 * 60 * 60)) / (1000 * 60));
  const countdownSeconds = Math.floor((sunsetDiff % (1000 * 60)) / 1000);
  
  // Day and night lengths
  const dayLengthMs = todayTimes.sunset.getTime() - todayTimes.sunrise.getTime();
  const nightLengthMs = 24 * 60 * 60 * 1000 - dayLengthMs;
  
  return {
    hours: Math.floor(hours),
    minutes: Math.floor(minutes),
    seconds: Math.floor(seconds),
    totalSeconds: Math.floor(totalNaturalSeconds),
    isNight: isActuallyNight,
    phase,
    phaseProgress: Math.min(1, Math.max(0, phaseProgress)),
    sunsetCountdown: {
      hours: countdownHours,
      minutes: countdownMinutes,
      seconds: countdownSeconds,
      totalSeconds: Math.floor(sunsetDiff / 1000),
    },
    nextSunset,
    lastSunset,
    sunrise: nextSunrise,
    dayLength: dayLengthMs / (1000 * 60 * 60),
    nightLength: nightLengthMs / (1000 * 60 * 60),
  };
}

function calculateSeasonalTime(naturalTime: NaturalTime, now: Date, location: Location): SeasonalTime {
  const todayTimes = getSunTimes(now, location);
  const isNight = naturalTime.isNight;
  
  // In seasonal/temporal hours:
  // Night has 12 hours from sunset to sunrise
  // Day has 12 hours from sunrise to sunset
  
  let seasonalHours: number;
  let seasonalMinutes: number;
  let hourDuration: number; // in standard minutes
  
  if (isNight) {
    // Night period
    const nightDuration = naturalTime.nightLength * 60; // in minutes
    hourDuration = nightDuration / 12;
    
    const msSinceSunset = now.getTime() - naturalTime.lastSunset.getTime();
    const minutesSinceSunset = msSinceSunset / (1000 * 60);
    
    const seasonalProgress = minutesSinceSunset / nightDuration;
    const totalSeasonalHours = seasonalProgress * 12;
    
    seasonalHours = Math.floor(totalSeasonalHours);
    seasonalMinutes = Math.floor((totalSeasonalHours % 1) * 60);
  } else {
    // Day period
    const dayDuration = naturalTime.dayLength * 60; // in minutes
    hourDuration = dayDuration / 12;
    
    const msSinceSunrise = now.getTime() - todayTimes.sunrise.getTime();
    const minutesSinceSunrise = msSinceSunrise / (1000 * 60);
    
    const seasonalProgress = minutesSinceSunrise / dayDuration;
    const totalSeasonalHours = seasonalProgress * 12;
    
    seasonalHours = Math.floor(totalSeasonalHours);
    seasonalMinutes = Math.floor((totalSeasonalHours % 1) * 60);
  }
  
  return {
    ...naturalTime,
    seasonalHours: seasonalHours + (isNight ? 0 : 12), // Night: 0-11, Day: 12-23
    seasonalMinutes,
    hourDuration,
  };
}

export function useNaturalTime(location: Location | null, useSeasonalHours: boolean = false) {
  const [time, setTime] = useState<NaturalTime | SeasonalTime | null>(null);
  
  const updateTime = useCallback(() => {
    if (!location) return;
    
    const now = new Date();
    const naturalTime = calculateNaturalTime(now, location);
    
    if (useSeasonalHours) {
      setTime(calculateSeasonalTime(naturalTime, now, location));
    } else {
      setTime(naturalTime);
    }
  }, [location, useSeasonalHours]);
  
  useEffect(() => {
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [updateTime]);
  
  return time;
}

export function usePrayerTimes(location: Location | null) {
  const [prayerTimes, setPrayerTimes] = useState<Record<string, NaturalTime> | null>(null);
  
  useEffect(() => {
    if (!location) return;
    
    // Calculate prayer times in natural time format
    const now = new Date();
    const todayTimes = getSunTimes(now, location);
    
    // Simple prayer time calculations based on sun positions
    // These are approximate and would need proper Islamic jurisprudence calculations
    const fajrTime = new Date(todayTimes.sunrise.getTime() - 90 * 60 * 1000); // ~90 min before sunrise
    const sunriseTime = todayTimes.sunrise;
    const dhuhrTime = todayTimes.solarNoon;
    const asrTime = new Date(todayTimes.solarNoon.getTime() + (todayTimes.sunset.getTime() - todayTimes.solarNoon.getTime()) / 2);
    const maghribTime = todayTimes.sunset;
    const ishaTime = new Date(todayTimes.sunset.getTime() + 90 * 60 * 1000); // ~90 min after sunset
    
    const calculatePrayerNaturalTime = (prayerDate: Date) => calculateNaturalTime(prayerDate, location);
    
    setPrayerTimes({
      fajr: calculatePrayerNaturalTime(fajrTime),
      sunrise: calculatePrayerNaturalTime(sunriseTime),
      dhuhr: calculatePrayerNaturalTime(dhuhrTime),
      asr: calculatePrayerNaturalTime(asrTime),
      maghrib: calculatePrayerNaturalTime(maghribTime),
      isha: calculatePrayerNaturalTime(ishaTime),
    });
  }, [location]);
  
  return prayerTimes;
}
