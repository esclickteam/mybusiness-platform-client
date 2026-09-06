import i18n from "./i18n";
import API from "../api";
import {
  applyDocumentLocale,
  coerceSupportedLanguage,
  getManualLanguageChoice,
  markManualLanguageChoice,
  normalizeLanguage,
} from "./localeUtils";

let persistInFlight = null;

export function applyUiLanguage(lng, { persist = false } = {}) {
  const language = coerceSupportedLanguage(lng);
  applyDocumentLocale(language);

  if (persist) {
    markManualLanguageChoice(language);
  }

  if (i18n.language !== language) {
    void i18n.changeLanguage(language);
  }

  return language;
}

export async function persistAccountLanguage(lng) {
  const language = coerceSupportedLanguage(lng);
  markManualLanguageChoice(language);
  applyDocumentLocale(language);

  const token =
    typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return language;

  if (persistInFlight === language) return language;
  persistInFlight = language;

  try {
    await API.patch("/auth/language", { language });
  } catch {
    // Local persistence already succeeded; account sync can retry next login.
  } finally {
    if (persistInFlight === language) persistInFlight = null;
  }

  return language;
}

export async function changeAppLanguage(lng) {
  const language = coerceSupportedLanguage(lng);
  markManualLanguageChoice(language);
  applyDocumentLocale(language);
  await i18n.changeLanguage(language);
  await persistAccountLanguage(language);
  return language;
}

/**
 * Login / /me sync:
 * - Account language wins.
 * - Else an explicit local selection is applied and synced into the profile.
 * - Geo/browser remain the unresolved fallback and are never written as an
 *   explicit account preference.
 */
export function syncLanguageOnLogin(user) {
  const accountLanguage = normalizeLanguage(user?.language, { fallback: null });
  if (accountLanguage) {
    markManualLanguageChoice(accountLanguage);
    applyUiLanguage(accountLanguage, { persist: true });
    return accountLanguage;
  }

  const localLanguage = getManualLanguageChoice();
  if (localLanguage) {
    applyUiLanguage(localLanguage, { persist: true });
    void persistAccountLanguage(localLanguage);
    return localLanguage;
  }

  return null;
}
