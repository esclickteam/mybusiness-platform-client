import { describe, it, expect, afterEach } from "vitest";
import {
  DEFAULT_LANGUAGE,
  getTextDirection,
  getIntlLocale,
  isHebrewLanguage,
  languageFromUrl,
  applyLanguageFromUrl,
  getManualLanguageChoice,
  MANUAL_LANG_FLAG,
  normalizeLanguage,
} from "./localeUtils";

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

describe("product language default", () => {
  it("defaults to Hebrew", () => {
    expect(DEFAULT_LANGUAGE).toBe("he");
    expect(normalizeLanguage("")).toBe("he");
    expect(normalizeLanguage(null)).toBe("he");
    expect(getTextDirection(DEFAULT_LANGUAGE)).toBe("rtl");
  });

  it("still normalizes explicit English", () => {
    expect(normalizeLanguage("en")).toBe("en");
    expect(normalizeLanguage("en-US")).toBe("en");
  });
});

describe("languageFromUrl", () => {
  const originalSearch = window.location.search;

  afterEach(() => {
    window.history.replaceState({}, "", `/${originalSearch || ""}`);
  });

  it("returns null when lang is missing so English is not implied", () => {
    window.history.replaceState({}, "", "/login");
    expect(languageFromUrl()).toBeNull();
  });

  it("forces English from ?lang=en", () => {
    window.history.replaceState({}, "", "/login?lang=en");
    expect(languageFromUrl()).toBe("en");
  });

  it("forces Hebrew from ?lang=he", () => {
    window.history.replaceState({}, "", "/?lang=he");
    expect(languageFromUrl()).toBe("he");
  });

  it("ignores unsupported lang values", () => {
    window.history.replaceState({}, "", "/?lang=fr");
    expect(languageFromUrl()).toBeNull();
  });

  it("does not persist a language when the query is absent", () => {
    window.history.replaceState({}, "", "/login");
    localStorage.removeItem(MANUAL_LANG_FLAG);
    expect(applyLanguageFromUrl()).toBeNull();
    expect(getManualLanguageChoice()).toBeNull();
  });
});
