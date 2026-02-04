import { useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGeolocation, useNaturalTime } from '@/hooks/useNaturalTime';
import { useLocalStorage, STORAGE_KEYS } from '@/hooks/useLocalStorage';
import { NavigationBar } from '@/components/NavigationBar';
import { HeroTimeDisplay } from '@/components/HeroTimeDisplay';
import { InfoGrid } from '@/components/InfoGrid';
import { PrayerTimesDisplay } from '@/components/PrayerTimesDisplay';
import type { CityInfo } from '@/lib/cityCoordinates';

const Index = () => {
  const { location, setManualLocation } = useGeolocation();
  
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
        {/* Hero Time Display */}
        <section className="container-narrow">
          <HeroTimeDisplay 
            time={time} 
            location={location}
            showSeasonalTime={showSeasonalHours}
            language="en"
          />
        </section>
        
        {/* Info Grid */}
        <InfoGrid time={time} />
        
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
                  Prayer Times
                </h2>
                <PrayerTimesDisplay 
                  location={location} 
                  useSeasonalHours={showSeasonalHours}
                />
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border py-8 mt-8">
        <div className="container-narrow text-center text-sm text-muted-foreground">
          <p>Ghurubi Time — Natural time based on the solar cycle</p>
          <p className="mt-1 text-xs">Sunset = 00:00 • Night precedes Day</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
