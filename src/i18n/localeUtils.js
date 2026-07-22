export const GEO_LANG_COOKIE = "bizuply_geo_lang";
export const MANUAL_LANG_FLAG = "bizuply_lang_manual";
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

export function markManualLanguageChoice(lng) {
  const language = normalizeLanguage(lng);
  localStorage.setItem(I18N_STORAGE_KEY, language);
  localStorage.setItem(MANUAL_LANG_FLAG, "1");
  setCookie(GEO_LANG_COOKIE, language);
  applyDocumentLocale(language);
}

export function hasManualLanguageChoice() {
  return localStorage.getItem(MANUAL_LANG_FLAG) === "1";
}

export async function fetchGeoLanguage() {
  try {
    const response = await fetch("/api/geo", {
      credentials: "same-origin",
      headers: { accept: "application/json" },
    });

    if (!response.ok) return null;

    const data = await response.json();
    const language = normalizeLanguage(data?.language || languageFromCountry(data?.country));

    if (language === "he" || language === "en") {
      // Never overwrite an explicit user language choice with geo.
      if (!hasManualLanguageChoice()) {
        setCookie(GEO_LANG_COOKIE, language);
      }
      return language;
    }
  } catch {
    // Ignore network failures — fall back to cookie/navigator.
  }

  return null;
}
