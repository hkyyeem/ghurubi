import { describe, expect, it } from "vitest";
import { langPath, langLinks, stripLangPrefix } from "@/lib/i18n";

describe("Arabic is the default homepage language", () => {
  it("puts the Arabic homepage at / and English at /en", () => {
    expect(langPath("/", "ar")).toBe("/");
    expect(langPath("/", "en")).toBe("/en");
    expect(stripLangPrefix("/en")).toBe("/");
    expect(langLinks("/", "ar").canonical).toBe("https://ghurubi.com/");
    expect(langLinks("/", "ar").alternates.find(a => a.hreflang === "x-default")?.href).toBe("https://ghurubi.com/");
  });
});
