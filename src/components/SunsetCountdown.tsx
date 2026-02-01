import { motion } from 'framer-motion';
import type { NaturalTime } from '@/hooks/useNaturalTime';

interface SunsetCountdownProps {
  time: NaturalTime | null;
  className?: string;
}

export function SunsetCountdown({ time, className = '' }: SunsetCountdownProps) {
  if (!time) return null;

  const { sunsetCountdown } = time;
  const formatNumber = (n: number) => n.toString().padStart(2, '0');

  return (
    <motion.div 
      className={`glass-effect rounded-2xl p-6 ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <motion.div
            animate={{ 
              y: [0, -3, 0],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="text-sky-sunset"
            >
              <circle cx="12" cy="17" r="5" fill="currentColor" opacity="0.8" />
              <path 
                d="M12 2v3M4.22 10.22l2.12 2.12M1 17h3M4.22 23.78l2.12-2.12M12 25v-3M19.78 23.78l-2.12-2.12M23 17h-3M19.78 10.22l-2.12 2.12" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
              <line x1="0" y1="17" x2="24" y2="17" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            </svg>
          </motion.div>
          <h3 className="font-display text-lg text-primary">
            حتى الغروب
          </h3>
        </div>
        
        <div className="flex items-center justify-center gap-1 font-body">
          <TimeUnit value={sunsetCountdown.hours} label="ساعة" />
          <span className="text-2xl text-muted-foreground mx-1">:</span>
          <TimeUnit value={sunsetCountdown.minutes} label="دقيقة" />
          <span className="text-2xl text-muted-foreground mx-1">:</span>
          <TimeUnit value={sunsetCountdown.seconds} label="ثانية" />
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 h-1.5 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-sky-sunset via-sky-golden to-sky-horizon"
            style={{
              width: `${100 - (sunsetCountdown.totalSeconds / (24 * 60 * 60)) * 100}%`,
            }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.span 
        className="text-3xl font-semibold text-foreground tabular-nums"
        key={value}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {value.toString().padStart(2, '0')}
      </motion.span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
