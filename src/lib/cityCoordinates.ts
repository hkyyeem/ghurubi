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

  // More well-known cities
  { name: 'Aleppo', nameAr: 'حلب', country: 'Syria', countryAr: 'سوريا', latitude: 36.2021, longitude: 37.1343 },
  { name: 'Homs', nameAr: 'حمص', country: 'Syria', countryAr: 'سوريا', latitude: 34.7324, longitude: 36.7137 },
  { name: 'Latakia', nameAr: 'اللاذقية', country: 'Syria', countryAr: 'سوريا', latitude: 35.5317, longitude: 35.7901 },
  { name: 'Mosul', nameAr: 'الموصل', country: 'Iraq', countryAr: 'العراق', latitude: 36.3456, longitude: 43.1575 },
  { name: 'Basra', nameAr: 'البصرة', country: 'Iraq', countryAr: 'العراق', latitude: 30.5085, longitude: 47.7804 },
  { name: 'Erbil', nameAr: 'أربيل', country: 'Iraq', countryAr: 'العراق', latitude: 36.1912, longitude: 44.0092 },
  { name: 'Sharjah', nameAr: 'الشارقة', country: 'UAE', countryAr: 'الإمارات', latitude: 25.3463, longitude: 55.4209 },
  { name: 'Buraydah', nameAr: 'بريدة', country: 'Saudi Arabia', countryAr: 'السعودية', latitude: 26.3592, longitude: 43.9818 },
  { name: 'Hail', nameAr: 'حائل', country: 'Saudi Arabia', countryAr: 'السعودية', latitude: 27.5114, longitude: 41.7208 },
  { name: 'Jazan', nameAr: 'جازان', country: 'Saudi Arabia', countryAr: 'السعودية', latitude: 16.8892, longitude: 42.5511 },
  { name: 'Hofuf', nameAr: 'الهفوف', country: 'Saudi Arabia', countryAr: 'السعودية', latitude: 25.3833, longitude: 49.5865 },
  { name: 'Irbid', nameAr: 'إربد', country: 'Jordan', countryAr: 'الأردن', latitude: 32.5556, longitude: 35.85 },
  { name: 'Tripoli LB', nameAr: 'طرابلس الشام', country: 'Lebanon', countryAr: 'لبنان', latitude: 34.4367, longitude: 35.8497 },
  { name: 'Marrakesh', nameAr: 'مراكش', country: 'Morocco', countryAr: 'المغرب', latitude: 31.6295, longitude: -7.9811 },
  { name: 'Fez', nameAr: 'فاس', country: 'Morocco', countryAr: 'المغرب', latitude: 34.0181, longitude: -5.0078 },
  { name: 'Oran', nameAr: 'وهران', country: 'Algeria', countryAr: 'الجزائر', latitude: 35.6971, longitude: -0.6308 },
  { name: 'Benghazi', nameAr: 'بنغازي', country: 'Libya', countryAr: 'ليبيا', latitude: 32.1167, longitude: 20.0667 },
  { name: 'Nouakchott', nameAr: 'نواكشوط', country: 'Mauritania', countryAr: 'موريتانيا', latitude: 18.0735, longitude: -15.9582 },
  { name: 'Mogadishu', nameAr: 'مقديشو', country: 'Somalia', countryAr: 'الصومال', latitude: 2.0469, longitude: 45.3182 },
  { name: 'Djibouti', nameAr: 'جيبوتي', country: 'Djibouti', countryAr: 'جيبوتي', latitude: 11.5721, longitude: 43.1456 },
  { name: 'Hebron', nameAr: 'الخليل', country: 'Palestine', countryAr: 'فلسطين', latitude: 31.5326, longitude: 35.0998 },
  { name: 'Nablus', nameAr: 'نابلس', country: 'Palestine', countryAr: 'فلسطين', latitude: 32.2211, longitude: 35.2544 },
  { name: 'Izmir', nameAr: 'إزمير', country: 'Turkey', countryAr: 'تركيا', latitude: 38.4237, longitude: 27.1428 },
  { name: 'Bursa', nameAr: 'بورصة', country: 'Turkey', countryAr: 'تركيا', latitude: 40.1885, longitude: 29.061 },
  { name: 'Konya', nameAr: 'قونية', country: 'Turkey', countryAr: 'تركيا', latitude: 37.8746, longitude: 32.4932 },
  { name: 'Gaziantep', nameAr: 'غازي عنتاب', country: 'Turkey', countryAr: 'تركيا', latitude: 37.0662, longitude: 37.3833 },
  { name: 'Tel Aviv', nameAr: 'تل أبيب', country: 'Israel', countryAr: 'إسرائيل', latitude: 32.0853, longitude: 34.7818 },
  { name: 'Haifa', nameAr: 'حيفا', country: 'Israel', countryAr: 'إسرائيل', latitude: 32.794, longitude: 34.9896 },
  { name: 'Dhaka', nameAr: 'دكا', country: 'Bangladesh', countryAr: 'بنغلاديش', latitude: 23.8103, longitude: 90.4125 },
  { name: 'Lahore', nameAr: 'لاهور', country: 'Pakistan', countryAr: 'باكستان', latitude: 31.5204, longitude: 74.3587 },
  { name: 'Delhi', nameAr: 'دلهي', country: 'India', countryAr: 'الهند', latitude: 28.6139, longitude: 77.209 },
  { name: 'Mumbai', nameAr: 'مومباي', country: 'India', countryAr: 'الهند', latitude: 19.076, longitude: 72.8777 },
  { name: 'Kabul', nameAr: 'كابل', country: 'Afghanistan', countryAr: 'أفغانستان', latitude: 34.5553, longitude: 69.2075 },
  { name: 'Tashkent', nameAr: 'طشقند', country: 'Uzbekistan', countryAr: 'أوزبكستان', latitude: 41.2995, longitude: 69.2401 },
  { name: 'Baku', nameAr: 'باكو', country: 'Azerbaijan', countryAr: 'أذربيجان', latitude: 40.4093, longitude: 49.8671 },
  { name: 'Lagos', nameAr: 'لاغوس', country: 'Nigeria', countryAr: 'نيجيريا', latitude: 6.5244, longitude: 3.3792 },
  { name: 'Moscow', nameAr: 'موسكو', country: 'Russia', countryAr: 'روسيا', latitude: 55.7558, longitude: 37.6173 },
  { name: 'Madrid', nameAr: 'مدريد', country: 'Spain', countryAr: 'إسبانيا', latitude: 40.4168, longitude: -3.7038 },
  { name: 'Rome', nameAr: 'روما', country: 'Italy', countryAr: 'إيطاليا', latitude: 41.9028, longitude: 12.4964 },
  { name: 'Toronto', nameAr: 'تورونتو', country: 'Canada', countryAr: 'كندا', latitude: 43.6532, longitude: -79.3832 },
  { name: 'Sydney', nameAr: 'سيدني', country: 'Australia', countryAr: 'أستراليا', latitude: -33.8688, longitude: 151.2093 },
  { name: 'Tokyo', nameAr: 'طوكيو', country: 'Japan', countryAr: 'اليابان', latitude: 35.6762, longitude: 139.6503 },
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
