import { describe, expect, it } from "vitest";
import { getCityBySlug } from "@/lib/cityCoordinates";
import { PILOT_CITY_SLUGS, prerenderTargets } from "@/prerender/routes";

describe("prerender targets", () => {
  it("covers ten cities in four languages, the article, and localized homepages", () => {
    const targets = prerenderTargets();
    expect(PILOT_CITY_SLUGS).toHaveLength(10);
    expect(PILOT_CITY_SLUGS).toContain("riyadh");
    expect(PILOT_CITY_SLUGS).toContain("gaziantep");
    expect(PILOT_CITY_SLUGS).toContain("makkah");
    const cities = targets.filter(t => t.citySlug);
    expect(cities).toHaveLength(40);
    expect(targets.filter(t => t.path.endsWith("/articles/sunset-workday"))).toHaveLength(4);
    expect(targets.map(t => t.path)).toEqual(expect.arrayContaining(["/ar", "/tr", "/he", "/city/riyadh", "/ar/city/riyadh", "/tr/city/gaziantep"]));
    expect(targets.some(t => t.path === "/")).toBe(false);
    for (const slug of PILOT_CITY_SLUGS) {
      expect(getCityBySlug(slug)?.name).toBeTruthy();
    }
  });

  it("can name every built-in city without including the SPA shell", () => {
    const all = prerenderTargets({ allCities: true });
    expect(all.filter(t => t.citySlug).length).toBeGreaterThan(40 * 4);
    expect(all.some(t => t.path === "/")).toBe(false);
    expect(all.find(t => t.path === "/ar/city/riyadh")?.expect).toContain("الرياض");
  });
});
