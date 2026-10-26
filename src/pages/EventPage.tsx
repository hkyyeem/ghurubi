import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SeoHead } from '@/components/SeoHead';
import { SimpleHeader } from '@/components/SimpleHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { toast } from 'sonner';
import { Share2 } from 'lucide-react';
import { useX } from '@/lib/i18nExtra';
import { cityName, useI18n } from '@/lib/i18n';
import { ghurubiAt, sunsetsUntil, useGeolocation } from '@/hooks/useNaturalTime';
import { STORAGE_KEYS, useLocalStorage } from '@/hooks/useLocalStorage';

function padHM(hours: number, minutes: number) {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

const EventPage = () => {
  const x = useX();
  const { lang } = useI18n();
  const { location } = useGeolocation();
  const [seasonal] = useLocalStorage(STORAGE_KEYS.SEASONAL_HOURS, false);
  const [params, setParams] = useSearchParams();
  const name = params.get('name') || '';
  const date = params.get('date') || '';
  const target = date ? new Date(date) : null;
  const [now, setNow] = useState(Date.now());
  const [form, setForm] = useState({ name, date });
  const [copied, setCopied] = useState(false);
  useEffect(() => { const i = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(i); }, []);

  const valid = target && !isNaN(target.getTime());
  const diff = valid ? Math.max(0, Math.floor((target!.getTime() - now) / 1000)) : 0;
  const parts = [
    [Math.floor(diff / 86400), x.days], [Math.floor(diff / 3600) % 24, x.hours],
    [Math.floor(diff / 60) % 60, x.minutes], [diff % 60, x.seconds],
  ] as const;
  const ghurubi = valid && location ? ghurubiAt(target!, location, seasonal) : null;
  const hm = ghurubi ? padHM(ghurubi.hours, ghurubi.minutes) : '';
  const sunsets = valid && location && diff > 0 ? sunsetsUntil(new Date(now), target!, location) : 0;
  const place = cityName(location?.city, lang);
  const title = valid && name ? `${name} — ${x.remaining} | Ghurubi` : x.eventTitle;
  const inp = 'w-full bg-background border border-border rounded-md px-3 py-2';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SeoHead path="/event" title={title} desc={x.eventDesc}>
        {valid && <meta name="robots" content="noindex" />}
      </SeoHead>
      <SimpleHeader />
      <main className="container-narrow py-10">
        {valid ? (
          <section className="text-center py-10">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{name}</h1>
            {diff > 0 ? (
              <>
                <div dir="ltr" data-testid="countdown" className="mt-10 grid grid-cols-4 gap-2 md:gap-4 max-w-2xl mx-auto">
                  {parts.map(([v, l]) => (
                    <div key={l} className="border border-border rounded-xl py-4 md:py-6"><p className="text-4xl md:text-7xl font-bold tabular-nums tracking-tight">{String(v).padStart(2, '0')}</p>
                      <p className="text-xs md:text-sm uppercase tracking-wider text-muted-foreground mt-2">{l}</p></div>
                  ))}
                </div>
                <p className="mt-6 text-muted-foreground" data-testid="event-time">
                  {x.eventAt(hm, place)}
                  {sunsets > 0 && <span data-testid="sunsets" className="block">{x.sunsetsLeft(sunsets)}</span>}
                </p>
              </>
            ) : <p className="mt-8 text-xl text-muted-foreground">{x.passed}</p>}
            <button className="mt-10 inline-flex items-center gap-2 bg-foreground text-background rounded-full px-6 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
              onClick={async () => {
                const url = window.location.href;
                try {
                  if (navigator.share) await navigator.share({ title: name, url });
                  else { await navigator.clipboard.writeText(url); toast.success(x.copied); }
                  setCopied(true);
                } catch { /* cancelled */ }
              }}>
              <Share2 className="w-4 h-4" />{copied ? x.copied : x.share}
            </button>
          </section>
        ) : <h1 className="text-2xl font-semibold mb-6">{x.event}</h1>}
        <form className="max-w-md mx-auto grid gap-4 mt-10 p-6 border border-border rounded-xl" onSubmit={e => {
          e.preventDefault();
          if (form.name && form.date) { setParams({ name: form.name, date: form.date }); setCopied(false); }
        }}>
          <label className="text-sm">{x.eventName}
            <input className={inp} value={form.name} maxLength={80} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </label>
          <label className="text-sm">{x.eventDate}
            <input type="datetime-local" className={inp} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
          </label>
          <button className="bg-foreground text-background rounded-md px-6 py-3 font-medium hover:opacity-90 transition-opacity">{x.create}</button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
};
export default EventPage;
