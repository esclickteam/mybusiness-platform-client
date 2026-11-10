import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { fetchPartnerPlans } from "../../lib/partnerApi";
import {
  INTERNATIONAL_BILLING_OPTIONS,
  INTERNATIONAL_PLAN_KEY,
  internationalBillingOptionsFromPlan,
  type InternationalBillingOption,
} from "../../lib/partnerInternationalPlan";
import { marketingPublicUrl } from "../../lib/localePathCore.mjs";
import { partnerFaqPairs } from "./partners/partnerFaq.mjs";
import PartnerApplyForm from "./partners/PartnerApplyForm";
import PartnerProductMedia from "./partners/PartnerProductMedia";
import {
  ONE_TIME_RATE,
  commissionRateForCustomers,
  estimatePartnerCommission,
  money,
  tierCount,
} from "./partners/partnersCommission.mjs";
import "./partners/partnersPage.css";

const PRIMARY_TRACK_KEYS = new Set(["Affiliate", "Business Partner", "Reseller"]);

function revealPartnersSections(root: HTMLElement) {
  const reduce =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nodes = Array.from(root.querySelectorAll<HTMLElement>(".ip-reveal"));
  if (reduce || typeof IntersectionObserver !== "function") {
    nodes.forEach((node) => node.classList.add("is-in"));
    return () => undefined;
  }

  let observer: IntersectionObserver | null = null;

  const markVisible = (node: Element) => {
    node.classList.add("is-in");
    observer?.unobserve(node);
  };

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting || entry.intersectionRatio > 0) markVisible(entry.target);
      });
    },
    { threshold: [0, 0.08, 0.2], rootMargin: "80px 0px 80px 0px" }
  );

  const revealPassed = () => {
    nodes.forEach((node) => {
      if (node.classList.contains("is-in")) return;
      const top = node.getBoundingClientRect().top;
      if (top < window.innerHeight * 0.98) markVisible(node);
    });
  };

  nodes.forEach((node) => observer?.observe(node));
  revealPassed();
  root.classList.add("is-reveal-ready");

  let scrollFrame = 0;
  const onScroll = () => {
    if (!scrollFrame) {
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        revealPassed();
      });
    }
  };
  const onHash = () => {
    const id = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    if (target.classList.contains("ip-reveal")) markVisible(target);
    const parentReveal = target.closest(".ip-reveal");
    if (parentReveal) markVisible(parentReveal);
    target.querySelectorAll<HTMLElement>(".ip-reveal").forEach((node) => markVisible(node));
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("hashchange", onHash);
  onHash();

  return () => {
    window.cancelAnimationFrame(scrollFrame);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("hashchange", onHash);
    observer?.disconnect();
    root.classList.remove("is-reveal-ready");
  };
}

export { commissionRateForCustomers, estimatePartnerCommission } from "./partners/partnersCommission.mjs";

const PAGE_PATH = "/partners";

