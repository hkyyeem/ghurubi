import { Link } from 'react-router-dom';
import { MAJOR_CITIES, citySlug } from '@/lib/cityCoordinates';
import { SeoHead } from '@/components/SeoHead';
import { useI18n, cityName } from '@/lib/i18n';

const CitiesPage = () => {
  const { lang, t } = useI18n();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SeoHead path="/cities" title={t.citiesTitle} desc={t.citiesDesc} />
      <header className="border-b border-border">
        <div className="container-narrow py-4"><Link to="/" className="font-bold">Ghurubi</Link></div>
      </header>
      <main className="container-narrow py-10">
        <h1 className="text-2xl font-semibold mb-6">{t.cities}</h1>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {MAJOR_CITIES.map(c => (
            <li key={c.name + c.country}>
              <Link to={`/city/${citySlug(c)}`} className="block py-2 hover:underline">{cityName(c, lang)}</Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default CitiesPage;
