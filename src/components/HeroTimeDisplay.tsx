import { format } from 'date-fns';
import { useI18n, DATE_LOCALES, cityName as cn, countryName as ctn } from '@/lib/i18n';
import { toHijriDate } from '@/lib/prayerCalculations';
import type { NaturalTime, SeasonalTime } from '@/hooks/useNaturalTime';
import type { Location } from '@/hooks/useNaturalTime';
import { ShareTimeCard } from '@/components/ShareTimeCard';

interface HeroTimeDisplayProps {
  time: NaturalTime | SeasonalTime | null;
  location: Location | null;
  showSeasonalTime?: boolean;
  language?: string;
}

const HIJRI_EN = ['Muharram', 'Safar', 'Rabi I', 'Rabi II', 'Jumada I', 'Jumada II', 'Rajab', "Sha'ban", 'Ramadan', 'Shawwal', "Dhu al-Qa'dah", 'Dhu al-Hijjah'];
const HIJRI_TR = ['Muharrem', 'Safer', 'Rebiülevvel', 'Rebiülahir', 'Cemaziyelevvel', 'Cemaziyelahir', 'Recep', 'Şaban', 'Ramazan', 'Şevval', 'Zilkade', 'Zilhicce'];

const PERIOD: Record<string, (night: boolean, wd: string) => string> = {
  ar: (n, wd) => `${n ? 'ليلة' : 'نهار'} ${wd}`,
  en: (n, wd) => n ? `Eve of ${wd}` : wd,
  tr: (n, wd) => `${wd} ${n ? 'gecesi' : 'gündüzü'}`,
  he: (n, wd) => n ? `ליל ${wd.replace(/^יום\s*/, '')}` : wd,
};

export function HeroTimeDisplay({ time, location, showSeasonalTime = false }: HeroTimeDisplayProps) {
  const { lang, t } = useI18n();
  const formatNumber = (n: number) => n.toString().padStart(2, '0');

  if (!time) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="time-hero text-8xl md:text-[10rem] lg:text-[12rem] animate-pulse">--:--:--</div>
      </div>
    );
  }

  // Natural day begins at sunset: during the night we are already in the next day.
  const base = time.isNight ? new Date(time.lastSunset.getTime() + 86400000) : new Date();
  const dateLocale = DATE_LOCALES[lang];
  const weekday = format(base, 'EEEE', { locale: dateLocale });
  const period = (PERIOD[lang] ?? PERIOD.en)(time.isNight, weekday);
  const h = toHijriDate(base);
  const hijri = lang === 'ar'
    ? `${h.day} ${h.monthName} ${h.year} هـ`
    : `${h.day} ${(lang === 'tr' ? HIJRI_TR : HIJRI_EN)[h.month - 1]} ${h.year} ${lang === 'tr' ? 'H' : 'AH'}`;
  const greg = format(base, 'd MMMM yyyy', { locale: dateLocale });
  const primary = lang === 'ar' ? `${period}، ${hijri}` : `${period}, ${greg}`;
  const secondary = lang === 'ar' ? greg : hijri;

  const cityName = cn(location?.city, lang) || '—';
  const countryName = ctn(location?.city, lang);
  const isSeasonalTime = 'seasonalHours' in time;

  return (
    <div className="flex flex-col items-center justify-center py-8 md:py-16">
      <div dir="ltr" className="time-hero text-7xl sm:text-8xl md:text-[10rem] lg:text-[12rem] tabular-nums">
        {formatNumber(time.hours)}:{formatNumber(time.minutes)}
        <span className="text-muted-foreground">:{formatNumber(time.seconds)}</span>
      </div>

      <div className="flex items-center gap-2 mt-4 md:mt-6">
        <span className={`status-dot ${time.isNight ? 'status-dot-night' : 'status-dot-day'}`} />
        <span className="time-hero-secondary text-lg md:text-xl">
          {primary}
          {showSeasonalTime && isSeasonalTime && (
            <span className="ms-2 text-xs opacity-70">
              ({t.seasonalHour}: {Math.round((time as SeasonalTime).hourDuration)}′)
            </span>
          )}
        </span>
      </div>

      <div className="text-muted-foreground text-sm md:text-base mt-2 text-center">
        {secondary} — {cityName}{countryName ? `، ${countryName}`.replace('،', lang === 'ar' ? '،' : ',') : ''}
      </div>

      <ShareTimeCard
        time={`${formatNumber(time.hours)}:${formatNumber(time.minutes)}`}
        period={period}
        dateLine={lang === 'ar' ? hijri : greg}
        city={location?.city}
        cityLabel={cityName}
        countryLabel={countryName}
        isNight={time.isNight}
      />
    </div>
  );
}
