import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MAJOR_CITIES, citySlug, compareSlug, getCityBySlug } from '@/lib/cityCoordinates';
import { SeoHead } from '@/components/SeoHead';
import { SimpleHeader } from '@/components/SimpleHeader';
import { CityPicker } from '@/components/CityPicker';
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
  const go = () => {
    const ca = getCityBySlug(a), cb = getCityBySlug(b);
    if (ca && cb && ca !== cb) nav(`/compare/${compareSlug(ca, cb)}`);
  };
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SeoHead path="/compare" title={x.compareTitle} desc={x.compareDesc} />
      <SimpleHeader />
      <main className="container-narrow py-10">
        <h1 className="text-2xl font-semibold mb-6">{x.compare}</h1>
        <div className="grid md:grid-cols-[1fr_auto_1fr_auto] gap-4 md:gap-6 items-end">
          <CityPicker label={x.cityA} value={a} onChange={setA} />
          <button type="button" onClick={() => { setA(b); setB(a); }} aria-label="swap"
            className="hidden md:block pb-3 text-muted-foreground hover:text-foreground text-xl">⇄</button>
          <CityPicker label={x.cityB} value={b} onChange={setB} />
          <button onClick={go} disabled={a === b}
            className="bg-foreground text-background rounded-md px-8 py-3 font-medium disabled:opacity-40">{x.go}</button>
        </div>
        <h2 className="text-lg font-semibold mt-10 mb-3">{x.popular}</h2>
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-px bg-border border border-border rounded-lg overflow-hidden">
          {POPULAR.map(([p, q]) => {
            const ca = getCityBySlug(p), cb = getCityBySlug(q);
            if (!ca || !cb) return null;
            return <li key={p + q} className="bg-background"><Link className="block px-4 py-3 hover:bg-secondary transition-colors" to={`/compare/${compareSlug(ca, cb)}`}>{cityName(ca, lang)} — {cityName(cb, lang)}</Link></li>;
          })}
        </ul>
      </main>
      <SiteFooter />
    </div>
  );
};
export default CompareIndex;
