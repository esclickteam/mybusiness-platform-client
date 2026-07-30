/** BizUply service packages for the public pricing page (ILS) */

export type PricingPackage = {
  type: "website" | "monthly" | "yearly";
  /** Stripe checkout plan key — null means contact / non-Stripe */
  checkoutPlan: "monthly" | "yearly" | null;
  highlighted: boolean;
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

export const PRICING_PACKAGES: PricingPackage[] = [
  {
    type: "website",
    checkoutPlan: null,
    highlighted: false,
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
    price: 149,
    pricePeriodHe: "/חודש",
    pricePeriodEn: "/month",
    nameHe: "חבילה עסקית חודשית",
    nameEn: "Business monthly",
    badgeHe: "גמיש",
    badgeEn: "Flexible",
    descriptionHe:
      "גישה מלאה לכל מערכת BizUply — אתר, CRM, תורים, שיתופים, אוטומציות ו־AI. חיוב חודשי גמיש.",
    descriptionEn:
      "Full access to the entire BizUply system — website, CRM, appointments, collaborations, automations, and AI. Flexible monthly billing.",
    noteHe: "מושלם לבדיקה ולצמיחה חודש אחר חודש",
    noteEn: "Perfect for testing and growing month by month",
    buttonHe: "התחילו חודשי",
    buttonEn: "Start monthly",
    featuresHe: [
      "הכול מחבילת בניית האתר",
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
    ],
    featuresEn: [
      "Everything in the Website package",
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
    ],
  },
  {
    type: "yearly",
    checkoutPlan: "yearly",
    highlighted: true,
    price: 1490,
    pricePeriodHe: "/שנה",
    pricePeriodEn: "/year",
    nameHe: "חבילה עסקית שנתית",
    nameEn: "Business yearly",
    badgeHe: "הכי משתלם",
    badgeEn: "Best value",
    descriptionHe:
      "כל המערכת במחיר שנתי משתלם — חוסכים וצומחים עם כל הכלים במקום אחד.",
    descriptionEn:
      "The full system at a better yearly price — save more and grow with every tool in one place.",
    noteHe: "₪124 לחודש · חיסכון של ₪298 לעומת חודשי",
    noteEn: "₪124/month · save ₪298 vs monthly",
    buttonHe: "התחילו שנתי",
    buttonEn: "Start yearly",
    featuresHe: [
      "הכול מהחבילה העסקית החודשית",
      "חיסכון שנתי משמעותי",
      "עדיפות בתמיכה וליווי",
      "גישה מלאה לכל המודולים בלי הגבלה",
      "אתר + CRM + תורים + שיתופים + AI",
      "אוטומציות והתראות ללא הגבלה",
      "דשבורד ביצועים ואנליטיקה",
      "אפשרות להוסיף שירותים נוספים לעסק",
    ],
    featuresEn: [
      "Everything in the Business monthly package",
      "Meaningful yearly savings",
      "Priority support",
      "Full unlimited access to all modules",
      "Website + CRM + appointments + collaborations + AI",
      "Automations and alerts without limits",
      "Performance dashboard and analytics",
      "Option to add additional business services",
    ],
  },
];
