import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { LANGS, useI18n, langLinks, legacyLangRedirect, type Lang } from '@/lib/i18n';

const OG_LOCALE: Record<Lang, string> = { ar: 'ar_SA', en: 'en_US', tr: 'tr_TR', he: 'he_IL' };

export function SeoHead({ path, title, desc, children }: { path: string; title: string; desc: string; children?: React.ReactNode }) {
  const { lang } = useI18n();
  const location = useLocation();
  const { canonical, alternates } = langLinks(path, lang);
  // While a legacy ?lang= URL is still on screen, the redirect owns the one canonical tag.
  const legacy = legacyLangRedirect(location.pathname, location.search);
  const canonicalHref = legacy ? `https://ghurubi.com${legacy.split('?')[0]}` : canonical;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={desc} />
      {!legacy && <link rel="canonical" href={canonical} />}
      {alternates.map(a => <link key={a.hreflang} rel="alternate" hrefLang={a.hreflang} href={a.href} />)}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={canonicalHref} />
      <meta property="og:locale" content={OG_LOCALE[lang]} />
      {LANGS.filter(l => l !== lang).map(l => (
        <meta key={l} property="og:locale:alternate" content={OG_LOCALE[l]} />
      ))}
      <meta property="og:type" content="website" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      {children}
    </Helmet>
  );
}
