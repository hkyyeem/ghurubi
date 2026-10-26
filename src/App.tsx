import { lazy, Suspense } from "react";
import { ArticlesIndex, ArticlePage } from "@/pages/ArticlesPage";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CityPage from "./pages/CityPage";
import NowPage from "./pages/NowPage";
import Watch from "./pages/Watch";
import CitiesPage from "./pages/CitiesPage";
import CompareIndex from "./pages/CompareIndex";
import EventPage from "./pages/EventPage";
import SitemapPage from "./pages/SitemapPage";
import PrivacyPage from "./pages/PrivacyPage";
import AboutPage from "./pages/AboutPage";
import WearPage from "./pages/WearPage";
import { ScrollToTop } from "./components/ScrollToTop";
import { LegacyLangRedirect } from "./components/LegacyLangRedirect";

// Login, admin, and compare pairs are not in the sitemap, so they stay split.
// NotFound is also imported by city pages, so it already sits in the main chunk.
const NotFound = lazy(() => import("./pages/NotFound"));
const ComparePage = lazy(() => import("./pages/ComparePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));

function RouteFallback() {
  return <div className="min-h-screen bg-background" />;
}

const queryClient = new QueryClient();

/** Routes and providers, without a router so the server can mount a StaticRouter. */
export function AppTree() {
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
        <ScrollToTop />
        <LegacyLangRedirect />
        <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/watch" element={<Watch />} />
          <Route path="/now" element={<NowPage />} />
          <Route path="/now/:city" element={<NowPage />} />
          <Route path="/cities" element={<CitiesPage />} />
          <Route path="/city/:slug" element={<CityPage />} />
          <Route path="/compare" element={<CompareIndex />} />
          <Route path="/compare/:pair" element={<ComparePage />} />
          <Route path="/event" element={<EventPage />} />
          <Route path="/sitemap" element={<SitemapPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/wear" element={<WearPage />} />
          <Route path="/articles" element={<ArticlesIndex />} />
          <Route path="/articles/:slug" element={<ArticlePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          {/* Localized public routes: /ar/..., /tr/..., /he/... (crawlable per-language URLs) */}
          {(['ar', 'tr', 'he'] as const).map((l) => (
            <Route key={l} path={`/${l}`}>
              <Route index element={<Index />} />
              <Route path="watch" element={<Watch />} />
              <Route path="cities" element={<CitiesPage />} />
              <Route path="city/:slug" element={<CityPage />} />
              <Route path="compare" element={<CompareIndex />} />
              <Route path="compare/:pair" element={<ComparePage />} />
              <Route path="event" element={<EventPage />} />
              <Route path="sitemap" element={<SitemapPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="wear" element={<WearPage />} />
              <Route path="articles" element={<ArticlesIndex />} />
              <Route path="articles/:slug" element={<ArticlePage />} />
            </Route>
          ))}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
    </TooltipProvider>
  </QueryClientProvider>
  );
}

const App = () => (
  <BrowserRouter>
    <AppTree />
  </BrowserRouter>
);

export default App;
