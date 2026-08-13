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
  DEFAULT_LANGUAGE,
  getManualLanguageChoice,
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

    return DEFAULT_LANGUAGE;
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

    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: supportedLanguages,

    interpolation: {
      escapeValue: false,
    },

    detection: {
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

export default i18n;
