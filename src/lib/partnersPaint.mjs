import { marketingPublicUrl } from "./localePathCore.mjs";
import { getHebrewMarketingPage } from "./hebrewMarketing.mjs";

function esc(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const EN = {
  lang: "en",
  dir: "ltr",
  kicker: "Bizuply Partner Program",
  h1: "Build Your Business with Bizuply",
  sub: "Partner with Bizuply. Grow Your Revenue.",
  body: "Join the Bizuply Partner Program and turn advanced technology into an ongoing business opportunity. Market CRM, automations, WhatsApp Business API and SaaS systems, and build revenue from paying customers.",
  become: "Become a Partner",
  explore: "Explore Partner Benefits",
  signals: [
    ["40%", "Up to 40% Recurring Commission"],
    ["Recurring", "Build Recurring Revenue"],
    ["Global", "Global Partner Program"],
  ],
  facts: [
    "Business Partner: $299 / month or $2,990 / year after approval.",
    "Recurring commission: 30% / 35% / 40% on eligible subscription revenue.",
    "Affiliate: currently 15% of eligible catalog sales. No membership fee.",
  ],
};

const HE = {
  lang: "he",
  dir: "rtl",
  kicker: "תוכנית השותפים של Bizuply",
  h1: "בנו את העסק שלכם עם Bizuply",
  sub: "שותפות עם Bizuply. הגדילו את ההכנסות.",
  body: "הצטרפו לתוכנית השותפים של Bizuply והפכו פתרונות טכנולוגיים מתקדמים להזדמנות עסקית מתמשכת.",
  become: "הצטרפו כשותפים",
  explore: "גלו את יתרונות השותפות",
  signals: [
    ["40%", "עד 40% עמלה חוזרת"],
    ["חוזר", "בנו הכנסה חוזרת"],
    ["עולם", "תוכנית שותפים בינלאומית"],
  ],
  facts: [
    "Business Partner: 299$ לחודש או 2,990$ לשנה אחרי אישור.",
    "עמלה חוזרת: 30% / 35% / 40% על הכנסת מנוי זכאית.",
    "Affiliate: כיום 15% ממכירות זכאיות בקטלוג. בלי דמי חברות.",
  ],
};

export function getPartnersPaintCopy(language) {
  const hePage = getHebrewMarketingPage("/partners");
  if (String(language || "").startsWith("he")) {
    return {
      ...HE,
      h1: hePage?.h1 || HE.h1,
    };
  }
  return EN;
}

/** Visible first-paint hero for /partners before the React chunk hydrates. */
export function buildPartnersPaint(language) {
  const c = getPartnersPaintCopy(language);
  const base =
    marketingPublicUrl("/partners", c.lang).replace("https://bizuply.com", "") || "/partners";
  const applyHref = esc(`${base}#apply`);
  const benefitsHref = esc(`${base}#benefits`);
  const facts = c.facts.map((fact) => `<li>${esc(fact)}</li>`).join("");
  const signals = c.signals
    .map(([figure, title]) => `<li><strong><bdi>${esc(figure)}</bdi></strong><span>${esc(title)}</span></li>`)
    .join("");
  return `<div class="ipartner" lang="${esc(c.lang)}" dir="${c.dir}" data-partners-paint="1"><header class="ip-hero"><div class="ip-wrap ip-wrap-wide ip-hero-grid"><div class="ip-hero-copy"><p class="ip-kicker">${esc(c.kicker)}</p><h1>${esc(c.h1)}</h1><p class="ip-sub">${esc(c.sub)}</p><p class="ip-lead">${esc(c.body)}</p><div class="ip-actions"><a class="ip-btn ip-btn-primary" href="${applyHref}">${esc(c.become)}</a><a class="ip-btn ip-btn-ghost" href="${benefitsHref}">${esc(c.explore)}</a></div><ul class="ip-hero-facts">${facts}</ul></div><ul class="ip-signals">${signals}</ul></div></header></div>`;
}
