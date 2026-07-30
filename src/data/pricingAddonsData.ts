/** BizUply additional business services (upsells) — not website-builder plugins */

export type PricingAddon = {
  key: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  category: "human" | "ai" | "growth" | "infra";
  icon: string;
  priceMonthly: number | null;
  priceLabel: string;
  priceLabelEn: string;
  accent: string;
  featured?: boolean;
};

export const PRICING_CATEGORY_LABELS: Record<
  string,
  { he: string; en: string }
> = {
  all: { he: "הכול", en: "All" },
  human: { he: "שירותים אנושיים", en: "Human services" },
  ai: { he: "AI", en: "AI" },
  growth: { he: "צמיחה ושיווק", en: "Growth & marketing" },
  infra: { he: "תשתית", en: "Infrastructure" },
};

export const PRICING_CATEGORY_ORDER = [
  "human",
  "ai",
  "growth",
  "infra",
] as const;

export const PRICING_ADDONS: PricingAddon[] = [
  {
    key: "human-leads",
    name: "מענה וכימות לידים",
    nameEn: "Lead response & qualification",
    description:
      "נציג אנושי עונה לפניות, מברר צורך ומעדכן סטטוס ב־CRM — כדי שתטפלו רק במה שבאמת בשל.",
    descriptionEn:
      "A human agent answers inquiries, qualifies need, and updates CRM status — so you only handle what's ready.",
    category: "human",
    icon: "headset",
    priceMonthly: null,
    priceLabel: "לפי הצעה",
    priceLabelEn: "Custom quote",
    accent: "#059669",
    featured: true,
  },
  {
    key: "human-appointments",
    name: "תיאום וסגירת המשך",
    nameEn: "Appointment scheduling",
    description:
      "קובעים פגישות, שולחים תזכורות וממלאים פרטים — פחות נשירה בין \"מעניין\" ל\"נקבעה פגישה\".",
    descriptionEn:
      "Book meetings, send reminders, and fill details — less drop-off between interest and a booked meeting.",
    category: "human",
    icon: "calendar-check",
    priceMonthly: null,
    priceLabel: "לפי הצעה",
    priceLabelEn: "Custom quote",
    accent: "#2563EB",
    featured: true,
  },
  {
    key: "human-collab",
    name: "מנהל שיתופים אנושי",
    nameEn: "Human collaboration manager",
    description:
      "איתור שותפים, יצירת קשר, מעקב אחרי הצעות ודוח חודשי על התקדמות השיתופים.",
    descriptionEn:
      "Find partners, reach out, follow up on proposals, and get a monthly progress report.",
    category: "human",
    icon: "handshake",
    priceMonthly: null,
    priceLabel: "לפי הצעה",
    priceLabelEn: "Custom quote",
    accent: "#E11D8C",
    featured: true,
  },
  {
    key: "ai-pack-200",
    name: "חבילת AI — 200 שאלות",
    nameEn: "AI pack — 200 questions",
    description:
      "הגדלת מכסת שאלות ליועץ BizUply ולכלי ה־AI במערכת — לעסקים שצריכים יותר תובנות ותשובות.",
    descriptionEn:
      "Extra AI question quota for BizUply Advisor and system AI tools — for businesses that need more insights.",
    category: "ai",
    icon: "bot",
    priceMonthly: null,
    priceLabel: "₪99 חד־פעמי",
    priceLabelEn: "₪99 one-time",
    accent: "#7C3AED",
  },
  {
    key: "ai-pack-500",
    name: "חבילת AI — 500 שאלות",
    nameEn: "AI pack — 500 questions",
    description:
      "חבילת AI מורחבת ליועץ העסקי ולאוטומציות חכמות — יותר נפח עבודה בלי לחכות לחידוש מכסה.",
    descriptionEn:
      "Larger AI pack for the business advisor and smart automations — more capacity without waiting for a quota reset.",
    category: "ai",
    icon: "sparkles",
    priceMonthly: null,
    priceLabel: "₪139 חד־פעמי",
    priceLabelEn: "₪139 one-time",
    accent: "#4F46E5",
    featured: true,
  },
  {
    key: "meta-campaigns",
    name: "ניהול קמפיינים Meta",
    nameEn: "Meta campaign management",
    description:
      "הקמה וניהול קמפיינים בפייסבוק ואינסטגרם מתוך BizUply — עם מעקב לידים שמגיעים ישר ל־CRM.",
    descriptionEn:
      "Build and manage Facebook & Instagram campaigns from BizUply — with leads flowing straight into CRM.",
    category: "growth",
    icon: "megaphone",
    priceMonthly: null,
    priceLabel: "לפי הצעה",
    priceLabelEn: "Custom quote",
    accent: "#1877F2",
  },
  {
    key: "whatsapp-managed",
    name: "שליחת הודעות WhatsApp",
    nameEn: "WhatsApp messaging",
    description:
      "שליחת הודעות ותבניות WhatsApp ללקוחות מתוך המערכת — תזכורות, מעקב ומסרים שיווקיים.",
    descriptionEn:
      "Send WhatsApp messages and templates to clients from the system — reminders, follow-ups, and marketing.",
    category: "growth",
    icon: "message",
    priceMonthly: null,
    priceLabel: "לפי הצעה",
    priceLabelEn: "Custom quote",
    accent: "#22C55E",
  },
  {
    key: "custom-domain",
    name: "דומיין מותאם לעסק",
    nameEn: "Custom business domain",
    description:
      "חיבור דומיין משלכם לאתר או לעמוד העסקי — רישום וניהול במחיר עלות דרך המערכת.",
    descriptionEn:
      "Connect your own domain to the site or business page — register and manage at cost through the system.",
    category: "infra",
    icon: "globe",
    priceMonthly: null,
    priceLabel: "במחיר עלות",
    priceLabelEn: "At cost",
    accent: "#0EA5E9",
  },
];
