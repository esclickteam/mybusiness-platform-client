import {
  FALLBACK_LANGUAGE,
  GEO_LANG_COOKIE,
  I18N_STORAGE_KEY,
  LANGUAGE_COOKIE,
  MANUAL_LANG_FLAG,
  SESSION_LANG_KEY,
  SUPPORTED_LANGUAGES,
  coerceSupportedLanguage,
  detectLanguageFromNavigator,
  getHtmlLang,
  getIntlLocale,
  getTextDirection,
  isHebrewLanguage,
  isRtlLanguage,
  isSupportedLanguage,
  languageFromBrowserLocale,
  languageFromCountry,
  normalizeLanguage,
} from "./languages";

export {
  FALLBACK_LANGUAGE,
  GEO_LANG_COOKIE,
  I18N_STORAGE_KEY,
  LANGUAGE_COOKIE,
  MANUAL_LANG_FLAG,
  SESSION_LANG_KEY,
  SUPPORTED_LANGUAGES,
  coerceSupportedLanguage,
  detectLanguageFromNavigator,
  getHtmlLang,
  getIntlLocale,
  getTextDirection,
  isHebrewLanguage,
  isRtlLanguage,
  isSupportedLanguage,
  languageFromBrowserLocale,
  languageFromCountry,
  normalizeLanguage,
};

/** Product fallback when no preference, geo, or browser locale can be resolved. */
export const DEFAULT_LANGUAGE = FALLBACK_LANGUAGE;

export function getCookie(name) {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`)
  );

  return match ? decodeURIComponent(match[1]) : null;
}

export function setCookie(name, value, days = 365) {
  if (typeof document === "undefined") return;

  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

export function applyDocumentLocale(lng) {
  if (typeof document === "undefined") return;

  const language = coerceSupportedLanguage(lng);
  const htmlLang = getHtmlLang(language);
  const dir = getTextDirection(language);

  document.documentElement.lang = htmlLang;
  document.documentElement.dir = dir;
  document.documentElement.setAttribute("lang", htmlLang);
  document.documentElement.setAttribute("dir", dir);
  if (document.body) {
    document.body.setAttribute("dir", dir);
  }
}

/**
 * Language keys must never be treated as auth/session data.
 * Logout, token revoke, and session invalidation must not call this.
 */
export function clearStoredLanguageOverrides() {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(MANUAL_LANG_FLAG);
    localStorage.removeItem(I18N_STORAGE_KEY);
  }
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.removeItem(SESSION_LANG_KEY);
  }
  if (typeof document !== "undefined") {
    document.cookie = `${LANGUAGE_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
  }
}

/** @deprecated Intentionally unused by logout. Kept for tests/admin tools. */
export function clearLegacyManualLanguageChoice() {
  clearStoredLanguageOverrides();
}

function writeLocalLanguage(language) {
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem(SESSION_LANG_KEY, language);
  }
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(I18N_STORAGE_KEY, language);
    localStorage.setItem(MANUAL_LANG_FLAG, language);
  }
  setCookie(LANGUAGE_COOKIE, language, 365);
  applyDocumentLocale(language);
}

/**
 * Persist an explicit user language choice.
 * Stored in localStorage + a durable cookie so it survives logout, reloads,
 * and returning later. Never stored with auth tokens.
 */
export function setSessionLanguageOverride(lng) {
  const language = coerceSupportedLanguage(lng);
  writeLocalLanguage(language);
  return language;
}

export function markManualLanguageChoice(lng) {
  return setSessionLanguageOverride(lng);
}

function readStoredLanguage(raw) {
  return normalizeLanguage(raw, { fallback: null });
}

/** Read the durable, user-selected language, or null if the user never chose one. */
export function getManualLanguageChoice() {
  const fromStorage =
    typeof localStorage !== "undefined"
      ? readStoredLanguage(localStorage.getItem(MANUAL_LANG_FLAG))
      : null;
  if (fromStorage) return fromStorage;

  const fromCookie = readStoredLanguage(getCookie(LANGUAGE_COOKIE));
  if (fromCookie) return fromCookie;

  return null;
}

export function getSessionLanguageOverride() {
  if (typeof sessionStorage === "undefined") return null;
  return readStoredLanguage(sessionStorage.getItem(SESSION_LANG_KEY));
}

export function hasSessionLanguageOverride() {
  return Boolean(getSessionLanguageOverride());
}

export function hasManualLanguageChoice() {
  return Boolean(getManualLanguageChoice());
}

export function getGeoLanguageHint() {
  return readStoredLanguage(getCookie(GEO_LANG_COOKIE));
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

/** Read an explicit ?lang= query. Missing/invalid values return null. */
export function languageFromUrl() {
  if (typeof window === "undefined") return null;
  try {
    const raw = new URLSearchParams(window.location.search).get("lang");
    if (!raw) return null;
    return normalizeLanguage(raw, { fallback: null });
  } catch {
    return null;
  }
}

export function applyLanguageFromUrl() {
  const lang = languageFromUrl();
  if (!lang) return null;
  setSessionLanguageOverride(lang);
  return lang;
}

/**
 * Resolve UI language using the product priority:
 * 1. Account preference (caller supplies)
 * 2. Explicit local selection
 * 3. Country / geo hint
 * 4. Browser locale
 * 5. English
 *
 * URL ?lang= is treated as an explicit local selection.
 */
export function resolvePreferredLanguage({
  accountLanguage = null,
  allowGeo = true,
  allowBrowser = true,
} = {}) {
  const fromAccount = normalizeLanguage(accountLanguage, { fallback: null });
  if (fromAccount) return fromAccount;

  const fromUrl = languageFromUrl();
  if (fromUrl) return fromUrl;

  const fromManual = getManualLanguageChoice();
  if (fromManual) return fromManual;

  if (allowGeo) {
    const fromGeo = getGeoLanguageHint();
    if (fromGeo) return fromGeo;
  }

  if (allowBrowser) {
    const fromBrowser = detectLanguageFromNavigator();
    if (fromBrowser) return fromBrowser;
  }

  return FALLBACK_LANGUAGE;
}

export function detectLanguageFromBrowserSignals() {
  return resolvePreferredLanguage({ allowGeo: true, allowBrowser: true });
}

/**
 * Resolve a geo hint from /api/geo. Never overrides an explicit user choice.
 */
export async function fetchGeoLanguage() {
  if (hasManualLanguageChoice()) {
    return getManualLanguageChoice();
  }

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
        if (language) {
          setCookie(GEO_LANG_COOKIE, language);
          return language;
        }
      }

      const hinted = normalizeLanguage(data?.language, { fallback: null });
      if (hinted) {
        setCookie(GEO_LANG_COOKIE, hinted);
        return hinted;
      }
    }
  } catch {
    // Ignore network failures — fall back to browser / English.
  }

  return getGeoLanguageHint();
}

export const LANGUAGE_STORAGE_KEYS = Object.freeze([
  MANUAL_LANG_FLAG,
  I18N_STORAGE_KEY,
  SESSION_LANG_KEY,
  LANGUAGE_COOKIE,
  GEO_LANG_COOKIE,
]);
