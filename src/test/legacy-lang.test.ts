import { describe, expect, it } from "vitest";
import { legacyLangRedirect } from "@/lib/i18n";

describe("legacyLangRedirect", () => {
  it("sends ?lang= to the path prefix", () => {
    expect(legacyLangRedirect("/city/muscat", "?lang=ar")).toBe("/ar/city/muscat");
    expect(legacyLangRedirect("/wear", "?lang=tr")).toBe("/tr/wear");
    expect(legacyLangRedirect("/wear", "?lang=he")).toBe("/he/wear");
    expect(legacyLangRedirect("/wear", "?lang=en")).toBe("/wear");
    expect(legacyLangRedirect("/", "?lang=ar")).toBe("/ar");
    expect(legacyLangRedirect("/city/muscat", "?lang=AR")).toBe("/ar/city/muscat");
  });

  it("drops a redundant query and follows ?lang= when it disagrees with the prefix", () => {
    expect(legacyLangRedirect("/ar/wear", "?lang=ar")).toBe("/ar/wear");
    expect(legacyLangRedirect("/ar/city/muscat", "?lang=en")).toBe("/city/muscat");
    expect(legacyLangRedirect("/ar/wear", "?lang=tr")).toBe("/tr/wear");
  });

  it("keeps other query params and leaves /now, /login, and unknown codes alone", () => {
    expect(legacyLangRedirect("/city/muscat", "?lang=ar&utm=1")).toBe("/ar/city/muscat?utm=1");
    expect(legacyLangRedirect("/now/riyadh", "?lang=en")).toBeNull();
    expect(legacyLangRedirect("/now", "?lang=ar")).toBeNull();
    expect(legacyLangRedirect("/login", "?lang=ar")).toBeNull();
    expect(legacyLangRedirect("/admin", "?lang=tr")).toBeNull();
    expect(legacyLangRedirect("/wear", "")).toBeNull();
    expect(legacyLangRedirect("/wear", "?lang=fr")).toBeNull();
  });
});
