import { useState } from 'react';
import { Share2, Copy, Link2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useI18n } from '@/lib/i18n';
import { hashtag } from '@/lib/compareShare';

interface Props {
  url: string;
  nameA: string;
  nameB: string;
  /** natural sunset gap in minutes; negative = A sets first */
  sunsetGap: number;
  /** absolute civil clock gap in minutes, null if unknown */
  civilGap: number | null;
}

type L = 'ar' | 'en' | 'tr' | 'he';

const dur = (min: number, l: L) => {
  const h = Math.floor(min / 60), m = min % 60;
  const W = {
    ar: { h: (n: number) => n === 1 ? 'ساعة' : n === 2 ? 'ساعتين' : `${n} ${n <= 10 ? 'ساعات' : 'ساعة'}`, m: (n: number) => n === 1 ? 'دقيقة' : n === 2 ? 'دقيقتين' : `${n} ${n <= 10 ? 'دقائق' : 'دقيقة'}`, and: ' و' },
    en: { h: (n: number) => `${n} hour${n > 1 ? 's' : ''}`, m: (n: number) => `${n} minute${n > 1 ? 's' : ''}`, and: ' ' },
    tr: { h: (n: number) => `${n} saat`, m: (n: number) => `${n} dakika`, and: ' ' },
    he: { h: (n: number) => n === 1 ? 'שעה' : `${n} שעות`, m: (n: number) => n === 1 ? 'דקה' : `${n} דקות`, and: ' ו-' },
  }[l];
  if (h && m) return `${W.h(h)}${W.and}${W.m(m)}`;
  return h ? W.h(h) : W.m(m);
};

const COPY = {
  ar: {
    share: 'مشاركة المقارنة', x: 'نشر على X', text: 'نسخ النص', link: 'نسخ الرابط', copied: 'تم النسخ', tag: 'ساعة الأرض الطبيعية',
    l1: (a: string, b: string, d: string) => `غروب الشمس في ${a} يسبق ${b} بـ ${d}.`,
    same: (a: string, b: string) => `الشمس تغرب في ${a} و${b} في اللحظة نفسها.`,
    eq: 'بينما في الساعة الزوالية: الوقت متطابق تماماً!',
    gap: (d: string) => `بينما في الساعة الزوالية: يفصلهما ${d}!`,
    via: 'عبر غروبي',
  },
  en: {
    share: 'Share comparison', x: 'Post on X', text: 'Copy text', link: 'Copy link', copied: 'Copied', tag: 'The Earth Clock',
    l1: (a: string, b: string, d: string) => `Sunset in ${a} comes ${d} before ${b}.`,
    same: (a: string, b: string) => `The sun sets in ${a} and ${b} at the same moment.`,
    eq: 'Yet on the civil clock: the exact same time!',
    gap: (d: string) => `Yet on the civil clock: ${d} apart!`,
    via: 'via Ghurubi',
  },
  tr: {
    share: 'Karşılaştırmayı paylaş', x: "X'te paylaş", text: 'Metni kopyala', link: 'Bağlantıyı kopyala', copied: 'Kopyalandı', tag: 'Dünya Saati',
    l1: (a: string, b: string, d: string) => `${a}'da güneş ${b}'dan ${d} önce batıyor.`,
    same: (a: string, b: string) => `${a} ve ${b}'da güneş aynı anda batıyor.`,
    eq: 'Oysa resmî saatte: tamamen aynı!',
    gap: (d: string) => `Oysa resmî saatte: aralarında ${d} var!`,
    via: 'Ghurubi ile',
  },
  he: {
    share: 'שתף השוואה', x: 'פרסם ב-X', text: 'העתק טקסט', link: 'העתק קישור', copied: 'הועתק', tag: 'שעון כדור הארץ',
    l1: (a: string, b: string, d: string) => `השקיעה ב${a} מקדימה את ${b} ב-${d}.`,
    same: (a: string, b: string) => `השמש שוקעת ב${a} וב${b} באותו רגע.`,
    eq: 'אבל בשעון האזרחי: בדיוק אותה שעה!',
    gap: (d: string) => `אבל בשעון האזרחי: ${d} ביניהן!`,
    via: 'דרך Ghurubi',
  },
};

export function buildCompareText(l: L, nameA: string, nameB: string, sunsetGap: number, civilGap: number | null) {
  const c = COPY[l];
  const [first, second] = sunsetGap < 0 ? [nameA, nameB] : [nameB, nameA];
  const l1 = sunsetGap === 0 ? c.same(nameA, nameB) : c.l1(first, second, dur(Math.abs(sunsetGap), l));
  const l2 = civilGap == null ? '' : civilGap === 0 ? c.eq : c.gap(dur(civilGap, l));
  return [l1, l2].filter(Boolean).join('\n') + `\n\n${hashtag(nameA)} ${hashtag(nameB)} · ${c.via}`;
}

export function ShareCompareCard({ url, nameA, nameB, sunsetGap, civilGap }: Props) {
  const { lang } = useI18n();
  const l = (lang in COPY ? lang : 'en') as L;
  const c = COPY[l];
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const text = buildCompareText(l, nameA, nameB, sunsetGap, civilGap);
  const [line1, line2] = text.split('\n');

  const copy = async (v: string, k: string) => {
    try { await navigator.clipboard.writeText(v); setDone(k); toast.success(c.copied); setTimeout(() => setDone(null), 1500); } catch { /* ignore */ }
  };
  const start = async () => {
    if (window.matchMedia('(pointer: coarse)').matches && navigator.share) {
      try { await navigator.share({ title: 'Ghurubi', text, url }); return; } catch { /* fall back */ }
    }
    setOpen(true);
  };
  const btn = 'flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium hover:bg-secondary transition-colors';

  return (
    <div className="text-center pb-6">
      <button onClick={start} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors">
        <Share2 className="w-4 h-4" />{c.share}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogTitle className="sr-only">{c.share}</DialogTitle>
          <DialogDescription className="sr-only">{nameA} · {nameB}</DialogDescription>
          <div className="rounded-2xl border border-border bg-background p-7 text-start">
            <div className="flex items-center gap-2.5">
              <img src="/icon-192.png" alt="" className="w-8 h-8 rounded-lg" />
              <div className="leading-tight">
                <p className="font-bold text-base">غروبي <span className="text-muted-foreground font-medium">· Ghurubi</span></p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{c.tag}</p>
              </div>
            </div>
            <div className="mt-7 border-t border-border pt-6 flex items-baseline justify-between gap-3">
              <p className="text-2xl font-bold tracking-tight">{nameA}</p>
              <span className="text-muted-foreground text-sm">↔</span>
              <p className="text-2xl font-bold tracking-tight">{nameB}</p>
            </div>
            <p className="mt-6 text-lg font-semibold leading-snug">{line1}</p>
            {line2 && <p className="mt-2 text-sm text-muted-foreground">{line2}</p>}
            <div className="mt-7 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
              <span>{hashtag(nameA)} {hashtag(nameB)}</span>
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
    </div>
  );
}
