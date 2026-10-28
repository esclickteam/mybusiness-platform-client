import {
  FALLBACK_LANGUAGE,
  GEO_LANG_COOKIE,
  I18N_STORAGE_KEY,
  LANGUAGE_COOKIE,
  MANUAL_LANG_FLAG,
  RESOLVED_LANG_KEY,
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
  recognizedCountryCode,
} from "./languages";
import { readGuidedDemoLocaleLock } from "../guidedDemo/sessionStore";
import { splitMarketingLocale } from "../lib/localePathCore.mjs";

export {
  FALLBACK_LANGUAGE,
  GEO_LANG_COOKIE,
  I18N_STORAGE_KEY,
  LANGUAGE_COOKIE,
  MANUAL_LANG_FLAG,
  RESOLVED_LANG_KEY,
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
  recognizedCountryCode,
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

function prefersReducedMotion() {
  try {
    return (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
    );
  } catch {
    return false;
  }
}

export function applyDocumentLocale(lng) {
  if (typeof document === "undefined") return;

  const language = coerceSupportedLanguage(lng);
  const htmlLang = getHtmlLang(language);
  const dir = getTextDirection(language);
  const previous = document.documentElement.getAttribute("lang");

  document.documentElement.lang = htmlLang;
  document.documentElement.dir = dir;
  document.documentElement.setAttribute("lang", htmlLang);
  document.documentElement.setAttribute("dir", dir);
  if (document.body) {
    document.body.setAttribute("dir", dir);
  }

  if (previous && previous !== htmlLang && !prefersReducedMotion()) {
    document.documentElement.classList.remove("locale-swap");
    void document.documentElement.offsetWidth;
    document.documentElement.classList.add("locale-swap");
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

/** Remember a language that came from the account or the business country. */
export function rememberResolvedLanguage(lng) {
  const language = normalizeLanguage(lng, { fallback: null });
  if (!language || typeof localStorage === "undefined") return null;
  localStorage.setItem(RESOLVED_LANG_KEY, language);
  return language;
}

export function getResolvedLanguage() {
  if (typeof localStorage === "undefined") return null;
  return readStoredLanguage(localStorage.getItem(RESOLVED_LANG_KEY));
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
    const fromPath = splitMarketingLocale(window.location.pathname).locale;
    if (fromPath && fromPath !== "en") return fromPath;
    const raw = new URLSearchParams(window.location.search).get("lang");
    if (!raw) return null;
    return normalizeLanguage(raw, { fallback: null });
  } catch {
    return null;
  }
}

/**
 * A non-English ?lang= (or a /he marketing path) is an explicit choice.
 * ?lang=en is not: the marketing shell used to append it on every exit,
 * so treating it as a choice locked the product in English.
 */
export function explicitLanguageFromUrl() {
  const lang = languageFromUrl();
  if (!lang || lang === FALLBACK_LANGUAGE) return null;
  return lang;
}

export function applyLanguageFromUrl() {
  const demoLocale = readGuidedDemoLocaleLock();
  if (demoLocale) return demoLocale;
  const lang = explicitLanguageFromUrl();
  if (!lang) return null;
  if (getManualLanguageChoice() !== lang) setSessionLanguageOverride(lang);
  return lang;
}

/**
 * Resolve UI language. One order for the whole product:
 * 1. Explicit non-English URL, then a stored manual choice.
 *    ?lang=en is ignored so a marketing leftover cannot override them.
 * 2. Account / business language
 * 3. Business country, when no language is stored
 * 4. Last resolved account/country language (so refresh does not flash English)
 * 5. Browser language, only when the caller is not a business session
 * 6. English
 *
 * Visitor IP geo is intentionally not a source. A person being in Israel
 * does not make the business Israeli.
 */
export function resolvePreferredLanguage({
  accountLanguage = null,
  businessCountry = null,
  hasBusiness = false,
  allowBrowser = true,
} = {}) {
  const fromUrl = explicitLanguageFromUrl();
  if (fromUrl) return fromUrl;

  const fromManual = getManualLanguageChoice();
  if (fromManual) return fromManual;

  const fromAccount = normalizeLanguage(accountLanguage, { fallback: null });
  if (fromAccount) return fromAccount;

  const countryCode = recognizedCountryCode(businessCountry);
  if (countryCode) return languageFromCountry(countryCode) || FALLBACK_LANGUAGE;

  const fromResolved = getResolvedLanguage();
  if (fromResolved) return fromResolved;

  if (allowBrowser && !hasBusiness) {
    const fromBrowser = detectLanguageFromNavigator();
    if (fromBrowser) return fromBrowser;
  }

  return FALLBACK_LANGUAGE;
}

export function detectLanguageFromBrowserSignals() {
  return resolvePreferredLanguage({ allowBrowser: true });
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
  RESOLVED_LANG_KEY,
  I18N_STORAGE_KEY,
  SESSION_LANG_KEY,
  LANGUAGE_COOKIE,
  GEO_LANG_COOKIE,
]);
