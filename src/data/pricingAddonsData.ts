/** BizUply managed service packages — setup, marketing, agents, monthly support */

export type PricingAddonTrack = {
  label: string;
  labelEn: string;
  price: string;
  priceEn: string;
};

export type PricingAddonCategory =
  | "setup"
  | "growth"
  | "agents"
  | "support";

export type PricingAddon = {
  key: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  category: PricingAddonCategory;
  icon: string;
  priceLabel: string;
  priceLabelEn: string;
  accent: string;
  featured?: boolean;
  /** Hidden from the public pricing page until the service is active */
  hidden?: boolean;
  details: string[];
  detailsEn: string[];
  tracks?: PricingAddonTrack[];
  extras?: PricingAddonTrack[];
  examples?: string[];
  examplesEn?: string[];
  note?: string;
  noteEn?: string;
};

export const PRICING_CATEGORY_LABELS: Record<
  string,
  { he: string; en: string }
> = {
  all: { he: "הכול", en: "All" },
  setup: { he: "הקמה והטמעה", en: "Setup & implementation" },
  growth: { he: "שיווק וצמיחה", en: "Marketing & growth" },
  agents: { he: "נציגים ושירות אנושי", en: "Agents & human service" },
  support: { he: "תמיכה חודשית", en: "Monthly support" },
};

/** Public category chips/sections — growth/support kept in data but not shown yet */
export const PRICING_CATEGORY_ORDER = [
  "setup",
  "agents",
] as const;

export const PRICING_CATEGORY_ACCENTS: Record<string, string> = {
  setup: "#7C3AED",
  growth: "#E11D8C",
  agents: "#059669",
  support: "#2563EB",
};

