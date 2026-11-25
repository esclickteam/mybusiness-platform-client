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
const CHEVRON = `<svg class="site-nav__chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"></path></svg>`;

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
      group.columns
        ? `<span class="site-nav__item"><button type="button" class="site-header__link site-nav__button" aria-expanded="false" aria-haspopup="true">${escapeText(group.label)}${CHEVRON}</button></span>`
        : `<a class="site-header__link" href="${escapeHtml(href(group.to))}">${escapeText(group.label)}</a>`,
    )
    .join("");
  const short = locale === "pt-BR" ? "PT" : String(meta.htmlLang || "en").slice(0, 2).toUpperCase();
  return `<header class="site-header" dir="${meta.dir}"><nav class="site-header__bar" aria-label="${escapeText(
    hx.navAria,
  )}"><a class="site-header__logo" href="${escapeHtml(href("/"))}"><img class="site-header__logo-img site-header__logo-img--light" src="/brand/logo.png" alt="${escapeHtml(
    logoAlt,
  )}" width="1166" height="398" fetchpriority="low" decoding="async"></a><div class="site-header__nav">${nav}</div><div class="site-header__end"><span class="site-header__icon-btn"><span class="site-header__lang-code">${escapeText(
    short,
  )}</span>${GLOBE}</span><div class="site-header__actions"><a class="site-header__signin" href="${escapeHtml(
    href("/login"),
  )}">${escapeText(hx.login)}</a><a class="site-header__cta" href="${escapeHtml(href("/pricing"))}">${escapeText(
    hx.cta,
  )}</a></div><div class="site-header__mobile"><span class="site-header__burger" aria-hidden="true"><span></span><span></span><span></span></span></div></div></nav></header>`;
}

const HERO_WAVES = `<svg class="ht-waves ht-hero-waves" viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="ht-wave-a" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#FF42B3" stop-opacity="0.55"></stop><stop offset="0.55" stop-color="#2541F5" stop-opacity="0.2"></stop><stop offset="1" stop-color="#EDFF00" stop-opacity="0.35"></stop></linearGradient><linearGradient id="ht-wave-b" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#EDFF00" stop-opacity="0.28"></stop><stop offset="1" stop-color="#FFFFFF" stop-opacity="0.2"></stop></linearGradient></defs><g class="ht-wave ht-wave-1"><path d="M0 210 C 240 140 420 280 720 214 S 1180 120 1440 190 V320 H0Z" fill="url(#ht-wave-b)"></path><path d="M1440 210 C 1680 140 1860 280 2160 214 S 2620 120 2880 190 V320 H1440Z" fill="url(#ht-wave-b)"></path></g><g class="ht-wave ht-wave-2"><path d="M0 250 C 260 196 470 300 760 252 S 1210 176 1440 236 V320 H0Z" fill="url(#ht-wave-a)"></path><path d="M1440 250 C 1700 196 1910 300 2200 252 S 2650 176 2880 236 V320 H1440Z" fill="url(#ht-wave-a)"></path></g><path class="ht-wave-line" d="M0 176 C 300 120 520 236 820 186 S 1250 110 1440 160" fill="none"></path></svg>`;

const THEATER_MEDIA = "/demo-media/home/theater";
const THEATER_VERSION = "t7";

