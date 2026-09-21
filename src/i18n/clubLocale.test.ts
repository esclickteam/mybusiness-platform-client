import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import i18n from "./i18n";
import { getTextDirection } from "./localeUtils";
import clubEn from "./locales/club/en.json";
import clubHe from "./locales/club/he.json";
import clubEs from "./locales/club/es.json";
import clubPtBR from "./locales/club/pt-BR.json";
import clubAr from "./locales/club/ar.json";

const repoRoot = path.resolve(__dirname, "../..");
const CLUB_SOURCES = [
  "src/pages/business/dashboardPages/global-club",
  "src/pages/admin/AdminClubPage.tsx",
];

function flattenKeys(value: unknown, prefix = ""): string[] {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return prefix ? [prefix] : [];
  }
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) => {
    const next = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === "object" && !Array.isArray(child)) {
      return flattenKeys(child, next);
    }
    return [next];
  });
}

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.(tsx|ts|jsx|js)$/.test(entry.name) ? [full] : [];
  });
}

function clubSourceFiles() {
  return CLUB_SOURCES.flatMap((relative) => {
    const absolute = path.join(repoRoot, relative);
    const stat = fs.statSync(absolute);
    return stat.isDirectory() ? walk(absolute).filter((file) => !/\.test\.(tsx|ts|jsx|js)$/.test(file)) : [absolute];
  });
}

describe("Global Business Club i18n", () => {
  const englishKeys = flattenKeys(clubEn).sort();

  it.each([
    ["he", clubHe],
    ["es", clubEs],
    ["pt-BR", clubPtBR],
    ["ar", clubAr],
  ])("%s club catalog has the same keys as English", (_name, locale) => {
    expect(flattenKeys(locale).sort()).toEqual(englishKeys);
  });

  it("translates the Overview landing screenshot strings in Hebrew", () => {
    expect(clubHe.landing.title).toBe("התחברו. שתפו פעולה. צמחו.");
    expect(clubHe.landing.cta).toBe("בקשה להצטרף");
    expect(clubHe.landing.benefits.advice).toBe("ייעוץ עסקי ומשוב");
    expect(clubHe.landing.benefits.collaborations).toBe("הזדמנויות לשיתוף פעולה");
    expect(clubHe.nav.overview).toBe("סקירה");
    expect(clubHe.nav.join).toBe("בקשה להצטרף");
  });

  it.each([
    ["en", "ltr", "Connect. Collaborate. Grow.", "Request to Join"],
    ["he", "rtl", "התחברו. שתפו פעולה. צמחו.", "בקשה להצטרף"],
    ["es", "ltr", "Conecta. Colabora. Crece.", "Solicitar unirse"],
    ["pt-BR", "ltr", "Conecte. Colabore. Cresça.", "Pedir para entrar"],
    ["ar", "rtl", "تواصل. تعاون. انمُ.", "طلب الانضمام"],
  ])("language %s uses %s and translated landing chrome", async (lng, dir, title, cta) => {
    await i18n.changeLanguage(lng);
    expect(getTextDirection(i18n.language)).toBe(dir);
    expect(i18n.t("club.landing.title")).toBe(title);
    expect(i18n.t("club.landing.cta")).toBe(cta);
    if (lng !== "en") {
      expect(i18n.t("club.landing.benefits.advice")).not.toBe("Business advice and feedback");
    }
  });

  it("does not hardcode English UI copy in Club screens", () => {
    const leftover: string[] = [];
    const allow = [
      /Club context missing/,
      /Something went wrong/,
      /You already have a request waiting for review/,
      /You are already a Club member/,
      /Your Club membership is suspended/,
      /Please complete the required application fields/,
      /Login required/,
      /Club member not found/,
      /Post not found/,
      /Club request failed/,
      /Active Global Business Club membership is required/,
      /International markets/,
      /Business strategy/,
      /Professional services/,
      /United Arab Emirates/,
      /United Kingdom/,
      /United States/,
      /New Zealand/,
      /South Africa/,
      /South Korea/,
      /E-commerce/,
    ];

    for (const file of clubSourceFiles()) {
      const source = fs.readFileSync(file, "utf8");
      const relative = path.relative(repoRoot, file).replaceAll("\\", "/");
      for (const match of source.matchAll(/(?:title|text|placeholder|label|aria-label)=["']([^"']+)["']/g)) {
        if (match[1] === "https://" || /^https?:\/\//i.test(match[1])) continue;
        leftover.push(`${relative}: ${match[1]}`);
      }
      for (const match of source.matchAll(/>([A-Z][A-Za-z][^<{]{8,})</g)) {
        leftover.push(`${relative}: ${match[1].trim()}`);
      }
      for (const match of source.matchAll(/["']([A-Z][A-Za-z]+ [A-Za-z][^"']{6,})["']/g)) {
        const value = match[1];
        if (allow.some((pattern) => pattern.test(value))) continue;
        if (/^(post|put|delete|get)\b/i.test(value)) continue;
        if (/^https?:\/\//i.test(value) || value === "https://") continue;
        leftover.push(`${relative}: ${value}`);
      }
    }

    expect(leftover).toEqual([]);
  });

  it("resolves club t() keys used by Club screens in all 5 languages", () => {
    const keys = new Set<string>();
    for (const file of clubSourceFiles()) {
      const source = fs.readFileSync(file, "utf8");
      for (const match of source.matchAll(/\bt\(\s*["'`](club\.[^"'`]+)["'`]/g)) {
        if (match[1].includes("${")) continue;
        keys.add(match[1]);
      }
    }
    expect(keys.size).toBeGreaterThan(40);
    const catalogs = [
      ["en", clubEn],
      ["he", clubHe],
      ["es", clubEs],
      ["pt-BR", clubPtBR],
      ["ar", clubAr],
    ] as const;
    for (const [name, catalog] of catalogs) {
      const missing = [...keys].filter((key) => {
        const pathParts = key.replace(/^club\./, "").split(".");
        let current: unknown = catalog;
        for (const part of pathParts) {
          if (!current || typeof current !== "object") return true;
          current = (current as Record<string, unknown>)[part];
        }
        return typeof current !== "string";
      });
      expect({ locale: name, missing }).toEqual({ locale: name, missing: [] });
    }
  });
});
