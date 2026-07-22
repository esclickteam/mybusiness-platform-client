import {
  Accessibility,
  Bell,
  Bot,
  CalendarDays,
  CircleDot,
  Compass,
  CreditCard,
  FileText,
  Flame,
  FormInput,
  Hash,
  HelpCircle,
  LayoutGrid,
  Mail,
  Puzzle,
  Route,
  ShoppingBag,
  Star,
  Timer,
  Users,
} from "lucide-react";

export type SitePanelSection =
  | "overview"
  | "plugins"
  | "store"
  | "booking"
  | "payments"
  | "invoices"
  | "leads"
  | "reviews"
  | "club"
  | "heatmap"
  | "form-abandonment"
  | "journey-recording"
  | "why-no-lead"
  | "results-counter"
  | "waitlist"
  | "countdown"
  | "benefits-wheel"
  | "sales-agent"
  | "service-finder"
  | "accessibility";

export const PLUGIN_SECTION_MAP: Record<string, SitePanelSection> = {
  store: "store",
  booking: "booking",
  payments: "payments",
  invoices: "invoices",
  leads: "leads",
  reviews: "reviews",
  club: "club",
  heatmap: "heatmap",
  "form-abandonment": "form-abandonment",
  "journey-recording": "journey-recording",
  "why-no-lead": "why-no-lead",
  "results-counter": "results-counter",
  waitlist: "waitlist",
  countdown: "countdown",
  "benefits-wheel": "benefits-wheel",
  "sales-agent": "sales-agent",
  "service-finder": "service-finder",
  accessibility: "accessibility",
};

export const PLUGIN_ACCENTS: Record<string, string> = {
  store: "#7C3AED",
  booking: "#0284C7",
  payments: "#059669",
  invoices: "#10B981",
  leads: "#6366F1",
  reviews: "#F59E0B",
  club: "#8B5CF6",
  heatmap: "#EF4444",
  "form-abandonment": "#F97316",
  "journey-recording": "#EC4899",
  "why-no-lead": "#14B8A6",
  "results-counter": "#3B82F6",
  waitlist: "#0EA5E9",
  countdown: "#A855F7",
  "benefits-wheel": "#D946EF",
  "sales-agent": "#4F46E5",
  "service-finder": "#2563EB",
  accessibility: "#0891B2",
};

export const SECTION_META: Record<
  SitePanelSection,
  { label: string; description: string; pluginKey?: string }
> = {
  overview: {
    label: "סקירה",
    description: "מבט כללי על האתר והתוספים הפעילים",
  },
  plugins: {
    label: "חנות תוספים",
    description: "התקנה והסרה של תוספים לאתר",
  },
  store: {
    label: "ניהול חנות",
    description: "מוצרים, קטגוריות, משלוחים והזמנות",
    pluginKey: "store",
  },
  booking: {
    label: "יומן ותורים",
    description: "שעות פעילות, שירותים ותורים",
    pluginKey: "booking",
  },
  payments: {
    label: "סליקה",
    description: "חיבור ספקי תשלום ואמצעי סליקה",
    pluginKey: "payments",
  },
  invoices: {
    label: "חשבוניות Morning",
    description: "חיבור ל-Morning והפקת חשבוניות אוטומטית",
    pluginKey: "invoices",
  },
  leads: {
    label: "טופס לידים",
    description: "ניהול פניות מלקוחות",
    pluginKey: "leads",
  },
  reviews: {
    label: "ביקורות",
    description: "ניהול ביקורות לקוחות",
    pluginKey: "reviews",
  },
  club: {
    label: "מועדון לקוחות",
    description: "אזור לקוחות והטבות",
    pluginKey: "club",
  },
  heatmap: {
    label: "מפת חום",
    description: "ניתוח קליקים וגלילה",
    pluginKey: "heatmap",
  },
  "form-abandonment": {
    label: "נטישת טפסים",
    description: "ניתוח טפסים שלא הושלמו",
    pluginKey: "form-abandonment",
  },
  "journey-recording": {
    label: "מסע לקוח",
    description: "הקלטות מסלול גולשים",
    pluginKey: "journey-recording",
  },
  "why-no-lead": {
    label: "למה לא השאירו?",
    description: "תובנות על טפסים שלא נשלחו",
    pluginKey: "why-no-lead",
  },
  "results-counter": {
    label: "מונה תוצאות",
    description: "מונה חברתי באתר",
    pluginKey: "results-counter",
  },
  waitlist: {
    label: "רשימת המתנה",
    description: "התראה כשמתפנה תור",
    pluginKey: "waitlist",
  },
  countdown: {
    label: "ספירה לאחור",
    description: "טיימר דינמי למבצעים",
    pluginKey: "countdown",
  },
  "benefits-wheel": {
    label: "גלגל הטבות",
    description: "משחק הטבות להמרות",
    pluginKey: "benefits-wheel",
  },
  "sales-agent": {
    label: "סוכן מכירות",
    description: "בוט AI באתר",
    pluginKey: "sales-agent",
  },
  "service-finder": {
    label: "מצא שירות",
    description: "שאלון התאמה",
    pluginKey: "service-finder",
  },
  accessibility: {
    label: "נגישות",
    description: "כלי נגישות לאתר",
    pluginKey: "accessibility",
  },
};

export function getPluginAccent(key: string, fallback?: string) {
  return PLUGIN_ACCENTS[key] || fallback || "#64748B";
}

export function getPluginIcon(key: string) {
  switch (key) {
    case "store":
      return ShoppingBag;
    case "booking":
    case "waitlist":
      return key === "waitlist" ? Bell : CalendarDays;
    case "payments":
      return CreditCard;
    case "invoices":
      return FileText;
    case "leads":
      return Mail;
    case "reviews":
      return Star;
    case "club":
      return Users;
    case "heatmap":
      return Flame;
    case "form-abandonment":
      return FormInput;
    case "journey-recording":
      return Route;
    case "why-no-lead":
      return HelpCircle;
    case "results-counter":
      return Hash;
    case "countdown":
      return Timer;
    case "benefits-wheel":
      return CircleDot;
    case "sales-agent":
      return Bot;
    case "service-finder":
      return Compass;
    case "accessibility":
      return Accessibility;
    default:
      return Puzzle;
  }
}

export function getSectionIcon(section: SitePanelSection) {
  if (section === "overview") return LayoutGrid;
  if (section === "plugins") return Puzzle;
  const pluginKey = SECTION_META[section]?.pluginKey;
  if (pluginKey) return getPluginIcon(pluginKey);
  return Puzzle;
}
