import { useEffect, useRef, useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useI18n, LANGS, LANG_LABEL, langPath, stripLangPrefix } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export function LangMenu() {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const switchLang = (l: (typeof LANGS)[number]) => {
    setLang(l);
    setOpen(false);
    // Navigate to the language-prefixed URL so each language has its own crawlable address.
    const clean = stripLangPrefix(location.pathname);
    if (clean === '/login' || clean === '/admin' || clean.startsWith('/now')) return;
    const params = new URLSearchParams(location.search);
    params.delete('lang');
    const qs = params.toString();
    navigate(langPath(clean, l) + (qs ? `?${qs}` : '') + location.hash);
  };
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)} aria-haspopup="listbox" aria-expanded={open} aria-label="Language"
        className="flex items-center gap-1 px-2 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
        <Globe className="w-4 h-4" />
        <span>{LANG_LABEL[lang]}</span>
      </button>
      {open && (
        <ul role="listbox" className="absolute end-0 top-full mt-2 w-36 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
          {LANGS.map(l => (
            <li key={l}>
              <button role="option" aria-selected={l === lang} onClick={() => switchLang(l)}
                className={cn('w-full flex items-center justify-between px-3 py-2 text-sm text-start hover:bg-secondary transition-colors',
                  l === lang ? 'text-foreground font-semibold' : 'text-muted-foreground')}>
                {LANG_LABEL[l]}
                {l === lang && <Check className="w-4 h-4" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
