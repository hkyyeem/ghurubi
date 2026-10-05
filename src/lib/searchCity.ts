import { MAJOR_CITIES, type CityInfo } from '@/lib/cityCoordinates';

/** Find a city by typed name: local list first, then worldwide lookup. */
export async function searchCityByName(query: string): Promise<CityInfo | null> {
  const q = query.trim();
  if (!q) return null;
  const lower = q.toLowerCase();
  const local = MAJOR_CITIES.find(c => c.name.toLowerCase() === lower || c.nameAr === q)
    || MAJOR_CITIES.find(c => c.name.toLowerCase().startsWith(lower) || c.nameAr.startsWith(q));
  if (local) return local;

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&accept-language=ar,en&q=${encodeURIComponent(q)}`
  );
  if (!res.ok) return null;
  const data = await res.json();
  if (!data?.[0]) return null;
  const r = data[0];
  const name = String(r.display_name || q).split(',')[0].trim();
  return {
    name: q, nameAr: name, country: '', countryAr: '',
    latitude: parseFloat(r.lat), longitude: parseFloat(r.lon),
  };
}
