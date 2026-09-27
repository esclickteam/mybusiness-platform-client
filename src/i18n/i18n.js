import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import he from "./locales/he.json";
import es from "./locales/es.json";
import ptBR from "./locales/pt-BR.json";
import ar from "./locales/ar.json";
import clubEn from "./locales/club/en.json";
import clubHe from "./locales/club/he.json";
import clubEs from "./locales/club/es.json";
import clubPtBR from "./locales/club/pt-BR.json";
import clubAr from "./locales/club/ar.json";
import {
  FALLBACK_LANGUAGE,
  applyDocumentLocale,
  applyLanguageFromUrl,
  fetchGeoLanguage,
  getManualLanguageChoice,
  hasManualLanguageChoice,
  resolvePreferredLanguage,
} from "./localeUtils";
import { isBizuplyTravelHost } from "../lib/travelHost.mjs";
import { SUPPORTED_LANGUAGES } from "./languages";
import { readGuidedDemoLocaleLock } from "../guidedDemo/sessionStore";

const browserGeoDetector = {
  name: "browserGeo",
  lookup() {
    const demoLocale = readGuidedDemoLocaleLock();
    if (demoLocale) return demoLocale;

    if (
      typeof window !== "undefined" &&
      isBizuplyTravelHost(window.location.hostname)
    ) {
      return "en";
    }

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
      en: { translation: { ...en, club: clubEn } },
      he: { translation: { ...he, club: clubHe } },
      es: { translation: { ...es, club: clubEs } },
      "pt-BR": { translation: { ...ptBR, club: clubPtBR } },
      ar: { translation: { ...ar, club: clubAr } },
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

    // Guided-demo QA: surface missing keys instead of silently looking like English.
    missingKeyHandler: (lngs, _ns, key) => {
      if (typeof window === "undefined") return;
      try {
        if (sessionStorage.getItem("guidedDemo.active") !== "1") return;
      } catch {
        return;
      }
      const lng = Array.isArray(lngs) ? lngs[0] : lngs;
      if (!lng || String(lng).startsWith("en")) return;
      // eslint-disable-next-line no-console
      console.warn(`[guided-demo-i18n] missing key ${key} for locale ${lng}`);
    },
  });

i18n.on("languageChanged", (lng) => {
  const demoLocale = readGuidedDemoLocaleLock();
  if (demoLocale && lng !== demoLocale) {
    // eslint-disable-next-line no-console
    console.warn(`[guided-demo-i18n] blocked language change ${lng} → demo locale ${demoLocale}`);
    void i18n.changeLanguage(demoLocale);
    return;
  }
  applyDocumentLocale(lng);
});

{
  const demoLocale = readGuidedDemoLocaleLock();
  if (demoLocale && i18n.language !== demoLocale) void i18n.changeLanguage(demoLocale);
  else applyDocumentLocale(i18n.language);
}

if (
  typeof window !== "undefined" &&
  import.meta.env.MODE !== "test" &&
  !hasManualLanguageChoice() &&
  !readGuidedDemoLocaleLock() &&
  !isBizuplyTravelHost(window.location.hostname)
) {
  void fetchGeoLanguage().then((geoLanguage) => {
    if (!geoLanguage || hasManualLanguageChoice() || readGuidedDemoLocaleLock()) return;
    if (getManualLanguageChoice()) return;
    if (i18n.language === geoLanguage) return;
    void i18n.changeLanguage(geoLanguage);
  });
}

export default i18n;
