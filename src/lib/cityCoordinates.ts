/**
 * City-Level Coordinate System
 * Uses city center coordinates for consistency across devices
 */

export interface CityInfo {
  name: string;
  nameAr: string;
  country: string;
  countryAr: string;
  latitude: number;
  longitude: number;
}

// Major cities with their center coordinates
export const MAJOR_CITIES: CityInfo[] = [
  // Saudi Arabia
  { name: 'Riyadh', nameAr: 'الرياض', country: 'Saudi Arabia', countryAr: 'السعودية', latitude: 24.7136, longitude: 46.6753 },
  { name: 'Makkah', nameAr: 'مكة المكرمة', country: 'Saudi Arabia', countryAr: 'السعودية', latitude: 21.4225, longitude: 39.8262 },
  { name: 'Madinah', nameAr: 'المدينة المنورة', country: 'Saudi Arabia', countryAr: 'السعودية', latitude: 24.5247, longitude: 39.5692 },
  { name: 'Jeddah', nameAr: 'جدة', country: 'Saudi Arabia', countryAr: 'السعودية', latitude: 21.5433, longitude: 39.1728 },
  { name: 'Dammam', nameAr: 'الدمام', country: 'Saudi Arabia', countryAr: 'السعودية', latitude: 26.4207, longitude: 50.0888 },
  { name: 'Taif', nameAr: 'الطائف', country: 'Saudi Arabia', countryAr: 'السعودية', latitude: 21.2703, longitude: 40.4158 },
  { name: 'Tabuk', nameAr: 'تبوك', country: 'Saudi Arabia', countryAr: 'السعودية', latitude: 28.3998, longitude: 36.5715 },
  { name: 'Abha', nameAr: 'أبها', country: 'Saudi Arabia', countryAr: 'السعودية', latitude: 18.2164, longitude: 42.5053 },
  
  // UAE
  { name: 'Dubai', nameAr: 'دبي', country: 'UAE', countryAr: 'الإمارات', latitude: 25.2048, longitude: 55.2708 },
  { name: 'Abu Dhabi', nameAr: 'أبوظبي', country: 'UAE', countryAr: 'الإمارات', latitude: 24.4539, longitude: 54.3773 },
  
  // Egypt
  { name: 'Cairo', nameAr: 'القاهرة', country: 'Egypt', countryAr: 'مصر', latitude: 30.0444, longitude: 31.2357 },
  { name: 'Alexandria', nameAr: 'الإسكندرية', country: 'Egypt', countryAr: 'مصر', latitude: 31.2001, longitude: 29.9187 },
  
  // Jordan
  { name: 'Amman', nameAr: 'عمان', country: 'Jordan', countryAr: 'الأردن', latitude: 31.9454, longitude: 35.9284 },
  
  // Lebanon
  { name: 'Beirut', nameAr: 'بيروت', country: 'Lebanon', countryAr: 'لبنان', latitude: 33.8938, longitude: 35.5018 },
  
  // Kuwait
  { name: 'Kuwait City', nameAr: 'الكويت', country: 'Kuwait', countryAr: 'الكويت', latitude: 29.3759, longitude: 47.9774 },
  
  // Qatar
  { name: 'Doha', nameAr: 'الدوحة', country: 'Qatar', countryAr: 'قطر', latitude: 25.2854, longitude: 51.5310 },
  
  // Bahrain
  { name: 'Manama', nameAr: 'المنامة', country: 'Bahrain', countryAr: 'البحرين', latitude: 26.2285, longitude: 50.5860 },
  
  // Oman
  { name: 'Muscat', nameAr: 'مسقط', country: 'Oman', countryAr: 'عُمان', latitude: 23.5880, longitude: 58.3829 },
  
  // Morocco
  { name: 'Casablanca', nameAr: 'الدار البيضاء', country: 'Morocco', countryAr: 'المغرب', latitude: 33.5731, longitude: -7.5898 },
  { name: 'Rabat', nameAr: 'الرباط', country: 'Morocco', countryAr: 'المغرب', latitude: 34.0209, longitude: -6.8416 },
  
  // Iraq
  { name: 'Baghdad', nameAr: 'بغداد', country: 'Iraq', countryAr: 'العراق', latitude: 33.3152, longitude: 44.3661 },
  
  // Syria
  { name: 'Damascus', nameAr: 'دمشق', country: 'Syria', countryAr: 'سوريا', latitude: 33.5138, longitude: 36.2765 },
  
  // Palestine
  { name: 'Jerusalem', nameAr: 'القدس', country: 'Palestine', countryAr: 'فلسطين', latitude: 31.7683, longitude: 35.2137 },
  { name: 'Gaza', nameAr: 'غزة', country: 'Palestine', countryAr: 'فلسطين', latitude: 31.5017, longitude: 34.4668 },
  
  // Tunisia
  { name: 'Tunis', nameAr: 'تونس', country: 'Tunisia', countryAr: 'تونس', latitude: 36.8065, longitude: 10.1815 },
  
  // Algeria
  { name: 'Algiers', nameAr: 'الجزائر', country: 'Algeria', countryAr: 'الجزائر', latitude: 36.7538, longitude: 3.0588 },
  
  // Libya
  { name: 'Tripoli', nameAr: 'طرابلس', country: 'Libya', countryAr: 'ليبيا', latitude: 32.8872, longitude: 13.1913 },
  
  // Sudan
  { name: 'Khartoum', nameAr: 'الخرطوم', country: 'Sudan', countryAr: 'السودان', latitude: 15.5007, longitude: 32.5599 },
  
  // Yemen
  { name: 'Sanaa', nameAr: 'صنعاء', country: 'Yemen', countryAr: 'اليمن', latitude: 15.3694, longitude: 44.1910 },
  { name: 'Aden', nameAr: 'عدن', country: 'Yemen', countryAr: 'اليمن', latitude: 12.7855, longitude: 45.0187 },
  
  // Turkey
  { name: 'Istanbul', nameAr: 'إسطنبول', country: 'Turkey', countryAr: 'تركيا', latitude: 41.0082, longitude: 28.9784 },
  { name: 'Ankara', nameAr: 'أنقرة', country: 'Turkey', countryAr: 'تركيا', latitude: 39.9334, longitude: 32.8597 },
  
  // Iran
  { name: 'Tehran', nameAr: 'طهران', country: 'Iran', countryAr: 'إيران', latitude: 35.6892, longitude: 51.3890 },
  
  // Pakistan
  { name: 'Islamabad', nameAr: 'إسلام آباد', country: 'Pakistan', countryAr: 'باكستان', latitude: 33.6844, longitude: 73.0479 },
  { name: 'Karachi', nameAr: 'كراتشي', country: 'Pakistan', countryAr: 'باكستان', latitude: 24.8607, longitude: 67.0011 },
  
  // Malaysia
  { name: 'Kuala Lumpur', nameAr: 'كوالالمبور', country: 'Malaysia', countryAr: 'ماليزيا', latitude: 3.1390, longitude: 101.6869 },
  
  // Indonesia
  { name: 'Jakarta', nameAr: 'جاكرتا', country: 'Indonesia', countryAr: 'إندونيسيا', latitude: -6.2088, longitude: 106.8456 },
  
  // USA (Major Muslim population cities)
  { name: 'New York', nameAr: 'نيويورك', country: 'USA', countryAr: 'أمريكا', latitude: 40.7128, longitude: -74.0060 },
  { name: 'Los Angeles', nameAr: 'لوس أنجلوس', country: 'USA', countryAr: 'أمريكا', latitude: 34.0522, longitude: -118.2437 },
  { name: 'Chicago', nameAr: 'شيكاغو', country: 'USA', countryAr: 'أمريكا', latitude: 41.8781, longitude: -87.6298 },
  
  // UK
  { name: 'London', nameAr: 'لندن', country: 'UK', countryAr: 'بريطانيا', latitude: 51.5074, longitude: -0.1278 },
  { name: 'Birmingham', nameAr: 'برمنغهام', country: 'UK', countryAr: 'بريطانيا', latitude: 52.4862, longitude: -1.8904 },
  
  // France
  { name: 'Paris', nameAr: 'باريس', country: 'France', countryAr: 'فرنسا', latitude: 48.8566, longitude: 2.3522 },
  
  // Germany
  { name: 'Berlin', nameAr: 'برلين', country: 'Germany', countryAr: 'ألمانيا', latitude: 52.5200, longitude: 13.4050 },
];

