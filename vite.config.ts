import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/supabase/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode, isSsrBuild }) => ({
  ...(isSsrBuild ? { build: { outDir: "dist-ssr", emptyOutDir: true } } : {}),
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  ssr: {
    noExternal: ["react-helmet-async"],
  },
  plugins: [
    react(),
    !isSsrBuild && mcpPlugin(),
    mode === "development" && componentTagger(),
    !isSsrBuild && VitePWA({
      registerType: "autoUpdate",
      injectRegister: null,
      strategies: "generateSW",
      filename: "sw.js",
      devOptions: { enabled: false },
      manifest: false,
      workbox: {
        // Prerender writes HTML after this service worker is generated, and
        // every sitemap URL already has its own file. A navigation fallback to
        // index.html would serve the homepage (and its unknown-URL noindex
        // guard) for city pages. Navigations use the network instead.
        navigateFallback: null,
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        globPatterns: ["**/*.{js,css,png,svg,ico,webmanifest}"],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: { cacheName: "pages", networkTimeoutSeconds: 3 },
          },
          {
            urlPattern: ({ url, sameOrigin }) => sameOrigin && url.pathname.startsWith("/assets/"),
            handler: "CacheFirst",
            options: { cacheName: "assets" },
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
