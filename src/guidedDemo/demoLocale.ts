import i18n from "../i18n/i18n";
import { getDemoFixture } from "./demoFixtureLookup";
import { normalizeDemoLocale, readGuidedDemoLocaleLock, type DemoLocale } from "./sessionStore";

export { getDemoFixture } from "./demoFixtureLookup";
export { formatDemoMoney, getDemoCurrency, currencyForDemoLocale } from "./demoCurrency";
export type { DemoCurrency, DemoMoneyPer } from "./demoCurrency";
export type { DemoLocale } from "./sessionStore";

/** Locale of the active guided demo (null outside a demo). */
export function getDemoLocale(): DemoLocale | null {
  return readGuidedDemoLocaleLock();
}

/** Translate with the demo locale pinned, whatever i18n currently holds. */
export function tDemo(
  key: string,
  fallback?: string,
  options: Record<string, unknown> = {},
): string {
  const lng = getDemoLocale() || undefined;
  return String(
    i18n.t(key, {
      ...options,
      ...(fallback !== undefined ? { defaultValue: fallback } : {}),
      ...(lng ? { lng } : {}),
    }),
  );
}

const HEBREW = /[\u0590-\u05FF]/;
const ARABIC = /[\u0600-\u06FF]/;
const LATIN_WORDS = /[A-Za-z]{3,}(?:\s+[A-Za-z]{2,}){2,}/;

/**
 * True when free text plausibly belongs to the demo locale's script. Catches
 * Hebrew leaking into en/es/pt-BR demos, Arabic into Latin/Hebrew demos, and
 * full English sentences inside he/ar demos.
 */
export function matchesDemoScript(text: unknown, locale?: unknown): boolean {
  const value = String(text ?? "");
  if (!value.trim()) return true;
  const resolved = (locale ? normalizeDemoLocale(locale) : getDemoLocale()) || "en";
  if (resolved === "he") return !ARABIC.test(value) && (HEBREW.test(value) || !LATIN_WORDS.test(value));
  if (resolved === "ar") return !HEBREW.test(value) && (ARABIC.test(value) || !LATIN_WORDS.test(value));
  return !HEBREW.test(value) && !ARABIC.test(value);
}

/** Drop (and log) raw text that does not match the demo locale. */
export function guardDemoText(text: string | null | undefined, context: string): string {
  const value = String(text ?? "");
  const locale = getDemoLocale();
  if (!locale || matchesDemoScript(value, locale)) return value;
  // eslint-disable-next-line no-console
  console.warn(`[guided-demo-i18n] suppressed ${context} text not in demo locale ${locale}: ${value}`);
  return "";
}

/** Localized step suggestion; never falls back to raw text in another language. */
export function demoStepSuggestion(stepId: string | undefined, raw?: string | null): string {
  const fixture = stepId ? getDemoFixture<string>(`stepSuggested.${stepId}`) : undefined;
  if (fixture) return fixture;
  return guardDemoText(raw, `suggestedValue(${stepId || "?"})`);
}

/** Localized step success toast; never falls back to raw text in another language. */
export function demoStepSuccess(stepId: string | undefined, raw?: string | null): string {
  const fixture = stepId ? getDemoFixture<string>(`stepSuccess.${stepId}`) : undefined;
  if (fixture) return fixture;
  return guardDemoText(raw, `successFeedback(${stepId || "?"})`);
}
