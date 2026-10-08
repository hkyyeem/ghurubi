import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useNaturalTime, type Location } from '@/hooks/useNaturalTime';
import { useLocalStorage, STORAGE_KEYS } from '@/hooks/useLocalStorage';
import { NavigationBar } from '@/components/NavigationBar';
import { HeroTimeDisplay } from '@/components/HeroTimeDisplay';
import { InfoGrid } from '@/components/InfoGrid';
import { SiteFooter } from '@/components/SiteFooter';
import { MAJOR_CITIES, getCityBySlug, citySlug, compareSlug, type CityInfo } from '@/lib/cityCoordinates';
import { resolveCitySlug } from '@/lib/searchCity';
import { SeoHead } from '@/components/SeoHead';
import { useI18n, cityName } from '@/lib/i18n';
import { useX } from '@/lib/i18nExtra';

const BASE = 'https://ghurubi.com';
const NEAR_PICKS = ['makkah', 'riyadh', 'cairo', 'istanbul', 'jerusalem', 'dubai', 'london', 'new-york'];

const pad = (n: number) => String(n).padStart(2, '0');
const fmt = (h: number, m: number) => `${pad(h)}:${pad(m)}`;
/** Converts a duration in hours (or ms if large) into [hours, minutes]. */
const hm = (v: number): [number, number] => {
  const hours = v > 1000 ? v / 3600000 : v;
  const total = Math.round(hours * 60);
  return [Math.floor(total / 60) % 24, total % 60];
};

const ANSWER_H: Record<string, (c: string) => string> = {
  ar: c => `كم الساعة الآن بالتوقيت الغروبي في ${c}؟`,
  en: c => `What time is it now in ${c} in Ghurubi time?`,
  tr: c => `${c} için ezanî saat şimdi kaç?`,
  he: c => `מה השעה עכשיו ב${c} לפי זמן השקיעה?`,
};
type AnswerFn = (c: string, now: string, sunrise: string, night: string, day: string) => string;
const ANSWER_P: Record<string, AnswerFn> = {
  ar: (c, now, sr, n, d) => `الساعة الآن ${now} بالتوقيت الغروبي في ${c}. في هذا النظام يبدأ اليوم عند غروب الشمس (00:00 مع أذان المغرب)، فيأتي الليل أولاً ثم النهار. تشرق الشمس اليوم في ${c} عند الساعة ${sr} غروبي، ويستمر الليل ${n} والنهار ${d}. تُحسب الأوقات فلكياً من إحداثيات ${c} وفق معايير أم القرى، وتتغير يومياً مع حركة الشمس.`,
  en: (c, now, sr, n, d) => `It is ${now} Ghurubi time in ${c} now. In this system the day begins at sunset (00:00, at Maghrib), so night comes first, then day. Today in ${c} the sun rises at ${sr} Ghurubi time; the night lasts ${n} and the day ${d}. Times are computed astronomically from ${c}'s coordinates and shift daily with the sun.`,
  tr: (c, now, sr, n, d) => `${c} için ezanî saat şu anda ${now}. Bu sistemde gün, gün batımında (00:00, akşam ezanı) başlar; önce gece, sonra gündüz gelir. Bugün ${c} için güneş ezanî ${sr}'da doğar; gece ${n}, gündüz ${d} sürer. Saatler ${c} koordinatlarından astronomik olarak hesaplanır.`,
  he: (c, now, sr, n, d) => `השעה עכשיו ב${c} היא ${now} לפי זמן השקיעה. בשיטה זו היום מתחיל בשקיעה (00:00), הלילה קודם ואחריו היום. היום ב${c} הזריחה בשעה ${sr}; הלילה נמשך ${n} והיום ${d}. הזמנים מחושבים אסטרונומית לפי קואורדינטות ${c}.`,
};

