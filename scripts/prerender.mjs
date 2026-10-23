import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirFor, prerenderTargets, renderPage } from "../dist-ssr/entry-server.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const template = readFileSync(join(dist, "index.html"), "utf8");
const asOf = new Date().toISOString();
const allCities = process.env.PRERENDER_ALL_CITIES === "1";
const targets = prerenderTargets({ allCities });

const DROP = [
  /<title>[\s\S]*?<\/title>\s*/g,
  /<meta\s+name="description"[^>]*>\s*/gi,
  /<meta\s+property="og:title"[^>]*>\s*/gi,
  /<meta\s+property="og:description"[^>]*>\s*/gi,
  /<meta\s+property="og:url"[^>]*>\s*/gi,
  /<meta\s+property="og:locale"[^>]*>\s*/gi,
  /<meta\s+property="og:locale:alternate"[^>]*>\s*/gi,
  /<meta\s+property="og:type"[^>]*>\s*/gi,
  /<meta\s+name="twitter:title"[^>]*>\s*/gi,
  /<meta\s+name="twitter:description"[^>]*>\s*/gi,
];

function pageHtml(templateHtml, { lang, dir, isNight, head, body, boot }) {
  let html = templateHtml;
  html = html.replace(/<html\b[^>]*>/, `<html lang="${lang}" dir="${dir}"${isNight ? "" : ' class="day-mode"'}>`);
  for (const re of DROP) html = html.replace(re, "");
  const style = `<style>html[data-lang-mismatch] #root{visibility:hidden}</style>`;
  html = html.replace("</head>", `${head}\n${style}\n</head>`);
  // react-helmet-async emits React's hrefLang. HTML parsers accept it, but
  // crawlers looking for the standard attribute want lowercase hreflang.
  html = html.replace(/\bhrefLang=/g, "hreflang=");
  const bootJson = JSON.stringify(boot).replace(/</g, "\\u003c");
  const scripts = `<script>window.__GHURUBI__=${bootJson};</script><script>(function(){try{var b=window.__GHURUBI__;if(!b)return;var seg=location.pathname.split("/")[1];if(seg==="ar"||seg==="tr"||seg==="he")return;var q=new URLSearchParams(location.search).get("lang");if(q==="ar"||q==="en"||q==="tr"||q==="he")return;var saved=localStorage.getItem("ghurubi-lang");var nav=(navigator.language||"en").slice(0,2).toLowerCase();if(nav==="iw")nav="he";var want=(saved==="ar"||saved==="en"||saved==="tr"||saved==="he")?saved:(nav==="ar"||nav==="tr"||nav==="he"||nav==="en"?nav:"en");if(want!==b.lang)document.documentElement.setAttribute("data-lang-mismatch","1");}catch(e){}})();</script>`;
  if (!html.includes('<div id="root"></div>')) throw new Error("dist/index.html has no empty #root");
  html = html.replace('<div id="root"></div>', `${scripts}<div id="root">${body}</div>`);
  return html;
}

const failures = [];
for (const target of targets) {
  const boot = { path: target.path, lang: target.lang, asOf };
  const { html: body, head, isNight } = renderPage(boot);
  const file = join(dist, target.path.slice(1), "index.html");
  const html = pageHtml(template, {
    lang: target.lang,
    dir: dirFor(target.lang),
    isNight,
    head,
    body,
    boot,
  });
  const rawTitle = html.match(/<title[^>]*>([^<]*)<\/title>/)?.[1] ?? "";
  const title = rawTitle
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number(num)))
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
  const problems = [];
  if (!title) problems.push("missing <title>");
  // Arabic homepage title is the same string as the shell. Every other page must differ.
  const shellTitle = "غروبي — التوقيت الغروبي الطبيعي ومواقيت الصلاة | Ghurubi";
  if (title === shellTitle && target.path !== "/ar") problems.push("still the generic shell title");
  if (!html.includes(target.expect)) problems.push(`missing ${JSON.stringify(target.expect)}`);
  if (target.citySlug && !title.includes(target.expect)) problems.push("title missing city name");
  if (!html.includes('rel="canonical"')) problems.push("missing canonical");
  if (!/hreflang=/i.test(html)) problems.push("missing hreflang");
  if (!html.includes("og:title")) problems.push("missing og:title");
  if (!html.includes("<h1")) problems.push("missing h1");
  if (target.citySlug && !html.includes('application/ld+json')) problems.push("missing JSON-LD");
  if (problems.length) failures.push(`${target.path}: ${problems.join(", ")}`);
  else {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, html);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

const shell = readFileSync(join(dist, "index.html"), "utf8");
if (shell.includes("window.__GHURUBI__")) {
  console.error("SPA fallback index.html was overwritten. Refusing to publish that.");
  process.exit(1);
}

console.log(`prerendered ${targets.length} pages at ${asOf}${allCities ? " (all cities)" : ""}`);
