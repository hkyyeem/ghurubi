import { useEffect, useCallback, lazy, Suspense } from 'react';
import { LocateFixed } from 'lucide-react';
import { SeoHead } from '@/components/SeoHead';
import { SiteFooter } from '@/components/SiteFooter';
import { useI18n } from '@/lib/i18n';
import { useGeolocation, useNaturalTime } from '@/hooks/useNaturalTime';
import { useLocalStorage, STORAGE_KEYS } from '@/hooks/useLocalStorage';
import { NavigationBar } from '@/components/NavigationBar';
import { HeroTimeDisplay } from '@/components/HeroTimeDisplay';
import { InfoGrid } from '@/components/InfoGrid';
import type { CityInfo } from '@/lib/cityCoordinates';

const PrayerTimesDisplay = lazy(() => import('@/components/PrayerTimesDisplay').then(m => ({ default: m.PrayerTimesDisplay })));

const Index = () => {
  const { t } = useI18n();
  const { location, setManualLocation, retryLocation, loading, error } = useGeolocation();

  // Persistent state with localStorage (sync initialization prevents flicker)
  const [showSeasonalHours, setShowSeasonalHours] = useLocalStorage(
    STORAGE_KEYS.SEASONAL_HOURS,
    false
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
      <SeoHead path="/" title={t.homeTitle} desc={t.homeDesc} />
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
          />
        </section>

        <div className="container-narrow flex flex-col items-center pb-4">
          <button
            type="button"
            onClick={() => retryLocation()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors disabled:opacity-70"
          >
            <LocateFixed className="w-4 h-4" aria-hidden />
            {loading ? t.locating : t.useMyLocation}
          </button>
          {error && <p className="mt-2 text-sm text-destructive" role="alert">{error}</p>}
        </div>
        
        {showPrayerTimes && (
          <section className="container-narrow pb-12">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                {t.prayer}
              </h2>
              <Suspense fallback={<p className="text-sm text-muted-foreground">{t.locating}</p>}>
                <PrayerTimesDisplay
                  location={location}
                  useSeasonalHours={showSeasonalHours}
                  hour12={hour12}
                />
              </Suspense>
            </div>
          </section>
        )}
        {/* Info Grid */}
        <InfoGrid time={time} />
        
      </main>
      
      <SiteFooter />
    </div>
  );
};

export default Index;