/** Static frame of ProductTheater: same bar, stage and caption, so the swap to React does not move anything. */
function theaterShellHtml(hx, lang) {
  const steps = hx.processSteps || [];
  const tabs = steps
    .map(
      (step, index) =>
        `<span class="ht-tab${index === 0 ? " is-active" : ""}"><span class="ht-tab-num">${String(index + 1).padStart(
          2,
          "0",
        )}</span><span class="ht-tab-label">${escapeText(step[1])}</span><span class="ht-tab-fill"></span></span>`,
    )
    .join("");
  const controls = `<span class="ht-ctl"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"></path></svg></span><span class="ht-ctl ht-ctl-main"><svg viewBox="0 0 24 24"><path class="ht-fill" d="M8 5l11 7-11 7z"></path></svg></span><span class="ht-ctl"><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"></path></svg></span>`;
  const first = (hx.processCopy || [])[0] || ["", ""];
  const stepOf = String(hx.stepOf || "")
    .replace("{n}", "1")
    .replace("{total}", String(steps.length));
  const poster = `${THEATER_MEDIA}/${lang}-desktop.webp?v=${THEATER_VERSION}`;
  const hebrew = String(lang || "").toLowerCase().startsWith("he");
  const metric = hebrew ? "לידים" : "Leads";
  const caption = hebrew ? "לוח בקרה" : "Dashboard";
  const row = `<div class="hx-mrow"><div class="hx-mrow-track"><div class="hx-mrow-card" style="width:48%;max-width:220px;padding:14px 12px;border:2px solid #2541F5;border-radius:2px;background:#fff;text-align:center"><b style="display:block;color:#2541F5;font-size:1.6rem">128</b><span style="color:#111936;font-size:.85rem;font-weight:700">${metric}</span></div></div><p class="hx-mrow-caption">${caption}</p></div>`;
  return `<div class="ht-theater" aria-hidden="true"><div class="ht-bar"><div class="ht-tabs">${tabs}</div><div class="ht-controls">${controls}</div></div><div class="ht-stage"><picture><source media="(min-width: 761px)" srcset="${poster}" width="1920" height="1080"><img class="ht-poster" alt="${escapeHtml(
    hx.processLabel || hx.stageAlt,
  )}" width="1920" height="1080" decoding="async"></picture></div><div class="ht-caption"><p class="ht-caption-step">${escapeText(
    stepOf,
  )}</p><h3>${escapeText(first[0])}</h3><p>${escapeText(first[1])}</p></div></div>${row}`;
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
  const hotSource = hx.lineThree ? hx.lineThree : hx.lineTwo;
  const lineHot = Math.max(0, String(hotSource).trim().split(/\s+/).length - 1);
  const faqs = HOME_FAQ[locale] || HOME_FAQ.en;
  const faqTitle = HOME_FAQ_TITLE[locale] || HOME_FAQ_TITLE.en;
  const headline = [hx.lineOne, hx.lineTwo, hx.lineThree].filter(Boolean).join(" ");

  const header = renderMarketingHeader(locale);
  const href = (path) => localeHref(locale === "pt-BR" || locale === "he" || locale === "es" || locale === "ar" ? locale : "en", path);

  const kicker = hx.kicker
    ? `<p class="hx-hero-kicker">${escapeText(hx.kicker)}</p>`
    : `<p class="hx-hero-brand">BizUply</p>`;
  const secondLine = `<span class="hx-line">${heroWords(hx.lineTwo, hx.lineThree ? -1 : lineHot)}${hx.lineThree ? ` ${heroWords(hx.lineThree, lineHot)}` : ""}</span>`;
  const filmLang = locale === "he" ? "he" : "en";
  const hero = `<section class="hx-hero" data-bz-tone="paper" data-hx-first-paint="true" aria-labelledby="hx-hero-title"><div class="bz-spec__copy">${kicker}<h1 class="hx-display" id="hx-hero-title"><span class="hx-line">${heroWords(
    hx.lineOne,
  )}</span>${secondLine}</h1><p class="hx-lead">${escapeText(hx.lead1)}</p><div class="hx-actions"><a class="hx-btn" href="${escapeHtml(href("/register"))}"><span>${escapeText(
    hx.start,
  )}</span></a><a class="hx-btn hx-btn-line" href="${escapeHtml(href("/contact"))}"><span>${escapeText(
    hx.see,
  )}</span></a></div></div><div class="bz-spec__film"><span class="bz-spec__pink" aria-hidden="true"></span><span class="bz-spec__yellow" aria-hidden="true"></span>${theaterShellHtml(
    hx,
    filmLang,
  )}</div></section>`;

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
