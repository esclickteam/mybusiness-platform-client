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
  h1: "Build businesses. Expand opportunities. Earn together.",
  sub: "Join the Bizuply Partner Program, offer CRM, automation, WhatsApp and SaaS systems to businesses, and build recurring commission activity.",
  become: "Apply for partnership",
  explore: "See how the program works",
  compareTitle: "Choose your open track",
  affiliateTitle: "Affiliate",
  affiliateFee: "Membership fee: none on the percent track.",
  affiliateRate: "Commission: currently 15% of eligible sales in the catalog.",
  businessTitle: "Business Partner",
  businessFee: "Membership: $499 / month or $5,000 / year after approval.",
  businessRate: "Recurring commission: 30% / 35% / 40% tiers · 10% on eligible one-time deals.",
  compareNote: "Verified commercial terms. Application is free. Membership fees are collected only after approval.",
};

const HE = {
  lang: "he",
  dir: "rtl",
  kicker: "תוכנית השותפים של Bizuply",
  h1: "בונים עסק. מרחיבים הזדמנויות. מרוויחים יחד.",
  sub: "הצטרפו לתוכנית השותפים של Bizuply, הציעו לעסקים פתרונות CRM, אוטומציה, WhatsApp ומערכות SaaS, ובנו פעילות עסקית עם מודל עמלות מתמשך.",
  become: "הגישו מועמדות לשותפות",
  explore: "גלו איך התוכנית עובדת",
  compareTitle: "בחרו מסלול פתוח",
  affiliateTitle: "Affiliate",
  affiliateFee: "דמי חברות: אין במסלול האחוזים.",
  affiliateRate: "עמלה: כיום 15% ממכירות זכאיות לפי הקטלוג.",
  businessTitle: "Business Partner",
  businessFee: "דמי חברות: 499$ לחודש או 5,000$ לשנה אחרי אישור.",
  businessRate: "עמלה חוזרת: מדרגות 30% / 35% / 40% · 10% על עסקאות חד־פעמיות זכאיות.",
  compareNote: "תנאים מסחריים מאומתים. הגשת הבקשה ללא תשלום. דמי חברות נגבים רק אחרי אישור.",
};

export function getPartnersPaintCopy(language) {
  const hePage = getHebrewMarketingPage("/partners");
  if (String(language || "").startsWith("he")) {
    return {
      ...HE,
      h1: hePage?.h1 || HE.h1,
      sub: hePage?.paragraphs?.[0] || HE.sub,
    };
  }
  return EN;
}

/** Visible first-paint hero for /partners before the React chunk hydrates. */
export function buildPartnersPaint(language) {
  const c = getPartnersPaintCopy(language);
  const applyHref = esc(
    (marketingPublicUrl("/partners", c.lang).replace("https://bizuply.com", "") ||
      "/partners") + "#apply"
  );
  const howHref = esc(
    (marketingPublicUrl("/partners", c.lang).replace("https://bizuply.com", "") ||
      "/partners") + "#how-it-works"
  );
  return `<div class="ip-paint" lang="${esc(c.lang)}" dir="${c.dir}" data-partners-paint="1"><section class="ip-paint__hero" aria-labelledby="ip-paint-title"><p class="ip-paint__kicker">${esc(c.kicker)}</p><h1 id="ip-paint-title">${esc(c.h1)}</h1><p class="ip-paint__sub">${esc(c.sub)}</p><div class="ip-paint__actions"><a class="ip-paint__btn ip-paint__btn-primary" href="${applyHref}">${esc(c.become)}</a><a class="ip-paint__btn ip-paint__btn-ghost" href="${howHref}">${esc(c.explore)}</a></div><p class="ip-paint__compare-title">${esc(c.compareTitle)}</p><div class="ip-paint__compare"><article class="ip-paint__compare-card"><h2>${esc(c.affiliateTitle)}</h2><p>${esc(c.affiliateFee)}</p><p>${esc(c.affiliateRate)}</p></article><article class="ip-paint__compare-card ip-paint__compare-card--featured"><h2>${esc(c.businessTitle)}</h2><p>${esc(c.businessFee)}</p><p>${esc(c.businessRate)}</p></article></div><p class="ip-paint__compare-note">${esc(c.compareNote)}</p></section></div>`;
}