export const PRICING_ADDONS: PricingAddon[] = [
  /* ── הקמה והטמעה ── */
  {
    key: "automations-setup",
    name: "הקמת אוטומציות לעסק",
    nameEn: "Business automations setup",
    description:
      "אנחנו מקימים עבורכם תהליכים אוטומטיים שפועלים לבד וממשיכים לטפל בלידים ובלקוחות גם כשאתם לא במערכת.",
    descriptionEn:
      "We build automatic workflows that keep nurturing leads and clients even when you're offline.",
    category: "setup",
    icon: "sparkles",
    priceLabel: "החל מ־$99 חד־פעמי",
    priceLabelEn: "From $99 one-time",
    accent: "#8B5CF6",
    featured: true,
    details: [
      "אוטומציה אחת פשוטה: $99",
      "חבילת 3 אוטומציות: $249",
      "חבילת 6 אוטומציות: $399",
      "תהליך מורכב: הצעה מותאמת",
    ],
    detailsEn: [
      "One simple automation: $99",
      "3-automation pack: $249",
      "6-automation pack: $399",
      "Complex process: custom quote",
    ],
    tracks: [
      {
        label: "אוטומציה אחת פשוטה",
        labelEn: "One simple automation",
        price: "$99",
        priceEn: "$99",
      },
      {
        label: "חבילת 3 אוטומציות",
        labelEn: "3-automation pack",
        price: "$249",
        priceEn: "$249",
      },
      {
        label: "חבילת 6 אוטומציות",
        labelEn: "6-automation pack",
        price: "$399",
        priceEn: "$399",
      },
      {
        label: "תהליך מורכב",
        labelEn: "Complex process",
        price: "הצעה מותאמת",
        priceEn: "Custom quote",
      },
    ],
    examples: [
      "ליד חדש נכנס למערכת",
      "שליחת הודעת WhatsApp אוטומטית",
      "שליחת מייל אוטומטי",
      "פתיחת משימה לנציג",
      "תזכורת אם לא בוצע טיפול",
      "פולואפ אוטומטי לאחר מספר ימים",
      "שינוי סטטוס לפי פעולה",
      "תזכורת לפגישה",
      "הודעה לאחר רכישה",
      "בקשת ביקורת אוטומטית",
    ],
    examplesEn: [
      "New lead enters the system",
      "Automatic WhatsApp message",
      "Automatic email",
      "Open a task for an agent",
      "Reminder if no action was taken",
      "Automatic follow-up after a few days",
      "Status change based on an action",
      "Meeting reminder",
      "Post-purchase message",
      "Automatic review request",
    ],
    note: "עלויות הודעות WhatsApp, SMS, מייל ושירותי צד שלישי אינן כלולות.",
    noteEn:
      "WhatsApp, SMS, email, and third-party messaging costs are not included.",
  },
  {
    key: "website-build",
    name: "בניית אתר על ידי מומחה",
    nameEn: "Expert website build",
    description:
      "מומחה Bizuply בונה ומעלה עבורכם אתר מקצועי מתוך התבניות והכלים של המערכת.",
    descriptionEn:
      "A Bizuply expert builds and launches a professional site from the platform templates and tools.",
    category: "setup",
    icon: "globe",
    priceLabel: "$399 חד־פעמי",
    priceLabelEn: "$399 one-time",
    accent: "#6366F1",
    details: [
      "אתר עד 5 עמודים",
      "בחירת תבנית קיימת",
      "הזנת תוכן ותמונות שהלקוח מספק",
      "התאמה למובייל",
      "טופס לידים",
      "חיבור ל-CRM",
      "חיבור דומיין",
      "עד 2 סבבי תיקונים",
    ],
    detailsEn: [
      "Site of up to 5 pages",
      "Existing template selection",
      "Content and images provided by the client",
      "Mobile adaptation",
      "Lead form",
      "CRM connection",
      "Domain connection",
      "Up to 2 revision rounds",
    ],
    extras: [
      {
        label: "עמוד נוסף",
        labelEn: "Extra page",
        price: "$49",
        priceEn: "$49",
      },
      {
        label: "כתיבת תוכן",
        labelEn: "Content writing",
        price: "$149",
        priceEn: "$149",
      },
      {
        label: "חנות בסיסית",
        labelEn: "Basic store",
        price: "תוספת $399",
        priceEn: "+ $399",
      },
      {
        label: "עיצוב אישי מתקדם",
        labelEn: "Advanced custom design",
        price: "תוספת $799",
        priceEn: "+ $799",
      },
    ],
  },
  {
    key: "crm-migration",
    name: "מעבר ממערכת CRM אחרת",
    nameEn: "Migration from another CRM",
    description:
      "שירות חשוב במיוחד ללקוחות שרוצים לעבור אליכם — מעבירים לקוחות, לידים וסטטוסים ומגדירים את השדות כך שהעסק ימשיך לעבוד בלי בלאגן.",
    descriptionEn:
      "Especially valuable for customers switching to you — we migrate clients, leads, and statuses, and map fields so the business keeps running smoothly.",
    category: "setup",
    icon: "migrate",
    priceLabel: "$249 חד־פעמי",
    priceLabelEn: "$249 one-time",
    accent: "#7C3AED",
    featured: true,
    details: [
      "העברת לקוחות ולידים",
      "העברת סטטוסים",
      "התאמת שדות",
      "בדיקת תקינות",
      "הדרכה לאחר המעבר",
    ],
    detailsEn: [
      "Transfer clients and leads",
      "Transfer statuses",
      "Field mapping",
      "Validation check",
      "Training after migration",
    ],
    tracks: [
      {
        label: "מעבר בסיסי",
        labelEn: "Basic migration",
        price: "$249",
        priceEn: "$249",
      },
    ],
    note: "מעבר בהיקף גדול או ממערכת מורכבת מתומחר בהצעה נפרדת.",
    noteEn:
      "Large-volume or complex migrations are quoted separately.",
  },
  {
    key: "store-products-upload",
    name: "העלאת מוצרים לחנות",
    nameEn: "Store product upload",
    description:
      "ללקוחות שבונים דרככם חנות — אנחנו מעלים את המוצרים עם תמונות, תיאורים, קטגוריות, מחירים, וריאציות והגדרות משלוח.",
    descriptionEn:
      "For customers building a store with you — we upload products with images, descriptions, categories, prices, variations, and shipping settings.",
    category: "setup",
    icon: "package",
    priceLabel: "החל מ־$149 חד־פעמי",
    priceLabelEn: "From $149 one-time",
    accent: "#9333EA",
    details: [
      "העלאת מוצרים",
      "תמונות ותיאורים",
      "קטגוריות",
      "מחירים ווריאציות",
      "הגדרות משלוח",
    ],
    detailsEn: [
      "Product upload",
      "Images and descriptions",
      "Categories",
      "Prices and variations",
      "Shipping settings",
    ],
    tracks: [
      {
        label: "עד 20 מוצרים",
        labelEn: "Up to 20 products",
        price: "$149",
        priceEn: "$149",
      },
      {
        label: "עד 50 מוצרים",
        labelEn: "Up to 50 products",
        price: "$249",
        priceEn: "$249",
      },
      {
        label: "מעבר לכך",
        labelEn: "Beyond that",
        price: "הצעה מותאמת",
        priceEn: "Custom quote",
      },
    ],
  },

  /* ── שיווק וצמיחה (מוסתר זמנית — עדיין לא פעיל) ── */
  {
    key: "paid-campaign-setup",
    name: "הקמת קמפיין ממומן",
    nameEn: "Paid campaign setup",
    description:
      "מומחה מקים עבורכם קמפיין מקצועי במטא ומחבר את הלידים ישירות ל-Bizuply.",
    descriptionEn:
      "An expert launches a professional Meta campaign and connects leads straight into Bizuply.",
    category: "growth",
    icon: "megaphone",
    priceLabel: "הצעה מותאמת",
    priceLabelEn: "Custom quote",
    accent: "#E11D8C",
    hidden: true,
    details: [
      "הקמת קמפיין במטא",
      "הגדרת קהל יעד",
      "הקמת קבוצת מודעות",
      "עד 3 מודעות",
      "הגדרת טופס לידים או דף נחיתה קיים",
      "חיבור הלידים ל-Bizuply",
      "התקנת מעקב בסיסית",
      "בדיקת תקינות לפני עלייה",
    ],
    detailsEn: [
      "Meta campaign setup",
      "Audience definition",
      "Ad-set creation",
      "Up to 3 ads",
      "Lead form or existing landing page setup",
      "Leads connected to Bizuply",
      "Basic tracking install",
      "QA before launch",
    ],
    tracks: [
      {
        label: "הקמת קמפיין במטא",
        labelEn: "Meta campaign setup",
        price: "הצעה מותאמת",
        priceEn: "Custom quote",
      },
      {
        label: "הקמת קמפיין מתקדם במטא",
        labelEn: "Advanced Meta campaign setup",
        price: "הצעה מותאמת",
        priceEn: "Custom quote",
      },
    ],
    note: "המחיר כולל הקמה בלבד ואינו כולל ניהול שוטף או תקציב פרסום. כרגע השירות זמין למטא בלבד.",
    noteEn:
      "Price covers setup only — ongoing management and ad budget are not included. Currently available for Meta only.",
  },
  {
    key: "content-creation",
    name: "יצירת תוכן",
    nameEn: "Content creation",
    description:
      "צוות Bizuply יוצר עבור העסק תוכן מעוצב ומוכן לפרסום בפייסבוק ובאינסטגרם.",
    descriptionEn:
      "The Bizuply team creates designed, publish-ready content for Facebook and Instagram.",
    category: "growth",
    icon: "image",
    priceLabel: "הצעה מותאמת",
    priceLabelEn: "Custom quote",
    accent: "#DB2777",
    hidden: true,
    details: [
      "8 פוסטים בחודש",
      "כתיבה ועיצוב",
      "התאמה לפייסבוק ולאינסטגרם",
      "לוח תוכן חודשי",
      "דוח בסיסי",
    ],
    detailsEn: [
      "8 posts per month",
      "Copywriting and design",
      "Facebook and Instagram adaptation",
      "Monthly content plan",
      "Basic report",
    ],
    tracks: [
      {
        label: "8 פוסטים",
        labelEn: "8 posts",
        price: "הצעה מותאמת",
        priceEn: "Custom quote",
      },
      {
        label: "12 פוסטים",
        labelEn: "12 posts",
        price: "הצעה מותאמת",
        priceEn: "Custom quote",
      },
      {
        label: "8 פוסטים ו־4 סרטונים מחומרי הלקוח",
        labelEn: "8 posts + 4 videos from client materials",
        price: "הצעה מותאמת",
        priceEn: "Custom quote",
      },
    ],
    note: "צילום מקצועי ותזמון פרסומים אינם כלולים כרגע.",
    noteEn: "Professional photography and publishing scheduling are not included at this time.",
  },
  /* ── נציגים ושירות אנושי ── */
  {
    key: "collab-manager",
    name: "מנהל שיתופי פעולה אישי",
    nameEn: "Personal collaborations manager",
    description:
      "מנהל שמאתר עסקים רלוונטיים, יוצר חיבורים ומלווה את התקשורת בין הצדדים.",
    descriptionEn:
      "A manager who finds relevant businesses, makes introductions, and guides communication between both sides.",
    category: "agents",
    icon: "handshake",
    priceLabel: "$299 לחודש",
    priceLabelEn: "$299 / month",
    accent: "#0D9488",
    details: [
      "איתור עד 10 עסקים מתאימים",
      "פנייה ראשונית",
      "הצעת רעיון לשיתוף פעולה",
      "יצירת החיבור בין הצדדים",
      "מעקב אחר התקדמות",
      "דוח חודשי",
    ],
    detailsEn: [
      "Find up to 10 matching businesses",
      "Initial outreach",
      "Collaboration idea proposal",
      "Connect both sides",
      "Progress follow-up",
      "Monthly report",
    ],
    tracks: [
      {
        label: "עד 10 עסקים",
        labelEn: "Up to 10 businesses",
        price: "$299 לחודש",
        priceEn: "$299 / month",
      },
      {
        label: "מסלול מורחב עד 25 פניות",
        labelEn: "Extended track up to 25 outreaches",
        price: "הצעה מותאמת",
        priceEn: "Custom quote",
      },
    ],
    note: "השירות אינו מתחייב לסגירת מספר מסוים של שיתופי פעולה.",
    noteEn:
      "The service does not guarantee a specific number of closed collaborations.",
  },
  {
    key: "lead-first-response",
    name: "מענה ראשוני ללידים",
    nameEn: "Initial lead response",
    description:
      "נציג אנושי חוזר ללידים חדשים, מבצע בירור ראשוני, מסנן את הפנייה ומעדכן את כל הפרטים ב-CRM.",
    descriptionEn:
      "A human agent calls new leads back, runs an initial discovery, filters the inquiry, and updates every detail in the CRM.",
    category: "agents",
    icon: "headset",
    priceLabel: "$199 לחודש",
    priceLabelEn: "$199 / month",
    accent: "#059669",
    featured: true,
    details: [
      "עד 40 לידים בחודש",
      "עד 3 ניסיונות התקשרות לכל ליד",
      "שאלון ראשוני מותאם לעסק",
      "סינון לידים",
      "עדכון סטטוס וסיכום שיחה",
      "דוח פעילות חודשי",
    ],
    detailsEn: [
      "Up to 40 leads per month",
      "Up to 3 call attempts per lead",
      "Business-tailored discovery questionnaire",
      "Lead filtering",
      "Status update and call summary",
      "Monthly activity report",
    ],
  },
  {
    key: "personal-sales-rep",
    name: "נציג מכירות אישי",
    nameEn: "Personal sales representative",
    description:
      "נציג שמבצע שיחות מכירה, שולח הצעות, מטפל בהתנגדויות ועוקב אחר הלקוחות עד לקבלת החלטה.",
    descriptionEn:
      "A rep who runs sales calls, sends proposals, handles objections, and follows clients through to a decision.",
    category: "agents",
    icon: "user-tie",
    priceLabel: "$499 לחודש",
    priceLabelEn: "$499 / month",
    accent: "#047857",
    details: [
      "עד 40 לידים חמים בחודש",
      "שיחות מכירה",
      "פולואפים",
      "שליחת הצעות מחיר מוכנות",
      "עדכון תוצאות ב-CRM",
      "דוח מכירות חודשי",
    ],
    detailsEn: [
      "Up to 40 hot leads per month",
      "Sales calls",
      "Follow-ups",
      "Sending ready-made proposals",
      "Results updated in CRM",
      "Monthly sales report",
    ],
  },
  {
    key: "old-leads-followup",
    name: "פולואפים ללידים ישנים",
    nameEn: "Old leads follow-up",
    description:
      "חזרה ללידים שלא נסגרו — ב-CRM מוגדר מה נחשב ליד ישן, והם עוברים אוטומטית לטאב ייעודי לפולואפ ובדיקת רלוונטיות.",
    descriptionEn:
      "Re-engage unclosed leads — define what counts as an old lead in the CRM, and they move automatically into a dedicated follow-up tab to verify relevance.",
    category: "agents",
    icon: "refresh",
    priceLabel: "החל מ־$149 חד־פעמי",
    priceLabelEn: "From $149 one-time",
    accent: "#10B981",
    details: [
      "הגדרת ליד ישן לפי ימים ללא פעילות",
      "העברה אוטומטית לטאב לידים ישנים ב-CRM",
      "טיפול בעד 50 לידים",
      "עד 2 ניסיונות התקשרות",
      "בדיקת רלוונטיות והחזרה לתהליך המכירה",
    ],
    detailsEn: [
      "Define old leads by days without activity",
      "Automatic move to the CRM Old Leads tab",
      "Handle up to 50 leads",
      "Up to 2 call attempts",
      "Relevance check and return to the sales process",
    ],
    tracks: [
      {
        label: "חבילת 50 לידים",
        labelEn: "50-lead pack",
        price: "$149",
        priceEn: "$149",
      },
      {
        label: "עד 100 לידים",
        labelEn: "Up to 100 leads",
        price: "$249",
        priceEn: "$249",
      },
    ],
  },

  /* ── תמיכה חודשית (מוסתר זמנית — עדיין לא פעיל) ── */
  {
    key: "crm-manager",
    name: "מנהל CRM אישי",
    nameEn: "Personal CRM manager",
    description:
      "מנהל שעובר על הלידים, מסדר סטטוסים, פותח משימות ודואג שאף לקוח לא יישכח.",
    descriptionEn:
      "A manager who reviews leads, organizes statuses, opens tasks, and makes sure no client is forgotten.",
    category: "support",
    icon: "clipboard",
    priceLabel: "הצעה מותאמת",
    priceLabelEn: "Custom quote",
    accent: "#3B82F6",
    hidden: true,
    details: [
      "בדיקת המערכת פעמיים בשבוע",
      "סידור סטטוסים",
      "איתור לידים ללא טיפול",
      "פתיחת משימות ותזכורות",
      "ניקוי כפילויות בסיסי",
      "דוח חודשי",
    ],
    detailsEn: [
      "System review twice a week",
      "Status cleanup",
      "Find untreated leads",
      "Open tasks and reminders",
      "Basic duplicate cleanup",
      "Monthly report",
    ],
    tracks: [
      {
        label: "בדיקה פעמיים בשבוע",
        labelEn: "Twice-weekly review",
        price: "הצעה מותאמת",
        priceEn: "Custom quote",
      },
      {
        label: "מסלול בדיקה יומית",
        labelEn: "Daily review track",
        price: "הצעה מותאמת",
        priceEn: "Custom quote",
      },
    ],
  },
  {
    key: "external-support",
    name: "שירות לקוחות חיצוני",
    nameEn: "External customer support",
    description:
      "נציג מטפל בפניות של לקוחות קיימים דרך טלפון, WhatsApp או מערכת הפניות.",
    descriptionEn:
      "An agent handles existing-customer inquiries by phone, WhatsApp, or your ticket system.",
    category: "support",
    icon: "message",
    priceLabel: "הצעה מותאמת",
    priceLabelEn: "Custom quote",
    accent: "#2563EB",
    hidden: true,
    details: [
      "עד 10 שעות טיפול בחודש",
      "מענה לפי נהלי העסק",
      "עדכון הפניות במערכת",
      "העברת מקרים מורכבים לבעל העסק",
      "דוח שירות חודשי",
    ],
    detailsEn: [
      "Up to 10 support hours per month",
      "Responses according to business procedures",
      "Tickets updated in the system",
      "Complex cases escalated to the owner",
      "Monthly service report",
    ],
  },
];

