import { useState } from 'react';
import { Share2, Copy, Link2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { citySlug, type CityInfo } from '@/lib/cityCoordinates';
import { useI18n } from '@/lib/i18n';

interface Props {
  time: string;
  period: string;
  dateLine: string;
  city?: CityInfo;
  cityLabel: string;
  countryLabel: string;
  isNight: boolean;
}

const COPY = {
  ar: { share: 'مشاركة الوقت', title: 'شارك الوقت الغروبي', desc: 'بطاقة جاهزة للنشر', x: 'نشر على X', text: 'نسخ النص', link: 'نسخ الرابط', copied: 'تم النسخ', now: 'الوقت الغروبي الآن في', tag: 'ساعة الأرض الطبيعية', rule: 'اليوم يبدأ بالليل عند الغروب (00:00)' },
  en: { share: 'Share time', title: 'Share Ghurubi time', desc: 'A card ready to post', x: 'Post on X', text: 'Copy text', link: 'Copy link', copied: 'Copied', now: 'Ghurubi time now in', tag: 'The Earth Clock', rule: 'The day begins with night at sunset (00:00)' },
  tr: { share: 'Saati paylaş', title: 'Ezanî saati paylaş', desc: 'Paylaşıma hazır kart', x: "X'te paylaş", text: 'Metni kopyala', link: 'Bağlantıyı kopyala', copied: 'Kopyalandı', now: 'Şu an ezanî saat:', tag: 'Dünya Saati', rule: 'Gün, gün batımında geceyle başlar (00:00)' },
  he: { share: 'שתף זמן', title: 'שתף את זמן השקיעה', desc: 'כרטיס מוכן לפרסום', x: 'פרסם ב-X', text: 'העתק טקסט', link: 'העתק קישור', copied: 'הועתק', now: 'זמן שקיעה עכשיו ב', tag: 'שעון כדור הארץ', rule: 'היום מתחיל בלילה עם השקיעה (00:00)' },
};

export function ShareTimeCard({ time, period, dateLine, city, cityLabel, countryLabel, isNight }: Props) {
  const { lang } = useI18n();
  const c = COPY[lang as keyof typeof COPY] ?? COPY.en;
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const url = `https://ghurubi.com${city ? `/city/${citySlug(city)}` : ''}`;
  const place = cityLabel !== '—' ? cityLabel : '';
  const text = `${c.now} ${place}:\n${time} — ${period}\n${c.rule}\n\nغروبي · Ghurubi — ${c.tag}`;

  const copy = async (v: string, k: string) => {
    try { await navigator.clipboard.writeText(v); setDone(k); toast.success(c.copied); setTimeout(() => setDone(null), 1500); } catch { /* ignore */ }
  };
  const start = async () => {
    const mobile = window.matchMedia('(pointer: coarse)').matches;
    if (mobile && navigator.share) {
      try { await navigator.share({ title: 'Ghurubi', text, url }); return; } catch { /* fall back */ }
    }
    setOpen(true);
  };
  const btn = 'flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium hover:bg-secondary transition-colors';

  return (
    <>
      <button onClick={start} className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors">
        <Share2 className="w-4 h-4" />{c.share}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogTitle className="sr-only">{c.title}</DialogTitle>
          <DialogDescription className="sr-only">{c.desc}</DialogDescription>

          {/* Card preview */}
          <div className="rounded-2xl border border-border bg-background p-7">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img src="/icon-192.png" alt="" className="w-8 h-8 rounded-lg" />
                <div className="leading-tight">
                  <p className="font-bold text-base">غروبي <span className="text-muted-foreground font-medium">· Ghurubi</span></p>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{c.tag}</p>
                </div>
              </div>
              <span className={`status-dot ${isNight ? 'status-dot-night' : 'status-dot-day'}`} />
            </div>

            <div className="mt-8 border-t border-border pt-6">
              <p className="text-3xl font-bold tracking-tight">{place || '—'}</p>
              {countryLabel && <p className="text-sm text-muted-foreground mt-1">{countryLabel}</p>}
            </div>

            <p dir="ltr" className="mt-6 text-6xl font-bold tabular-nums tracking-tighter text-center">{time}</p>
            <p className="mt-3 text-center text-sm font-medium">{period}</p>
            <p className="text-center text-xs text-muted-foreground mt-1">{dateLine}</p>

            <div className="mt-8 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
              <span>{c.rule}</span>
              <span dir="ltr" className="font-medium text-foreground">ghurubi.com</span>
            </div>
          </div>

          <div className="mt-4 grid gap-2">
            <a className={btn + ' bg-foreground text-background hover:bg-foreground/90 border-foreground'} target="_blank" rel="noopener noreferrer"
              href={`https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}>
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden><path d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.8-6.3L6.4 22H3.3l7.3-8.3L1 2h6.3l4.4 5.8L18.9 2Zm-1.1 18h1.7L6.3 3.9H4.5L17.8 20Z" /></svg>{c.x}
            </a>
            <div className="flex gap-2">
              <button className={btn} onClick={() => copy(`${text}\n${url}`, 't')}>{done === 't' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{c.text}</button>
              <button className={btn} onClick={() => copy(url, 'l')}>{done === 'l' ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}{c.link}</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
