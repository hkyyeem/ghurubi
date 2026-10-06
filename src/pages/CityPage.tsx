import { useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useNaturalTime, type Location } from '@/hooks/useNaturalTime';
import { useLocalStorage, STORAGE_KEYS } from '@/hooks/useLocalStorage';
import { NavigationBar } from '@/components/NavigationBar';
import { HeroTimeDisplay } from '@/components/HeroTimeDisplay';
import { InfoGrid } from '@/components/InfoGrid';
import { getCityBySlug, citySlug, type CityInfo } from '@/lib/cityCoordinates';
import NotFound from './NotFound';
import { SeoHead } from '@/components/SeoHead';
import { useI18n, cityName } from '@/lib/i18n';

const BASE = 'https://ghurubi.com';

/** City page: fixed coordinates, no GPS request → instant render. */
const CityPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { lang, t } = useI18n();
  const city = getCityBySlug(slug);
  const [showSeasonalHours, setShowSeasonalHours] = useLocalStorage(STORAGE_KEYS.SEASONAL_HOURS, false);
  const [showPrayerTimes, setShowPrayerTimes] = useLocalStorage(STORAGE_KEYS.SHOW_PRAYER_TIMES, false);

  const location: Location | null = useMemo(
    () => (city ? { latitude: city.latitude, longitude: city.longitude, city } : null),
    [city]
  );
  const time = useNaturalTime(location, showSeasonalHours);

  useEffect(() => {
    if (time) document.documentElement.classList.toggle('day-mode', !time.isNight);
  }, [time?.isNight]);

  if (!city) return <NotFound />;

  const url = `${BASE}/city/${citySlug(city)}`;
  const cn = cityName(city, lang);
  const title = t.cityTitle(cn);
  const desc = t.cityDesc(cn);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <SeoHead path={`/city/${citySlug(city)}`} title={title} desc={desc}>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: title,
          url,
          about: { '@type': 'City', name: city.name, alternateName: [city.nameAr, cityName(city,'tr'), cityName(city,'he')],
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
      </main>
      <footer className="border-t border-border py-8 mt-8">
        <div className="container-narrow text-center text-sm text-muted-foreground">
          <Link to="/cities" className="hover:text-foreground">{t.allCities}</Link>
        </div>
      </footer>
    </div>
  );
};

export default CityPage;
