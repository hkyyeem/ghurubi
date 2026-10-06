import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useNaturalTime, type Location } from '@/hooks/useNaturalTime';
import { useLocalStorage, STORAGE_KEYS } from '@/hooks/useLocalStorage';
import { NavigationBar } from '@/components/NavigationBar';
import { HeroTimeDisplay } from '@/components/HeroTimeDisplay';
import { InfoGrid } from '@/components/InfoGrid';
import { SiteFooter } from '@/components/SiteFooter';
import { MAJOR_CITIES, getCityBySlug, citySlug, compareSlug, type CityInfo } from '@/lib/cityCoordinates';
import { resolveCitySlug } from '@/lib/searchCity';
import { SeoHead } from '@/components/SeoHead';
import { useI18n, cityName } from '@/lib/i18n';
import { useX } from '@/lib/i18nExtra';

const BASE = 'https://ghurubi.com';
const NEAR_PICKS = ['makkah', 'riyadh', 'cairo', 'istanbul', 'jerusalem', 'dubai', 'london', 'new-york'];

/** City page: fixed coordinates, no GPS request → instant render. Unknown cities are looked up worldwide. */
const CityPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { lang, t } = useI18n();
  const x = useX();
  const builtIn = getCityBySlug(slug);
  const [found, setFound] = useState<CityInfo | null | undefined>(undefined);
  const city = builtIn ?? found ?? undefined;

  useEffect(() => {
    if (builtIn || !slug) return;
    setFound(undefined);
    resolveCitySlug(slug).then(setFound).catch(() => setFound(null));
  }, [slug, builtIn]);

  const [showSeasonalHours, setShowSeasonalHours] = useLocalStorage(STORAGE_KEYS.SEASONAL_HOURS, false);
  const [showPrayerTimes, setShowPrayerTimes] = useLocalStorage(STORAGE_KEYS.SHOW_PRAYER_TIMES, false);
  const location: Location | null = useMemo(
    () => (city ? { latitude: city.latitude, longitude: city.longitude, city } : null), [city]);
  const time = useNaturalTime(location, showSeasonalHours);

  useEffect(() => {
    if (time) document.documentElement.classList.toggle('day-mode', !time.isNight);
  }, [time?.isNight]);

  if (!city) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">{found === null ? x.notFound : x.loading}</p>
      </div>
    );
  }

  const s = citySlug(city);
  const url = `${BASE}/city/${s}`;
  const cn = cityName(city, lang);
  const title = t.cityTitle(cn);
  const desc = t.cityDesc(cn);
  const others = NEAR_PICKS.map(p => getCityBySlug(p)).filter((c): c is CityInfo => !!c && citySlug(c) !== s);
  const inList = MAJOR_CITIES.some(c => citySlug(c) === s);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <SeoHead path={`/city/${s}`} title={title} desc={desc}>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: title,
          url,
          about: { '@type': 'City', name: city.name, alternateName: [city.nameAr, cityName(city, 'tr'), cityName(city, 'he')],
            geo: { '@type': 'GeoCoordinates', latitude: city.latitude, longitude: city.longitude },
            containedInPlace: { '@type': 'Country', name: city.country } },
          breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Ghurubi', item: `${BASE}/` },
            { '@type': 'ListItem', position: 2, name: 'Cities', item: `${BASE}/cities` },
            { '@type': 'ListItem', position: 3, name: city.name, item: url },
          ] },
        })}</script>
      </SeoHead>
      <NavigationBar
        onCitySelect={(c: CityInfo) => navigate(`/city/${citySlug(c)}`)}
        currentCity={city}
        isNight={time?.isNight ?? true}
        showSeasonalHours={showSeasonalHours}
        onToggleSeasonalHours={setShowSeasonalHours}
        showPrayerTimes={showPrayerTimes}
        onTogglePrayerTimes={setShowPrayerTimes}
      />
      <main>
        <h1 className="sr-only">{title}</h1>
        <section className="container-narrow">
          <HeroTimeDisplay time={time} location={location} showSeasonalTime={showSeasonalHours} />
        </section>
        <InfoGrid time={time} />
        {inList && (
          <section className="container-narrow mt-10 text-sm">
            <h2 className="font-semibold mb-3">{x.compareWith(cn)}</h2>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground">
              {others.map(o => (
                <li key={citySlug(o)}><Link className="hover:text-foreground hover:underline" to={`/compare/${compareSlug(city, o)}`}>{cityName(o, lang)}</Link></li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
};

export default CityPage;
