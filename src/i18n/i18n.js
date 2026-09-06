import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import he from "./locales/he.json";
import es from "./locales/es.json";
import ptBR from "./locales/pt-BR.json";
import ar from "./locales/ar.json";
import {
  FALLBACK_LANGUAGE,
  applyDocumentLocale,
  applyLanguageFromUrl,
  fetchGeoLanguage,
  getManualLanguageChoice,
  hasManualLanguageChoice,
  resolvePreferredLanguage,
} from "./localeUtils";
import { SUPPORTED_LANGUAGES } from "./languages";

const browserGeoDetector = {
  name: "browserGeo",
  lookup() {
    const fromUrl = applyLanguageFromUrl();
    if (fromUrl) return fromUrl;

    return resolvePreferredLanguage({
      allowGeo: true,
      allowBrowser: true,
    });
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
      es: { translation: es },
      "pt-BR": { translation: ptBR },
      ar: { translation: ar },
    },

    fallbackLng: FALLBACK_LANGUAGE,
    supportedLngs: [...SUPPORTED_LANGUAGES],
    nonExplicitSupportedLngs: false,

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ["browserGeo"],
      caches: [],
    },

    // Keep pt-BR as a regional locale instead of collapsing to "pt".
    load: "currentOnly",
    cleanCode: false,
  });

i18n.on("languageChanged", (lng) => {
  applyDocumentLocale(lng);
});

applyDocumentLocale(i18n.language);

if (
  typeof window !== "undefined" &&
  import.meta.env.MODE !== "test" &&
  !hasManualLanguageChoice()
) {
  void fetchGeoLanguage().then((geoLanguage) => {
    if (!geoLanguage || hasManualLanguageChoice()) return;
    if (getManualLanguageChoice()) return;
    if (i18n.language === geoLanguage) return;
    void i18n.changeLanguage(geoLanguage);
  });
}

export default i18n;
