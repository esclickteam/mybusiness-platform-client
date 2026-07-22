import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import he from "./locales/he.json";
import fr from "./locales/fr.json";
import de from "./locales/de.json";
import es from "./locales/es.json";
import nl from "./locales/nl.json";
import it from "./locales/it.json";
import {
  GEO_LANG_COOKIE,
  applyDocumentLocale,
  clearLegacyManualLanguageChoice,
  detectLanguageFromTimezone,
  fetchGeoLanguage,
  getCookie,
  getSessionLanguageOverride,
  hasSessionLanguageOverride,
  normalizeLanguage,
} from "./localeUtils";

const supportedLanguages = ["en", "he", "fr", "de", "es", "nl", "it"];

clearLegacyManualLanguageChoice();

const sessionPreferenceDetector = {
  name: "sessionPreference",
  lookup() {
    return getSessionLanguageOverride() || undefined;
  },
};

const geoCountryDetector = {
  name: "geoCountry",
  lookup() {
    if (hasSessionLanguageOverride()) return undefined;

    const cookieLang = normalizeLanguage(getCookie(GEO_LANG_COOKIE) || "");
    if (cookieLang === "he" || cookieLang === "en") {
      return cookieLang;
    }

    return detectLanguageFromTimezone();
  },
};

const languageDetector = new LanguageDetector();
languageDetector.addDetector(sessionPreferenceDetector);
languageDetector.addDetector(geoCountryDetector);

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      he: { translation: he },
      fr: { translation: fr },
      de: { translation: de },
      es: { translation: es },
      nl: { translation: nl },
      it: { translation: it },
    },

    fallbackLng: "en",
    supportedLngs: supportedLanguages,

    interpolation: {
      escapeValue: false,
    },

    detection: {
      // Session override (current tab) → geo/timezone (IL=he, else=en).
      order: ["sessionPreference", "geoCountry"],
      caches: [],
    },

    load: "languageOnly",
    cleanCode: true,
  });

i18n.on("languageChanged", (lng) => {
  applyDocumentLocale(lng);
});

applyDocumentLocale(i18n.language);

async function syncLanguageFromGeo() {
  if (typeof window === "undefined") return;

  // Keep an explicit choice only for this browser session/tab.
  if (hasSessionLanguageOverride()) return;

  const geoLanguage = await fetchGeoLanguage();
  if (!geoLanguage) return;

  const current = normalizeLanguage(i18n.language);
  if (current !== geoLanguage) {
    await i18n.changeLanguage(geoLanguage);
  } else {
    applyDocumentLocale(geoLanguage);
  }
}

syncLanguageFromGeo();

export default i18n;
