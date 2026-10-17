import { Search } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const TEXT: Record<string, { q: string; a: string }> = {
  ar: { q: 'هل تبحث عن مدينة ولم تجدها؟', a: 'اكتب اسم أي مدينة أو بلدة في شريط البحث بالأعلى، وسنحسب لك وقتها الغروبي ومواقيتها فوراً.' },
  en: { q: "Can't find your city?", a: 'Type any city or town in the search bar above and we will show its Ghurubi time and sun schedule instantly.' },
  tr: { q: 'Şehrinizi bulamadınız mı?', a: 'Yukarıdaki arama çubuğuna herhangi bir şehir yazın, Ghurubi saatini ve güneş vakitlerini hemen gösterelim.' },
  he: { q: 'לא מצאת את העיר שלך?', a: 'הקלד כל עיר בשורת החיפוש למעלה ונציג מיד את זמן Ghurubi ולוח השמש שלה.' },
};

export function CitySearchHint() {
  const { lang } = useI18n();
  const t = TEXT[lang] ?? TEXT.en;
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm">
      <Search className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
      <p><span className="font-semibold">{t.q}</span> <span className="text-muted-foreground">{t.a}</span></p>
    </div>
  );
}
