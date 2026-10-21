// Runs before `vite dev` and `vite build`; writes public/sitemap.xml.
import { readdirSync, unlinkSync, writeFileSync } from "fs";
import { resolve } from "path";
import { MAJOR_CITIES, citySlug, compareSlug } from "../src/lib/cityCoordinates";

const LANGS = ["en", "ar", "tr", "he"];
const BASE_URL = "https://ghurubi.com";
const LASTMOD = new Date().toISOString().slice(0, 10);
/** Google accepts 50,000 URLs; keep each file near this so a later pair dump stays easy to crawl. */
const URLS_PER_FILE = 5000;

/**
 * Pair pages (/compare/a-vs-b) are thin and client-rendered.
 * Leave this false until those pages are prerendered, then flip it on.
 * The /compare index stays in the core paths either way.
 */
const INCLUDE_COMPARE_PAIRS = false;

// Core pages + cities. Compare pairs and /now are appended below.
const paths: string[] = ["/", "/watch", "/about", "/wear", "/cities", "/compare", "/event", "/sitemap", "/privacy", "/articles", "/articles/sunset-workday"];
for (const c of MAJOR_CITIES) paths.push(`/city/${citySlug(c)}`);

const pairPaths: string[] = [];
if (INCLUDE_COMPARE_PAIRS) {
  for (let i = 0; i < MAJOR_CITIES.length; i++) {
    for (let j = i + 1; j < MAJOR_CITIES.length; j++) {
      pairPaths.push(`/compare/${compareSlug(MAJOR_CITIES[i], MAJOR_CITIES[j])}`);
    }
  }
}

const href = (p: string, l: string) => {
  const raw = l === "en" ? `${BASE_URL}${p === "/" ? "/" : p}` : `${BASE_URL}/${l}${p === "/" ? "" : p}`;
  return raw.replace(/&/g, "&amp;");
};

function localized(p: string) {
  const alts = LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${href(p, l)}"/>`).join("")
    + `<xhtml:link rel="alternate" hreflang="x-default" href="${href(p, "en")}"/>`;
  return LANGS.map((l) => `  <url><loc>${href(p, l)}</loc><lastmod>${LASTMOD}</lastmod>${alts}</url>`);
}

// /now is not under language prefixes.
const nowPaths = ["/now", ...MAJOR_CITIES.map((c) => `/now/${citySlug(c)}`)];
const nowEntries = nowPaths.map((p) => `  <url><loc>${BASE_URL}${p}</loc><lastmod>${LASTMOD}</lastmod></url>`);

const entries = [
  ...paths.flatMap(localized),
  ...pairPaths.flatMap(localized),
  ...nowEntries,
];

function urlset(chunk: string[]) {
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
    ...chunk,
    `</urlset>`,
    ``,
  ].join("\n");
}

const dir = resolve("public");
for (const name of readdirSync(dir)) {
  if (/^sitemap-\d+\.xml$/.test(name)) unlinkSync(resolve(dir, name));
}

const files: string[] = [];
if (entries.length <= URLS_PER_FILE) {
  writeFileSync(resolve(dir, "sitemap.xml"), urlset(entries));
  files.push("sitemap.xml");
} else {
  const parts: string[] = [];
  for (let i = 0; i < entries.length; i += URLS_PER_FILE) {
    const name = `sitemap-${parts.length + 1}.xml`;
    writeFileSync(resolve(dir, name), urlset(entries.slice(i, i + URLS_PER_FILE)));
    parts.push(name);
  }
  const index = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...parts.map((name) => `  <sitemap><loc>${BASE_URL}/${name}</loc><lastmod>${LASTMOD}</lastmod></sitemap>`),
    `</sitemapindex>`,
    ``,
  ].join("\n");
  writeFileSync(resolve(dir, "sitemap.xml"), index);
  files.push("sitemap.xml", ...parts);
}

const urls = entries.length;
console.log(
  `sitemap written (${paths.length} core paths, ${pairPaths.length} compare pairs, ${nowPaths.length} /now, ${urls} urls, lastmod ${LASTMOD}, files ${files.join(", ")})`,
);
