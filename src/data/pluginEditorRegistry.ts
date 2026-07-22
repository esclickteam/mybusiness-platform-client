/**
 * Maps installed plugins to editor actions — sections, pages, or widget placeholders.
 */
export type PluginEditorAction = {
  pluginKey: string;
  kind: "section" | "page" | "widget";
  sectionId?: string;
  pageTemplateId?: string;
  label: string;
  description?: string;
};

export const PLUGIN_EDITOR_ACTIONS: Record<string, PluginEditorAction> = {
  store: {
    pluginKey: "store",
    kind: "page",
    pageTemplateId: "page-products-01",
    label: "עמוד מוצרים / חנות",
    description: "מתסנכרן אוטומטית עם מוצרי החנות",
  },
  booking: {
    pluginKey: "booking",
    kind: "section",
    sectionId: "section-services-booking-style",
    label: "רכיב קביעת תור",
  },
  leads: {
    pluginKey: "leads",
    kind: "widget",
    label: "טופס לידים",
  },
  reviews: {
    pluginKey: "reviews",
    kind: "section",
    sectionId: "section-testimonials",
    label: "ביקורות והמלצות",
  },
  "testimonials-carousel": {
    pluginKey: "testimonials-carousel",
    kind: "section",
    sectionId: "section-testimonials",
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
  "masonry-gallery": {
    pluginKey: "masonry-gallery",
    kind: "section",
    sectionId: "section-portfolio-showcase-dark-masonry",
    label: "גלריית Masonry",
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
};

export function getPluginEditorAction(pluginKey: string): PluginEditorAction | null {
  if (PLUGIN_EDITOR_ACTIONS[pluginKey]) return PLUGIN_EDITOR_ACTIONS[pluginKey];
  return {
    pluginKey,
    kind: "widget",
    label: "רכיב תוסף",
    description: "יוצג באתר לפי ההגדרות בפאנל",
  };
}

export function buildPluginWidgetMarker(pluginKey: string, label: string) {
  return `<div data-bizuply-plugin="${pluginKey}" data-bizuply-widget="${pluginKey}" style="padding:48px 24px;text-align:center;border:2px dashed #c4b5fd;border-radius:12px;background:linear-gradient(135deg,#f5f3ff,#eff6ff);font-family:system-ui,sans-serif;direction:rtl"><div style="font-size:13px;font-weight:700;color:#6d28d9;margin-bottom:6px">תוסף Bizuply</div><div style="font-size:18px;font-weight:800;color:#1e293b">${label}</div><div style="font-size:12px;color:#64748b;margin-top:8px">יופיע באתר החי לפי ההגדרות בפאנל</div></div>`;
}
