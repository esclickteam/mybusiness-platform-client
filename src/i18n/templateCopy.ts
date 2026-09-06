import i18n from "./i18n";
import { getTextDirection, normalizeLanguage } from "./languages";
import { resolveTemplateLanguage } from "./templateDir";
import phrasebook from "./templateSeedPhrasebook.json";
import generatedExactLexicon from "./templateExactLexicon.generated.json";
import studioExactLexicon from "./templateExactLexicon.studio.json";
import storeExactLexicon from "./templateExactLexicon.store.json";
import sharedExactLexicon from "./templateExactLexicon.shared.json";
import heroesExactLexicon from "./templateExactLexicon.heroes.json";
import beautyExactLexicon from "./templateExactLexicon.beauty.json";
import bodyExactLexicon from "./templateExactLexicon.body.json";
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
  ...(heroesExactLexicon as Record<string, PhraseTranslation>),
  ...(beautyExactLexicon as Record<string, PhraseTranslation>),
  ...(bodyExactLexicon as Record<string, PhraseTranslation>),
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

const CATALOG_PRODUCT_RE = /^מוצר (.+) מתוך קטלוג (.+)\.$/;
const CATALOG_CATEGORY: Record<string, PhraseTranslation> = {
  אביזרים: { en: "accessories", es: "accesorios", "pt-BR": "acessórios", ar: "إكسسوارات" },
  דקור: { en: "decor", es: "decoración", "pt-BR": "decoração", ar: "ديكور" },
  "סמארט הום": { en: "smart home", es: "hogar inteligente", "pt-BR": "casa inteligente", ar: "منزل ذكي" },
  צעצועים: { en: "toys", es: "juguetes", "pt-BR": "brinquedos", ar: "ألعاب" },
  ממרחים: { en: "spreads", es: "untables", "pt-BR": "pastas", ar: "دهون" },
  טקסטיל: { en: "textiles", es: "textiles", "pt-BR": "têxteis", ar: "منسوجات" },
  רהיטים: { en: "furniture", es: "muebles", "pt-BR": "móveis", ar: "أثاث" },
  טיולים: { en: "travel", es: "viajes", "pt-BR": "viagens", ar: "سفر" },
  מחברות: { en: "notebooks", es: "cuadernos", "pt-BR": "cadernos", ar: "دفاتر" },
  ירקות: { en: "vegetables", es: "verduras", "pt-BR": "legumes", ar: "خضار" },
  פירות: { en: "fruit", es: "frutas", "pt-BR": "frutas", ar: "فاكهة" },
  דגנים: { en: "grains", es: "cereales", "pt-BR": "cereais", ar: "حبوب" },
  שרשראות: { en: "necklaces", es: "collares", "pt-BR": "colares", ar: "قلائد" },
  אודיו: { en: "audio", es: "audio", "pt-BR": "áudio", ar: "صوت" },
  ביגוד: { en: "apparel", es: "ropa", "pt-BR": "roupa", ar: "ملابس" },
  ידניים: { en: "hand tools", es: "herramientas manuales", "pt-BR": "ferramentas manuais", ar: "أدوات يدوية" },
  בטיחות: { en: "safety", es: "seguridad", "pt-BR": "segurança", ar: "سلامة" },
  ספרות: { en: "literature", es: "literatura", "pt-BR": "literatura", ar: "أدب" },
  ילדים: { en: "kids", es: "infantil", "pt-BR": "infantil", ar: "أطفال" },
  כתיבה: { en: "writing", es: "escritura", "pt-BR": "escrita", ar: "كتابة" },
  עגילים: { en: "earrings", es: "pendientes", "pt-BR": "brincos", ar: "أقراط" },
  שעונים: { en: "watches", es: "relojes", "pt-BR": "relógios", ar: "ساعات" },
  אחסון: { en: "storage", es: "almacenaje", "pt-BR": "armazenamento", ar: "تخزين" },
  טיפוח: { en: "care", es: "cuidado", "pt-BR": "cuidado", ar: "عناية" },
  איפור: { en: "makeup", es: "maquillaje", "pt-BR": "maquiagem", ar: "مكياج" },
  טבעות: { en: "rings", es: "anillos", "pt-BR": "anéis", ar: "خواتم" },
  חשמל: { en: "electrical", es: "electricidad", "pt-BR": "elétrica", ar: "كهرباء" },
  חדר: { en: "room", es: "habitación", "pt-BR": "quarto", ar: "غرفة" },
  שיער: { en: "hair", es: "cabello", "pt-BR": "cabelo", ar: "شعر" },
  מיטות: { en: "beds", es: "camas", "pt-BR": "camas", ar: "أسرّة" },
};

const STORY_OF_BRAND_RE = /^הסיפור של ([A-Za-z][\w.-]*)\.$/;

function localizeStoryOfBrand(text: string, locale: string): string {
  const match = text.match(STORY_OF_BRAND_RE);
  if (!match) return "";
  const brand = match[1];
  if (locale === "es") return `La historia de ${brand}.`;
  if (locale === "pt-BR") return `A história de ${brand}.`;
  if (locale === "ar") return `قصة ${brand}.`;
  return `The story of ${brand}.`;
}

function localizeCatalogProductLine(text: string, locale: string): string {
  const match = text.match(CATALOG_PRODUCT_RE);
  if (!match) return "";
  const category = pickLocaleCopy(CATALOG_CATEGORY[match[1]], locale);
  if (!category) return "";
  const brand = match[2];
  if (locale === "es") return `Producto de ${category} del catálogo ${brand}.`;
  if (locale === "pt-BR") return `Produto de ${category} do catálogo ${brand}.`;
  if (locale === "ar") return `منتج ${category} من كتالوج ${brand}.`;
  return `${category.charAt(0).toUpperCase()}${category.slice(1)} product from the ${brand} catalog.`;
}

function isUsableTranslation(source: string, translated: string, locale: string): boolean {
  if (!translated || translated === source) return false;
  if (locale === "he") return true;
  const srcHe = hebrewScore(source);
  const outHe = hebrewScore(translated);
  if (srcHe === 0) return translated !== source;
  // Any leftover Hebrew is a hybrid smash. Exact rows must be fully translated.
  return outHe === 0;
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

  const catalogLine = localizeCatalogProductLine(text, locale);
  if (isUsableTranslation(text, catalogLine, locale)) {
    return adaptBuiltInDirectionalCss(catalogLine, locale);
  }

  const storyLine = localizeStoryOfBrand(text, locale);
  if (isUsableTranslation(text, storyLine, locale)) {
    return adaptBuiltInDirectionalCss(storyLine, locale);
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
