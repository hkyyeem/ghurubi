import { Helmet } from 'react-helmet-async';
import { useI18n, langLinks } from '@/lib/i18n';

export function SeoHead({ path, title, desc, children }: { path: string; title: string; desc: string; children?: React.ReactNode }) {
  const { lang } = useI18n();
  const { canonical, alternates } = langLinks(path, lang);
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />
      {alternates.map(a => <link key={a.hreflang} rel="alternate" hrefLang={a.hreflang} href={a.href} />)}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={canonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      {children}
    </Helmet>
  );
}
