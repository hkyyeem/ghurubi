import { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { SeoHead } from '@/components/SeoHead';
import { useI18n, cityName } from '@/lib/i18n';
import { useNaturalTime, type Location, type NaturalTime } from '@/hooks/useNaturalTime';
import { MAJOR_CITIES, getCityBySlug, citySlug, compareSlug, type CityInfo } from '@/lib/cityCoordinates';
import { SimpleHeader } from '@/components/SimpleHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { useX } from '@/lib/i18nExtra';
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
  const { lang, t } = useI18n();
  return (
    <div className="flex-1 text-center py-8">
      <Link to={`/city/${citySlug(city)}`} className="text-lg font-semibold hover:underline">
        {cityName(city, lang)}
      </Link>
      <p className="mt-4 text-5xl md:text-6xl font-bold tabular-nums tracking-tight">
        {time ? `${pad(time.hours)}:${pad(time.minutes)}:${pad(time.seconds)}` : '--:--:--'}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{time ? (time.isNight ? t.night : t.day) : ''}</p>
      {time && (
        <dl className="mt-6 grid grid-cols-2 gap-y-2 text-sm max-w-xs mx-auto">
          <dt className="text-muted-foreground text-start">{t.nightLen}</dt><dd dir="ltr" className="text-end tabular-nums">{hm(Math.round(time.nightLength * 60))}</dd>
          <dt className="text-muted-foreground text-start">{t.dayLen}</dt><dd dir="ltr" className="text-end tabular-nums">{hm(Math.round(time.dayLength * 60))}</dd>
          <dt className="text-muted-foreground text-start">{t.nextSunset}</dt>
          <dd dir="ltr" className="text-end tabular-nums">{pad(time.sunsetCountdown.hours)}:{pad(time.sunsetCountdown.minutes)}</dd>
        </dl>
      )}
    </div>
  );
}

const ComparePage = () => {
  const { pair } = useParams();
  const { lang, t } = useI18n();
  const x = useX();
  const [sa, sb] = (pair ?? '').split('-vs-');
  const a = getCityBySlug(sa);
  const b = getCityBySlug(sb);
  const ta = useCityTime(a);
  const tb = useCityTime(b);

  if (!a || !b || a === b) return <NotFound />;
  const canonical = compareSlug(a, b);
  if (canonical !== pair) return <Navigate to={`/compare/${canonical}`} replace />;

  const url = `${BASE}/compare/${canonical}`;
  const na = cityName(a, lang), nb = cityName(b, lang);
  const title = t.cmpTitle(na, nb);
  const desc = t.cmpDesc(na, nb);

  let gap = '';
  if (ta && tb) {
    const diff = Math.round((ta.lastSunset.getTime() - tb.lastSunset.getTime()) / 60000);
    const d = ((diff % 1440) + 1440) % 1440;
    const m = d > 720 ? d - 1440 : d;
    if (m !== 0) gap = t.reachesBefore(m < 0 ? na : nb, m < 0 ? nb : na, hm(Math.abs(m)));
  }

  const row = (label: string, va: string, vb: string) => (
    <tr className="border-b border-border">
      <th className="py-2 text-start font-normal text-muted-foreground">{label}</th>
      <td dir="ltr" className="py-2 text-center tabular-nums">{va}</td>
      <td dir="ltr" className="py-2 text-center tabular-nums">{vb}</td>
    </tr>
  );
  const sh = (h: number) => hm(Math.round((h * 60) / 12));
  const moreA = MAJOR_CITIES.filter(c => c !== a && c !== b).slice(0, 12);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SeoHead path={`/compare/${canonical}`} title={title} desc={desc} />
      <SimpleHeader />
      <main className="container-narrow">
        <h1 className="text-center text-xl font-semibold pt-10">{na} {t.vs} {nb}</h1>
        <div className="flex flex-col md:flex-row md:divide-x divide-border">
          <Column city={a} time={ta} />
          <Column city={b} time={tb} />
        </div>
        {gap && <p className="text-center text-muted-foreground pb-6">{gap}</p>}
        {ta && tb && (
          <table className="w-full max-w-xl mx-auto text-sm my-6">
            <thead><tr className="border-b border-border">
              <th /><th className="py-2">{na}</th><th className="py-2">{nb}</th>
            </tr></thead>
            <tbody>
              {row(t.nightLen, hm(Math.round(ta.nightLength * 60)), hm(Math.round(tb.nightLength * 60)))}
              {row(t.dayLen, hm(Math.round(ta.dayLength * 60)), hm(Math.round(tb.dayLength * 60)))}
              {row(x.hourNight, sh(ta.nightLength), sh(tb.nightLength))}
              {row(x.hourDay, sh(ta.dayLength), sh(tb.dayLength))}
            </tbody>
          </table>
        )}
        <section className="text-sm mt-10">
          <h2 className="font-semibold mb-3">{x.compareWith(na)}</h2>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground">
            {moreA.map(o => (
              <li key={citySlug(o)}><Link className="hover:text-foreground hover:underline" to={`/compare/${compareSlug(a, o)}`}>{cityName(o, lang)}</Link></li>
            ))}
          </ul>
          <p className="mt-6"><Link to="/compare" className="underline">{x.compare}</Link></p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default ComparePage;
