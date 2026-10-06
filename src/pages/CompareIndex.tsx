import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MAJOR_CITIES, citySlug, compareSlug, getCityBySlug } from '@/lib/cityCoordinates';
import { SeoHead } from '@/components/SeoHead';
import { SimpleHeader } from '@/components/SimpleHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { useI18n, cityName } from '@/lib/i18n';
import { useX } from '@/lib/i18nExtra';

const POPULAR: [string, string][] = [
  ['riyadh', 'makkah'], ['riyadh', 'dubai'], ['cairo', 'riyadh'], ['istanbul', 'makkah'], ['jerusalem', 'makkah'],
  ['aleppo', 'damascus'], ['london', 'makkah'], ['new-york', 'makkah'], ['jeddah', 'riyadh'], ['amman', 'jerusalem'],
  ['ankara', 'istanbul'], ['doha', 'dubai'], ['casablanca', 'cairo'], ['baghdad', 'tehran'], ['kuala-lumpur', 'jakarta'],
];

const CompareIndex = () => {
  const { lang } = useI18n();
  const x = useX();
  const nav = useNavigate();
  const [a, setA] = useState('riyadh');
  const [b, setB] = useState('makkah');
  const sorted = [...MAJOR_CITIES].sort((p, q) => cityName(p, lang).localeCompare(cityName(q, lang), lang));
  const go = () => {
    const ca = getCityBySlug(a), cb = getCityBySlug(b);
    if (ca && cb && ca !== cb) nav(`/compare/${compareSlug(ca, cb)}`);
  };
  const sel = 'w-full bg-background border border-border rounded-md px-3 py-2';
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SeoHead path="/compare" title={x.compareTitle} desc={x.compareDesc} />
      <SimpleHeader />
      <main className="container-narrow py-10">
        <h1 className="text-2xl font-semibold mb-6">{x.compare}</h1>
        <div className="grid md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
          <label className="text-sm">{x.cityA}
            <select className={sel} value={a} onChange={e => setA(e.target.value)}>
              {sorted.map(c => <option key={citySlug(c)} value={citySlug(c)}>{cityName(c, lang)}</option>)}
            </select>
          </label>
          <label className="text-sm">{x.cityB}
            <select className={sel} value={b} onChange={e => setB(e.target.value)}>
              {sorted.map(c => <option key={citySlug(c)} value={citySlug(c)}>{cityName(c, lang)}</option>)}
            </select>
          </label>
          <button onClick={go} disabled={a === b}
            className="bg-foreground text-background rounded-md px-6 py-2 font-medium disabled:opacity-40">{x.go}</button>
        </div>
        <h2 className="text-lg font-semibold mt-10 mb-3">{x.popular}</h2>
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
          {POPULAR.map(([p, q]) => {
            const ca = getCityBySlug(p), cb = getCityBySlug(q);
            if (!ca || !cb) return null;
            return <li key={p + q}><Link className="hover:underline" to={`/compare/${compareSlug(ca, cb)}`}>{cityName(ca, lang)} — {cityName(cb, lang)}</Link></li>;
          })}
        </ul>
      </main>
      <SiteFooter />
    </div>
  );
};
export default CompareIndex;
