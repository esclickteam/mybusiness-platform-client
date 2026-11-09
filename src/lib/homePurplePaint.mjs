/**
 * First-paint HTML for the marketing homepage.
 * Matches the live sketch hero (hx-*, white canvas) so React takeover never
 * flashes the legacy dark home-hero design.
 */

import { HX_HERO_LOCALES } from "./homeCinematic.mjs";
import { HOME_FAQ, HOME_FAQ_TITLE } from "./homeFaq.mjs";
import { STORY } from "./homepageStory.mjs";
import { marketingLocaleMeta } from "./localePathCore.mjs";
import { marketingNav } from "./marketingNav.mjs";

/** Cinematic hero copy — same strings as HomeExperienceSections Hero. */
export const HX_HERO_COPY = HX_HERO_LOCALES;

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

const GLOBE = `<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"></path></svg>`;

/** Logged-out marketing header. Same structure the React header paints, so hydration does not swap in a different bar. */
export function renderMarketingHeader(locale) {
  const meta = marketingLocaleMeta(locale);
  const hx = HX_HERO_COPY[locale] || HX_HERO_COPY.en;
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
  return `<header class="site-header" dir="${meta.dir}"><nav class="site-header__bar" aria-label="${escapeText(
    hx.navAria,
  )}"><a class="site-header__logo" href="${escapeHtml(href("/"))}"><img src="/logo-mark.svg" alt="${escapeHtml(
    logoAlt,
  )}" width="176" height="52" fetchpriority="low" decoding="async"></a><div class="site-header__nav">${nav}</div><div class="site-header__end"><span class="site-header__icon-btn"><span class="site-header__lang-code">${escapeText(
    short,
  )}</span>${GLOBE}</span><div class="site-header__actions"><a class="site-header__signin" href="${escapeHtml(
    href("/login"),
  )}">${escapeText(hx.login)}</a><a class="site-header__cta" href="${escapeHtml(href("/pricing"))}">${escapeText(
    hx.cta,
  )}</a></div><div class="site-header__mobile"><span class="site-header__burger" aria-hidden="true"><span></span><span></span><span></span></span></div></div></nav></header>`;
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
  const hx = HX_HERO_COPY[locale] || HX_HERO_COPY.en;
  const lineTwoHot = Math.max(0, String(hx.lineTwo).trim().split(/\s+/).length - 1);
  const faqs = HOME_FAQ[locale] || HOME_FAQ.en;
  const faqTitle = HOME_FAQ_TITLE[locale] || HOME_FAQ_TITLE.en;
  const headline = `${hx.lineOne} ${hx.lineTwo}`;

  const header = renderMarketingHeader(locale);
  const href = (path) => localeHref(locale === "pt-BR" || locale === "he" || locale === "es" || locale === "ar" ? locale : "en", path);

  const heroLead2 = hx.lead2
    ? `<p class="hx-lead">${escapeText(hx.lead2)}</p>`
    : "";
  const heroNote = hx.note ? `<p class="hx-note">${escapeText(hx.note)}</p>` : "";
  const kicker = hx.kicker
    ? `<p class="hx-hero-kicker">${escapeText(hx.kicker)}</p>`
    : `<p class="hx-hero-brand">BizUply</p>`;
  const hero = `<section class="hx-hero" data-hx-first-paint="true" aria-labelledby="hx-hero-title"><div class="hx-hero-pin"><div class="hx-geo hx-geo-a" aria-hidden="true"></div><div class="hx-geo hx-geo-b" aria-hidden="true"></div><div class="hx-geo hx-geo-c" aria-hidden="true"></div><div class="hx-hero-copy">${kicker}<h1 class="hx-display" id="hx-hero-title"><span class="hx-line">${heroWords(
    hx.lineOne,
  )}</span><span class="hx-line">${heroWords(
    hx.lineTwo,
    lineTwoHot,
  )}</span></h1><p class="hx-lead">${escapeText(hx.lead1)}</p>${heroLead2}<div class="hx-actions"><a class="hx-btn" href="${escapeHtml(href("/register"))}"><span>${escapeText(
    hx.start,
  )}</span><i aria-hidden="true"></i></a><a class="hx-btn hx-btn-line" href="${escapeHtml(href("/contact"))}"><span>${escapeText(
    hx.see,
  )}</span><i aria-hidden="true"></i></a></div>${heroNote}</div><div class="hx-hero-stage"><div class="hx-hero-stage-inner"><img class="hx-hero-shot hx-hero-shot-1" src="/demo-media/home/walkthrough/process-full.jpg" alt="${escapeHtml(
    hx.stageAlt,
  )}" width="1920" height="1080" fetchpriority="high" decoding="async"></div></div></div></section>`;

  const crawl = `<div class="home-crawl">${homeStoryHtml(locale)}<section><h2>${escapeText(
    faqTitle,
  )}</h2><p>${escapeText((STORY[locale] || STORY.en).faqLead)}</p>${faqBodyHtml(faqs)}</section></div>`;

  return {
    lang: meta.htmlLang,
    dir: meta.dir,
    headline,
    crawl,
    inner: `<main class="home-shell hx-paint" lang="${meta.htmlLang}" dir="${meta.dir}" data-home-design="sketch">${header}<div class="hx-page" data-hx-shell="true" dir="${meta.dir}">${hero}</div></main>`,
  };
}
