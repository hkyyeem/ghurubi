import { useEffect, useRef, useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { MAJOR_CITIES, citySlug } from '@/lib/cityCoordinates';
import { getDiscoveredCities, searchCityByName } from '@/lib/searchCity';
import { useI18n, cityName, countryName } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface Props { label: string; value: string; onChange: (slug: string) => void }

/** Type-to-filter city chooser: built-in + discovered cities, with worldwide lookup. */
export function CityPicker({ label, value, onChange }: Props) {
  const { lang } = useI18n();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pool = [...getDiscoveredCities(), ...MAJOR_CITIES].filter(
    (c, i, a) => a.findIndex(o => citySlug(o) === citySlug(c)) === i);
  const current = pool.find(c => citySlug(c) === value);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setQ(''); } };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const ql = q.trim().toLowerCase();
  const list = pool.filter(c => !ql ||
    c.name.toLowerCase().includes(ql) || c.nameAr.includes(q.trim()) ||
    cityName(c, lang).toLowerCase().includes(ql) || c.country.toLowerCase().includes(ql)).slice(0, 12);
  const pick = (s: string) => { onChange(s); setOpen(false); setQ(''); setNotFound(false); };
  async function world() {
    if (!q.trim()) return;
    setBusy(true); setNotFound(false);
    const c = await searchCityByName(q.trim()).catch(() => null);
    setBusy(false);
    if (c) pick(citySlug(c)); else setNotFound(true);
  }

  return (
    <div ref={ref} className="relative">
      <span className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">{label}</span>
      <div className="flex items-center gap-2 border-b-2 border-border focus-within:border-foreground transition-colors py-2">
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <input value={open ? q : (current ? cityName(current, lang) : '')}
          onFocus={() => setOpen(true)} onChange={e => { setQ(e.target.value); setOpen(true); setNotFound(false); }}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (list[0] && ql) pick(citySlug(list[0])); else world(); } }}
          placeholder={current ? cityName(current, lang) : ''}
          className="flex-1 min-w-0 bg-transparent outline-none text-xl font-semibold" />
        {busy && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
      </div>
      {open && (list.length > 0 || q.trim()) && (
        <ul className="absolute z-40 inset-x-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-72 overflow-y-auto">
          {list.map(c => (
            <li key={citySlug(c)}>
              <button type="button" onClick={() => pick(citySlug(c))}
                className={cn('w-full text-start px-4 py-2 hover:bg-secondary transition-colors', citySlug(c) === value && 'bg-secondary/60')}>
                <span className="font-medium">{cityName(c, lang)}</span>
                <span className="text-sm text-muted-foreground ms-2">{countryName(c, lang)}</span>
              </button>
            </li>
          ))}
          {q.trim() && (
            <li>
              <button type="button" onClick={world} disabled={busy}
                className="w-full text-start px-4 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                🌍 {q.trim()} …
              </button>
            </li>
          )}
          {notFound && <li className="px-4 py-2 text-sm text-muted-foreground">✕ “{q}”</li>}
        </ul>
      )}
    </div>
  );
}
