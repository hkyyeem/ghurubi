import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { ar, enUS, tr as trLocale, he as heLocale } from 'date-fns/locale';
import type { CityInfo } from '@/lib/cityCoordinates';

export type Lang = 'ar' | 'en' | 'tr' | 'he';
export const LANGS: Lang[] = ['ar', 'en', 'tr', 'he'];
export const LANG_LABEL: Record<Lang, string> = { ar: 'عربي', en: 'English', tr: 'Türkçe', he: 'עברית' };
export const isRtl = (l: Lang) => l === 'ar' || l === 'he';
export const DATE_LOCALES = { ar, en: enUS, tr: trLocale, he: heLocale };
const KEY = 'ghurubi-lang';

const dict = {
  en: {
    tagline: 'Sunset Time', night: 'Night', day: 'Day', seasonalHour: 'Seasonal hour',
    settings: 'Settings', seasonal: 'Seasonal Hours', seasonalSub: '12h night / 12h day',
    prayer: 'Prayer Times', prayerSub: 'Show Islamic prayer times', search: 'Search location...',
    searchCity: 'Search city...', noResults: 'No cities found', sunData: 'Sun Data',
    sunset: 'Sunset (Day Start)', sunrise: 'Sunrise', dayLen: 'Day Length', nightLen: 'Night Length',
    toSunset: 'Time to Sunset', local: 'local', ratio: 'Day/Night Ratio',
    about: 'About Ghurubi Time',
    about1: 'Ghurubi time is a natural time system where sunset marks 00:00 (the start of a new day). The night runs from 00:00 to about 12:00 (sunrise), followed by the day until the next sunset.',
    about2: 'This system follows the natural solar cycle and the historical tradition where the day began at sunset.',
    footer1: 'Ghurubi — The Earth Clock', footer2: 'Sunset = 00:00 • Night precedes Day',
    cities: 'Cities', allCities: 'All cities', vs: 'vs', nextSunset: 'Next sunset in',
    reachesBefore: (a: string, b: string, d: string) => `Sunset reaches ${a} ${d} before ${b}`,
    cityTitle: (c: string) => `Ghurubi Time in ${c} Now — Sunset-Based Natural Time | Ghurubi`,
    cityDesc: (c: string) => `Current Ghurubi (sunset-based) time in ${c}: the day begins at sunset (00:00), night first. Sunrise, sunset, day and night length.`,
    cmpTitle: (a: string, b: string) => `${a} vs ${b}: Ghurubi Time & Night Length | Ghurubi`,
    cmpDesc: (a: string, b: string) => `Compare Ghurubi (sunset-based) time between ${a} and ${b}: which city reached sunset first, night and day length.`,
    citiesTitle: 'Ghurubi Time in World Cities | Ghurubi — The Earth Clock',
    citiesDesc: 'Ghurubi (sunset-based) natural time for cities around the world. The day begins at sunset.',
    homeTitle: 'Ghurubi — The Earth Clock | Natural Sunset Time',
    homeDesc: 'Natural sunset-based time: sunset is 00:00, night comes first. Seasonal hours and prayer times for your location.',
  },
  ar: {
    tagline: 'التوقيت الغروبي', night: 'ليل', day: 'نهار', seasonalHour: 'الساعة الزمانية',
    settings: 'الإعدادات', seasonal: 'الساعات الزمانية', seasonalSub: '12 ساعة لليل / 12 للنهار',
    prayer: 'مواقيت الصلاة', prayerSub: 'إظهار مواقيت الصلاة', search: 'ابحث عن مدينة...',
    searchCity: 'ابحث عن مدينة...', noResults: 'لا توجد نتائج', sunData: 'بيانات الشمس',
    sunset: 'الغروب (بداية اليوم)', sunrise: 'الشروق', dayLen: 'طول النهار', nightLen: 'طول الليل',
    toSunset: 'المتبقي على الغروب', local: 'محلي', ratio: 'نسبة النهار إلى الليل',
    about: 'عن التوقيت الغروبي',
    about1: 'التوقيت الغروبي نظام زمني طبيعي يكون فيه الغروب الساعة 00:00 (بداية يوم جديد). يمتد الليل من 00:00 حتى نحو 12:00 (الشروق)، ثم النهار حتى الغروب التالي.',
    about2: 'يتبع هذا النظام دورة الشمس الطبيعية والتقليد التاريخي الذي يبدأ فيه اليوم من الغروب.',
    footer1: 'غروبي — ساعة الأرض', footer2: 'الغروب = 00:00 • الليل يسبق النهار',
    cities: 'المدن', allCities: 'كل المدن', vs: 'و', nextSunset: 'الغروب القادم بعد',
    reachesBefore: (a: string, b: string, d: string) => `يصل الغروب إلى ${a} قبل ${b} بـ ${d}`,
    cityTitle: (c: string) => `التوقيت الغروبي في ${c} الآن — الوقت الطبيعي | غروبي`,
    cityDesc: (c: string) => `الوقت الآن في ${c} بالتوقيت الغروبي: اليوم يبدأ من الغروب (00:00) والليل أولاً. الشروق والغروب وطول الليل والنهار.`,
    cmpTitle: (a: string, b: string) => `مقارنة التوقيت الغروبي وطول الليل: ${a} و${b} | غروبي`,
    cmpDesc: (a: string, b: string) => `مقارنة التوقيت الغروبي بين ${a} و${b}: أي المدينتين سبقها الغروب، وطول الليل والنهار في كل منهما.`,
    citiesTitle: 'التوقيت الغروبي في مدن العالم | غروبي — ساعة الأرض',
    citiesDesc: 'التوقيت الغروبي الطبيعي لمدن العالم: اليوم يبدأ من الغروب.',
    homeTitle: 'غروبي — ساعة الأرض | التوقيت الغروبي الطبيعي',
    homeDesc: 'التوقيت الطبيعي المبني على الغروب: الغروب 00:00 والليل أولاً. الساعات الزمانية ومواقيت الصلاة لموقعك.',
  },
  tr: {
    tagline: 'Ezanî Saat', night: 'Gece', day: 'Gündüz', seasonalHour: 'Zamanî saat',
    settings: 'Ayarlar', seasonal: 'Zamanî Saatler', seasonalSub: '12 saat gece / 12 saat gündüz',
    prayer: 'Namaz Vakitleri', prayerSub: 'Namaz vakitlerini göster', search: 'Şehir ara...',
    searchCity: 'Şehir ara...', noResults: 'Şehir bulunamadı', sunData: 'Güneş Verileri',
    sunset: 'Gün batımı (Günün başı)', sunrise: 'Gün doğumu', dayLen: 'Gündüz süresi', nightLen: 'Gece süresi',
    toSunset: 'Gün batımına kalan', local: 'yerel', ratio: 'Gündüz/Gece oranı',
    about: 'Ghurubi (Ezanî) Saat Hakkında',
    about1: 'Ghurubi saati, gün batımının 00:00 olduğu (yeni günün başlangıcı) doğal bir zaman sistemidir. Gece 00:00’dan yaklaşık 12:00’ye (gün doğumu) kadar sürer, ardından bir sonraki gün batımına kadar gündüz gelir.',
    about2: 'Bu sistem, Osmanlı’daki ezanî saat gibi, günün gün batımıyla başladığı tarihî geleneği ve doğal güneş döngüsünü izler.',
    footer1: 'Ghurubi — Dünya Saati', footer2: 'Gün batımı = 00:00 • Gece gündüzden önce gelir',
    cities: 'Şehirler', allCities: 'Tüm şehirler', vs: '-', nextSunset: 'Sonraki gün batımı',
    reachesBefore: (a: string, b: string, d: string) => `Gün batımı ${a} şehrine ${b} şehrinden ${d} önce ulaşır`,
    cityTitle: (c: string) => `${c} Ezanî Saat Şimdi — Gün Batımına Göre Doğal Saat | Ghurubi`,
    cityDesc: (c: string) => `${c} için şu anki ezanî (gün batımı esaslı) saat: gün, gün batımında (00:00) başlar, önce gece gelir. Gün doğumu, gün batımı, gece ve gündüz süresi.`,
    cmpTitle: (a: string, b: string) => `${a} - ${b}: Ezanî Saat ve Gece Süresi Karşılaştırması | Ghurubi`,
    cmpDesc: (a: string, b: string) => `${a} ve ${b} arasında ezanî saat karşılaştırması: gün batımı hangi şehre önce ulaştı, gece ve gündüz süresi.`,
    citiesTitle: 'Dünya Şehirlerinde Ezanî Saat | Ghurubi — Dünya Saati',
    citiesDesc: 'Dünya şehirleri için gün batımı esaslı doğal ezanî saat. Gün, gün batımında başlar.',
    homeTitle: 'Ghurubi — Dünya Saati | Ezanî (Alaturka) Saat',
    homeDesc: 'Gün batımı esaslı doğal saat: gün batımı 00:00, önce gece. Konumunuz için zamanî saatler ve namaz vakitleri.',
  },
  he: {
    tagline: 'זמן שקיעה', night: 'לילה', day: 'יום', seasonalHour: 'שעה זמנית',
    settings: 'הגדרות', seasonal: 'שעות זמניות', seasonalSub: '12 שעות לילה / 12 שעות יום',
    prayer: 'זמני תפילה', prayerSub: 'הצג זמני תפילה (אסלאם)', search: 'חפש עיר...',
    searchCity: 'חפש עיר...', noResults: 'לא נמצאו ערים', sunData: 'נתוני שמש',
    sunset: 'שקיעה (תחילת היום)', sunrise: 'זריחה', dayLen: 'אורך היום', nightLen: 'אורך הלילה',
    toSunset: 'זמן עד השקיעה', local: 'מקומי', ratio: 'יחס יום/לילה',
    about: 'על זמן גורובי',
    about1: 'זמן גורובי הוא שיטת זמן טבעית שבה השקיעה היא 00:00 (תחילת יום חדש). הלילה נמשך מ־00:00 עד כ־12:00 (זריחה), ואחריו היום עד השקיעה הבאה.',
    about2: 'שיטה זו עוקבת אחר מחזור השמש הטבעי ואחר המסורת שבה היום מתחיל בשקיעה — "ויהי ערב ויהי בוקר".',
    footer1: 'Ghurubi — שעון כדור הארץ', footer2: 'שקיעה = 00:00 • הלילה קודם ליום',
    cities: 'ערים', allCities: 'כל הערים', vs: 'מול', nextSunset: 'השקיעה הבאה בעוד',
    reachesBefore: (a: string, b: string, d: string) => `השקיעה מגיעה ל${a} ${d} לפני ${b}`,
    cityTitle: (c: string) => `שעות זמניות ב${c} עכשיו — זמן טבעי מהשקיעה | Ghurubi`,
    cityDesc: (c: string) => `הזמן הטבעי עכשיו ב${c} לפי השקיעה: היום מתחיל בשקיעה (00:00), הלילה קודם. זריחה, שקיעה, אורך היום והלילה ושעות זמניות.`,
    cmpTitle: (a: string, b: string) => `${a} מול ${b}: זמן שקיעה ואורך הלילה | Ghurubi`,
    cmpDesc: (a: string, b: string) => `השוואת הזמן הטבעי לפי השקיעה בין ${a} ל${b}: לאיזו עיר הגיעה השקיעה קודם, ואורך היום והלילה.`,
    citiesTitle: 'שעות זמניות בערי העולם | Ghurubi — שעון כדור הארץ',
    citiesDesc: 'זמן טבעי לפי השקיעה ושעות זמניות לערי העולם. היום מתחיל בשקיעה.',
    homeTitle: 'Ghurubi — שעון כדור הארץ | שעות זמניות וזמן שקיעה',
    homeDesc: 'זמן טבעי המבוסס על השקיעה: השקיעה היא 00:00 והלילה קודם. שעות זמניות לפי המיקום שלך.',
  },
};
export type Dict = typeof dict.en;

