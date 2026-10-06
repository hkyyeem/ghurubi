import { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useNaturalTime, type Location, type NaturalTime } from '@/hooks/useNaturalTime';
import { getCityBySlug, citySlug, compareSlug, type CityInfo } from '@/lib/cityCoordinates';
import NotFound from './NotFound';

const BASE = 'https://ghurubi.com';
const pad = (n: number) => String(Math.floor(n)).padStart(2, '0');
const hm = (min: number) => `${pad(min / 60)}h ${pad(min % 60)}m`;

function useCityTime(city?: CityInfo) {
  const loc: Location | null = useMemo(
    () => (city ? { latitude: city.latitude, longitude: city.longitude, city } : null), [city]);
  return useNaturalTime(loc, false);
}

function Column({ city, time }: { city: CityInfo; time: NaturalTime | null }) {
  return (
    <div className="flex-1 text-center py-8">
      <Link to={`/city/${citySlug(city)}`} className="text-lg font-semibold hover:underline">
        {city.name} <span className="text-muted-foreground font-normal">· {city.nameAr}</span>
      </Link>
      <p className="mt-4 text-5xl md:text-6xl font-bold tabular-nums tracking-tight">
        {time ? `${pad(time.hours)}:${pad(time.minutes)}:${pad(time.seconds)}` : '--:--:--'}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{time ? (time.isNight ? 'Night' : 'Day') : ''}</p>
      {time && (
        <dl className="mt-6 grid grid-cols-2 gap-y-2 text-sm max-w-xs mx-auto">
          <dt className="text-muted-foreground text-left">Night</dt><dd className="text-right tabular-nums">{hm(time.nightLength)}</dd>
          <dt className="text-muted-foreground text-left">Day</dt><dd className="text-right tabular-nums">{hm(time.dayLength)}</dd>
          <dt className="text-muted-foreground text-left">Next sunset in</dt>
          <dd className="text-right tabular-nums">{pad(time.sunsetCountdown.hours)}:{pad(time.sunsetCountdown.minutes)}</dd>
        </dl>
      )}
    </div>
  );
}

const ComparePage = () => {
  const { pair } = useParams();
  const [sa, sb] = (pair ?? '').split('-vs-');
  const a = getCityBySlug(sa);
  const b = getCityBySlug(sb);
  const ta = useCityTime(a);
  const tb = useCityTime(b);

  if (!a || !b || a === b) return <NotFound />;
  const canonical = compareSlug(a, b);
  if (canonical !== pair) return <Navigate to={`/compare/${canonical}`} replace />;

  const url = `${BASE}/compare/${canonical}`;
  const title = `${a.name} vs ${b.name} Ghurubi Time — ${a.nameAr} و${b.nameAr} | Ghurubi`;
  const desc = `Compare Ghurubi (sunset-based) time between ${a.name} and ${b.name}: who reached sunset first, night and day length in each city. مقارنة التوقيت الغروبي بين ${a.nameAr} و${b.nameAr}.`;

  let gap = '';
  if (ta && tb) {
    const diff = Math.round((ta.lastSunset.getTime() - tb.lastSunset.getTime()) / 60000);
    const d = ((diff % 1440) + 1440) % 1440;
    const m = d > 720 ? d - 1440 : d;
    if (m !== 0) gap = `Sunset reaches ${m < 0 ? a.name : b.name} ${hm(Math.abs(m))} before ${m < 0 ? b.name : a.name}`;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={url} />
      </Helmet>
      <header className="border-b border-border">
        <div className="container-narrow py-4"><Link to="/" className="font-bold">Ghurubi</Link></div>
      </header>
      <main className="container-narrow">
        <h1 className="text-center text-xl font-semibold pt-10">{a.name} vs {b.name}</h1>
        <div className="flex flex-col md:flex-row md:divide-x divide-border">
          <Column city={a} time={ta} />
          <Column city={b} time={tb} />
        </div>
        {gap && <p className="text-center text-sm text-muted-foreground pb-10">{gap}</p>}
      </main>
    </div>
  );
};

export default ComparePage;
