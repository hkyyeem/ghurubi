import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useI18n, langLinks, legacyLangRedirect } from '@/lib/i18n';

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
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      {children}
    </Helmet>
  );
}
