import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

import he from "./locales/he.json";
import en from "./locales/en.json";

/** Components rendered by the /login route. */
const LOGIN_PAGE_SOURCES = [
  "src/pages/Login.tsx",
  "src/components/auth/AuthShell.tsx",
  "src/components/auth/LoginFormSkeleton.tsx",
];

const repoRoot = path.resolve(__dirname, "../..");

function collectTranslationKeys(): string[] {
  const keys = new Set<string>();

  for (const relativePath of LOGIN_PAGE_SOURCES) {
    const absolutePath = path.join(repoRoot, relativePath);
    const source = fs.readFileSync(absolutePath, "utf8");

    for (const match of source.matchAll(/\bt\(\s*["'`]([^"'`]+)["'`]/g)) {
      keys.add(match[1]);
    }
  }

  return [...keys].sort();
}

function resolveKey(locale: unknown, key: string): unknown {
  return key
    .split(".")
    .reduce<unknown>(
      (value, segment) =>
        value && typeof value === "object"
          ? (value as Record<string, unknown>)[segment]
          : undefined,
      locale
    );
}

describe("login page locale coverage", () => {
  const keys = collectTranslationKeys();

  it("finds the translation keys used by the login page", () => {
    expect(keys.length).toBeGreaterThan(20);
    expect(keys).toContain("login.rememberMe");
    expect(keys).toContain("login.featureMetaLeadsTitle");
  });

  it.each([
    ["he", he],
    ["en", en],
  ])("resolves every login page key in %s.json", (_name, locale) => {
    const missing = keys.filter(
      (key) => typeof resolveKey(locale, key) !== "string"
    );

    expect(missing).toEqual([]);
  });

  it("never falls back to a raw key as the translated value", () => {
    const rawKeyValues = keys.filter((key) => {
      const hebrew = resolveKey(he, key);
      const english = resolveKey(en, key);
      return hebrew === key || english === key;
    });

    expect(rawKeyValues).toEqual([]);
  });

  it("keeps the Hebrew login copy non-empty", () => {
    const blank = keys.filter((key) => {
      const value = resolveKey(he, key);
      return typeof value === "string" && value.trim() === "";
    });

    expect(blank).toEqual([]);
  });
});
