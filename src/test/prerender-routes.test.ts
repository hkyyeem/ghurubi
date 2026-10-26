import { describe, expect, it } from "vitest";
import { MAJOR_CITIES, citySlug, getCityBySlug } from "@/lib/cityCoordinates";
import { SITEMAP_STATIC_PATHS, prerenderTargets } from "@/prerender/routes";

describe("prerender targets", () => {
  it("covers every sitemap city, static page, and /now url", () => {
    const targets = prerenderTargets();
    const paths = new Set(targets.map(t => t.path));
    expect(paths.has("/")).toBe(true);
    expect(paths.has("/ar")).toBe(true);
    expect(paths.has("/city/abha")).toBe(true);
    expect(paths.has("/ar/city/abha")).toBe(true);
    expect(paths.has("/tr/city/gaziantep")).toBe(true);
    expect(paths.has("/now")).toBe(true);
    expect(paths.has("/now/riyadh")).toBe(true);
    for (const path of SITEMAP_STATIC_PATHS) {
      expect(paths.has(path)).toBe(true);
      expect(paths.has(`/ar${path === "/" ? "" : path}`)).toBe(true);
    }
    const cityPages = targets.filter(t => t.path.includes("/city/"));
    expect(cityPages).toHaveLength(MAJOR_CITIES.length * 4);
    expect(targets.filter(t => t.path.startsWith("/now"))).toHaveLength(1 + MAJOR_CITIES.length);
    expect(targets.find(t => t.path === "/ar/city/riyadh")?.expect).toContain("الرياض");
    expect(targets.find(t => t.path === "/now/makkah")?.expect).toContain("مكة");
    expect(targets.find(t => t.path === "/now")?.hreflang).toBe(false);
    expect(targets.find(t => t.path === "/city/riyadh")?.hreflang).toBe(true);
    for (const city of MAJOR_CITIES) {
      expect(getCityBySlug(citySlug(city))?.name).toBe(city.name);
    }
    expect(new Set(targets.map(t => t.path)).size).toBe(targets.length);
  });
});