/**
 * Find the nearest city to given coordinates
 */
export function findNearestCity(latitude: number, longitude: number): CityInfo | null {
  if (MAJOR_CITIES.length === 0) return null;
  
  let nearestCity = MAJOR_CITIES[0];
  let minDistance = calculateDistance(latitude, longitude, nearestCity.latitude, nearestCity.longitude);
  
  for (const city of MAJOR_CITIES) {
    const distance = calculateDistance(latitude, longitude, city.latitude, city.longitude);
    if (distance < minDistance) {
      minDistance = distance;
      nearestCity = city;
    }
  }
  
  // Only return if within reasonable distance (500km)
  if (minDistance <= 500) {
    return nearestCity;
  }
  
  return null;
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Get city by name
 */
export function getCityByName(name: string): CityInfo | undefined {
  return MAJOR_CITIES.find(
    city => city.name.toLowerCase() === name.toLowerCase() ||
            city.nameAr === name
  );
}

/**
 * Default city (Makkah)
 */
export const DEFAULT_CITY: CityInfo = {
  name: 'Makkah',
  nameAr: 'مكة المكرمة',
  country: 'Saudi Arabia',
  countryAr: 'السعودية',
  latitude: 21.4225,
  longitude: 39.8262,
};

/** URL slug for a city, e.g. "Kuala Lumpur" -> "kuala-lumpur" */
export function citySlug(city: CityInfo): string {
  return city.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function getCityBySlug(slug?: string): CityInfo | undefined {
  if (!slug) return undefined;
  return MAJOR_CITIES.find(c => citySlug(c) === slug.toLowerCase());
}

/** Canonical compare slug: alphabetical order so each pair has one URL */
export function compareSlug(a: CityInfo, b: CityInfo): string {
  const [x, y] = [citySlug(a), citySlug(b)].sort();
  return `${x}-vs-${y}`;
}
