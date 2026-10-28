/**
 * First-paint homepage chrome for the marketing host.
 * Copied from the live Header + Hero strings so refresh shows the designed
 * page immediately. React replaces #root after it boots.
 */

import { splitMarketingLocale } from "./localePath.mjs";

const COPY = {
  en: {
    dir: "ltr",
    lang: "en",
    navAria: "Main navigation",
    login: "Login",
    cta: "Get Started",
    langCode: "EN",
    about: "About",
    website: "Website & Store",
    crm: "CRM",
    automations: "Automations",
    agents: "Business Agents",
    collaborations: "Collaborations",
    pricing: "Pricing",
    badge: "All-in-one business management platform",
    brand: "Bizuply",
    brandLocal: "",
    headlineTop: "Run your business",
    headlineHighlight: "in one place",
    subtitle:
      "One smart platform to manage clients, appointments, CRM, collaborations, proposals and AI — everything connected in one premium workspace.",
    startTrial: "Register now",
  },
  he: {
    dir: "rtl",
    lang: "he",
    navAria: "ניווט ראשי",
    login: "התחברות",
    cta: "הירשמו עכשיו",
    langCode: "HE",
    about: "אודות",
    website: "בניית אתר וחנות",
    crm: "CRM",
    automations: "אוטומציות",
    agents: "נציגים לעסק",
    collaborations: "שיתופי פעולה",
    pricing: "מחירים",
    badge: "פלטפורמה מלאה לניהול העסק",
    brand: "Bizuply",
    brandLocal: "ביזאפלי",
    headlineTop: "נהלו את העסק שלכם",
    headlineHighlight: "במקום אחד",
    subtitle:
      "מערכת חכמה אחת לניהול לקוחות, פגישות, CRM, שיתופי פעולה, הצעות מחיר ובינה מלאכותית — הכל מחובר בסביבת עבודה מקצועית אחת.",
    startTrial: "הירשמו עכשיו",
  },
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function href(locale, path) {
  if (locale === "he") return path === "/" ? "/he/" : `/he${path}`;
  return path;
}

export function buildHomeFirstPaint(pathname) {
  const { locale, path } = splitMarketingLocale(pathname);
  if (path !== "/") return null;
  const copy = COPY[locale] || COPY.en;
  const loc = copy.lang === "he" ? "he" : "en";
  const nav = [
    [copy.about, "/about"],
    [copy.website, "/website-builder"],
    [copy.crm, "/crm"],
    [copy.automations, "/automations"],
    [copy.agents, "/agents"],
    [copy.collaborations, "/collaborations"],
    [copy.pricing, "/pricing"],
  ]
    .map(
      ([label, to]) =>
        `<a class="home-paint__link" href="${escapeHtml(href(loc, to))}">${escapeHtml(label)}</a>`,
    )
    .join("");

  const local = copy.brandLocal
    ? `<span class="home-paint__local">${escapeHtml(copy.brandLocal)}</span>`
    : "";

  return {
    lang: copy.lang,
    dir: copy.dir,
    inner: `<div class="home-paint" lang="${copy.lang}" dir="${copy.dir}">
  <header class="home-paint__header">
    <nav class="home-paint__bar" aria-label="${escapeHtml(copy.navAria)}">
      <a class="home-paint__logo" href="${escapeHtml(href(loc, "/"))}" aria-label="Bizuply">
        <img src="/android-chrome-192x192.png" width="52" height="52" alt="Bizuply" />
        <span>Bizuply</span>
      </a>
      <div class="home-paint__nav">${nav}</div>
      <div class="home-paint__actions">
        <span class="home-paint__lang">${escapeHtml(copy.langCode)}</span>
        <a class="home-paint__signin" href="${escapeHtml(href(loc, "/login"))}">${escapeHtml(copy.login)}</a>
        <a class="home-paint__cta" href="${escapeHtml(href(loc, "/pricing"))}">${escapeHtml(copy.cta)}</a>
      </div>
      <div class="home-paint__mobile">
        <span class="home-paint__lang">${escapeHtml(copy.langCode)}</span>
        <span class="home-paint__burger" aria-hidden="true"><span></span><span></span><span></span></span>
      </div>
    </nav>
  </header>
  <main class="home-paint__hero">
    <p class="home-paint__badge">${escapeHtml(copy.badge)}</p>
    <h1 class="home-paint__title">
      <span class="home-paint__brand">${escapeHtml(copy.brand)}</span>
      ${local}
      <span class="home-paint__top">${escapeHtml(copy.headlineTop)}</span>
      <span class="home-paint__hi">${escapeHtml(copy.headlineHighlight)}</span>
    </h1>
    <p class="home-paint__lead">${escapeHtml(copy.subtitle)}</p>
    <p class="home-paint__cta-row"><a class="home-paint__start" href="${escapeHtml(href(loc, "/pricing"))}">${escapeHtml(copy.startTrial)}</a></p>
  </main>
</div>`,
  };
}
