import { buildCountdownWidgetMarker } from "../components/site-plugins/countdown/mountCountdownWidgets";

/**
 * Maps installed plugins to editor actions — sections, pages, or widget placeholders.
 */
export type PluginEditorAction = {
  pluginKey: string;
  /**
   * overlay — site-wide floating widget (editor + live mounts, no page HTML)
   * page — adds library page(s)
   * section — inserts a library section into the page
   * widget — real in-page element (e.g. countdown)
   * settings — configuration-only; open manage panel, never insert placeholders
   */
  kind: "section" | "page" | "widget" | "overlay" | "settings";
  sectionId?: string;
  pageTemplateId?: string;
  pageTemplateIds?: string[];
  label: string;
  description?: string;
};

export const CLIENT_PORTAL_PAGE_TEMPLATE_IDS = [
  "page-portal-01",
  "page-portal-11",
  "page-portal-21",
] as const;

export const PLUGIN_EDITOR_ACTIONS: Record<string, PluginEditorAction> = {
  "benefits-wheel": {
    pluginKey: "benefits-wheel",
    kind: "overlay",
    label: "גלגל הטבות צף",
    description: "מודאל + כפתור צף — לא סקשן בעמוד",
  },
  "smart-search": {
    pluginKey: "smart-search",
    kind: "overlay",
    label: "כפתור חיפוש",
    description: "לחיצה פותחת שורת חיפוש באתר",
  },
  accessibility: {
    pluginKey: "accessibility",
    kind: "overlay",
    label: "תפריט נגישות",
    description: "כפתור צף + תפריט נגישות מקצועי של BizUply — ללא UserWay",
  },
  "smart-bot": {
    pluginKey: "smart-bot",
    kind: "overlay",
    label: "בוט חכם צף",
    description: "כפתור צף שפותח חלון שיחה — לא רכיב בעמוד",
  },
  "whatsapp-float": {
    pluginKey: "whatsapp-float",
    kind: "overlay",
    label: "כפתור WhatsApp צף",
    description: "כפתור ירוק קבוע בפינה — לא רכיב בעמוד",
  },
  "announcement-bar": {
    pluginKey: "announcement-bar",
    kind: "overlay",
    label: "פס הודעות",
    description: "פס עליון בכל האתר — לא סקשן בעמוד",
  },
  "cookie-banner": {
    pluginKey: "cookie-banner",
    kind: "overlay",
    label: "באנר עוגיות",
    description: "באנר הסכמה בתחתית האתר — לא רכיב בעמוד",
  },
  "exit-popup": {
    pluginKey: "exit-popup",
    kind: "overlay",
    label: "פופאפ יציאה",
    description: "חלון לידים ביציאה או אחרי השהיה — לא סקשן בעמוד",
  },
  "multi-language": {
    pluginKey: "multi-language",
    kind: "overlay",
    label: "מחליף שפה",
    description: "כפתור שפה צף בכל האתר — לא רכיב שנגרר לעמוד",
  },
  "social-proof": {
    pluginKey: "social-proof",
    kind: "overlay",
    label: "הוכחה חברתית",
    description: "התראות המרה צפות — לא רכיב שנגרר לעמוד",
  },
  "floating-contact-bar": {
    pluginKey: "floating-contact-bar",
    kind: "overlay",
    label: "סרגל יצירת קשר",
    description: "סרגל צף בכל האתר — לא רכיב שנגרר לעמוד",
  },
  "faq-pro": {
    pluginKey: "faq-pro",
    kind: "overlay",
    label: "FAQ Pro",
    description: "וידג'ט FAQ לפי הגדרות הפאנל — לא placeholder בעמוד",
  },
  "analytics-pro": {
    pluginKey: "analytics-pro",
    kind: "settings",
    label: "Analytics Pro",
    description: "הגדרות אנליטיקה בפאנל הניהול — לא אלמנט בעורך",
  },
  "seo-pro": {
    pluginKey: "seo-pro",
    kind: "settings",
    label: "SEO Pro",
    description: "ביקורת והגדרות SEO בפאנל — לא אלמנט בעורך",
  },
  "refer-a-friend": {
    pluginKey: "refer-a-friend",
    kind: "settings",
    label: "חבר מביא חבר",
    description: "קמפיין הפניות בהגדרות — לא אלמנט בעורך",
  },
  "birthday-club": {
    pluginKey: "birthday-club",
    kind: "settings",
    label: "מועדון יום הולדת",
    description: "הגדרות CRM/אוטומציה בפאנל — לא אלמנט בעורך",
  },
  "form-to-pdf": {
    pluginKey: "form-to-pdf",
    kind: "settings",
    label: "טופס ל-PDF",
    description: "הפקת PDF מהגדרות — לא אלמנט בעורך",
  },
  "smart-forms": {
    pluginKey: "smart-forms",
    kind: "settings",
    label: "טפסים חכמים Pro",
    description: "ניהול טפסים בפאנל — לא placeholder בעמוד",
  },
  "qr-generator": {
    pluginKey: "qr-generator",
    kind: "settings",
    label: "QR Generator",
    description: "יצירת QR בפאנל הניהול — לא placeholder בעמוד",
  },
  store: {
    pluginKey: "store",
    kind: "page",
    pageTemplateId: "page-products-01",
    label: "עמוד מוצרים / חנות",
    description: "מתסנכרן אוטומטית עם מוצרי החנות",
  },
  "client-portal": {
    pluginKey: "client-portal",
    kind: "page",
    pageTemplateId: "page-portal-01",
    pageTemplateIds: [...CLIENT_PORTAL_PAGE_TEMPLATE_IDS],
    label: "אזור אישי",
    description: "מוסיף עמודי התחברות, הרשמה וחשבון ללקוחות האתר",
  },
  "testimonials-carousel": {
    pluginKey: "testimonials-carousel",
    kind: "section",
    sectionId: "section-testimonials-showcase-quote-cards",
    label: "קרוסלת המלצות",
  },
  "pricing-table": {
    pluginKey: "pricing-table",
    kind: "section",
    sectionId: "section-pricing",
    label: "טבלת מחירים",
  },
  timeline: {
    pluginKey: "timeline",
    kind: "section",
    sectionId: "section-stats-showcase-timeline",
    label: "ציר זמן",
  },
  tabs: {
    pluginKey: "tabs",
    kind: "section",
    sectionId: "section-services-cards",
    label: "טאבים / שירותים",
  },
  "logo-carousel": {
    pluginKey: "logo-carousel",
    kind: "section",
    sectionId: "section-reviews-logos",
    label: "קרוסלת לוגואים",
  },
  "events-calendar": {
    pluginKey: "events-calendar",
    kind: "page",
    pageTemplateId: "page-events-01",
    label: "עמוד אירועים",
  },
  "whatsapp-catalog": {
    pluginKey: "whatsapp-catalog",
    kind: "page",
    pageTemplateId: "page-products-01",
    label: "קטלוג מוצרים",
    description: "הזמנה ב-WhatsApp",
  },
  "digital-menu": {
    pluginKey: "digital-menu",
    kind: "page",
    pageTemplateId: "page-products-01",
    label: "תפריט דיגיטלי",
  },
  "multi-step-form": {
    pluginKey: "multi-step-form",
    kind: "section",
    sectionId: "section-contact-split",
    label: "טופס רב-שלבי",
  },
  "customer-counter": {
    pluginKey: "customer-counter",
    kind: "section",
    sectionId: "section-stats-showcase-four-card-grid",
    label: "מונה לקוחות",
  },
  "google-maps": {
    pluginKey: "google-maps",
    kind: "section",
    sectionId: "section-contact-split",
    label: "מפה + יצירת קשר",
  },
  countdown: {
    pluginKey: "countdown",
    kind: "widget",
    label: "ספירה לאחור",
    description: "טיימר חי — מוסיפים לעמוד דרך תוספים",
  },
};

export function getPluginEditorAction(pluginKey: string): PluginEditorAction | null {
  if (PLUGIN_EDITOR_ACTIONS[pluginKey]) return PLUGIN_EDITOR_ACTIONS[pluginKey];
  // Never invent a generic dashed placeholder for unknown catalog keys.
  // Config / site-wide addons open settings instead of inserting fake HTML.
  return {
    pluginKey,
    kind: "settings",
    label: "הגדרות תוסף",
    description: "ניהול בפאנל — לא רכיב שנגרר לעמוד",
  };
}

export function buildPluginWidgetMarker(pluginKey: string, label: string) {
  if (pluginKey === "countdown") {
    return buildCountdownWidgetMarker(label);
  }

  // Only countdown is a real in-page widget. Any other call is a programming error —
  // callers should use overlay/settings actions instead of inserting HTML stubs.
  throw new Error(
    `No in-page widget marker for plugin "${pluginKey}" (${label}). Use overlay/settings action.`
  );
}
