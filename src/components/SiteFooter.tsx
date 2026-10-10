import { Link } from 'react-router-dom';
import { MAJOR_CITIES, citySlug } from '@/lib/cityCoordinates';
import { getDiscoveredCities } from '@/lib/searchCity';
import { useI18n, cityName } from '@/lib/i18n';
import { useX } from '@/lib/i18nExtra';
import { ABOUT_LABEL } from '@/pages/AboutPage';

export function SiteFooter() {
  const { lang, t } = useI18n();
  const x = useX();
  const recent = getDiscoveredCities().filter(d => !MAJOR_CITIES.some(m => citySlug(m) === citySlug(d)));
  const link = 'hover:text-foreground hover:underline';
  return (
    <footer className="border-t border-border mt-12 py-10 text-sm text-muted-foreground">
      <div className="container-narrow space-y-8">
        <section>
          <h2 className="text-foreground font-semibold mb-5 text-center">{x.cityCloud}</h2>
          <ul className="flex flex-wrap items-baseline justify-center gap-x-5 gap-y-3 leading-tight">
            {MAJOR_CITIES.map((c, i) => (
              <li key={citySlug(c)}>
                <Link to={`/city/${citySlug(c)}`}
                  className={`transition-colors hover:text-foreground ${i < 8 ? 'text-xl md:text-2xl font-semibold text-foreground/85' : i < 30 ? 'text-base md:text-lg text-foreground/70' : 'text-sm text-muted-foreground'}`}>
                  {cityName(c, lang)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        {recent.length > 0 && (
          <section>
            <h2 className="text-foreground font-semibold mb-3">{x.recent}</h2>
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {recent.map(c => (
                <li key={citySlug(c)}><Link to={`/city/${citySlug(c)}`} className={link}>{cityName(c, lang)}</Link></li>
              ))}
            </ul>
          </section>
        )}
        <nav aria-label={x.tools} className="flex flex-wrap gap-x-6 gap-y-2">
          <Link to="/" className={link}>{x.home}</Link>
          <Link to="/about" className={link}>{ABOUT_LABEL[lang]}</Link>
          <Link to="/cities" className={link}>{t.allCities}</Link>
          <Link to="/compare" className={link}>{x.compare}</Link>
          <Link to="/event" className={link}>{x.event}</Link>
          <Link to="/watch" className={link}>{x.watch}</Link>
          <Link to="/sitemap" className={link}>{x.sitemap}</Link>
          <Link to="/privacy" className={link}>{x.privacy}</Link>
          <a href="https://x.com/ghurubi" target="_blank" rel="noopener noreferrer" className={link} aria-label="X (Twitter)">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 inline-block align-[-2px]" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span className="ms-1">@ghurubi</span>
          </a>
          <a href="https://github.com/hkyyeem/ghurubi" target="_blank" rel="noopener noreferrer" className={link} aria-label="GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 inline-block align-[-2px]" aria-hidden="true">
              <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z"/>
            </svg>
            <span className="ms-1">GitHub</span>
          </a>
        </nav>
        <div className="text-center pt-4 border-t border-border">
          <p>{t.footer1}</p>
          <p className="mt-1 text-xs">{t.footer2}</p>
        </div>
      </div>
    </footer>
  );
}
