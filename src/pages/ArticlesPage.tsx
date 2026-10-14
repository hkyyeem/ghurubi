import { Link, useParams, Navigate } from 'react-router-dom';
import { SeoHead } from '@/components/SeoHead';
import { SimpleHeader } from '@/components/SimpleHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { WorkdayWidget } from '@/components/WorkdayWidget';
import { useI18n } from '@/lib/i18n';
import { ARTICLES, ARTICLES_LABEL, articleBody, getArticle } from '@/lib/articles';

const SITE = 'https://ghurubi.com';

export const ArticlesIndex = () => {
  const { lang } = useI18n();
  const ar = lang === 'ar';
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SeoHead path="/articles" title={`${ARTICLES_LABEL[lang]} | ${ar ? 'غروبي' : 'Ghurubi'}`}
        desc={ar ? 'مقالات غروبي عن الزمن الطبيعي والتوقيت الغروبي وأثره في الحياة والعمل.' : 'Ghurubi essays on natural time, sunset-based time and its effect on life and work.'} />
      <SimpleHeader />
      <main className="container-narrow py-12 md:py-20 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-12">{ARTICLES_LABEL[lang]}</h1>
        <ul className="space-y-10">
          {ARTICLES.map(a => {
            const b = articleBody(a, lang);
            return (
              <li key={a.slug} className="border-t border-border pt-6">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{b.kicker}</p>
                <Link to={`/articles/${a.slug}`} className="text-2xl md:text-3xl font-semibold hover:underline">{b.h1}</Link>
                <p className="text-muted-foreground mt-3 leading-relaxed">{b.lead}</p>
              </li>
            );
          })}
        </ul>
      </main>
      <SiteFooter />
    </div>
  );
};

export const ArticlePage = () => {
  const { slug = '' } = useParams();
  const { lang } = useI18n();
  const a = getArticle(slug);
  if (!a) return <Navigate to="/articles" replace />;
  const b = articleBody(a, lang);
  const ar = lang === 'ar';
  const url = `${SITE}/articles/${a.slug}`;
  const xHref = `https://x.com/intent/tweet?text=${encodeURIComponent(b.tweet)}&url=${encodeURIComponent(url)}&via=ghurubi`;
  const share = async () => {
    if (navigator.share) { try { await navigator.share({ title: b.h1, text: b.tweet, url }); } catch { /* cancelled */ } }
    else window.open(xHref, '_blank', 'noopener');
  };
  const btn = 'px-4 py-2 border border-border rounded-md text-sm hover:bg-foreground hover:text-background transition-colors';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SeoHead path={`/articles/${a.slug}`} title={b.title} desc={b.desc} />
      <SimpleHeader />
      <main className="container-narrow py-12 md:py-20 max-w-3xl">
        <Link to="/articles" className="text-sm text-muted-foreground hover:text-foreground">← {ARTICLES_LABEL[lang]}</Link>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-8 mb-4">{b.kicker}</p>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-6">{b.h1}</h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">{b.lead}</p>
        <div className="flex flex-wrap gap-3 mb-14">
          <button onClick={share} className={btn}>{ar ? 'شارك المقال' : 'Share'}</button>
          <a href={xHref} target="_blank" rel="noopener noreferrer" className={btn}>{ar ? 'غرّد على X' : 'Post on X'}</a>
        </div>
        <ol className="space-y-14">
          {b.sections.map((s, i) => (
            <li key={i} className="grid md:grid-cols-[4rem_1fr] gap-4 border-t border-border pt-8">
              <span className="text-sm font-semibold text-muted-foreground tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <section>
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">{s.h}</h2>
                <div className="space-y-3 text-muted-foreground leading-relaxed">
                  {s.p.map((p, j) => <p key={j}>{p}</p>)}
                </div>
                {s.quote && <blockquote className="mt-6 border-s-2 border-foreground ps-4 text-xl font-medium text-foreground">{s.quote}</blockquote>}
                {a.widget === 'workday' && i === 4 && <div className="mt-6"><WorkdayWidget /></div>}
              </section>
            </li>
          ))}
        </ol>
        <section className="border-t border-border mt-16 pt-8 flex flex-wrap gap-3">
          <Link to="/" className={btn}>{ar ? 'الوقت الآن في موقعك' : 'Time at your location'}</Link>
          <Link to="/about" className={btn}>{ar ? 'فلسفة غروبي' : 'Ghurubi philosophy'}</Link>
          <button onClick={share} className={btn}>{ar ? 'شارك المقال' : 'Share'}</button>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};
