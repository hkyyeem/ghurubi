import { format } from 'date-fns';
import type { NaturalTime, SeasonalTime } from '@/hooks/useNaturalTime';

interface InfoGridProps {
  time: NaturalTime | SeasonalTime | null;
}

export function InfoGrid({ time }: InfoGridProps) {
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
      label: 'Sunset (Day Start)',
      value: `${formatLocalTime(time.lastSunset)} local`,
      naturalValue: sunsetNatural,
      highlight: true,
    },
    {
      label: 'Sunrise',
      value: `${formatLocalTime(time.sunrise)} local`,
      naturalValue: sunriseNatural,
    },
    {
      label: 'Day Length',
      value: formatDuration(time.dayLength),
      percentage: dayPercentage,
    },
    {
      label: 'Night Length',
      value: formatDuration(time.nightLength),
      percentage: nightPercentage,
    },
    {
      label: 'Time to Sunset',
      value: `${time.sunsetCountdown.hours}h ${time.sunsetCountdown.minutes}m ${time.sunsetCountdown.seconds}s`,
      countdown: true,
    },
  ];

  return (
    <div className="container-narrow py-8 md:py-12">
      <div className="divider" />
      
      <h2 className="text-lg font-semibold text-foreground mb-6">
        Sun Data
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
              <span className={`info-table-value text-sm md:text-base ${row.highlight ? 'text-accent font-semibold' : ''} ${row.countdown ? 'tabular-nums' : ''}`}>
                {row.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Day/Night visual bar */}
      <div className="mt-8">
        <div className="flex items-center gap-4 mb-3">
          <span className="text-sm text-muted-foreground">Day/Night Ratio</span>
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
          <span>Day: {dayPercentage}%</span>
          <span>Night: {nightPercentage}%</span>
        </div>
      </div>

      <div className="divider" />

      {/* Explanation section */}
      <div className="text-sm text-muted-foreground space-y-3">
        <h3 className="font-semibold text-foreground">About Ghurubi Time</h3>
        <p>
          Ghurubi time is a natural time system where <strong>sunset marks 00:00</strong> (the start of a new day). 
          The night period runs from 00:00 to approximately 12:00 (sunrise), followed by the day period until the next sunset.
        </p>
        <p>
          This system aligns with the natural solar cycle and historical traditions where the day began at sunset.
        </p>
      </div>
    </div>
  );
}
