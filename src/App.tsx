import { lazy, Suspense } from "react";
import { ArticlesIndex, ArticlePage } from "@/pages/ArticlesPage";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CityPage from "./pages/CityPage";
import { ScrollToTop } from "./components/ScrollToTop";
import { LegacyLangRedirect } from "./components/LegacyLangRedirect";

const NowPage = lazy(() => import("./pages/NowPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Watch = lazy(() => import("./pages/Watch"));
const ComparePage = lazy(() => import("./pages/ComparePage"));
const CitiesPage = lazy(() => import("./pages/CitiesPage"));
const CompareIndex = lazy(() => import("./pages/CompareIndex"));
const EventPage = lazy(() => import("./pages/EventPage"));
const SitemapPage = lazy(() => import("./pages/SitemapPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const WearPage = lazy(() => import("./pages/WearPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));

function RouteFallback() {
  return <div className="min-h-screen bg-background" />;
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
