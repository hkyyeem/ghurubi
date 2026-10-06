import { useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useNaturalTime, type Location } from '@/hooks/useNaturalTime';
import { useLocalStorage, STORAGE_KEYS } from '@/hooks/useLocalStorage';
import { NavigationBar } from '@/components/NavigationBar';
import { HeroTimeDisplay } from '@/components/HeroTimeDisplay';
import { InfoGrid } from '@/components/InfoGrid';
import { getCityBySlug, citySlug, type CityInfo } from '@/lib/cityCoordinates';
import NotFound from './NotFound';

const BASE = 'https://ghurubi.com';

/** City page: fixed coordinates, no GPS request → instant render. */
const CityPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
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
  const title = `Ghurubi Time in ${city.name} — التوقيت الغروبي في ${city.nameAr} | Ghurubi`;
  const desc = `The current Ghurubi (sunset-based) time in ${city.name}, ${city.country}: the day begins at sunset (00:00), night first. Sunrise, sunset, day and night length. الوقت الآن في ${city.nameAr} بالتوقيت الغروبي.`;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={url} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: title,
          url,
          about: { '@type': 'City', name: city.name, alternateName: city.nameAr,
            geo: { '@type': 'GeoCoordinates', latitude: city.latitude, longitude: city.longitude },
            containedInPlace: { '@type': 'Country', name: city.country } },
          breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Ghurubi', item: `${BASE}/` },
            { '@type': 'ListItem', position: 2, name: 'Cities', item: `${BASE}/cities` },
            { '@type': 'ListItem', position: 3, name: city.name, item: url },
          ] },
        })}</script>
      </Helmet>
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
        <h1 className="sr-only">Ghurubi time in {city.name} — التوقيت الغروبي في {city.nameAr}</h1>
        <section className="container-narrow">
          <HeroTimeDisplay time={time} location={location} showSeasonalTime={showSeasonalHours} language="en" />
        </section>
        <InfoGrid time={time} />
      </main>
      <footer className="border-t border-border py-8 mt-8">
        <div className="container-narrow text-center text-sm text-muted-foreground">
          <Link to="/cities" className="hover:text-foreground">All cities</Link>
        </div>
      </footer>
    </div>
  );
};

export default CityPage;