/* ============================================================================
 * Managed-service purchase mapping.
 *
 * Maps the marketing catalog (kebab-case `key`) to the server's canonical
 * Stripe Live SKUs (PricingCatalog). The client NEVER sends amount / currency /
 * priceId — it sends only serviceKey + selectedAddOnKeys + quantities and the
 * server (POST /api/service-orders/create-checkout) resolves the real Stripe
 * Price. `amount` (USD) below is display-only for the pre-checkout summary.
 *
 *  - `trackOptions` align by index with the addon's `tracks[]`.
 *  - `addOnOptions` align by index with the addon's `extras[]`.
 *  - `contact: true` => custom scope, no Stripe SKU => routes to /contact.
 * ==========================================================================*/

export type ServicePurchaseTrack = {
  /** Server-side managed_service SKU. Omitted for contact-only options. */
  serviceKey?: string;
  /** Display-only amount for the pre-checkout summary (server is source of truth). */
  amount?: number;
  billing?: "one_time" | "recurring_month";
  /** Custom scope with no fixed Stripe price — routes to the contact form. */
  contact?: boolean;
};

export type ServicePurchaseAddOn = {
  /** Server-side managed_service_addon SKU (only for expert_website_build). */
  addOnKey: string;
  amount: number;
  allowQuantity?: boolean;
};

