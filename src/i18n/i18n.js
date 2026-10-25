import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import clubEn from "./locales/club/en.json";
import clubHe from "./locales/club/he.json";
import clubEs from "./locales/club/es.json";
import clubPtBR from "./locales/club/pt-BR.json";
import clubAr from "./locales/club/ar.json";
import { saasMarketCopy } from "./saasMarketplace";
import { withWhatsappPerformance } from "./whatsappPerformanceCopy";
import { withMetaCostCopy } from "./metaCostCopy";
import {
  FALLBACK_LANGUAGE,
  applyDocumentLocale,
  applyLanguageFromUrl,
  getManualLanguageChoice,
  resolvePreferredLanguage,
} from "./localeUtils";
import { splitMarketingLocale } from "../lib/localePath.mjs";
import { isBizuplyTravelHost } from "../lib/travelHost.mjs";
import { isBizuplyWhatsAppHost } from "../lib/whatsappHost.mjs";
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

    if (
      typeof window !== "undefined" &&
      isBizuplyWhatsAppHost(window.location.hostname)
    ) {
      return getManualLanguageChoice() || "en";
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

const CLUB = { en: clubEn, he: clubHe, es: clubEs, "pt-BR": clubPtBR, ar: clubAr };
const loadedLocales = new Set();

function bootLanguage() {
  if (typeof window === "undefined") return FALLBACK_LANGUAGE;
  const demoLocale = readGuidedDemoLocaleLock();
  if (demoLocale) return demoLocale;
  const fromUrl = applyLanguageFromUrl();
  if (fromUrl) return fromUrl;
  const path = splitMarketingLocale(window.location.pathname).path;
  const appRoute = /^\/(business|admin|staff|client|partner|login|register|dashboard|embed)\b/.test(path);
  if (!appRoute) return FALLBACK_LANGUAGE;
  return resolvePreferredLanguage({ allowGeo: true, allowBrowser: true });
}

async function importLocale(code) {
  switch (code) {
    case "he":
      return (await import("./locales/he.json")).default;
    case "es":
      return (await import("./locales/es.json")).default;
    case "pt-BR":
      return (await import("./locales/pt-BR.json")).default;
    case "ar":
      return (await import("./locales/ar.json")).default;
    default:
      return (await import("./locales/en.json")).default;
  }
}

function packLocale(code, messages) {
  return withMetaCostCopy(
    withWhatsappPerformance(
      { ...messages, club: CLUB[code] || clubEn, saasMarket: saasMarketCopy[code] || saasMarketCopy.en },
      code
    ),
    code
  );
}

export async function ensureLocale(code) {
  const language = CLUB[code] ? code : FALLBACK_LANGUAGE;
  if (loadedLocales.has(language)) return language;
  const messages = await importLocale(language);
  i18n.addResourceBundle(language, "translation", packLocale(language, messages), true, true);
  loadedLocales.add(language);
  return language;
}

const initialLanguage = bootLanguage();

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {},
    lng: initialLanguage,

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

export async function bootstrapI18n() {
  const codes = import.meta.env.MODE === "test"
    ? ["en", "he", "es", "pt-BR", "ar"]
    : [initialLanguage];
  await Promise.all(codes.map((code) => ensureLocale(code)));
  if (i18n.language !== initialLanguage) await i18n.changeLanguage(initialLanguage);
}

export const i18nReady = bootstrapI18n();

export default i18n;
