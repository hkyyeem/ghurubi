// Runs before `vite dev` and `vite build`; writes public/sitemap.xml.
import { writeFileSync } from "fs";
import { resolve } from "path";
import { MAJOR_CITIES, citySlug, compareSlug } from "../src/lib/cityCoordinates";

const LANGS = ["en", "ar", "tr", "he"];
const BASE_URL = "https://ghurubi.com";
const LASTMOD = new Date().toISOString().slice(0, 10);

// Core pages + cities. Compare pairs and /now are appended below.
const paths: string[] = ["/", "/watch", "/about", "/wear", "/cities", "/compare", "/event", "/sitemap", "/privacy", "/articles", "/articles/sunset-workday"];
for (const c of MAJOR_CITIES) paths.push(`/city/${citySlug(c)}`);

const pairPaths: string[] = [];
for (let i = 0; i < MAJOR_CITIES.length; i++) {
  for (let j = i + 1; j < MAJOR_CITIES.length; j++) {
    pairPaths.push(`/compare/${compareSlug(MAJOR_CITIES[i], MAJOR_CITIES[j])}`);
  }
}

const href = (p: string, l: string) => (l === "en" ? `${BASE_URL}${p === "/" ? "/" : p}` : `${BASE_URL}/${l}${p === "/" ? "" : p}`);

function localized(p: string) {
  const alts = LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${href(p, l)}"/>`).join("")
    + `<xhtml:link rel="alternate" hreflang="x-default" href="${href(p, "en")}"/>`;
  return LANGS.map((l) => `  <url><loc>${href(p, l)}</loc><lastmod>${LASTMOD}</lastmod>${alts}</url>`);
}

// /now is not under language prefixes.
const nowPaths = ["/now", ...MAJOR_CITIES.map((c) => `/now/${citySlug(c)}`)];
const nowEntries = nowPaths.map((p) => `  <url><loc>${BASE_URL}${p}</loc><lastmod>${LASTMOD}</lastmod></url>`);

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
  ...paths.flatMap(localized),
  ...pairPaths.flatMap(localized),
  ...nowEntries,
  `</urlset>`,
  ``,
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml);
const urls = (paths.length + pairPaths.length) * LANGS.length + nowPaths.length;
console.log(`sitemap.xml written (${paths.length} core paths, ${pairPaths.length} compare pairs, ${nowPaths.length} /now, ${urls} urls, lastmod ${LASTMOD})`);
