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
  shot: "/demo-media/partners/crm-en.webp",
  shotAlt: "CRM screenshot from the authorized Bizuply demo workspace",
  facts: [
    "Business Partner: $499 / month or $5,000 / year after approval.",
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
  shot: "/demo-media/partners/crm-he.webp",
  shotAlt: "צילום מסך CRM מסביבת הדמו המורשית של Bizuply",
  facts: [
    "Business Partner: 499$ לחודש או 5,000$ לשנה אחרי אישור.",
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
  return `<div class="ipartner" lang="${esc(c.lang)}" dir="${c.dir}" data-partners-paint="1"><header class="ip-hero"><div class="ip-wrap ip-wrap-wide ip-hero-grid"><div class="ip-hero-copy"><p class="ip-kicker">${esc(c.kicker)}</p><h1>${esc(c.h1)}</h1><p class="ip-sub">${esc(c.sub)}</p><p class="ip-lead">${esc(c.body)}</p><div class="ip-actions"><a class="ip-btn ip-btn-primary" href="${applyHref}">${esc(c.become)}</a><a class="ip-btn ip-btn-ghost" href="${benefitsHref}">${esc(c.explore)}</a></div><ul class="ip-hero-facts">${facts}</ul></div><div class="ip-hero-media"><figure class="ip-shot"><img src="${esc(c.shot)}" alt="${esc(c.shotAlt)}" width="1600" height="1000" fetchpriority="high" decoding="async"></figure></div></div></header></div>`;
}
