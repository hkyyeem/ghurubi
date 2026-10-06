import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Watch from "./pages/Watch";
import CityPage from "./pages/CityPage";
import ComparePage from "./pages/ComparePage";
import CitiesPage from "./pages/CitiesPage";
import CompareIndex from "./pages/CompareIndex";
import EventPage from "./pages/EventPage";
import SitemapPage from "./pages/SitemapPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/watch" element={<Watch />} />
          <Route path="/cities" element={<CitiesPage />} />
          <Route path="/city/:slug" element={<CityPage />} />
          <Route path="/compare" element={<CompareIndex />} />
          <Route path="/compare/:pair" element={<ComparePage />} />
          <Route path="/event" element={<EventPage />} />
          <Route path="/sitemap" element={<SitemapPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
