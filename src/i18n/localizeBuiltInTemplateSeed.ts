import i18n from "./i18n";
import { normalizeLanguage } from "./languages";
import phrasebook from "./templateSeedPhrasebook.json";

type PhraseTranslation = {
  en?: string;
  es?: string;
  "pt-BR"?: string;
  ar?: string;
};

const book = phrasebook as Record<string, PhraseTranslation>;

const keysByLength = Object.keys(book).sort((a, b) => b.length - a.length);

function localeKey(language?: string) {
  const normalized = normalizeLanguage(language || i18n.language);
  if (normalized === "he") return "he";
  if (normalized === "pt-BR") return "pt-BR";
  if (normalized === "es" || normalized === "ar" || normalized === "en") {
    return normalized;
  }
  return "en";
}

export function localizeBuiltInText(text: string, language?: string): string {
  if (!text) return text;
  const locale = localeKey(language);
  if (locale === "he") return text;

  let out = text;
  for (const source of keysByLength) {
    if (!out.includes(source)) continue;
    const translated = book[source]?.[locale] || book[source]?.en;
    if (!translated || translated === source) continue;
    out = out.split(source).join(translated);
  }
  return out;
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
