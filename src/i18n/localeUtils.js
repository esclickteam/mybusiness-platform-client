export const GEO_LANG_COOKIE = "bizuply_geo_lang";
/** Durable, user-selected language. Persists across reloads and wins over geo. */
export const MANUAL_LANG_FLAG = "bizuply_lang_manual";
export const SESSION_LANG_KEY = "bizuply_lang_session";
export const I18N_STORAGE_KEY = "i18nextLng";

export function normalizeLanguage(lng) {
  return String(lng || "en").split("-")[0].toLowerCase() || "en";
}

export function languageFromCountry(country) {
  return String(country || "").toUpperCase() === "IL" ? "he" : "en";
}

export function getTextDirection(lng) {
  return normalizeLanguage(lng) === "he" ? "rtl" : "ltr";
}

export function getIntlLocale(lng) {
  return normalizeLanguage(lng) === "he" ? "he-IL" : "en-US";
}

export function isHebrewLanguage(lng) {
  return normalizeLanguage(lng) === "he";
}

export function getCookie(name) {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`)
  );

  return match ? decodeURIComponent(match[1]) : null;
}

export function setCookie(name, value, days = 30) {
  if (typeof document === "undefined") return;

  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

export function applyDocumentLocale(lng) {
  if (typeof document === "undefined") return;

  const language = normalizeLanguage(lng);
  document.documentElement.lang = language;
  document.documentElement.dir = getTextDirection(language);
}

export function clearStoredLanguageOverrides() {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(MANUAL_LANG_FLAG);
  }
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.removeItem(SESSION_LANG_KEY);
  }
}

/** @deprecated */
export function clearLegacyManualLanguageChoice() {
  clearStoredLanguageOverrides();
}

/**
 * Persist an explicit user language choice.
 * Stored durably (localStorage) so it survives reloads and full navigations,
 * and takes precedence over geo detection until the user picks another language.
 */
export function setSessionLanguageOverride(lng) {
  const language = normalizeLanguage(lng);
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem(SESSION_LANG_KEY, language);
  }
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(I18N_STORAGE_KEY, language);
    localStorage.setItem(MANUAL_LANG_FLAG, language);
  }
  applyDocumentLocale(language);
}

/** Persist an explicit user language choice (alias of setSessionLanguageOverride). */
export function markManualLanguageChoice(lng) {
  setSessionLanguageOverride(lng);
}

/** Read the durable, user-selected language, or null if the user never chose one. */
export function getManualLanguageChoice() {
  if (typeof localStorage === "undefined") return null;
  const raw = localStorage.getItem(MANUAL_LANG_FLAG);
  if (!raw) return null;
  return normalizeLanguage(raw);
}

export function getSessionLanguageOverride() {
  if (typeof sessionStorage === "undefined") return null;
  const stored = normalizeLanguage(sessionStorage.getItem(SESSION_LANG_KEY) || "");
  return stored === "he" || stored === "en" ? stored : null;
}

export function hasSessionLanguageOverride() {
  return Boolean(getSessionLanguageOverride());
}

export function hasManualLanguageChoice() {
  return Boolean(getManualLanguageChoice());
}

export function detectLanguageFromTimezone() {
  try {
    if (Intl.DateTimeFormat().resolvedOptions().timeZone === "Asia/Jerusalem") {
      return "he";
    }
  } catch {
    // Ignore timezone lookup failures.
  }
  return null;
}

export function detectLanguageFromNavigator() {
  try {
    const candidates = [
      typeof navigator !== "undefined" ? navigator.language : null,
      ...((typeof navigator !== "undefined" && navigator.languages) || []),
    ];

    if (
      candidates.some((value) =>
        String(value || "")
          .toLowerCase()
          .startsWith("he")
      )
    ) {
      return "he";
    }
  } catch {
    // Ignore navigator lookup failures.
  }
  return null;
}

/**
 * Fast local signal before /api/geo responds.
 * Prefer Israel signals (timezone / browser language) over a stale geo cookie.
 */
export function detectLanguageFromBrowserSignals() {
  return (
    detectLanguageFromTimezone() ||
    detectLanguageFromNavigator() ||
    normalizeLanguage(getCookie(GEO_LANG_COOKIE) || "") ||
    "en"
  );
}

/**
 * Resolve UI language from geo API: Israel → he, everywhere else → en.
 */
export async function fetchGeoLanguage() {
  try {
    const response = await fetch("/api/geo", {
      credentials: "same-origin",
      headers: { accept: "application/json" },
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json();
      const country = String(data?.country || "")
        .trim()
        .toUpperCase();

      if (country) {
        const language = languageFromCountry(country);
        setCookie(GEO_LANG_COOKIE, language);
        return language;
      }

      if (data?.language === "he" || data?.language === "en") {
        setCookie(GEO_LANG_COOKIE, data.language);
        return data.language;
      }
    }
  } catch {
    // Ignore network failures — fall back to browser signals.
  }

  const fallback = detectLanguageFromBrowserSignals();
  const language = fallback === "he" ? "he" : "en";
  setCookie(GEO_LANG_COOKIE, language);
  return language;
}
