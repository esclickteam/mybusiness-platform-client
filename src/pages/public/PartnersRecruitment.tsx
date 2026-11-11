import { useEffect, useMemo, useState, type ReactNode } from "react";
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
import {
  ONE_TIME_RATE,
  RECURRING_TIERS,
  commissionRateForCustomers,
  estimatePartnerCommission,
  money,
  tierCount,
} from "./partners/partnersCommission.mjs";
import "./partners/partnersPage.css";

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

function signedMoney(amount: number) {
  const rounded = Math.round(Number(amount) || 0);
  const body = `$${Math.abs(rounded).toLocaleString("en-US")}`;
  return rounded < 0 ? `-${body}` : body;
}

function Mark({ name }: { name: string }) {
  const p = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "square" as const,
    strokeLinejoin: "miter" as const,
    "aria-hidden": true as const,
  };
  const paths: Record<string, ReactNode> = {
    agency: (
      <svg {...p}>
        <path d="M3 20V9l9-6 9 6v11" />
        <path d="M9 20v-6h6v6" />
      </svg>
    ),
    consult: (
      <svg {...p}>
        <circle cx="12" cy="8" r="3" />
        <path d="M5 20c1.4-3 3.8-4.5 7-4.5S17.6 17 19 20" />
      </svg>
    ),
    build: (
      <svg {...p}>
        <path d="M4 20h16" />
        <path d="M6 20V8h12v12" />
        <path d="M9 12h2M13 12h2M9 16h2M13 16h2" />
      </svg>
    ),
    flow: (
      <svg {...p}>
        <path d="M5 7h6v4H5zM13 13h6v4h-6z" />
        <path d="M8 11v2h5v-2" />
      </svg>
    ),
    market: (
      <svg {...p}>
        <path d="M4 10h16l-1.2 9H5.2z" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </svg>
    ),
    venture: (
      <svg {...p}>
        <path d="M12 3v18" />
        <path d="M12 7l6 2-6 2-6-2z" />
        <path d="M7 16h10" />
      </svg>
    ),
    repeat: (
      <svg {...p}>
        <path d="M5 8h11l-2-2" />
        <path d="M19 16H8l2 2" />
        <path d="M16 6v4M8 14v4" />
      </svg>
    ),
    people: (
      <svg {...p}>
        <circle cx="8" cy="9" r="2.2" />
        <circle cx="16" cy="9" r="2.2" />
        <path d="M3.5 19c.8-2.4 2.4-3.6 4.5-3.6s3.7 1.2 4.5 3.6" />
        <path d="M12 19c.6-2 2-3.2 4-3.2 2.1 0 3.5 1.2 4.3 3.2" />
      </svg>
    ),
    portal: (
      <svg {...p}>
        <path d="M4 5h16v14H4z" />
        <path d="M4 9h16M9 9v10" />
      </svg>
    ),
    box: (
      <svg {...p}>
        <path d="M3 8l9-4 9 4-9 4z" />
        <path d="M3 8v8l9 4 9-4V8" />
        <path d="M12 12v8" />
      </svg>
    ),
    book: (
      <svg {...p}>
        <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3z" />
        <path d="M5 4v16" />
      </svg>
    ),
    life: (
      <svg {...p}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l3 2" />
      </svg>
    ),
  };
  return <span className="ip-icon">{paths[name] || null}</span>;
}

