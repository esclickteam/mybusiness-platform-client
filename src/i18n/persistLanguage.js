import i18n, { ensureLocale } from "./i18n";
import API from "../api";
import {
  applyDocumentLocale,
  coerceSupportedLanguage,
  getManualLanguageChoice,
  getResolvedLanguage,
  markManualLanguageChoice,
  normalizeLanguage,
  recognizedCountryCode,
  rememberResolvedLanguage,
  languageFromCountry,
  FALLBACK_LANGUAGE,
} from "./localeUtils";
import { readGuidedDemoLocaleLock } from "../guidedDemo/sessionStore";

let persistInFlight = null;

export function applyUiLanguage(lng, { persist = false } = {}) {
  const demoLocale = readGuidedDemoLocaleLock();
  const language = demoLocale || coerceSupportedLanguage(lng);
  applyDocumentLocale(language);

  if (persist && !demoLocale) {
    markManualLanguageChoice(language);
  }

  if (i18n.language !== language) {
    void ensureLocale(language).then(() => i18n.changeLanguage(language));
  }

  return language;
}

export async function persistAccountLanguage(lng) {
  const demoLocale = readGuidedDemoLocaleLock();
  if (demoLocale) return demoLocale;
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
  const demoLocale = readGuidedDemoLocaleLock();
  if (demoLocale) {
    applyUiLanguage(demoLocale);
    return demoLocale;
  }
  const language = coerceSupportedLanguage(lng);
  markManualLanguageChoice(language);
  applyDocumentLocale(language);
  await ensureLocale(language);
  await i18n.changeLanguage(language);
  await persistAccountLanguage(language);
  return language;
}

/**
 * Login / /me sync. Manual choice always wins and is never replaced.
 * Otherwise: account language, then business country, then English for a
 * business that has neither. Visitors with no business keep the language
 * already chosen at boot (browser, then English). Nothing here is inferred
 * from the visitor's own country.
 */
export function syncLanguageOnLogin(user) {
  const demoLocale = readGuidedDemoLocaleLock();
  if (demoLocale) {
    applyUiLanguage(demoLocale);
    return demoLocale;
  }

  const localLanguage = getManualLanguageChoice();
  if (localLanguage) {
    rememberResolvedLanguage(localLanguage);
    applyUiLanguage(localLanguage, { persist: true });
    void persistAccountLanguage(localLanguage);
    return localLanguage;
  }

  const accountLanguage = normalizeLanguage(user?.language, { fallback: null });
  if (accountLanguage) {
    const current = normalizeLanguage(
      typeof document !== "undefined" ? document.documentElement.lang : "",
      { fallback: null },
    );
    // An unset account defaults to English on the server. That default must
    // not replace a language already chosen from the browser or the URL.
    if (
      accountLanguage === FALLBACK_LANGUAGE &&
      current &&
      current !== FALLBACK_LANGUAGE
    ) {
      rememberResolvedLanguage(current);
      return current;
    }
    rememberResolvedLanguage(accountLanguage);
    applyUiLanguage(accountLanguage);
    return accountLanguage;
  }

  const businessCountry = user?.billingCountry || user?.businessCountry || user?.country;
  if (recognizedCountryCode(businessCountry)) {
    const fromCountry = languageFromCountry(businessCountry) || FALLBACK_LANGUAGE;
    rememberResolvedLanguage(fromCountry);
    applyUiLanguage(fromCountry);
    return fromCountry;
  }

  const role = String(user?.role || "").toLowerCase();
  const hasBusiness = Boolean(user?.businessId) || role === "business" || role === "worker" || role === "manager";
  if (hasBusiness) {
    const cached = getResolvedLanguage();
    const current = normalizeLanguage(
      typeof document !== "undefined" ? document.documentElement.lang : "",
      { fallback: null },
    );
    const language = cached || current || FALLBACK_LANGUAGE;
    rememberResolvedLanguage(language);
    applyUiLanguage(language);
    return language;
  }

  return null;
}
