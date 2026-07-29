import type { MarketingFaq, MarketingStat } from "../product-marketing";

/**
 * Copy for the /crm page.
 * Statuses, field names and integration steps below mirror the real CRM module
 * (leads pipeline, client file, appointments, services).
 */

export const crmHeroStats: MarketingStat[] = [
  { value: 5, label: "סטטוסים בצינור הלידים" },
  { value: 3, label: "ערוצי לידים אוטומטיים" },
  { value: 7, label: "סוגי תיעוד בתיק הלקוח" },
  { value: 15, suffix: " דק׳", label: "רזולוציית יומן התורים" },
];

export type PipelineStage = {
  id: "new" | "contacted" | "interested" | "converted" | "lost";
  label: string;
  accent: string;
};

/** The five statuses a lead can hold. */
export const pipelineStages: PipelineStage[] = [
  { id: "new", label: "חדש", accent: "#7c3aed" },
  { id: "contacted", label: "נוצר קשר", accent: "#2563eb" },
  { id: "interested", label: "מעוניין", accent: "#0891b2" },
  { id: "converted", label: "הומר", accent: "#059669" },
  { id: "lost", label: "אבוד", accent: "#94a3b8" },
];

export type IntegrationSpec = {
  id: "meta" | "google" | "website";
  name: string;
  badge: string;
  accent: string;
  steps: string[];
  note: string;
};

export const crmIntegrations: IntegrationSpec[] = [
  {
    id: "meta",
    name: "Facebook & Instagram Lead Ads",
    badge: "Meta App Review",
    accent: "#1877f2",
    steps: [
      "מתחברים עם חשבון הפייסבוק ומאשרים הרשאות",
      "בוחרים את דף העסק שיסונכרן",
      "בוחרים את טופס הלידים הפעיל של הקמפיין",
    ],
    note: "מרגע החיבור, כל ליד חדש מהקמפיין נכנס לצינור אוטומטית דרך Webhook של Meta.",
  },
  {
    id: "google",
    name: "Google Ads Lead Forms",
    badge: "Google Ads API",
    accent: "#ea4335",
    steps: [
      "מתחברים עם חשבון Google",
      "בוחרים חשבון Google Ads ונכס של טופס ליד",
      "המערכת מגדירה את כתובת ה־Webhook ושולחת ליד בדיקה",
    ],
    note: "הלידים נכנסים בזמן אמת עם פרטי הקמפיין, כולל gclid, לצד שאר הלידים.",
  },
  {
    id: "website",
    name: "טפסים באתר שבניתם",
    badge: "Website Forms",
    accent: "#7c3aed",
    steps: [
      "מוסיפים סקשן טופס לידים לאתר בעורך הוויזואלי",
      "מגדירים שדות, חיוב טלפון והודעת תגובה אוטומטית",
      "מפרסמים — וכל פנייה נשמרת עם המקור \"אתר\"",
    ],
    note: "אותו טופס שולח לכם התראת אימייל ומחזיר למשאיר הפנייה הודעת תודה.",
  },
];

export const crmFaq: MarketingFaq[] = [
  {
    q: "אילו סטטוסים יש לליד?",
    a: "חמישה: חדש, נוצר קשר, מעוניין, הומר ואבוד. כל שינוי סטטוס נרשם אוטומטית בציר הזמן של הליד, כך שרואים מתי הוא זז ולאן.",
  },
  {
    q: "מאיפה הלידים מגיעים למערכת?",
    a: "משלושה ערוצים אוטומטיים: Facebook ו־Instagram Lead Ads דרך חיבור Meta מאושר, טפסי לידים של Google Ads, וטפסים באתר שבניתם ב־BizUply. לכל ליד נשמר המקור שלו לצד הפרטים.",
  },
  {
    q: "האם BizUply באמת מאושרת על ידי Meta?",
    a: "כן. אפליקציית BizUply עברה את תהליך ה־App Review של Meta לחיבור Lead Ads. העסק מחבר את דף הפייסבוק שלו בעצמו ומאשר את ההרשאות, ומאותו רגע הלידים זורמים ישירות ל־CRM.",
  },
  {
    q: "איך לא מפספסים מעקב?",
    a: "בכל ליד אפשר לתעד הערה, שיחה או וואטסאפ, ולפתוח משימה עם תאריך ושעה. משימות שעבר זמנן מופיעות במרכז ההתראות של המערכת, וגם לידים חדשים נכנסים להתראות בזמן אמת.",
  },
  {
    q: "מה נשמר בתיק הלקוח?",
    a: "פרטי קשר וכתובת, ציר זמן תיעוד שכולל הערות, שיחות, וואטסאפ, משימות, פגישות, קבצים והסכמים — עם העלאת מסמכים (תמונות, PDF, Word, Excel, PowerPoint), היסטוריית פגישות ושדות נתונים מותאמים.",
  },
  {
    q: "איך עובד יומן התורים?",
    a: "מגדירים שעות פעילות לכל יום בשבוע וקטלוג שירותים עם משך ומחיר. המערכת מחשבת מהם את החלונות הפנויים בקפיצות של 15 דקות, והתור נשמר עם שירות, מחיר, סטטוס תשלום והערה.",
  },
  {
    q: "הלקוח יכול לקבוע תור לבד?",
    a: "כן. יש עמוד זימון ללקוחות שבו בוחרים שירות ותאריך מתוך אותם חלונות פנויים. בעת קביעת התור נשלח אישור במייל ללקוח ולעסק, והתור מופיע מיד ביומן.",
  },
  {
    q: "אפשר לראות תמונת מצב בלי להיכנס ל־CRM?",
    a: "כן. לוח הבקרה של העסק מציג לידים חדשים, לידים שלא טופלו, שינוי לעומת התקופה הקודמת, טבלת הלידים האחרונים עם מקור וסטטוס, והפגישות הקרובות.",
  },
];
