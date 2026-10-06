import { format } from 'date-fns';
import { useI18n } from '@/lib/i18n';
import type { NaturalTime, SeasonalTime } from '@/hooks/useNaturalTime';

interface InfoGridProps {
  time: NaturalTime | SeasonalTime | null;
}

export function InfoGrid({ time }: InfoGridProps) {
  const { t } = useI18n();
  if (!time) {
    return (
      <div className="container-narrow py-8">
        <div className="info-table animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="info-table-row">
              <div className="h-4 bg-secondary rounded w-24" />
              <div className="h-4 bg-secondary rounded w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const formatDuration = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const formatLocalTime = (date: Date) => {
    return format(date, 'HH:mm');
  };

  // Calculate natural time for sunrise and sunset
  const formatNaturalTime = (hours: number, minutes: number) => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Sunrise is at approximately 12:00 natural time (end of night)
  // Sunset is at 00:00 natural time (start of day cycle)
  const sunriseNatural = '12:00';
  const sunsetNatural = '00:00';

  const dayPercentage = Math.round((time.dayLength / 24) * 100);
  const nightPercentage = 100 - dayPercentage;

  const rows = [
    {
      label: t.sunset,
      value: `${formatLocalTime(time.lastSunset)} ${t.local}`,
      naturalValue: sunsetNatural,
      highlight: true,
    },
    {
      label: t.sunrise,
      value: `${formatLocalTime(time.sunrise)} ${t.local}`,
      naturalValue: sunriseNatural,
    },
    {
      label: t.dayLen,
      value: formatDuration(time.dayLength),
      percentage: dayPercentage,
    },
    {
      label: t.nightLen,
      value: formatDuration(time.nightLength),
      percentage: nightPercentage,
    },
    {
      label: t.toSunset,
      value: `${time.sunsetCountdown.hours}h ${time.sunsetCountdown.minutes}m ${time.sunsetCountdown.seconds}s`,
      countdown: true,
    },
  ];

  return (
    <div className="container-narrow py-8 md:py-12">
      <div className="divider" />
      
      <h2 className="text-lg font-semibold text-foreground mb-6">
        {t.sunData}
      </h2>
      
      <div className="info-table">
        {rows.map((row, index) => (
          <div key={index} className="info-table-row">
            <span className="info-table-label text-sm md:text-base">
              {row.label}
            </span>
            <div className="flex items-center gap-3">
              {row.naturalValue && (
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                  {row.naturalValue} ghurubi
                </span>
              )}
              {row.percentage !== undefined && (
                <span className="text-xs text-muted-foreground">
                  {row.percentage}%
                </span>
              )}
              <span dir="ltr" className={`info-table-value text-sm md:text-base ${row.highlight ? 'text-accent font-semibold' : ''} ${row.countdown ? 'tabular-nums' : ''}`}>
                {row.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Day/Night visual bar */}
      <div className="mt-8">
        <div className="flex items-center gap-4 mb-3">
          <span className="text-sm text-muted-foreground">{t.ratio}</span>
        </div>
        <div className="h-3 rounded-full bg-secondary overflow-hidden flex">
          <div 
            className="h-full bg-accent/80 transition-all duration-500"
            style={{ width: `${dayPercentage}%` }}
          />
          <div 
            className="h-full bg-ring/40 transition-all duration-500"
            style={{ width: `${nightPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{t.day}: {dayPercentage}%</span>
          <span>{t.night}: {nightPercentage}%</span>
        </div>
      </div>

      <div className="divider" />

      {/* Explanation section */}
      <div className="text-sm text-muted-foreground space-y-3">
        <h3 className="font-semibold text-foreground">{t.about}</h3>
        <p>{t.about1}</p>
        <p>{t.about2}</p>
      </div>
    </div>
  );
}
