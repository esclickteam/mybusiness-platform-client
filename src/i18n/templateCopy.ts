import i18n from "./i18n";
import { getTextDirection, normalizeLanguage } from "./languages";
import { resolveTemplateLanguage } from "./templateDir";
import phrasebook from "./templateSeedPhrasebook.json";
import generatedExactLexicon from "./templateExactLexicon.generated.json";
import studioExactLexicon from "./templateExactLexicon.studio.json";
import storeExactLexicon from "./templateExactLexicon.store.json";
import sharedExactLexicon from "./templateExactLexicon.shared.json";
import { TEMPLATE_EXACT_LEXICON, type LocaleCopy } from "./templateExactLexicon";

type PhraseTranslation = {
  en?: string;
  es?: string;
  "pt-BR"?: string;
  ar?: string;
};

const book = phrasebook as Record<string, PhraseTranslation>;
const HE = /[\u0590-\u05FF]/;

/** Generated rows first; studio chrome next; hand-written lexicon always wins. */
const EXACT_LEXICON: Record<string, PhraseTranslation | LocaleCopy> = {
  ...(generatedExactLexicon as Record<string, PhraseTranslation>),
  ...(studioExactLexicon as Record<string, PhraseTranslation>),
  ...(storeExactLexicon as Record<string, PhraseTranslation>),
  ...(sharedExactLexicon as Record<string, PhraseTranslation>),
  ...TEMPLATE_EXACT_LEXICON,
};

function localeKey(language?: string): "he" | "en" | "es" | "pt-BR" | "ar" {
  const normalized = normalizeLanguage(resolveTemplateLanguage(language) || i18n.language);
  if (normalized === "he") return "he";
  if (normalized === "pt-BR") return "pt-BR";
  if (normalized === "es" || normalized === "ar" || normalized === "en") {
    return normalized;
  }
  return "en";
}

function hebrewScore(value: string): number {
  return (String(value || "").match(/[\u0590-\u05FF]/g) || []).length;
}

function pickLocaleCopy(entry: PhraseTranslation | LocaleCopy | undefined, locale: string): string {
  if (!entry) return "";
  if (locale === "pt-BR") return entry["pt-BR"] || entry.en || "";
  if (locale === "es") return entry.es || entry.en || "";
  if (locale === "ar") return entry.ar || entry.en || "";
  return entry.en || "";
}

function isUsableTranslation(source: string, translated: string, locale: string): boolean {
  if (!translated || translated === source) return false;
  if (locale === "he") return true;
  const srcHe = hebrewScore(source);
  const outHe = hebrewScore(translated);
  if (srcHe === 0) return translated !== source;
  return outHe <= Math.floor(srcHe * 0.25);
}

const exactKeys = Object.keys(EXACT_LEXICON).sort((a, b) => b.length - a.length);
const bookKeys = Object.keys(book).sort((a, b) => b.length - a.length);

function adaptBuiltInDirectionalCss(text: string, locale: string): string {
  if (locale === "he") return text;
  if (!/direction\s*:|text-align\s*:/i.test(text)) return text;
  const dir = getTextDirection(locale);
  return text
    .replace(/direction:\s*rtl/gi, `direction:${dir}`)
    .replace(/text-align:\s*right/gi, "text-align:start");
}

/** Rewrite baked-in RTL library styles so new inserts follow the dashboard language. */
export function localizeLibraryInsertStyle<T extends Record<string, any>>(
  style: T | undefined,
  language?: string,
): T | undefined {
  if (!style) return style;
  const locale = localeKey(language);
  if (locale === "he") return style;
  const dir = getTextDirection(locale);
  const next = { ...style };
  if (next.direction === "rtl" || next.direction === "ltr") {
    next.direction = dir;
  }
  if (next.textAlign === "right" || next.textAlign === "left") {
    next.textAlign = "start";
  }
  return next;
}

export function localizeBuiltInText(text: string, language?: string): string {
  if (!text) return text;
  const locale = localeKey(language);
  if (locale === "he") return text;
  if (!HE.test(text)) return adaptBuiltInDirectionalCss(text, locale);

  const exact = pickLocaleCopy(EXACT_LEXICON[text], locale);
  if (isUsableTranslation(text, exact, locale)) {
    return adaptBuiltInDirectionalCss(exact, locale);
  }

  const bookHit = pickLocaleCopy(book[text], locale);
  if (isUsableTranslation(text, bookHit, locale)) {
    return adaptBuiltInDirectionalCss(bookHit, locale);
  }

  // Short punchy lines must be exact. Word-by-word smash turns
  // "לילה קטן. טעמים גדולים." into "night small. flavors large."
  // Composed chrome like "דף הבית – פתיחה מפוצלת" can still use fragments.
  if (text.length <= 48 && !/[–·]/.test(text)) {
    return adaptBuiltInDirectionalCss(text, locale);
  }

  let out = text;
  for (const source of exactKeys) {
    if (!out.includes(source)) continue;
    const translated = pickLocaleCopy(EXACT_LEXICON[source], locale);
    if (!isUsableTranslation(source, translated, locale)) continue;
    out = out.split(source).join(translated);
  }
  for (const source of bookKeys) {
    if (!out.includes(source)) continue;
    const translated = pickLocaleCopy(book[source], locale);
    if (!isUsableTranslation(source, translated, locale)) continue;
    out = out.split(source).join(translated);
  }
  // Longest-key replacement may leave stray Hebrew words. Reject hybrids.
  if (isUsableTranslation(text, out, locale) && hebrewScore(out) === 0) {
    return adaptBuiltInDirectionalCss(out, locale);
  }
  return adaptBuiltInDirectionalCss(text, locale);
}

export function localizeBuiltInTemplateSeed<T>(data: T, language?: string): T {
  if (data == null) return data;
  const locale = localeKey(language);
  if (locale === "he") return data;

  const walk = (value: unknown): unknown => {
    if (typeof value === "string") return localizeBuiltInText(value, locale);
    if (Array.isArray(value)) return value.map(walk);
    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([key, child]) => [
          key,
          walk(child),
        ]),
      );
    }
    return value;
  };

  return walk(data) as T;
}

/** Localize a built-in Hebrew demo string for the active dashboard language. */
export function tx(text: string, language?: string): string {
  return localizeBuiltInText(text, language);
}
