import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';

interface SettingsPanelProps {
  showSeasonalHours: boolean;
  onToggleSeasonalHours: (value: boolean) => void;
  showPrayerTimes: boolean;
  onTogglePrayerTimes: (value: boolean) => void;
  className?: string;
}

export function SettingsPanel({
  showSeasonalHours,
  onToggleSeasonalHours,
  showPrayerTimes,
  onTogglePrayerTimes,
  className = '',
}: SettingsPanelProps) {
  return (
    <motion.div 
      className={`glass-effect rounded-2xl p-5 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <h3 className="font-display text-lg text-primary mb-4">الإعدادات</h3>
      
      <div className="space-y-4">
        {/* Seasonal Hours Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <label className="font-body text-sm text-foreground block">
              الساعات الزمانية
            </label>
            <p className="text-xs text-muted-foreground mt-0.5">
              12 ساعة لليل و12 للنهار (متغيرة المدة)
            </p>
          </div>
          <Switch
            checked={showSeasonalHours}
            onCheckedChange={onToggleSeasonalHours}
          />
        </div>
        
        {/* Prayer Times Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <label className="font-body text-sm text-foreground block">
              مواقيت الصلاة
            </label>
            <p className="text-xs text-muted-foreground mt-0.5">
              عرض أوقات الصلاة بالتوقيت الغروبي
            </p>
          </div>
          <Switch
            checked={showPrayerTimes}
            onCheckedChange={onTogglePrayerTimes}
          />
        </div>
      </div>
    </motion.div>
  );
}
