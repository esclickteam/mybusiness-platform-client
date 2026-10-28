import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./i18n", () => {
  const i18n = {
    language: "en",
    changeLanguage: vi.fn(async (lng) => {
      i18n.language = lng;
    }),
  };
  return {
    default: i18n,
    ensureLocale: vi.fn(async (lng) => lng),
  };
});

vi.mock("../api", () => ({
  default: {
    patch: vi.fn(() => Promise.resolve({ data: {} })),
  },
}));

import i18n from "./i18n";
import API from "../api";
import { syncLanguageOnLogin, changeAppLanguage } from "./persistLanguage";
import {
  GEO_LANG_COOKIE,
  LANGUAGE_COOKIE,
  MANUAL_LANG_FLAG,
  RESOLVED_LANG_KEY,
  getManualLanguageChoice,
} from "./localeUtils";

function clearCookies() {
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0].trim();
    if (name) document.cookie = `${name}=; Path=/; Max-Age=0`;
  });
}

describe("persistLanguage", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    clearCookies();
    i18n.language = "en";
    i18n.changeLanguage.mockClear();
    API.patch.mockClear();
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  it("keeps an explicit local language over a different account language on login", () => {
    localStorage.setItem("token", "test-token");
    localStorage.setItem(MANUAL_LANG_FLAG, "he");
    const result = syncLanguageOnLogin({ language: "ar" });
    expect(result).toBe("he");
    expect(getManualLanguageChoice()).toBe("he");
    expect(document.documentElement.lang).toBe("he");
    expect(document.documentElement.dir).toBe("rtl");
    expect(API.patch).toHaveBeenCalledWith("/auth/language", { language: "he" });
  });

  it("syncs an explicit local language into the account when the profile has none", () => {
    localStorage.setItem("token", "test-token");
    localStorage.setItem(MANUAL_LANG_FLAG, "es");
    const result = syncLanguageOnLogin({ language: null });
    expect(result).toBe("es");
    expect(API.patch).toHaveBeenCalledWith("/auth/language", { language: "es" });
  });

  it("applies account language without locking it as a manual choice", () => {
    const result = syncLanguageOnLogin({ language: "ar" });
    expect(result).toBe("ar");
    expect(getManualLanguageChoice()).toBeNull();
    expect(localStorage.getItem(RESOLVED_LANG_KEY)).toBe("ar");
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
    expect(API.patch).not.toHaveBeenCalled();
  });

  it("uses the business country when the account has no language", () => {
    expect(
      syncLanguageOnLogin({ billingCountry: "IL", businessId: "biz", role: "business" })
    ).toBe("he");
    expect(getManualLanguageChoice()).toBeNull();
    expect(document.documentElement.lang).toBe("he");
    expect(document.documentElement.dir).toBe("rtl");
    expect(API.patch).not.toHaveBeenCalled();
  });

  it("maps a United States business to English and a manual choice still wins", () => {
    expect(syncLanguageOnLogin({ billingCountry: "United States", role: "business" })).toBe("en");
    expect(syncLanguageOnLogin({ billingCountry: "United Kingdom", role: "business" })).toBe("en");
    localStorage.setItem(MANUAL_LANG_FLAG, "he");
    localStorage.setItem("token", "test-token");
    expect(
      syncLanguageOnLogin({ billingCountry: "US", language: "en", role: "business" })
    ).toBe("he");
    expect(API.patch).toHaveBeenCalledWith("/auth/language", { language: "he" });
  });

  it("does not invent an account language from geo when nothing was chosen", () => {
    document.cookie = `${GEO_LANG_COOKIE}=he; Path=/`;
    const result = syncLanguageOnLogin({});
    expect(result).toBeNull();
    expect(API.patch).not.toHaveBeenCalled();
  });

  it("persists a manual language change locally immediately", async () => {
    await changeAppLanguage("pt-BR");
    expect(getManualLanguageChoice()).toBe("pt-BR");
    expect(localStorage.getItem(MANUAL_LANG_FLAG)).toBe("pt-BR");
    expect(document.cookie).toContain(`${LANGUAGE_COOKIE}=pt-BR`);
    expect(document.documentElement.lang).toBe("pt-BR");
    expect(document.documentElement.dir).toBe("ltr");
  });
});
