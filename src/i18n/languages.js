/**
 * Canonical UI locales for the BizUply dashboard.
 * Website/project content language is independent and must not use this list
 * as a hard constraint on customer-site copy.
 */

export const SUPPORTED_LANGUAGES = Object.freeze(["en", "he", "es", "pt-BR", "ar"]);

export const FALLBACK_LANGUAGE = "en";

export const RTL_LANGUAGES = Object.freeze(["he", "ar"]);

export const LANGUAGE_COOKIE = "bizuply_lang";
export const GEO_LANG_COOKIE = "bizuply_geo_lang";
export const MANUAL_LANG_FLAG = "bizuply_lang_preference";
export const SESSION_LANG_KEY = "bizuply_lang_session";
export const I18N_STORAGE_KEY = "i18nextLng";

export const LANGUAGE_META = Object.freeze([
  {
    code: "en",
    shortLabel: "EN",
    nativeLabel: "English",
    flag: "🇺🇸",
    dir: "ltr",
    intlLocale: "en-US",
    htmlLang: "en",
  },
  {
    code: "he",
    shortLabel: "HE",
    nativeLabel: "עברית",
    flag: "🇮🇱",
    dir: "rtl",
    intlLocale: "he-IL",
    htmlLang: "he",
  },
  {
    code: "es",
    shortLabel: "ES",
    nativeLabel: "Español",
    flag: "🇪🇸",
    dir: "ltr",
    intlLocale: "es-ES",
    htmlLang: "es",
  },
  {
    code: "pt-BR",
    shortLabel: "PT",
    nativeLabel: "Português (Brasil)",
    flag: "🇧🇷",
    dir: "ltr",
    intlLocale: "pt-BR",
    htmlLang: "pt-BR",
  },
  {
    code: "ar",
    shortLabel: "AR",
    nativeLabel: "العربية",
    flag: "🇦🇪",
    dir: "rtl",
    intlLocale: "ar-AE",
    htmlLang: "ar",
  },
]);

const SPANISH_COUNTRIES = new Set([
  "ES",
  "MX",
  "AR",
  "CO",
  "CL",
  "PE",
  "UY",
  "PY",
  "EC",
  "BO",
  "VE",
  "CR",
  "PA",
  "DO",
  "GT",
  "HN",
  "SV",
  "NI",
  "CU",
  "PR",
  "GQ",
]);

const ARABIC_COUNTRIES = new Set([
  "AE",
  "SA",
  "QA",
  "BH",
  "KW",
  "OM",
  "JO",
  "EG",
  "MA",
  "LB",
  "IQ",
  "DZ",
  "TN",
  "LY",
  "SY",
  "YE",
  "PS",
  "SD",
  "MR",
  "DJ",
  "SO",
  "KM",
]);

const META_BY_CODE = Object.fromEntries(
  LANGUAGE_META.map((item) => [item.code, item])
);

export function isSupportedLanguage(lng) {
  return SUPPORTED_LANGUAGES.includes(lng);
}

export function getLanguageMeta(lng) {
  return META_BY_CODE[lng] || META_BY_CODE[FALLBACK_LANGUAGE];
}

/**
 * Normalize any incoming locale tag to a supported UI language.
 * Generic Portuguese (pt, pt-PT) is NOT mapped to pt-BR.
 * Returns null when the value is missing or unsupported.
 */
export function normalizeLanguage(lng, { fallback = null } = {}) {
  if (lng == null || lng === "") return fallback;

  const raw = String(lng).trim().replace(/_/g, "-");
  if (!raw) return fallback;

  const lower = raw.toLowerCase();
  if (lower === "pt-br") return "pt-BR";
  if (lower === "iw" || lower.startsWith("iw-")) return "he";

  const [base, region] = lower.split("-");
  if (base === "pt") {
    return region === "br" ? "pt-BR" : fallback;
  }

  if (base === "he" || base === "es" || base === "ar" || base === "en") {
    return base;
  }

  return fallback;
}

export function coerceSupportedLanguage(lng) {
  return normalizeLanguage(lng, { fallback: FALLBACK_LANGUAGE });
}

export function getTextDirection(lng) {
  const language = coerceSupportedLanguage(lng);
  return RTL_LANGUAGES.includes(language) ? "rtl" : "ltr";
}

export function getHtmlLang(lng) {
  return getLanguageMeta(coerceSupportedLanguage(lng)).htmlLang;
}

export function getIntlLocale(lng) {
  return getLanguageMeta(coerceSupportedLanguage(lng)).intlLocale;
}

export function isRtlLanguage(lng) {
  return getTextDirection(lng) === "rtl";
}

export function isHebrewLanguage(lng) {
  return coerceSupportedLanguage(lng) === "he";
}

export function languageFromCountry(country) {
  const code = String(country || "")
    .trim()
    .toUpperCase();
  if (!code || code === "XX" || code === "T1") return null;
  if (code === "IL") return "he";
  if (code === "BR") return "pt-BR";
  if (SPANISH_COUNTRIES.has(code)) return "es";
  if (ARABIC_COUNTRIES.has(code)) return "ar";
  return FALLBACK_LANGUAGE;
}

export function languageFromBrowserLocale(tag) {
  return normalizeLanguage(tag, { fallback: null });
}

export function detectLanguageFromNavigator() {
  try {
    const candidates = [
      typeof navigator !== "undefined" ? navigator.language : null,
      ...((typeof navigator !== "undefined" && navigator.languages) || []),
    ];

    for (const candidate of candidates) {
      const mapped = languageFromBrowserLocale(candidate);
      if (mapped) return mapped;
    }
  } catch {
    // Ignore navigator lookup failures.
  }
  return null;
}

export function getShortLanguageLabel(lng) {
  return getLanguageMeta(coerceSupportedLanguage(lng)).shortLabel;
}
