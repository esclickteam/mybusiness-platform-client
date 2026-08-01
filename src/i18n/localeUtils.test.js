import { describe, it, expect } from "vitest";
import { getTextDirection, getIntlLocale, isHebrewLanguage } from "./localeUtils";

describe("locale direction helpers (backing useLocaleDir)", () => {
  it("treats Hebrew as RTL", () => {
    expect(getTextDirection("he")).toBe("rtl");
    expect(isHebrewLanguage("he")).toBe(true);
    expect(getIntlLocale("he")).toBe("he-IL");
  });

  it("treats other languages as LTR", () => {
    expect(getTextDirection("en")).toBe("ltr");
    expect(isHebrewLanguage("en")).toBe(false);
    expect(getIntlLocale("en")).toBe("en-US");
  });
});
