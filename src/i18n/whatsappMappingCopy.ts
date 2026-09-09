import i18n from "./i18n";
import { coerceSupportedLanguage, isHebrewLanguage } from "./languages";

export type TranslateFn = (
  key: string,
  options?: { defaultValue?: string },
) => string;

const HEBREW = /[\u0590-\u05FF]/;

/** Built-in API labels. Custom CRM/form names are not in this set. */
const AUTO_HEBREW_LABELS = new Set([
  "ערך ידני",
  "ערך קבוע",
  "לקוח / איש קשר",
  "ליד",
  "ליד מ־Meta",
  "ליד מ-Meta",
  "ליד מ־Google Ads",
  "ליד מ-Google Ads",
  "טופס",
  "פגישה",
  "עסק",
  "ערכי מערכת",
  "שם פרטי",
  "שם מלא",
  "שם",
  "שם הלקוח",
  "שם הליד",
  "שם איש הקשר",
  "שם העסק",
  "שם השירות",
  "שם הטופס",
  "שם העמוד",
  "שם הקמפיין",
  "שם הבעלים",
  "טלפון",
  "טלפון העסק",
  "אימייל",
  "אימייל העסק",
  "אימייל הבעלים",
  "כתובת",
  "כתובת / מיקום",
  "מיקום הפגישה",
  "תגיות",
  "הערות",
  "הודעה",
  "מקור הליד",
  "ספק",
  "סטטוס הליד",
  "סטטוס הפגישה",
  "תאריך",
  "תאריך יצירת קשר אחרון",
  "תאריך יצירה",
  "תאריך עדכון",
  "תאריך שליחה",
  "תאריך הפגישה",
  "שעה",
  "שעת הפגישה",
  "תאריך ושעה",
  "תאריך ושעת הפגישה",
  "משך הפגישה",
  "אושרה",
  "מחיר",
  "שולם",
  "אמצעי תשלום",
  "איש קשר",
  "עיר",
  "אזור",
  "תיאור העסק",
  "קטגוריה",
  "אתר",
  "קישור וואטסאפ",
  "שעות פעילות",
  "תאריך נוכחי",
  "שעה נוכחית",
  "תאריך ושעה נוכחיים",
  "שנה נוכחית",
  "חודש נוכחי",
  "יום נוכחי",
  "מזהה ייחודי",
  "זמן יחסי עד לפגישה",
  "מזהה ליד",
  "מזהה טופס",
  "מזהה עמוד",
  "מזהה חשבון Google Ads",
  "מזהה קמפיין",
  "מזהה שליחה",
  "מזהה לחיצה של Google",
  "מזהה קבוצת מודעות",
  "מזהה מודעה",
  "זמן יצירה",
  "שלב הליד",
  "יום/חודש/שנה",
  "חודש/יום/שנה",
  "שנה-חודש-יום",
  "יום.חודש.שנה",
  "24 שעות",
  "12 שעות עם AM/PM",
  "5 באוגוסט 2026 בשעה 10:00",
  "מספר שלם",
  "עשרוני",
  "מטבע",
  "אחוזים",
  "כפי שהתקבל",
  "אותיות גדולות",
  "אותיות קטנות",
  "אות ראשונה גדולה",
  "הסרת רווחים מיותרים",
  "פורמט בינלאומי",
  "פורמט מקומי",
  "פורמט מוסתר חלקית",
]);

const FORMAT_CATALOG_KEYS: Record<string, string> = {
  "dd/MM/yyyy": "date_dmy",
  "MM/dd/yyyy": "date_mdy",
  "yyyy-MM-dd": "date_ymd",
  "dd.MM.yyyy": "date_dmy_dot",
  "HH:mm": "time_24",
  "hh:mm a": "time_12",
  "MMMM d, yyyy 'at' h:mm a": "datetime_long",
  "dd/MM/yyyy HH:mm": "datetime_dmy_24",
  "MM/dd/yyyy h:mm a": "datetime_mdy_12",
  "yyyy-MM-dd HH:mm": "datetime_ymd_24",
  integer: "integer",
  decimal: "decimal",
  currency: "currency",
  percent: "percent",
  original: "original",
  upper: "upper",
  lower: "lower",
  capitalize: "capitalize",
  trim: "trim",
  international: "international",
  local: "local",
  masked: "masked",
};

function langOf(language?: string) {
  return coerceSupportedLanguage(language || i18n.language);
}

