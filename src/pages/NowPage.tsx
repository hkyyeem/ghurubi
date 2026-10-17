import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/time`;

/** Minimal plain-text page for AI tools: /now/riyadh or /now?city=الرياض */
const NowPage = () => {
  const { city: param } = useParams();
  const [sp] = useSearchParams();
  const city = (param ?? sp.get("city") ?? "").trim();
  const lang = sp.get("lang") === "en" ? "en" : "ar";
  const [line, setLine] = useState<string>(lang === "ar" ? "جارٍ الحساب…" : "Calculating…");

  useEffect(() => {
    document.title = city ? `${city} — غروبي` : "غروبي — الوقت الآن";
    if (!city) {
      setLine(lang === "ar" ? "اكتب اسم المدينة في الرابط، مثل: ghurubi.com/now/riyadh" : "Add a city, e.g. ghurubi.com/now/riyadh");
      return;
    }
    let alive = true;
    const load = () =>
      fetch(`${BASE}?city=${encodeURIComponent(city)}&lang=${lang}`)
        .then((r) => r.text())
        .then((t) => alive && setLine(t.split("\n")[0]))
        .catch(() => alive && setLine(lang === "ar" ? "تعذّر الحساب الآن." : "Could not calculate."));
    load();
    const id = setInterval(load, 30000);
    return () => { alive = false; clearInterval(id); };
  }, [city, lang]);

  return (
    <main dir={lang === "ar" ? "rtl" : "ltr"} className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 bg-background text-foreground">
      <h1 className="text-2xl md:text-3xl font-semibold text-center" id="ghurubi-now">{line}</h1>
      <p className="text-sm text-muted-foreground">
        {lang === "ar" ? "المصدر: غروبي" : "Source: Ghurubi"} — <a href="https://ghurubi.com" className="underline">ghurubi.com</a>
      </p>
    </main>
  );
};

export default NowPage;
