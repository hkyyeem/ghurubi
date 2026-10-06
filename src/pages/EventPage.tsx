import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SeoHead } from '@/components/SeoHead';
import { SimpleHeader } from '@/components/SimpleHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { useX } from '@/lib/i18nExtra';

const EventPage = () => {
  const x = useX();
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
            <h1 className="text-3xl md:text-4xl font-bold">{name}</h1>
            {diff > 0 ? (
              <>
                <div className="mt-8 flex justify-center gap-6 md:gap-10">
                  {parts.map(([v, l]) => (
                    <div key={l}><p className="text-5xl md:text-7xl font-bold tabular-nums">{String(v).padStart(2, '0')}</p>
                      <p className="text-sm text-muted-foreground mt-1">{l}</p></div>
                  ))}
                </div>
                <p className="mt-6 text-muted-foreground">{x.sunsetsLeft(Math.ceil(diff / 86400))}</p>
              </>
            ) : <p className="mt-8 text-xl text-muted-foreground">{x.passed}</p>}
            <button className="mt-8 border border-border rounded-md px-4 py-2 text-sm"
              onClick={() => { navigator.clipboard?.writeText(window.location.href); setCopied(true); }}>
              {copied ? x.copied : x.share}
            </button>
          </section>
        ) : <h1 className="text-2xl font-semibold mb-6">{x.event}</h1>}
        <form className="max-w-md mx-auto grid gap-3 mt-6" onSubmit={e => {
          e.preventDefault();
          if (form.name && form.date) { setParams({ name: form.name, date: form.date }); setCopied(false); }
        }}>
          <label className="text-sm">{x.eventName}
            <input className={inp} value={form.name} maxLength={80} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </label>
          <label className="text-sm">{x.eventDate}
            <input type="datetime-local" className={inp} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
          </label>
          <button className="bg-foreground text-background rounded-md px-6 py-2 font-medium">{x.create}</button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
};
export default EventPage;
