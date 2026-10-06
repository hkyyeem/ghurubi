// Runs before `vite dev` and `vite build`; writes public/sitemap.xml.
import { writeFileSync } from "fs";
import { resolve } from "path";
import { MAJOR_CITIES, citySlug, compareSlug } from "../src/lib/cityCoordinates";

const LANGS = ["en", "ar", "tr", "he"];
const BASE_URL = "https://ghurubi.com";
const paths: string[] = ["/", "/watch", "/cities", "/compare", "/event", "/sitemap"];
for (const c of MAJOR_CITIES) paths.push(`/city/${citySlug(c)}`);
for (let i = 0; i < MAJOR_CITIES.length; i++)
  for (let j = i + 1; j < MAJOR_CITIES.length; j++)
    paths.push(`/compare/${compareSlug(MAJOR_CITIES[i], MAJOR_CITIES[j])}`);

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
  ...paths.flatMap((p) => {
    const href = (l: string) => (l === "en" ? `${BASE_URL}${p}` : `${BASE_URL}${p}?lang=${l}`);
    const alts = LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${href(l)}"/>`).join("") +
      `<xhtml:link rel="alternate" hreflang="x-default" href="${href("en")}"/>`;
    return LANGS.map((l) => `  <url><loc>${href(l).replace(/&/g, "&amp;")}</loc>${alts}</url>`);
  }),
  `</urlset>`,
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${paths.length} entries)`);
