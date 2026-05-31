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

const supportedLanguages = ["en", "he", "fr", "de", "es", "nl", "it"];

i18n
  .use(LanguageDetector)
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
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },

    load: "languageOnly",
    cleanCode: true,
  });

i18n.on("languageChanged", (lng) => {
  const language = lng?.split("-")?.[0] || "en";

  document.documentElement.lang = language;
  document.documentElement.dir = language === "he" ? "rtl" : "ltr";
});

const currentLanguage = i18n.language?.split("-")?.[0] || "en";
document.documentElement.lang = currentLanguage;
document.documentElement.dir = currentLanguage === "he" ? "rtl" : "ltr";

export default i18n;