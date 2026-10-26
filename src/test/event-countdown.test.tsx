import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import EventPage from '@/pages/EventPage';
import { LanguageProvider } from '@/lib/i18n';
import { eventAtPhrase, eventSunsets } from '@/lib/i18nExtra';
import { ghurubiAt, sunsetsUntil, type Location } from '@/hooks/useNaturalTime';
import { STORAGE_KEYS } from '@/hooks/useLocalStorage';

const RIYADH: Location = { latitude: 24.7136, longitude: 46.6753 };
const MAKKAH: Location = { latitude: 21.4225, longitude: 39.8262 };

function hm(at: Date, location: Location, seasonal: boolean) {
  const clock = ghurubiAt(at, location, seasonal);
  return `${String(clock.hours).padStart(2, '0')}:${String(clock.minutes).padStart(2, '0')}`;
}

describe('event Ghurubi time', () => {
  const at = new Date('2026-10-26T11:53:00.000Z');

  it('reads 14:53 Riyadh as Ghurubi time, and sunset as 00:00', () => {
    expect(hm(at, RIYADH, false)).toBe('21:33');
    expect(hm(at, RIYADH, true)).toBe('21:25');
    expect(hm(at, MAKKAH, false)).not.toBe('21:33');

    const now = new Date('2026-10-26T11:56:00.000Z');
    const sunset = new Date('2026-10-26T14:19:08.309Z');
    expect(hm(sunset, RIYADH, false)).toBe('00:00');
    expect(hm(sunset, RIYADH, true)).toBe('00:00');
    expect(hm(new Date('2026-10-26T02:57:49.553Z'), RIYADH, true)).toBe('12:00');
    expect(sunsetsUntil(now, new Date('2026-10-26T13:00:00.000Z'), RIYADH)).toBe(0);
    expect(sunsetsUntil(now, new Date('2026-10-26T15:00:00.000Z'), RIYADH)).toBe(1);
    expect(sunsetsUntil(now, new Date('2026-10-28T15:00:00.000Z'), RIYADH)).toBe(3);
  });

  it('pluralises the sunset count in all four languages', () => {
    expect(eventSunsets('en', 1)).toBe('1 sunset until then');
    expect(eventSunsets('en', 3)).toBe('3 sunsets until then');
    expect(eventSunsets('ar', 1)).toBe('باقي غروب واحد حتى المناسبة');
    expect(eventSunsets('ar', 2)).toBe('باقي غروبان حتى المناسبة');
    expect(eventSunsets('ar', 5)).toBe('باقي 5 غروبات حتى المناسبة');
    expect(eventSunsets('ar', 11)).toBe('باقي 11 غروبًا حتى المناسبة');
    expect(eventSunsets('tr', 1)).toBe('1 gün batımı kaldı');
    expect(eventSunsets('tr', 4)).toBe('4 gün batımı kaldı');
    expect(eventSunsets('he', 1)).toBe('עוד שקיעה אחת');
    expect(eventSunsets('he', 2)).toBe('עוד שתי שקיעות');
    expect(eventSunsets('he', 5)).toBe('עוד 5 שקיעות');
    for (const lang of ['en', 'ar', 'tr', 'he'] as const) {
      const line = `${eventAtPhrase(lang, '21:25', 'Riyadh')} ${eventSunsets(lang, 2)}`;
      expect(line).not.toMatch(/AM|PM|زوال|local|مساء|صباح/);
    }
  });
});

function renderEvent(path: string, date: string) {
  window.history.pushState({}, '', `${path}?name=Eid&date=${encodeURIComponent(date)}`);
  localStorage.setItem(STORAGE_KEYS.SAVED_LOCATION, JSON.stringify({
    latitude: RIYADH.latitude,
    longitude: RIYADH.longitude,
    cityName: 'Riyadh',
    cityNameAr: 'الرياض',
  }));
  localStorage.setItem(STORAGE_KEYS.SEASONAL_HOURS, 'true');
  return render(
    <HelmetProvider>
      <LanguageProvider>
        <MemoryRouter initialEntries={[`${path}?name=Eid&date=${encodeURIComponent(date)}`]}>
          <EventPage />
        </MemoryRouter>
      </LanguageProvider>
    </HelmetProvider>,
  );
}

describe('countdown row order', () => {
  const date = '2027-06-01T12:00:00.000Z';

  afterEach(() => {
    localStorage.clear();
    window.history.pushState({}, '', '/');
  });

  it.each([
    ['/event', 'ltr', ['days', 'hours', 'minutes', 'seconds']],
    ['/ar/event', 'rtl', ['يوم', 'ساعة', 'دقيقة', 'ثانية']],
    ['/he/event', 'rtl', ['ימים', 'שעות', 'דקות', 'שניות']],
    ['/tr/event', 'ltr', ['gün', 'saat', 'dakika', 'saniye']],
  ] as const)('keeps %s boxes left-to-right in the DOM', (path, dir, labels) => {
    renderEvent(path, date);
    expect(document.documentElement).toHaveAttribute('dir', dir);
    const row = screen.getByTestId('countdown');
    expect(row).toHaveAttribute('dir', 'ltr');
    const texts = [...row.querySelectorAll('p')].map((node) => node.textContent);
    expect(texts.filter((_, index) => index % 2 === 1)).toEqual([...labels]);

    const line = screen.getByTestId('event-time').textContent || '';
    expect(line).toContain(hm(new Date(date), RIYADH, true));
    expect(line).not.toContain(date);
    expect(line).not.toMatch(/\b(AM|PM)\b|زوال/);
    const count = screen.getByTestId('sunsets').textContent || '';
    expect(count).not.toMatch(/^1 sunsets/);
    expect(count).not.toMatch(/باقي 1 غروب حتى/);
  });
});
