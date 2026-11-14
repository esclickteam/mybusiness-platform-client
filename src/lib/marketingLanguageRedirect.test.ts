import { describe, expect, it } from "vitest";
import { lastLanguageCookie, marketingLanguageRedirectPath } from "./localePathCore.mjs";

describe("marketing language redirect", () => {
  it("sends a first Hebrew browser visit from the English homepage to Hebrew", () => {
    expect(marketingLanguageRedirectPath("/", { acceptLanguage: "he-IL,he;q=0.9,en;q=0.8" })).toBe("/he");
  });

  it("keeps an English browser on the unprefixed homepage", () => {
    expect(marketingLanguageRedirectPath("/", { acceptLanguage: "en-US,en;q=0.9" })).toBeNull();
  });

  it("does not override an explicit Hebrew URL when nothing was saved", () => {
    expect(marketingLanguageRedirectPath("/he/crm", { acceptLanguage: "en-US" })).toBeNull();
  });

  it("keeps a saved English choice on the unprefixed homepage", () => {
    expect(marketingLanguageRedirectPath("/", { cookie: "en", acceptLanguage: "he-IL" })).toBeNull();
  });

  it("keeps the newest language cookie when an older host cookie is also sent", () => {
    const saved = lastLanguageCookie("bizuply_lang=ar; bizuply_lang=en");
    expect(saved).toBe("en");
    expect(marketingLanguageRedirectPath("/", { cookie: saved, acceptLanguage: "ar" })).toBeNull();
    expect(lastLanguageCookie("bizuply_lang=en")).toBe("en");
  });

  it("keeps an explicit Hebrew or Arabic address even when another language was saved", () => {
    expect(marketingLanguageRedirectPath("/he", { cookie: "en", acceptLanguage: "he-IL" })).toBeNull();
    expect(marketingLanguageRedirectPath("/he", { cookie: "ar" })).toBeNull();
    expect(marketingLanguageRedirectPath("/ar/pricing", { cookie: "he" })).toBeNull();
  });

  it("returns a saved Hebrew visitor to the Hebrew URL", () => {
    expect(marketingLanguageRedirectPath("/crm", { cookie: "he", acceptLanguage: "en" })).toBe("/he/crm");
  });

  it("keeps an explicit English alias even when Hebrew is saved", () => {
    expect(marketingLanguageRedirectPath("/en/security-scanner", { cookie: "he", acceptLanguage: "he-IL" })).toBeNull();
  });

  it("maps Portuguese and leaves Italian on English", () => {
    expect(marketingLanguageRedirectPath("/pricing", { acceptLanguage: "pt-BR,pt;q=0.8" })).toBe("/pt-br/pricing");
    expect(marketingLanguageRedirectPath("/", { acceptLanguage: "it-IT,it;q=0.9" })).toBeNull();
  });
});
