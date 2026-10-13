import tzlookup from 'tz-lookup';
import type { CityInfo } from '@/lib/cityCoordinates';

/** Civil UTC offset in minutes for a city at a given moment. */
export function civilOffset(c: CityInfo, at: Date): number | null {
  try {
    const tz = tzlookup(c.latitude, c.longitude);
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'longOffset' }).formatToParts(at);
    const v = parts.find(p => p.type === 'timeZoneName')?.value ?? 'GMT';
    const m = v.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
    if (!m) return 0;
    return (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3] ?? 0));
  } catch { return null; }
}

/** "#New York" -> "#NewYork" */
export const hashtag = (name: string) => '#' + name.replace(/[\s\-'’.]+/g, '').replace(/[^\p{L}\p{N}_]/gu, '');
