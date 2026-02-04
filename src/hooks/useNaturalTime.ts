import { useState, useEffect, useCallback } from 'react';
import SunCalc from 'suncalc';
import { findNearestCity, DEFAULT_CITY, type CityInfo } from '@/lib/cityCoordinates';
import { STORAGE_KEYS, type SavedLocation } from '@/hooks/useLocalStorage';

export interface NaturalTime {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isNight: boolean;
  phase: 'night' | 'dawn' | 'day' | 'dusk';
  phaseProgress: number;
  sunsetCountdown: {
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
  };
  nextSunset: Date;
  lastSunset: Date;
  sunrise: Date;
  dayLength: number;
  nightLength: number;
}

export interface SeasonalTime extends NaturalTime {
  seasonalHours: number;
  seasonalMinutes: number;
  seasonalSeconds: number;
  hourDuration: number;
}

export interface Location {
  latitude: number;
  longitude: number;
  altitude?: number;
  city?: CityInfo;
}

// Read saved location from localStorage (sync read)
function getSavedLocation(): SavedLocation | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const saved = window.localStorage.getItem(STORAGE_KEYS.SAVED_LOCATION);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

// Save location to localStorage
function saveLocation(location: Location): void {
  if (typeof window === 'undefined') return;
  
  try {
    const toSave: SavedLocation = {
      latitude: location.latitude,
      longitude: location.longitude,
      cityName: location.city?.name,
      cityNameAr: location.city?.nameAr,
    };
    window.localStorage.setItem(STORAGE_KEYS.SAVED_LOCATION, JSON.stringify(toSave));
  } catch (error) {
    console.warn('Error saving location:', error);
  }
}

export function useGeolocation() {
  // Initialize with saved location or default (sync read to prevent flicker)
  const [location, setLocation] = useState<Location>(() => {
    const saved = getSavedLocation();
    if (saved) {
      return {
        latitude: saved.latitude,
        longitude: saved.longitude,
        city: saved.cityName ? {
          name: saved.cityName,
          nameAr: saved.cityNameAr || saved.cityName,
          latitude: saved.latitude,
          longitude: saved.longitude,
          country: '',
          countryAr: '',
        } : undefined,
      };
    }
    return {
      ...DEFAULT_CITY,
      city: DEFAULT_CITY,
    };
  });
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUsingDefault, setIsUsingDefault] = useState(() => {
    return !getSavedLocation();
  });
  const [retryCount, setRetryCount] = useState(0);

  // Manual location setter for city search
  const setManualLocation = useCallback((newLocation: Location) => {
    setLocation(newLocation);
    saveLocation(newLocation);
    setIsUsingDefault(false);
    setLoading(false);
    setError(null);
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('متصفحك لا يدعم تحديد الموقع');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, altitude } = position.coords;
        
        // Find nearest city and use its center coordinates
        const nearestCity = findNearestCity(latitude, longitude);
        
        let newLocation: Location;
        
        if (nearestCity) {
          // Use city center coordinates for consistency
          newLocation = {
            latitude: nearestCity.latitude,
            longitude: nearestCity.longitude,
            altitude: altitude || 0,
            city: nearestCity,
          };
        } else {
          // No nearby city found, use exact coordinates
          newLocation = {
            latitude,
            longitude,
            altitude: altitude || 0,
          };
        }
        
        setLocation(newLocation);
        saveLocation(newLocation);
        setIsUsingDefault(false);
        setLoading(false);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        let errorMessage = 'تعذر تحديد الموقع';
        if (err.code === 1) {
          errorMessage = 'يرجى السماح بالوصول للموقع';
        } else if (err.code === 2) {
          errorMessage = 'الموقع غير متاح حالياً';
        } else if (err.code === 3) {
          errorMessage = 'انتهت مهلة تحديد الموقع';
        }
        setError(errorMessage);
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  useEffect(() => {
    // Only request new location if no saved location exists
    const saved = getSavedLocation();
    if (saved) {
      setLoading(false);
      return;
    }
    
    const timer = setTimeout(() => {
      requestLocation();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [retryCount, requestLocation]);

  const retryLocation = useCallback(() => {
    setRetryCount(c => c + 1);
    requestLocation();
  }, [requestLocation]);

  const clearSavedLocation = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEYS.SAVED_LOCATION);
    }
    setIsUsingDefault(true);
    requestLocation();
  }, [requestLocation]);

  return { location, error, loading, isUsingDefault, retryLocation, clearSavedLocation, setManualLocation };
}

function getSunTimes(date: Date, location: Location) {
  return SunCalc.getTimes(date, location.latitude, location.longitude, location.altitude || 0);
}

