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
};

const HE = {
  lang: "he",
  dir: "rtl",
  kicker: "תוכנית השותפים של Bizuply",
  h1: "בונים עסק. מרחיבים הזדמנויות. מרוויחים יחד.",
  sub: "הצטרפו לתוכנית השותפים של Bizuply, הציעו לעסקים פתרונות CRM, אוטומציה, WhatsApp ומערכות SaaS, ובנו פעילות עסקית עם מודל עמלות מתמשך.",
  become: "הגישו מועמדות לשותפות",
  explore: "גלו איך התוכנית עובדת",
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
  return `<div class="ip-paint" lang="${esc(c.lang)}" dir="${c.dir}" data-partners-paint="1"><section class="ip-paint__hero" aria-labelledby="ip-paint-title"><p class="ip-paint__kicker">${esc(c.kicker)}</p><h1 id="ip-paint-title">${esc(c.h1)}</h1><p class="ip-paint__sub">${esc(c.sub)}</p><div class="ip-paint__actions"><a class="ip-paint__btn ip-paint__btn-primary" href="${applyHref}">${esc(c.become)}</a><a class="ip-paint__btn ip-paint__btn-ghost" href="${howHref}">${esc(c.explore)}</a></div></section></div>`;
}
