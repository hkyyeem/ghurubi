import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGeolocation, useNaturalTime } from '@/hooks/useNaturalTime';
import { AnalogClock } from '@/components/AnalogClock';
import { TimeDisplay } from '@/components/TimeDisplay';
import { SunsetCountdown } from '@/components/SunsetCountdown';
import { DayNightIndicator } from '@/components/DayNightIndicator';
import { PrayerTimesDisplay } from '@/components/PrayerTimesDisplay';
import { SettingsPanel } from '@/components/SettingsPanel';
import { LocationDisplay } from '@/components/LocationDisplay';
import { StarField } from '@/components/StarField';

const Index = () => {
  const { location, loading, error } = useGeolocation();
  const [showSeasonalHours, setShowSeasonalHours] = useState(false);
  const [showPrayerTimes, setShowPrayerTimes] = useState(false);
  
  const time = useNaturalTime(location, showSeasonalHours);
  
  // Apply day/night mode class to root
  useEffect(() => {
    if (time) {
      document.documentElement.classList.toggle('day-mode', !time.isNight);
    }
  }, [time?.isNight]);

  // Sky background based on phase
  const getSkyGradient = () => {
    if (!time) return 'sky-gradient-night';
    
    switch (time.phase) {
      case 'dawn':
      case 'dusk':
        return 'sky-gradient-sunset';
      case 'day':
        return 'sky-gradient-day';
      default:
        return 'sky-gradient-night';
    }
  };

  return (
    <div 
      className={`min-h-screen transition-all duration-[3000ms] relative overflow-hidden ${getSkyGradient()}`}
      dir="rtl"
    >
      {/* Star field for night */}
      <StarField count={120} visible={time?.isNight ?? true} />
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header 
          className="pt-8 pb-4 px-4 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-4xl md:text-5xl text-primary mb-2">
            ساعة الأرض
          </h1>
          <p className="font-body text-muted-foreground text-sm md:text-base">
            التوقيت الطبيعي • الغروب هو الصفر
          </p>
        </motion.header>
        
        {/* Main clock section */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-6">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12 max-w-6xl w-full">
            {/* Clock column */}
            <div className="flex flex-col items-center gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <AnalogClock 
                  time={time} 
                  size={Math.min(340, typeof window !== 'undefined' ? window.innerWidth - 60 : 340)} 
                  showSeasonalMarkers={showSeasonalHours}
                />
              </motion.div>
              
              <TimeDisplay 
                time={time} 
                showSeasonalTime={showSeasonalHours}
              />
              
              <LocationDisplay
                latitude={location?.latitude ?? null}
                longitude={location?.longitude ?? null}
                loading={loading}
                error={error}
              />
            </div>
            
            {/* Info panels column */}
            <div className="flex flex-col gap-4 w-full lg:w-80">
              <SunsetCountdown time={time} />
              
              <DayNightIndicator time={time} />
              
              <SettingsPanel
                showSeasonalHours={showSeasonalHours}
                onToggleSeasonalHours={setShowSeasonalHours}
                showPrayerTimes={showPrayerTimes}
                onTogglePrayerTimes={setShowPrayerTimes}
              />
            </div>
          </div>
          
          {/* Prayer times section */}
          <AnimatePresence>
            {showPrayerTimes && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full max-w-2xl mt-8"
              >
                <PrayerTimesDisplay location={location} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        
        {/* Footer */}
        <motion.footer 
          className="py-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="font-body text-xs text-muted-foreground">
            نظام زمني يعتمد على دورة الشمس الطبيعية
          </p>
          <p className="font-body text-xs text-muted-foreground/60 mt-1">
            الغروب = ١٢:٠٠ • الليل يسبق النهار
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
