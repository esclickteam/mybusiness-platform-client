import { describe, it, expect, afterEach, beforeEach } from "vitest";
import {
  DEFAULT_LANGUAGE,
  FALLBACK_LANGUAGE,
  LANGUAGE_COOKIE,
  MANUAL_LANG_FLAG,
  applyLanguageFromUrl,
  coerceSupportedLanguage,
  getHtmlLang,
  getIntlLocale,
  getManualLanguageChoice,
  getTextDirection,
  isHebrewLanguage,
  isRtlLanguage,
  languageFromCountry,
  languageFromUrl,
  normalizeLanguage,
  resolvePreferredLanguage,
  setSessionLanguageOverride,
} from "./localeUtils";
import { detectLanguageFromNavigator, languageFromBrowserLocale } from "./languages";

describe("locale direction helpers", () => {
  it("treats Hebrew and Arabic as RTL", () => {
    expect(getTextDirection("he")).toBe("rtl");
    expect(getTextDirection("ar")).toBe("rtl");
    expect(getHtmlLang("he")).toBe("he");
    expect(getHtmlLang("ar")).toBe("ar");
    expect(isRtlLanguage("he")).toBe(true);
    expect(isRtlLanguage("ar")).toBe(true);
    expect(isHebrewLanguage("he")).toBe(true);
  });

  it("treats English, Spanish and Brazilian Portuguese as LTR", () => {
    expect(getTextDirection("en")).toBe("ltr");
    expect(getTextDirection("es")).toBe("ltr");
    expect(getTextDirection("pt-BR")).toBe("ltr");
    expect(getHtmlLang("pt-BR")).toBe("pt-BR");
    expect(getIntlLocale("pt-BR")).toBe("pt-BR");
    expect(isRtlLanguage("en")).toBe(false);
  });
});

describe("language normalization", () => {
  it("falls back to English when empty", () => {
    expect(DEFAULT_LANGUAGE).toBe("en");
    expect(FALLBACK_LANGUAGE).toBe("en");
    expect(coerceSupportedLanguage("")).toBe("en");
    expect(normalizeLanguage("")).toBeNull();
  });

  it("preserves Brazilian Portuguese and rejects generic Portuguese", () => {
    expect(normalizeLanguage("pt-BR")).toBe("pt-BR");
    expect(normalizeLanguage("pt-br")).toBe("pt-BR");
    expect(normalizeLanguage("pt_BR")).toBe("pt-BR");
    expect(normalizeLanguage("pt")).toBeNull();
    expect(normalizeLanguage("pt-PT")).toBeNull();
    expect(coerceSupportedLanguage("pt-PT")).toBe("en");
  });

  it("maps browser locale prefixes", () => {
    expect(languageFromBrowserLocale("es-MX")).toBe("es");
    expect(languageFromBrowserLocale("he-IL")).toBe("he");
    expect(languageFromBrowserLocale("ar-AE")).toBe("ar");
    expect(languageFromBrowserLocale("en-US")).toBe("en");
    expect(languageFromBrowserLocale("fr-FR")).toBeNull();
  });
});

describe("country language mapping", () => {
  it("maps first-visit countries", () => {
    expect(languageFromCountry("IL")).toBe("he");
    expect(languageFromCountry("BR")).toBe("pt-BR");
    expect(languageFromCountry("AE")).toBe("ar");
    expect(languageFromCountry("MX")).toBe("es");
    expect(languageFromCountry("ES")).toBe("es");
    expect(languageFromCountry("US")).toBe("en");
    expect(languageFromCountry("DE")).toBe("en");
    expect(languageFromCountry("")).toBeNull();
    expect(languageFromCountry("XX")).toBeNull();
  });
});

describe("priority resolution", () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      if (name) document.cookie = `${name}=; Path=/; Max-Age=0`;
    });
  });

  it("prefers an explicit local selection over geo and browser", () => {
    setSessionLanguageOverride("es");
    expect(getManualLanguageChoice()).toBe("es");
    expect(
      resolvePreferredLanguage({
        accountLanguage: null,
        allowGeo: true,
        allowBrowser: true,
      })
    ).toBe("es");
  });

  it("prefers the account language over local and geo", () => {
    setSessionLanguageOverride("he");
    expect(
      resolvePreferredLanguage({
        accountLanguage: "ar",
        allowGeo: true,
        allowBrowser: true,
      })
    ).toBe("ar");
  });
});

describe("languageFromUrl", () => {
  const originalSearch = window.location.search;

  afterEach(() => {
    window.history.replaceState({}, "", `/${originalSearch || ""}`);
  });

  it("returns null when lang is missing", () => {
    window.history.replaceState({}, "", "/login");
    expect(languageFromUrl()).toBeNull();
  });

  it("accepts supported locales including pt-BR and ar", () => {
    window.history.replaceState({}, "", "/login?lang=en");
    expect(languageFromUrl()).toBe("en");
    window.history.replaceState({}, "", "/?lang=he");
    expect(languageFromUrl()).toBe("he");
    window.history.replaceState({}, "", "/?lang=pt-BR");
    expect(languageFromUrl()).toBe("pt-BR");
    window.history.replaceState({}, "", "/?lang=ar");
    expect(languageFromUrl()).toBe("ar");
    window.history.replaceState({}, "", "/?lang=es");
    expect(languageFromUrl()).toBe("es");
  });

  it("ignores unsupported lang values", () => {
    window.history.replaceState({}, "", "/?lang=fr");
    expect(languageFromUrl()).toBeNull();
    window.history.replaceState({}, "", "/?lang=pt");
    expect(languageFromUrl()).toBeNull();
  });

  it("does not persist a language when the query is absent", () => {
    window.history.replaceState({}, "", "/login");
    localStorage.removeItem(MANUAL_LANG_FLAG);
    expect(applyLanguageFromUrl()).toBeNull();
    expect(getManualLanguageChoice()).toBeNull();
  });
});

describe("explicit preference persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("stores the choice in localStorage and a durable cookie", () => {
    setSessionLanguageOverride("pt-BR");
    expect(localStorage.getItem(MANUAL_LANG_FLAG)).toBe("pt-BR");
    expect(document.cookie).toContain(`${LANGUAGE_COOKIE}=pt-BR`);
    expect(getManualLanguageChoice()).toBe("pt-BR");
  });

  it("does not let geo override an explicit local selection", () => {
    setSessionLanguageOverride("en");
    document.cookie = "bizuply_geo_lang=he; Path=/";
    expect(
      resolvePreferredLanguage({
        accountLanguage: null,
        allowGeo: true,
        allowBrowser: true,
      })
    ).toBe("en");
  });
});