const COPY = {
  en: {
    seoTitle: "Bizuply Partner Program | Build Your Business with Bizuply",
    seoDescription:
      "Partner with Bizuply. Introduce CRM, WhatsApp Business API, Meta campaigns, automations and websites. Business Partner membership is $499 per month or $5,000 per year after approval. Eligible recurring commission is 30%, 35% or 40%.",
    kicker: "Bizuply Partner Program",
    h1: "Build Your Business with Bizuply",
    sub: "Partner with Bizuply. Grow Your Revenue.",
    heroBody:
      "Join the Bizuply Partner Program and turn advanced technology into an ongoing business opportunity. Market CRM, automations, WhatsApp Business API and SaaS systems, and build revenue from paying customers. Commission applies only to eligible revenue that was actually received. Income is not guaranteed.",
    become: "Become a Partner",
    explore: "Explore Partner Benefits",
    heroFacts: [
      "Business Partner: $499 / month or $5,000 / year after approval.",
      "Recurring commission: 30% / 35% / 40% on eligible subscription revenue.",
      "Affiliate: currently 15% of eligible catalog sales. No membership fee.",
    ],
    signals: [
      ["40%", "Up to 40% Recurring Commission", "The top published tier, for 40 or more active paying customers, on eligible subscription revenue that was received."],
      ["Recurring", "Build Recurring Revenue", "Commission can continue while an eligible customer stays attributed. Income is not guaranteed."],
      ["Global", "Global Partner Program", "Market inside the territory named in the agreement. Membership does not grant exclusivity."],
    ],
    stickyJoin: "Ready to apply?",
    stickyCta: "Become a Partner",
    audienceTitle: "Who the program is for",
    audienceLead:
      "The program is for businesses that introduce Bizuply to customers. Every application is reviewed. Sending the form does not approve a partnership.",
    audience: [
      ["agency", "Marketing and advertising agencies", "Introduce CRM, WhatsApp and campaign tools to businesses you already serve."],
      ["consult", "Business consultants", "Add a technology offer beside advisory work, limited to products the agreement allows."],
      ["build", "Development and website companies", "Pair the websites and automations you deliver with Bizuply products approved for partner sale."],
      ["flow", "Automation specialists", "Offer workflow automation that already exists in Bizuply."],
      ["market", "Software marketers", "Present products Bizuply already operates, instead of building a platform."],
      ["venture", "Entrepreneurs and other businesses", "Apply to introduce Bizuply to paying customers. Commission follows eligible received revenue. It is not a salary and it is not guaranteed."],
    ],
    whyTitle: "Partner benefits",
    whyLead:
      "These are rights that already exist in the program. Nothing here adds a service, a payout, or an income promise the agreement does not cover.",
    why: [
      ["repeat", "40%", "Recurring commission", "Commission on eligible subscription revenue that was actually received, while the customer stays attributed and eligible."],
      ["people", "10%", "One-time deals", "Eligible one-time transactions earn 10%. The signed agreement decides what is eligible."],
      ["portal", "Center", "Partner Center", "When the partner is active, the agreement is active, and required payment is verified, the Partner Center shows clients, attribution and commissions."],
      ["box", "5", "Solutions to market", "CRM, WhatsApp Business API, Meta campaigns, automations and websites that exist in Bizuply today, when the agreement allows them."],
      ["book", "Open", "Published resources", "Onboarding, published training and approved materials while the membership is active."],
      ["life", "Care", "Support under the agreement", "Platform support is available at support@bizuply.com. The agreement sets the scope."],
    ],
    productsTitle: "What partners can sell",
    productsLead:
      "Solutions that exist in Bizuply today. Each card names the value for the customer and the opportunity for the partner. Industry SaaS resale is not open yet.",
    marketTitle: "Marketing & automations",
    marketLead: "Two tools that already sit beside CRM. They are not a separate membership price.",
    offers: [
      {
        id: "crm",
        layout: "lead",
        icon: "people",
        title: "CRM & Lead Management",
        href: "/crm",
        value: "Customers keep leads, pipelines and follow-ups in one place.",
        partner: "Introduce a CRM that already runs in Bizuply, when the agreement allows it.",
        link: "View CRM",
      },
      {
        id: "whatsapp-api",
        layout: "side",
        icon: "flow",
        title: "WhatsApp Business API",
        href: "/whatsapp-api",
        value: "Businesses message customers through the official WhatsApp Business API.",
        partner: "Offer templates and business messaging. Use stays subject to Meta policy, approvals and messaging costs.",
        link: "View WhatsApp API",
      },
      {
        id: "meta-campaigns",
        layout: "pair",
        icon: "market",
        title: "Meta campaigns — Facebook & Instagram Ads",
        href: "/meta-campaigns",
        value: "Lead Ads can enter the CRM with source and status for follow-up.",
        partner: "Included with the Bizuply Business plan after an authorized Meta ad account is connected. Partners earn on eligible Bizuply subscription revenue, not on Meta ad spend.",
        link: "View Meta campaigns",
      },
      {
        id: "automations",
        layout: "pair",
        icon: "repeat",
        title: "Business automations",
        href: "/automations",
        value: "Follow-ups and lead routing can run as defined workflows.",
        partner: "Market automation that already exists in Bizuply, when the agreement allows it.",
        link: "View automations",
      },
      {
        id: "website-builder",
        layout: "wide",
        icon: "build",
        title: "Websites & digital solutions",
        href: "/website-builder",
        value: "A business site or landing page can capture leads into CRM.",
        partner: "Offer websites, landing pages and booking that the agreement allows.",
        link: "View websites",
      },
    ],
    saasTitle: "SaaS platforms",
    saasLead:
      "These products exist in Bizuply. Partner resale is coming soon and is not available for purchase through this program yet. Membership does not include source code, white-label rights or a distribution right.",
    soon: "Coming soon",
    saas: ["BeautyFlow", "Global Properties", "Dinevo", "TableFlow", "Cliny"],
    levelsTitle: "Partner levels",
    levelsLead:
      "These are commission tiers, not three subscription prices. The rate follows the number of active paying customers on eligible subscription revenue that was actually received. You do not buy a tier.",
    tierBands: [
      { range: "1–19 active paying customers", rate: "30%" },
      { range: "20–39 active paying customers", rate: "35%" },
      { range: "40 or more active paying customers", rate: "40%" },
    ],
    tierMove:
      "The rate follows that current count. It rises when the count enters the next band, and it falls when the count drops below a band. Only eligible subscription revenue that was actually received is counted, under the signed agreement.",
    customers: "Active paying customers",
    oneTime: "10% commission on eligible one-time transactions",
    eligibility: [
      ["Eligibility", "Only revenue categories named as eligible in the signed agreement."],
      ["Duration", "While the customer remains attributed and eligible under the agreement terms."],
      ["Refunds and cancellations", "Commission follows received revenue. Refunds and cancellations reverse or reduce unpaid commission as the agreement and ledger require."],
      ["Attribution", "A customer is attributed through the existing partner attribution record — not by visiting this page alone."],
    ],
    compareTitle: "Affiliate · Business Partner · Reseller",
    compareNote:
      "Verified commercial terms. Application is free. Membership fees are collected only after approval. Reseller is by appointment — not self-serve on this page.",
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
        fee: "Setup and monthly fees follow the plan named in the agreement.",
        rate: "A share of the catalog markup on that plan. Not the 30%, 35% or 40% tiers. By written agreement only.",
        featured: false,
      },
    ],
    tracksTableTitle: "Affiliate · Business Partner · Reseller at a glance",
    tracksTable: {
      name: "Track",
      fee: "Membership fee",
      reward: "Reward model",
      access: "Access",
      rows: [
        ["Affiliate", "None on the percent track", "Currently 15% of eligible sales in the catalog", "Application review. No Partner Center membership fee."],
        ["Business Partner", "$499 / month or $5,000 / year after approval", "Recurring 30% / 35% / 40% · 10% one-time", "Partner Center after agreement and verified payment."],
        ["Reseller", "Setup and monthly fees follow the plan named in the agreement", "A share of the catalog markup on that plan. Not the 30%, 35% or 40% tiers", "By written agreement. Not selected automatically on this page."],
      ],
    },
    plansTitle: "Partner membership",
    perMonth: "/ month",
    perYear: "/ year",
    best: "Best value",
    save: "Save $988 a year compared with 12 monthly payments.",
    saveMath: "Twelve monthly payments are {monthlyYear}. The annual membership is {annual}.",
    monthlyPoints: [
      "Monthly billing at $499. No annual payment in advance.",
      "Recurring commission of 30%, 35% or 40% on eligible subscription revenue that was received.",
      "10% on eligible one-time deals.",
      "Partner Center after a signed agreement and verified payment.",
      "CRM, WhatsApp Business API, Meta campaigns, automations and websites, when the agreement allows them.",
      "Published partner materials, and platform support at support@bizuply.com, while the membership is active.",
    ],
    annualPoints: [
      "The same Business Partner benefits: Partner Center, the products the agreement allows, published materials and platform support.",
      "Recurring commission of 30%, 35% or 40% on eligible subscription revenue that was received.",
      "10% on eligible one-time deals.",
      "Annual billing at $5,000.",
    ],
    planNotes: ["The application is free", "Payment is required only after approval", "Manual payment outside the website", "No automatic charging", "Subject to the partnership agreement"],
    noCharge: "This page does not start a live charge.",
    due: "After approval, and until the manual payment is recorded, the membership is not yet active.",
    applyMonthly: "Apply for monthly membership",
    applyAnnual: "Apply for annual membership",
    registerAfterApproval: "Full registration (after approval)",
    territoryTitle: "Territory is agreed separately",
    territoryLead: "Monthly and annual billing do not choose a territory and do not include exclusivity.",
    territories: [
      ["Non-exclusive appointment", "Bizuply may appoint other partners in the same territory."],
      ["Exclusive territory", "Granted only when the signed agreement says exclusive, the territory is available, both parties have signed, and required payment is complete."],
    ],
    calcTitle: "Revenue calculator",
    calcSimBadge: "Illustration only",
    calcCustomers: "Active paying customers",
    calcPrice: "Average monthly subscription price (USD)",
    calcTier: "Commission tier",
    calcTierNote: "The tier follows the customer count. Choosing a tier sets the qualifying count. It does not change the formula.",
    calcOneTimeCount: "Number of one-time deals",
    calcOneTimeAvg: "Average one-time deal amount (USD)",
    calcBilling: "Membership used in the balance",
    calcBillingMonthly: "Monthly membership",
    calcBillingAnnual: "Annual membership",
    revenue: "Estimated eligible monthly subscription revenue",
    month: "Estimated monthly recurring commission",
    year: "Estimated annual recurring commission",
    oneTimeResult: "Estimated one-time commissions",
    totalResult: "Estimated total under your assumptions",
    calcMembership: "Membership cost",
    calcMembershipMonthlyNote: "Per month. The balance subtracts twelve monthly fees ({year}).",
    calcMembershipAnnualNote: "Per year. The balance subtracts this annual fee.",
    calcBalance: "Illustrated balance after membership fees only",
    calcBalanceNote:
      "Annual recurring commission minus the selected membership cost for a year. One-time commissions stay in their own line and are not part of this balance. This is not net profit after other expenses.",
    disclaimer:
      "Simulation only. Not a forecast, an income guarantee, or net profit after every expense. Actual earnings depend on eligible revenue, attribution, commission terms, retention, refunds and the executed agreement.",
    journeyTitle: "How it works",
    steps: [
      ["Apply", "Submit an application. It is free. Sending the form does not approve the partnership and does not charge a card."],
      ["Get Approved", "Bizuply reviews the request and explains the partnership terms. Activation follows the signed agreement and, when a fee applies, a verified manual payment."],
      ["Start Growing", "After approval and activation, market the solutions the agreement allows and run the activity in the Partner Center."],
    ],
    form: {
      title: "Partner application",
      lead: "Free to submit. This saves a review request in Bizuply. It is not an approval and it is not a charge.",
      name: "Full name",
      company: "Company name",
      email: "Business email",
      phone: "Phone",
      dialCode: "Calling code",
      country: "Country",
      website: "Company website",
      websiteOptional: "(if you have one)",
      track: "Requested partnership type",
      activity: "Field of activity",
      experience: "Prior sales or partnership experience",
      customersLabel: "Existing business customers",
      customersOptional: "(if relevant)",
      about: "Additional message",
      submit: "Submit application",
      sending: "Sending…",
      successTitle: "Application received",
      successBody:
        "Your application was saved. Our team will review it and follow up by email. Completing registration and any payment happens only after approval.",
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
    closeCta: "Become a Partner",
    registerCta: "Full registration (after approval)",
    login: "Partner sign in",
  },
  he: {
    seoTitle: "תוכנית השותפים של Bizuply | בנו את העסק שלכם עם Bizuply",
    seoDescription:
      "שותפות עם Bizuply. הציעו CRM, WhatsApp Business API, קמפיינים במטא, אוטומציות ואתרים. חברות Business Partner: 499 דולר לחודש או 5,000 דולר לשנה אחרי אישור. עמלה חוזרת זכאית: 30%, 35% או 40%.",
    kicker: "תוכנית השותפים של Bizuply",
    h1: "בנו את העסק שלכם עם Bizuply",
    sub: "שותפות עם Bizuply. הגדילו את ההכנסות.",
    heroBody:
      "הצטרפו לתוכנית השותפים של Bizuply והפכו פתרונות טכנולוגיים מתקדמים להזדמנות עסקית מתמשכת. שווקו CRM, אוטומציות, WhatsApp Business API ומערכות SaaS, ובנו הכנסה מלקוחות משלמים. העמלה חלה רק על הכנסה זכאית שהתקבלה בפועל. אין הבטחת הכנסה.",
    become: "הצטרפו כשותפים",
    explore: "גלו את יתרונות השותפות",
    heroFacts: [
      "Business Partner: 499$ לחודש או 5,000$ לשנה אחרי אישור.",
      "עמלה חוזרת: 30% / 35% / 40% על הכנסת מנוי זכאית.",
      "Affiliate: כיום 15% ממכירות זכאיות בקטלוג. בלי דמי חברות.",
    ],
    signals: [
      ["40%", "עד 40% עמלה חוזרת", "המדרגה העליונה שפורסמה, מ־40 לקוחות משלמים פעילים, על הכנסת מנוי זכאית שהתקבלה."],
      ["חוזר", "בנו הכנסה חוזרת", "העמלה יכולה להמשיך כל עוד לקוח זכאי נשאר משויך. אין הבטחת הכנסה."],
      ["עולם", "תוכנית שותפים בינלאומית", "השיווק בתוך הטריטוריה שבהסכם. החברות אינה מעניקה בלעדיות."],
    ],
    stickyJoin: "מוכנים להגיש מועמדות?",
    stickyCta: "הצטרפו כשותפים",
    audienceTitle: "למי התוכנית מתאימה",
    audienceLead: "התוכנית מיועדת לעסקים שמציגים את Bizuply ללקוחות. כל בקשה נבדקת. שליחת הטופס אינה מאשרת שותפות.",
    audience: [
      ["agency", "סוכנויות שיווק ופרסום", "הציגו CRM, WhatsApp וכלי קמפיין לעסקים שאתם כבר מלווים."],
      ["consult", "יועצים עסקיים", "הוסיפו פתרון טכנולוגי לצד הייעוץ, במוצרים שההסכם מתיר."],
      ["build", "חברות פיתוח ואתרים", "חברו אתרים ואוטומציות שאתם מספקים למוצרי Bizuply שאושרו למכירת שותפים."],
      ["flow", "מומחי אוטומציות", "הציעו אוטומציות תהליך שכבר קיימות ב־Bizuply."],
      ["market", "משווקי תוכנה", "שווקו מוצרים ש־Bizuply כבר מפעילה, בלי לבנות פלטפורמה."],
      ["venture", "יזמים ועסקים נוספים", "הגישו מועמדות כדי להציג את Bizuply ללקוחות משלמים. העמלה נגזרת מהכנסה זכאית שהתקבלה. זו לא משכורת, ואין הבטחת הכנסה."],
    ],
    whyTitle: "יתרונות לשותפים",
    whyLead: "אלה זכויות שכבר קיימות בתוכנית. אין כאן שירות, תשלום או הבטחת הכנסה שההסכם אינו מכסה.",
    why: [
      ["repeat", "40%", "עמלה חוזרת", "עמלה על הכנסת מנוי זכאית שהתקבלה בפועל, כל עוד הלקוח משויך וזכאי."],
      ["people", "10%", "עסקאות חד־פעמיות", "עסקאות חד־פעמיות זכאיות מזכות ב־10%. ההסכם החתום קובע מה זכאי."],
      ["portal", "מרכז", "מרכז השותפים", "כשהשותף פעיל, ההסכם פעיל, והתשלום הנדרש אומת, מרכז השותפים מציג לקוחות, שיוך ועמלות."],
      ["box", "5", "פתרונות לשיווק", "CRM, WhatsApp Business API, קמפיינים במטא, אוטומציות ואתרים שקיימים ב־Bizuply היום, כשההסכם מתיר."],
      ["book", "חומר", "משאבים שפורסמו", "קליטה, הדרכה שפורסמה וחומרים מאושרים, כל עוד החברות פעילה."],
      ["life", "תמיכה", "תמיכה לפי ההסכם", "תמיכה בפלטפורמה זמינה ב־support@bizuply.com. ההיקף נקבע בהסכם."],
    ],
    productsTitle: "מה השותפים יכולים למכור",
    productsLead:
      "פתרונות שקיימים ב־Bizuply היום. בכל כרטיס מופיע הערך ללקוח וההזדמנות לשותף. מכירת מערכות SaaS לפי תחום עדיין אינה פתוחה.",
    marketTitle: "שיווק ואוטומציות",
    marketLead: "שני כלים שכבר יושבים לצד ה־CRM. הם אינם מחיר חברות נפרד.",
    offers: [
      {
        id: "crm",
        layout: "lead",
        icon: "people",
        title: "CRM וניהול לידים",
        href: "/crm",
        value: "הלקוח מרכז לידים, צינורות מכירה והמשך טיפול במקום אחד.",
        partner: "הציגו CRM שכבר פועל ב־Bizuply, כשההסכם מתיר.",
        link: "לעמוד ה־CRM",
      },
      {
        id: "whatsapp-api",
        layout: "side",
        icon: "flow",
        title: "WhatsApp Business API",
        href: "/whatsapp-api",
        value: "העסק שולח מסרים ללקוחות דרך WhatsApp Business API הרשמי.",
        partner: "הציעו תבניות ומסרים עסקיים. השימוש כפוף למדיניות Meta, לאישורים ולעלויות ההודעות.",
        link: "לעמוד ה־WhatsApp API",
      },
      {
        id: "meta-campaigns",
        layout: "pair",
        icon: "market",
        title: "קמפיינים במטא — Facebook & Instagram Ads",
        href: "/meta-campaigns",
        value: "Lead Ads יכולים להיכנס ל־CRM עם מקור וסטטוס להמשך טיפול.",
        partner: "כלול בחבילת Business אחרי חיבור חשבון מודעות מורשה. העמלה נגזרת מהכנסת מנוי זכאית של Bizuply, לא מתקציב הפרסום ב־Meta.",
        link: "לעמוד הקמפיינים",
      },
      {
        id: "automations",
        layout: "pair",
        icon: "repeat",
        title: "אוטומציות עסקיות",
        href: "/automations",
        value: "המשך טיפול וניתוב לידים יכולים לרוץ כתהליך מוגדר.",
        partner: "שווקו אוטומציה שכבר קיימת ב־Bizuply, כשההסכם מתיר.",
        link: "לעמוד האוטומציות",
      },
      {
        id: "website-builder",
        layout: "wide",
        icon: "build",
        title: "אתרים ופתרונות דיגיטליים",
        href: "/website-builder",
        value: "אתר עסקי או דף נחיתה יכול לקלוט לידים ל־CRM.",
        partner: "הציעו אתרים, דפי נחיתה וזימון תורים שההסכם מתיר.",
        link: "לעמוד האתרים",
      },
    ],
    saasTitle: "פלטפורמות SaaS",
    saasLead:
      "המוצרים האלה קיימים ב־Bizuply. מכירת שותפים עדיין בקרוב ואינה זמינה לרכישה דרך התוכנית כעת. החברות אינה כוללת קוד מקור, זכויות White Label או זכות הפצה.",
    soon: "בקרוב",
    saas: ["BeautyFlow", "Global Properties", "Dinevo", "TableFlow", "Cliny"],
    levelsTitle: "מדרגות עמלה",
    levelsLead:
      "אלה מדרגות עמלה, לא שלושה מחירי מנוי. השיעור נקבע לפי מספר הלקוחות המשלמים הפעילים, על הכנסת מנוי זכאית שהתקבלה בפועל. לא רוכשים מדרגה.",
    tierBands: [
      { range: "עד 19 לקוחות משלמים פעילים", rate: "30%" },
      { range: "מ־20 ועד 39 לקוחות משלמים פעילים", rate: "35%" },
      { range: "מ־40 לקוחות משלמים פעילים", rate: "40%" },
    ],
    tierMove:
      "השיעור עוקב אחרי המספר העדכני. הוא עולה במעבר לטווח הבא, ויורד כשהמספר יורד מתחת לטווח. נספרת רק הכנסת מנוי זכאית שהתקבלה בפועל, לפי ההסכם החתום.",
    customers: "לקוחות משלמים פעילים",
    oneTime: "10% עמלה על עסקאות חד־פעמיות זכאיות",
    eligibility: [
      ["תנאי זכאות", "רק קטגוריות הכנסה שההסכם החתום מגדיר כזכאיות."],
      ["משך הזכאות", "כל עוד הלקוח משויך וזכאי לפי תנאי ההסכם."],
      ["החזרים וביטולים", "העמלה נגזרת מהכנסה שהתקבלה. החזרים וביטולים מפחיתים או הופכים עמלה שלא שולמה לפי ההסכם והספרים."],
      ["שיוך לקוחות", "השיוך נעשה במנגנון השיוך הקיים. כניסה לעמוד הזה לבדה אינה משייכת לקוח."],
    ],
    compareTitle: "Affiliate · Business Partner · Reseller",
    compareNote:
      "תנאים מסחריים מאומתים. הגשת הבקשה ללא תשלום. דמי חברות נגבים רק אחרי אישור. Reseller הוא במינוי בלבד — לא בהרשמה עצמית בעמוד זה.",
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
        fee: "דמי הקמה ודמי חודש לפי המסלול שנקבע בהסכם.",
        rate: "חלק מהתוספת בקטלוג, לפי המסלול שנקבע בהסכם. לא מדרגות העמלה שלמעלה. רק בהסכם חתום.",
        featured: false,
      },
    ],
    tracksTableTitle: "Affiliate · Business Partner · Reseller במבט אחד",
    tracksTable: {
      name: "מסלול",
      fee: "דמי חברות",
      reward: "מודל תגמול",
      access: "גישה",
      rows: [
        ["Affiliate", "אין במסלול האחוזים", "כיום 15% ממכירות זכאיות לפי הקטלוג", "בדיקת מועמדות. בלי דמי חברות למרכז השותפים."],
        ["Business Partner", "499$ לחודש או 5,000$ לשנה אחרי אישור", "מדרגות 30% / 35% / 40% · 10% חד־פעמי", "מרכז השותפים אחרי הסכם ותשלום מאומת."],
        ["Reseller", "דמי הקמה ודמי חודש לפי המסלול שנקבע בהסכם", "חלק מהתוספת בקטלוג. לא מדרגות העמלה שלמעלה", "רק בהסכם חתום. לא נבחר אוטומטית בעמוד הזה."],
      ],
    },
    plansTitle: "חברות בתוכנית",
    perMonth: "לחודש",
    perYear: "לשנה",
    best: "המסלול המשתלם",
    save: "חיסכון של $988 בשנה לעומת 12 תשלומים חודשיים.",
    saveMath: "שנים־עשר תשלומים חודשיים הם {monthlyYear}. החברות השנתית היא {annual}.",
    monthlyPoints: [
      "חיוב חודשי של 499$. בלי תשלום שנתי מראש.",
      "עמלה חוזרת של 30%, 35% או 40% על הכנסת מנוי זכאית שהתקבלה.",
      "10% על עסקאות חד־פעמיות זכאיות.",
      "מרכז השותפים אחרי הסכם חתום ותשלום שאומת.",
      "CRM, WhatsApp Business API, קמפיינים במטא, אוטומציות ואתרים, כשההסכם מתיר.",
      "חומרים שפורסמו לשותפים, ותמיכה בפלטפורמה ב־support@bizuply.com, כל עוד החברות פעילה.",
    ],
    annualPoints: [
      "אותן הטבות של Business Partner: מרכז השותפים, המוצרים שההסכם מתיר, חומרים שפורסמו ותמיכה בפלטפורמה.",
      "עמלה חוזרת של 30%, 35% או 40% על הכנסת מנוי זכאית שהתקבלה.",
      "10% על עסקאות חד־פעמיות זכאיות.",
      "חיוב שנתי של 5,000$.",
    ],
    planNotes: ["הגשת הבקשה ללא תשלום", "התשלום נדרש רק אחרי אישור", "תשלום ידני מחוץ לאתר", "אין חיוב אוטומטי", "כפוף להסכם השותפות"],
    noCharge: "העמוד הזה אינו מתחיל חיוב.",
    due: "אחרי האישור, ועד שהתשלום הידני מתועד, החברות עדיין אינה פעילה.",
    applyMonthly: "הגישו מועמדות לחברות חודשית",
    applyAnnual: "הגישו מועמדות לחברות שנתית",
    registerAfterApproval: "הרשמה מלאה (אחרי אישור)",
    territoryTitle: "הטריטוריה נקבעת בנפרד",
    territoryLead: "החיוב החודשי והשנתי אינו בוחר טריטוריה ואינו כולל בלעדיות.",
    territories: [
      ["מינוי לא בלעדי", "Bizuply רשאית למנות שותפים נוספים באותה טריטוריה."],
      ["טריטוריה בלעדית", "ניתנת רק כשההסכם החתום קובע בלעדיות, הטריטוריה פנויה, שני הצדדים חתמו, והתשלום הנדרש הושלם."],
    ],
    calcTitle: "מחשבון הכנסות",
    calcSimBadge: "המחשה בלבד",
    calcCustomers: "לקוחות משלמים פעילים",
    calcPrice: "הכנסה חודשית ממוצעת ללקוח (דולר)",
    calcTier: "מדרגת עמלה",
    calcTierNote: "המדרגה נגזרת ממספר הלקוחות. בחירת מדרגה קובעת את מספר הלקוחות המתאים. היא אינה משנה את נוסחת החישוב.",
    calcOneTimeCount: "מספר עסקאות חד־פעמיות",
    calcOneTimeAvg: "סכום עסקה חד־פעמית ממוצעת (דולר)",
    calcBilling: "מסלול החברות בחישוב היתרה",
    calcBillingMonthly: "חברות חודשית",
    calcBillingAnnual: "חברות שנתית",
    revenue: "הערכת הכנסת מנוי חודשית זכאית",
    month: "הכנסה חודשית אפשרית מעמלות",
    year: "הכנסה שנתית אפשרית מעמלות חוזרות",
    oneTimeResult: "הערכת עמלות חד־פעמיות",
    totalResult: "הכנסה כוללת לפי ההנחות שנבחרו",
    calcMembership: "עלות החברות",
    calcMembershipMonthlyNote: "לחודש. היתרה מפחיתה שנים־עשר דמי חברות חודשיים ({year}).",
    calcMembershipAnnualNote: "לשנה. היתרה מפחיתה את דמי החברות השנתיים.",
    calcBalance: "יתרה להמחשה אחרי דמי החברות בלבד",
    calcBalanceNote:
      "עמלה חוזרת שנתית פחות עלות החברות שנבחרה לשנה. עמלות חד־פעמיות נשארות בשורה נפרדת ואינן חלק מהיתרה הזו. זו אינה רווח נקי אחרי הוצאות אחרות.",
    disclaimer:
      "סימולציה בלבד. לא תחזית, לא הבטחת הכנסה, ולא רווח נקי אחרי כל ההוצאות. ההכנסה בפועל תלויה בהכנסה זכאית, בשיוך, בתנאי העמלה, בשימור, בהחזרים ובהסכם שנחתם.",
    journeyTitle: "איך זה עובד",
    steps: [
      ["מגישים בקשה", "מגישים בקשה להצטרפות לתוכנית. השליחה ללא תשלום. היא אינה מאשרת את השותפות ואינה מחייבת כרטיס."],
      ["מקבלים אישור", "צוות Bizuply בוחן את הבקשה ומסביר את תנאי השותפות. ההפעלה נעשית אחרי חתימה על ההסכם, ואחרי תשלום ידני מאומת כשיש דמי חברות."],
      ["מתחילים לצמוח", "אחרי האישור וההפעלה מתחילים לשווק את הפתרונות שההסכם מתיר, ומנהלים את הפעילות במרכז השותפים."],
    ],
    form: {
      title: "בקשת הצטרפות",
      lead: "ההגשה ללא תשלום. הבקשה נשמרת לבדיקה ב־Bizuply. היא אינה מאשרת את השותפות ואינה חיוב.",
      name: "שם מלא",
      company: "שם החברה",
      email: "אימייל עסקי",
      phone: "טלפון",
      dialCode: "קידומת",
      country: "מדינה",
      website: "אתר החברה",
      websiteOptional: "(אם קיים)",
      track: "סוג שותפות מבוקש",
      activity: "תחום הפעילות",
      experience: "ניסיון קודם במכירות או בשותפויות",
      customersLabel: "מספר לקוחות עסקיים קיימים",
      customersOptional: "(אם רלוונטי)",
      about: "הודעה נוספת",
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
    faqTitle: "שאלות ותשובות",
    closeTitle: "מוכנים להצטרף כשותפים של Bizuply?",
    closeBody: "הגישו קודם מועמדות ללא תשלום. הרשמה מלאה וכל תשלום חברות מתבצעים רק אחרי אישור.",
    closeCta: "הצטרפו כשותפים",
    registerCta: "הרשמה מלאה (אחרי אישור)",
    login: "כניסת שותפים",
  },
} as const;

