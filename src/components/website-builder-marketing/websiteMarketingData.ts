import type { MarketingFaq } from "../product-marketing";
import type { MarketingStat } from "../product-marketing";

/**
 * Copy for the /website-builder page.
 * Every number and feature name below is taken from what the studio actually
 * ships today (template folders, plugin catalog, SEO panel, publish flow).
 */

export const websiteHeroStats: MarketingStat[] = [
  { value: 205, label: "תבניות מוכנות לעריכה" },
  { value: 140, label: "עמודים בספריית העמודים" },
  { value: 59, label: "תוספים בחנות התוספים" },
  { value: 80, label: "צעדי ביטול בעורך" },
];

export type TemplateCategoryStat = {
  label: string;
  count: number;
  accent: string;
};

/** Real category distribution across the template library. */
export const templateCategories: TemplateCategoryStat[] = [
  { label: "חנויות ומסחר", count: 32, accent: "#9a6f3b" },
  { label: "דפי נחיתה", count: 27, accent: "#2563eb" },
  { label: "פורטפוליו וסוכנות", count: 26, accent: "#0f172a" },
  { label: "יופי וטיפוח", count: 26, accent: "#e11d8c" },
  { label: "אוכל ומסעדות", count: 24, accent: "#8b1e3f" },
  { label: "נדל״ן", count: 25, accent: "#c9a962" },
  { label: "תיירות וחוף", count: 10, accent: "#0891b2" },
  { label: "חינוך וקורסים", count: 10, accent: "#7c3aed" },
];

export type PluginChip = {
  name: string;
  category: string;
  accent: string;
  /** Runs on the published site today (not just installable from the store). */
  live?: boolean;
};

/** Names taken from the plugin store catalog. */
export const pluginChips: PluginChip[] = [
  { name: "כלי נגישות BizUply", category: "נגישות", accent: "#2563eb", live: true },
  { name: "ספירה לאחור", category: "המרות", accent: "#f59e0b", live: true },
  { name: "גלגל הטבות", category: "מועדון", accent: "#e11d8c", live: true },
  { name: "חיפוש חכם", category: "חוויית משתמש", accent: "#0891b2", live: true },
  { name: "חנות אונליין", category: "מסחר", accent: "#9a6f3b" },
  { name: "יומן ותורים", category: "תורים", accent: "#4f46e5" },
  { name: "תשלומים", category: "פיננסים", accent: "#059669" },
  { name: "חשבוניות Morning", category: "פיננסים", accent: "#0d9488" },
  { name: "טופס לידים", category: "שיווק", accent: "#7c3aed" },
  { name: "ביקורות", category: "שיווק", accent: "#f59e0b" },
  { name: "מועדון לקוחות", category: "מועדון", accent: "#db2777" },
  { name: "סוכן מכירות AI", category: "AI", accent: "#6d28d9" },
  { name: "מצא את השירות שלי", category: "AI", accent: "#8b5cf6" },
  { name: "מפת חום", category: "אנליטיקס", accent: "#dc2626" },
  { name: "מנתח נטישת טפסים", category: "אנליטיקס", accent: "#ea580c" },
  { name: "הקלטת מסע לקוח", category: "אנליטיקס", accent: "#0284c7" },
  { name: "כפתור וואטסאפ צף", category: "תקשורת", accent: "#16a34a" },
  { name: "תפריט דיגיטלי", category: "מסעדות", accent: "#b91c1c" },
  { name: "פופאפ יציאה", category: "המרות", accent: "#c026d3" },
  { name: "בחירת שפה", category: "בינלאומי", accent: "#0ea5e9" },
];

/** Schema.org types the JSON-LD builder can generate. */
export const schemaTypes = [
  "LocalBusiness",
  "Service",
  "FAQPage",
  "Product",
  "Organization",
  "WebSite",
  "BreadcrumbList",
];

export const seoControls = [
  "כותרת ותיאור לכל עמוד",
  "Canonical ובקרת אינדוקס",
  "הנחיות Robots מלאות",
  "Open Graph ותצוגת Twitter",
  "אימות Google Search Console",
  "hreflang ותגיות Meta מותאמות",
  "בונה Schema.org JSON-LD",
  "sitemap.xml ו־robots.txt אוטומטיים",
];

export const paymentProviders = [
  "Stripe",
  "PayPal",
  "Tranzila",
  "Max / Hyp",
  "Grow",
  "Morning",
];

export const websiteFaq: MarketingFaq[] = [
  {
    q: "צריך לדעת לתכנת כדי לבנות אתר ב־BizUply?",
    a: "לא. בוחרים אחת מ־205 התבניות, לוחצים על כל אלמנט ומשנים אותו במקום — טקסט, צבע, תמונה ומרווחים. מי שכן רוצה לרדת לרזולוציה נמוכה יכול להוסיף CSS משלו ותגיות HTML ל־head ול־body של האתר.",
  },
  {
    q: "מה בדיוק ה־AI בונה בשבילי?",
    a: "אשף הבנייה שואל על העסק (שם, תחום, תיאור וקהל יעד), על סגנון וטון, ועל העמודים שאתם רוצים — ומייצר טיוטת אתר מרובת עמודים עם תוכן מותאם, שנפתחת ישירות בעורך הוויזואלי להמשך עריכה.",
  },
  {
    q: "איפה האתר מתפרסם ואפשר לחבר דומיין פרטי?",
    a: "כל אתר מקבל כתובת משלו תחת sites.bizuply.com. בנוסף אפשר לחפש ולרכוש דומיין ישירות מתוך המערכת ולחבר אותו לאתר, או לחבר דומיין קיים ולנתק אותו בכל שלב.",
  },
  {
    q: "הפניות מהאתר מגיעות ל־CRM?",
    a: "כן. טפסי הלידים באתר מוגדרים לשלוח כל פנייה ישירות לצינור הלידים ב־CRM עם המקור \"אתר\", כולל התראת אימייל, הודעת תגובה אוטומטית למשאיר הפנייה ואפשרות לחייב שדה טלפון.",
  },
  {
    q: "אפשר למכור מהאתר?",
    a: "כן. מפעילים את תוסף החנות, מנהלים את המוצרים מפאנל האתר, והמבקרים מקבלים סל קניות ומסך תשלום. התשלומים עוברים דרך ספק שאתם מחברים — Stripe, PayPal, Tranzila, Max/Hyp, Grow או Morning.",
  },
  {
    q: "אפשר לתת למעצב או לשותף גישה לאתר?",
    a: "כן. אפשר להזמין אנשים לאתר בהרשאת עריכה או צפייה, לראות מי מחובר ולהסיר גישה — וגם להעביר בעלות מלאה על האתר למשתמש אחר.",
  },
  {
    q: "איך אני יודע אם האתר עובד?",
    a: "לוח הבקרה מציג צפיות בעמודים, מבקרים ייחודיים, העמודים המובילים ומקורות התנועה (כולל UTM), כך שרואים מאיפה מגיעים המבקרים ולאן הם נכנסים.",
  },
];
