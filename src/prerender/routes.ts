import { MAJOR_CITIES, citySlug, getCityBySlug } from '@/lib/cityCoordinates';
import { cityName, langPath, type Lang } from '@/lib/i18n';

/**
 * Unprefixed paths in public/sitemap.xml, aside from /city/:slug and /now.
 * English lives at the path itself; ar/tr/he get a prefix. `/` is the English
 * homepage and is written to dist/index.html.
 */
export const SITEMAP_STATIC_PATHS = [
  '/',
  '/watch',
  '/about',
  '/wear',
  '/cities',
  '/compare',
  '/event',
  '/sitemap',
  '/privacy',
  '/articles',
  '/articles/sunset-workday',
] as const;

const LANGS: Lang[] = ['en', 'ar', 'tr', 'he'];

export interface PrerenderTarget {
  /** URL path with no trailing slash, except `/` itself. */
  path: string;
  lang: Lang;
  citySlug?: string;
  /** Substring the built HTML must contain. */
  expect: string;
  /** City and static pages advertise hreflang. /now does not; it has no language prefix. */
  hreflang: boolean;
}

function staticExpect(path: string, lang: Lang): string {
  if (path === '/articles/sunset-workday') {
    return lang === 'ar' ? 'يوم العمل بتوقيت غروبي' : 'The workday in Ghurubi time';
  }
  return lang === 'ar' ? 'غروبي' : 'Ghurubi';
}

/** Every URL the sitemap lists. This is the default build, not a pilot flag. */
export function prerenderTargets(): PrerenderTarget[] {
  const out: PrerenderTarget[] = [];

  for (const path of SITEMAP_STATIC_PATHS) {
    for (const lang of LANGS) {
      out.push({ path: langPath(path, lang), lang, expect: staticExpect(path, lang), hreflang: true });
    }
  }

  for (const city of MAJOR_CITIES) {
    const slug = citySlug(city);
    if (!getCityBySlug(slug)) throw new Error(`City slug did not round-trip: ${slug}`);
    for (const lang of LANGS) {
      out.push({
        path: langPath(`/city/${slug}`, lang),
        lang,
        citySlug: slug,
        expect: cityName(city, lang),
        hreflang: true,
      });
    }
  }

  // /now is plain text for assistants and is not under a language prefix.
  out.push({ path: '/now', lang: 'ar', expect: 'غروبي', hreflang: false });
  for (const city of MAJOR_CITIES) {
    out.push({
      path: `/now/${citySlug(city)}`,
      lang: 'ar',
      citySlug: citySlug(city),
      expect: city.nameAr,
      hreflang: false,
    });
  }

  const paths = out.map(t => t.path);
  if (new Set(paths).size !== paths.length) {
    throw new Error('Duplicate prerender path');
  }
  return out;
}
