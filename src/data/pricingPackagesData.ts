/** BizUply service packages for the public pricing page (USD) */

export type PricingPackage = {
  type: "website" | "monthly" | "yearly" | "crm_only" | "whatsapp_api";
  /** Existing checkout plan key. Null means this card does not start a platform checkout. */
  checkoutPlan: "monthly" | "yearly" | "website" | "crm_only" | null;
  /** Existing public page. Used when the card must not start a platform checkout. */
  externalHref?: string;
  highlighted: boolean;
  /** Business packages can optionally add a yearly self-serve website subscription */
  allowsWebsiteAddon: boolean;
  price: number;
  pricePeriodHe: string;
  pricePeriodEn: string;
  nameHe: string;
  nameEn: string;
  badgeHe: string;
  badgeEn: string;
  descriptionHe: string;
  descriptionEn: string;
  noteHe: string;
  noteEn: string;
  buttonHe: string;
  buttonEn: string;
  featuresHe: string[];
  featuresEn: string[];
};

/** Yearly self-serve website add-on subscription for business packages (USD) */
export const WEBSITE_ADDON = {
  price: 99,
  currency: "USD",
  labelHe: "$99 לשנה — בניית אתר עצמאי כתוספת לחבילה העסקית",
  labelEn:
    "$99 per year — self-serve website as a business-plan add-on",
  hintHe:
    "מתחדש אוטומטית מדי שנה, ניתן לבטל בכל עת · תבניות ועורך ויזואלי, מקושר ל-CRM — כולל דומיין חינם לשנה",
  hintEn:
    "Renews automatically every year, cancel anytime · templates and visual editor, linked to CRM — includes free domain for 1 year",
} as const;

export const PRICING_PACKAGES: PricingPackage[] = [
  {
    type: "website",
    checkoutPlan: "website",
    highlighted: false,
    allowsWebsiteAddon: false,
    price: 129,
    pricePeriodHe: "לשנה",
    pricePeriodEn: "/year",
    nameHe: "בניית אתר בלבד",
    nameEn: "Website only",
    badgeHe: "בניה עצמאית",
    badgeEn: "Self-serve",
    descriptionHe:
      "בונים אתר מקצועי לבד מתבנית — מפרסמים, מקבלים פניות, והכול מקושר ל-CRM.",
    descriptionEn:
      "Build a professional site yourself from a template — publish, get inquiries, and everything links to the CRM.",
    noteHe: "מתחדש אוטומטית מדי שנה — ניתן לבטל בכל עת",
    noteEn: "Renews automatically every year — cancel anytime",
    buttonHe: "התחילו עם אתר",
    buttonEn: "Start with a website",
    featuresHe: [
      "בונה אתרים עם עורך ויזואלי מלא",
      "מאות תבניות מוכנות לענפים שונים",
      "עמודים, סקשנים, גלריות וטפסים",
      "התאמה למובייל, טאבלט ודסקטופ",
      "דומיין חינם לשנה הראשונה",
      "פרסום לכתובת BizUply או דומיין שלכם",
      "טופס לידים מהאתר מקושר ל-CRM",
      "כלי נגישות מובנים",
      "SEO בסיסי לעמודים",
      "עריכה עצמאית בכל זמן",
    ],
    featuresEn: [
      "Full visual website builder",
      "Hundreds of ready-made industry templates",
      "Pages, sections, galleries, and forms",
      "Mobile, tablet, and desktop responsive",
      "Free domain for the first year",
      "Publish to BizUply URL or your domain",
      "Site lead form linked to CRM",
      "Built-in accessibility tools",
      "Basic page SEO",
      "Edit anytime on your own",
    ],
  },
  {
    type: "monthly",
    checkoutPlan: "monthly",
    highlighted: false,
    allowsWebsiteAddon: true,
    price: 99,
    pricePeriodHe: "לחודש",
    pricePeriodEn: "/month",
    nameHe: "חבילה עסקית חודשית",
    nameEn: "Business monthly",
    badgeHe: "גמיש",
    badgeEn: "Flexible",
    descriptionHe:
      "גישה למערכת BizUply העסקית — CRM, תורים, שיתופים, אוטומציות ו־AI. ללא אתר כלול.",
    descriptionEn:
      "Access to the BizUply business system — CRM, appointments, collaborations, automations, and AI. Website not included.",
    noteHe: "חיוב חודשי מתחדש",
    noteEn: "Renewing monthly billing",
    buttonHe: "התחילו חודשי",
    buttonEn: "Start monthly",
    featuresHe: [
      "עמוד עסק מקצועי בפלטפורמה",
      "CRM לניהול לידים ולקוחות",
      "יומן תורים ושירותים",
      "מערכת הודעות מובנית",
      "ניהול ביקורות ודירוגים",
      "רשת שיתופי פעולה עסקיים",
      "אוטומציות חכמות",
      "היועץ העסקי + אוטומציות AI",
      "משימות, תיעוד שיחות והתראות",
      "אנליטיקה ודשבורד ביצועים",
      "אפשרות להוסיף נציגים אנושיים",
      "אפשרות להוסיף בניית אתר בנפרד",
      "חיבור חשבון WhatsApp Business אחרי אישור Meta, בלי תשלום נוסף לביזאפלי",
      "WhatsApp Business API הוא מנוי נפרד: 29 דולר לחודש למספר",
    ],
    featuresEn: [
      "Professional business page on the platform",
      "CRM for leads and clients",
      "Appointments calendar and services",
      "Built-in messaging",
      "Reviews and ratings management",
      "Business collaboration network",
      "Smart automations",
      "BizUply AI advisor and insights",
      "Tasks, call logging, and alerts",
      "Analytics and performance dashboard",
      "Option to add human agents",
      "Option to add website building separately",
      "WhatsApp Business connection after Meta approval, with no extra Bizuply fee",
      "WhatsApp Business API is a separate subscription at $29 per number",
    ],
  },
  {
    type: "yearly",
    checkoutPlan: "yearly",
    highlighted: true,
    allowsWebsiteAddon: true,
    price: 990,
    pricePeriodHe: "לשנה",
    pricePeriodEn: "/year",
    nameHe: "חבילה עסקית שנתית",
    nameEn: "Business yearly",
    badgeHe: "הכי משתלם",
    badgeEn: "Best value",
    descriptionHe:
      "המערכת העסקית במחיר שנתי משתלם — CRM, תורים, שיתופים ו־AI. ללא אתר כלול.",
    descriptionEn:
      "The business system at a better yearly price — CRM, appointments, collaborations, and AI. Website not included.",
    noteHe: "חיוב שנתי מתחדש · חיסכון של $198 לעומת חודשי",
    noteEn: "Renewing yearly billing · save $198 vs monthly",
    buttonHe: "התחילו שנתי",
    buttonEn: "Start yearly",
    featuresHe: [
      "הכול מהחבילה העסקית החודשית",
      "חיסכון שנתי משמעותי",
      "גישה מלאה לכל המודולים העסקיים",
      "CRM + תורים + שיתופים + AI",
      "אוטומציות והתראות ללא הגבלה",
      "דשבורד ביצועים ואנליטיקה",
      "אפשרות להוסיף בניית אתר בנפרד",
      "אפשרות להוסיף שירותים נוספים לעסק",
      "חיבור WhatsApp Business כלול; מנוי ה־API נפרד",
    ],
    featuresEn: [
      "Everything in the Business monthly package",
      "Meaningful yearly savings",
      "Full access to all business modules",
      "CRM + appointments + collaborations + AI",
      "Automations and alerts without limits",
      "Performance dashboard and analytics",
      "Option to add website building separately",
      "Option to add additional business services",
      "WhatsApp Business connection is included; the API subscription is separate",
    ],
  },
];