const CITY_TR: Record<string, string> = { Makkah: 'Mekke', Madinah: 'Medine', Riyadh: 'Riyad', Jeddah: 'Cidde', Taif: 'Taif', Cairo: 'Kahire', Alexandria: 'İskenderiye', Amman: 'Amman', Beirut: 'Beyrut', 'Kuwait City': 'Kuveyt', Doha: 'Doha', Manama: 'Manama', Muscat: 'Maskat', Casablanca: 'Kazablanka', Baghdad: 'Bağdat', Damascus: 'Şam', Jerusalem: 'Kudüs', Gaza: 'Gazze', Tunis: 'Tunus', Algiers: 'Cezayir', Tripoli: 'Trablus', Khartoum: 'Hartum', Sanaa: 'Sana', Istanbul: 'İstanbul', Tehran: 'Tahran', Karachi: 'Karaçi', Jakarta: 'Cakarta', 'New York': 'New York', London: 'Londra', Paris: 'Paris', Berlin: 'Berlin', 'Abu Dhabi': 'Abu Dabi', Dubai: 'Dubai', Ankara: 'Ankara' };
const CITY_HE: Record<string, string> = { Makkah: 'מכה', Madinah: 'מדינה', Riyadh: 'ריאד', Jeddah: "ג'דה", Dubai: 'דובאי', 'Abu Dhabi': 'אבו דאבי', Cairo: 'קהיר', Alexandria: 'אלכסנדריה', Amman: 'עמאן', Beirut: 'ביירות', 'Kuwait City': 'כווית', Doha: 'דוחה', Manama: 'מנאמה', Muscat: 'מסקט', Casablanca: 'קזבלנקה', Rabat: 'רבאט', Baghdad: 'בגדד', Damascus: 'דמשק', Jerusalem: 'ירושלים', Gaza: 'עזה', Tunis: 'תוניס', Algiers: "אלג'יר", Tripoli: 'טריפולי', Khartoum: 'חרטום', Sanaa: 'צנעא', Istanbul: 'איסטנבול', Ankara: 'אנקרה', Tehran: 'טהרן', Islamabad: 'איסלאמבאד', Karachi: "קראצ'י", 'Kuala Lumpur': 'קואלה לומפור', Jakarta: "ג'קרטה", 'New York': 'ניו יורק', 'Los Angeles': "לוס אנג'לס", Chicago: 'שיקגו', London: 'לונדון', Birmingham: 'ברמינגהאם', Paris: 'פריז', Berlin: 'ברלין' };

