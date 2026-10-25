import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { applyDocumentLocale } from "../i18n/localeUtils";
import { splitMarketingLocale } from "../lib/localePathCore.mjs";

const initialLanguage = splitMarketingLocale(
  typeof window === "undefined" ? "/" : window.location.pathname,
).locale || "en";

i18n.use(initReactI18next).init({
  resources: {},
  lng: initialLanguage,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  load: "currentOnly",
  cleanCode: false,
  returnNull: false,
});

async function importMarketingLocale(code) {
  switch (code) {
    case "he":
      return (await import("../i18n/locales/marketing/he.json")).default;
    case "es":
      return (await import("../i18n/locales/marketing/es.json")).default;
    case "pt-BR":
      return (await import("../i18n/locales/marketing/pt-BR.json")).default;
    case "ar":
      return (await import("../i18n/locales/marketing/ar.json")).default;
    default:
      return (await import("../i18n/locales/marketing/en.json")).default;
  }
}

async function importFullLocale(code) {
  switch (code) {
    case "he":
      return (await import("../i18n/locales/he.json")).default;
    case "es":
      return (await import("../i18n/locales/es.json")).default;
    case "pt-BR":
      return (await import("../i18n/locales/pt-BR.json")).default;
    case "ar":
      return (await import("../i18n/locales/ar.json")).default;
    default:
      return (await import("../i18n/locales/en.json")).default;
  }
}

function scheduleFullLocale(language) {
  if (typeof window === "undefined") return;
  const run = () => {
    void importFullLocale(language).then((messages) => {
      i18n.addResourceBundle(language, "translation", messages, true, true);
      i18n.emit("languageChanged", language);
    });
  };
  const start = () => {
    if (window.requestIdleCallback) window.requestIdleCallback(run, { timeout: 5000 });
    else window.setTimeout(run, 4000);
  };
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
}

export async function bootstrapMarketingI18n() {
  const messages = await importMarketingLocale(initialLanguage);
  i18n.addResourceBundle(initialLanguage, "translation", messages, true, true);
  applyDocumentLocale(initialLanguage);
  scheduleFullLocale(initialLanguage);
}

export const marketingI18nReady = bootstrapMarketingI18n();
