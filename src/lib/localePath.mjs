/**
 * Public locale prefixes for the Bizuply marketing host.
 * English keeps the existing URLs. Hebrew lives under /he/.
 */

import { getHebrewMarketingPage } from "./hebrewMarketing.mjs";

export function splitMarketingLocale(pathname) {
  const clean = String(pathname || "/").split(/[?#]/)[0] || "/";
  const path = clean.length > 1 && clean.endsWith("/") ? clean.slice(0, -1) : clean;
  if (path === "/he" || path.startsWith("/he/")) {
    const rest = path.replace(/^\/he(?=\/|$)/, "") || "/";
    return { locale: "he", path: rest || "/" };
  }
  return { locale: "en", path: path || "/" };
}

export function withMarketingLocale(path, locale) {
  const { path: bare } = splitMarketingLocale(path);
  if (locale === "he") return bare === "/" ? "/he/" : `/he${bare}`;
  return bare || "/";
}

export function marketingLocaleBasename(pathname) {
  return splitMarketingLocale(pathname).locale === "he" ? "/he" : "";
}

export function hebrewPublicUrl(path) {
  return path === "/" ? "https://bizuply.com/he/" : `https://bizuply.com/he${path}`;
}

export function marketingPublicUrl(path, locale) {
  const { path: bare } = splitMarketingLocale(path);
  if (String(locale || "").toLowerCase().startsWith("he")) return hebrewPublicUrl(bare);
  return bare === "/" ? "https://bizuply.com/" : `https://bizuply.com${bare}`;
}

export function hreflangTags(path) {
  if (path === "/whatsapp-api") {
    return [
      `<link rel="alternate" hreflang="en" href="https://whatsapp.bizuply.com/" />`,
      `<link rel="alternate" hreflang="he" href="https://bizuply.com/he/whatsapp-api" />`,
      `<link rel="alternate" hreflang="x-default" href="https://whatsapp.bizuply.com/" />`,
    ].join("\n");
  }
  const english = path === "/" ? "https://bizuply.com/" : `https://bizuply.com${path}`;
  const tags = [
    `<link rel="alternate" hreflang="en" href="${english}" />`,
    `<link rel="alternate" hreflang="x-default" href="${english}" />`,
  ];
  if (getHebrewMarketingPage(path)) {
    tags.splice(1, 0, `<link rel="alternate" hreflang="he" href="${hebrewPublicUrl(path)}" />`);
  }
  return tags.join("\n");
}
