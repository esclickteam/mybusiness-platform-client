/**
 * Public locale prefixes for the Bizuply marketing host.
 * English keeps the existing URLs. Other languages use a prefix:
 * /he/  /es/  /pt-br/  /ar/
 */

import { getHebrewMarketingPage } from "./hebrewMarketing.mjs";
import { getLocaleMarketingPage } from "./localeMarketing.mjs";
import { GUIDE_SLUGS } from "./guidesMarketing.mjs";

export const MARKETING_LOCALE_PREFIXES = [
  { url: "pt-br", locale: "pt-BR", dir: "ltr", htmlLang: "pt-BR", og: "pt_BR" },
  { url: "he", locale: "he", dir: "rtl", htmlLang: "he", og: "he_IL" },
  { url: "es", locale: "es", dir: "ltr", htmlLang: "es", og: "es_ES" },
  { url: "ar", locale: "ar", dir: "rtl", htmlLang: "ar", og: "ar" },
];

export function marketingLocaleMeta(locale) {
  return MARKETING_LOCALE_PREFIXES.find((entry) => entry.locale === locale) || {
    url: "",
    locale: "en",
    dir: "ltr",
    htmlLang: "en",
    og: "en_US",
  };
}

export function splitMarketingLocale(pathname) {
  const clean = String(pathname || "/").split(/[?#]/)[0] || "/";
  const path = clean.length > 1 && clean.endsWith("/") ? clean.slice(0, -1) : clean;
  for (const entry of MARKETING_LOCALE_PREFIXES) {
    const prefix = `/${entry.url}`;
    if (path === prefix || path.startsWith(`${prefix}/`)) {
      const rest = path.slice(prefix.length) || "/";
      return { locale: entry.locale, path: rest.startsWith("/") ? rest : `/${rest}` };
    }
  }
  return { locale: "en", path: path || "/" };
}

export function localeUrlPrefix(locale) {
  const found = MARKETING_LOCALE_PREFIXES.find((entry) => entry.locale === locale);
  return found ? `/${found.url}` : "";
}

export function withMarketingLocale(path, locale) {
  const { path: bare } = splitMarketingLocale(path);
  const prefix = localeUrlPrefix(locale);
  if (!prefix) return bare || "/";
  return bare === "/" ? `${prefix}/` : `${prefix}${bare}`;
}

export function marketingLocaleBasename(pathname) {
  return localeUrlPrefix(splitMarketingLocale(pathname).locale);
}

export function hebrewPublicUrl(path) {
  return path === "/" ? "https://bizuply.com/he/" : `https://bizuply.com/he${path}`;
}

export function normalizeMarketingLocale(locale) {
  const raw = String(locale || "en").toLowerCase();
  if (raw.startsWith("pt")) return "pt-BR";
  if (raw.startsWith("he")) return "he";
  if (raw.startsWith("es")) return "es";
  if (raw.startsWith("ar")) return "ar";
  return "en";
}

export function marketingPublicUrl(path, locale = "en") {
  const language = normalizeMarketingLocale(locale);
  const { path: bare } = splitMarketingLocale(path);
  if (bare === "/whatsapp-api" && language === "en") {
    return "https://whatsapp.bizuply.com/";
  }
  const prefix = localeUrlPrefix(language);
  if (!prefix) return bare === "/" ? "https://bizuply.com/" : `https://bizuply.com${bare}`;
  return bare === "/" ? `https://bizuply.com${prefix}/` : `https://bizuply.com${prefix}${bare}`;
}

export function hasLocalizedMarketingPage(path, locale) {
  const language = normalizeMarketingLocale(locale);
  if (path.startsWith("/guides/")) {
    const slug = path.slice("/guides/".length);
    return GUIDE_SLUGS.includes(slug);
  }
  if (language === "en") return path !== "/whatsapp-api";
  if (language === "he") return Boolean(getHebrewMarketingPage(path));
  return Boolean(getLocaleMarketingPage(path, language));
}

export function hreflangTags(path) {
  if (path === "/whatsapp-api") {
    const tags = [
      `<link rel="alternate" hreflang="en" href="https://whatsapp.bizuply.com/" />`,
      `<link rel="alternate" hreflang="x-default" href="https://whatsapp.bizuply.com/" />`,
    ];
    for (const entry of MARKETING_LOCALE_PREFIXES) {
      if (!hasLocalizedMarketingPage(path, entry.locale)) continue;
      tags.splice(1, 0, `<link rel="alternate" hreflang="${entry.htmlLang}" href="${marketingPublicUrl(path, entry.locale)}" />`);
    }
    return tags.join("\n");
  }
  const english = path === "/" ? "https://bizuply.com/" : `https://bizuply.com${path}`;
  const tags = [
    `<link rel="alternate" hreflang="en" href="${english}" />`,
    `<link rel="alternate" hreflang="x-default" href="${english}" />`,
  ];
  for (const entry of MARKETING_LOCALE_PREFIXES) {
    if (!hasLocalizedMarketingPage(path, entry.locale)) continue;
    tags.splice(1, 0, `<link rel="alternate" hreflang="${entry.htmlLang}" href="${marketingPublicUrl(path, entry.locale)}" />`);
  }
  return tags.join("\n");
}
