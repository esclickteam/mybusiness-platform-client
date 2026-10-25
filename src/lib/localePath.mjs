/**
 * Public locale prefixes for the Bizuply marketing host.
 * English keeps the existing URLs. Other languages use a prefix:
 * /he/  /es/  /pt-br/  /ar/
 */

import { getHebrewMarketingPage } from "./hebrewMarketing.mjs";
import { getLocaleMarketingPage } from "./localeMarketing.mjs";
import { GUIDE_SLUGS } from "./guidesMarketing.mjs";
import { getActivityPage } from "./activityPages.mjs";

export {
  MARKETING_LOCALE_PREFIXES,
  hebrewPublicUrl,
  localeUrlPrefix,
  marketingLocaleBasename,
  marketingLocaleMeta,
  marketingPublicUrl,
  normalizeMarketingLocale,
  splitMarketingLocale,
  withMarketingLocale,
} from "./localePathCore.mjs";
import {
  MARKETING_LOCALE_PREFIXES,
  marketingPublicUrl,
  normalizeMarketingLocale,
} from "./localePathCore.mjs";

export function hasLocalizedMarketingPage(path, locale) {
  const language = normalizeMarketingLocale(locale);
  if (path.startsWith("/guides/")) {
    const slug = path.slice("/guides/".length);
    return GUIDE_SLUGS.includes(slug);
  }
  if (getActivityPage(path, language)) return true;
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
