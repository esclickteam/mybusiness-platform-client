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
import galleryExactLexicon from "./templateExactLexicon.gallery.json";
import catalogExactLexicon from "./templateExactLexicon.catalog.json";
import moreExactLexicon from "./templateExactLexicon.more.json";
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
  ...(galleryExactLexicon as Record<string, PhraseTranslation>),
  ...(catalogExactLexicon as Record<string, PhraseTranslation>),
  ...(moreExactLexicon as Record<string, PhraseTranslation>),
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
  תכשיטים: { en: "jewelry", es: "joyería", "pt-BR": "joias", ar: "مجوهرات" },
  "הלבשת בית": { en: "homewear", es: "ropa de casa", "pt-BR": "roupa de casa", ar: "ملابس منزلية" },
  "פארם וטיפוח": { en: "pharmacy and care", es: "farmacia y cuidado", "pt-BR": "farmácia e cuidado", ar: "صيدلية وعناية" },
  "צמחים ומשתלה": { en: "plants and nursery", es: "plantas y vivero", "pt-BR": "plantas e viveiro", ar: "نباتات ومشتل" },
  "ג׳ינס וסטרית": { en: "denim and street", es: "denim y street", "pt-BR": "jeans e street", ar: "دينم وستريت" },
  "סניקרס וסטריטוור": { en: "sneakers and streetwear", es: "sneakers y streetwear", "pt-BR": "tênis e streetwear", ar: "سنيكرز وستريتوير" },
  "יקב ויינות": { en: "winery and wines", es: "bodega y vinos", "pt-BR": "vinícola e vinhos", ar: "كرم ونبيذ" },
  "טקסטיל לבית": { en: "home textiles", es: "textiles para el hogar", "pt-BR": "têxteis para casa", ar: "منسوجات للمنزل" },
  "קפה ספיישלטי": { en: "specialty coffee", es: "café de especialidad", "pt-BR": "café especial", ar: "قهوة مختصة" },
  "נרות וריחות": { en: "candles and scents", es: "velas y aromas", "pt-BR": "velas e aromas", ar: "شموع وعطور" },
  נעליים: { en: "shoes", es: "zapatos", "pt-BR": "sapatos", ar: "أحذية" },
  "מוצרי בית": { en: "home goods", es: "artículos del hogar", "pt-BR": "artigos para casa", ar: "مستلزمات المنزل" },
  "ויטמינים ותוספים": { en: "vitamins and supplements", es: "vitaminas y complementos", "pt-BR": "vitaminas e suplementos", ar: "فيتامينات ومكملات" },
  "מטבח וכלי בישול": { en: "kitchen and cookware", es: "cocina y utensilios", "pt-BR": "cozinha e utensílios", ar: "مطبخ وأدوات طبخ" },
  "טיולים וקמפינג": { en: "travel and camping", es: "viajes y camping", "pt-BR": "viagens e camping", ar: "سفر وتخييم" },
  "אופניים וציוד רכיבה": { en: "bikes and riding gear", es: "bicicletas y equipo", "pt-BR": "bicicletas e equipamento", ar: "دراجات ومعدات ركوب" },
  "בגדים ואופנה": { en: "apparel and fashion", es: "ropa y moda", "pt-BR": "roupa e moda", ar: "ملابس وأزياء" },
  "צעצועים ומשחקים": { en: "toys and games", es: "juguetes y juegos", "pt-BR": "brinquedos e jogos", ar: "ألعاب" },
  "תיקים ואקססוריז": { en: "bags and accessories", es: "bolsos y accesorios", "pt-BR": "bolsas e acessórios", ar: "حقائب وإكسسوارات" },
  "אודיו וסאונד": { en: "audio and sound", es: "audio y sonido", "pt-BR": "áudio e som", ar: "صوت" },
  לפטופים: { en: "laptops", es: "portátiles", "pt-BR": "laptops", ar: "حواسيب محمولة" },
  משקולות: { en: "weights", es: "pesas", "pt-BR": "pesos", ar: "أوزان" },
  סניקרס: { en: "sneakers", es: "sneakers", "pt-BR": "tênis", ar: "سنيكرز" },
  תאורה: { en: "lighting", es: "iluminación", "pt-BR": "iluminação", ar: "إضاءة" },
};

const NAMED_CATALOG_RE = /^(.+) מתוך קטלוג ([A-Za-z][\w.-]*) — (.+)\.$/;
const STORE_ADDON_RE = /^([A-Za-z][\w.-]*) · (.+) · מוצרים מתוסף החנות$/;
const STORY_OF_BRAND_RE = /^הסיפור של ([A-Za-z][\w.-]*)\.$/;
const AGENCY_SITE_COLON_RE =
  /^אתר מלא לסוכנות (.+): 8 עמודים, תנועה, אפקטים ועיצוב (.+)\.$/;
const AGENCY_SITE_DASH_RE =
  /^אתר מלא לסוכנות (.+) עם 8 עמודים, תנועה ואפקטים — (.+)\.$/;
const STORE_SITE_COLON_RE =
  /^חנות (.+) מלאה: 8 עמודים, קטגוריות, סינונים, סל ומוצרים מתוסף החנות\.$/;
const STORE_SITE_DASH_RE =
  /^חנות (.+) מלאה עם 8 עמודים, סינונים ומוצרים מתוסף החנות\.$/;

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

