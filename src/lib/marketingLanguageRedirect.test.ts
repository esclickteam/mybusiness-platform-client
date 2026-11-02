import { describe, expect, it } from "vitest";
import { marketingLanguageRedirectPath } from "./localePathCore.mjs";

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

  it("keeps a saved English choice in Israel", () => {
    expect(marketingLanguageRedirectPath("/", { cookie: "en", acceptLanguage: "he-IL" })).toBeNull();
    expect(marketingLanguageRedirectPath("/he", { cookie: "en", acceptLanguage: "he-IL" })).toBe("/");
  });

  it("returns a saved Hebrew visitor to the Hebrew URL", () => {
    expect(marketingLanguageRedirectPath("/crm", { cookie: "he", acceptLanguage: "en" })).toBe("/he/crm");
  });

  it("maps Portuguese and leaves Italian on English", () => {
    expect(marketingLanguageRedirectPath("/pricing", { acceptLanguage: "pt-BR,pt;q=0.8" })).toBe("/pt-br/pricing");
    expect(marketingLanguageRedirectPath("/", { acceptLanguage: "it-IT,it;q=0.9" })).toBeNull();
  });
});
