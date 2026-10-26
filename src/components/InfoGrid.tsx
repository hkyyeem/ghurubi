import { useI18n } from '@/lib/i18n';
import type { NaturalTime, SeasonalTime, Location } from '@/hooks/useNaturalTime';
import { formatGhurubiHM, toGhurubiClock } from '@/lib/ghurubiClock';
import { formatHmInZone, zoneOf } from '@/lib/zonedTime';

interface InfoGridProps {
  time: NaturalTime | SeasonalTime | null;
  location?: Location | null;
}

export function InfoGrid({ time, location }: InfoGridProps) {
  const { t } = useI18n();
  if (!time) {
    return (
      <div className="container-narrow py-8 md:py-12" aria-hidden="true">
        <div className="divider" />
        <h2 className="text-lg font-semibold mb-6 invisible">{t.sunData}</h2>
        <div className="info-table">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="info-table-row">
              <div className="h-4 bg-secondary rounded w-28" />
              <div className="h-4 bg-secondary rounded w-36" />
            </div>
          ))}
        </div>
        <div className="mt-8">
          <div className="h-5 mb-3 w-32 bg-secondary rounded" />
          <div className="h-3 rounded-full bg-secondary" />
          <div className="h-4 mt-2" />
        </div>
        <div className="divider" />
        <div className="space-y-3">
          <div className="h-5 w-48 bg-secondary rounded" />
          <div className="h-4 bg-secondary rounded" />
          <div className="h-4 bg-secondary rounded w-11/12" />
          <div className="h-4 bg-secondary rounded w-4/5" />
        </div>
      </div>
    );
  }

  const formatDuration = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const zone = location ? zoneOf(location.latitude, location.longitude) : 'UTC';
  const formatLocalTime = (date: Date) => formatHmInZone(date, zone);

  // Sunset opens the Ghurubi day at 00:00. Sunrise is 12:00 only in seasonal
  // hours; in equal hours it is the real length of the night.
  const seasonal = 'seasonalHours' in time;
  const sunriseNatural = location
    ? formatGhurubiHM(toGhurubiClock(time.sunrise, location.latitude, location.longitude, seasonal))
    : '12:00';
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