function localizeNamedCatalogProductLine(text: string, locale: string): string {
  const match = text.match(NAMED_CATALOG_RE);
  if (!match) return "";
  const rawProduct = match[1];
  const brand = match[2];
  const category = pickLocaleCopy(CATALOG_CATEGORY[match[3]], locale);
  if (!category) return "";
  let product = rawProduct;
  if (HE.test(rawProduct)) {
    product = pickLocaleCopy(EXACT_LEXICON[rawProduct], locale);
    if (!isUsableTranslation(rawProduct, product, locale)) return "";
  }
  if (locale === "es") return `${product} del catálogo ${brand} — ${category}.`;
  if (locale === "pt-BR") return `${product} do catálogo ${brand} — ${category}.`;
  if (locale === "ar") return `${product} من كتالوج ${brand} — ${category}.`;
  return `${product} from the ${brand} catalog — ${category}.`;
}

function localizeStoreAddonLine(text: string, locale: string): string {
  const match = text.match(STORE_ADDON_RE);
  if (!match) return "";
  const brand = match[1];
  const tagline = match[2];
  let localizedTag = tagline;
  if (HE.test(tagline)) {
    localizedTag = pickLocaleCopy(EXACT_LEXICON[tagline], locale);
    if (!isUsableTranslation(tagline, localizedTag, locale)) return "";
  }
  if (locale === "es") return `${brand} · ${localizedTag} · productos del extra de tienda`;
  if (locale === "pt-BR") return `${brand} · ${localizedTag} · produtos do extra da loja`;
  if (locale === "ar") return `${brand} · ${localizedTag} · منتجات من إضافة المتجر`;
  return `${brand} · ${localizedTag} · products from the store add-on`;
}

function localizeFragment(text: string, locale: string): string {
  if (!HE.test(text)) return text;
  const exact = pickLocaleCopy(EXACT_LEXICON[text], locale);
  if (isUsableTranslation(text, exact, locale)) return exact;
  return "";
}

function localizeAgencySiteLine(text: string, locale: string): string {
  const colon = text.match(AGENCY_SITE_COLON_RE);
  const dash = text.match(AGENCY_SITE_DASH_RE);
  const match = colon || dash;
  if (!match) return "";
  const kind = localizeFragment(match[1], locale);
  const design = localizeFragment(match[2], locale) || (HE.test(match[2]) ? "" : match[2]);
  if (!kind || !design) return "";
  if (colon) {
    if (locale === "es") return `Web completa para agencia de ${kind}: 8 páginas, movimiento, efectos y diseño ${design}.`;
    if (locale === "pt-BR") return `Site completo para agência de ${kind}: 8 páginas, movimento, efeitos e design ${design}.`;
    if (locale === "ar") return `موقع كامل لوكالة ${kind}: 8 صفحات وحركة وتأثيرات وتصميم ${design}.`;
    return `Full site for a ${kind} agency: 8 pages, motion, effects, and ${design} design.`;
  }
  if (locale === "es") return `Web completa para agencia de ${kind} con 8 páginas, movimiento y efectos — ${design}.`;
  if (locale === "pt-BR") return `Site completo para agência de ${kind} com 8 páginas, movimento e efeitos — ${design}.`;
  if (locale === "ar") return `موقع كامل لوكالة ${kind} مع 8 صفحات وحركة وتأثيرات — ${design}.`;
  return `Full site for a ${kind} agency with 8 pages, motion, and effects — ${design}.`;
}

function localizeStoreSiteLine(text: string, locale: string): string {
  const colon = text.match(STORE_SITE_COLON_RE);
  const dash = text.match(STORE_SITE_DASH_RE);
  const match = colon || dash;
  if (!match) return "";
  const kind = localizeFragment(match[1], locale);
  if (!kind) return "";
  if (colon) {
    if (locale === "es") return `Tienda completa de ${kind}: 8 páginas, categorías, filtros, carrito y productos del extra de tienda.`;
    if (locale === "pt-BR") return `Loja completa de ${kind}: 8 páginas, categorias, filtros, carrinho e produtos do extra da loja.`;
    if (locale === "ar") return `متجر ${kind} كامل: 8 صفحات وفئات وفلاتر وسلة ومنتجات من إضافة المتجر.`;
    return `Full ${kind} store: 8 pages, categories, filters, cart, and products from the store add-on.`;
  }
  if (locale === "es") return `Tienda completa de ${kind} con 8 páginas, filtros y productos del extra de tienda.`;
  if (locale === "pt-BR") return `Loja completa de ${kind} com 8 páginas, filtros e produtos do extra da loja.`;
  if (locale === "ar") return `متجر ${kind} كامل مع 8 صفحات وفلاتر ومنتجات من إضافة المتجر.`;
  return `Full ${kind} store with 8 pages, filters, and products from the store add-on.`;
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

  const namedCatalogLine = localizeNamedCatalogProductLine(text, locale);
  if (isUsableTranslation(text, namedCatalogLine, locale)) {
    return adaptBuiltInDirectionalCss(namedCatalogLine, locale);
  }

  const storyLine = localizeStoryOfBrand(text, locale);
  if (isUsableTranslation(text, storyLine, locale)) {
    return adaptBuiltInDirectionalCss(storyLine, locale);
  }

  const storeAddonLine = localizeStoreAddonLine(text, locale);
  if (isUsableTranslation(text, storeAddonLine, locale)) {
    return adaptBuiltInDirectionalCss(storeAddonLine, locale);
  }

  const agencySiteLine = localizeAgencySiteLine(text, locale);
  if (isUsableTranslation(text, agencySiteLine, locale)) {
    return adaptBuiltInDirectionalCss(agencySiteLine, locale);
  }

  const storeSiteLine = localizeStoreSiteLine(text, locale);
  if (isUsableTranslation(text, storeSiteLine, locale)) {
    return adaptBuiltInDirectionalCss(storeSiteLine, locale);
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
