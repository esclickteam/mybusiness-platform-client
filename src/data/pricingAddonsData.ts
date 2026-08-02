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

/** Public category chips/sections — growth is kept in data but not shown yet */
export const PRICING_CATEGORY_ORDER = [
  "setup",
  "agents",
  "support",
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
    priceLabel: "החל מ־390 ₪ חד־פעמי",
    priceLabelEn: "From ₪390 one-time",
    accent: "#8B5CF6",
    featured: true,
    details: [
      "אוטומציה אחת פשוטה: 390 ₪",
      "חבילת 3 אוטומציות: 890 ₪",
      "חבילת 6 אוטומציות: 1,490 ₪",
      "תהליך מורכב: הצעה מותאמת",
    ],
    detailsEn: [
      "One simple automation: ₪390",
      "3-automation pack: ₪890",
      "6-automation pack: ₪1,490",
      "Complex process: custom quote",
    ],
    tracks: [
      {
        label: "אוטומציה אחת פשוטה",
        labelEn: "One simple automation",
        price: "390 ₪",
        priceEn: "₪390",
      },
      {
        label: "חבילת 3 אוטומציות",
        labelEn: "3-automation pack",
        price: "890 ₪",
        priceEn: "₪890",
      },
      {
        label: "חבילת 6 אוטומציות",
        labelEn: "6-automation pack",
        price: "1,490 ₪",
        priceEn: "₪1,490",
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
    priceLabel: "החל מ־1,490 ₪ חד־פעמי",
    priceLabelEn: "From ₪1,490 one-time",
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
        price: "190 ₪",
        priceEn: "₪190",
      },
      {
        label: "כתיבת תוכן",
        labelEn: "Content writing",
        price: "590 ₪",
        priceEn: "₪590",
      },
      {
        label: "חנות בסיסית",
        labelEn: "Basic store",
        price: "תוספת 1,490 ₪",
        priceEn: "+ ₪1,490",
      },
      {
        label: "עיצוב אישי מתקדם",
        labelEn: "Advanced custom design",
        price: "החל מ־2,990 ₪",
        priceEn: "From ₪2,990",
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
    priceLabel: "החל מ־790 ₪ חד־פעמי",
    priceLabelEn: "From ₪790 one-time",
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
        price: "החל מ־790 ₪",
        priceEn: "From ₪790",
      },
    ],
    note: "היקף המעבר ותמחור סופי נקבעים לפי כמות הרשומות ומורכבות המערכת הקיימת.",
    noteEn:
      "Scope and final pricing depend on record volume and the complexity of the existing system.",
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
    priceLabel: "החל מ־490 ₪ חד־פעמי",
    priceLabelEn: "From ₪490 one-time",
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
        price: "490 ₪",
        priceEn: "₪490",
      },
      {
        label: "עד 50 מוצרים",
        labelEn: "Up to 50 products",
        price: "990 ₪",
        priceEn: "₪990",
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
    priceLabel: "החל מ־690 ₪ חד־פעמי",
    priceLabelEn: "From ₪690 one-time",
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
        price: "690 ₪",
        priceEn: "₪690",
      },
      {
        label: "הקמת קמפיין מתקדם במטא",
        labelEn: "Advanced Meta campaign setup",
        price: "990 ₪",
        priceEn: "₪990",
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
    priceLabel: "החל מ־990 ₪ לחודש",
    priceLabelEn: "From ₪990 / month",
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
        price: "990 ₪ לחודש",
        priceEn: "₪990 / month",
      },
      {
        label: "12 פוסטים",
        labelEn: "12 posts",
        price: "1,390 ₪ לחודש",
        priceEn: "₪1,390 / month",
      },
      {
        label: "8 פוסטים ו־4 סרטונים מחומרי הלקוח",
        labelEn: "8 posts + 4 videos from client materials",
        price: "1,790 ₪ לחודש",
        priceEn: "₪1,790 / month",
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
    priceLabel: "החל מ־790 ₪ לחודש",
    priceLabelEn: "From ₪790 / month",
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
        price: "החל מ־790 ₪ לחודש",
        priceEn: "From ₪790 / month",
      },
      {
        label: "מסלול מורחב עד 25 פניות",
        labelEn: "Extended track up to 25 outreaches",
        price: "1,290 ₪ לחודש",
        priceEn: "₪1,290 / month",
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
    priceLabel: "החל מ־690 ₪ לחודש",
    priceLabelEn: "From ₪690 / month",
    accent: "#059669",
    featured: true,
    details: [
      "עד 40 לידים בחודש",
      "עד 3 ניסיונות התקשרות לכל ליד",
      "שאלון ראשוני מותאם לעסק",
      "סינון לידים",
      "עדכון סטטוס וסיכום שיחה",
      "דוח פעילות חודשי",
      "ליד נוסף: 15 ₪",
    ],
    detailsEn: [
      "Up to 40 leads per month",
      "Up to 3 call attempts per lead",
      "Business-tailored discovery questionnaire",
      "Lead filtering",
      "Status update and call summary",
      "Monthly activity report",
      "Extra lead: ₪15",
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
    priceLabel: "1,490 ₪ לחודש + 5% הצלחה",
    priceLabelEn: "₪1,490 / month + 5% success fee",
    accent: "#047857",
    details: [
      "עד 40 לידים חמים בחודש",
      "שיחות מכירה",
      "פולואפים",
      "שליחת הצעות מחיר מוכנות",
      "עדכון תוצאות ב-CRM",
      "דוח מכירות חודשי",
      "ליד נוסף: 25 ₪",
    ],
    detailsEn: [
      "Up to 40 hot leads per month",
      "Sales calls",
      "Follow-ups",
      "Sending ready-made proposals",
      "Results updated in CRM",
      "Monthly sales report",
      "Extra lead: ₪25",
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
    priceLabel: "590 ₪ חד־פעמי",
    priceLabelEn: "₪590 one-time",
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
        price: "590 ₪",
        priceEn: "₪590",
      },
      {
        label: "חבילת 100 לידים",
        labelEn: "100-lead pack",
        price: "990 ₪",
        priceEn: "₪990",
      },
    ],
  },

  /* ── תמיכה חודשית ── */
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
    priceLabel: "החל מ־490 ₪ לחודש",
    priceLabelEn: "From ₪490 / month",
    accent: "#3B82F6",
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
        price: "החל מ־490 ₪ לחודש",
        priceEn: "From ₪490 / month",
      },
      {
        label: "מסלול בדיקה יומית",
        labelEn: "Daily review track",
        price: "890 ₪ לחודש",
        priceEn: "₪890 / month",
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
    priceLabel: "החל מ־1,290 ₪ לחודש",
    priceLabelEn: "From ₪1,290 / month",
    accent: "#2563EB",
    details: [
      "עד 10 שעות טיפול בחודש",
      "מענה לפי נהלי העסק",
      "עדכון הפניות במערכת",
      "העברת מקרים מורכבים לבעל העסק",
      "דוח שירות חודשי",
      "שעה נוספת: 75 ₪",
    ],
    detailsEn: [
      "Up to 10 support hours per month",
      "Responses according to business procedures",
      "Tickets updated in the system",
      "Complex cases escalated to the owner",
      "Monthly service report",
      "Extra hour: ₪75",
    ],
  },
];
