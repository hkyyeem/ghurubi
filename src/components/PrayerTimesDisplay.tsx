import { motion } from 'framer-motion';
import { usePrayerTimes, type NaturalTime } from '@/hooks/useNaturalTime';

interface PrayerTimesDisplayProps {
  location: { latitude: number; longitude: number; altitude?: number } | null;
  className?: string;
}

const PRAYER_NAMES: Record<string, { ar: string; icon: string }> = {
  fajr: { ar: 'الفجر', icon: '🌙' },
  sunrise: { ar: 'الشروق', icon: '🌅' },
  dhuhr: { ar: 'الظهر', icon: '☀️' },
  asr: { ar: 'العصر', icon: '🌤️' },
  maghrib: { ar: 'المغرب', icon: '🌇' },
  isha: { ar: 'العشاء', icon: '🌃' },
};

export function PrayerTimesDisplay({ location, className = '' }: PrayerTimesDisplayProps) {
  const prayerTimes = usePrayerTimes(location);

  if (!prayerTimes) {
    return (
      <div className={`glass-effect rounded-2xl p-6 ${className}`}>
        <div className="text-center text-muted-foreground">جاري حساب مواقيت الصلاة...</div>
      </div>
    );
  }

  const formatNaturalTime = (time: NaturalTime) => {
    return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      className={`glass-effect rounded-2xl p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <h3 className="font-display text-xl text-primary text-center mb-4">
        مواقيت الصلاة
        <span className="block text-sm text-muted-foreground font-body mt-1">
          (بالتوقيت الغروبي)
        </span>
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Object.entries(prayerTimes).map(([key, time], index) => (
          <motion.div
            key={key}
            className="bg-secondary/50 rounded-xl p-3 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
          >
            <div className="text-2xl mb-1">{PRAYER_NAMES[key]?.icon}</div>
            <div className="font-body text-sm text-muted-foreground">
              {PRAYER_NAMES[key]?.ar}
            </div>
            <div className="font-display text-lg text-foreground mt-1">
              {formatNaturalTime(time)}
            </div>
          </motion.div>
        ))}
      </div>
      
      <p className="text-xs text-muted-foreground text-center mt-4 font-body">
        * الأوقات محسوبة بناءً على موقعك الجغرافي
      </p>
    </motion.div>
  );
}
