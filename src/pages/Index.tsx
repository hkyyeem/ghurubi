import { useEffect, useCallback } from 'react';
import { SeoHead } from '@/components/SeoHead';
import { SiteFooter } from '@/components/SiteFooter';
import { useI18n } from '@/lib/i18n';
import { AnimatePresence, motion } from 'framer-motion';
import { useGeolocation, useNaturalTime } from '@/hooks/useNaturalTime';
import { useLocalStorage, STORAGE_KEYS } from '@/hooks/useLocalStorage';
import { NavigationBar } from '@/components/NavigationBar';
import { HeroTimeDisplay } from '@/components/HeroTimeDisplay';
import { InfoGrid } from '@/components/InfoGrid';
import { PrayerTimesDisplay } from '@/components/PrayerTimesDisplay';
import type { CityInfo } from '@/lib/cityCoordinates';

const Index = () => {
  const { t } = useI18n();
  const { location, setManualLocation, retryLocation } = useGeolocation();
  // Always refresh real location on open (same behaviour as the watch)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retryLocation(); }, []);
  
  // Persistent state with localStorage (sync initialization prevents flicker)
  const [showSeasonalHours, setShowSeasonalHours] = useLocalStorage(
    STORAGE_KEYS.SEASONAL_HOURS,
    false
  );
  const [showPrayerTimes, setShowPrayerTimes] = useLocalStorage(
    STORAGE_KEYS.SHOW_PRAYER_TIMES,
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
            language="en"
          />
        </section>
        
        {/* Prayer times section - optional */}
        <AnimatePresence>
          {showPrayerTimes && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="container-narrow pb-12"
            >
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  {t.prayer}
                </h2>
                <PrayerTimesDisplay 
                  location={location} 
                  useSeasonalHours={showSeasonalHours}
                />
              </div>
            </motion.section>
          )}
        </AnimatePresence>
        {/* Info Grid */}
        <InfoGrid time={time} />
        
      </main>
      
      <SiteFooter />
    </div>
  );
};

export default Index;
