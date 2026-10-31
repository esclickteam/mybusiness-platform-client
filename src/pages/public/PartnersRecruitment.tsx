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
import { partnerFaqPairs } from "./partners/partnerFaq.mjs";
import "./partners/partnersPage.css";

const COPY = {
  en: {
    seoTitle: "Build Your Business with Bizuply | International Partner Program",
    seoDescription:
      "Apply free to the Bizuply International Partner Program. After approval, choose $499 per month or $5,000 per year. Eligible recurring commission is 30% to 40%, and eligible one-time deals earn 10%.",
    kicker: "Application is free",
    h1: "Build Your Business with Bizuply",
    program: "International Partner Program",
    sub: "Become an International Partner. Grow Recurring Revenue. Expand Your Opportunities.",
    lead: "Join the Bizuply International Partner Program and build a business around powerful software solutions, customer management, business communication, marketing automation, and digital services.",
    lead2: "Offer businesses the technology they need while developing your own customer portfolio and recurring commission opportunities.",
    become: "Become a Partner",
    explore: "Explore Partner Benefits",
    facts: [
      ["Up to 40% Recurring Commissions", "On eligible subscription revenue, under the signed agreement."],
      ["10% on Eligible One-Time Deals", "Only after the revenue is actually received."],
      ["Multiple Business Software Solutions", "CRM, messaging, campaigns, websites, and automation."],
      ["International Market Opportunities", "In the countries and regions approved for you."],
    ],
    whyTitle: "More Than a Partnership. A Business Growth Opportunity.",
    whyLead: "The benefits below match the International Partner rights already in the program. Nothing here adds a service the agreement does not cover.",
    why: [
      ["Recurring Revenue Opportunities", "Build a portfolio of eligible subscription customers and earn recurring commissions under your partnership agreement."],
      ["Multiple Products. One Partnership.", "Introduce businesses to CRM, lead management, WhatsApp Business API, Meta advertising tools, websites, automation, and authorized SaaS products."],
      ["Grow in Your Market", "Develop commercial relationships in approved countries and regions using Bizuply's existing technology infrastructure."],
      ["Partner Resources", "Access the available partner center, onboarding information, training materials, and approved business resources."],
      ["One-Time Project Opportunities", "Earn commissions on eligible one-time transactions while developing additional business opportunities."],
      ["Long-Term Business Development", "Grow your customer base, expand your product knowledge, and progress through the applicable commission tiers."],
    ],
    productsTitle: "One Technology Ecosystem. Multiple Revenue Opportunities.",
    productsLead: "These are products already in Bizuply. Screens come from the published demo workspace, not from a customer account.",
    products: [
      {
        title: "CRM & Lead Management",
        href: "/crm",
        image: "/demo-media/crm/leads-list.png",
        alt: "Bizuply demo CRM lead list",
        points: ["Customer relationship management", "Lead tracking", "Sales pipelines", "Customer records", "Follow-up workflows", "Team collaboration", "Sales activity management"],
      },
      {
        title: "Official WhatsApp Business API",
        href: "/whatsapp-api",
        image: "/demo-media/whatsapp/poster.jpg",
        alt: "Bizuply demo WhatsApp inbox",
        note: "Use is subject to Meta policy, approvals, and the relevant messaging costs.",
        points: ["Official WhatsApp Business API integrations", "Business messaging", "Approved message templates", "Customer conversations", "Automated communication workflows", "Integration with business processes"],
      },
      {
        title: "Meta Campaign Management",
        href: "/meta-campaigns",
        image: "/demo-media/home/campaigns.jpg",
        alt: "Bizuply campaign workspace",
        points: ["Supported campaign management tools", "Lead collection", "Campaign-related workflows", "Customer follow-up automation", "Connections between campaigns and CRM"],
      },
      {
        title: "Websites & Digital Presence",
        href: "/website-builder",
        image: "/demo-media/websites/my-sites.jpg",
        alt: "Bizuply website workspace",
        points: ["Business websites", "Landing pages", "Lead capture forms", "Appointment booking solutions", "Connected customer management"],
      },
      {
        title: "Business Automation",
        href: "/automations",
        image: "/demo-media/automations/poster.jpg",
        alt: "Bizuply automation workspace",
        points: ["Automated customer follow-ups", "Lead routing", "Business communication processes", "Workflow automation", "Supported integrations"],
      },
    ],
    saasTitle: "Ready-to-Launch SaaS Solutions",
    saasLead: "These products exist in Bizuply. Partner resale is coming soon. Membership does not include source code, white-label rights, or a distribution right.",
    soon: "Coming Soon",
    saas: ["BeautyFlow", "Global Properties", "Dinevo", "TableFlow", "Cliny"],
    getsTitle: "Everything You Need to Start Building Your Partner Business",
    gets: [
      "Access to the existing Partner Center after membership is active.",
      "Training materials that have been published for partners.",
      "Information on the products and services described here.",
      "Approved marketing materials, where they have been published.",
      "Customer referral through the existing attribution record.",
      "Commission eligibility tracked in the existing partner system.",
      "Recurring revenue opportunities on eligible subscriptions.",
      "Opportunities on eligible one-time transactions.",
      "Activity in the markets approved for that partner.",
      "Room to expand activity when the agreement allows it.",
    ],
    commTitle: "Grow Your Portfolio. Increase Your Commission Rate.",
    commLead: "Commissions apply only to eligible transactions and subscriptions. The revenue has to be received. Customer attribution follows the existing partner record. Income is not guaranteed. This page does not change the server formulas. The signed agreement decides eligibility.",
    customers: "Active Paying Customers",
    rate: "Recurring Commission",
    oneTime: "10% Commission on Eligible One-Time Transactions",
    calcTitle: "Understand Your Revenue Potential",
    calcCustomers: "Paying customers",
    calcPrice: "Average monthly subscription price (USD)",
    calcTier: "Commission tier",
    revenue: "Estimated Eligible Monthly Subscription Revenue",
    month: "Estimated Monthly Partner Commission",
    year: "Estimated Annual Partner Commission",
    disclaimer: "Illustrative estimates only. Actual earnings depend on eligible revenue, attribution, commission terms, customer retention, refunds, and the executed agreement.",
    plansTitle: "Choose Your Partnership",
    perMonth: "/ month",
    perYear: "/ year",
    best: "Best Value",
    save: "Save $988 compared with monthly billing",
    monthlyPoints: ["Monthly billing", "No annual prepayment", "Same International Partner benefits", "Recurring commission opportunities", "Access to eligible partner resources", "Approved international market activities"],
    annualPoints: ["Same International Partner benefits", "Recurring commission opportunities", "Access to eligible partner resources", "Approved international market activities"],
    planNotes: ["Application is free", "Payment is required only after approval", "Manual payment outside the website", "No automatic charging", "Subject to the partnership agreement"],
    noCharge: "This page does not start a live charge.",
    due: "After approval, and until the manual payment is recorded, the membership stays payment_due.",
    applyMonthly: "Apply monthly",
    applyAnnual: "Apply annually",
    territoryTitle: "Territory is agreed separately",
    territoryLead: "Monthly and annual billing do not choose a territory and do not include exclusivity. There is no separate Premium Territory fee.",
    territories: [
      ["Non-exclusive appointment", "Bizuply may appoint other partners in the same territory. The appointment does not lock the territory."],
      ["Exclusive territory", "Granted only when the signed agreement says exclusive, the territory is available, both parties have signed, and the required payment is complete."],
    ],
    otherPlans: "Other Bizuply partner tracks keep their current terms and are not selected on this page.",
    journeyTitle: "Your Journey to Becoming a Bizuply Partner",
    steps: [
      ["Submit Your Application", "Tell us about your business, experience, country, and target market."],
      ["Application Review", "Our team reviews eligibility and partnership suitability."],
      ["Partnership Agreement", "Review and sign the applicable partnership agreement."],
      ["Membership Activation", "Complete the approved manual payment process. Membership stays payment_due until that payment is verified."],
      ["Start Building Your Business", "Access eligible partner resources and begin authorized partnership activities."],
    ],
    fitTitle: "Built for Entrepreneurs and Business Growth Professionals",
    audiences: [
      ["Marketing Agencies", "Add CRM, messaging, websites, and automation to the services you already run for clients."],
      ["Business Consultants", "Give clients an operating system for leads, follow-up, and appointments, then earn on eligible subscriptions."],
      ["Digital Transformation Specialists", "Introduce a connected stack instead of a single disconnected tool."],
      ["Technology Service Providers", "Implement the products your customers need, within the agreement and the product rules."],
      ["SaaS Entrepreneurs", "Learn the catalog now. Partner resale of the named SaaS products is still coming soon."],
      ["Sales Professionals", "Build a portfolio of paying customers and move through the published commission tiers."],
      ["CRM Specialists", "Lead with the CRM, pipelines, and customer records businesses already ask for."],
      ["WhatsApp Automation Specialists", "Offer official WhatsApp Business API workflows where Meta policy, approvals, and costs allow it."],
    ],
    hubTitle: "Your Partner Growth Hub",
    hubLead: "Partner Center. The existing Partner Center opens only when the partner is active, the agreement is active, and the payment has been verified.",
    hub: ["Onboarding", "Available Training Resources", "Product Knowledge", "Approved Sales Materials", "Partner Account Management", "Commission Information"],
    faqTitle: "Questions partners ask",
    closeTitle: "Ready to Build Your Business with Bizuply?",
    closeBody: "Apply to join the Bizuply International Partner Program and explore opportunities to develop your business with our technology ecosystem.",
    closeCta: "Apply to Become a Partner",
    login: "Partner sign in",
    shotCaption: "Demo workspace",
  },
  he: {
    seoTitle: "בנו את העסק עם Bizuply | תוכנית שותפים בינלאומית",
    seoDescription:
      "ההגשה לתוכנית השותפים הבינלאומית של Bizuply היא ללא תשלום. אחרי אישור בוחרים 499 דולר לחודש או 5,000 דולר לשנה. עמלה חוזרת זכאית היא 30% עד 40%, ועסקאות חד-פעמיות זכאיות מזכות ב-10%.",
    kicker: "הגשת הבקשה ללא תשלום",
    h1: "בנו את העסק שלכם עם Bizuply",
    program: "תוכנית שותפים בינלאומית",
    sub: "הצטרפו כשותפים בינלאומיים. צמחו הכנסה חוזרת. הרחיבו את ההזדמנויות.",
    lead: "הצטרפו לתוכנית השותפים הבינלאומית של Bizuply ובנו עסק סביב פתרונות תוכנה, ניהול לקוחות, תקשורת עסקית, אוטומציית שיווק ושירותים דיגיטליים.",
    lead2: "הציעו לעסקים את הטכנולוגיה שהם צריכים, ובמקביל פתחו תיק לקוחות והזדמנויות לעמלה חוזרת.",
    become: "להצטרף כשותף",
    explore: "לראות את ההטבות",
    facts: [
      ["עד 40% עמלה חוזרת", "על הכנסת מנוי זכאית, לפי ההסכם החתום."],
      ["10% על עסקאות חד-פעמיות זכאיות", "רק אחרי שההכנסה התקבלה בפועל."],
      ["כמה פתרונות תוכנה לעסקים", "CRM, מסרים, קמפיינים, אתרים ואוטומציה."],
      ["הזדמנויות בשוק הבינלאומי", "במדינות ובאזורים שאושרו עבורכם."],
    ],
    whyTitle: "יותר משותפות. הזדמנות לצמיחה עסקית.",
    whyLead: "ההטבות כאן תואמות את הזכויות שכבר קיימות בתוכנית. אין כאן שירות שההסכם אינו מכסה.",
    why: [
      ["הזדמנויות להכנסה חוזרת", "בנו תיק של לקוחות מנוי זכאים והרוויחו עמלה חוזרת לפי הסכם השותפות."],
      ["כמה מוצרים. שותפות אחת.", "הציגו לעסקים CRM, ניהול לידים, WhatsApp Business API, כלי פרסום של Meta, אתרים, אוטומציה ומוצרי SaaS מאושרים."],
      ["צמיחה בשוק שלכם", "פתחו קשרים מסחריים במדינות ובאזורים מאושרים, על התשתית הקיימת של Bizuply."],
      ["משאבי שותפים", "גישה למרכז השותפים הזמין, למידע קליטה, לחומרי הכשרה ולמשאבים עסקיים מאושרים."],
      ["הזדמנויות לפרויקטים חד-פעמיים", "הרוויחו עמלה על עסקאות חד-פעמיות זכאיות תוך פיתוח הזדמנויות נוספות."],
      ["פיתוח עסקי לטווח ארוך", "הגדילו את בסיס הלקוחות, העמיקו את הידע במוצרים, והתקדמו במדרגות העמלה החלות."],
    ],
    productsTitle: "מערכת טכנולוגיה אחת. כמה הזדמנויות להכנסה.",
    productsLead: "אלה מוצרים שקיימים ב-Bizuply. הצילומים לקוחים מסביבת הדמו המפורסמת, לא מחשבון לקוח.",
    products: [
      {
        title: "CRM וניהול לידים",
        href: "/crm",
        image: "/demo-media/crm/leads-list.png",
        alt: "רשימת לידים בסביבת הדמו של Bizuply",
        points: ["ניהול קשרי לקוחות", "מעקב לידים", "צינורות מכירה", "כרטיסי לקוח", "תהליכי המשך טיפול", "עבודה בצוות", "ניהול פעילות מכירה"],
      },
      {
        title: "WhatsApp Business API רשמי",
        href: "/whatsapp-api",
        image: "/demo-media/whatsapp/poster.jpg",
        alt: "תיבת דואר של WhatsApp בסביבת הדמו",
        note: "השימוש כפוף למדיניות Meta, לאישורים ולעלויות הרלוונטיות.",
        points: ["חיבורים רשמיים ל-WhatsApp Business API", "מסרים עסקיים", "תבניות הודעה מאושרות", "שיחות עם לקוחות", "תהליכי תקשורת אוטומטיים", "חיבור לתהליכים עסקיים"],
      },
      {
        title: "ניהול קמפיינים ב-Meta",
        href: "/meta-campaigns",
        image: "/demo-media/home/campaigns.jpg",
        alt: "סביבת הקמפיינים של Bizuply",
        points: ["כלי ניהול קמפיינים נתמכים", "איסוף לידים", "תהליכים הקשורים לקמפיין", "אוטומציית המשך טיפול", "חיבור בין קמפיינים ל-CRM"],
      },
      {
        title: "אתרים ונוכחות דיגיטלית",
        href: "/website-builder",
        image: "/demo-media/websites/my-sites.jpg",
        alt: "סביבת האתרים של Bizuply",
        points: ["אתרים עסקיים", "דפי נחיתה", "טפסי לידים", "פתרונות לזימון תורים", "ניהול לקוחות מחובר"],
      },
      {
        title: "אוטומציה עסקית",
        href: "/automations",
        image: "/demo-media/automations/poster.jpg",
        alt: "סביבת האוטומציות של Bizuply",
        points: ["המשך טיפול אוטומטי בלקוחות", "ניתוב לידים", "תהליכי תקשורת עסקית", "אוטומציית תהליכים", "חיבורים נתמכים"],
      },
    ],
    saasTitle: "מערכות SaaS מוכנות להשקה",
    saasLead: "המוצרים האלה קיימים ב-Bizuply. מכירת שותפים עדיין בקרוב. החברות אינה כוללת קוד מקור, זכויות White Label או זכות הפצה.",
    soon: "בקרוב",
    saas: ["BeautyFlow", "Global Properties", "Dinevo", "TableFlow", "Cliny"],
    getsTitle: "מה שצריך כדי להתחיל לבנות את עסק השותפים",
    gets: [
      "גישה למרכז השותפים הקיים אחרי שהחברות פעילה.",
      "חומרי הכשרה שפורסמו לשותפים.",
      "מידע על המוצרים והשירותים שמתוארים כאן.",
      "חומרי שיווק מאושרים, כשאלה פורסמו.",
      "הפניית לקוחות דרך רישום השיוך הקיים.",
      "מעקב אחר זכאות לעמלות במערכת השותפים הקיימת.",
      "הזדמנויות להכנסה חוזרת על מנויים זכאים.",
      "הזדמנויות על עסקאות חד-פעמיות זכאיות.",
      "פעילות בשווקים שאושרו לאותו שותף.",
      "אפשרות להרחיב את הפעילות כשההסכם מתיר זאת.",
    ],
    commTitle: "הגדילו את התיק. העלו את שיעור העמלה.",
    commLead: "העמלות חלות רק על עסקאות ומנויים זכאים. ההכנסה צריכה להתקבל בפועל. השיוך נעשה לפי הרישום הקיים. אין הבטחת הכנסה. העמוד אינו משנה את נוסחאות השרת. ההסכם החתום קובע את הזכאות.",
    customers: "לקוחות משלמים פעילים",
    rate: "עמלה חוזרת",
    oneTime: "10% עמלה על עסקאות חד-פעמיות זכאיות",
    calcTitle: "הבינו את פוטנציאל ההכנסה",
    calcCustomers: "לקוחות משלמים",
    calcPrice: "מחיר מנוי חודשי ממוצע בדולר",
    calcTier: "מדרגת עמלה",
    revenue: "הערכת הכנסת מנוי חודשית זכאית",
    month: "הערכת עמלת שותף חודשית",
    year: "הערכת עמלת שותף שנתית",
    disclaimer: "הערכה להמחשה בלבד. ההכנסה בפועל תלויה בהכנסה זכאית, בשיוך, בתנאי העמלה, בשימור לקוחות, בהחזרים ובהסכם שנחתם.",
    plansTitle: "בחרו את השותפות",
    perMonth: "לחודש",
    perYear: "לשנה",
    best: "Best Value",
    save: "חיסכון של $988 לעומת חיוב חודשי",
    monthlyPoints: ["חיוב חודשי", "בלי תשלום שנתי מראש", "אותן זכויות של שותף בינלאומי", "הזדמנויות לעמלה חוזרת", "גישה למשאבי שותף זכאים", "פעילות בשווקים בינלאומיים שאושרו"],
    annualPoints: ["אותן זכויות של שותף בינלאומי", "הזדמנויות לעמלה חוזרת", "גישה למשאבי שותף זכאים", "פעילות בשווקים בינלאומיים שאושרו"],
    planNotes: ["הגשת הבקשה היא ללא תשלום", "תשלום נדרש רק אחרי אישור", "תשלום ידני מחוץ לאתר", "אין חיוב אוטומטי", "כפוף להסכם השותפות"],
    noCharge: "העמוד הזה לא מתחיל חיוב אוטומטי.",
    due: "אחרי האישור, ועד לתיעוד התשלום הידני, החברות נשארת payment_due.",
    applyMonthly: "הרשמה חודשית",
    applyAnnual: "הרשמה שנתית",
    territoryTitle: "הטריטוריה נקבעת בנפרד",
    territoryLead: "החיוב החודשי והשנתי אינו בוחר טריטוריה ואינו כולל בלעדיות. אין דמי טריטוריה פרימיום נפרדים.",
    territories: [
      ["מינוי לא בלעדי", "Bizuply רשאית למנות שותפים נוספים באותה טריטוריה. המינוי אינו נועל את הטריטוריה."],
      ["טריטוריה בלעדית", "ניתנת רק כשההסכם החתום קובע בלעדיות, הטריטוריה פנויה, שני הצדדים חתמו, והתשלום הנדרש הושלם."],
    ],
    otherPlans: "מסלולי השותפים האחרים של Bizuply נשארים בתנאים הנוכחיים שלהם ואינם נבחרים בעמוד הזה.",
    journeyTitle: "הדרך להצטרפות כשותף של Bizuply",
    steps: [
      ["הגשת הבקשה", "ספרו על העסק, הניסיון, המדינה ושוק היעד."],
      ["בדיקת הבקשה", "הצוות בודק התאמה ואת התאמת השותפות."],
      ["הסכם שותפות", "קוראים וחותמים על הסכם השותפות החל."],
      ["הפעלת החברות", "משלימים את תהליך התשלום הידני שאושר. החברות נשארת payment_due עד שהתשלום מאומת."],
      ["מתחילים לבנות את העסק", "נכנסים למשאבי השותף הזכאים ומתחילים פעילות שותפות מאושרת."],
    ],
    fitTitle: "נבנתה ליזמים ולאנשי צמיחה עסקית",
    audiences: [
      ["סוכנויות שיווק", "הוסיפו CRM, מסרים, אתרים ואוטומציה לשירותים שאתם כבר מפעילים ללקוחות."],
      ["יועצים עסקיים", "תנו ללקוחות מערכת ללידים, להמשך טיפול ולתורים, והרוויחו על מנויים זכאים."],
      ["מומחי טרנספורמציה דיגיטלית", "הציגו מערכת מחוברת במקום כלי אחד מנותק."],
      ["ספקי שירותי טכנולוגיה", "הטמיעו את המוצרים שהלקוחות צריכים, בתוך ההסכם וכללי המוצר."],
      ["יזמי SaaS", "אפשר ללמוד את הקטלוג עכשיו. מכירת שותפים של מוצרי ה-SaaS עדיין בקרוב."],
      ["אנשי מכירות", "בנו תיק של לקוחות משלמים והתקדמו במדרגות העמלה המפורסמות."],
      ["מומחי CRM", "הובילו עם ה-CRM, הצינורות וכרטיסי הלקוח שעסקים כבר מחפשים."],
      ["מומחי אוטומציית WhatsApp", "הציעו תהליכי WhatsApp Business API רשמיים כשמדיניות Meta, האישורים והעלויות מאפשרים זאת."],
    ],
    hubTitle: "מרכז הצמיחה של השותף",
    hubLead: "מרכז השותפים הקיים נפתח רק כשהשותף פעיל, ההסכם פעיל, והתשלום אומת.",
    hub: ["קליטה", "משאבי הכשרה זמינים", "ידע על המוצרים", "חומרי מכירה מאושרים", "ניהול חשבון השותף", "מידע על עמלות"],
    faqTitle: "שאלות ששותפים שואלים",
    closeTitle: "מוכנים לבנות את העסק עם Bizuply?",
    closeBody: "הגישו בקשה להצטרף לתוכנית השותפים הבינלאומית של Bizuply ובדקו איך לפתח את העסק עם מערכת הטכנולוגיה שלנו.",
    closeCta: "הגשת בקשה להצטרפות",
    login: "כניסת שותפים",
    shotCaption: "סביבת דמו",
  },
} as const;

