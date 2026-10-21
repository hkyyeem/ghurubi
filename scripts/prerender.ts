/**
 * Post-build static prerender. Reads dist/index.html, renders pilot routes
 * with the SSR bundle, and writes per-route index.html plus dist/404.html.
 * No browser and no production Node server.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { pathToFileURL } from "url";
import { getCityBySlug } from "../src/lib/cityCoordinates";

const CITIES = ["riyadh", "makkah", "madinah", "jeddah", "cairo", "istanbul", "dubai", "london", "new-york", "jakarta"];
const ARTICLE = "/articles/sunset-workday";

const routes = [
  ...CITIES.flatMap((slug) => [`/city/${slug}`, `/ar/city/${slug}`]),
  ARTICLE,
  `/ar${ARTICLE}`,
];

for (const slug of CITIES) {
  if (!getCityBySlug(slug)) throw new Error(`Unknown city slug: ${slug}`);
}

type Rendered = { html: string; head: string; lang: string; dir: string };

const serverEntry = resolve(".ssr/entry-server.js");
const { render } = await import(pathToFileURL(serverEntry).href) as { render: (url: string) => Rendered };

const template = readFileSync(resolve("dist/index.html"), "utf8");
if (!template.includes("<!--app-head-->") || !template.includes('<div id="root"></div>')) {
  throw new Error("dist/index.html is missing prerender markers");
}

function apply(page: Rendered): string {
  let html = template.replace(
    /<!--app-head-->[\s\S]*?<!--\/app-head-->/,
    `<!--app-head-->\n${page.head}\n<!--/app-head-->`,
  );
  html = html.replace(/<!--app-jsonld-->[\s\S]*?<!--\/app-jsonld-->/, "<!--app-jsonld--><!--/app-jsonld-->");
  html = html.replace(
    /<html\b[^>]*>/,
    `<html lang="${page.lang}" dir="${page.dir}" data-prerender-lang="${page.lang}">`,
  );
  html = html.replace('<div id="root"></div>', `<div id="root">${page.html}</div>`);
  return html;
}

function writeRoute(route: string, file: string) {
  const started = performance.now();
  const page = render(route);
  if (!page.head.includes("<title")) throw new Error(`No title rendered for ${route}`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, apply(page));
  const ms = Math.round(performance.now() - started);
  console.log(`prerender ${route} -> ${file.replace(resolve("."), "")} (${ms}ms, ${page.lang})`);
  return ms;
}

const t0 = performance.now();
const times: number[] = [];
for (const route of routes) {
  const rel = `${route.replace(/^\//, "")}/index.html`;
  times.push(writeRoute(route, resolve("dist", rel)));
}
times.push(writeRoute("/__missing__", resolve("dist/404.html")));
const total = Math.round(performance.now() - t0);
const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
console.log(`prerendered ${times.length} pages in ${total}ms (avg ${avg}ms)`);

rmSync(resolve(".ssr"), { recursive: true, force: true });