export function mappingCatalogId(id?: string | null) {
  return String(id || "")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

export function isAutoHebrewLabel(value?: string | null) {
  const text = String(value || "").trim();
  return Boolean(text) && AUTO_HEBREW_LABELS.has(text);
}

function translateOrFallback(
  t: TranslateFn,
  key: string,
  fallback: string,
) {
  const translated = t(key, { defaultValue: fallback || "" });
  if (!translated || translated === key) return fallback;
  return translated;
}

export function metaTemplateStatusKey(
  metaStatus?: string | null,
  qualityScore?: string | null,
  source?: string | null,
) {
  const meta = String(metaStatus || "").toUpperCase();
  const quality = String(qualityScore || "").toUpperCase();
  if (meta === "PENDING") return "pending";
  if (meta === "IN_APPEAL") return "inAppeal";
  if (meta === "REJECTED") return "rejected";
  if (meta === "DISABLED") return "disabled";
  if (meta === "PAUSED") return "paused";
  if (meta === "PENDING_DELETION") return "pendingDeletion";
  if (meta === "DELETED") return "deleted";
  if (meta === "LIMIT_EXCEEDED") return "limitExceeded";
  if (meta === "APPROVED") {
    if (!quality || quality === "UNKNOWN" || quality === "PENDING") {
      return "activePendingQuality";
    }
    if (quality === "GREEN" || quality === "HIGH") return "activeHighQuality";
    if (quality === "YELLOW" || quality === "MEDIUM") {
      return "activeMediumQuality";
    }
    if (quality === "RED" || quality === "LOW") return "activeLowQuality";
    return "active";
  }
  if (meta === "LOCAL" || source === "local") return "localDraft";
  return "localDraft";
}

export function metaTemplateStatusLabel(
  t: TranslateFn,
  metaStatus?: string | null,
  qualityScore?: string | null,
  source?: string | null,
) {
  const key = metaTemplateStatusKey(metaStatus, qualityScore, source);
  return t(`whatsapp.templates.metaStatus.${key}`);
}

export function mappingSourceLabel(
  t: TranslateFn,
  sourceId?: string | null,
  apiFallback?: string | null,
  language?: string,
) {
  const id = String(sourceId || "").trim();
  const fallback = String(apiFallback || "").trim();
  if (!id) {
    return hebrewSafeFallback(fallback, language);
  }
  const translated = translateOrFallback(
    t,
    `whatsapp.mapping.sources.${id}`,
    "",
  );
  if (translated) return translated;
  return hebrewSafeFallback(fallback, language) || id;
}

export function mappingFieldLabel(
  t: TranslateFn,
  sourceId?: string | null,
  fieldId?: string | null,
  apiFallback?: string | null,
  language?: string,
) {
  const field = String(fieldId || "").trim();
  const fallback = String(apiFallback || "").trim();
  if (!field) return hebrewSafeFallback(fallback, language);
  if (field.startsWith("details:") || field.startsWith("custom:")) {
    return fallback || field.slice(field.indexOf(":") + 1);
  }
  const flat = mappingCatalogId(field);
  const source = String(sourceId || "").trim();
  if (source) {
    const bySource = translateOrFallback(
      t,
      `whatsapp.mapping.fieldBySource.${source}.${flat}`,
      "",
    );
    if (bySource) return bySource;
  }
  const common = translateOrFallback(
    t,
    `whatsapp.mapping.fields.${flat}`,
    "",
  );
  if (common) return common;
  return hebrewSafeFallback(fallback, language) || field;
}

export function mappingFormatLabel(
  t: TranslateFn,
  formatId?: string | null,
  apiFallback?: string | null,
  language?: string,
) {
  const id = String(formatId || "").trim();
  const fallback = String(apiFallback || "").trim();
  if (!id) return hebrewSafeFallback(fallback, language);
  const catalogKey = FORMAT_CATALOG_KEYS[id] || mappingCatalogId(id);
  const translated = translateOrFallback(
    t,
    `whatsapp.mapping.formats.${catalogKey}`,
    "",
  );
  if (translated) return translated;
  return hebrewSafeFallback(fallback, language) || id;
}

export function mappingFriendlyName(
  t: TranslateFn,
  options: {
    friendlyName?: string | null;
    source?: string | null;
    field?: string | null;
    apiFieldLabel?: string | null;
    language?: string;
  },
) {
  const saved = String(options.friendlyName || "").trim();
  const fieldLabel = mappingFieldLabel(
    t,
    options.source,
    options.field,
    options.apiFieldLabel,
    options.language,
  );
  if (saved && !isAutoHebrewLabel(saved)) return saved;
  if (fieldLabel) return fieldLabel;
  if (isHebrewLanguage(langOf(options.language))) return saved;
  return "";
}

function hebrewSafeFallback(value: string, language?: string) {
  if (!value) return "";
  if (isHebrewLanguage(langOf(language))) return value;
  if (HEBREW.test(value) && isAutoHebrewLabel(value)) return "";
  return value;
}
