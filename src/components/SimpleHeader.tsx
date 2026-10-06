import { Link } from 'react-router-dom';
import { useI18n, LANGS, LANG_LABEL } from '@/lib/i18n';

export function SimpleHeader() {
  const { lang, setLang } = useI18n();
  return (
    <header className="border-b border-border">
      <div className="container-narrow py-4 flex items-center justify-between gap-4">
        <Link to="/" className="font-bold">Ghurubi</Link>
        <div className="flex gap-3 text-sm">
          {LANGS.map(l => (
            <button key={l} onClick={() => setLang(l)}
              className={l === lang ? 'text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'}>
              {LANG_LABEL[l]}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
