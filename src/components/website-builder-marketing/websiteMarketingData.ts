import type { MarketingFaq, MarketingStat } from "../product-marketing";

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
  { label: "נדל״ן", count: 25, accent: "#c9a962" },
  { label: "אוכל ומסעדות", count: 24, accent: "#8b1e3f" },
  { label: "תיירות וחוף", count: 10, accent: "#0891b2" },
  { label: "חינוך וקורסים", count: 10, accent: "#7c3aed" },
];

export type PluginChip = {
  name: string;
  category: string;
  accent: string;
};

/** Names taken from the plugin store catalog. */
export const pluginChips: PluginChip[] = [
  { name: "כלי נגישות BizUply", category: "נגישות", accent: "#2563eb" },
  { name: "ספירה לאחור", category: "המרות", accent: "#f59e0b" },
  { name: "גלגל הטבות", category: "מועדון", accent: "#e11d8c" },
  { name: "חיפוש חכם", category: "חוויית משתמש", accent: "#0891b2" },
  { name: "חנות אונליין", category: "מסחר", accent: "#9a6f3b" },
  { name: "יומן ותורים", category: "תורים", accent: "#4f46e5" },
  { name: "תשלומים", category: "פיננסים", accent: "#059669" },
  { name: "חשבוניות Morning", category: "פיננסים", accent: "#0d9488" },
  { name: "טופס לידים", category: "שיווק", accent: "#7c3aed" },
  { name: "ביקורות", category: "שיווק", accent: "#f59e0b" },
  { name: "מועדון לקוחות", category: "מועדון", accent: "#db2777" },
  { name: "מפת חום", category: "אנליטיקס", accent: "#dc2626" },
  { name: "מנתח נטישת טפסים", category: "אנליטיקס", accent: "#ea580c" },
  { name: "הקלטת מסע לקוח", category: "אנליטיקס", accent: "#0284c7" },
  { name: "כפתור וואטסאפ צף", category: "תקשורת", accent: "#16a34a" },
  { name: "תפריט דיגיטלי", category: "מסעדות", accent: "#b91c1c" },
  { name: "פופאפ יציאה", category: "המרות", accent: "#c026d3" },
  { name: "בחירת שפה", category: "בינלאומי", accent: "#0ea5e9" },
];

/** Plugins that render on the published site, not just install from the store. */
export const livePlugins = [
  {
    name: "כלי נגישות BizUply",
    text: "ווידג׳ט נגישות שמופיע באתר שפורסם — התאמות ניגודיות, גופן ועוד.",
  },
  {
    name: "ספירה לאחור",
    text: "טיימר מבצע חי שמוטמע בסקשן ורץ מול המבקרים באתר.",
  },
  {
    name: "גלגל הטבות",
    text: "גלגל הטבות אינטראקטיבי לאיסוף פניות ולעידוד המרות.",
  },
  {
    name: "חיפוש חכם",
    text: "חיפוש פנימי באתר שמוצג כשכבה מעל התוכן שפורסם.",
  },
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
    q: "אפשר לשנות את מבנה האתר ולא רק את התוכן?",
    a: "כן. פאנל השכבות מאפשר לגרור סקשנים ולסדר אותם מחדש, להוסיף ולמחוק עמודים ותתי־עמודים, לקבוע עמוד בית ולהסתיר עמודים מהתפריט — והתפריט מתעדכן בהתאם.",
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
