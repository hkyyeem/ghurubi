import { renderToString } from "react-dom/server";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import { StaticRouter } from "react-router";
import { AppRoutes, AppShell } from "./App";
import { LanguageProvider, LANGS, isRtl, type Lang } from "./lib/i18n";

function langFromUrl(url: string): Lang {
  const path = url.split("?")[0].split("#")[0];
  const seg = path.split("/")[1] as Lang;
  if (seg && seg !== "en" && LANGS.includes(seg)) return seg;
  return "en";
}

export type PrerenderResult = {
  html: string;
  head: string;
  lang: Lang;
  dir: "rtl" | "ltr";
};

/** Render one route to an HTML string. Live clocks stay on their placeholder. */
export function render(url: string): PrerenderResult {
  const lang = langFromUrl(url);
  const helmetContext = {} as { helmet?: HelmetServerState };
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <LanguageProvider initialLang={lang}>
        <AppShell>
          <StaticRouter location={url}>
            <AppRoutes />
          </StaticRouter>
        </AppShell>
      </LanguageProvider>
    </HelmetProvider>,
  );
  const helmet = helmetContext.helmet;
  if (!helmet) throw new Error(`Missing helmet context for ${url}`);
  const head = [helmet.title, helmet.meta, helmet.link, helmet.script]
    .map((part) => part.toString())
    .filter(Boolean)
    .join("\n");
  return { html, head, lang, dir: isRtl(lang) ? "rtl" : "ltr" };
}
