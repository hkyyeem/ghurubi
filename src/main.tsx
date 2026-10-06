import { HelmetProvider } from "react-helmet-async";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerSW } from "./registerSW";
import { LanguageProvider } from "./lib/i18n";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider><LanguageProvider><App /></LanguageProvider></HelmetProvider>
);
registerSW();
