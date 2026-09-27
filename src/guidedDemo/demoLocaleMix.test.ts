import { describe, expect, it } from "vitest";
import en from "../i18n/locales/en.json";
import es from "../i18n/locales/es.json";
import ptBR from "../i18n/locales/pt-BR.json";
import ar from "../i18n/locales/ar.json";
import { currencyForDemoLocale, formatDemoMoney } from "./demoCurrency";
import { DEMO_FIXTURES } from "./fixtures/demoFixtures";
import { NOA_STUDIO_SITE } from "./fixtures/noaStudioSite";
import { tourStepText } from "./tourCopy";
import type { DemoLocale } from "./sessionStore";

const LOCALES: DemoLocale[] = ["en", "he", "es", "pt-BR", "ar"];
const HEBREW = /[\u0590-\u05FF]/;
const ARABIC = /[\u0600-\u06FF]/;
const LATIN_WORD = /[A-Za-z]{3,}/g;
const WHITELIST = new Set([
  "API", "CRM", "META", "WHATSAPP", "FACEBOOK", "INSTAGRAM",
  "ROAS", "CTR", "CPL", "CPC", "WABA", "DEMO",
  "NOA", "STUDIO", "BIZUPLY", "SMS", "URL", "WWW", "COM", "HTTPS", "HTTP", "PNG", "SVG",
]);

function strings(value: unknown, path = ""): Array<[string, string]> {
  if (typeof value === "string") return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((v, i) => strings(v, `${path}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => strings(v, path ? `${path}.${k}` : k));
  }
  return [];
}

/** Words that don't belong to the locale's script; brand/tech acronyms are allowed. */
function foreignText(locale: DemoLocale, text: string): string[] {
  const issues: string[] = [];
  if (locale !== "he" && HEBREW.test(text)) issues.push("hebrew");
  if (locale !== "ar" && ARABIC.test(text)) issues.push("arabic");
  if (locale === "he" || locale === "ar") {
    const latin = (text.replace(/https?:\/\/\S+|\S+@\S+|\{\{[^}]+\}\}/g, "").match(LATIN_WORD) || [])
      .filter((w) => !WHITELIST.has(w.toUpperCase()));
    if (latin.length) issues.push(`latin:${latin.join(",")}`);
  }
  return issues;
}

function perLocaleIssues(byLocale: Partial<Record<DemoLocale, unknown>>, label: string) {
  const issues: string[] = [];
  for (const locale of LOCALES) {
    for (const [path, text] of strings(byLocale[locale])) {
      const found = foreignText(locale, text);
      if (found.length) issues.push(`${label}[${locale}].${path}: ${found.join(" ")} -> ${text}`);
    }
  }
  return issues;
}

const META_STEPS = [
  "meta-create", "meta-objective", "meta-objective-continue", "meta-budget", "meta-open-adset",
  "meta-audience", "meta-open-ad", "meta-creative", "meta-publish", "meta-metrics",
  "meta-open-campaign", "meta-open-leads",
];

describe("guided demo single-locale content", () => {
  it("suggested values and success copy match the demo locale", () => {
    const issues: string[] = [];
    for (const [stepId, byLocale] of Object.entries(DEMO_FIXTURES.stepSuggested)) {
      issues.push(...perLocaleIssues(byLocale, `suggested.${stepId}`));
    }
    for (const [stepId, byLocale] of Object.entries(DEMO_FIXTURES.stepSuccess)) {
      issues.push(...perLocaleIssues(byLocale, `success.${stepId}`));
    }
    issues.push(...perLocaleIssues(DEMO_FIXTURES.service, "service"));
    issues.push(...perLocaleIssues(DEMO_FIXTURES.campaign, "campaign"));
    expect(issues).toEqual([]);
  });

  it("Noa Studio website bundle matches the demo locale", () => {
    expect(perLocaleIssues(NOA_STUDIO_SITE, "site")).toEqual([]);
  });

  it("every locale has the CRM note example", () => {
    expect(DEMO_FIXTURES.stepSuggested["crm-note-text"].en).toMatch(/couples photography package/);
    for (const locale of LOCALES) {
      expect(DEMO_FIXTURES.stepSuggested["crm-note-text"][locale]).toBeTruthy();
    }
  });

  it("campaign tour copy exists for every locale without mixed scripts", () => {
    const issues: string[] = [];
    for (const locale of LOCALES) {
      for (const stepId of META_STEPS) {
        const copy = tourStepText(stepId, locale);
        if (!copy) {
          issues.push(`${locale}.${stepId}: missing`);
          continue;
        }
        for (const [path, text] of strings(copy)) {
          const found = foreignText(locale, text);
          if (found.length) issues.push(`${locale}.${stepId}.${path}: ${found.join(" ")}`);
        }
      }
    }
    expect(issues).toEqual([]);
    expect(tourStepText("meta-budget", "en")?.instruction).toContain("$25/day");
    expect(tourStepText("meta-budget", "he")?.instruction).toContain("₪90");
  });

  it("non-Hebrew locale files contain no Hebrew (help-center search keywords excepted)", () => {
    const files = { en, es, "pt-BR": ptBR, ar } as Record<string, unknown>;
    const issues = Object.entries(files).flatMap(([locale, json]) =>
      strings(json)
        .filter(([path, text]) => HEBREW.test(text) && !/^helpCenter\..*\.keywords/.test(path))
        .map(([path]) => `${locale}.${path}`),
    );
    expect(issues).toEqual([]);
  });

  it("automation trigger catalog is translated for every non-Hebrew locale", () => {
    const triggers = ["new_lead", "lead_status_changed", "appointment_created", "appointment_reminder", "form_submitted", "order_created"];
    const files = { en, es, "pt-BR": ptBR, ar } as Record<string, any>;
    for (const [locale, json] of Object.entries(files)) {
      const catalog = json.automations?.catalog?.triggers || {};
      for (const key of triggers) {
        expect(catalog[key]?.label, `${locale}.${key}`).toBeTruthy();
      }
    }
    expect((en as any).automations.catalog.triggers.new_lead.label).toBe("New lead in CRM");
    expect((en as any).automations.catalog.triggers.appointment_created.label).toBe("Appointment booked");
  });
});

describe("guided demo currency", () => {
  it("uses ILS only for Hebrew", () => {
    expect(currencyForDemoLocale("he").code).toBe("ILS");
    for (const locale of ["en", "es", "pt-BR", "ar"]) {
      expect(currencyForDemoLocale(locale).code).toBe("USD");
    }
  });

  it("formats daily budgets per locale", () => {
    expect(formatDemoMoney(180, { per: "day", locale: "en" })).toBe("$180/day");
    expect(formatDemoMoney(180, { per: "day", locale: "es" })).toBe("$180/día");
    expect(formatDemoMoney(180, { per: "day", locale: "pt-BR" })).toBe("$180/dia");
    expect(formatDemoMoney(180, { per: "day", locale: "ar" })).toBe("$180 / يوم");
    expect(formatDemoMoney(180, { per: "day", locale: "he" })).toBe("₪180 ליום");
  });

  it("campaign fixtures never show ₪ outside Hebrew", () => {
    for (const locale of ["en", "es", "pt-BR", "ar"] as DemoLocale[]) {
      const text = JSON.stringify([
        DEMO_FIXTURES.campaign[locale],
        DEMO_FIXTURES.service[locale],
        NOA_STUDIO_SITE[locale],
      ]);
      expect(text, locale).not.toContain("₪");
    }
  });
});