function getPreviousSunset(now: Date, location: Location): Date {
  const todayTimes = getSunTimes(now, location);
  
  if (now >= todayTimes.sunset) {
    return todayTimes.sunset;
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  return getSunTimes(yesterday, location).sunset;
}

function getNextSunset(now: Date, location: Location): Date {
  const todayTimes = getSunTimes(now, location);
  
  if (now < todayTimes.sunset) {
    return todayTimes.sunset;
  }
  
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getSunTimes(tomorrow, location).sunset;
}

function getNextSunrise(now: Date, location: Location): Date {
  const todayTimes = getSunTimes(now, location);
  
  if (now < todayTimes.sunrise) {
    return todayTimes.sunrise;
  }
  
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getSunTimes(tomorrow, location).sunrise;
}

function calculateNaturalTime(now: Date, location: Location): NaturalTime {
  const lastSunset = getPreviousSunset(now, location);
  const nextSunset = getNextSunset(now, location);
  const todayTimes = getSunTimes(now, location);
  
  // Calculate time since last sunset in milliseconds
  const msSinceSunset = now.getTime() - lastSunset.getTime();
  const secondsSinceSunset = msSinceSunset / 1000;
  
  // Full day is 24 standard hours (86400 seconds)
  // Sunset = 00:00:00 (start of day, Night First!)
  const SECONDS_PER_DAY = 86400;
  const SECONDS_PER_HOUR = 3600;
  const SECONDS_PER_MINUTE = 60;
  
  // Natural time starts at 00:00:00 at sunset
  const totalNaturalSeconds = secondsSinceSunset % SECONDS_PER_DAY;
  const hours = Math.floor(totalNaturalSeconds / SECONDS_PER_HOUR);
  const minutes = Math.floor((totalNaturalSeconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
  const seconds = Math.floor(totalNaturalSeconds % SECONDS_PER_MINUTE);
  
  // Determine if night or day based on actual sun position
  const isActuallyNight = now < todayTimes.sunrise || now >= todayTimes.sunset;
  
  // Calculate phase
  let phase: 'night' | 'dawn' | 'day' | 'dusk';
  let phaseProgress: number;
  
  const dawnStart = new Date(todayTimes.sunrise.getTime() - 60 * 60 * 1000);
  const duskStart = new Date(todayTimes.sunset.getTime() - 60 * 60 * 1000);
  
  if (now >= todayTimes.sunset || now < dawnStart) {
    phase = 'night';
    if (now >= todayTimes.sunset) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowTimes = getSunTimes(tomorrow, location);
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
    hours,
    minutes,
    seconds,
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
    sunrise: getNextSunrise(now, location),
    dayLength: dayLengthMs / (1000 * 60 * 60),
    nightLength: nightLengthMs / (1000 * 60 * 60),
  };
}

function calculateSeasonalTime(naturalTime: NaturalTime, now: Date, location: Location): SeasonalTime {
  const todayTimes = getSunTimes(now, location);
  const isNight = naturalTime.isNight;
  
  // Seasonal/Temporal hours: Night = 12 hours, Day = 12 hours
  // Each period's hour duration varies by season
  
  let seasonalHours: number;
  let seasonalMinutes: number;
  let seasonalSeconds: number;
  let hourDuration: number;
  
  if (isNight) {
    // Night period (starts at sunset = 00:00)
    const nightDurationMs = naturalTime.nightLength * 60 * 60 * 1000;
    hourDuration = naturalTime.nightLength * 60 / 12; // minutes per seasonal hour
    
    const msSinceSunset = now.getTime() - naturalTime.lastSunset.getTime();
    const seasonalProgress = msSinceSunset / nightDurationMs;
    const totalSeasonalTime = seasonalProgress * 12 * 60 * 60; // in seconds
    
    seasonalHours = Math.floor(totalSeasonalTime / 3600);
    seasonalMinutes = Math.floor((totalSeasonalTime % 3600) / 60);
    seasonalSeconds = Math.floor(totalSeasonalTime % 60);
  } else {
    // Day period (starts at sunrise = 12:00)
    const dayDurationMs = naturalTime.dayLength * 60 * 60 * 1000;
    hourDuration = naturalTime.dayLength * 60 / 12;
    
    const msSinceSunrise = now.getTime() - todayTimes.sunrise.getTime();
    const seasonalProgress = msSinceSunrise / dayDurationMs;
    const totalSeasonalTime = seasonalProgress * 12 * 60 * 60;
    
    seasonalHours = 12 + Math.floor(totalSeasonalTime / 3600);
    seasonalMinutes = Math.floor((totalSeasonalTime % 3600) / 60);
    seasonalSeconds = Math.floor(totalSeasonalTime % 60);
  }
  
  return {
    ...naturalTime,
    // Override base time with seasonal time when in seasonal mode
    hours: seasonalHours,
    minutes: seasonalMinutes,
    seconds: seasonalSeconds,
    seasonalHours,
    seasonalMinutes,
    seasonalSeconds,
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
