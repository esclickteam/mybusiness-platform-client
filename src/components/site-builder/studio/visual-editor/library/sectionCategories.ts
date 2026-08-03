import type { VisualLibraryCategory } from "./visualLibraryTypes";

export type SectionLibraryNavId =
  | "all"
  | "blank"
  | VisualLibraryCategory;

export const SECTION_LIBRARY_NAV: Array<{
  id: SectionLibraryNavId;
  label: string;
}> = [
  { id: "all", label: "הכול" },
  { id: "blank", label: "+ סקשן ריק" },
  { id: "hero", label: "ברוכים הבאים" },
  { id: "about", label: "אודות" },
  { id: "portfolio", label: "פורטפוליו" },
  { id: "services", label: "שירותים" },
  { id: "contact", label: "יצירת קשר" },
  { id: "commerce", label: "מוצרים" },
  { id: "features", label: "יתרונות" },
  { id: "promote", label: "קידום ומעורבות" },
  { id: "cta", label: "קריאה לפעולה" },
  { id: "testimonials", label: "ביקורות ואמון" },
  { id: "events", label: "אירועים" },
  { id: "booking", label: "יומן פגישות" },
  { id: "blog", label: "בלוג ותוכן" },
  { id: "pricing", label: "תמחור" },
  { id: "resume", label: "קורות חיים" },
  { id: "team", label: "צוות" },
  { id: "faq", label: "שאלות נפוצות" },
  { id: "stats", label: "מספרים" },
  { id: "footer", label: "פוטר" },
];

export const SECTION_CATEGORY_HEBREW: Partial<
  Record<VisualLibraryCategory, string>
> = Object.fromEntries(
  SECTION_LIBRARY_NAV.filter(
    (item) => item.id !== "all" && item.id !== "blank",
  ).map((item) => [item.id, item.label]),
);

/** Secondary filters inside the "סקשנים לאזור אישי" tab. */
export const PORTAL_SECTION_KIND_NAV: Array<{
  id: string;
  label: string;
  prefix: string;
}> = [
  { id: "all", label: "הכול", prefix: "section-portal-" },
  { id: "login", label: "התחברות", prefix: "section-portal-login-" },
  { id: "register", label: "הרשמה", prefix: "section-portal-register-" },
  { id: "account", label: "אזור אישי", prefix: "section-portal-account-" },
  { id: "orders", label: "הזמנות", prefix: "section-portal-orders-" },
  { id: "cart", label: "עגלה", prefix: "section-portal-cart-" },
  {
    id: "forgot-password",
    label: "שכחתי סיסמה",
    prefix: "section-portal-forgot-password-",
  },
  {
    id: "reset-password",
    label: "סיסמה חדשה",
    prefix: "section-portal-reset-password-",
  },
];
