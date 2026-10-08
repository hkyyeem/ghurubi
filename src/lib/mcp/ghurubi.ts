import SunCalc from "suncalc";
import { MAJOR_CITIES, citySlug, type CityInfo } from "@/lib/cityCoordinates";
import { calculatePrayerTimes, getDefaultPrayerConfig, isRamadan } from "@/lib/prayerCalculations";

export function resolveCity(query: string): CityInfo | undefined {
  const q = query.trim().toLowerCase();
  return MAJOR_CITIES.find(
    (c) => citySlug(c) === q || c.name.toLowerCase() === q || c.nameAr === query.trim(),
  );
}

const sunsetOf = (d: Date, lat: number, lon: number) => SunCalc.getTimes(d, lat, lon, 0).sunset;
const sunriseOf = (d: Date, lat: number, lon: number) => SunCalc.getTimes(d, lat, lon, 0).sunrise;
const shift = (d: Date, days: number) => new Date(d.getTime() + days * 86400000);

/** The sunset that began the current Ghurubi day, and the next one. */
export function ghurubiDayBounds(now: Date, lat: number, lon: number) {
  const noon = new Date(now);
  let start = sunsetOf(noon, lat, lon);
  if (start.getTime() > now.getTime()) start = sunsetOf(shift(noon, -1), lat, lon);
  let end = sunsetOf(shift(start, 1), lat, lon);
  if (end.getTime() - start.getTime() < 12 * 3600000) end = sunsetOf(shift(start, 2), lat, lon);
  return { start, end };
}

/** Elapsed time since the day-starting sunset, as HH:MM:SS (sunset = 00:00:00). */
export function toGhurubi(at: Date, daySunset: Date): string {
  const s = Math.max(0, Math.floor((at.getTime() - daySunset.getTime()) / 1000));
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(Math.floor(s / 3600) % 24)}:${p(Math.floor((s % 3600) / 60))}:${p(s % 60)}`;
}

export function ghurubiNow(lat: number, lon: number, now = new Date()) {
  const { start, end } = ghurubiDayBounds(now, lat, lon);
  const sunrise = sunriseOf(shift(start, 0.5), lat, lon);
  const isNight = now.getTime() < sunrise.getTime();
  const nightMs = sunrise.getTime() - start.getTime();
  const dayMs = end.getTime() - sunrise.getTime();
  // Seasonal hours: night and day each split into 12 equal hours.
  const frac = isNight
    ? (now.getTime() - start.getTime()) / nightMs
    : (now.getTime() - sunrise.getTime()) / dayMs;
  const seasonalSec = Math.floor(frac * 12 * 3600) + (isNight ? 0 : 12 * 3600);
  const p = (n: number) => String(n).padStart(2, "0");
  const seasonal = `${p(Math.floor(seasonalSec / 3600))}:${p(Math.floor((seasonalSec % 3600) / 60))}:${p(seasonalSec % 60)}`;
  const mins = (ms: number) => Math.round(ms / 60000);
  return {
    ghurubiTime: toGhurubi(now, start),
    seasonalTime: seasonal,
    period: isNight ? "night" : "day",
    sunriseGhurubi: toGhurubi(sunrise, start),
    nightLengthMinutes: mins(nightMs),
    dayLengthMinutes: mins(dayMs),
    minutesToNextSunset: mins(end.getTime() - now.getTime()),
    daySunset: start,
  };
}

export function prayerTimesGhurubi(lat: number, lon: number, now = new Date()) {
  const { start } = ghurubiDayBounds(now, lat, lon);
  const daytime = shift(start, 0.6); // the civil date of the daylight part of this Ghurubi day
  const cfg = { ...getDefaultPrayerConfig(), isRamadan: isRamadan(daytime) };
  const before = calculatePrayerTimes(shift(start, 0.1), lat, lon, cfg); // maghrib/isha of the start sunset
  const day = calculatePrayerTimes(daytime, lat, lon, cfg);
  return {
    maghrib: toGhurubi(start, start),
    isha: toGhurubi(before.isha.getTime() > start.getTime() ? before.isha : new Date(start.getTime() + 90 * 60000), start),
    fajr: toGhurubi(day.fajr, start),
    sunrise: toGhurubi(day.sunrise, start),
    dhuhr: toGhurubi(day.dhuhr, start),
    asr: toGhurubi(day.asr, start),
  };
}