export function cityName(c: CityInfo | undefined, lang: Lang): string {
  if (!c) return '';
  if (lang === 'ar') return c.nameAr || c.name;
  if (lang === 'tr') return CITY_TR[c.name] ?? c.name;
  if (lang === 'he') return CITY_HE[c.name] ?? c.name;
  return c.name;
}
export const countryName = (c: CityInfo | undefined, lang: Lang) =>
  !c ? '' : lang === 'ar' ? c.countryAr || c.country : c.country;

function detect(): Lang {
  try {
    const q = new URLSearchParams(window.location.search).get('lang') as Lang | null;
    if (q && LANGS.includes(q)) return q;
    const s = localStorage.getItem(KEY) as Lang | null;
    if (s && LANGS.includes(s)) return s;
    const n = (navigator.language || 'en').slice(0, 2).toLowerCase();
    if (n === 'iw') return 'he';
    if (LANGS.includes(n as Lang)) return n as Lang;
  } catch { /* ignore */ }
  return 'en';
}

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Dict }>({
  lang: 'en', setLang: () => {}, t: dict.en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detect);
  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(KEY, l); } catch { /* ignore */ }
    const url = new URL(window.location.href);
    if (url.searchParams.has('lang')) { url.searchParams.set('lang', l); window.history.replaceState(null, '', url); }
  };
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl(lang) ? 'rtl' : 'ltr';
  }, [lang]);
  return <Ctx.Provider value={{ lang, setLang, t: dict[lang] as Dict }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);

/** hreflang alternates + self canonical for a path (language via ?lang=). */
export function langLinks(path: string, lang: Lang) {
  const base = `https://ghurubi.com${path}`;
  return {
    canonical: lang === 'en' ? base : `${base}?lang=${lang}`,
    alternates: [
      ...LANGS.map(l => ({ hreflang: l, href: l === 'en' ? base : `${base}?lang=${l}` })),
      { hreflang: 'x-default', href: base },
    ],
  };
}
