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
