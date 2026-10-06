import { format } from 'date-fns';
import { useI18n, DATE_LOCALES, cityName as cn, countryName as ctn } from '@/lib/i18n';
import type { NaturalTime, SeasonalTime } from '@/hooks/useNaturalTime';
import type { Location } from '@/hooks/useNaturalTime';

interface HeroTimeDisplayProps {
  time: NaturalTime | SeasonalTime | null;
  location: Location | null;
  showSeasonalTime?: boolean;
  language?: string;
}

export function HeroTimeDisplay({ 
  time, 
  location,
  showSeasonalTime = false,
}: HeroTimeDisplayProps) {
  const { lang, t } = useI18n();
  const formatNumber = (n: number) => n.toString().padStart(2, '0');
  
  if (!time) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="time-hero text-8xl md:text-[10rem] lg:text-[12rem] animate-pulse">
          --:--:--
        </div>
      </div>
    );
  }

  const displayHours = time.hours;
  const displayMinutes = time.minutes;
  const displaySeconds = time.seconds;
  
  // Format current date
  const now = new Date();
  const dateLocale = DATE_LOCALES[lang];
  const formattedDate = format(now, 'EEEE, d MMMM yyyy', { locale: dateLocale });
  
  // City name
  const cityName = cn(location?.city, lang) || '—';
  const countryName = ctn(location?.city, lang);

  const isSeasonalTime = 'seasonalHours' in time;

  return (
    <div className="flex flex-col items-center justify-center py-8 md:py-16">
      {/* Main time display */}
      <div dir="ltr" className="time-hero text-7xl sm:text-8xl md:text-[10rem] lg:text-[12rem] tabular-nums">
        {formatNumber(displayHours)}:{formatNumber(displayMinutes)}
        <span className="text-muted-foreground">:{formatNumber(displaySeconds)}</span>
      </div>
      
      {/* Status indicator */}
      <div className="flex items-center gap-2 mt-4 md:mt-6">
        <span 
          className={`status-dot ${time.isNight ? 'status-dot-night' : 'status-dot-day'}`}
        />
        <span className="text-sm md:text-base text-muted-foreground font-medium uppercase tracking-wider">
          {time.isNight ? t.night : t.day}
          {showSeasonalTime && isSeasonalTime && (
            <span className="ms-2 text-xs opacity-70">
              ({t.seasonalHour}: {Math.round((time as SeasonalTime).hourDuration)}′)
            </span>
          )}
        </span>
      </div>
      
      {/* Date */}
      <div className="time-hero-secondary text-lg md:text-xl mt-6 md:mt-8">
        {formattedDate}
      </div>
      
      {/* Location */}
      <div className="text-muted-foreground text-base md:text-lg mt-2">
        {cityName}{countryName ? `, ${countryName}` : ''}
      </div>
    </div>
  );
}
