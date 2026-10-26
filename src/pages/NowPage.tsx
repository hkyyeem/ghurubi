import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useSearchParams } from "react-router-dom";
import { getCityBySlug, type CityInfo } from "@/lib/cityCoordinates";
import { useNaturalTime, type Location, type NaturalTime } from "@/hooks/useNaturalTime";

const BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/time`;
const SITE = "https://ghurubi.com";

const pad = (n: number) => String(n).padStart(2, "0");

function clock(time: NaturalTime): string {
  return `${pad(time.hours)}:${pad(time.minutes)}:${pad(time.seconds)}`;
}

function snapshotLine(city: CityInfo, time: NaturalTime | null, lang: "ar" | "en"): string {
  if (!time) return lang === "ar" ? "جارٍ الحساب…" : "Calculating…";
  const name = lang === "ar" ? city.nameAr : city.name;
  return lang === "ar"
    ? `الساعة الآن في ${name}: ${clock(time)} بالتوقيت الغروبي.`
    : `Ghurubi time now in ${name}: ${clock(time)}.`;
}

/** Minimal plain-text page for AI tools: /now/riyadh or /now?city=الرياض */
const NowPage = () => {
  const { city: param } = useParams();
  const [sp] = useSearchParams();
  const slug = (param ?? "").trim();
  const queryCity = (sp.get("city") ?? "").trim();
  const requested = slug || queryCity;
  const lang = sp.get("lang") === "en" ? "en" : "ar";
  const known = slug ? getCityBySlug(slug) : undefined;
  const location: Location | null = known
    ? { latitude: known.latitude, longitude: known.longitude, city: known }
    : null;
  const time = useNaturalTime(location, false);

  const help = lang === "ar"
    ? "اكتب اسم المدينة في الرابط، مثل: ghurubi.com/now/riyadh"
    : "Add a city, e.g. ghurubi.com/now/riyadh";
  const missing = lang === "ar" ? "لم يتم العثور على المدينة." : "City not found.";
  const initial = !requested
    ? help
    : known
      ? snapshotLine(known, time, lang)
      : slug
        ? missing
        : (lang === "ar" ? "جارٍ الحساب…" : "Calculating…");

  const [line, setLine] = useState(initial);
  const identity = `${lang}|${slug}|${queryCity}`;

  useEffect(() => {
    setLine(initial);
    // The snapshot is the first paint. Later ticks must not wipe a fetched line.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity]);

  useEffect(() => {
    if (!requested) return;
    let alive = true;
    const load = () =>
      fetch(`${BASE}?city=${encodeURIComponent(requested)}&lang=${lang}`)
        .then((r) => r.text())
        .then((t) => alive && setLine(t.split("\n")[0]))
        .catch(() => alive && setLine(lang === "ar" ? "تعذّر الحساب الآن." : "Could not calculate."));
    load();
    const id = setInterval(load, 30000);
    return () => { alive = false; clearInterval(id); };
  }, [requested, lang]);

  const path = slug ? `/now/${slug}` : "/now";
  const title = known
    ? `${lang === "ar" ? known.nameAr : known.name} — غروبي`
    : "غروبي — الوقت الآن";
  const desc = known
    ? (lang === "ar"
      ? `التوقيت الغروبي الآن في ${known.nameAr}. اليوم يبدأ من الغروب.`
      : `Ghurubi time now in ${known.name}. The day begins at sunset.`)
    : (lang === "ar"
      ? "الوقت الغروبي الآن لأي مدينة، نصاً بسيطاً."
      : "Current Ghurubi time for any city, as plain text.");

  return (
    <main dir={lang === "ar" ? "rtl" : "ltr"} className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 bg-background text-foreground">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={`${SITE}${path}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={`${SITE}${path}`} />
      </Helmet>
      <h1 className="text-2xl md:text-3xl font-semibold text-center" id="ghurubi-now">{line}</h1>
      <p className="text-sm text-muted-foreground">
        {lang === "ar" ? "المصدر: غروبي" : "Source: Ghurubi"} — <a href="https://ghurubi.com" className="underline">ghurubi.com</a>
      </p>
    </main>
  );
};

export default NowPage;
