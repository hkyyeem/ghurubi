import { motion } from 'framer-motion';
import type { NaturalTime, SeasonalTime } from '@/hooks/useNaturalTime';

interface TimeDisplayProps {
  time: NaturalTime | SeasonalTime | null;
  showSeasonalTime?: boolean;
  className?: string;
}

export function TimeDisplay({ time, showSeasonalTime = false, className = '' }: TimeDisplayProps) {
  if (!time) {
    return (
      <div className={`text-center ${className}`}>
        <div className="font-display text-6xl text-primary animate-pulse">--:--</div>
      </div>
    );
  }

  const formatNumber = (n: number) => n.toString().padStart(2, '0');
  
  // For seasonal time display
  const isSeasonalTime = 'seasonalHours' in time;
  const displayHours = showSeasonalTime && isSeasonalTime 
    ? (time as SeasonalTime).seasonalHours 
    : time.hours;
  const displayMinutes = showSeasonalTime && isSeasonalTime 
    ? (time as SeasonalTime).seasonalMinutes 
    : time.minutes;

  return (
    <div className={`text-center ${className}`}>
      {/* Main time display */}
      <motion.div 
        className="font-display text-5xl md:text-7xl text-primary tracking-wider"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        key={`${displayHours}:${displayMinutes}`}
      >
        <span className="inline-block min-w-[1.5ch] text-right">
          {formatNumber(displayHours)}
        </span>
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="mx-1"
        >
          :
        </motion.span>
        <span className="inline-block min-w-[1.5ch] text-left">
          {formatNumber(displayMinutes)}
        </span>
        <span className="text-3xl md:text-4xl text-muted-foreground mr-2">
          :{formatNumber(time.seconds)}
        </span>
      </motion.div>

      {/* Period indicator */}
      <div className="mt-2 flex items-center justify-center gap-2">
        <motion.div
          className={`w-3 h-3 rounded-full ${
            time.isNight ? 'bg-celestial-moon' : 'bg-sky-golden'
          }`}
          animate={{
            boxShadow: time.isNight 
              ? ['0 0 10px hsl(45 30% 90%)', '0 0 20px hsl(45 30% 90%)', '0 0 10px hsl(45 30% 90%)']
              : ['0 0 10px hsl(35 85% 55%)', '0 0 25px hsl(35 85% 55%)', '0 0 10px hsl(35 85% 55%)'],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="font-body text-lg text-muted-foreground">
          {time.isNight ? 'ليل' : 'نهار'}
        </span>
      </div>

      {/* Seasonal time indicator */}
      {showSeasonalTime && isSeasonalTime && (
        <div className="mt-3 text-sm text-muted-foreground font-body">
          <span>مدة الساعة الحالية: </span>
          <span className="text-primary">
            {Math.round((time as SeasonalTime).hourDuration)} دقيقة
          </span>
        </div>
      )}
    </div>
  );
}
