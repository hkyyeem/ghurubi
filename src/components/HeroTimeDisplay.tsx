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
  hour12?: boolean;
}

const HIJRI_EN = ['Muharram', 'Safar', 'Rabi I', 'Rabi II', 'Jumada I', 'Jumada II', 'Rajab', "Sha'ban", 'Ramadan', 'Shawwal', "Dhu al-Qa'dah", 'Dhu al-Hijjah'];
const HIJRI_TR = ['Muharrem', 'Safer', 'Rebiülevvel', 'Rebiülahir', 'Cemaziyelevvel', 'Cemaziyelahir', 'Recep', 'Şaban', 'Ramazan', 'Şevval', 'Zilkade', 'Zilhicce'];

const PERIOD: Record<string, (night: boolean, wd: string) => string> = {
  ar: (n, wd) => `${n ? 'ليلة' : 'نهار'} ${wd}`,
  en: (n, wd) => n ? `Eve of ${wd}` : wd,
  tr: (n, wd) => `${wd} ${n ? 'gecesi' : 'gündüzü'}`,
  he: (n, wd) => n ? `ליל ${wd.replace(/^יום\s*/, '')}` : wd,
};

export function HeroTimeDisplay({ time, location, showSeasonalTime = false, hour12 = false }: HeroTimeDisplayProps) {
  const { lang, t } = useI18n();
  const formatNumber = (n: number) => n.toString().padStart(2, '0');

  // Natural day begins at sunset: during the night we are already in the next day.
  const dateLocale = DATE_LOCALES[lang];
  const base = time ? (time.isNight ? new Date(time.lastSunset.getTime() + 86400000) : new Date()) : null;
  const weekday = base ? format(base, 'EEEE', { locale: dateLocale }) : '';
  const period = time ? (PERIOD[lang] ?? PERIOD.en)(time.isNight, weekday) : '';
  const h = base ? toHijriDate(base) : null;
  const hijri = h
    ? (lang === 'ar'
      ? `${h.day} ${h.monthName} ${h.year} هـ`
      : `${h.day} ${(lang === 'tr' ? HIJRI_TR : HIJRI_EN)[h.month - 1]} ${h.year} ${lang === 'tr' ? 'H' : 'AH'}`)
    : '';
  const greg = base ? format(base, 'd MMMM yyyy', { locale: dateLocale }) : '';
  const primary = lang === 'ar' ? `${period}، ${hijri}` : `${period}, ${greg}`;
  const secondary = lang === 'ar' ? greg : hijri;

  const cityName = cn(location?.city, lang) || '—';
  const countryName = ctn(location?.city, lang);
  const isSeasonalTime = !!time && 'seasonalHours' in time;
  const clock = time
    ? (hour12
      ? `${formatNumber(time.hours % 12 === 0 ? 12 : time.hours % 12)}:${formatNumber(time.minutes)}`
      : `${formatNumber(time.hours)}:${formatNumber(time.minutes)}`)
    : '--:--';
  const shareTime = time ? clock : '--:--';

  return (
    <div className="flex flex-col items-center justify-center py-8 md:py-16 min-h-[22rem] sm:min-h-[26rem] md:min-h-[34rem]">
      <div dir="ltr" className={`time-hero text-7xl sm:text-8xl md:text-[10rem] lg:text-[12rem] tabular-nums ${time ? '' : 'animate-pulse'}`}>
        {clock}
        <span className="text-muted-foreground">:{time ? formatNumber(time.seconds) : '--'}</span>
        {hour12 && time && (
          <span className="text-2xl sm:text-3xl md:text-5xl ms-2 text-muted-foreground align-baseline">
            {time.hours < 12 ? t.night : t.day}
          </span>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 mt-4 md:mt-6 min-h-7 md:min-h-8">
        {time && <span className={`status-dot ${time.isNight ? 'status-dot-night' : 'status-dot-day'}`} />}
        <span className="time-hero-secondary text-lg md:text-xl">
          {time ? primary : ' '}
          {time && showSeasonalTime && isSeasonalTime && (
            <span className="ms-2 text-xs text-muted-foreground">
              ({t.seasonalHour}: {Math.round((time as SeasonalTime).hourDuration)}′)
            </span>
          )}
        </span>
      </div>

      <div className="text-muted-foreground text-sm md:text-base mt-2 text-center min-h-6">
        {time ? `${secondary} — ${cityName}${countryName ? `، ${countryName}`.replace('،', lang === 'ar' ? '،' : ',') : ''}` : ' '}
      </div>

      <div className="mt-6 min-h-10">
        {time && (
          <ShareTimeCard
            time={shareTime}
            period={period}
            dateLine={lang === 'ar' ? hijri : greg}
            city={location?.city}
            cityLabel={cityName}
            countryLabel={countryName}
            isNight={time.isNight}
          />
        )}
      </div>
    </div>
  );
}
