export const GEO_LANG_COOKIE = "bizuply_geo_lang";
/** @deprecated permanent override — cleared on load; kept for migration */
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

/** Clear legacy permanent manual override so geo can win again. */
export function clearLegacyManualLanguageChoice() {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(MANUAL_LANG_FLAG);
}

/**
 * Temporary override for the current browser tab/session only.
 * Cleared when the tab/session ends — next visit uses geo again.
 */
export function setSessionLanguageOverride(lng) {
  const language = normalizeLanguage(lng);
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem(SESSION_LANG_KEY, language);
  }
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(I18N_STORAGE_KEY, language);
    localStorage.removeItem(MANUAL_LANG_FLAG);
  }
  applyDocumentLocale(language);
}

/** @deprecated use setSessionLanguageOverride */
export function markManualLanguageChoice(lng) {
  setSessionLanguageOverride(lng);
}

export function getSessionLanguageOverride() {
  if (typeof sessionStorage === "undefined") return null;
  const stored = normalizeLanguage(sessionStorage.getItem(SESSION_LANG_KEY) || "");
  return stored === "he" || stored === "en" ? stored : null;
}

export function hasSessionLanguageOverride() {
  return Boolean(getSessionLanguageOverride());
}

/** @deprecated */
export function hasManualLanguageChoice() {
  return hasSessionLanguageOverride();
}

export function detectLanguageFromTimezone() {
  try {
    if (Intl.DateTimeFormat().resolvedOptions().timeZone === "Asia/Jerusalem") {
      return "he";
    }
  } catch {
    // Ignore timezone lookup failures.
  }
  return "en";
}

/**
 * Resolve UI language from geo API: Israel → he, everywhere else → en.
 * Always refreshes the geo cookie when the API returns a known country language.
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
      const language = normalizeLanguage(
        data?.language || languageFromCountry(data?.country)
      );

      // Only trust API when country was resolved (or language explicitly returned).
      if (
        (data?.country || data?.language) &&
        (language === "he" || language === "en")
      ) {
        setCookie(GEO_LANG_COOKIE, language);
        return language;
      }
    }
  } catch {
    // Ignore network failures — fall back to timezone.
  }

  const fallback = detectLanguageFromTimezone();
  setCookie(GEO_LANG_COOKIE, fallback);
  return fallback;
}
