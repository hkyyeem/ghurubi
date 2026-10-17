import SunCalc from "npm:suncalc@1.9.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const DAYS_AR = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const DAYS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const H = 3600000;
const p = (n: number) => String(n).padStart(2, "0");
const hms = (s: number) => `${p(Math.floor(s / 3600) % 24)}:${p(Math.floor((s % 3600) / 60))}:${p(s % 60)}`;
const sunset = (d: Date, lat: number, lon: number) => SunCalc.getTimes(d, lat, lon).sunset as Date;
const sunrise = (d: Date, lat: number, lon: number) => SunCalc.getTimes(d, lat, lon).sunrise as Date;

async function geocode(q: string, lang: string) {
  const u = `https://geocoding-api.open-meteo.com/v1/search?count=1&language=${lang}&name=${encodeURIComponent(q.replace(/-/g, " "))}`;
  const r = await fetch(u);
  const j = await r.json();
  const c = j?.results?.[0];
  return c ? { name: c.name as string, latitude: c.latitude as number, longitude: c.longitude as number } : null;
}

function compute(lat: number, lon: number, now = new Date()) {
  let start = sunset(now, lat, lon);
  if (start > now) start = sunset(new Date(now.getTime() - 24 * H), lat, lon);
  let end = sunset(new Date(start.getTime() + 24 * H), lat, lon);
  if (end.getTime() - start.getTime() < 12 * H) end = sunset(new Date(start.getTime() + 48 * H), lat, lon);
  const rise = sunrise(new Date(start.getTime() + 12 * H), lat, lon);
  const isNight = now < rise;
  const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000);
  const frac = isNight
    ? (now.getTime() - start.getTime()) / (rise.getTime() - start.getTime())
    : (now.getTime() - rise.getTime()) / (end.getTime() - rise.getTime());
  const seasonal = Math.floor(frac * 12 * 3600) + (isNight ? 0 : 12 * 3600);
  // Weekday of this natural day = solar-local date of its daylight part.
  const mid = new Date(rise.getTime() + (lon / 15) * H);
  const dow = mid.getUTCDay();
  return {
    ghurubiTime: hms(elapsed),
    seasonalTime: hms(seasonal),
    period: isNight ? "night" : "day",
    dayAr: `${isNight ? "ليلة" : "نهار"} ${DAYS_AR[dow]}`,
    dayEn: `${isNight ? "Night of" : "Day of"} ${DAYS_EN[dow]}`,
    sunriseGhurubi: hms(Math.floor((rise.getTime() - start.getTime()) / 1000)),
    minutesToNextSunset: Math.round((end.getTime() - now.getTime()) / 60000),
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const url = new URL(req.url);
  const city = (url.searchParams.get("city") ?? "").trim().slice(0, 100);
  const lang = url.searchParams.get("lang") === "en" ? "en" : "ar";
  const format = url.searchParams.get("format") === "json" ? "json" : "text";
  const latQ = Number(url.searchParams.get("lat"));
  const lonQ = Number(url.searchParams.get("lon"));
  const text = (body: string, status = 200) =>
    new Response(body, { status, headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });

  let loc: { name: string; latitude: number; longitude: number } | null = null;
  if (url.searchParams.has("lat") && url.searchParams.has("lon") && Math.abs(latQ) <= 90 && Math.abs(lonQ) <= 180) {
    loc = { name: city || `${latQ},${lonQ}`, latitude: latQ, longitude: lonQ };
  } else if (city) {
    try { loc = await geocode(city, lang); } catch { loc = null; }
  } else {
    return text(lang === "ar"
      ? "استخدم: ?city=riyadh أو ?city=الرياض — أو ?lat=..&lon=.. — أضف &format=json للصيغة البرمجية."
      : "Usage: ?city=riyadh or ?lat=..&lon=.. — add &format=json for JSON.", 400);
  }
  if (!loc) return text(lang === "ar" ? "لم يتم العثور على المدينة." : "City not found.", 404);

  const t = compute(loc.latitude, loc.longitude);
  if (format === "json") {
    return new Response(JSON.stringify({ source: "https://ghurubi.com", location: loc, ...t }), {
      headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
  return text(lang === "ar"
    ? `الساعة الآن في ${loc.name}: ${t.ghurubiTime} — ${t.dayAr}\nالمصدر: غروبي https://ghurubi.com`
    : `Ghurubi time now in ${loc.name}: ${t.ghurubiTime} — ${t.dayEn}\nSource: Ghurubi https://ghurubi.com`);
});
