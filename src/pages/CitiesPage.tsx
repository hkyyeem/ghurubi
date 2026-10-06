import { Link } from 'react-router-dom';
import { MAJOR_CITIES, citySlug } from '@/lib/cityCoordinates';
import { SeoHead } from '@/components/SeoHead';
import { SimpleHeader } from '@/components/SimpleHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { useI18n, cityName, countryName } from '@/lib/i18n';

const CitiesPage = () => {
  const { lang, t } = useI18n();
  const groups = new Map<string, typeof MAJOR_CITIES>();
  for (const c of MAJOR_CITIES) {
    const k = countryName(c, lang);
    groups.set(k, [...(groups.get(k) ?? []), c]);
  }
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SeoHead path="/cities" title={t.citiesTitle} desc={t.citiesDesc} />
      <SimpleHeader />
      <main className="container-narrow py-10">
        <h1 className="text-2xl font-semibold mb-6">{t.cities}</h1>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...groups].map(([country, list]) => (
            <section key={country}>
              <h2 className="text-sm text-muted-foreground mb-1">{country}</h2>
              <ul>{list.map(c => (
                <li key={citySlug(c)}><Link to={`/city/${citySlug(c)}`} className="block py-1 hover:underline">{cityName(c, lang)}</Link></li>
              ))}</ul>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default CitiesPage;