const EXTRA_PRICING_PACKAGES: PricingPackage[] = [
  {
    type: "crm_only",
    checkoutPlan: "crm_only",
    highlighted: false,
    allowsWebsiteAddon: false,
    price: 49,
    pricePeriodHe: "לחודש",
    pricePeriodEn: "/month",
    nameHe: "CRM בלבד",
    nameEn: "CRM only",
    badgeHe: "לידים ולקוחות",
    badgeEn: "Leads and clients",
    descriptionHe: "ניהול לידים ולקוחות. בלי תורים, אוטומציות, שיתופים או WhatsApp.",
    descriptionEn: "Lead and client management. Appointments, automations, collaborations, and WhatsApp are not included.",
    noteHe: "חיוב חודשי מתחדש",
    noteEn: "Renewing monthly billing",
    buttonHe: "בחירת CRM",
    buttonEn: "Choose CRM",
    featuresHe: [
      "רשימת לידים וששת הסטטוסים",
      "פרופילי לקוח, הערות והיסטוריית פעילות",
      "משימות המשך עם תאריך ושעה",
      "שדות מותאמים ברשומת הלקוח",
      "תורים, אוטומציות, שיתופים ו־WhatsApp אינם כלולים",
    ],
    featuresEn: [
      "Lead list and the six lead statuses",
      "Customer profiles, notes, and activity history",
      "Follow-up tasks with a date and time",
      "Custom fields on the customer record",
      "Appointments, automations, collaborations, and WhatsApp are not included",
    ],
  },
  {
    type: "whatsapp_api",
    checkoutPlan: null,
    externalHref: "https://whatsapp.bizuply.com/get-started#request-access",
    highlighted: false,
    allowsWebsiteAddon: false,
    price: 29,
    pricePeriodHe: "לחודש למספר",
    pricePeriodEn: "/month per number",
    nameHe: "WhatsApp Business API",
    nameEn: "WhatsApp Business API",
    badgeHe: "לכל מספר",
    badgeEn: "Per number",
    descriptionHe: "מנוי ביזאפלי למספר וואטסאפ מחובר אחד. חיובי ההודעות של Meta אינם כלולים.",
    descriptionEn: "Bizuply subscription for one connected WhatsApp number. Meta messaging charges are not included.",
    noteHe: "Meta מחייבת הודעות שנמסרו בנפרד, לפי קטגוריה ומדינת הנמען. אין ניסיון חינם.",
    noteEn: "Meta charges delivered messages separately, by category and recipient country. There is no free trial.",
    buttonHe: "למנוי הוואטסאפ",
    buttonEn: "Open WhatsApp signup",
    featuresHe: [
      "מנוי אחד למספר מחובר אחד",
      "API, תבניות, תיבת הודעות ולוח בקרה",
      "מספר נוסף דורש מנוי נוסף",
      "חיובי Meta אינם כלולים ב־29 הדולר",
    ],
    featuresEn: [
      "One subscription covers one connected number",
      "API, templates, inbox, and dashboard",
      "Another number needs its own subscription",
      "Meta charges are not included in the $29",
    ],
  },
];

/** Pricing page only. Homepage consumers keep the original three packages. */
export const PRICING_PAGE_PACKAGES: PricingPackage[] = [
  ...PRICING_PACKAGES,
  ...EXTRA_PRICING_PACKAGES,
];
