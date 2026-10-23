import { renderToString } from "react-dom/server";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import { StaticRouter } from "react-router";
import { AppTree } from "./App";
import { LanguageProvider, isRtl, type Lang } from "./lib/i18n";
import type { GhurubiBoot } from "./lib/boot";

export { prerenderTargets } from "./prerender/routes";

type NightGlobal = typeof globalThis & { __GHURUBI__?: GhurubiBoot; __GHURUBI_NIGHT__?: boolean };

export function renderPage(boot: GhurubiBoot): { html: string; head: string; isNight: boolean } {
  const g = globalThis as NightGlobal;
  g.__GHURUBI__ = boot;
  g.__GHURUBI_NIGHT__ = true;
  const helmetContext: { helmet?: HelmetServerState } = {};
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <LanguageProvider>
        <StaticRouter location={boot.path}>
          <AppTree />
        </StaticRouter>
      </LanguageProvider>
    </HelmetProvider>,
  );
  const helmet = helmetContext.helmet;
  if (!helmet) throw new Error(`Helmet did not render for ${boot.path}`);
  const head = [helmet.title, helmet.meta, helmet.link, helmet.script].map(part => part.toString()).join("\n");
  return { html, head, isNight: g.__GHURUBI_NIGHT__ !== false };
}

export function dirFor(lang: Lang): "rtl" | "ltr" {
  return isRtl(lang) ? "rtl" : "ltr";
}