type Copy = (typeof COPY)["en"];

function money(amount: number) {
  return `$${Math.round(amount).toLocaleString("en-US")}`;
}

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

export function commissionRateForCustomers(customers: number) {
  const count = Math.max(0, Math.round(customers));
  if (count >= 40) return 0.4;
  if (count >= 20) return 0.35;
  if (count >= 1) return 0.3;
  return 0;
}

function tierCount(rate: number) {
  if (rate >= 0.4) return 40;
  if (rate >= 0.35) return 20;
  return 1;
}

export default function PartnersRecruitment() {
  const { i18n } = useTranslation();
  const hebrew = Boolean(i18n.language?.startsWith("he"));
  const copy = (hebrew ? COPY.he : COPY.en) as Copy;
  const dir = getTextDirection(i18n.language);
  const faq = partnerFaqPairs(i18n.language);
  const [options, setOptions] = useState<InternationalBillingOption[]>(INTERNATIONAL_BILLING_OPTIONS);
  const [customers, setCustomers] = useState(20);
  const [price, setPrice] = useState(99);

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
    const reduce = typeof window.matchMedia === "function"
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
      { threshold: 0.15 }
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
  const estimate = useMemo(() => {
    const count = Math.max(0, Math.round(Number(customers) || 0));
    const monthlyRevenue = Math.round(count * (Number(price) || 0));
    const monthlyCommission = Math.round(monthlyRevenue * commissionRateForCustomers(count));
    return { monthlyRevenue, monthlyCommission, annualCommission: monthlyCommission * 12 };
  }, [customers, price]);

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

  return (
    <div className="ipartner" dir={dir} data-testid="partners-recruitment">
      <Helmet>
        <title>{copy.seoTitle}</title>
        <meta name="description" content={copy.seoDescription} />
        <link rel="canonical" href="https://bizuply.com/partners" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <header className="ip-hero">
        <div className="ip-wrap ip-hero-grid">
          <div>
            <p className="ip-kicker">{copy.kicker}</p>
            <p className="ip-kicker" style={{ letterSpacing: "0.02em", textTransform: "none" }}>{copy.program}</p>
            <h1>{copy.h1}</h1>
            <p className="ip-sub">{copy.sub}</p>
            <p className="ip-lead">{copy.lead}</p>
            <p className="ip-lead">{copy.lead2}</p>
            <div className="ip-actions">
              <Link className="ip-btn ip-btn-primary" to={annualHref}>{copy.become}</Link>
              <a className="ip-btn ip-btn-ghost" href="#benefits">{copy.explore}</a>
            </div>
          </div>
          <figure className="ip-shot">
            <img src="/demo-media/crm/leads-list.png" alt={copy.products[0].alt} width="1280" height="800" />
            <figcaption className="ip-note" style={{ padding: "10px 14px" }}>{copy.shotCaption}</figcaption>
          </figure>
        </div>
        <div className="ip-wrap ip-facts" aria-label={copy.program}>
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

      <section className="ip-section ip-band ip-reveal">
        <div className="ip-wrap">
          <h2>{copy.productsTitle}</h2>
          <p className="ip-copy">{copy.productsLead}</p>
          <div className="ip-products">
            {copy.products.map((product) => (
              <article className="ip-product" key={product.href}>
                <figure className="ip-shot">
                  <img src={product.image} alt={product.alt} width="960" height="600" />
                </figure>
                <div>
                  <h3>{product.title}</h3>
                  <ul>
                    {product.points.map((point) => <li key={point}>{point}</li>)}
                  </ul>
                  {"note" in product && product.note ? <p className="ip-note">{product.note}</p> : null}
                  <p><Link to={product.href}>{product.title}</Link></p>
                </div>
              </article>
            ))}
          </div>
          <h3 style={{ marginTop: 36 }}>{copy.saasTitle}</h3>
          <p className="ip-copy">{copy.saasLead}</p>
          <div className="ip-saas-grid">
            {copy.saas.map((name) => (
              <article className="ip-saas" key={name}>
                <span className="ip-badge">{copy.soon}</span>
                <h3 style={{ marginTop: 12 }}>{name}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ip-section ip-reveal">
        <div className="ip-wrap">
          <h2>{copy.getsTitle}</h2>
          <ol className="ip-grid-2" style={{ marginTop: 24 }}>
            {copy.gets.map((item) => <li className="ip-card" key={item}>{item}</li>)}
          </ol>
        </div>
      </section>

      <section className="ip-section ip-band ip-reveal" id="commissions">
        <div className="ip-wrap">
          <h2>{copy.commTitle}</h2>
          <p className="ip-copy">{copy.commLead}</p>
          <div className="ip-table-wrap">
            <table className="ip-table">
              <caption className="ip-note" style={{ captionSide: "bottom", padding: 12 }}>{copy.commLead}</caption>
              <thead>
                <tr>
                  <th>{copy.customers}</th>
                  <th>{copy.rate}</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>1–19</td><td>30%</td></tr>
                <tr><td>20–39</td><td>35%</td></tr>
                <tr><td>40+</td><td>40%</td></tr>
              </tbody>
            </table>
          </div>
          <p className="ip-onetime">{copy.oneTime}</p>

          <h3 style={{ marginTop: 36 }}>{copy.calcTitle}</h3>
          <form className="ip-calc" data-testid="partner-commission-calculator" onSubmit={(event) => event.preventDefault()}>
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
            <div>
              <p style={{ fontWeight: 800, marginTop: 0 }}>{copy.calcTier}</p>
              <div className="ip-tiers">
                {[
                  [0.3, "30%"],
                  [0.35, "35%"],
                  [0.4, "40%"],
                ].map(([value, label]) => (
                  <button
                    key={label}
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
            </div>
            <p className="ip-note" style={{ gridColumn: "1 / -1" }}>{copy.disclaimer}</p>
          </form>
        </div>
      </section>

      <section className="ip-section ip-reveal" id="plans">
        <div className="ip-wrap">
          <h2>{copy.plansTitle}</h2>
          <div className="ip-plans md:grid-cols-2" data-testid="international-price-cards" style={{ marginTop: 24 }}>
            <article className="ip-plan" data-testid="monthly-price-card">
              <h3>{hebrew ? monthly.labelHe : monthly.labelEn}</h3>
              <p className="ip-price" data-testid="international-monthly-price">
                {money(monthly.amountUsd)} <span>{copy.perMonth}</span>
              </p>
              <ul>{copy.monthlyPoints.map((point) => <li key={point}>{point}</li>)}</ul>
              <Link className="ip-btn ip-btn-ghost" to={monthlyHref} data-testid="international-monthly-link">{copy.applyMonthly}</Link>
            </article>
            <article className="ip-plan ip-plan-best" data-testid="annual-price-card">
              <span className="ip-badge" data-testid="annual-best-value">{copy.best}</span>
              <h3>{hebrew ? annual.labelHe : annual.labelEn}</h3>
              <p className="ip-price" data-testid="international-annual-price">
                {money(annual.amountUsd)} <span>{copy.perYear}</span>
              </p>
              <p className="ip-save" data-testid="annual-savings">{copy.save.replace("$988", money(savings))}</p>
              <ul>{copy.annualPoints.map((point) => <li key={point}>{point}</li>)}</ul>
              <Link className="ip-btn ip-btn-primary" to={annualHref} data-testid="international-register-link">{copy.applyAnnual}</Link>
            </article>
          </div>
          <ul className="ip-copy">
            {copy.planNotes.map((note) => <li key={note}>{note}</li>)}
            <li>{copy.noCharge}</li>
            <li><Rich text={copy.due} /></li>
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
          <p className="ip-note">{copy.otherPlans}</p>
        </div>
      </section>

      <section className="ip-section ip-band ip-reveal">
        <div className="ip-wrap">
          <h2>{copy.journeyTitle}</h2>
          <div className="ip-steps" style={{ marginTop: 24 }}>
            {copy.steps.map(([title, body], index) => (
              <article className="ip-step" key={title}>
                <span className="ip-num">{index + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p><Rich text={body} /></p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ip-section ip-reveal">
        <div className="ip-wrap">
          <h2>{copy.fitTitle}</h2>
          <div className="ip-audiences" style={{ marginTop: 24 }}>
            {copy.audiences.map(([title, body]) => (
              <article className="ip-audience" key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ip-section ip-band ip-hub ip-reveal">
        <div className="ip-wrap">
          <h2>{copy.hubTitle}</h2>
          <p className="ip-copy">{copy.hubLead}</p>
          <ul>
            {copy.hub.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="ip-section ip-faq ip-reveal" id="faq">
        <div className="ip-wrap">
          <h2>{copy.faqTitle}</h2>
          {faq.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p><Rich text={answer} /></p>
            </details>
          ))}
        </div>
      </section>

      <section className="ip-section" id="apply">
        <div className="ip-wrap">
          <div className="ip-close">
            <h2>{copy.closeTitle}</h2>
            <p>{copy.closeBody}</p>
            <div className="ip-actions">
              <Link className="ip-btn ip-btn-primary" to={annualHref}>{copy.closeCta}</Link>
              <Link className="ip-btn ip-btn-ghost" to="/login">{copy.login}</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
