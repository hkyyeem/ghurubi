import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import { LANGS, legacyLangRedirect, useI18n, type Lang } from '@/lib/i18n';

function langOf(path: string): Lang {
  const seg = path.split('/')[1] as Lang;
  return seg !== 'en' && LANGS.includes(seg) ? seg : 'en';
}

/** Sends indexed `?lang=` URLs to the path-prefix address and tags that address as canonical. */
export function LegacyLangRedirect() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setLang } = useI18n();
  const next = legacyLangRedirect(location.pathname, location.search);

  useEffect(() => {
    if (!next) return;
    setLang(langOf(next.split('?')[0]));
    navigate(next + location.hash, { replace: true });
  }, [next, location.hash, navigate, setLang]);

  if (!next) return null;
  const path = next.split('?')[0] || '/';
  return (
    <Helmet>
      <link rel="canonical" href={`https://ghurubi.com${path}`} />
    </Helmet>
  );
}
