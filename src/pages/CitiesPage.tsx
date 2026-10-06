import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MAJOR_CITIES, citySlug } from '@/lib/cityCoordinates';

const CitiesPage = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Helmet>
      <title>Ghurubi Time in World Cities — التوقيت الغروبي في مدن العالم | Ghurubi</title>
      <meta name="description" content="Ghurubi (sunset-based) time for cities around the world. التوقيت الغروبي لمدن العالم: اليوم يبدأ من الغروب." />
      <link rel="canonical" href="https://ghurubi.com/cities" />
    </Helmet>
    <header className="border-b border-border">
      <div className="container-narrow py-4"><Link to="/" className="font-bold">Ghurubi</Link></div>
    </header>
    <main className="container-narrow py-10">
      <h1 className="text-2xl font-semibold mb-6">Cities · المدن</h1>
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {MAJOR_CITIES.map(c => (
          <li key={c.name}>
            <Link to={`/city/${citySlug(c)}`} className="block py-2 hover:underline">
              {c.name} <span className="text-muted-foreground">· {c.nameAr}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  </div>
);

export default CitiesPage;
