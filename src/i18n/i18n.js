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
  applyDocumentLocale,
  applyLanguageFromUrl,
  detectLanguageFromBrowserSignals,
  fetchGeoLanguage,
  getManualLanguageChoice,
  hasManualLanguageChoice,
  normalizeLanguage,
} from "./localeUtils";

const supportedLanguages = ["en", "he", "fr", "de", "es", "nl", "it"];

const browserGeoDetector = {
  name: "browserGeo",
  lookup() {
    const fromUrl = applyLanguageFromUrl();
    if (fromUrl) return fromUrl;

    // An explicit user choice always wins, even across reloads.
    const manual = getManualLanguageChoice();
    if (manual && supportedLanguages.includes(manual)) return manual;

    const detected = normalizeLanguage(detectLanguageFromBrowserSignals());
    return detected === "he" || detected === "en" ? detected : "en";
  },
};

const languageDetector = new LanguageDetector();
languageDetector.addDetector(browserGeoDetector);

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
      // Location/browser signals first. Geo API sync confirms right after boot.
      order: ["browserGeo"],
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

  // URL ?lang=en is an explicit review/test choice — never override it with geo.
  if (applyLanguageFromUrl() || hasManualLanguageChoice()) {
    applyDocumentLocale(i18n.language);
    return;
  }

  // First-time visitors (no explicit choice): detect from location (IL → he, else → en).
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