const COPY = {
  en: {
    seoTitle: "Bizuply Partner Program | Build recurring revenue with CRM and SaaS",
    seoDescription:
      "Apply to the Bizuply Partner Program. Offer CRM, Meta campaigns for Facebook and Instagram ads, WhatsApp, automation and SaaS. Eligible recurring commission is 30% to 40%. Business Partner membership is $5,000 per year or $499 per month after approval.",
    kicker: "Bizuply Partner Program",
    h1: "Build businesses. Expand opportunities. Earn together.",
    sub: "Join the Bizuply Partner Program. Introduce businesses to CRM, Meta campaigns, automation, WhatsApp and SaaS systems, and grow with a recurring commission model.",
    become: "Apply for partnership",
    explore: "See how the program works",
    stickyJoin: "Ready to apply?",
    stickyCta: "Join as a partner",
    compareTitle: "Affiliate · Business Partner · Reseller",
    compareNote: "Verified commercial terms. Application is free. Membership fees are collected only after approval. Reseller is by appointment — not self-serve on this page.",
    compare: [
      {
        key: "Affiliate",
        title: "Affiliate",
        fee: "Membership fee: none on the percent track.",
        rate: "Commission: currently 15% of eligible sales in the catalog.",
        featured: false,
      },
      {
        key: "Business Partner",
        title: "Business Partner",
        fee: "Membership: $499 / month or $5,000 / year after approval.",
        rate: "Recurring commission: 30% / 35% / 40% tiers · 10% on eligible one-time deals.",
        featured: true,
      },
      {
        key: "Reseller",
        title: "Reseller",
        fee: "Setup and monthly fees follow the appointed catalog plan.",
        rate: "Markup-share per appointed plan — not the international tier table. By agreement only.",
        featured: false,
      },
    ],
    facts: [
      ["Up to 40% recurring commission", "On eligible subscription revenue in qualifying tracks, under the signed agreement."],
      ["One platform. Multiple solutions.", "CRM, WhatsApp, automation, websites and industry SaaS under one partnership."],
      ["Partner portal", "Track clients, attribution and commissions in the existing Partner Center."],
      ["International activity", "Operate in countries and regions approved for your agreement."],
    ],
    whyTitle: "A growth partnership, not a one-off referral",
    whyLead: "The benefits below match rights already in the Partner Program. Nothing here adds a service the agreement does not cover.",
    why: [
      ["Recurring revenue opportunities", "Build a portfolio of eligible subscription customers and earn recurring commissions under your agreement."],
      ["Multiple products. One partnership.", "Introduce CRM, lead management, WhatsApp Business API, Meta tools, websites, automation and authorized SaaS products."],
      ["Grow in your market", "Develop commercial relationships in approved countries using Bizuply's existing infrastructure."],
      ["Partner resources", "Access the Partner Center, onboarding, published training and approved materials when membership is active."],
      ["One-time project opportunities", "Earn commission on eligible one-time transactions while developing additional business."],
      ["Long-term development", "Grow your customer base, deepen product knowledge and progress through published commission tiers."],
    ],
    productsTitle: "What partners can sell",
    productsLead: "Product categories available through Bizuply today. Clips are real recordings from the published demo workspace — not a customer account and not live Meta spend.",
    demoCaption: "Authorized demo recording. No live publishing and no media spend.",
    products: [
      {
        title: "CRM & lead management",
        href: "/crm",
        image: "/demo-media/crm/poster.jpg",
        video: "/demo-media/crm/crm-en.mp4",
        videoHe: "/demo-media/crm/crm-he.mp4",
        captions: "/demo-media/crm/crm.en.vtt",
        captionsHe: "/demo-media/crm/crm.he.vtt",
        alt: "Bizuply demo CRM lead workflow",
        sell: "Sell organized lead and customer management that keeps follow-ups in one place.",
        points: ["Customer relationship management", "Lead tracking", "Sales pipelines", "Customer records", "Follow-up workflows"],
      },
      {
        title: "WhatsApp Business API",
        href: "/whatsapp-api",
        image: "/demo-media/whatsapp/poster.jpg",
        video: "/demo-media/whatsapp/whatsapp-en.mp4",
        videoHe: "/demo-media/whatsapp/whatsapp-he.mp4",
        captions: "/demo-media/whatsapp/whatsapp.en.vtt",
        captionsHe: "/demo-media/whatsapp/whatsapp.he.vtt",
        alt: "Bizuply demo WhatsApp inbox",
        sell: "Sell official WhatsApp Business API connectivity with templates and business messaging.",
        note: "Use is subject to Meta policy, approvals and messaging costs.",
        points: ["Official WhatsApp Business API", "Business messaging", "Approved templates", "Campaign-related workflows"],
      },
      {
        title: "Meta campaigns — Facebook & Instagram Ads",
        href: "/meta-campaigns",
        image: "/demo-media/campaigns/poster.jpg",
        video: "/demo-media/campaigns/campaigns-en.mp4",
        videoHe: "/demo-media/campaigns/campaigns-he.mp4",
        captions: "/demo-media/campaigns/campaigns.en.vtt",
        captionsHe: "/demo-media/campaigns/campaigns.he.vtt",
        alt: "Bizuply demo Meta campaign manager",
        sell: "Sell Meta campaign tools next to CRM so Lead Ads can continue into follow-up.",
        note: "Included with the Bizuply Business plan after an authorized Meta ad account is connected. Not a separate partner SKU. Meta bills media spend. Drafts can be prepared without publishing or spending. Partners earn on eligible Bizuply subscription revenue under the signed agreement — not on Meta ad spend.",
        points: [
          "Connect the business’s own Meta ad account",
          "Create and edit campaigns, ad sets and ads",
          "Set budget on the campaign or the ad set",
          "Review performance for connected campaigns",
          "Lead Ads can enter the CRM with source and status for follow-up",
        ],
      },
      {
        title: "Business automations",
        href: "/automations",
        image: "/demo-media/automations/poster.jpg",
        video: "/demo-media/automations/automations-en.mp4",
        videoHe: "/demo-media/automations/automations-he.mp4",
        captions: "/demo-media/automations/automations.en.vtt",
        captionsHe: "/demo-media/automations/automations.he.vtt",
        alt: "Bizuply automation workspace",
        sell: "Sell workflow automation that routes leads and creates follow-up tasks.",
        points: ["Automated follow-ups", "Lead routing", "Workflow automation", "Supported integrations"],
      },
      {
        title: "Websites & digital tools",
        href: "/website-builder",
        image: "/demo-media/websites/poster.jpg",
        video: "/demo-media/websites/websites-en.mp4",
        videoHe: "/demo-media/websites/websites-he.mp4",
        captions: "/demo-media/websites/websites.en.vtt",
        captionsHe: "/demo-media/websites/websites.he.vtt",
        alt: "Bizuply website workspace",
        sell: "Sell business websites and landing pages that capture leads into CRM.",
        points: ["Business websites", "Landing pages", "Lead capture forms", "Appointment booking"],
      },
    ],
    saasTitle: "Industry SaaS systems",
    saasLead: "These products exist in Bizuply. Partner resale is coming soon and is not available for purchase through this program yet. Membership does not include source code, white-label rights or a distribution right.",
    soon: "Coming soon",
    saas: ["BeautyFlow", "Global Properties", "Dinevo", "TableFlow", "Cliny"],
    commTitle: "Commission model",
    commLead: "Commissions apply only to eligible transactions and subscriptions after revenue is received. Attribution follows the partner record. Income is not guaranteed. This page does not change server formulas. The signed agreement decides eligibility.",
    customers: "Active paying customers",
    rate: "Recurring commission",
    oneTime: "10% commission on eligible one-time transactions",
    eligibility: [
      ["Eligibility", "Only revenue categories named as eligible in the signed agreement."],
      ["Duration", "While the customer remains attributed and eligible under the agreement terms."],
      ["Refunds & cancellations", "Commission follows received revenue. Refunds and cancellations reverse or reduce unpaid commission as the agreement and ledger require."],
      ["Attribution", "A customer is attributed through the existing partner attribution record — not by visiting this page alone."],
    ],
    calcTitle: "Revenue calculator",
    calcSimBadge: "Illustration only",
    calcCustomers: "Active paying customers",
    calcPrice: "Average monthly subscription price (USD)",
    calcTier: "Commission tier",
    calcOneTimeCount: "Number of one-time deals",
    calcOneTimeAvg: "Average one-time deal amount (USD)",
    revenue: "Estimated eligible monthly subscription revenue",
    month: "Estimated monthly recurring commission",
    year: "Estimated annual recurring commission",
    oneTimeResult: "Estimated one-time commissions",
    totalResult: "Estimated total under your assumptions",
    disclaimer: "Simulation only. Not a forecast or income guarantee. Actual earnings depend on eligible revenue, attribution, commission terms, retention, refunds and the executed agreement.",
    tracksTitle: "Partnership tracks",
    tracksLead: "Only tracks that already exist contractually or technically are shown as open. Others require a signed agreement or invitation and are not self-serve.",
    tracksTableTitle: "Affiliate · Business Partner · Reseller at a glance",
    tracksTable: {
      fee: "Membership fee",
      reward: "Reward model",
      access: "Access",
      rows: [
        ["Affiliate", "None on the percent track", "Currently 15% of eligible sales in the catalog", "Application review. No Partner Center membership fee."],
        ["Business Partner", "$499 / month or $5,000 / year after approval", "Recurring 30% / 35% / 40% · 10% one-time", "Partner Center after agreement and verified payment."],
        ["Reseller", "Setup and monthly fees follow the appointed catalog plan", "Markup-share per appointed plan — not the international tier table", "By agreement. Not selected automatically on this page."],
      ],
    },
    heroMediaCaption: "Authorized CRM demo recording from the published Bizuply demo workspace.",
    primaryTracksTitle: "Core partnership tracks",
    secondaryTracksTitle: "Additional capabilities by agreement",
    tracks: [
      {
        key: "Affiliate",
        title: "Affiliate",
        status: "Available",
        who: "Marketers and referrers who want commission without a paid membership fee.",
        allows: "Introduce Bizuply and earn on eligible sales under the percent track (partner_percent).",
        reward: "Percent-of-sale commission as configured for that track (currently 15% in the catalog).",
        fee: "No membership fee on the percent track.",
        approval: "Application review required.",
        limits: "No white-label rights. Products marked coming soon are not for partner sale.",
      },
      {
        key: "Business Partner",
        title: "Business Partner",
        status: "Open for application",
        who: "Agencies, consultants and growth professionals building a client portfolio.",
        allows: "International Partner appointment with Partner Center access after activation.",
        reward: "Recurring tiers 30% / 35% / 40% and 10% on eligible one-time deals.",
        fee: "$5,000 per year, or $499 per month — payment only after approval.",
        approval: "Required. Agreement signature and verified payment before activation.",
        limits: "Territory and exclusivity are separate. No automatic card charge from this page.",
      },
      {
        key: "Reseller",
        title: "Reseller",
        status: "By agreement",
        who: "Teams that implement and sell Bizuply as part of a delivery practice.",
        allows: "Commercial terms from the existing Partner / Pro / Premium catalog when appointed.",
        reward: "Markup-share model per the appointed plan — not the international tier table.",
        fee: "Setup and monthly fees follow the appointed plan in the catalog.",
        approval: "Required. Not selected automatically on this page.",
        limits: "Must match a defined plan key. Not a new self-serve SKU.",
      },
      {
        key: "White Label",
        title: "White Label",
        status: "Premium capability",
        who: "Partners who need branded client-facing surfaces where the plan allows it.",
        allows: "Hide Bizuply branding where Partner Premium entitlements enable it.",
        reward: "Same commercial model as the appointed paid plan.",
        fee: "Requires an entitled paid plan (Partner Premium capability in the catalog).",
        approval: "Required. Branding rules in the agreement still apply.",
        limits: "Not a standalone public SKU. Source code is never transferred.",
      },
      {
        key: "Exclusive Territory",
        title: "Exclusive Territory",
        status: "By signed agreement",
        who: "Partners granted exclusivity for a named territory.",
        allows: "Exclusive appointment only when the agreement says exclusive and the territory is available.",
        reward: "Commission terms still follow the appointed plan and agreement.",
        fee: "No separate Premium Territory fee on this page. Membership fees still apply when required.",
        approval: "Both parties must sign. Required payment must be complete.",
        limits: "Monthly/annual Business Partner billing alone does not include exclusivity.",
      },
      {
        key: "Strategic Partner",
        title: "Strategic Partner",
        status: "By invitation",
        who: "Selected organizations with strategic reach or integration scope.",
        allows: "Custom commercial and operational terms when Bizuply invites the partnership.",
        reward: "Defined only in the signed strategic agreement.",
        fee: "Defined only in the signed agreement.",
        approval: "Invitation and contract required. Not open as self-serve.",
        limits: "Not listed as an active catalog plan key.",
      },
    ],
    trackLabels: {
      who: "Best for",
      allows: "What it enables",
      reward: "How you are rewarded",
      fee: "Fees",
      approval: "Approval",
      limits: "Limits",
    },
    plansTitle: "Business Partner billing",
    perMonth: "/ month",
    perYear: "/ year",
    best: "Best value",
    save: "Save $988 compared with monthly billing",
    monthlyPoints: ["Monthly billing", "No annual prepayment", "Same International Partner benefits", "Recurring commission opportunities", "Access to eligible partner resources"],
    annualPoints: ["Same International Partner benefits", "Recurring commission opportunities", "Access to eligible partner resources", "Preferred annual billing"],
    planNotes: ["Application is free", "Payment is required only after approval", "Manual payment outside the website", "No automatic charging", "Subject to the partnership agreement"],
    noCharge: "This page does not start a live charge.",
    due: "After approval, and until the manual payment is recorded, the membership stays payment_due.",
    applyMonthly: "Apply for monthly membership",
    applyAnnual: "Apply for annual membership",
    registerAfterApproval: "Full registration (after approval)",
    territoryTitle: "Territory is agreed separately",
    territoryLead: "Monthly and annual billing do not choose a territory and do not include exclusivity.",
    territories: [
      ["Non-exclusive appointment", "Bizuply may appoint other partners in the same territory."],
      ["Exclusive territory", "Granted only when the signed agreement says exclusive, the territory is available, both parties have signed, and required payment is complete."],
    ],
    journeyTitle: "How joining works",
    steps: [
      ["Submit your application", "Tell us about your business, experience, country and target market."],
      ["Bizuply reviews fit", "Our team reviews eligibility and partnership suitability."],
      ["Approve terms and sign", "Review and sign the applicable partnership agreement."],
      ["Start marketing in the portal", "After any required payment for your track is verified, manage clients through the Partner Center."],
    ],
    trustTitle: "How the Partner Program works in practice",
    trustLead: "Proof of process — not invented partner counts, revenue claims or customer logos.",
    trust: [
      ["Who is behind Bizuply", "Bizuply LLC develops the business platform, WhatsApp connectivity, websites, automations and selected professional services. Support: support@bizuply.com."],
      ["Products available today", "CRM, WhatsApp Business API, Meta campaign tools, website builder, appointments and automations are live. Named industry SaaS products are marked coming soon for partner resale."],
      ["Partner portal", "The Partner Center opens only when the partner is active, the agreement is active, and required payment has been verified."],
      ["Client attribution", "Attribution uses the existing partner record in the partner system. Sharing this page alone does not attribute a customer."],
      ["Commission tracking", "Eligible commissions are tracked in the partner ledger. Payouts follow received revenue, reversals and the signed agreement."],
    ],
    form: {
      title: "Partnership application",
      lead: "Short application. Free to submit. Creates a review request — not an automatic approval and not a charge.",
      name: "Full name",
      company: "Company name",
      email: "Business email",
      phone: "Phone",
      country: "Country",
      website: "Company website",
      websiteOptional: "(optional)",
      track: "Requested partnership type",
      about: "Short note about your company",
      submit: "Submit application",
      sending: "Sending…",
      successTitle: "Application received",
      successBody: "Your application was saved. Our team will review it and follow up by email. Completing registration and any payment happens only after approval.",
      errorGeneric: "We could not save your application right now. Please email support@bizuply.com.",
      errorConsent: "We could not record your privacy choice. Please try again or email support@bizuply.com.",
      requiredHint: "Required",
      emailInvalid: "Enter a valid business email",
      privacyNotice: "We use your details to review this partnership application and to contact you about it. See our",
      privacyAccept: "I have read the Privacy Policy and agree that Bizuply may process my application details.",
      privacyLink: "Privacy Policy",
      marketingOptIn: "Optional: send me partner program updates (you can unsubscribe anytime).",
      trackLabels: {
        Affiliate: "Affiliate",
        "Business Partner": "Business Partner",
        Reseller: "Reseller",
        "White Label": "White Label",
        "Exclusive Territory": "Exclusive Territory",
        "Strategic Partner": "Strategic Partner",
      },
    },
    faqTitle: "Questions partners ask",
    closeTitle: "Ready to partner with Bizuply?",
    closeBody: "Submit a free application first. Full registration and any membership payment happen only after approval.",
    closeCta: "Apply for partnership",
    registerCta: "Full registration (after approval)",
    login: "Partner sign in",
    visual: {
      caption: "Illustration of the partner workspace — not live account data",
      portal: "Partner Center",
      clients: "Clients",
      commissions: "Commissions",
      sampleClient: "Northwind Studio",
      sampleStatus: "Active",
      sampleCommission: "Tier example",
      sampleNote: "Figures are illustrative labels only.",
    },
  },
  he: {
    seoTitle: "תוכנית השותפים של Bizuply | בונים עסק עם CRM ו־SaaS",
    seoDescription:
      "הגישו מועמדות לתוכנית השותפים של Bizuply. הציעו CRM, קמפיינים במטא ל־Facebook ו־Instagram, WhatsApp, אוטומציה ו־SaaS. עמלה חוזרת זכאית 30% עד 40%. מסלול Business Partner: 5,000 דולר לשנה או 499 דולר לחודש אחרי אישור.",
    kicker: "תוכנית השותפים של Bizuply",
    h1: "בונים עסק. מרחיבים הזדמנויות. מרוויחים יחד.",
    sub: "הצטרפו לתוכנית השותפים של Bizuply, הציעו לעסקים פתרונות CRM, קמפיינים במטא, אוטומציה, WhatsApp ומערכות SaaS, ובנו פעילות עסקית עם מודל עמלות מתמשך.",
    become: "הגישו מועמדות לשותפות",
    explore: "גלו איך התוכנית עובדת",
    stickyJoin: "מוכנים להגיש מועמדות?",
    stickyCta: "הצטרפות כשותפים",
    compareTitle: "Affiliate · Business Partner · Reseller",
    compareNote: "תנאים מסחריים מאומתים. הגשת הבקשה ללא תשלום. דמי חברות נגבים רק אחרי אישור. Reseller הוא במינוי בלבד — לא בהרשמה עצמית בעמוד זה.",
    compare: [
      {
        key: "Affiliate",
        title: "Affiliate",
        fee: "דמי חברות: אין במסלול האחוזים.",
        rate: "עמלה: כיום 15% ממכירות זכאיות לפי הקטלוג.",
        featured: false,
      },
      {
        key: "Business Partner",
        title: "Business Partner",
        fee: "דמי חברות: 499$ לחודש או 5,000$ לשנה אחרי אישור.",
        rate: "עמלה חוזרת: מדרגות 30% / 35% / 40% · 10% על עסקאות חד־פעמיות זכאיות.",
        featured: true,
      },
      {
        key: "Reseller",
        title: "Reseller",
        fee: "דמי הקמה וחודשי לפי המסלול שמונה בקטלוג.",
        rate: "מודל markup-share לפי המסלול שמונה — לא טבלת המדרגות הבינלאומית. לפי הסכם בלבד.",
        featured: false,
      },
    ],
    facts: [
      ["עד 40% עמלה חוזרת", "במסלולים הזכאים, על הכנסת מנוי זכאית לפי ההסכם החתום."],
      ["מגוון פתרונות תחת פלטפורמה אחת", "CRM, WhatsApp, אוטומציה, אתרים ו־SaaS לפי תחום."],
      ["פורטל שותפים", "מעקב אחר לקוחות, שיוך ועמלות במרכז השותפים הקיים."],
      ["פעילות בינלאומית", "במדינות ובאזורים שאושרו בהסכם שלכם."],
    ],
    whyTitle: "שותפות לצמיחה, לא הפניה חד־פעמית",
    whyLead: "ההטבות כאן תואמות זכויות שכבר קיימות בתוכנית. אין כאן שירות שההסכם אינו מכסה.",
    why: [
      ["הזדמנויות להכנסה חוזרת", "בנו תיק של לקוחות מנוי זכאים והרוויחו עמלה חוזרת לפי ההסכם."],
      ["כמה מוצרים. שותפות אחת.", "הציגו CRM, ניהול לידים, WhatsApp Business API, כלי Meta, אתרים, אוטומציה ומוצרי SaaS מאושרים."],
      ["צמיחה בשוק שלכם", "פתחו קשרים מסחריים במדינות מאושרות על התשתית הקיימת של Bizuply."],
      ["משאבי שותפים", "גישה למרכז השותפים, לקליטה, להכשרה שפורסמה ולחומרים מאושרים כשהחברות פעילה."],
      ["פרויקטים חד־פעמיים", "עמלה על עסקאות חד־פעמיות זכאיות לצד פיתוח הזדמנויות נוספות."],
      ["פיתוח לטווח ארוך", "הגדילו את בסיס הלקוחות, העמיקו ידע במוצרים והתקדמו במדרגות העמלה."],
    ],
    productsTitle: "מה השותפים יכולים למכור?",
    productsLead: "קטגוריות מוצרים שזמינות ב־Bizuply היום. הסרטונים הם הקלטות אמיתיות מסביבת הדמו המפורסמת — לא חשבון לקוח ולא הוצאת פרסום חיה.",
    demoCaption: "הקלטת דמו מורשית. ללא פרסום חי וללא הוצאת מדיה.",
    products: [
      {
        title: "CRM וניהול לידים",
        href: "/crm",
        image: "/demo-media/crm/poster.jpg",
        video: "/demo-media/crm/crm-en.mp4",
        videoHe: "/demo-media/crm/crm-he.mp4",
        captions: "/demo-media/crm/crm.en.vtt",
        captionsHe: "/demo-media/crm/crm.he.vtt",
        alt: "תהליך לידים בסביבת הדמו של Bizuply",
        sell: "מכרו ניהול לידים ולקוחות שמחזיק את ההמשך במקום אחד.",
        points: ["ניהול קשרי לקוחות", "מעקב לידים", "צינורות מכירה", "כרטיסי לקוח", "תהליכי המשך טיפול"],
      },
      {
        title: "WhatsApp Business API",
        href: "/whatsapp-api",
        image: "/demo-media/whatsapp/poster.jpg",
        video: "/demo-media/whatsapp/whatsapp-en.mp4",
        videoHe: "/demo-media/whatsapp/whatsapp-he.mp4",
        captions: "/demo-media/whatsapp/whatsapp.en.vtt",
        captionsHe: "/demo-media/whatsapp/whatsapp.he.vtt",
        alt: "תיבת דואר של WhatsApp בסביבת הדמו",
        sell: "מכרו חיבור WhatsApp Business API רשמי עם תבניות ומסרים עסקיים.",
        note: "השימוש כפוף למדיניות Meta, לאישורים ולעלויות ההודעות.",
        points: ["WhatsApp Business API רשמי", "מסרים עסקיים", "תבניות מאושרות", "תהליכים לקמפיינים"],
      },
      {
        title: "קמפיינים במטא — Facebook & Instagram Ads",
        href: "/meta-campaigns",
        image: "/demo-media/campaigns/poster.jpg",
        video: "/demo-media/campaigns/campaigns-en.mp4",
        videoHe: "/demo-media/campaigns/campaigns-he.mp4",
        captions: "/demo-media/campaigns/campaigns.en.vtt",
        captionsHe: "/demo-media/campaigns/campaigns.he.vtt",
        alt: "מנהל קמפיינים של Meta בסביבת הדמו של Bizuply",
        sell: "מכרו כלי קמפיין של Meta ליד ה־CRM, כדי ש־Lead Ads ימשיכו לטיפול.",
        note: "כלול בחבילת Business של Bizuply אחרי חיבור חשבון מודעות מורשה של Meta. אינו SKU שותפים נפרד. את הוצאת המדיה גובה Meta. אפשר להכין טיוטות בלי לפרסם ובלי להוציא תקציב. עמלה לשותף נגזרת מהכנסת מנוי זכאית של Bizuply לפי ההסכם — לא מהוצאת הפרסום ב־Meta.",
        points: [
          "חיבור חשבון המודעות של העסק ב־Meta",
          "יצירה ועריכה של קמפיינים, קבוצות מודעות ומודעות",
          "תקציב ברמת הקמפיין או קבוצת המודעות",
          "הצגת ביצועים של קמפיינים מחוברים",
          "Lead Ads יכולים להיכנס ל־CRM עם מקור וסטטוס להמשך טיפול",
        ],
      },
      {
        title: "אוטומציות עסקיות",
        href: "/automations",
        image: "/demo-media/automations/poster.jpg",
        video: "/demo-media/automations/automations-en.mp4",
        videoHe: "/demo-media/automations/automations-he.mp4",
        captions: "/demo-media/automations/automations.en.vtt",
        captionsHe: "/demo-media/automations/automations.he.vtt",
        alt: "סביבת האוטומציות של Bizuply",
        sell: "מכרו אוטומציות שמנתבות לידים ויוצרות משימות המשך.",
        points: ["המשך טיפול אוטומטי", "ניתוב לידים", "אוטומציית תהליכים", "חיבורים נתמכים"],
      },
      {
        title: "אתרים ופתרונות דיגיטליים",
        href: "/website-builder",
        image: "/demo-media/websites/poster.jpg",
        video: "/demo-media/websites/websites-en.mp4",
        videoHe: "/demo-media/websites/websites-he.mp4",
        captions: "/demo-media/websites/websites.en.vtt",
        captionsHe: "/demo-media/websites/websites.he.vtt",
        alt: "סביבת האתרים של Bizuply",
        sell: "מכרו אתרים ודפי נחיתה שקולטים לידים ל־CRM.",
        points: ["אתרים עסקיים", "דפי נחיתה", "טפסי לידים", "זימון תורים"],
      },
    ],
    saasTitle: "מערכות SaaS לפי תחומי פעילות",
    saasLead: "המוצרים האלה קיימים ב־Bizuply. מכירת שותפים עדיין בקרוב ואינה זמינה לרכישה דרך התוכנית כעת. החברות אינה כוללת קוד מקור, זכויות White Label או זכות הפצה.",
    soon: "בקרוב",
    saas: ["BeautyFlow", "Global Properties", "Dinevo", "TableFlow", "Cliny"],
    commTitle: "מודל העמלות",
    commLead: "העמלות חלות רק על עסקאות ומנויים זכאים אחרי שההכנסה התקבלה. השיוך נעשה לפי רישום השותף. אין הבטחת הכנסה. העמוד אינו משנה נוסחאות שרת. ההסכם החתום קובע זכאות.",
    customers: "לקוחות משלמים פעילים",
    rate: "עמלה חוזרת",
    oneTime: "10% עמלה על עסקאות חד־פעמיות זכאיות",
    eligibility: [
      ["תנאי זכאות", "רק קטגוריות הכנסה שההסכם החתום מגדיר כזכאיות."],
      ["משך הזכאות", "כל עוד הלקוח משויך וזכאי לפי תנאי ההסכם."],
      ["החזרים וביטולים", "העמלה נגזרת מהכנסה שהתקבלה. החזרים וביטולים מפחיתים או הופכים עמלה שלא שולמה לפי ההסכם והספרים."],
      ["שיוך לקוחות", "השיוך נעשה במנגנון השיוך הקיים — כניסה לעמוד הזה לבדה אינה משייכת לקוח."],
    ],
    calcTitle: "מחשבון הכנסות",
    calcSimBadge: "המחשה בלבד",
    calcCustomers: "מספר לקוחות פעילים",
    calcPrice: "מחיר מנוי חודשי ממוצע (דולר)",
    calcTier: "שיעור עמלה לפי מסלול",
    calcOneTimeCount: "מספר עסקאות חד־פעמיות",
    calcOneTimeAvg: "סכום עסקה חד־פעמית ממוצעת (דולר)",
    revenue: "הערכת הכנסת מנוי חודשית זכאית",
    month: "הערכת עמלה חודשית חוזרת",
    year: "הערכת עמלה שנתית חוזרת",
    oneTimeResult: "הערכת עמלות חד־פעמיות",
    totalResult: "הכנסה כוללת לפי ההנחות שנבחרו",
    disclaimer: "סימולציה בלבד. לא תחזית ולא הבטחת הכנסה. ההכנסה בפועל תלויה בהכנסה זכאית, בשיוך, בתנאי העמלה, בשימור, בהחזרים ובהסכם שנחתם.",
    tracksTitle: "מסלולי שותפות",
    tracksLead: "מוצגים רק מסלולים שכבר קיימים חוזית או טכנית כפתוחים. אחרים דורשים הסכם או הזמנה ואינם בהרשמה עצמית.",
    tracksTableTitle: "Affiliate · Business Partner · Reseller במבט אחד",
    tracksTable: {
      fee: "דמי חברות",
      reward: "מודל תגמול",
      access: "גישה",
      rows: [
        ["Affiliate", "אין במסלול האחוזים", "כיום 15% ממכירות זכאיות לפי הקטלוג", "בדיקת מועמדות. בלי דמי חברות למרכז השותפים."],
        ["Business Partner", "499$ לחודש או 5,000$ לשנה אחרי אישור", "מדרגות 30% / 35% / 40% · 10% חד־פעמי", "מרכז השותפים אחרי הסכם ותשלום מאומת."],
        ["Reseller", "דמי הקמה וחודשי לפי המסלול בקטלוג", "markup-share לפי המסלול שמונה — לא טבלת המדרגות הבינלאומית", "לפי הסכם. לא נבחר אוטומטית בעמוד הזה."],
      ],
    },
    heroMediaCaption: "הקלטת CRM מורשית מסביבת הדמו המפורסמת של Bizuply.",
    primaryTracksTitle: "מסלולי הליבה",
    secondaryTracksTitle: "יכולות נוספות לפי הסכם",
    tracks: [
      {
        key: "Affiliate",
        title: "Affiliate",
        status: "זמין",
        who: "משווקים ומפנים שרוצים עמלה בלי דמי חברות.",
        allows: "הצגת Bizuply ועמלה על מכירות זכאיות במסלול האחוזים (partner_percent).",
        reward: "עמלת אחוז מהמכירה לפי הקטלוג (כיום 15% במסלול זה).",
        fee: "אין דמי חברות במסלול האחוזים.",
        approval: "נדרשת בדיקת מועמדות.",
        limits: "אין White Label. מוצרים שמסומנים כבקרוב אינם למכירת שותפים.",
      },
      {
        key: "Business Partner",
        title: "Business Partner",
        status: "פתוח להגשה",
        who: "סוכנויות, יועצים ואנשי צמיחה שבונים תיק לקוחות.",
        allows: "מינוי שותף בינלאומי עם גישה למרכז השותפים אחרי הפעלה.",
        reward: "מדרגות 30% / 35% / 40% ו־10% על עסקאות חד־פעמיות זכאיות.",
        fee: "5,000 דולר לשנה, או 499 דולר לחודש — תשלום רק אחרי אישור.",
        approval: "חובה. חתימה על הסכם ותשלום מאומת לפני הפעלה.",
        limits: "טריטוריה ובלעדיות נקבעות בנפרד. אין חיוב כרטיס אוטומטי מהעמוד.",
      },
      {
        key: "Reseller",
        title: "Reseller",
        status: "לפי הסכם",
        who: "צוותים שמיישמים ומוכרים את Bizuply כחלק משירות.",
        allows: "תנאים מסחריים ממסלולי Partner / Pro / Premium הקיימים כשממנים.",
        reward: "מודל markup-share לפי המסלול שמונה — לא טבלת המדרגות הבינלאומית.",
        fee: "דמי הקמה וחודשי לפי המסלול בקטלוג.",
        approval: "חובה. לא נבחר אוטומטית בעמוד הזה.",
        limits: "חייב להתאים למפתח מסלול קיים. אינו SKU חדש בהרשמה עצמית.",
      },
      {
        key: "White Label",
        title: "White Label",
        status: "יכולת ב־Premium",
        who: "שותפים שצריכים ממשק ללקוח תחת מותג עצמי כשהמסלול מאפשר.",
        allows: "הסתרת מיתוג Bizuply כשיש זכאות ב־Partner Premium.",
        reward: "אותו מודל מסחרי של המסלול בתשלום שמונה.",
        fee: "דורש מסלול בתשלום עם זכאות (יכולת Partner Premium בקטלוג).",
        approval: "חובה. כללי המותג בהסכם חלים.",
        limits: "אינו SKU ציבורי נפרד. קוד מקור אינו מועבר.",
      },
      {
        key: "Exclusive Territory",
        title: "Exclusive Territory",
        status: "לפי הסכם חתום",
        who: "שותפים שקיבלו בלעדיות לטריטוריה נקובה.",
        allows: "מינוי בלעדי רק כשההסכם קובע בלעדיות והטריטוריה פנויה.",
        reward: "תנאי העמלה נשארים לפי המסלול וההסכם.",
        fee: "אין דמי טריטוריה פרימיום נפרדים בעמוד. דמי חברות עדיין חלים כשנדרש.",
        approval: "שני הצדדים חותמים. התשלום הנדרש הושלם.",
        limits: "חיוב חודשי/שנתי של Business Partner לבדו אינו כולל בלעדיות.",
      },
      {
        key: "Strategic Partner",
        title: "Strategic Partner",
        status: "בהזמנה",
        who: "ארגונים נבחרים עם היקף אסטרטגי או אינטגרציה.",
        allows: "תנאים מסחריים ותפעוליים מותאמים כש־Bizuply מזמינה.",
        reward: "נקבע רק בהסכם האסטרטגי החתום.",
        fee: "נקבע רק בהסכם החתום.",
        approval: "הזמנה וחוזה. לא פתוח להרשמה עצמית.",
        limits: "אינו מופיע כמפתח מסלול פעיל בקטלוג.",
      },
    ],
    trackLabels: {
      who: "למי מתאים",
      allows: "מה מאפשר",
      reward: "איך מתוגמלים",
      fee: "דמי הצטרפות",
      approval: "אישור",
      limits: "מגבלות",
    },
    plansTitle: "חיוב Business Partner",
    perMonth: "לחודש",
    perYear: "לשנה",
    best: "Best Value",
    save: "חיסכון של $988 לעומת חיוב חודשי",
    monthlyPoints: ["חיוב חודשי", "בלי תשלום שנתי מראש", "אותן זכויות של שותף בינלאומי", "הזדמנויות לעמלה חוזרת", "גישה למשאבי שותף זכאים"],
    annualPoints: ["אותן זכויות של שותף בינלאומי", "הזדמנויות לעמלה חוזרת", "גישה למשאבי שותף זכאים", "חיוב שנתי מועדף"],
    planNotes: ["הגשת הבקשה ללא תשלום", "תשלום נדרש רק אחרי אישור", "תשלום ידני מחוץ לאתר", "אין חיוב אוטומטי", "כפוף להסכם השותפות"],
    noCharge: "העמוד הזה לא מתחיל חיוב אוטומטי.",
    due: "אחרי האישור, ועד לתיעוד התשלום הידני, החברות נשארת payment_due.",
    applyMonthly: "הגישו מועמדות לחברות חודשית",
    applyAnnual: "הגישו מועמדות לחברות שנתית",
    registerAfterApproval: "הרשמה מלאה (אחרי אישור)",
    territoryTitle: "הטריטוריה נקבעת בנפרד",
    territoryLead: "החיוב החודשי והשנתי אינו בוחר טריטוריה ואינו כולל בלעדיות.",
    territories: [
      ["מינוי לא בלעדי", "Bizuply רשאית למנות שותפים נוספים באותה טריטוריה."],
      ["טריטוריה בלעדית", "ניתנת רק כשההסכם החתום קובע בלעדיות, הטריטוריה פנויה, שני הצדדים חתמו, והתשלום הנדרש הושלם."],
    ],
    journeyTitle: "תהליך הצטרפות",
    steps: [
      ["מגישים מועמדות", "ספרו על העסק, הניסיון, המדינה ושוק היעד."],
      ["צוות Bizuply בוחן התאמה", "בודקים התאמה ואת התאמת השותפות."],
      ["מאשרים תנאים וחותמים על הסכם", "קוראים וחותמים על הסכם השותפות החל."],
      ["מתחילים לשווק דרך פורטל השותפים", "אחרי שתשלום נדרש למסלול אומת, מנהלים לקוחות במרכז השותפים."],
    ],
    trustTitle: "אמינות והוכחה עסקית",
    trustLead: "הוכחת תהליך — בלי מספר שותפים מומצא, בלי הכנסות מדומות ובלי לוגואים של לקוחות.",
    trust: [
      ["מי עומד מאחורי Bizuply", "Bizuply LLC מפתחת את הפלטפורמה העסקית, חיבור WhatsApp, אתרים, אוטומציות ושירותים מקצועיים נבחרים. תמיכה: support@bizuply.com."],
      ["מוצרים ושירותים זמינים", "CRM, WhatsApp Business API, כלי קמפיינים של Meta, בונה אתרים, תורים ואוטומציות פעילים. מוצרי SaaS לפי תחום מסומנים כבקרוב למכירת שותפים."],
      ["פורטל השותפים", "מרכז השותפים נפתח רק כשהשותף פעיל, ההסכם פעיל, והתשלום הנדרש אומת."],
      ["שיוך לקוחות", "השיוך נעשה ברישום השותף במערכת. שיתוף העמוד לבדו אינו משייך לקוח."],
      ["מעקב עמלות", "עמלות זכאיות נרשמות בספרי השותף. תשלומים לפי הכנסה שהתקבלה, החזרים וההסכם."],
    ],
    form: {
      title: "טופס מועמדות",
      lead: "טופס קצר. הגשה ללא תשלום. יוצר בקשה לבדיקה — לא אישור אוטומטי ולא חיוב.",
      name: "שם מלא",
      company: "שם חברה",
      email: "אימייל עסקי",
      phone: "טלפון",
      country: "מדינה",
      website: "אתר חברה",
      websiteOptional: "(אופציונלי)",
      track: "סוג שותפות מבוקש",
      about: "מידע קצר על פעילות החברה",
      submit: "שליחת מועמדות",
      sending: "שולחים…",
      successTitle: "המועמדות התקבלה",
      successBody: "הבקשה נשמרה במערכת. הצוות יבדוק ויחזור אליכם במייל. השלמת הרשמה ותשלום, אם נדרש, רק אחרי אישור.",
      errorGeneric: "לא הצלחנו לשמור את המועמדות כרגע. שלחו מייל ל־support@bizuply.com.",
      errorConsent: "לא הצלחנו לשמור את בחירת הפרטיות. נסו שוב או שלחו מייל ל־support@bizuply.com.",
      requiredHint: "שדה חובה",
      emailInvalid: "הזינו אימייל עסקי תקין",
      privacyNotice: "אנחנו משתמשים בפרטים לבדיקת מועמדות השותפות ולחזרה אליכם בנושא. ראו את",
      privacyAccept: "קראתי את מדיניות הפרטיות ואני מסכים/ה ש־Bizuply תעבד את פרטי המועמדות שלי.",
      privacyLink: "מדיניות הפרטיות",
      marketingOptIn: "אופציונלי: שלחו לי עדכונים על תוכנית השותפים (אפשר לבטל בכל עת).",
      trackLabels: {
        Affiliate: "Affiliate",
        "Business Partner": "Business Partner",
        Reseller: "Reseller",
        "White Label": "White Label",
        "Exclusive Territory": "Exclusive Territory",
        "Strategic Partner": "Strategic Partner",
      },
    },
    faqTitle: "שאלות נפוצות",
    closeTitle: "מוכנים להצטרף כשותפים של Bizuply?",
    closeBody: "הגישו קודם מועמדות ללא תשלום. הרשמה מלאה וכל תשלום חברות מתבצעים רק אחרי אישור.",
    closeCta: "הגישו מועמדות לשותפות",
    registerCta: "הרשמה מלאה (אחרי אישור)",
    login: "כניסת שותפים",
    visual: {
      caption: "המחשה של סביבת השותפים — לא נתוני חשבון אמיתיים",
      portal: "מרכז השותפים",
      clients: "לקוחות",
      commissions: "עמלות",
      sampleClient: "Northwind Studio",
      sampleStatus: "פעיל",
      sampleCommission: "דוגמת מדרגה",
      sampleNote: "המספרים כאן תוויות להמחשה בלבד.",
    },
  },
} as const;

