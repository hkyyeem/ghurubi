import { MAJOR_CITIES, citySlug, type CityInfo } from '@/lib/cityCoordinates';

const DISCOVERED_KEY = 'ghurubi-discovered-cities';

/** Cities found by worldwide search, remembered on this device. */
export function getDiscoveredCities(): CityInfo[] {
  try { return JSON.parse(localStorage.getItem(DISCOVERED_KEY) || '[]'); } catch { return []; }
}
function remember(c: CityInfo) {
  try {
    const list = getDiscoveredCities().filter(x => citySlug(x) !== citySlug(c));
    localStorage.setItem(DISCOVERED_KEY, JSON.stringify([c, ...list].slice(0, 30)));
  } catch { /* ignore */ }
}

async function geocode(q: string): Promise<CityInfo | null> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&namedetails=1&accept-language=en&q=${encodeURIComponent(q)}`
  );
  if (!res.ok) return null;
  const data = await res.json();
  const r = data?.[0];
  if (!r) return null;
  const nd = r.namedetails || {};
  const en = nd['name:en'] || nd.name || String(r.display_name || q).split(',')[0].trim();
  const city: CityInfo = {
    name: en, nameAr: nd['name:ar'] || en,
    country: r.address?.country || '', countryAr: '',
    latitude: parseFloat(r.lat), longitude: parseFloat(r.lon),
  };
  if (!citySlug(city)) return null;
  remember(city);
  return city;
}

/** Find a city by typed name: local list first, then worldwide lookup. */
export async function searchCityByName(query: string): Promise<CityInfo | null> {
  const q = query.trim();
  if (!q) return null;
  const lower = q.toLowerCase();
  const local = MAJOR_CITIES.find(c => c.name.toLowerCase() === lower || c.nameAr === q)
    || MAJOR_CITIES.find(c => c.name.toLowerCase().startsWith(lower) || c.nameAr.startsWith(q));
  if (local) return local;
  const known = getDiscoveredCities().find(c => c.name.toLowerCase() === lower || c.nameAr === q);
  if (known) return known;
  return geocode(q);
}

/** Resolve a city page slug that is not in the built-in list. */
export async function resolveCitySlug(slug: string): Promise<CityInfo | null> {
  const known = getDiscoveredCities().find(c => citySlug(c) === slug);
  if (known) return known;
  return geocode(slug.replace(/-/g, ' '));
}
