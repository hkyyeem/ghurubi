/**
 * Prayer Time Calculations - Um Al-Qura Method
 * Based on proper Islamic jurisprudence calculations
 */

import SunCalc from 'suncalc';

export interface PrayerTimeConfig {
  method: 'umm-al-qura' | 'egyptian' | 'karachi' | 'isna' | 'mwl';
  asrJuristic: 'shafii' | 'hanafi'; // Shafii = 1x shadow, Hanafi = 2x shadow
  adjustments: PrayerAdjustments;
  isRamadan: boolean;
}

export interface PrayerAdjustments {
  fajr: number;
  sunrise: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

export interface PrayerTimesResult {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
}

export interface HijriDate {
  day: number;
  month: number;
  monthName: string;
  year: number;
  formatted: string;
}

const HIJRI_MONTHS = [
  'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
  'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
  'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
];

// Method angles for Fajr and Isha
const METHOD_ANGLES: Record<string, { fajr: number; isha: number }> = {
  'umm-al-qura': { fajr: 18.5, isha: 90 }, // Isha is 90min after Maghrib (not angle-based)
  'egyptian': { fajr: 19.5, isha: 17.5 },
  'karachi': { fajr: 18, isha: 18 },
  'isna': { fajr: 15, isha: 15 },
  'mwl': { fajr: 18, isha: 17 },
};

/**
 * Calculate prayer times using proper astronomical calculations
 */
export function calculatePrayerTimes(
  date: Date,
  latitude: number,
  longitude: number,
  config: PrayerTimeConfig
): PrayerTimesResult {
  const sunTimes = SunCalc.getTimes(date, latitude, longitude);
  const methodAngles = METHOD_ANGLES[config.method];
  
  // Fajr - when sun is at specified angle below horizon before sunrise
  const fajrAngle = methodAngles.fajr;
  const fajr = calculatePrayerTime(date, latitude, longitude, -fajrAngle, true);
  
  // Sunrise
  const sunrise = sunTimes.sunrise;
  
  // Dhuhr - solar noon + slight adjustment
  const dhuhr = new Date(sunTimes.solarNoon.getTime() + 2 * 60 * 1000); // 2 min safety margin
  
  // Asr - based on shadow length
  const asr = calculateAsrTime(date, latitude, longitude, config.asrJuristic);
  
  // Maghrib - sunset
  const maghrib = sunTimes.sunset;
  
  // Isha - Um Al-Qura specific handling
  let isha: Date;
  if (config.method === 'umm-al-qura') {
    if (config.isRamadan) {
      // Ramadan: Isha is exactly 120 minutes after Maghrib
      isha = new Date(maghrib.getTime() + 120 * 60 * 1000);
    } else {
      // Regular: Isha is 90 minutes after Maghrib
      isha = new Date(maghrib.getTime() + 90 * 60 * 1000);
    }
  } else {
    // Other methods use angle-based calculation
    isha = calculatePrayerTime(date, latitude, longitude, -methodAngles.isha, false);
  }
  
  // Apply manual adjustments
  return {
    fajr: applyAdjustment(fajr, config.adjustments.fajr),
    sunrise: applyAdjustment(sunrise, config.adjustments.sunrise),
    dhuhr: applyAdjustment(dhuhr, config.adjustments.dhuhr),
    asr: applyAdjustment(asr, config.adjustments.asr),
    maghrib: applyAdjustment(maghrib, config.adjustments.maghrib),
    isha: applyAdjustment(isha, config.adjustments.isha),
  };
}

function applyAdjustment(time: Date, minutes: number): Date {
  return new Date(time.getTime() + minutes * 60 * 1000);
}

/**
 * Calculate Asr time based on shadow length (Shafi'i or Hanafi)
 */
function calculateAsrTime(
  date: Date,
  latitude: number,
  longitude: number,
  juristic: 'shafii' | 'hanafi'
): Date {
  const sunTimes = SunCalc.getTimes(date, latitude, longitude);
  const solarNoon = sunTimes.solarNoon;
  
  // Get sun altitude at solar noon
  const noonPosition = SunCalc.getPosition(solarNoon, latitude, longitude);
  const noonAltitude = noonPosition.altitude * (180 / Math.PI);
  
  // Shadow ratio: Shafi'i = 1, Hanafi = 2
  const shadowRatio = juristic === 'shafii' ? 1 : 2;
  
  // Calculate the angle when shadow = object length * ratio
  // tan(angle) = 1 / (tan(noonAlt) + ratio)
  const tanNoonAlt = Math.tan(noonAltitude * Math.PI / 180);
  const asrAltitude = Math.atan(1 / (shadowRatio + tanNoonAlt)) * (180 / Math.PI);
  
  // Find time when sun reaches this altitude (afternoon)
  return findTimeForAltitude(date, latitude, longitude, asrAltitude, false);
}

/**
 * Calculate prayer time based on sun angle below horizon
 */
function calculatePrayerTime(
  date: Date,
  latitude: number,
  longitude: number,
  angle: number,
  beforeNoon: boolean
): Date {
  return findTimeForAltitude(date, latitude, longitude, angle, beforeNoon);
}

/**
 * Find the time when sun reaches a specific altitude
 */
function findTimeForAltitude(
  date: Date,
  latitude: number,
  longitude: number,
  targetAltitude: number,
  beforeNoon: boolean
): Date {
  const sunTimes = SunCalc.getTimes(date, latitude, longitude);
  const startTime = beforeNoon ? sunTimes.sunrise : sunTimes.solarNoon;
  const endTime = beforeNoon ? sunTimes.solarNoon : sunTimes.sunset;
  
  // If looking for time before sunrise
  if (beforeNoon && targetAltitude < 0) {
    const searchStart = new Date(sunTimes.sunrise.getTime() - 3 * 60 * 60 * 1000);
    const searchEnd = sunTimes.sunrise;
    return binarySearchAltitude(searchStart, searchEnd, latitude, longitude, targetAltitude, true);
  }
  
  // If looking for time after sunset
  if (!beforeNoon && targetAltitude < 0) {
    const searchStart = sunTimes.sunset;
    const searchEnd = new Date(sunTimes.sunset.getTime() + 3 * 60 * 60 * 1000);
    return binarySearchAltitude(searchStart, searchEnd, latitude, longitude, targetAltitude, false);
  }
  
  return binarySearchAltitude(startTime, endTime, latitude, longitude, targetAltitude, beforeNoon);
}

function binarySearchAltitude(
  start: Date,
  end: Date,
  latitude: number,
  longitude: number,
  targetAltitude: number,
  descending: boolean
): Date {
  let low = start.getTime();
  let high = end.getTime();
  
  while (high - low > 60000) { // 1 minute precision
    const mid = (low + high) / 2;
    const midDate = new Date(mid);
    const position = SunCalc.getPosition(midDate, latitude, longitude);
    const altitude = position.altitude * (180 / Math.PI);
    
    if (descending) {
      if (altitude > targetAltitude) {
        high = mid;
      } else {
        low = mid;
      }
    } else {
      if (altitude > targetAltitude) {
        low = mid;
      } else {
        high = mid;
      }
    }
  }
  
  return new Date((low + high) / 2);
}

/**
 * Convert Gregorian date to Hijri (Um Al-Qura approximation)
 */
export function toHijriDate(date: Date): HijriDate {
  // Um Al-Qura calendar calculation (simplified approximation)
  // For production, use a proper Hijri calendar library
  
  const jd = gregorianToJulian(date);
  const hijri = julianToHijri(jd);
  
  return {
    day: hijri.day,
    month: hijri.month,
    monthName: HIJRI_MONTHS[hijri.month - 1],
    year: hijri.year,
    formatted: `${hijri.day} ${HIJRI_MONTHS[hijri.month - 1]} ${hijri.year}`,
  };
}

function gregorianToJulian(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + 
         Math.floor(y / 4) - Math.floor(y / 100) + 
         Math.floor(y / 400) - 32045;
}

function julianToHijri(jd: number): { year: number; month: number; day: number } {
  const l = Math.floor(jd - 1948440 + 10632);
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + 
            Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - 
             Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * l3) / 709);
  const day = l3 - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  
  return { year, month, day };
}

/**
 * Check if current date is in Ramadan
 */
export function isRamadan(date: Date = new Date()): boolean {
  const hijri = toHijriDate(date);
  return hijri.month === 9; // Ramadan is the 9th month
}

/**
 * Get default prayer config
 */
export function getDefaultPrayerConfig(): PrayerTimeConfig {
  return {
    method: 'umm-al-qura',
    asrJuristic: 'shafii',
    adjustments: {
      fajr: 0,
      sunrise: 0,
      dhuhr: 0,
      asr: 0,
      maghrib: 0,
      isha: 0,
    },
    isRamadan: isRamadan(),
  };
}