type Copy = (typeof COPY)["en"];

function Rich({ text }: { text: string }) {
  const parts = text.split("payment_due");
  return (
    <>
      {parts.map((part, index) => (
        <span key={index}>
          {index > 0 ? <span className="ip-token">payment_due</span> : null}
          {part}
        </span>
      ))}
    </>
  );
}

export default function PartnersRecruitment() {
  const { i18n } = useTranslation();
  const hebrew = Boolean(i18n.language?.startsWith("he"));
  const copy = (hebrew ? COPY.he : COPY.en) as Copy;
  const dir = getTextDirection(i18n.language);
  const locale = hebrew ? "he" : "en";
  const faq = partnerFaqPairs(i18n.language);
  const canonical = marketingPublicUrl(PAGE_PATH, locale);
  const pageUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}`
      : canonical;

  const [options, setOptions] = useState<InternationalBillingOption[]>(INTERNATIONAL_BILLING_OPTIONS);
  const [customers, setCustomers] = useState(20);
  const [price, setPrice] = useState(99);
  const [oneTimeDeals, setOneTimeDeals] = useState(2);
  const [oneTimeAverage, setOneTimeAverage] = useState(500);
  const [stickyVisible, setStickyVisible] = useState(false);

  const primaryTracks = copy.tracks.filter((track) => PRIMARY_TRACK_KEYS.has(track.key));
  const secondaryTracks = copy.tracks.filter((track) => !PRIMARY_TRACK_KEYS.has(track.key));

  useEffect(() => {
    let cancelled = false;
    fetchPartnerPlans()
      .then((plans) => {
        if (cancelled) return;
        const international = (plans || []).find((plan) => plan.planKey === INTERNATIONAL_PLAN_KEY);
        if (international) setOptions(internationalBillingOptionsFromPlan(international));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".ipartner");
    if (!root) return undefined;
    return revealPartnersSections(root);
  }, [hebrew]);

  useEffect(() => {
    const apply = document.getElementById("apply");
    const hero = document.querySelector<HTMLElement>(".ip-hero");
    if (!apply) return undefined;

    const sync = () => {
      const applyRect = apply.getBoundingClientRect();
      const heroBottom = hero?.getBoundingClientRect().bottom ?? 0;
      const applyInView = applyRect.top < window.innerHeight * 0.85 && applyRect.bottom > 80;
      setStickyVisible(heroBottom < 0 && !applyInView);
    };

    let frame = 0;
    const onScroll = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(() => {
          frame = 0;
          sync();
        });
      }
    };
    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [hebrew]);

  const monthly = options.find((row) => row.interval === "monthly") || INTERNATIONAL_BILLING_OPTIONS[0];
  const annual = options.find((row) => row.interval === "annual") || INTERNATIONAL_BILLING_OPTIONS[1];
  const savings = annual.savingsUsd || 988;
  const annualHref = `/partner/register?planKey=${INTERNATIONAL_PLAN_KEY}&billing=annual`;
  const monthlyHref = `/partner/register?planKey=${INTERNATIONAL_PLAN_KEY}&billing=monthly`;
  const rate = commissionRateForCustomers(customers);
  const estimate = useMemo(
    () =>
      estimatePartnerCommission({
        customers,
        monthlyPrice: price,
        oneTimeDeals,
        oneTimeAverage,
        oneTimeRate: ONE_TIME_RATE,
      }),
    [customers, price, oneTimeDeals, oneTimeAverage]
  );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: hebrew ? "he" : "en",
    mainEntity: faq.map(([name, text]) => ({
      "@type": "Question",
      name,
      acceptedAnswer: { "@type": "Answer", text },
    })),
  };

  const hreflang = [
    { lang: "en", href: marketingPublicUrl(PAGE_PATH, "en") },
    { lang: "he", href: marketingPublicUrl(PAGE_PATH, "he") },
    { lang: "x-default", href: marketingPublicUrl(PAGE_PATH, "en") },
  ];

  return (
    <div className="ipartner" dir={dir} data-testid="partners-recruitment">
      <Helmet>
        <title>{copy.seoTitle}</title>
        <meta name="description" content={copy.seoDescription} />
        <link rel="canonical" href={canonical} />
        {hreflang.map((row) => (
          <link key={row.lang} rel="alternate" hrefLang={row.lang} href={row.href} />
        ))}
        <meta property="og:title" content={copy.seoTitle} />
        <meta property="og:description" content={copy.seoDescription} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <header className="ip-hero">
        <div className="ip-wrap ip-hero-grid">
          <div className="ip-hero-copy">
            <p className="ip-kicker">{copy.kicker}</p>
            <h1>{copy.h1}</h1>
            <p className="ip-sub">{copy.sub}</p>
            <div className="ip-actions">
              <a className="ip-btn ip-btn-primary" href="#apply">
                {copy.become}
              </a>
              <a className="ip-btn ip-btn-ghost" href="#how-it-works">
                {copy.explore}
              </a>
            </div>
          </div>
          <div className="ip-hero-media">
            <PartnerProductMedia
              hebrew={hebrew}
              priority
              product={{
                image: "/demo-media/crm/poster.jpg",
                alt: hebrew ? "הקלטת CRM מסביבת הדמו" : "CRM demo recording",
                video: "/demo-media/crm/crm-en.mp4",
                videoHe: "/demo-media/crm/crm-he.mp4",
                captions: "/demo-media/crm/crm.en.vtt",
                captionsHe: "/demo-media/crm/crm.he.vtt",
              }}
            />
            <p className="ip-hero-media-caption">{copy.heroMediaCaption}</p>
          </div>
        </div>
      </header>

      <section className="ip-section ip-open-tracks" data-testid="partner-track-compare" aria-labelledby="open-tracks-heading">
        <div className="ip-wrap">
          <p className="ip-kicker" id="open-tracks-heading">
            {copy.compareTitle}
          </p>
          <div className="ip-compare" aria-label={copy.compareTitle}>
            {copy.compare.map((track) => (
              <article
                key={track.key}
                className={`ip-compare-card${track.featured ? " is-featured" : ""}`}
                data-testid={`compare-${track.key}`}
              >
                <h2>{track.title}</h2>
                <p className="ip-compare-fee">{track.fee}</p>
                <p className="ip-compare-rate">{track.rate}</p>
              </article>
            ))}
          </div>
          <p className="ip-compare-note">{copy.compareNote}</p>
          <div className="ip-facts" aria-label={copy.kicker}>
            {copy.facts.map(([title, body]) => (
              <article key={title}>
                <strong>{title}</strong>
                <span>{body}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ip-section ip-reveal" id="benefits">
        <div className="ip-wrap">
          <h2>{copy.whyTitle}</h2>
          <p className="ip-copy">{copy.whyLead}</p>
          <div className="ip-editorial-list">
            {copy.why.map(([title, body], index) => (
              <article className="ip-editorial-item" key={title}>
                <span className="ip-editorial-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ip-section ip-band ip-reveal" id="products">
        <div className="ip-wrap">
          <h2>{copy.productsTitle}</h2>
          <p className="ip-copy">{copy.productsLead}</p>
          <div className="ip-products">
            {copy.products.map((product) => (
              <article
                className="ip-product"
                key={product.href}
                data-testid={`product-${product.href.replace(/^\//, "")}`}
              >
                <div className="ip-product-media">
                  <PartnerProductMedia hebrew={hebrew} product={product} />
                </div>
                <div className="ip-product-copy">
                  <h3>{product.title}</h3>
                  {"sell" in product && product.sell ? <p className="ip-sell">{product.sell}</p> : null}
                  <ul>
                    {product.points.slice(0, 4).map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  {"note" in product && product.note ? <p className="ip-note">{product.note}</p> : null}
                  <p className="ip-demo-caption">{copy.demoCaption}</p>
                  <p>
                    <Link className="ip-product-link" to={product.href}>
                      {product.title}
                    </Link>
                  </p>
                </div>
              </article>
            ))}
          </div>
          <aside className="ip-saas-block" aria-labelledby="saas-heading">
            <h3 className="ip-saas-heading" id="saas-heading">
              {copy.saasTitle}
            </h3>
            <p className="ip-copy">{copy.saasLead}</p>
            <div className="ip-saas-grid">
              {copy.saas.map((name) => (
                <article className="ip-saas" key={name}>
                  <span className="ip-badge">{copy.soon}</span>
                  <h3>{name}</h3>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="ip-section ip-reveal" id="commissions">
        <div className="ip-wrap">
          <h2>{copy.commTitle}</h2>
          <p className="ip-copy">{copy.commLead}</p>
          <div className="ip-table-wrap">
            <table className="ip-table">
              <thead>
                <tr>
                  <th>{copy.customers}</th>
                  <th>{copy.rate}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1–19</td>
                  <td>30%</td>
                </tr>
                <tr>
                  <td>20–39</td>
                  <td>35%</td>
                </tr>
                <tr>
                  <td>40+</td>
                  <td>40%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="ip-onetime">{copy.oneTime}</p>
          <div className="ip-editorial-list ip-eligibility">
            {copy.eligibility.map(([title, body], index) => (
              <article className="ip-editorial-item" key={title}>
                <span className="ip-editorial-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="ip-calc-heading-row">
            <h3 className="ip-calc-heading">{copy.calcTitle}</h3>
            <span className="ip-sim-badge">{copy.calcSimBadge}</span>
          </div>
          <form
            className="ip-calc"
            data-testid="partner-commission-calculator"
            onSubmit={(event) => event.preventDefault()}
          >
            <label>
              {copy.calcCustomers}
              <input
                type="number"
                min={0}
                value={customers}
                data-testid="calc-customers"
                onChange={(event) => setCustomers(Math.max(0, Math.round(Number(event.target.value) || 0)))}
              />
            </label>
            <label>
              {copy.calcPrice}
              <input
                type="number"
                min={0}
                value={price}
                data-testid="calc-price"
                onChange={(event) => setPrice(Math.max(0, Number(event.target.value) || 0))}
              />
            </label>
            <label>
              {copy.calcOneTimeCount}
              <input
                type="number"
                min={0}
                value={oneTimeDeals}
                data-testid="calc-onetime-count"
                onChange={(event) => setOneTimeDeals(Math.max(0, Math.round(Number(event.target.value) || 0)))}
              />
            </label>
            <label>
              {copy.calcOneTimeAvg}
              <input
                type="number"
                min={0}
                value={oneTimeAverage}
                data-testid="calc-onetime-avg"
                onChange={(event) => setOneTimeAverage(Math.max(0, Number(event.target.value) || 0))}
              />
            </label>
            <div className="ip-calc-tier">
              <p>{copy.calcTier}</p>
              <div className="ip-tiers">
                {[
                  [0.3, "30%"],
                  [0.35, "35%"],
                  [0.4, "40%"],
                ].map(([value, label]) => (
                  <button
                    key={String(label)}
                    type="button"
                    aria-pressed={rate === value}
                    onClick={() => setCustomers(tierCount(Number(value)))}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="ip-results" dir="ltr">
              <div>
                <span>{copy.revenue}</span>
                <strong data-testid="calc-revenue">{money(estimate.monthlyRevenue)}</strong>
              </div>
              <div>
                <span>{copy.month}</span>
                <strong data-testid="calc-month">{money(estimate.monthlyCommission)}</strong>
              </div>
              <div>
                <span>{copy.year}</span>
                <strong data-testid="calc-year">{money(estimate.annualCommission)}</strong>
              </div>
              <div>
                <span>{copy.oneTimeResult}</span>
                <strong data-testid="calc-onetime">{money(estimate.oneTimeCommission)}</strong>
              </div>
              <div className="ip-results-total">
                <span>{copy.totalResult}</span>
                <strong data-testid="calc-total">{money(estimate.totalIllustrated)}</strong>
              </div>
            </div>
            <p className="ip-note ip-calc-note">{copy.disclaimer}</p>
          </form>
        </div>
      </section>

      <section className="ip-section ip-band ip-reveal" id="tracks">
        <div className="ip-wrap">
          <h2>{copy.tracksTitle}</h2>
          <p className="ip-copy">{copy.tracksLead}</p>
          <div className="ip-table-wrap ip-tracks-table" data-testid="partner-tracks-table">
            <table className="ip-table">
              <caption className="ip-sr-only">{copy.tracksTableTitle}</caption>
              <thead>
                <tr>
                  <th scope="col">{copy.tracksTableTitle}</th>
                  <th scope="col">{copy.tracksTable.fee}</th>
                  <th scope="col">{copy.tracksTable.reward}</th>
                  <th scope="col">{copy.tracksTable.access}</th>
                </tr>
              </thead>
              <tbody>
                {copy.tracksTable.rows.map(([name, fee, reward, access]) => (
                  <tr key={name} className={name === "Business Partner" ? "is-featured-row" : undefined}>
                    <th scope="row">{name}</th>
                    <td>{fee}</td>
                    <td>{reward}</td>
                    <td>{access}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="ip-subsection-title">{copy.primaryTracksTitle}</h3>
          <div className="ip-tracks ip-tracks-primary">
            {primaryTracks.map((track) => (
              <article
                className={`ip-track is-primary${track.key === "Business Partner" ? " is-featured" : ""}`}
                key={track.key}
                data-testid={`track-${track.key}`}
              >
                <div className="ip-track-head">
                  <h3>{track.title}</h3>
                  <span className="ip-status">{track.status}</span>
                </div>
                <dl>
                  <div>
                    <dt>{copy.trackLabels.who}</dt>
                    <dd>{track.who}</dd>
                  </div>
                  <div>
                    <dt>{copy.trackLabels.allows}</dt>
                    <dd>{track.allows}</dd>
                  </div>
                  <div>
                    <dt>{copy.trackLabels.reward}</dt>
                    <dd>{track.reward}</dd>
                  </div>
                  <div>
                    <dt>{copy.trackLabels.fee}</dt>
                    <dd>{track.fee}</dd>
                  </div>
                  <div>
                    <dt>{copy.trackLabels.approval}</dt>
                    <dd>{track.approval}</dd>
                  </div>
                  <div>
                    <dt>{copy.trackLabels.limits}</dt>
                    <dd>{track.limits}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>

          <h3 className="ip-subsection-title">{copy.secondaryTracksTitle}</h3>
          <div className="ip-tracks ip-tracks-secondary">
            {secondaryTracks.map((track) => (
              <article className="ip-track is-secondary" key={track.key} data-testid={`track-${track.key}`}>
                <div className="ip-track-head">
                  <h3>{track.title}</h3>
                  <span className="ip-status">{track.status}</span>
                </div>
                <dl>
                  <div>
                    <dt>{copy.trackLabels.who}</dt>
                    <dd>{track.who}</dd>
                  </div>
                  <div>
                    <dt>{copy.trackLabels.allows}</dt>
                    <dd>{track.allows}</dd>
                  </div>
                  <div>
                    <dt>{copy.trackLabels.fee}</dt>
                    <dd>{track.fee}</dd>
                  </div>
                  <div>
                    <dt>{copy.trackLabels.limits}</dt>
                    <dd>{track.limits}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ip-section ip-reveal" id="plans">
        <div className="ip-wrap">
          <h2>{copy.plansTitle}</h2>
          <div className="ip-plans" data-testid="international-price-cards">
            <article className="ip-plan" data-testid="monthly-price-card">
              <h3>{hebrew ? monthly.labelHe : monthly.labelEn}</h3>
              <p className="ip-price" data-testid="international-monthly-price">
                {money(monthly.amountUsd)} <span>{copy.perMonth}</span>
              </p>
              <ul>
                {copy.monthlyPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <a className="ip-btn ip-btn-ghost" href="#apply" data-testid="international-monthly-link">
                {copy.applyMonthly}
              </a>
              <Link className="ip-btn ip-btn-ghost" to={monthlyHref} data-testid="international-monthly-register-link">
                {copy.registerAfterApproval}
              </Link>
            </article>
            <article className="ip-plan ip-plan-best" data-testid="annual-price-card">
              <span className="ip-badge" data-testid="annual-best-value">
                {copy.best}
              </span>
              <h3>{hebrew ? annual.labelHe : annual.labelEn}</h3>
              <p className="ip-price" data-testid="international-annual-price">
                {money(annual.amountUsd)} <span>{copy.perYear}</span>
              </p>
              <p className="ip-save" data-testid="annual-savings">
                {copy.save.replace("$988", money(savings))}
              </p>
              <ul>
                {copy.annualPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <a className="ip-btn ip-btn-primary" href="#apply" data-testid="international-register-link">
                {copy.applyAnnual}
              </a>
              <Link className="ip-btn ip-btn-ghost" to={annualHref} data-testid="international-annual-register-link">
                {copy.registerAfterApproval}
              </Link>
            </article>
          </div>
          <ul className="ip-plan-notes">
            {copy.planNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
            <li>{copy.noCharge}</li>
            <li>
              <Rich text={copy.due} />
            </li>
          </ul>
          <h3>{copy.territoryTitle}</h3>
          <p className="ip-copy">{copy.territoryLead}</p>
          <div className="ip-editorial-list">
            {copy.territories.map(([title, body], index) => (
              <article className="ip-editorial-item" key={title}>
                <span className="ip-editorial-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ip-section ip-band ip-reveal" id="how-it-works">
        <div className="ip-wrap">
          <h2>{copy.journeyTitle}</h2>
          <div className="ip-steps">
            {copy.steps.map(([title, body], index) => (
              <article className="ip-step" key={title}>
                <span className="ip-num">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ip-section ip-reveal" id="trust">
        <div className="ip-wrap">
          <h2>{copy.trustTitle}</h2>
          <p className="ip-copy">{copy.trustLead}</p>
          <div className="ip-editorial-list">
            {copy.trust.map(([title, body], index) => (
              <article className="ip-editorial-item" key={title}>
                <span className="ip-editorial-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ip-section ip-band ip-reveal" id="apply" aria-labelledby="apply-heading">
        <div className="ip-wrap">
          <PartnerApplyForm copy={copy.form} pageUrl={pageUrl} locale={locale} />
        </div>
      </section>

      <section className="ip-section ip-faq ip-reveal" id="faq">
        <div className="ip-wrap">
          <h2>{copy.faqTitle}</h2>
          {faq.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>
                <Rich text={answer} />
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="ip-section">
        <div className="ip-wrap">
          <div className="ip-close">
            <h2>{copy.closeTitle}</h2>
            <p>{copy.closeBody}</p>
            <div className="ip-actions">
              <a className="ip-btn ip-btn-primary" href="#apply">
                {copy.closeCta}
              </a>
              <Link className="ip-btn ip-btn-ghost ip-btn-on-dark" to={annualHref}>
                {copy.registerCta}
              </Link>
              <Link className="ip-btn ip-btn-ghost ip-btn-on-dark" to="/login">
                {copy.login}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div
        className={`ip-sticky-join${stickyVisible ? " is-visible" : ""}`}
        data-testid="partner-sticky-join"
        aria-hidden={!stickyVisible}
      >
        <div className="ip-sticky-join__inner">
          <p className="ip-sticky-join__copy">{copy.stickyJoin}</p>
          <a
            className="ip-btn ip-btn-primary"
            href="#apply"
            tabIndex={stickyVisible ? 0 : -1}
            onClick={(event) => {
              const target = document.getElementById("apply");
              if (!target) return;
              event.preventDefault();
              target.classList.add("is-in");
              target.scrollIntoView({ behavior: "smooth", block: "start" });
              window.history.replaceState(null, "", "#apply");
            }}
          >
            {copy.stickyCta}
          </a>
        </div>
      </div>
    </div>
  );
}
