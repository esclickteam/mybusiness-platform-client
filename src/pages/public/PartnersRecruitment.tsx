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
import PartnerPortalVisual from "./partners/PartnerPortalVisual";
import {
  ONE_TIME_RATE,
  commissionRateForCustomers,
  estimatePartnerCommission,
  money,
  tierCount,
} from "./partners/partnersCommission.mjs";
import "./partners/partnersPage.css";

export { commissionRateForCustomers, estimatePartnerCommission } from "./partners/partnersCommission.mjs";

const PAGE_PATH = "/partners";

const COPY = {
  en: {
    seoTitle: "Bizuply Partner Program | Build recurring revenue with CRM and SaaS",
    seoDescription:
      "Apply to the Bizuply Partner Program. Offer CRM, WhatsApp, automation and SaaS. Eligible recurring commission is 30% to 40%. Business Partner membership is $5,000 per year or $499 per month after approval.",
    kicker: "Bizuply Partner Program",
    h1: "Build businesses. Expand opportunities. Earn together.",
    sub: "Join the Bizuply Partner Program. Introduce businesses to CRM, automation, WhatsApp and SaaS systems, and grow with a recurring commission model.",
    become: "Apply for partnership",
    explore: "See how the program works",
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
    productsLead: "Product categories available through Bizuply today. Screens come from the published demo workspace, not from a customer account.",
    products: [
      {
        title: "CRM & customer management",
        href: "/crm",
        image: "/demo-media/crm/leads-list.png",
        alt: "Bizuply demo CRM lead list",
        points: ["Customer relationship management", "Lead tracking", "Sales pipelines", "Customer records", "Follow-up workflows"],
      },
      {
        title: "WhatsApp Business API & campaigns",
        href: "/whatsapp-api",
        image: "/demo-media/whatsapp/poster.jpg",
        alt: "Bizuply demo WhatsApp inbox",
        note: "Use is subject to Meta policy, approvals and messaging costs.",
        points: ["Official WhatsApp Business API", "Business messaging", "Approved templates", "Campaign-related workflows"],
      },
      {
        title: "Business automations",
        href: "/automations",
        image: "/demo-media/automations/poster.jpg",
        alt: "Bizuply automation workspace",
        points: ["Automated follow-ups", "Lead routing", "Workflow automation", "Supported integrations"],
      },
      {
        title: "Websites & digital tools",
        href: "/website-builder",
        image: "/demo-media/websites/my-sites.jpg",
        alt: "Bizuply website workspace",
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
    applyMonthly: "Apply monthly",
    applyAnnual: "Apply annually",
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
      requiredHint: "Required",
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
    closeBody: "Submit an application or continue to the full partner registration once you know which billing interval you want after approval.",
    closeCta: "Apply for partnership",
    registerCta: "Open full registration",
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
      "הגישו מועמדות לתוכנית השותפים של Bizuply. הציעו CRM, WhatsApp, אוטומציה ו־SaaS. עמלה חוזרת זכאית 30% עד 40%. מסלול Business Partner: 5,000 דולר לשנה או 499 דולר לחודש אחרי אישור.",
    kicker: "תוכנית השותפים של Bizuply",
    h1: "בונים עסק. מרחיבים הזדמנויות. מרוויחים יחד.",
    sub: "הצטרפו לתוכנית השותפים של Bizuply, הציעו לעסקים פתרונות CRM, אוטומציה, WhatsApp ומערכות SaaS, ובנו פעילות עסקית עם מודל עמלות מתמשך.",
    become: "הגישו מועמדות לשותפות",
    explore: "גלו איך התוכנית עובדת",
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
    productsLead: "קטגוריות מוצרים שזמינות ב־Bizuply היום. הצילומים מסביבת הדמו המפורסמת, לא מחשבון לקוח.",
    products: [
      {
        title: "CRM וניהול לקוחות",
        href: "/crm",
        image: "/demo-media/crm/leads-list.png",
        alt: "רשימת לידים בסביבת הדמו של Bizuply",
        points: ["ניהול קשרי לקוחות", "מעקב לידים", "צינורות מכירה", "כרטיסי לקוח", "תהליכי המשך טיפול"],
      },
      {
        title: "WhatsApp Business API וקמפיינים",
        href: "/whatsapp-api",
        image: "/demo-media/whatsapp/poster.jpg",
        alt: "תיבת דואר של WhatsApp בסביבת הדמו",
        note: "השימוש כפוף למדיניות Meta, לאישורים ולעלויות ההודעות.",
        points: ["WhatsApp Business API רשמי", "מסרים עסקיים", "תבניות מאושרות", "תהליכים לקמפיינים"],
      },
      {
        title: "אוטומציות עסקיות",
        href: "/automations",
        image: "/demo-media/automations/poster.jpg",
        alt: "סביבת האוטומציות של Bizuply",
        points: ["המשך טיפול אוטומטי", "ניתוב לידים", "אוטומציית תהליכים", "חיבורים נתמכים"],
      },
      {
        title: "אתרים וכלים דיגיטליים",
        href: "/website-builder",
        image: "/demo-media/websites/my-sites.jpg",
        alt: "סביבת האתרים של Bizuply",
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
    applyMonthly: "הרשמה חודשית",
    applyAnnual: "הרשמה שנתית",
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
      requiredHint: "שדה חובה",
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
    closeBody: "הגישו מועמדות או המשיכו להרשמה המלאה כשתדעו איזה מרווח חיוב תרצו אחרי האישור.",
    closeCta: "הגישו מועמדות לשותפות",
    registerCta: "להרשמה המלאה",
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
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".ip-reveal"));
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver !== "function") {
      nodes.forEach((node) => node.classList.add("is-in"));
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-in");
        });
      },
      { threshold: 0.12 }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
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
          <div>
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
          <PartnerPortalVisual copy={copy.visual} />
        </div>
        <div className="ip-wrap ip-facts" aria-label={copy.kicker}>
          {copy.facts.map(([title, body]) => (
            <article key={title}>
              <strong>{title}</strong>
              <span>{body}</span>
            </article>
          ))}
        </div>
      </header>

      <section className="ip-section ip-reveal" id="benefits">
        <div className="ip-wrap">
          <h2>{copy.whyTitle}</h2>
          <p className="ip-copy">{copy.whyLead}</p>
          <div className="ip-grid-3">
            {copy.why.map(([title, body]) => (
              <article className="ip-card" key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
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
              <article className="ip-product" key={product.href}>
                <figure className="ip-shot">
                  <img src={product.image} alt={product.alt} width="960" height="600" loading="lazy" />
                </figure>
                <div>
                  <h3>{product.title}</h3>
                  <ul>
                    {product.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  {"note" in product && product.note ? <p className="ip-note">{product.note}</p> : null}
                  <p>
                    <Link to={product.href}>{product.title}</Link>
                  </p>
                </div>
              </article>
            ))}
          </div>
          <h3 className="ip-saas-heading">{copy.saasTitle}</h3>
          <p className="ip-copy">{copy.saasLead}</p>
          <div className="ip-saas-grid">
            {copy.saas.map((name) => (
              <article className="ip-saas" key={name}>
                <span className="ip-badge">{copy.soon}</span>
                <h3>{name}</h3>
              </article>
            ))}
          </div>
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
          <div className="ip-grid-2 ip-eligibility">
            {copy.eligibility.map(([title, body]) => (
              <article className="ip-card" key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>

          <h3 className="ip-calc-heading">{copy.calcTitle}</h3>
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
          <div className="ip-tracks">
            {copy.tracks.map((track) => (
              <article className="ip-track" key={track.key} data-testid={`track-${track.key}`}>
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
              <Link className="ip-btn ip-btn-ghost" to={monthlyHref} data-testid="international-monthly-link">
                {copy.applyMonthly}
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
              <Link className="ip-btn ip-btn-primary" to={annualHref} data-testid="international-register-link">
                {copy.applyAnnual}
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
          <div className="ip-grid-2">
            {copy.territories.map(([title, body]) => (
              <article className="ip-card" key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
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
                <span className="ip-num">{index + 1}</span>
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
          <div className="ip-grid-2">
            {copy.trust.map(([title, body]) => (
              <article className="ip-card" key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ip-section ip-band ip-reveal" id="apply" aria-labelledby="apply-heading">
        <div className="ip-wrap">
          <PartnerApplyForm copy={copy.form} pageUrl={pageUrl} />
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
    </div>
  );
}
