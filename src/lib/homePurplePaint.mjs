/**
 * First-paint HTML for the marketing homepage.
 * Matches the live cinematic purple hero (hx-*) so React takeover never
 * flashes the legacy dark home-hero design.
 */

import { HOME_FAQ, HOME_FAQ_TITLE } from "./homeFaq.mjs";
import { STORY } from "./homepageStory.mjs";
import { marketingLocaleMeta } from "./localePathCore.mjs";
import { marketingNav } from "./marketingNav.mjs";

/** Cinematic hero copy — same strings as HomeExperienceSections Hero. */
export const HX_HERO_COPY = {
  en: {
    lineOne: "BizUply — Everything your business needs.",
    lineTwo: "One platform.",
    lead1:
      "Customer and lead management, CRM, campaigns, WhatsApp, automations, appointments, websites, and business tools — one workspace that connects the people, the data, and the work.",
    lead2: "",
    start: "Start with BizUply",
    see: "Explore the platform",
    note: "Fewer separate systems. More order, more control, and more time for customers.",
    stageAlt: "Northwind Studio lead list inside BizUply",
    login: "Login",
    cta: "Get Started",
    navAria: "Main navigation",
  },
  he: {
    lineOne: "BizUply — כל מה שהעסק שלך צריך.",
    lineTwo: "בפלטפורמה אחת.",
    lead1:
      "ניהול לקוחות ולידים, CRM, קמפיינים, WhatsApp, אוטומציות, פגישות, אתרים וכלים עסקיים מתקדמים — בסביבת עבודה אחת שמחברת בין האנשים, הנתונים והתהליכים בעסק.",
    lead2: "",
    start: "התחילו עם BizUply",
    see: "גלו את הפלטפורמה",
    note: "פחות מערכות נפרדות. יותר סדר, שליטה וזמן להתמקד בלקוחות.",
    stageAlt: "רשימת הלידים של Northwind Studio בתוך BizUply",
    login: "התחברות",
    cta: "הירשמו עכשיו",
    navAria: "ניווט ראשי",
  },
};

