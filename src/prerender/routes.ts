import { MAJOR_CITIES, citySlug, getCityBySlug } from '@/lib/cityCoordinates';
import { cityName, langPath, type Lang } from '@/lib/i18n';

/**
 * Pilot cities. To prerender every city, set PRERENDER_ALL_CITIES=1
 * (or pass `{ allCities: true }`). That emits one HTML file per language
 * for each entry in MAJOR_CITIES — the ~388 localized city URLs.
 */
export const PILOT_CITY_SLUGS = [
  'riyadh',
  'makkah',
  'madinah',
  'jeddah',
  'dubai',
  'cairo',
  'istanbul',
  'gaziantep',
  'jerusalem',
  'london',
] as const;

const LANGS: Lang[] = ['en', 'ar', 'tr', 'he'];

export interface PrerenderTarget {
  /** URL path with no trailing slash. `/` is intentionally absent: it is the SPA fallback. */
  path: string;
  lang: Lang;
  citySlug?: string;
  /** Substring the built HTML must contain. */
  expect: string;
}

export function prerenderTargets(opts?: { allCities?: boolean }): PrerenderTarget[] {
  const slugs = opts?.allCities ? MAJOR_CITIES.map(citySlug) : [...PILOT_CITY_SLUGS];
  const out: PrerenderTarget[] = [];

  // Localized homepages have their own files. English `/` stays the shell that
  // unknown routes fall back to, so it is not overwritten with homepage HTML.
  for (const lang of ['ar', 'tr', 'he'] as const) {
    out.push({ path: langPath('/', lang), lang, expect: 'غروبي' });
  }

  for (const slug of slugs) {
    const city = getCityBySlug(slug);
    if (!city) throw new Error(`Unknown city slug in prerender list: ${slug}`);
    for (const lang of LANGS) {
      out.push({
        path: langPath(`/city/${slug}`, lang),
        lang,
        citySlug: slug,
        expect: cityName(city, lang),
      });
    }
  }

  for (const lang of LANGS) {
    out.push({
      path: langPath('/articles/sunset-workday', lang),
      lang,
      expect: lang === 'ar' ? 'يوم العمل بتوقيت غروبي' : 'The workday in Ghurubi time',
    });
  }

  if (out.some(t => t.path === '/')) {
    throw new Error('Refusing to prerender `/`: that file is the SPA fallback.');
  }
  return out;
}
