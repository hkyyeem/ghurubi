import { Link } from 'react-router-dom';
import { CitySearchHint } from '@/components/CitySearchHint';
import { MAJOR_CITIES, citySlug } from '@/lib/cityCoordinates';
import { SeoHead } from '@/components/SeoHead';
import { SimpleHeader } from '@/components/SimpleHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { useI18n, useLangPath, cityName } from '@/lib/i18n';
import { useX } from '@/lib/i18nExtra';
import { ARTICLES_LABEL } from '@/lib/articles';
import { WEAR_LABEL } from '@/lib/pageLabels';

const SitemapPage = () => {
  const { lang, t } = useI18n();
  const lp = useLangPath();
  const x = useX();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SeoHead path="/sitemap" title={x.sitemapTitle} desc={x.sitemapDesc} />
      <SimpleHeader />
      <main className="container-narrow py-10 space-y-10">
        <h1 className="text-2xl font-semibold">{x.sitemap}</h1>
        <section>
          <h2 className="font-semibold mb-3">{x.tools}</h2>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li><Link className="hover:underline" to={lp('/')}>{x.home}</Link></li>
            <li><Link className="hover:underline" to={lp('/cities')}>{t.allCities}</Link></li>
            <li><Link className="hover:underline" to={lp('/compare')}>{x.compare}</Link></li>
            <li><Link className="hover:underline" to={lp('/event')}>{x.event}</Link></li>
            <li><Link className="hover:underline" to={lp('/watch')}>{x.watch}</Link></li>
            <li><Link className="hover:underline" to={lp('/about')}>{t.about}</Link></li>
            <li><Link className="hover:underline" to={lp('/wear')}>{WEAR_LABEL[lang]}</Link></li>
            <li><Link className="hover:underline" to={lp('/articles')}>{ARTICLES_LABEL[lang]}</Link></li>
            <li><Link className="hover:underline" to={lp('/privacy')}>{x.privacy}</Link></li>
          </ul>
        </section>
        <section>
          <h2 className="font-semibold mb-3">{t.allCities}</h2>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {MAJOR_CITIES.map(c => (
              <li key={citySlug(c)}>
                <Link className="hover:underline" to={lp(`/city/${citySlug(c)}`)}>{cityName(c, lang)}</Link>
              </li>
            ))}
          </ul>
          <div className="mt-6"><CitySearchHint /></div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};
export default SitemapPage;
