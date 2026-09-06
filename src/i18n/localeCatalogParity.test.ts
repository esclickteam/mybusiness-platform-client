import { describe, expect, it } from "vitest";
import en from "./locales/en.json";
import he from "./locales/he.json";
import es from "./locales/es.json";
import ptBR from "./locales/pt-BR.json";
import ar from "./locales/ar.json";

function flattenKeys(value, prefix = "") {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return prefix ? [prefix] : [];
  }

  return Object.entries(value).flatMap(([key, child]) => {
    const next = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === "object" && !Array.isArray(child)) {
      return flattenKeys(child, next);
    }
    return [next];
  });
}

describe("locale catalog parity", () => {
  const englishKeys = flattenKeys(en).sort();

  it.each([
    ["he", he],
    ["es", es],
    ["pt-BR", ptBR],
    ["ar", ar],
  ])("%s.json has the same keys as en.json", (_name, locale) => {
    expect(flattenKeys(locale).sort()).toEqual(englishKeys);
  });

  it("covers the five product languages with core chrome keys", () => {
    expect(englishKeys).toEqual(expect.arrayContaining([
      "common.save",
      "common.changeLanguage",
      "login.cardTitle",
      "register.submit",
      "studio.back",
      "changePassword.title",
      "staff.dashboard",
    ]));
    expect(englishKeys.length).toBeGreaterThan(6000);
  });
});
