import { createRoot, hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { registerSW } from "./registerSW";
import { LANGS, LanguageProvider, type Lang } from "./lib/i18n";

const el = document.getElementById("root")!;
const tree = (
  <HelmetProvider>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </HelmetProvider>
);

// Hydrate only when the stamped language matches the URL. A shared 404.html
// can be served under another language prefix; that case mounts fresh.
const stamped = document.documentElement.getAttribute("data-prerender-lang");
const seg = window.location.pathname.split("/")[1] as Lang;
const pathLang: Lang = seg !== "en" && LANGS.includes(seg) ? seg : "en";
if (el.hasChildNodes() && stamped === pathLang) hydrateRoot(el, tree);
else createRoot(el).render(tree);

registerSW();