/** City page: fixed coordinates, no GPS request → instant render. Unknown cities are looked up worldwide. */
const CityPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { lang, t } = useI18n();
  const x = useX();
  const builtIn = getCityBySlug(slug);
  const [found, setFound] = useState<CityInfo | null | undefined>(undefined);
  const city = builtIn ?? found ?? undefined;

  useEffect(() => {
    if (builtIn || !slug) return;
    setFound(undefined);
    resolveCitySlug(slug).then(setFound).catch(() => setFound(null));
  }, [slug, builtIn]);

  const [showSeasonalHours, setShowSeasonalHours] = useLocalStorage(STORAGE_KEYS.SEASONAL_HOURS, false);
  const [showPrayerTimes, setShowPrayerTimes] = useLocalStorage(STORAGE_KEYS.SHOW_PRAYER_TIMES, false);
  const location: Location | null = useMemo(
    () => (city ? { latitude: city.latitude, longitude: city.longitude, city } : null), [city]);
  const time = useNaturalTime(location, showSeasonalHours);

  useEffect(() => {
    if (time) document.documentElement.classList.toggle('day-mode', !time.isNight);
  }, [time?.isNight]);

  if (!city) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">{found === null ? x.notFound : x.loading}</p>
      </div>
    );
  }

  const s = citySlug(city);
  const url = `${BASE}/city/${s}`;
  const cn = cityName(city, lang);
  const title = t.cityTitle(cn);
  const desc = t.cityDesc(cn);
  const others = NEAR_PICKS.map(p => getCityBySlug(p)).filter((c): c is CityInfo => !!c && citySlug(c) !== s);
  const inList = MAJOR_CITIES.some(c => citySlug(c) === s);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <SeoHead path={`/city/${s}`} title={title} desc={desc}>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: title,
          url,
          about: { '@type': 'City', name: city.name, alternateName: [city.nameAr, cityName(city, 'tr'), cityName(city, 'he')],
            geo: { '@type': 'GeoCoordinates', latitude: city.latitude, longitude: city.longitude },
            containedInPlace: { '@type': 'Country', name: city.country } },
          breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Ghurubi', item: `${BASE}/` },
            { '@type': 'ListItem', position: 2, name: 'Cities', item: `${BASE}/cities` },
            { '@type': 'ListItem', position: 3, name: city.name, item: url },
          ] },
        })}</script>
      </SeoHead>
      <NavigationBar
        onCitySelect={(c: CityInfo) => navigate(`/city/${citySlug(c)}`)}
        currentCity={city}
        isNight={time?.isNight ?? true}
        showSeasonalHours={showSeasonalHours}
        onToggleSeasonalHours={setShowSeasonalHours}
        showPrayerTimes={showPrayerTimes}
        onTogglePrayerTimes={setShowPrayerTimes}
      />
      <main>
        <h1 className="sr-only">{title}</h1>
        <section className="container-narrow">
          <HeroTimeDisplay time={time} location={location} showSeasonalTime={showSeasonalHours} />
        </section>
        <InfoGrid time={time} />
        {time && (
          <section className="container-narrow mt-10 text-sm leading-relaxed text-muted-foreground max-w-2xl">
            <h2 className="font-semibold mb-2 text-foreground">{ANSWER_H[lang]?.(cn) ?? ANSWER_H.en(cn)}</h2>
            <p>{(ANSWER_P[lang] ?? ANSWER_P.en)(cn, fmt(time.hours, time.minutes), fmt(...hm((time.sunrise.getTime() - time.lastSunset.getTime()) / 3600000)), fmt(...hm(time.nightLength)), fmt(...hm(time.dayLength)))}</p>
          </section>
        )}
        {inList && (
          <section className="container-narrow mt-10 text-sm">
            <h2 className="font-semibold mb-3">{x.compareWith(cn)}</h2>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground">
              {others.map(o => (
                <li key={citySlug(o)}><Link className="hover:text-foreground hover:underline" to={`/compare/${compareSlug(city, o)}`}>{cityName(o, lang)}</Link></li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
};

export default CityPage;
