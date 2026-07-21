import {
  BadgePercent,
  CalendarDays,
  CreditCard,
  FileText,
  LayoutGrid,
  Mail,
  Puzzle,
  ShoppingBag,
  Star,
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
  | "club";

export const PLUGIN_SECTION_MAP: Record<string, SitePanelSection> = {
  store: "store",
  booking: "booking",
  payments: "payments",
  invoices: "invoices",
  leads: "leads",
  reviews: "reviews",
  club: "club",
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
};

export function getPluginIcon(key: string, size = 20) {
  switch (key) {
    case "store":
      return ShoppingBag;
    case "booking":
      return CalendarDays;
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
    default:
      return Puzzle;
  }
}

export function getSectionIcon(section: SitePanelSection, size = 18) {
  if (section === "overview") return LayoutGrid;
  if (section === "plugins") return Puzzle;
  const pluginKey = SECTION_META[section]?.pluginKey;
  if (pluginKey) return getPluginIcon(pluginKey, size);
  return Puzzle;
}
