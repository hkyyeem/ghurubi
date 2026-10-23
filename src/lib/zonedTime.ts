import tzlookup from 'tz-lookup';

/** IANA zone for a city. Same result on the build machine and in the browser. */
export function zoneOf(latitude: number, longitude: number): string {
  try { return tzlookup(latitude, longitude); } catch { return 'UTC'; }
}

export function zonedYmd(date: Date, timeZone: string): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find(p => p.type === type)?.value);
  return { year: get('year'), month: get('month'), day: get('day') };
}

/**
 * A Date whose local calendar fields are the city's calendar day.
 * date-fns and the Hijri converter both read local fields, so server and browser agree.
 */
export function zonedCivilDate(date: Date, timeZone: string): Date {
  const { year, month, day } = zonedYmd(date, timeZone);
  return new Date(year, month - 1, day, 12, 0, 0);
}

/** 24-hour HH:mm in the city's zone. This is the existing "local" sun-table reference, not the Ghurubi clock. */
export function formatHmInZone(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date);
  let hour = parts.find(p => p.type === 'hour')?.value ?? '00';
  const minute = parts.find(p => p.type === 'minute')?.value ?? '00';
  if (hour === '24') hour = '00';
  return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
}
