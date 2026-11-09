import { useEffect, useCallback, lazy, Suspense } from 'react';
import { LocateFixed, Hourglass } from 'lucide-react';
import { SeoHead } from '@/components/SeoHead';
import { SiteFooter } from '@/components/SiteFooter';
import { useI18n, cityName, langPath } from '@/lib/i18n';
import { useGeolocation, useNaturalTime } from '@/hooks/useNaturalTime';
import { TimeAnswer } from '@/components/TimeAnswer';
import { useLocalStorage, STORAGE_KEYS } from '@/hooks/useLocalStorage';
import { NavigationBar } from '@/components/NavigationBar';
import { HeroTimeDisplay } from '@/components/HeroTimeDisplay';
import { InfoGrid } from '@/components/InfoGrid';
import type { CityInfo } from '@/lib/cityCoordinates';

const PrayerTimesDisplay = lazy(() => import('@/components/PrayerTimesDisplay').then(m => ({ default: m.PrayerTimesDisplay })));

const Index = () => {
  const { t, lang } = useI18n();
  const { location, setManualLocation, retryLocation, loading, error } = useGeolocation();

  // Persistent state with localStorage (sync initialization prevents flicker)
  const [showSeasonalHours, setShowSeasonalHours] = useLocalStorage(
    STORAGE_KEYS.SEASONAL_HOURS,
    true
  );
  const [showPrayerTimes, setShowPrayerTimes] = useLocalStorage(
    STORAGE_KEYS.SHOW_PRAYER_TIMES,
    false
  );
  const [hour12, setHour12] = useLocalStorage(
    STORAGE_KEYS.HOUR12,
    false
  );
  
  const time = useNaturalTime(location, showSeasonalHours);
  
  // Apply day/night mode class to root
  useEffect(() => {
    if (time) {
      document.documentElement.classList.toggle('day-mode', !time.isNight);
    }
  }, [time?.isNight]);

  // Handle city selection from search
  const handleCitySelect = useCallback((city: CityInfo) => {
    setManualLocation({
      latitude: city.latitude,
      longitude: city.longitude,
      city: city,
    });
  }, [setManualLocation]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <SeoHead path="/" title={t.homeTitle} desc={t.homeDesc}>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: t.homeTitle,
          description: t.homeDesc,
          url: `https://ghurubi.com${langPath('/', lang)}`,
          inLanguage: lang,
          isPartOf: { '@id': 'https://ghurubi.com/#site' },
        })}</script>
      </SeoHead>
      {/* Navigation Bar */}
      <NavigationBar
        onCitySelect={handleCitySelect}
        currentCity={location?.city}
        isNight={time?.isNight ?? true}
        showSeasonalHours={showSeasonalHours}
        onToggleSeasonalHours={setShowSeasonalHours}
        showPrayerTimes={showPrayerTimes}
        onTogglePrayerTimes={setShowPrayerTimes}
        hour12={hour12}
        onToggleHour12={setHour12}
      />
      
      {/* Main content */}
      <main>
        <h1 className="sr-only">{t.homeTitle}</h1>
        {/* Hero Time Display */}
        <section className="container-narrow">
          <HeroTimeDisplay 
            time={time} 
            location={location}
            showSeasonalTime={showSeasonalHours}
            hour12={hour12}
            language="en"
            actions={<>
              <button
                type="button"
                onClick={() => retryLocation()}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors disabled:opacity-70"
              >
                <LocateFixed className="w-4 h-4" aria-hidden />
                {loading ? t.locating : t.useMyLocation}
              </button>
            </>}
            modeSwitch={
              <div role="radiogroup" title={t.seasonalSub} className="inline-flex items-center gap-1 rounded-full border border-border p-1 text-sm">
                <Hourglass className="w-4 h-4 mx-2 text-muted-foreground" aria-hidden />
                {([true, false] as const).map((val) => {
                  const active = showSeasonalHours === val;
                  return (
                    <button
                      key={String(val)}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setShowSeasonalHours(val)}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 transition-colors ${active ? 'bg-secondary text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      {active && <span className="w-2 h-2 rounded-full" style={{ background: val ? 'hsl(var(--seasonal-night))' : 'hsl(var(--equal-night))' }} aria-hidden />}
                      {val ? t.seasonal : t.equalHours}
                    </button>
                  );
                })}
              </div>
            }
          />
        </section>

        {error && <p className="container-narrow pb-4 text-center text-sm text-destructive" role="alert">{error}</p>}

        <TimeAnswer cityLabel={cityName(location?.city, lang) || t.useMyLocation} time={time} location={location} />
        
        {showPrayerTimes && (
          <section className="container-narrow pb-12">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                {t.prayer}
              </h2>
              <Suspense fallback={<p className="text-sm text-muted-foreground">{t.locating}</p>}>
                <PrayerTimesDisplay
                  key={`${location.latitude},${location.longitude}`}
                  location={location}
                  useSeasonalHours={showSeasonalHours}
                  hour12={hour12}
                />
              </Suspense>
            </div>
          </section>
        )}
        {/* Info Grid */}
        <InfoGrid time={time} location={location} />
        
      </main>
      
      <SiteFooter />
    </div>
  );
};

export default Index;