export type ServicePurchaseConfig = {
  /** Base service SKU for single-option services (no track picker). */
  serviceKey?: string;
  amount?: number;
  billing?: "one_time" | "recurring_month";
  /** Track choices (e.g. automations 1 / 3 / 6), aligned with `tracks[]`. */
  trackOptions?: ServicePurchaseTrack[];
  /** Optional add-ons for the expert website build, aligned with `extras[]`. */
  addOnOptions?: ServicePurchaseAddOn[];
};

export const PRICING_SERVICE_PURCHASE: Record<string, ServicePurchaseConfig> = {
  "automations-setup": {
    trackOptions: [
      { serviceKey: "automations_setup_1_390_ils", amount: 99, billing: "one_time" },
      { serviceKey: "automations_setup_3_890_ils", amount: 249, billing: "one_time" },
      { serviceKey: "automations_setup_6_1490_ils", amount: 399, billing: "one_time" },
      { contact: true },
    ],
  },
  "website-build": {
    serviceKey: "expert_website_build_1490_ils",
    amount: 399,
    billing: "one_time",
    addOnOptions: [
      { addOnKey: "expert_website_extra_page_190_ils", amount: 49, allowQuantity: true },
      { addOnKey: "expert_website_content_writing_590_ils", amount: 149 },
      { addOnKey: "expert_website_basic_store_1490_ils", amount: 399 },
      { addOnKey: "expert_website_advanced_design_2990_ils", amount: 799 },
    ],
  },
  "crm-migration": {
    trackOptions: [
      { serviceKey: "crm_migration_790_ils", amount: 249, billing: "one_time" },
    ],
  },
  "store-products-upload": {
    trackOptions: [
      { serviceKey: "store_products_upload_490_ils", amount: 149, billing: "one_time" },
      {
        serviceKey: "store_products_upload_50_990_ils",
        amount: 249,
        billing: "one_time",
      },
      { contact: true },
    ],
  },
  "collab-manager": {
    trackOptions: [
      {
        serviceKey: "collaboration_manager_790_ils_monthly",
        amount: 299,
        billing: "recurring_month",
      },
      { contact: true },
    ],
  },
  "lead-first-response": {
    serviceKey: "lead_response_690_ils_monthly",
    amount: 199,
    billing: "recurring_month",
  },
  "personal-sales-rep": {
    serviceKey: "personal_sales_rep_1490_ils_monthly",
    amount: 499,
    billing: "recurring_month",
  },
  "old-leads-followup": {
    trackOptions: [
      { serviceKey: "old_leads_followup_590_ils", amount: 149, billing: "one_time" },
      {
        serviceKey: "old_leads_followup_100_990_ils",
        amount: 249,
        billing: "one_time",
      },
    ],
  },
};
