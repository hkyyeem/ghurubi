import { motion } from 'framer-motion';
import type { NaturalTime } from '@/hooks/useNaturalTime';

interface DayNightIndicatorProps {
  time: NaturalTime | null;
  className?: string;
}

export function DayNightIndicator({ time, className = '' }: DayNightIndicatorProps) {
  if (!time) return null;

  const nightPercentage = (time.nightLength / 24) * 100;
  const dayPercentage = (time.dayLength / 24) * 100;

  return (
    <motion.div 
      className={`glass-effect rounded-2xl p-4 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-body text-sm text-muted-foreground">توزيع اليوم</span>
        <span className="font-display text-xs text-primary">
          {time.dayLength.toFixed(1)} : {time.nightLength.toFixed(1)}
        </span>
      </div>
      
      <div className="relative h-8 rounded-full overflow-hidden bg-secondary">
        {/* Night portion */}
        <motion.div
          className="absolute inset-y-0 right-0 bg-gradient-to-l from-sky-midnight via-sky-deep-night to-sky-twilight"
          initial={{ width: 0 }}
          animate={{ width: `${nightPercentage}%` }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-celestial-star font-body">ليل</span>
          </div>
        </motion.div>
        
        {/* Day portion */}
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-sky-noon via-sky-afternoon to-sky-golden"
          initial={{ width: 0 }}
          animate={{ width: `${dayPercentage}%` }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-primary-foreground font-body font-semibold">نهار</span>
          </div>
        </motion.div>
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-muted-foreground font-body">
        <span>نهار: {time.dayLength.toFixed(1)}س</span>
        <span>ليل: {time.nightLength.toFixed(1)}س</span>
      </div>
    </motion.div>
  );
}
