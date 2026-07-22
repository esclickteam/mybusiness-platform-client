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
  I18N_STORAGE_KEY,
  applyDocumentLocale,
  fetchGeoLanguage,
  getCookie,
  hasManualLanguageChoice,
  normalizeLanguage,
} from "./localeUtils";

const supportedLanguages = ["en", "he", "fr", "de", "es", "nl", "it"];

const manualPreferenceDetector = {
  name: "manualPreference",
  lookup() {
    if (!hasManualLanguageChoice()) return undefined;
    const stored = normalizeLanguage(localStorage.getItem(I18N_STORAGE_KEY) || "");
    return supportedLanguages.includes(stored) ? stored : undefined;
  },
};

const geoCountryDetector = {
  name: "geoCountry",
  lookup() {
    if (hasManualLanguageChoice()) return undefined;

    const cookieLang = normalizeLanguage(getCookie(GEO_LANG_COOKIE) || "");
    if (cookieLang === "he" || cookieLang === "en") {
      return cookieLang;
    }

    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timeZone === "Asia/Jerusalem") return "he";
    } catch {
      // Ignore timezone lookup failures.
    }

    // Location-first product default: English outside Israel.
    return "en";
  },
};

const languageDetector = new LanguageDetector();
languageDetector.addDetector(manualPreferenceDetector);
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
      // Explicit user choice → geo/timezone (IL=he, else=en).
      order: ["manualPreference", "geoCountry"],
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
  if (hasManualLanguageChoice()) return;

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