type Copy = (typeof COPY)["en"];

function fill(template: string, values: Record<string, string>) {
  return Object.entries(values).reduce((text, [key, value]) => text.replace(`{${key}}`, value), template);
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
  const [billing, setBilling] = useState<"monthly" | "annual">("annual");
  const [stickyVisible, setStickyVisible] = useState(false);

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

  useEffect(() => {
    const root = document.documentElement;
    if (stickyVisible) root.setAttribute("data-partners-sticky", "1");
    else root.removeAttribute("data-partners-sticky");
    return () => root.removeAttribute("data-partners-sticky");
  }, [stickyVisible]);

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
  const membershipYearCost = billing === "annual" ? annual.amountUsd : monthly.amountUsd * 12;
  const membershipShown = billing === "annual" ? annual.amountUsd : monthly.amountUsd;
  const balanceAfterMembership = estimate.annualCommission - membershipYearCost;

  const faqSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: copy.seoTitle,
        description: copy.seoDescription,
        url: canonical,
        inLanguage: hebrew ? "he" : "en",
        isPartOf: { "@type": "WebSite", name: "Bizuply", url: "https://bizuply.com/" },
      },
      {
        "@type": "FAQPage",
        inLanguage: hebrew ? "he" : "en",
        mainEntity: faq.map(([name, text]) => ({
          "@type": "Question",
          name,
          acceptedAnswer: { "@type": "Answer", text },
        })),
      },
    ],
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
        <meta property="og:locale" content={hebrew ? "he_IL" : "en_US"} />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <header className="ip-hero">
        <div className="ip-hero-geo" aria-hidden="true">
          <span className="ip-geo ip-geo-a" />
          <span className="ip-geo ip-geo-b" />
          <span className="ip-geo ip-geo-c" />
        </div>
        <div className="ip-wrap ip-wrap-wide ip-hero-grid">
          <div className="ip-hero-copy">
            <p className="ip-kicker">{copy.kicker}</p>
            <h1>{copy.h1}</h1>
            <p className="ip-sub">{copy.sub}</p>
            <p className="ip-lead">{copy.heroBody}</p>
            <div className="ip-actions">
              <a className="ip-btn ip-btn-primary" href="#apply">
                {copy.become}
              </a>
              <a className="ip-btn ip-btn-ghost" href="#benefits">
                {copy.explore}
              </a>
            </div>
            <ul className="ip-hero-facts">
              {copy.heroFacts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </div>
          <ul className="ip-signals">
            {copy.signals.map(([figure, title, note]) => (
              <li key={title}>
                <strong><bdi>{figure}</bdi></strong>
                <span>{title}</span>
                <small>{note}</small>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <section className="ip-section ip-reveal" id="who">
        <div className="ip-wrap">
          <p className="ip-kicker">{copy.kicker}</p>
          <h2>{copy.audienceTitle}</h2>
          <p className="ip-copy">{copy.audienceLead}</p>
          <div className="ip-cards">
            {copy.audience.map(([icon, title, body]) => (
              <article className="ip-card" key={title}>
                <Mark name={icon} />
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ip-section ip-band ip-reveal" id="products">
        <div className="ip-wrap ip-wrap-wide">
          <h2>{copy.productsTitle}</h2>
          <p className="ip-copy">{copy.productsLead}</p>
          <div className="ip-offers">
            <div className="ip-offer-top">
              {copy.offers
                .filter((offer) => offer.layout === "lead" || offer.layout === "side")
                .map((offer) => (
                  <article className={`ip-offer is-${offer.layout}`} key={offer.id} data-testid={`product-${offer.id}`}>
                    <Mark name={offer.icon} />
                    <h3>{offer.title}</h3>
                    <p className="ip-offer-kicker">{hebrew ? "ללקוח" : "For the customer"}</p>
                    <p>{offer.value}</p>
                    <p className="ip-offer-kicker">{hebrew ? "לשותף" : "For the partner"}</p>
                    <p>{offer.partner}</p>
                    <Link className="ip-product-link" to={offer.href}>{offer.link}</Link>
                  </article>
                ))}
            </div>
            <div className="ip-offer-market">
              <div className="ip-offer-market-copy">
                <h3>{copy.marketTitle}</h3>
                <p>{copy.marketLead}</p>
              </div>
              {copy.offers
                .filter((offer) => offer.layout === "pair")
                .map((offer) => (
                  <article className="ip-offer is-pair" key={offer.id} data-testid={`product-${offer.id}`}>
                    <Mark name={offer.icon} />
                    <h3>{offer.title}</h3>
                    <p className="ip-offer-kicker">{hebrew ? "ללקוח" : "For the customer"}</p>
                    <p>{offer.value}</p>
                    <p className="ip-offer-kicker">{hebrew ? "לשותף" : "For the partner"}</p>
                    <p>{offer.partner}</p>
                    <Link className="ip-product-link" to={offer.href}>{offer.link}</Link>
                  </article>
                ))}
            </div>
            {copy.offers
              .filter((offer) => offer.layout === "wide")
              .map((offer) => (
                <article className="ip-offer is-wide" key={offer.id} data-testid={`product-${offer.id}`}>
                  <Mark name={offer.icon} />
                  <div>
                    <h3>{offer.title}</h3>
                    <p className="ip-offer-kicker">{hebrew ? "ללקוח" : "For the customer"}</p>
                    <p>{offer.value}</p>
                    <p className="ip-offer-kicker">{hebrew ? "לשותף" : "For the partner"}</p>
                    <p>{offer.partner}</p>
                    <Link className="ip-product-link" to={offer.href}>{offer.link}</Link>
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

      <section className="ip-section ip-reveal" id="benefits">
        <div className="ip-wrap">
          <h2>{copy.whyTitle}</h2>
          <p className="ip-copy">{copy.whyLead}</p>
          <div className="ip-cards">
            {copy.why.map(([icon, figure, title, body]) => (
              <article className="ip-card ip-benefit" key={title}>
                <Mark name={icon} />
                <p className="ip-benefit-figure" dir="ltr">{figure}</p>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ip-section ip-band-violet ip-reveal" id="levels">
        <div className="ip-wrap">
          <h2>{copy.levelsTitle}</h2>
          <p className="ip-copy">{copy.levelsLead}</p>
          <div className="ip-level-progress" aria-hidden="true">
            <span />
          </div>
          <div className="ip-levels">
            {RECURRING_TIERS.map((tier) => (
              <article className={`ip-level${tier.rate === 0.4 ? " is-top" : ""}`} key={tier.label}>
                <p className="ip-level-rate">{tier.label}</p>
                <h3>{tier.max == null ? `${tier.min}+` : `${tier.min}–${tier.max}`}</h3>
                <p>{copy.customers}</p>
              </article>
            ))}
          </div>
          <p className="ip-onetime">{copy.oneTime}</p>
          <div data-testid="tier-move">
            <ul className="ip-tier-move">
              {copy.tierBands.map((band) => (
                <li key={band.range}>
                  <span>{band.range}</span>
                  <span className="ip-tier-rate" dir="ltr">{band.rate}</span>
                </li>
              ))}
            </ul>
            <p className="ip-copy">{copy.tierMove}</p>
          </div>
          <div className="ip-eligibility">
            {copy.eligibility.map(([title, body]) => (
              <div key={title}>
                <strong>{title}</strong>
                <span>{body}</span>
              </div>
            ))}
          </div>

          <h3 className="ip-subsection">{copy.compareTitle}</h3>
          <div className="ip-compare" data-testid="partner-track-compare" aria-label={copy.compareTitle}>
            {copy.compare.map((track) => (
              <article
                key={track.key}
                className={`ip-compare-card${track.featured ? " is-featured" : ""}`}
                data-testid={`compare-${track.key}`}
              >
                <h3>{track.title}</h3>
                <p className="ip-compare-fee">{track.fee}</p>
                <p className="ip-compare-rate">{track.rate}</p>
              </article>
            ))}
          </div>
          <p className="ip-compare-note">{copy.compareNote}</p>
          <div className="ip-table-wrap ip-tracks-table" data-testid="partner-tracks-table">
            <table className="ip-table">
              <caption className="ip-sr-only">{copy.tracksTableTitle}</caption>
              <thead>
                <tr>
                  <th scope="col">{copy.tracksTable.name}</th>
                  <th scope="col">{copy.tracksTable.fee}</th>
                  <th scope="col">{copy.tracksTable.reward}</th>
                  <th scope="col">{copy.tracksTable.access}</th>
                </tr>
              </thead>
              <tbody>
                {copy.tracksTable.rows.map(([name, fee, reward, access]) => (
                  <tr key={name} className={name === "Business Partner" ? "is-featured-row" : undefined}>
                    <th scope="row" data-testid={name === "Business Partner" ? "track-Business Partner" : undefined}>
                      {name}
                    </th>
                    <td>{fee}</td>
                    <td>{reward}</td>
                    <td>{access}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="ip-section ip-reveal" id="plans">
        <div className="ip-wrap">
          <h2>{copy.plansTitle}</h2>
          <div className="ip-billing-grid" data-testid="international-price-cards">
            <article className="ip-billing-card is-featured" data-testid="annual-price-card">
              <div>
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
                <p className="ip-save-math">
                  {fill(copy.saveMath, {
                    monthlyYear: money(monthly.amountUsd * 12),
                    annual: money(annual.amountUsd),
                  })}
                </p>
                <ul>
                  {copy.annualPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
              <div className="ip-billing-actions">
                <a className="ip-btn ip-btn-primary" href="#apply" data-testid="international-register-link">
                  {copy.applyAnnual}
                </a>
                <Link className="ip-btn ip-btn-ghost" to={annualHref} data-testid="international-annual-register-link">
                  {copy.registerAfterApproval}
                </Link>
              </div>
            </article>
            <article className="ip-billing-card" data-testid="monthly-price-card">
              <div>
                <h3>{hebrew ? monthly.labelHe : monthly.labelEn}</h3>
                <p className="ip-price" data-testid="international-monthly-price">
                  {money(monthly.amountUsd)} <span>{copy.perMonth}</span>
                </p>
                <ul>
                  {copy.monthlyPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
              <div className="ip-billing-actions">
                <a className="ip-btn ip-btn-ghost" href="#apply" data-testid="international-monthly-link">
                  {copy.applyMonthly}
                </a>
                <Link className="ip-btn ip-btn-ghost" to={monthlyHref} data-testid="international-monthly-register-link">
                  {copy.registerAfterApproval}
                </Link>
              </div>
            </article>
          </div>
          <ul className="ip-plan-notes">
            {copy.planNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
            <li>{copy.noCharge}</li>
            <li>{copy.due}</li>
          </ul>
          <p className="ip-copy ip-territory-note">
            <strong>{copy.territoryTitle}.</strong> {copy.territoryLead} {copy.territories[0][1]} {copy.territories[1][1]}
          </p>
        </div>
      </section>

      <section className="ip-section ip-calc-section ip-reveal" id="calculator">
        <div className="ip-wrap">
          <div className="ip-calc-heading-row">
            <h2>{copy.calcTitle}</h2>
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
                {RECURRING_TIERS.map((tier) => (
                  <button
                    key={tier.label}
                    type="button"
                    aria-pressed={rate === tier.rate}
                    onClick={() => setCustomers(tierCount(tier.rate))}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
              <p className="ip-calc-note">{copy.calcTierNote}</p>
            </div>
            <div className="ip-calc-billing">
              <p>{copy.calcBilling}</p>
              <div className="ip-billing-toggle">
                <button
                  type="button"
                  data-testid="calc-billing-monthly"
                  aria-pressed={billing === "monthly"}
                  onClick={() => setBilling("monthly")}
                >
                  {copy.calcBillingMonthly}
                </button>
                <button
                  type="button"
                  data-testid="calc-billing-annual"
                  aria-pressed={billing === "annual"}
                  onClick={() => setBilling("annual")}
                >
                  {copy.calcBillingAnnual}
                </button>
              </div>
            </div>
            <div className="ip-results" dir="ltr" aria-live="polite">
              <div>
                <span>{copy.revenue}</span>
                <strong className="ip-tick" data-testid="calc-revenue" key={`rev-${estimate.monthlyRevenue}`}>
                  {money(estimate.monthlyRevenue)}
                </strong>
              </div>
              <div>
                <span>{copy.month}</span>
                <strong className="ip-tick" data-testid="calc-month" key={`mo-${estimate.monthlyCommission}`}>
                  {money(estimate.monthlyCommission)}
                </strong>
              </div>
              <div>
                <span>{copy.year}</span>
                <strong className="ip-tick" data-testid="calc-year" key={`yr-${estimate.annualCommission}`}>
                  {money(estimate.annualCommission)}
                </strong>
              </div>
              <div>
                <span>{copy.oneTimeResult}</span>
                <strong className="ip-tick" data-testid="calc-onetime" key={`ot-${estimate.oneTimeCommission}`}>
                  {money(estimate.oneTimeCommission)}
                </strong>
              </div>
              <div>
                <span>{copy.totalResult}</span>
                <strong className="ip-tick" data-testid="calc-total" key={`tot-${estimate.totalIllustrated}`}>
                  {money(estimate.totalIllustrated)}
                </strong>
              </div>
              <div>
                <span>{copy.calcMembership}</span>
                <strong className="ip-tick" data-testid="calc-membership" key={`fee-${membershipShown}`}>
                  {money(membershipShown)}
                </strong>
                <span>
                  {billing === "annual"
                    ? copy.calcMembershipAnnualNote
                    : fill(copy.calcMembershipMonthlyNote, { year: money(membershipYearCost) })}
                </span>
              </div>
              <div className="ip-results-balance">
                <span>{copy.calcBalance}</span>
                <strong className="ip-tick" data-testid="calc-balance" key={`bal-${balanceAfterMembership}`}>
                  {signedMoney(balanceAfterMembership)}
                </strong>
                <span>{copy.calcBalanceNote}</span>
              </div>
            </div>
            <p className="ip-note ip-calc-note">{copy.disclaimer}</p>
          </form>
        </div>
      </section>

      <section className="ip-section ip-reveal" id="how-it-works">
        <div className="ip-wrap">
          <h2>{copy.journeyTitle}</h2>
          <div className="ip-steps">
            {copy.steps.map(([title, body], index) => (
              <article className="ip-step" key={title}>
                <span className="ip-num">{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ip-section ip-band-violet ip-reveal" id="apply" aria-labelledby="apply-heading">
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
              <p>{answer}</p>
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
