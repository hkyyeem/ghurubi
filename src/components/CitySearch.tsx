import { useEffect, useRef, useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { MAJOR_CITIES, type CityInfo } from '@/lib/cityCoordinates';
import { getDiscoveredCities, searchCityByName } from '@/lib/searchCity';
import { useI18n, cityName, countryName } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface Props { onSelect: (city: CityInfo) => void; currentCity?: CityInfo }

/** Search button; opens a full-screen sheet on mobile and a dropdown on desktop. */
export function CitySearch({ onSelect, currentCity }: Props) {
  const { lang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 0); }, [open]);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (boxRef.current && !boxRef.current.contains(e.target as Node)) close(); };
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('mousedown', h); document.addEventListener('keydown', k);
    return () => { document.removeEventListener('mousedown', h); document.removeEventListener('keydown', k); };
  }, []);

  function close() { setOpen(false); setQ(''); setNotFound(false); }
  function pick(c: CityInfo) { onSelect(c); close(); }

  const pool = [...getDiscoveredCities(), ...MAJOR_CITIES];
  const ql = q.trim().toLowerCase();
  const results = ql ? pool.filter((c, i, a) =>
    a.findIndex(o => o.name === c.name && o.country === c.country) === i && (
      c.name.toLowerCase().includes(ql) || c.nameAr.includes(q.trim()) ||
      c.country.toLowerCase().includes(ql) || c.countryAr.includes(q.trim()))).slice(0, 10) : [];

  async function worldSearch() {
    if (!q.trim()) return;
    setBusy(true); setNotFound(false);
    const c = await searchCityByName(q.trim()).catch(() => null);
    setBusy(false);
    if (c) pick(c); else setNotFound(true);
  }

  return (
    <div ref={boxRef} className="relative">
      <button onClick={() => setOpen(true)} aria-label={t.search}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors">
        <Search className="w-4 h-4" />
        <span className="text-sm hidden sm:inline">{t.search}</span>
      </button>
      {open && (
        <div className="fixed inset-0 z-[60] bg-background sm:absolute sm:inset-auto sm:end-0 sm:top-full sm:mt-2 sm:w-80 sm:bg-card sm:border sm:border-border sm:rounded-lg sm:shadow-lg flex flex-col">
          <form onSubmit={e => { e.preventDefault(); results[0] ? pick(results[0]) : worldSearch(); }}
            className="flex items-center gap-2 p-3 border-b border-border">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input ref={inputRef} value={q} onChange={e => { setQ(e.target.value); setNotFound(false); }}
              placeholder={t.searchCity} className="flex-1 bg-transparent outline-none text-base sm:text-sm min-w-0" />
            {busy && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
            <button type="button" onClick={close} aria-label="Close" className="p-1 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </form>
          <div className="overflow-y-auto sm:max-h-80 flex-1">
            {results.map(c => (
              <button key={`${c.name}-${c.country}`} onClick={() => pick(c)}
                className={cn('w-full text-start px-4 py-3 hover:bg-secondary transition-colors border-b border-border last:border-b-0',
                  currentCity?.name === c.name && 'bg-secondary/50')}>
                <div className="font-medium text-foreground">{cityName(c, lang)}</div>
                <div className="text-sm text-muted-foreground">{countryName(c, lang)}</div>
              </button>
            ))}
            {q.trim() && (
              <button onClick={worldSearch} disabled={busy}
                className="w-full text-start px-4 py-3 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                🌍 {q.trim()} …
              </button>
            )}
            {notFound && <p className="px-4 py-3 text-sm text-muted-foreground">✕ “{q}”</p>}
          </div>
        </div>
      )}
    </div>
  );
}
