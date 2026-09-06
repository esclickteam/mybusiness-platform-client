import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

import he from "./locales/he.json";
import en from "./locales/en.json";
import es from "./locales/es.json";
import ptBR from "./locales/pt-BR.json";
import ar from "./locales/ar.json";

const LOGIN_PAGE_SOURCES = [
  "src/pages/Login.tsx",
  "src/pages/ForgotPassword.tsx",
  "src/pages/ResetPassword.jsx",
  "src/pages/Register.tsx",
  "src/pages/ChangePassword.jsx",
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

describe("auth locale coverage", () => {
  const keys = collectTranslationKeys();

  it("finds the translation keys used by auth screens", () => {
    expect(keys.length).toBeGreaterThan(20);
    expect(keys).toContain("login.rememberMe");
    expect(keys).toContain("login.forgotTitle");
    expect(keys).toContain("register.submit");
    expect(keys).toContain("changePassword.title");
  });

  it.each([
    ["he", he],
    ["en", en],
    ["es", es],
    ["pt-BR", ptBR],
    ["ar", ar],
  ])("resolves every auth page key in %s.json", (_name, locale) => {
    const missing = keys.filter(
      (key) => typeof resolveKey(locale, key) !== "string"
    );
    expect(missing).toEqual([]);
  });
});
