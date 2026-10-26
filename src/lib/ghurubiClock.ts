import SunCalc from 'suncalc';

export interface GhurubiClock {
  hours: number;
  minutes: number;
  seconds: number;
}

const shift = (date: Date, days: number) => new Date(date.getTime() + days * 86400000);
const sun = (date: Date, lat: number, lon: number) => SunCalc.getTimes(date, lat, lon, 0);

/**
 * Sunset that opened the Ghurubi day containing `at`, the next sunset,
 * and the sunrise between them. Shifts are in milliseconds, so the result
 * does not depend on the machine timezone.
 */
export function ghurubiDay(at: Date, lat: number, lon: number) {
  let start = sun(at, lat, lon).sunset;
  if (start.getTime() > at.getTime()) start = sun(shift(at, -1), lat, lon).sunset;
  let end = sun(shift(start, 1), lat, lon).sunset;
  if (end.getTime() - start.getTime() < 12 * 3600000) end = sun(shift(start, 2), lat, lon).sunset;
  const sunrise = sun(shift(start, 0.5), lat, lon).sunrise;
  return { start, end, sunrise };
}

/**
 * Clock time of an instant. Sunset is 00:00.
 * Equal hours are elapsed civil time. Seasonal hours give the night and the
 * day twelve hours each.
 */
export function toGhurubiClock(at: Date, lat: number, lon: number, seasonal: boolean): GhurubiClock {
  const { start, end, sunrise } = ghurubiDay(at, lat, lon);
  let totalSeconds: number;
  if (!seasonal) {
    totalSeconds = Math.max(0, (at.getTime() - start.getTime()) / 1000);
  } else if (at.getTime() < sunrise.getTime()) {
    const night = Math.max(1, sunrise.getTime() - start.getTime());
    totalSeconds = ((at.getTime() - start.getTime()) / night) * 12 * 3600;
  } else {
    const day = Math.max(1, end.getTime() - sunrise.getTime());
    totalSeconds = 12 * 3600 + ((at.getTime() - sunrise.getTime()) / day) * 12 * 3600;
  }
  const seconds = Math.max(0, Math.floor(totalSeconds));
  return {
    hours: Math.floor(seconds / 3600) % 24,
    minutes: Math.floor(seconds / 60) % 60,
    seconds: seconds % 60,
  };
}

export function formatGhurubiHM(clock: GhurubiClock): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(clock.hours)}:${p(clock.minutes)}`;
}
