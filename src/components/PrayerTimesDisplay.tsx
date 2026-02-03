import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import type { Location } from '@/hooks/useNaturalTime';
import { ChevronDown, ChevronUp, Settings2 } from 'lucide-react';

interface PrayerTimesDisplayProps {
  location: Location | null;
  useSeasonalHours?: boolean;
  className?: string;
}

export function PrayerTimesDisplay({ 
  location, 
  useSeasonalHours = false,
  className = '' 
}: PrayerTimesDisplayProps) {
  const prayerData = usePrayerTimes(location, useSeasonalHours);
  const [showSettings, setShowSettings] = useState(false);

  if (!prayerData) {
    return (
      <div className={`glass-effect rounded-2xl p-6 ${className}`}>
        <div className="text-center text-muted-foreground">جاري حساب مواقيت الصلاة...</div>
      </div>
    );
  }

  const { prayers, hijriDate, config, updateAdjustment } = prayerData;

  const formatNaturalTime = (time: { hours: number; minutes: number }) => {
    return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      className={`glass-effect rounded-2xl p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* Hijri Date */}
      <div className="text-center mb-4">
        <div className="font-display text-lg text-primary">
          {hijriDate.formatted}
        </div>
        <div className="text-xs text-muted-foreground">
          التقويم الهجري (أم القرى)
        </div>
      </div>

      <h3 className="font-display text-xl text-primary text-center mb-4">
        مواقيت الصلاة
        <span className="block text-sm text-muted-foreground font-body mt-1">
          (بالتوقيت الغروبي {useSeasonalHours ? '- الساعات الزمانية' : ''})
        </span>
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {prayers.map((prayer, index) => (
          <motion.div
            key={prayer.name}
            className="bg-secondary/50 rounded-xl p-3 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
          >
            <div className="text-2xl mb-1">{prayer.icon}</div>
            <div className="font-body text-sm text-muted-foreground">
              {prayer.nameAr}
            </div>
            <div className="font-display text-lg text-foreground mt-1">
              {formatNaturalTime(prayer.naturalTime)}
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Settings toggle */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="flex items-center justify-center gap-2 w-full mt-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Settings2 size={16} />
        <span>إعدادات الحساب</span>
        {showSettings ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-3 border-t border-border mt-2">
              <div className="text-xs text-muted-foreground text-center mb-2">
                تعديل دقائق لكل صلاة (+ أو -)
              </div>
              <div className="grid grid-cols-3 gap-2">
                {prayers.map(prayer => (
                  <div key={prayer.name} className="text-center">
                    <label className="text-xs text-muted-foreground block mb-1">
                      {prayer.nameAr}
                    </label>
                    <input
                      type="number"
                      value={config.adjustments[prayer.name as keyof typeof config.adjustments]}
                      onChange={(e) => updateAdjustment(
                        prayer.name as keyof typeof config.adjustments,
                        parseInt(e.target.value) || 0
                      )}
                      className="w-full px-2 py-1 text-center text-sm bg-input border border-border rounded"
                      min="-30"
                      max="30"
                    />
                  </div>
                ))}
              </div>
              <div className="text-xs text-muted-foreground text-center mt-2">
                طريقة الحساب: أم القرى • العصر: الشافعية
                {config.isRamadan && <span className="block text-primary">🌙 رمضان: العشاء ١٢٠ دقيقة بعد المغرب</span>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <p className="text-xs text-muted-foreground text-center mt-4 font-body">
        * الغروب = ٠٠:٠٠ بالتوقيت الغروبي
      </p>
    </motion.div>
  );
}
