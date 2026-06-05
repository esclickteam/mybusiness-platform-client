/*
  Bizuply Website Studio — Section Templates
  Path: src/components/site-builder/studio/data/sectionTemplates.ts

  מקור אחד לכל הסקשנים:
  כל מה שמופיע ב"הוספת סקשן" נמשך אוטומטית מתוך sectionLayoutVariants.
*/

import type { SectionCategory, SectionTemplate } from "../types";
import {
  sectionLayoutVariants,
  type SectionKind,
  type SectionLayoutVariant,
} from "./sectionLayoutVariants";

type SectionCategoryMeta = {
  key: SectionCategory;
  label: string;
  icon: string;
  description: string;
};

const sectionCategoryMeta: SectionCategoryMeta[] = [
  { key: "header", label: "הידר", icon: "▤", description: "תפריט עליון, לוגו, ניווט, כפתורים וכניסה/יציאה" },
  { key: "hero", label: "דף הבית", icon: "★", description: "פתיחת אתר, Hero, כותרת ראשית ותמונת אווירה" },
  { key: "welcome", label: "Welcome", icon: "✦", description: "פתיחה רכה, ברכה, הצגת העסק והנעה לפעולה" },
  { key: "about", label: "אודות", icon: "ℹ", description: "סיפור העסק, ערכים, ניסיון ותמונה" },
  { key: "team", label: "צוות", icon: "◉", description: "אנשי צוות, בעל העסק, פרופילים ותפקידים" },
  { key: "services", label: "שירותים", icon: "✦", description: "כרטיסי שירותים, מחירון, חבילות ותיאור שירות" },
  { key: "gallery", label: "גלריה", icon: "▧", description: "תמונות, עבודות, קרוסלה, גריד ומדיה" },
  { key: "contact", label: "יצירת קשר", icon: "@", description: "טפסים, וואטסאפ, טלפון, מפה ופרטי עסק" },
  { key: "promotion", label: "מבצע", icon: "%", description: "מבצעים, קופונים, באנרים והנעה לרכישה" },
  { key: "subscribe", label: "הרשמה", icon: "+", description: "ניוזלטר, רשימת המתנה, קופון והרשמה לעדכונים" },
  { key: "testimonials", label: "המלצות", icon: "❝", description: "המלצות לקוחות, ציטוטים וסושיאל פרוף" },
  { key: "reviews", label: "ביקורות", icon: "★", description: "ביקורות, דירוגים, כוכבים וטופס ביקורת" },
  { key: "clients", label: "לקוחות", icon: "◫", description: "לוגואים, לקוחות, מותגים ושותפים" },
  { key: "store", label: "חנות", icon: "₪", description: "מוצרים, מחיר, כפתור רכישה, קולקציות ו־Ecommerce" },
  { key: "booking", label: "תיאום תורים", icon: "☷", description: "יומן, זמינות, שעות, שירותים וקביעת תור" },
  { key: "bookings", label: "תיאום תורים", icon: "☷", description: "תמיכה בשם הישן bookings" },
  { key: "events", label: "אירועים", icon: "◇", description: "אירועים, לו״ז, הרצאות, סדנאות והרשמה" },
  { key: "club", label: "מועדון לקוחות", icon: "♛", description: "VIP, קופונים, הטבות והרשמת לקוחות" },
  { key: "bot", label: "בוט חכם", icon: "AI", description: "AI Assistant, צ׳אט, לידים, וואטסאפ ותורים" },
  { key: "social", label: "רשתות חברתיות", icon: "#", description: "אינסטגרם, פייסבוק, טיקטוק, יוטיוב, לינקדאין ווואטסאפ" },
  { key: "course", label: "קורס דיגיטלי", icon: "▶", description: "קורסים, שיעורים, תוכן, מחירון וסילבוס" },
  { key: "miniSaas", label: "Mini SaaS", icon: "S", description: "מערכת קטנה לעסק, דשבורד, התחברות ותשלום" },
  { key: "basic", label: "בסיסי", icon: "+", description: "סקשנים בסיסיים, ריקים, מספרים, CTA וטקסט" },
  { key: "text", label: "טקסט", icon: "T", description: "כותרות, פסקאות, ציטוטים ותוכן טקסטואלי" },
  { key: "list", label: "רשימה", icon: "☰", description: "רשימות, שלבים, יתרונות, FAQ ומחירון" },
  { key: "form", label: "טופס", icon: "▣", description: "טפסי ליד, יצירת קשר, הרשמה, בקשה ותמיכה" },
  { key: "forms", label: "טפסים", icon: "▣", description: "תמיכה בשם הישן forms" },
];

export const sectionCategories: { key: SectionCategory; label: string }[] =
  sectionCategoryMeta
    .filter((category) => sectionLayoutVariants.some((variant) => variant.kind === category.key))
    .map(({ key, label }) => ({ key, label }));

export const sectionCategoriesDetailed = sectionCategoryMeta.filter((category) =>
  sectionLayoutVariants.some((variant) => variant.kind === category.key)
);

function toSectionCategory(kind: SectionKind): SectionCategory {
  if (kind === "booking") return "booking";
  if (kind === "bookings") return "bookings";
  if (kind === "form") return "form";
  if (kind === "forms") return "forms";
  return kind as SectionCategory;
}

function stripUnsafePreviewCode(html: string) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getPreviewImage(variant: SectionLayoutVariant) {
  if (variant.previewImage) return variant.previewImage;
  const html = String(variant.html || "");
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch?.[1]) return imgMatch[1];
  const bgMatch = html.match(/url\(["']?([^"')]+)["']?\)/i);
  if (bgMatch?.[1]) return bgMatch[1];
  return "";
}

function ensureSectionKindOnRoot(html: string, kind: SectionKind) {
  if (/data-section-kind=["']/.test(html)) return html;
  if (/<header\b/i.test(html)) {
    return html.replace(/<header\b/i, `<header data-section-kind="${kind}"`);
  }
  if (/<section\b/i.test(html)) {
    return html.replace(/<section\b/i, `<section data-section-kind="${kind}"`);
  }
  return `
<section
  data-section-kind="${kind}"
  class="relative mx-auto w-full max-w-[1240px] px-6 py-20 sm:px-8 lg:px-10"
>
  ${html}
</section>
`;
}

function variantToTemplate(variant: SectionLayoutVariant): SectionTemplate {
  return {
    id: variant.id,
    category: toSectionCategory(variant.kind),
    title: variant.title,
    description: variant.description,
    preview: getPreviewImage(variant) || stripUnsafePreviewCode(variant.html),
    html: ensureSectionKindOnRoot(variant.html, variant.kind),
  };
}

export const sectionTemplates: SectionTemplate[] = sectionLayoutVariants
  .filter((variant) => variant.kind !== "savedSections")
  .map(variantToTemplate);

export function getSectionTemplatesByCategory(category: SectionCategory) {
  return sectionTemplates.filter((template) => template.category === category);
}

export function getSectionTemplateById(id: string) {
  return sectionTemplates.find((template) => template.id === id) || null;
}

export function getSectionCategoryMeta(category: SectionCategory) {
  return (
    sectionCategoryMeta.find((item) => item.key === category) || {
      key: category,
      label: String(category),
      icon: "▣",
      description: "",
    }
  );
}