function escapeText(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeHtml(value) {
  return escapeText(value).replace(/'/g, "&#39;");
}

function localeHref(locale, path) {
  const prefix = locale === "pt-BR" ? "/pt-br" : locale && locale !== "en" ? `/${locale}` : "";
  if (!path || path === "/") return prefix || "/";
  return `${prefix}${path}`;
}

function heroWords(line, hotIndex = -1) {
  const words = String(line).split(" ");
  return words
    .map((word, index) => {
      const cls = index === hotIndex ? "hx-word is-hot" : "hx-word";
      const space = index < words.length - 1 ? " " : "";
      return `<span class="${cls}"><span>${escapeText(word)}</span></span>${space}`;
    })
    .join("");
}

function homeStoryHtml(locale) {
  const story = STORY[locale] || STORY.en;
  const ways = story.ways
    .map((item) => `<h3>${escapeText(item.title)}</h3><p>${escapeText(item.body)}</p>`)
    .join("");
  const films = story.films
    .map(
      (item) =>
        `<h3>${escapeText(item.title)}</h3><p>${escapeText(item.body)}</p><ul>${item.points
          .map((point) => `<li>${escapeText(point)}</li>`)
          .join("")}</ul>`,
    )
    .join("");
  const steps = story.steps
    .map(
      (item, index) =>
        `<h3>0${index + 1} ${escapeText(item.title)}</h3><p>${escapeText(item.body)}</p>`,
    )
    .join("");
  const audiences = story.audiences
    .map((item) => `<h3>${escapeText(item.title)}</h3><p>${escapeText(item.body)}</p>`)
    .join("");
  const why = story.whyCards
    .map((item) => `<h3>${escapeText(item.title)}</h3><p>${escapeText(item.body)}</p>`)
    .join("");
  return [
    `<section><h2>${escapeText(story.waysTitle)}</h2><p>${escapeText(story.waysLead)}</p>${ways}</section>`,
    `<section><h2>${escapeText(story.showTitle)}</h2><p>${escapeText(story.showLead)}</p>${films}</section>`,
    `<section><h2>${escapeText(story.journeyTitle)}</h2><p>${escapeText(story.journeyLead)}</p>${steps}</section>`,
    `<section><h2>${escapeText(story.audienceTitle)}</h2><p>${escapeText(story.audienceLead)}</p>${audiences}</section>`,
    `<section><h2>${escapeText(story.whyTitle)}</h2><p>${escapeText(story.whyLead)}</p>${why}</section>`,
    `<section><h2>${escapeText(story.finalTitle)}</h2><p>${escapeText(story.finalLead)}</p></section>`,
  ].join("");
}

function faqBodyHtml(items) {
  return (items || [])
    .map(([question, answer]) => `<h3>${escapeText(question)}</h3><p>${escapeText(answer)}</p>`)
    .join("");
}

/**
 * @param {string} locale
 * @returns {{ lang: string, dir: string, inner: string, headline: string }}
 */
export function renderPurpleHomePrerender(locale) {
  const meta = marketingLocaleMeta(locale);
  const hx = locale === "he" ? HX_HERO_COPY.he : HX_HERO_COPY.en;
  const logoAlt = locale === "he" ? "ביזאפלי (BizUply)" : "BizUply";
  const navLocale =
    locale === "he" || locale === "es" || locale === "pt-BR" || locale === "ar" ? locale : "en";
  const href = (path) => localeHref(navLocale, path);
  const nav = marketingNav(navLocale)
    .map((group) =>
      group.links
        ? `<span class="site-header__link site-nav__button">${escapeText(group.label)}</span>`
        : `<a class="site-header__link" href="${escapeHtml(href(group.to))}">${escapeText(group.label)}</a>`,
    )
    .join("");
  const short = locale === "pt-BR" ? "PT" : String(meta.htmlLang || "en").slice(0, 2).toUpperCase();
  const faqs = HOME_FAQ[locale] || HOME_FAQ.en;
  const faqTitle = HOME_FAQ_TITLE[locale] || HOME_FAQ_TITLE.en;
  const headline = `${hx.lineOne} ${hx.lineTwo}`;

  const header = `<header class="site-header"><nav class="site-header__bar" aria-label="${escapeText(
    hx.navAria,
  )}"><a class="site-header__logo" href="${escapeHtml(href("/"))}"><img src="/logo-mark.svg" alt="${escapeHtml(
    logoAlt,
  )}" width="176" height="52" fetchpriority="low" decoding="async"></a><div class="site-header__nav">${nav}</div><div class="site-header__actions"><span class="site-header__icon-btn">${escapeText(
    short,
  )}</span><a class="site-header__signin" href="${escapeHtml(href("/login"))}">${escapeText(
    hx.login,
  )}</a><a class="site-header__cta" href="${escapeHtml(href("/pricing"))}">${escapeText(
    hx.cta,
  )}</a></div><div class="site-header__mobile"><span class="site-header__icon-btn">${escapeText(
    short,
  )}</span><a class="site-header__icon-btn" href="${escapeHtml(href("/login"))}" aria-label="${escapeText(
    hx.login,
  )}"></a><span class="site-header__burger" aria-hidden="true"><span></span><span></span><span></span></span></div></nav></header>`;

  const hero = `<section class="hx-hero" data-hx-first-paint="true" aria-labelledby="hx-hero-title"><div class="hx-hero-pin"><div class="hx-geo hx-geo-a" aria-hidden="true"></div><div class="hx-geo hx-geo-c" aria-hidden="true"></div><div class="hx-hero-copy"><p class="hx-kicker">BizUply</p><h1 class="hx-display" id="hx-hero-title"><span class="hx-line">${heroWords(
    hx.lineOne,
  )}</span><span class="hx-line">${heroWords(
    hx.lineTwo,
    1,
  )}</span></h1><p class="hx-lead">${escapeText(hx.lead1)}</p>${
    hx.lead2 ? `<p class="hx-lead">${escapeText(hx.lead2)}</p>` : ""
  }<div class="hx-actions"><a class="hx-btn" href="${escapeHtml(href("/register"))}"><span>${escapeText(
    hx.start,
  )}</span><i aria-hidden="true"></i></a><a class="hx-btn hx-btn-line" href="${escapeHtml(href("/platform"))}"><span>${escapeText(
    hx.see,
  )}</span><i aria-hidden="true"></i></a></div><p class="hx-note">${escapeText(
    hx.note,
  )}</p></div><div class="hx-hero-frame"><img class="hx-hero-shot hx-hero-shot-1" src="/demo-media/home/crm.jpg" alt="${escapeHtml(
    hx.stageAlt,
  )}" width="1600" height="1000" fetchpriority="high" decoding="async"></div></div></section>`;

  const crawl = `<div class="home-crawl">${homeStoryHtml(locale)}<section><h2>${escapeText(
    faqTitle,
  )}</h2><p>${escapeText((STORY[locale] || STORY.en).faqLead)}</p>${faqBodyHtml(faqs)}</section></div>`;

  return {
    lang: meta.htmlLang,
    dir: meta.dir,
    headline,
    inner: `<main class="home-shell hx-paint" lang="${meta.htmlLang}" dir="${meta.dir}" data-home-design="purple">${header}<div class="hx-page" data-hx-shell="true" dir="${meta.dir}">${hero}${crawl}</div></main>`,
  };
}
