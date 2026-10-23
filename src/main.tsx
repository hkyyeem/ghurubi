import { HelmetProvider } from "react-helmet-async";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerSW } from "./registerSW";
import { LanguageProvider } from "./lib/i18n";
import { normalizePath, readBoot } from "./lib/boot";

const rootEl = document.getElementById("root")!;
const boot = readBoot();
const here = normalizePath(window.location.pathname);
const mismatch = document.documentElement.dataset.langMismatch === "1";
const samePage = !!boot && normalizePath(boot.path) === here && !mismatch;

if (mismatch) {
  delete (window as { __GHURUBI__?: unknown }).__GHURUBI__;
}

const tree = (
  <HelmetProvider><LanguageProvider><App /></LanguageProvider></HelmetProvider>
);

// Prerendered HTML is hydrated only when it is the page the visitor asked for
// and the language matches. Every other URL replaces the shell.
if (samePage) hydrateRoot(rootEl, tree);
else createRoot(rootEl).render(tree);

registerSW();
