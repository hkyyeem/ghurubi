// Runs before `vite dev` and `vite build`; writes public/sitemap.xml.
import { writeFileSync } from "fs";
import { resolve } from "path";
import { MAJOR_CITIES, citySlug, compareSlug } from "../src/lib/cityCoordinates";

const BASE_URL = "https://ghurubi.com";
const paths: string[] = ["/", "/watch", "/cities"];
for (const c of MAJOR_CITIES) paths.push(`/city/${citySlug(c)}`);
for (let i = 0; i < MAJOR_CITIES.length; i++)
  for (let j = i + 1; j < MAJOR_CITIES.length; j++)
    paths.push(`/compare/${compareSlug(MAJOR_CITIES[i], MAJOR_CITIES[j])}`);

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...paths.map((p) => `  <url><loc>${BASE_URL}${p}</loc></url>`),
  `</urlset>`,
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${paths.length} entries)`);
