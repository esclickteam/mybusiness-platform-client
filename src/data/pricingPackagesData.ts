/** BizUply service packages for the public pricing page (ILS) */

export type PricingPackage = {
  type: "website" | "monthly" | "yearly";
  /** Stripe checkout plan key — null means contact / non-Stripe */
  checkoutPlan: "monthly" | "yearly" | null;
  highlighted: boolean;
  /** Business packages can optionally add a one-time self-serve website */
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

/** One-time self-serve website add-on for business packages (ILS) */
export const WEBSITE_ADDON = {
  price: 550,
  labelHe: "תוספת אתר ₪550 חד־פעמי — בניית אתר עצמאית",
  labelEn: "Website add-on ₪550 one-time — self-serve website build",
  hintHe: "תבניות, בנייה עם AI ועורך ויזואלי — חד־פעמי, לא כלול בחבילה",
  hintEn: "Templates, AI build and visual editor — one-time, not included in the package",
} as const;

export const PRICING_PACKAGES: PricingPackage[] = [
  {
    type: "website",
    checkoutPlan: null,
    highlighted: false,
    allowsWebsiteAddon: false,
    price: 600,
    pricePeriodHe: "/שנה",
    pricePeriodEn: "/year",
    nameHe: "בניית אתר בלבד",
    nameEn: "Website only",
    badgeHe: "בניה עצמאית",
    badgeEn: "Self-serve",
    descriptionHe:
      "בונים אתר מקצועי לבד — מתבנית או עם AI — מפרסמים ומתחילים לקבל פניות.",
    descriptionEn:
      "Build a professional site yourself — from a template or with AI — publish and start getting inquiries.",
    noteHe: "₪50 לחודש בממוצע · ללא התחייבות לחבילה העסקית המלאה",
    noteEn: "About ₪50/month · no full business plan required",
    buttonHe: "התחילו עם אתר",
    buttonEn: "Start with a website",
    featuresHe: [
      "בונה אתרים עם עורך ויזואלי מלא",
      "מאות תבניות מוכנות לענפים שונים",
      "בנייה עם AI לפי שאלון קצר",
      "עמודים, סקשנים, גלריות וטפסים",
      "התאמה למובייל, טאבלט ודסקטופ",
      "פרסום לכתובת BizUply או דומיין שלכם",
      "טופס לידים מהאתר",
      "כלי נגישות מובנים",
      "SEO בסיסי לעמודים",
      "עריכה עצמאית בכל זמן",
    ],
    featuresEn: [
      "Full visual website builder",
      "Hundreds of ready-made industry templates",
      "AI site build from a short questionnaire",
      "Pages, sections, galleries, and forms",
      "Mobile, tablet, and desktop responsive",
      "Publish to BizUply URL or your domain",
      "Lead form from the site",
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
    price: 149,
    pricePeriodHe: "/חודש",
    pricePeriodEn: "/month",
    nameHe: "חבילה עסקית חודשית",
    nameEn: "Business monthly",
    badgeHe: "גמיש",
    badgeEn: "Flexible",
    descriptionHe:
      "גישה למערכת BizUply העסקית — CRM, תורים, שיתופים, אוטומציות ו־AI. ללא אתר כלול. חיוב חודשי גמיש.",
    descriptionEn:
      "Access to the BizUply business system — CRM, appointments, collaborations, automations, and AI. Website not included. Flexible monthly billing.",
    noteHe: "מושלם לבדיקה ולצמיחה חודש אחר חודש",
    noteEn: "Perfect for testing and growing month by month",
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
      "יועץ BizUply AI ותובנות",
      "משימות, תיעוד שיחות והתראות",
      "אנליטיקה ודשבורד ביצועים",
      "אפשרות להוסיף נציגים אנושיים",
      "אפשרות להוסיף בניית אתר בנפרד",
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
    ],
  },
  {
    type: "yearly",
    checkoutPlan: "yearly",
    highlighted: true,
    allowsWebsiteAddon: true,
    price: 1490,
    pricePeriodHe: "/שנה",
    pricePeriodEn: "/year",
    nameHe: "חבילה עסקית שנתית",
    nameEn: "Business yearly",
    badgeHe: "הכי משתלם",
    badgeEn: "Best value",
    descriptionHe:
      "המערכת העסקית במחיר שנתי משתלם — CRM, תורים, שיתופים ו־AI. ללא אתר כלול.",
    descriptionEn:
      "The business system at a better yearly price — CRM, appointments, collaborations, and AI. Website not included.",
    noteHe: "₪124 לחודש · חיסכון של ₪298 לעומת חודשי",
    noteEn: "₪124/month · save ₪298 vs monthly",
    buttonHe: "התחילו שנתי",
    buttonEn: "Start yearly",
    featuresHe: [
      "הכול מהחבילה העסקית החודשית",
      "חיסכון שנתי משמעותי",
      "עדיפות בתמיכה וליווי",
      "גישה מלאה לכל המודולים העסקיים",
      "CRM + תורים + שיתופים + AI",
      "אוטומציות והתראות ללא הגבלה",
      "דשבורד ביצועים ואנליטיקה",
      "אפשרות להוסיף בניית אתר בנפרד",
      "אפשרות להוסיף שירותים נוספים לעסק",
    ],
    featuresEn: [
      "Everything in the Business monthly package",
      "Meaningful yearly savings",
      "Priority support",
      "Full access to all business modules",
      "CRM + appointments + collaborations + AI",
      "Automations and alerts without limits",
      "Performance dashboard and analytics",
      "Option to add website building separately",
      "Option to add additional business services",
    ],
  },
];
