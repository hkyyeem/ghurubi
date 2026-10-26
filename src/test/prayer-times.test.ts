import { renderHook } from '@testing-library/react';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { calculatePrayerTimes, getDefaultPrayerConfig, type PrayerTimesResult } from '@/lib/prayerCalculations';
import { formatGhurubiHM, toGhurubiClock } from '@/lib/ghurubiClock';
import type { Location } from '@/hooks/useNaturalTime';

/**
 * Riyadh at 14:56 Arabia Standard Time on 26 Oct 2026 (15 Jumada I 1448).
 * The pre-PR #3 card in seasonal hours was Fajr 10:44, sunrise 12:00,
 * Dhuhr 18:02, Asr 21:59, Maghrib 00:00, Isha 01:25. That Asr is Riyadh with
 * tan(noon altitude) instead of cot(noon altitude): 15:25 civil, about 33
 * minutes after the adhan. Makkah with the same bug is 22:11 seasonal, so
 * 21:59 was not a stuck Makkah result.
 * Cot puts Asr at 14:52:44, whose nearest civil minute is 14:53.
 */
const AT = new Date('2026-10-26T11:56:00.000Z');
const RIYADH: Location = { latitude: 24.7136, longitude: 46.6753 };
const MAKKAH: Location = { latitude: 21.4225, longitude: 39.8262 };

function card(location: Location, seasonal: boolean) {
  const config = { ...getDefaultPrayerConfig(), isRamadan: false, asrJuristic: 'shafii' as const };
  const times = calculatePrayerTimes(AT, location.latitude, location.longitude, config);
  const out = {} as Record<keyof PrayerTimesResult, string>;
  for (const key of Object.keys(times) as (keyof PrayerTimesResult)[]) {
    out[key] = formatGhurubiHM(toGhurubiClock(times[key], location.latitude, location.longitude, seasonal));
  }
  return out;
}

/** Nearest civil minute in Arabia Standard Time. */
function civilMinute(date: Date) {
  const nearest = new Date(Math.round(date.getTime() / 60000) * 60000);
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Riyadh',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(nearest);
}

function asr(result: ReturnType<typeof usePrayerTimes>) {
  const prayer = result?.prayers.find((item) => item.name === 'asr');
  if (!prayer) throw new Error('missing asr');
  return prayer;
}

describe('Riyadh prayer times on 2026-10-26', () => {
  it('pins equal hours, with Asr corrected', () => {
    expect(card(RIYADH, false)).toEqual({
      fajr: '11:18',
      sunrise: '12:37',
      dhuhr: '18:20',
      asr: '21:32',
      maghrib: '00:00',
      isha: '01:30',
    });
  });

  it('pins seasonal hours, with sunrise at 12:00 and Asr corrected', () => {
    expect(card(RIYADH, true)).toEqual({
      fajr: '10:44',
      sunrise: '12:00',
      dhuhr: '18:02',
      asr: '21:25',
      maghrib: '00:00',
      isha: '01:25',
    });
  });

  it('places Shafii Asr on the 14:53 civil minute, and Hanafi later', () => {
    const shafii = { ...getDefaultPrayerConfig(), isRamadan: false, asrJuristic: 'shafii' as const };
    const hanafi = { ...shafii, asrJuristic: 'hanafi' as const };
    const shafiiAsr = calculatePrayerTimes(AT, RIYADH.latitude, RIYADH.longitude, shafii).asr;
    const hanafiAsr = calculatePrayerTimes(AT, RIYADH.latitude, RIYADH.longitude, hanafi).asr;
    expect(civilMinute(shafiiAsr)).toBe('14:53');
    expect(hanafiAsr.getTime()).toBeGreaterThan(shafiiAsr.getTime());
    // Makkah is a different civil minute, so a stuck default city cannot pass.
    const makkahAsr = calculatePrayerTimes(AT, MAKKAH.latitude, MAKKAH.longitude, shafii).asr;
    expect(civilMinute(makkahAsr)).not.toBe(civilMinute(shafiiAsr));
  });
});

describe('usePrayerTimes follows the selected coordinates', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(AT);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('changes Asr from Makkah to 14:53 civil in Riyadh, in both hour modes', () => {
    const { result, rerender } = renderHook(
      ({ location, seasonal }: { location: Location; seasonal: boolean }) =>
        usePrayerTimes(location, seasonal),
      { initialProps: { location: MAKKAH, seasonal: true } },
    );

    const makkahAsr = asr(result.current);
    expect(civilMinute(makkahAsr.time)).not.toBe('14:53');

    rerender({ location: RIYADH, seasonal: true });
    const seasonalAsr = asr(result.current);
    expect(seasonalAsr.time.getTime()).not.toBe(makkahAsr.time.getTime());
    expect(civilMinute(seasonalAsr.time)).toBe('14:53');
    expect(formatGhurubiHM(seasonalAsr.naturalTime)).toBe('21:25');
    expect(result.current?.prayers.map((prayer) => formatGhurubiHM(prayer.naturalTime))).toEqual([
      '10:44', '12:00', '18:02', '21:25', '00:00', '01:25',
    ]);

    rerender({ location: RIYADH, seasonal: false });
    const equalAsr = asr(result.current);
    expect(civilMinute(equalAsr.time)).toBe('14:53');
    expect(formatGhurubiHM(equalAsr.naturalTime)).toBe('21:32');
    expect(result.current?.prayers.map((prayer) => formatGhurubiHM(prayer.naturalTime))).toEqual([
      '11:18', '12:37', '18:20', '21:32', '00:00', '01:30',
    ]);
  });

  it('recomputes when the same location object gets new coordinates', () => {
    const location: Location = { latitude: MAKKAH.latitude, longitude: MAKKAH.longitude };
    const { result, rerender } = renderHook(
      (props: { location: Location }) => usePrayerTimes(props.location, false),
      { initialProps: { location } },
    );
    const before = asr(result.current).time.getTime();

    location.latitude = RIYADH.latitude;
    location.longitude = RIYADH.longitude;
    rerender({ location });

    const after = asr(result.current);
    expect(after.time.getTime()).not.toBe(before);
    expect(civilMinute(after.time)).toBe('14:53');
    expect(formatGhurubiHM(after.naturalTime)).toBe('21:32');
  });
});
