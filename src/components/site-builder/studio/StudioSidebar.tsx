import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type {
  ElementCategory,
  PageTemplate,
  SectionCategory,
  SectionTemplate,
  StudioElement,
  ActiveStudioPanel,
  StudioPanel,
  ThemePalette,
  StudioSitePage,
  StudioSitePageType,
} from "./types";

import { elementCategories, studioElements } from "./data/elementLibrary";
import { sectionCategories, sectionTemplates } from "./data/sectionTemplates";
import { fontOptions, themePalettes } from "./data/themePalettes";
import { useAuth } from "../../../context/AuthContext";

type StudioPageSection = {
  id: string;
  title: string;
  kind: string;
  tagName: string;
};

type Props = {
  activePanel: ActiveStudioPanel;
  setActivePanel: (value: ActiveStudioPanel) => void;
  onAddHtml: (html: string) => void;
  onApplyTemplate: (template: PageTemplate) => void;
  onApplyPalette: (palette: ThemePalette) => void;
  onOpenMedia: () => void;

  pages?: StudioSitePage[];
  activePageId?: string;
  activePageSections?: StudioPageSection[];
  onSelectPage?: (pageId: string) => void;
  onAddPage?: (title: string, type?: StudioSitePageType) => void;
  onUpdatePageTitle?: (pageId: string, title: string) => void;

  onSelectSection?: (sectionId: string) => void;
  onDeleteSection?: (sectionId: string) => void;
  onDuplicateSection?: (sectionId: string) => void;
  onMoveSectionUp?: (sectionId: string) => void;
  onMoveSectionDown?: (sectionId: string) => void;
  onOpenSectionsPanel?: (kind?: string) => void;
};

const navItems: { key: StudioPanel; label: string; icon: string; hint: string }[] = [
  { key: "templates", label: "תבניות", icon: "▦", hint: "תבניות לעמוד הפעיל" },
  { key: "add", label: "אלמנטים", icon: "+", hint: "אלמנטים קטנים" },
  { key: "sections", label: "סקשנים", icon: "▭", hint: "סקשנים לעמוד הפעיל" },
  { key: "theme", label: "עיצוב", icon: "◐", hint: "צבעים ופונטים" },
  { key: "pages", label: "דפים", icon: "▤", hint: "עמודים נפרדים" },
  { key: "media", label: "מדיה", icon: "▧", hint: "תמונות ווידאו" },
  { key: "store", label: "חנות", icon: "◈", hint: "מוצרים" },
  { key: "services", label: "שירותים", icon: "◇", hint: "שירותי העסק" },
  { key: "bookings", label: "תורים", icon: "◷", hint: "יומן וזמנים" },
  { key: "club", label: "מועדון", icon: "♛", hint: "לקוחות" },
  { key: "leads", label: "לידים", icon: "✉", hint: "טפסים" },
  { key: "animations", label: "תנועה", icon: "✺", hint: "אפקטים" },
  { key: "seo", label: "SEO", icon: "⌕", hint: "גוגל ושיתוף" },
  { key: "settings", label: "הגדרות", icon: "⚙", hint: "דומיין ופרסום" },
];

const smartBlockIds = [
  "bizuply-services",
  "bizuply-booking",
  "bizuply-products",
  "bizuply-lead-form",
  "bizuply-reviews",
  "bizuply-club",
];

const sectionKindLabels: Record<string, string> = {
  header: "Header",
  hero: "פתיח",
  welcome: "Welcome",
  about: "אודות",
  team: "צוות",
  services: "שירותים",
  gallery: "גלריה",
  contact: "יצירת קשר",
  promotion: "מבצע",
  subscribe: "הרשמה",
  testimonials: "המלצות",
  reviews: "ביקורות",
  clients: "לקוחות",
  store: "חנות / מוצרים",
  booking: "תיאום תורים",
  bookings: "תיאום תורים",
  events: "אירועים",
  club: "מועדון",
  bot: "בוט",
  social: "סושיאל",
  course: "קורס",
  miniSaas: "Mini SaaS",
  basic: "בסיסי",
  text: "טקסט",
  list: "רשימה",
  form: "טופס",
  forms: "טופס",
  section: "סקשן",
  footer: "Footer",
};

const panelTitles: Record<StudioPanel, { title: string; subtitle: string }> = {
  templates: {
    title: "תבניות לעמוד",
    subtitle: "תבנית מחליפה רק את העמוד הפעיל.",
  },
  add: {
    title: "אלמנטים",
    subtitle: "טקסט, כפתור, תמונה, טופס, וידאו ועוד.",
  },
  sections: {
    title: "סקשנים",
    subtitle: "הוספת סקשן לעמוד הפעיל.",
  },
  theme: {
    title: "עיצוב כללי",
    subtitle: "ערכות צבעים ופונטים לאתר.",
  },
  pages: {
    title: "דפים",
    subtitle: "עמוד נפרד, ובתוכו סקשנים.",
  },
  media: {
    title: "מדיה",
    subtitle: "תמונות, וידאו ורקעים לאתר.",
  },
  store: {
    title: "חנות",
    subtitle: "ניהול חנות: מוצרים, קטגוריות, הגדרות, קופונים והזמנות.",
  },
  services: {
    title: "שירותים",
    subtitle: "בלוקים להצגת שירותים, מחירים וכפתורי פעולה.",
  },
  bookings: {
    title: "תורים",
    subtitle: "בלוקים ליומן, שעות פנויות וקביעת תור.",
  },
  club: {
    title: "מועדון",
    subtitle: "מועדון לקוחות, הטבות וקופונים.",
  },
  leads: {
    title: "לידים",
    subtitle: "טפסים, וואטסאפ, יצירת קשר ואיסוף פניות.",
  },
  animations: {
    title: "תנועה",
    subtitle: "אפקטים מקצועיים לאנימציות וכניסות.",
  },
  seo: {
    title: "SEO",
    subtitle: "כותרות, תיאורים ותצוגת שיתוף.",
  },
  settings: {
    title: "הגדרות",
    subtitle: "דומיין, סטטוס פרסום, שפה וחיבורים.",
  },
};

type ReadyWebsiteBlockType =
  | "header"
  | "hero"
  | "services"
  | "about"
  | "gallery"
  | "booking"
  | "store"
  | "testimonials"
  | "faq"
  | "contact";

type ReadyWebsiteBlock = {
  type: ReadyWebsiteBlockType;
  title: string;
  text: string;
};

type ReadyWebsitePalette = {
  primary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
};

type ReadyWebsiteTemplate = PageTemplate & {
  niche: string;
  heroTitle: string;
  heroSubtitle: string;
  image: string;
  layout: string;
  palette: ReadyWebsitePalette;
  blocks: ReadyWebsiteBlock[];
};

type ReadyWebsiteTemplateSeed = Omit<
  ReadyWebsiteTemplate,
  "preview" | "html"
>;

const READY_WEBSITE_TEMPLATE_SEEDS: ReadyWebsiteTemplateSeed[] = [
  {
    id: "beauty-luxury-spa",
    name: "Beauty Luxury Spa",
    category: "Beauty",
    description: "סטודיו יוקרתי לקוסמטיקה, טיפולי פנים, ציפורניים ואיפור קבוע.",
    niche: "יופי",
    heroTitle: "Beauty Luxury Spa שמוכן לעבודה",
    heroSubtitle: "סטודיו יוקרתי לקוסמטיקה, טיפולי פנים, ציפורניים ואיפור קבוע.",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80",
    layout: "luxury",
    palette: { primary: "#9D174D", accent: "#F472B6", background: "#FFF1F7", surface: "#ffffff", text: "#0f172a", muted: "#64748b" },
    blocks: [
      { type: "header", title: "ניווט עליון", text: "לוגו, תפריט, כפתור פעולה ודף הבית." },
      { type: "hero", title: "פתיח ראשי", text: "כותרת חזקה, תמונת דמו וכפתורי פעולה." },
      { type: "services", title: "שירותים", text: "3-6 שירותים מוכנים לעריכה עם מחירים ותיאור." },
      { type: "about", title: "אודות העסק", text: "אזור אמון עם ניסיון, יתרונות וסיפור העסק." },
      { type: "gallery", title: "גלריה", text: "תמונות דמו מוכנות להחלפה מהמדיה." },
      { type: "booking", title: "יומן תורים", text: "בלוק מחובר לשרת לזמינות, תאריכים ושעות פנויות." },
      { type: "store", title: "חנות / מוצרים", text: "מוצרים דינמיים מהשרת עם מחיר, מבצע וכפתור רכישה." },
      { type: "testimonials", title: "המלצות", text: "ביקורות לקוחות מוכנות לעיצוב." },
      { type: "faq", title: "שאלות נפוצות", text: "אזור שאלות שמוריד התנגדויות." },
      { type: "contact", title: "יצירת קשר", text: "טופס ליד, וואטסאפ, טלפון ומפה." },
    ],
  },
  {
    id: "barber-dark-studio",
    name: "Barber Dark Studio",
    category: "Barber",
    description: "אתר שחור פרימיום למספרה, ברבר, תספורות, זקן ומוצרים.",
    niche: "מספרה",
    heroTitle: "Barber Dark Studio שמוכן לעבודה",
    heroSubtitle: "אתר שחור פרימיום למספרה, ברבר, תספורות, זקן ומוצרים.",
    image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1200&q=80",
    layout: "splitDark",
    palette: { primary: "#111827", accent: "#F59E0B", background: "#FFF7ED", surface: "#ffffff", text: "#0f172a", muted: "#64748b" },
    blocks: [
      { type: "header", title: "ניווט עליון", text: "לוגו, תפריט, כפתור פעולה ודף הבית." },
      { type: "hero", title: "פתיח ראשי", text: "כותרת חזקה, תמונת דמו וכפתורי פעולה." },
      { type: "services", title: "שירותים", text: "3-6 שירותים מוכנים לעריכה עם מחירים ותיאור." },
      { type: "about", title: "אודות העסק", text: "אזור אמון עם ניסיון, יתרונות וסיפור העסק." },
      { type: "gallery", title: "גלריה", text: "תמונות דמו מוכנות להחלפה מהמדיה." },
      { type: "booking", title: "יומן תורים", text: "בלוק מחובר לשרת לזמינות, תאריכים ושעות פנויות." },
      { type: "store", title: "חנות / מוצרים", text: "מוצרים דינמיים מהשרת עם מחיר, מבצע וכפתור רכישה." },
      { type: "testimonials", title: "המלצות", text: "ביקורות לקוחות מוכנות לעיצוב." },
      { type: "faq", title: "שאלות נפוצות", text: "אזור שאלות שמוריד התנגדויות." },
      { type: "contact", title: "יצירת קשר", text: "טופס ליד, וואטסאפ, טלפון ומפה." },
    ],
  },
  {
    id: "clinic-booking-clean",
    name: "Clinic Booking Clean",
    category: "Booking",
    description: "אתר לקליניקה עם יומן תורים, שעות פנויות, שירותים ושאלות נפוצות.",
    niche: "קליניקה",
    heroTitle: "Clinic Booking Clean שמוכן לעבודה",
    heroSubtitle: "אתר לקליניקה עם יומן תורים, שעות פנויות, שירותים ושאלות נפוצות.",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
    layout: "clean",
    palette: { primary: "#0F766E", accent: "#5EEAD4", background: "#F0FDFA", surface: "#ffffff", text: "#0f172a", muted: "#64748b" },
    blocks: [
      { type: "header", title: "ניווט עליון", text: "לוגו, תפריט, כפתור פעולה ודף הבית." },
      { type: "hero", title: "פתיח ראשי", text: "כותרת חזקה, תמונת דמו וכפתורי פעולה." },
      { type: "services", title: "שירותים", text: "3-6 שירותים מוכנים לעריכה עם מחירים ותיאור." },
      { type: "about", title: "אודות העסק", text: "אזור אמון עם ניסיון, יתרונות וסיפור העסק." },
      { type: "gallery", title: "גלריה", text: "תמונות דמו מוכנות להחלפה מהמדיה." },
      { type: "booking", title: "יומן תורים", text: "בלוק מחובר לשרת לזמינות, תאריכים ושעות פנויות." },
      { type: "store", title: "חנות / מוצרים", text: "מוצרים דינמיים מהשרת עם מחיר, מבצע וכפתור רכישה." },
      { type: "testimonials", title: "המלצות", text: "ביקורות לקוחות מוכנות לעיצוב." },
      { type: "faq", title: "שאלות נפוצות", text: "אזור שאלות שמוריד התנגדויות." },
      { type: "contact", title: "יצירת קשר", text: "טופס ליד, וואטסאפ, טלפון ומפה." },
    ],
  },
  {
    id: "finance-clean-pro",
    name: "Finance Clean Pro",
    category: "Business",
    description: "אתר לרואה חשבון, יועץ מס, ביטוח ומשכנתאות עם טופס לידים.",
    niche: "פיננסים",
    heroTitle: "Finance Clean Pro שמוכן לעבודה",
    heroSubtitle: "אתר לרואה חשבון, יועץ מס, ביטוח ומשכנתאות עם טופס לידים.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    layout: "corporate",
    palette: { primary: "#064E3B", accent: "#10B981", background: "#ECFDF5", surface: "#ffffff", text: "#0f172a", muted: "#64748b" },
    blocks: [
      { type: "header", title: "ניווט עליון", text: "לוגו, תפריט, כפתור פעולה ודף הבית." },
      { type: "hero", title: "פתיח ראשי", text: "כותרת חזקה, תמונת דמו וכפתורי פעולה." },
      { type: "services", title: "שירותים", text: "3-6 שירותים מוכנים לעריכה עם מחירים ותיאור." },
      { type: "about", title: "אודות העסק", text: "אזור אמון עם ניסיון, יתרונות וסיפור העסק." },
      { type: "gallery", title: "גלריה", text: "תמונות דמו מוכנות להחלפה מהמדיה." },
      { type: "booking", title: "יומן תורים", text: "בלוק מחובר לשרת לזמינות, תאריכים ושעות פנויות." },
      { type: "store", title: "חנות / מוצרים", text: "מוצרים דינמיים מהשרת עם מחיר, מבצע וכפתור רכישה." },
      { type: "testimonials", title: "המלצות", text: "ביקורות לקוחות מוכנות לעיצוב." },
      { type: "faq", title: "שאלות נפוצות", text: "אזור שאלות שמוריד התנגדויות." },
      { type: "contact", title: "יצירת קשר", text: "טופס ליד, וואטסאפ, טלפון ומפה." },
    ],
  },
  {
    id: "law-gold-office",
    name: "Law Gold Office",
    category: "Law",
    description: "אתר יוקרתי למשרד עורכי דין עם התמחות, צוות, מאמרים ופניות.",
    niche: "משפטים",
    heroTitle: "Law Gold Office שמוכן לעבודה",
    heroSubtitle: "אתר יוקרתי למשרד עורכי דין עם התמחות, צוות, מאמרים ופניות.",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
    layout: "editorial",
    palette: { primary: "#111827", accent: "#C79A2B", background: "#FFFBEB", surface: "#ffffff", text: "#0f172a", muted: "#64748b" },
    blocks: [
      { type: "header", title: "ניווט עליון", text: "לוגו, תפריט, כפתור פעולה ודף הבית." },
      { type: "hero", title: "פתיח ראשי", text: "כותרת חזקה, תמונת דמו וכפתורי פעולה." },
      { type: "services", title: "שירותים", text: "3-6 שירותים מוכנים לעריכה עם מחירים ותיאור." },
      { type: "about", title: "אודות העסק", text: "אזור אמון עם ניסיון, יתרונות וסיפור העסק." },
      { type: "gallery", title: "גלריה", text: "תמונות דמו מוכנות להחלפה מהמדיה." },
      { type: "booking", title: "יומן תורים", text: "בלוק מחובר לשרת לזמינות, תאריכים ושעות פנויות." },
      { type: "store", title: "חנות / מוצרים", text: "מוצרים דינמיים מהשרת עם מחיר, מבצע וכפתור רכישה." },
      { type: "testimonials", title: "המלצות", text: "ביקורות לקוחות מוכנות לעיצוב." },
      { type: "faq", title: "שאלות נפוצות", text: "אזור שאלות שמוריד התנגדויות." },
      { type: "contact", title: "יצירת קשר", text: "טופס ליד, וואטסאפ, טלפון ומפה." },
    ],
  },
  {
    id: "restaurant-warm-table",
    name: "Restaurant Warm Table",
    category: "Restaurant",
    description: "אתר למסעדה, תפריט, גלריה, הזמנת מקום ומבצעים.",
    niche: "מסעדה",
    heroTitle: "Restaurant Warm Table שמוכן לעבודה",
    heroSubtitle: "אתר למסעדה, תפריט, גלריה, הזמנת מקום ומבצעים.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    layout: "food",
    palette: { primary: "#7C2D12", accent: "#FB923C", background: "#FFF7ED", surface: "#ffffff", text: "#0f172a", muted: "#64748b" },
    blocks: [
      { type: "header", title: "ניווט עליון", text: "לוגו, תפריט, כפתור פעולה ודף הבית." },
      { type: "hero", title: "פתיח ראשי", text: "כותרת חזקה, תמונת דמו וכפתורי פעולה." },
      { type: "services", title: "שירותים", text: "3-6 שירותים מוכנים לעריכה עם מחירים ותיאור." },
      { type: "about", title: "אודות העסק", text: "אזור אמון עם ניסיון, יתרונות וסיפור העסק." },
      { type: "gallery", title: "גלריה", text: "תמונות דמו מוכנות להחלפה מהמדיה." },
      { type: "booking", title: "יומן תורים", text: "בלוק מחובר לשרת לזמינות, תאריכים ושעות פנויות." },
      { type: "store", title: "חנות / מוצרים", text: "מוצרים דינמיים מהשרת עם מחיר, מבצע וכפתור רכישה." },
      { type: "testimonials", title: "המלצות", text: "ביקורות לקוחות מוכנות לעיצוב." },
      { type: "faq", title: "שאלות נפוצות", text: "אזור שאלות שמוריד התנגדויות." },
      { type: "contact", title: "יצירת קשר", text: "טופס ליד, וואטסאפ, טלפון ומפה." },
    ],
  },
  {
    id: "fitness-energy-coach",
    name: "Fitness Energy Coach",
    category: "Fitness",
    description: "אתר למאמן כושר, סטודיו, תוכניות אימון ויומן שיעורים.",
    niche: "כושר",
    heroTitle: "Fitness Energy Coach שמוכן לעבודה",
    heroSubtitle: "אתר למאמן כושר, סטודיו, תוכניות אימון ויומן שיעורים.",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
    layout: "sport",
    palette: { primary: "#020617", accent: "#22C55E", background: "#F0FDF4", surface: "#ffffff", text: "#0f172a", muted: "#64748b" },
    blocks: [
      { type: "header", title: "ניווט עליון", text: "לוגו, תפריט, כפתור פעולה ודף הבית." },
      { type: "hero", title: "פתיח ראשי", text: "כותרת חזקה, תמונת דמו וכפתורי פעולה." },
      { type: "services", title: "שירותים", text: "3-6 שירותים מוכנים לעריכה עם מחירים ותיאור." },
      { type: "about", title: "אודות העסק", text: "אזור אמון עם ניסיון, יתרונות וסיפור העסק." },
      { type: "gallery", title: "גלריה", text: "תמונות דמו מוכנות להחלפה מהמדיה." },
      { type: "booking", title: "יומן תורים", text: "בלוק מחובר לשרת לזמינות, תאריכים ושעות פנויות." },
      { type: "store", title: "חנות / מוצרים", text: "מוצרים דינמיים מהשרת עם מחיר, מבצע וכפתור רכישה." },
      { type: "testimonials", title: "המלצות", text: "ביקורות לקוחות מוכנות לעיצוב." },
      { type: "faq", title: "שאלות נפוצות", text: "אזור שאלות שמוריד התנגדויות." },
      { type: "contact", title: "יצירת קשר", text: "טופס ליד, וואטסאפ, טלפון ומפה." },
    ],
  },
  {
    id: "yoga-soft-flow",
    name: "Yoga Soft Flow",
    category: "Wellness",
    description: "אתר רגוע ליוגה, פילאטיס, שיעורים, מנויים ותיאום שיעור.",
    niche: "וולנס",
    heroTitle: "Yoga Soft Flow שמוכן לעבודה",
    heroSubtitle: "אתר רגוע ליוגה, פילאטיס, שיעורים, מנויים ותיאום שיעור.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
    layout: "soft",
    palette: { primary: "#6D5D3F", accent: "#A3E635", background: "#FAF7EF", surface: "#ffffff", text: "#0f172a", muted: "#64748b" },
    blocks: [
      { type: "header", title: "ניווט עליון", text: "לוגו, תפריט, כפתור פעולה ודף הבית." },
      { type: "hero", title: "פתיח ראשי", text: "כותרת חזקה, תמונת דמו וכפתורי פעולה." },
      { type: "services", title: "שירותים", text: "3-6 שירותים מוכנים לעריכה עם מחירים ותיאור." },
      { type: "about", title: "אודות העסק", text: "אזור אמון עם ניסיון, יתרונות וסיפור העסק." },
      { type: "gallery", title: "גלריה", text: "תמונות דמו מוכנות להחלפה מהמדיה." },
      { type: "booking", title: "יומן תורים", text: "בלוק מחובר לשרת לזמינות, תאריכים ושעות פנויות." },
      { type: "store", title: "חנות / מוצרים", text: "מוצרים דינמיים מהשרת עם מחיר, מבצע וכפתור רכישה." },
      { type: "testimonials", title: "המלצות", text: "ביקורות לקוחות מוכנות לעיצוב." },
      { type: "faq", title: "שאלות נפוצות", text: "אזור שאלות שמוריד התנגדויות." },
      { type: "contact", title: "יצירת קשר", text: "טופס ליד, וואטסאפ, טלפון ומפה." },
    ],
  },
  {
    id: "realestate-premium",
    name: "Real Estate Premium",
    category: "Real Estate",
    description: "אתר נדל״ן עם נכסים, פרויקטים, טופס ליד ואזורי שירות.",
    niche: "נדלן",
    heroTitle: "Real Estate Premium שמוכן לעבודה",
    heroSubtitle: "אתר נדל״ן עם נכסים, פרויקטים, טופס ליד ואזורי שירות.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
    layout: "realestate",
    palette: { primary: "#0F172A", accent: "#38BDF8", background: "#F8FAFC", surface: "#ffffff", text: "#0f172a", muted: "#64748b" },
    blocks: [
      { type: "header", title: "ניווט עליון", text: "לוגו, תפריט, כפתור פעולה ודף הבית." },
      { type: "hero", title: "פתיח ראשי", text: "כותרת חזקה, תמונת דמו וכפתורי פעולה." },
      { type: "services", title: "שירותים", text: "3-6 שירותים מוכנים לעריכה עם מחירים ותיאור." },
      { type: "about", title: "אודות העסק", text: "אזור אמון עם ניסיון, יתרונות וסיפור העסק." },
      { type: "gallery", title: "גלריה", text: "תמונות דמו מוכנות להחלפה מהמדיה." },
      { type: "booking", title: "יומן תורים", text: "בלוק מחובר לשרת לזמינות, תאריכים ושעות פנויות." },
      { type: "store", title: "חנות / מוצרים", text: "מוצרים דינמיים מהשרת עם מחיר, מבצע וכפתור רכישה." },
      { type: "testimonials", title: "המלצות", text: "ביקורות לקוחות מוכנות לעיצוב." },
      { type: "faq", title: "שאלות נפוצות", text: "אזור שאלות שמוריד התנגדויות." },
      { type: "contact", title: "יצירת קשר", text: "טופס ליד, וואטסאפ, טלפון ומפה." },
    ],
  },
  {
    id: "photographer-portfolio",
    name: "Photographer Portfolio",
    category: "Portfolio",
    description: "אתר פורטפוליו לצלמים, עבודות, חבילות והזמנות.",
    niche: "פורטפוליו",
    heroTitle: "Photographer Portfolio שמוכן לעבודה",
    heroSubtitle: "אתר פורטפוליו לצלמים, עבודות, חבילות והזמנות.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
    layout: "gallery",
    palette: { primary: "#18181B", accent: "#A855F7", background: "#FAFAFA", surface: "#ffffff", text: "#0f172a", muted: "#64748b" },
    blocks: [
      { type: "header", title: "ניווט עליון", text: "לוגו, תפריט, כפתור פעולה ודף הבית." },
      { type: "hero", title: "פתיח ראשי", text: "כותרת חזקה, תמונת דמו וכפתורי פעולה." },
      { type: "services", title: "שירותים", text: "3-6 שירותים מוכנים לעריכה עם מחירים ותיאור." },
      { type: "about", title: "אודות העסק", text: "אזור אמון עם ניסיון, יתרונות וסיפור העסק." },
      { type: "gallery", title: "גלריה", text: "תמונות דמו מוכנות להחלפה מהמדיה." },
      { type: "booking", title: "יומן תורים", text: "בלוק מחובר לשרת לזמינות, תאריכים ושעות פנויות." },
      { type: "store", title: "חנות / מוצרים", text: "מוצרים דינמיים מהשרת עם מחיר, מבצע וכפתור רכישה." },
      { type: "testimonials", title: "המלצות", text: "ביקורות לקוחות מוכנות לעיצוב." },
      { type: "faq", title: "שאלות נפוצות", text: "אזור שאלות שמוריד התנגדויות." },
      { type: "contact", title: "יצירת קשר", text: "טופס ליד, וואטסאפ, טלפון ומפה." },
    ],
  },
  {
    id: "event-planner-luxury",
    name: "Event Planner Luxury",
    category: "Events",
    description: "אתר למפיקי אירועים, אולמות, חבילות, גלריה ולידים.",
    niche: "אירועים",
    heroTitle: "Event Planner Luxury שמוכן לעבודה",
    heroSubtitle: "אתר למפיקי אירועים, אולמות, חבילות, גלריה ולידים.",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
    layout: "events",
    palette: { primary: "#581C87", accent: "#FBBF24", background: "#FDF4FF", surface: "#ffffff", text: "#0f172a", muted: "#64748b" },
    blocks: [
      { type: "header", title: "ניווט עליון", text: "לוגו, תפריט, כפתור פעולה ודף הבית." },
      { type: "hero", title: "פתיח ראשי", text: "כותרת חזקה, תמונת דמו וכפתורי פעולה." },
      { type: "services", title: "שירותים", text: "3-6 שירותים מוכנים לעריכה עם מחירים ותיאור." },
      { type: "about", title: "אודות העסק", text: "אזור אמון עם ניסיון, יתרונות וסיפור העסק." },
      { type: "gallery", title: "גלריה", text: "תמונות דמו מוכנות להחלפה מהמדיה." },
      { type: "booking", title: "יומן תורים", text: "בלוק מחובר לשרת לזמינות, תאריכים ושעות פנויות." },
      { type: "store", title: "חנות / מוצרים", text: "מוצרים דינמיים מהשרת עם מחיר, מבצע וכפתור רכישה." },
      { type: "testimonials", title: "המלצות", text: "ביקורות לקוחות מוכנות לעיצוב." },
      { type: "faq", title: "שאלות נפוצות", text: "אזור שאלות שמוריד התנגדויות." },
      { type: "contact", title: "יצירת קשר", text: "טופס ליד, וואטסאפ, טלפון ומפה." },
    ],
  },
  {
    id: "digital-agency-bold",
    name: "Digital Agency Bold",
    category: "Agency",
    description: "אתר לסוכנות שיווק, בניית אתרים, פרסום ותיק עבודות.",
    niche: "סוכנות",
    heroTitle: "Digital Agency Bold שמוכן לעבודה",
    heroSubtitle: "אתר לסוכנות שיווק, בניית אתרים, פרסום ותיק עבודות.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    layout: "bold",
    palette: { primary: "#1E1B4B", accent: "#8B5CF6", background: "#F5F3FF", surface: "#ffffff", text: "#0f172a", muted: "#64748b" },
    blocks: [
      { type: "header", title: "ניווט עליון", text: "לוגו, תפריט, כפתור פעולה ודף הבית." },
      { type: "hero", title: "פתיח ראשי", text: "כותרת חזקה, תמונת דמו וכפתורי פעולה." },
      { type: "services", title: "שירותים", text: "3-6 שירותים מוכנים לעריכה עם מחירים ותיאור." },
      { type: "about", title: "אודות העסק", text: "אזור אמון עם ניסיון, יתרונות וסיפור העסק." },
      { type: "gallery", title: "גלריה", text: "תמונות דמו מוכנות להחלפה מהמדיה." },
      { type: "booking", title: "יומן תורים", text: "בלוק מחובר לשרת לזמינות, תאריכים ושעות פנויות." },
      { type: "store", title: "חנות / מוצרים", text: "מוצרים דינמיים מהשרת עם מחיר, מבצע וכפתור רכישה." },
      { type: "testimonials", title: "המלצות", text: "ביקורות לקוחות מוכנות לעיצוב." },
      { type: "faq", title: "שאלות נפוצות", text: "אזור שאלות שמוריד התנגדויות." },
      { type: "contact", title: "יצירת קשר", text: "טופס ליד, וואטסאפ, טלפון ומפה." },
    ],
  },
  {
    id: "course-creator-pro",
    name: "Course Creator Pro",
    category: "Education",
    description: "אתר לקורסים, שיעורים, תוכן דיגיטלי והרשמה.",
    niche: "קורסים",
    heroTitle: "Course Creator Pro שמוכן לעבודה",
    heroSubtitle: "אתר לקורסים, שיעורים, תוכן דיגיטלי והרשמה.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    layout: "education",
    palette: { primary: "#1D4ED8", accent: "#F97316", background: "#EFF6FF", surface: "#ffffff", text: "#0f172a", muted: "#64748b" },
    blocks: [
      { type: "header", title: "ניווט עליון", text: "לוגו, תפריט, כפתור פעולה ודף הבית." },
      { type: "hero", title: "פתיח ראשי", text: "כותרת חזקה, תמונת דמו וכפתורי פעולה." },
      { type: "services", title: "שירותים", text: "3-6 שירותים מוכנים לעריכה עם מחירים ותיאור." },
      { type: "about", title: "אודות העסק", text: "אזור אמון עם ניסיון, יתרונות וסיפור העסק." },
      { type: "gallery", title: "גלריה", text: "תמונות דמו מוכנות להחלפה מהמדיה." },
      { type: "booking", title: "יומן תורים", text: "בלוק מחובר לשרת לזמינות, תאריכים ושעות פנויות." },
      { type: "store", title: "חנות / מוצרים", text: "מוצרים דינמיים מהשרת עם מחיר, מבצע וכפתור רכישה." },
      { type: "testimonials", title: "המלצות", text: "ביקורות לקוחות מוכנות לעיצוב." },
      { type: "faq", title: "שאלות נפוצות", text: "אזור שאלות שמוריד התנגדויות." },
      { type: "contact", title: "יצירת קשר", text: "טופס ליד, וואטסאפ, טלפון ומפה." },
    ],
  },
  {
    id: "kids-activity-color",
    name: "Kids Activity Color",
    category: "Kids",
    description: "אתר צבעוני לחוגים, ילדים, סדנאות והרשמה.",
    niche: "ילדים",
    heroTitle: "Kids Activity Color שמוכן לעבודה",
    heroSubtitle: "אתר צבעוני לחוגים, ילדים, סדנאות והרשמה.",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=80",
    layout: "playful",
    palette: { primary: "#7C3AED", accent: "#F43F5E", background: "#FFF7ED", surface: "#ffffff", text: "#0f172a", muted: "#64748b" },
    blocks: [
      { type: "header", title: "ניווט עליון", text: "לוגו, תפריט, כפתור פעולה ודף הבית." },
      { type: "hero", title: "פתיח ראשי", text: "כותרת חזקה, תמונת דמו וכפתורי פעולה." },
      { type: "services", title: "שירותים", text: "3-6 שירותים מוכנים לעריכה עם מחירים ותיאור." },
      { type: "about", title: "אודות העסק", text: "אזור אמון עם ניסיון, יתרונות וסיפור העסק." },
      { type: "gallery", title: "גלריה", text: "תמונות דמו מוכנות להחלפה מהמדיה." },
      { type: "booking", title: "יומן תורים", text: "בלוק מחובר לשרת לזמינות, תאריכים ושעות פנויות." },
      { type: "store", title: "חנות / מוצרים", text: "מוצרים דינמיים מהשרת עם מחיר, מבצע וכפתור רכישה." },
      { type: "testimonials", title: "המלצות", text: "ביקורות לקוחות מוכנות לעיצוב." },
      { type: "faq", title: "שאלות נפוצות", text: "אזור שאלות שמוריד התנגדויות." },
      { type: "contact", title: "יצירת קשר", text: "טופס ליד, וואטסאפ, טלפון ומפה." },
    ],
  },
  {
    id: "home-services-clean",
    name: "Home Services Clean",
    category: "Services",
    description: "אתר לאינסטלטור, חשמלאי, הדברה, מיזוג ושירותי בית.",
    niche: "שירותי בית",
    heroTitle: "Home Services Clean שמוכן לעבודה",
    heroSubtitle: "אתר לאינסטלטור, חשמלאי, הדברה, מיזוג ושירותי בית.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    layout: "service",
    palette: { primary: "#0F172A", accent: "#06B6D4", background: "#F0F9FF", surface: "#ffffff", text: "#0f172a", muted: "#64748b" },
    blocks: [
      { type: "header", title: "ניווט עליון", text: "לוגו, תפריט, כפתור פעולה ודף הבית." },
      { type: "hero", title: "פתיח ראשי", text: "כותרת חזקה, תמונת דמו וכפתורי פעולה." },
      { type: "services", title: "שירותים", text: "3-6 שירותים מוכנים לעריכה עם מחירים ותיאור." },
      { type: "about", title: "אודות העסק", text: "אזור אמון עם ניסיון, יתרונות וסיפור העסק." },
      { type: "gallery", title: "גלריה", text: "תמונות דמו מוכנות להחלפה מהמדיה." },
      { type: "booking", title: "יומן תורים", text: "בלוק מחובר לשרת לזמינות, תאריכים ושעות פנויות." },
      { type: "store", title: "חנות / מוצרים", text: "מוצרים דינמיים מהשרת עם מחיר, מבצע וכפתור רכישה." },
      { type: "testimonials", title: "המלצות", text: "ביקורות לקוחות מוכנות לעיצוב." },
      { type: "faq", title: "שאלות נפוצות", text: "אזור שאלות שמוריד התנגדויות." },
      { type: "contact", title: "יצירת קשר", text: "טופס ליד, וואטסאפ, טלפון ומפה." },
    ],
  },
  {
    id: "medical-dental-pro",
    name: "Dental Medical Pro",
    category: "Medical",
    description: "אתר למרפאת שיניים עם יומן, טיפולים, צוות ושאלות.",
    niche: "רפואה",
    heroTitle: "Dental Medical Pro שמוכן לעבודה",
    heroSubtitle: "אתר למרפאת שיניים עם יומן, טיפולים, צוות ושאלות.",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
    layout: "medical",
    palette: { primary: "#075985", accent: "#67E8F9", background: "#ECFEFF", surface: "#ffffff", text: "#0f172a", muted: "#64748b" },
    blocks: [
      { type: "header", title: "ניווט עליון", text: "לוגו, תפריט, כפתור פעולה ודף הבית." },
      { type: "hero", title: "פתיח ראשי", text: "כותרת חזקה, תמונת דמו וכפתורי פעולה." },
      { type: "services", title: "שירותים", text: "3-6 שירותים מוכנים לעריכה עם מחירים ותיאור." },
      { type: "about", title: "אודות העסק", text: "אזור אמון עם ניסיון, יתרונות וסיפור העסק." },
      { type: "gallery", title: "גלריה", text: "תמונות דמו מוכנות להחלפה מהמדיה." },
      { type: "booking", title: "יומן תורים", text: "בלוק מחובר לשרת לזמינות, תאריכים ושעות פנויות." },
      { type: "store", title: "חנות / מוצרים", text: "מוצרים דינמיים מהשרת עם מחיר, מבצע וכפתור רכישה." },
      { type: "testimonials", title: "המלצות", text: "ביקורות לקוחות מוכנות לעיצוב." },
      { type: "faq", title: "שאלות נפוצות", text: "אזור שאלות שמוריד התנגדויות." },
      { type: "contact", title: "יצירת קשר", text: "טופס ליד, וואטסאפ, טלפון ומפה." },
    ],
  },
  {
    id: "pet-grooming-fun",
    name: "Pet Grooming Fun",
    category: "Pets",
    description: "אתר למספרת כלבים, וטרינר, פנסיון וחנות חיות.",
    niche: "חיות",
    heroTitle: "Pet Grooming Fun שמוכן לעבודה",
    heroSubtitle: "אתר למספרת כלבים, וטרינר, פנסיון וחנות חיות.",
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1200&q=80",
    layout: "pets",
    palette: { primary: "#166534", accent: "#F59E0B", background: "#F7FEE7", surface: "#ffffff", text: "#0f172a", muted: "#64748b" },
    blocks: [
      { type: "header", title: "ניווט עליון", text: "לוגו, תפריט, כפתור פעולה ודף הבית." },
      { type: "hero", title: "פתיח ראשי", text: "כותרת חזקה, תמונת דמו וכפתורי פעולה." },
      { type: "services", title: "שירותים", text: "3-6 שירותים מוכנים לעריכה עם מחירים ותיאור." },
      { type: "about", title: "אודות העסק", text: "אזור אמון עם ניסיון, יתרונות וסיפור העסק." },
      { type: "gallery", title: "גלריה", text: "תמונות דמו מוכנות להחלפה מהמדיה." },
      { type: "booking", title: "יומן תורים", text: "בלוק מחובר לשרת לזמינות, תאריכים ושעות פנויות." },
      { type: "store", title: "חנות / מוצרים", text: "מוצרים דינמיים מהשרת עם מחיר, מבצע וכפתור רכישה." },
      { type: "testimonials", title: "המלצות", text: "ביקורות לקוחות מוכנות לעיצוב." },
      { type: "faq", title: "שאלות נפוצות", text: "אזור שאלות שמוריד התנגדויות." },
      { type: "contact", title: "יצירת קשר", text: "טופס ליד, וואטסאפ, טלפון ומפה." },
    ],
  },
  {
    id: "fashion-boutique-store",
    name: "Fashion Boutique Store",
    category: "Store",
    description: "חנות אופנה עם קולקציות, מוצרים, מבצעים וגלריה.",
    niche: "חנות",
    heroTitle: "Fashion Boutique Store שמוכן לעבודה",
    heroSubtitle: "חנות אופנה עם קולקציות, מוצרים, מבצעים וגלריה.",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80",
    layout: "fashion",
    palette: { primary: "#831843", accent: "#F9A8D4", background: "#FFF1F2", surface: "#ffffff", text: "#0f172a", muted: "#64748b" },
    blocks: [
      { type: "header", title: "ניווט עליון", text: "לוגו, תפריט, כפתור פעולה ודף הבית." },
      { type: "hero", title: "פתיח ראשי", text: "כותרת חזקה, תמונת דמו וכפתורי פעולה." },
      { type: "services", title: "שירותים", text: "3-6 שירותים מוכנים לעריכה עם מחירים ותיאור." },
      { type: "about", title: "אודות העסק", text: "אזור אמון עם ניסיון, יתרונות וסיפור העסק." },
      { type: "gallery", title: "גלריה", text: "תמונות דמו מוכנות להחלפה מהמדיה." },
      { type: "booking", title: "יומן תורים", text: "בלוק מחובר לשרת לזמינות, תאריכים ושעות פנויות." },
      { type: "store", title: "חנות / מוצרים", text: "מוצרים דינמיים מהשרת עם מחיר, מבצע וכפתור רכישה." },
      { type: "testimonials", title: "המלצות", text: "ביקורות לקוחות מוכנות לעיצוב." },
      { type: "faq", title: "שאלות נפוצות", text: "אזור שאלות שמוריד התנגדויות." },
      { type: "contact", title: "יצירת קשר", text: "טופס ליד, וואטסאפ, טלפון ומפה." },
    ],
  },
  {
    id: "jewelry-gold-store",
    name: "Jewelry Gold Store",
    category: "Store",
    description: "חנות תכשיטים יוקרתית עם קולקציות, מוצרים והזמנות.",
    niche: "חנות",
    heroTitle: "Jewelry Gold Store שמוכן לעבודה",
    heroSubtitle: "חנות תכשיטים יוקרתית עם קולקציות, מוצרים והזמנות.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
    layout: "jewelry",
    palette: { primary: "#422006", accent: "#FBBF24", background: "#FFFBEB", surface: "#ffffff", text: "#0f172a", muted: "#64748b" },
    blocks: [
      { type: "header", title: "ניווט עליון", text: "לוגו, תפריט, כפתור פעולה ודף הבית." },
      { type: "hero", title: "פתיח ראשי", text: "כותרת חזקה, תמונת דמו וכפתורי פעולה." },
      { type: "services", title: "שירותים", text: "3-6 שירותים מוכנים לעריכה עם מחירים ותיאור." },
      { type: "about", title: "אודות העסק", text: "אזור אמון עם ניסיון, יתרונות וסיפור העסק." },
      { type: "gallery", title: "גלריה", text: "תמונות דמו מוכנות להחלפה מהמדיה." },
      { type: "booking", title: "יומן תורים", text: "בלוק מחובר לשרת לזמינות, תאריכים ושעות פנויות." },
      { type: "store", title: "חנות / מוצרים", text: "מוצרים דינמיים מהשרת עם מחיר, מבצע וכפתור רכישה." },
      { type: "testimonials", title: "המלצות", text: "ביקורות לקוחות מוכנות לעיצוב." },
      { type: "faq", title: "שאלות נפוצות", text: "אזור שאלות שמוריד התנגדויות." },
      { type: "contact", title: "יצירת קשר", text: "טופס ליד, וואטסאפ, טלפון ומפה." },
    ],
  },
  {
    id: "hotel-resort-booking",
    name: "Hotel Resort Booking",
    category: "Travel",
    description: "אתר למלון, צימר, חדרים, גלריה והזמנות.",
    niche: "תיירות",
    heroTitle: "Hotel Resort Booking שמוכן לעבודה",
    heroSubtitle: "אתר למלון, צימר, חדרים, גלריה והזמנות.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    layout: "hotel",
    palette: { primary: "#0F172A", accent: "#14B8A6", background: "#F0FDFA", surface: "#ffffff", text: "#0f172a", muted: "#64748b" },
    blocks: [
      { type: "header", title: "ניווט עליון", text: "לוגו, תפריט, כפתור פעולה ודף הבית." },
      { type: "hero", title: "פתיח ראשי", text: "כותרת חזקה, תמונת דמו וכפתורי פעולה." },
      { type: "services", title: "שירותים", text: "3-6 שירותים מוכנים לעריכה עם מחירים ותיאור." },
      { type: "about", title: "אודות העסק", text: "אזור אמון עם ניסיון, יתרונות וסיפור העסק." },
      { type: "gallery", title: "גלריה", text: "תמונות דמו מוכנות להחלפה מהמדיה." },
      { type: "booking", title: "יומן תורים", text: "בלוק מחובר לשרת לזמינות, תאריכים ושעות פנויות." },
      { type: "store", title: "חנות / מוצרים", text: "מוצרים דינמיים מהשרת עם מחיר, מבצע וכפתור רכישה." },
      { type: "testimonials", title: "המלצות", text: "ביקורות לקוחות מוכנות לעיצוב." },
      { type: "faq", title: "שאלות נפוצות", text: "אזור שאלות שמוריד התנגדויות." },
      { type: "contact", title: "יצירת קשר", text: "טופס ליד, וואטסאפ, טלפון ומפה." },
    ],
  },
  {
    id: "car-detailing-pro",
    name: "Car Detailing Pro",
    category: "Auto",
    description: "אתר למוסך, שטיפת רכב, דיטיילינג ושירותי רכב.",
    niche: "רכב",
    heroTitle: "Car Detailing Pro שמוכן לעבודה",
    heroSubtitle: "אתר למוסך, שטיפת רכב, דיטיילינג ושירותי רכב.",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    layout: "auto",
    palette: { primary: "#020617", accent: "#EF4444", background: "#F8FAFC", surface: "#ffffff", text: "#0f172a", muted: "#64748b" },
    blocks: [
      { type: "header", title: "ניווט עליון", text: "לוגו, תפריט, כפתור פעולה ודף הבית." },
      { type: "hero", title: "פתיח ראשי", text: "כותרת חזקה, תמונת דמו וכפתורי פעולה." },
      { type: "services", title: "שירותים", text: "3-6 שירותים מוכנים לעריכה עם מחירים ותיאור." },
      { type: "about", title: "אודות העסק", text: "אזור אמון עם ניסיון, יתרונות וסיפור העסק." },
      { type: "gallery", title: "גלריה", text: "תמונות דמו מוכנות להחלפה מהמדיה." },
      { type: "booking", title: "יומן תורים", text: "בלוק מחובר לשרת לזמינות, תאריכים ושעות פנויות." },
      { type: "store", title: "חנות / מוצרים", text: "מוצרים דינמיים מהשרת עם מחיר, מבצע וכפתור רכישה." },
      { type: "testimonials", title: "המלצות", text: "ביקורות לקוחות מוכנות לעיצוב." },
      { type: "faq", title: "שאלות נפוצות", text: "אזור שאלות שמוריד התנגדויות." },
      { type: "contact", title: "יצירת קשר", text: "טופס ליד, וואטסאפ, טלפון ומפה." },
    ],
  },
  {
    id: "interior-design-studio",
    name: "Interior Design Studio",
    category: "Design",
    description: "אתר למעצבי פנים, סטודיו, פרויקטים ופגישת ייעוץ.",
    niche: "עיצוב",
    heroTitle: "Interior Design Studio שמוכן לעבודה",
    heroSubtitle: "אתר למעצבי פנים, סטודיו, פרויקטים ופגישת ייעוץ.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
    layout: "interior",
    palette: { primary: "#44403C", accent: "#D6B16A", background: "#FAF7F0", surface: "#ffffff", text: "#0f172a", muted: "#64748b" },
    blocks: [
      { type: "header", title: "ניווט עליון", text: "לוגו, תפריט, כפתור פעולה ודף הבית." },
      { type: "hero", title: "פתיח ראשי", text: "כותרת חזקה, תמונת דמו וכפתורי פעולה." },
      { type: "services", title: "שירותים", text: "3-6 שירותים מוכנים לעריכה עם מחירים ותיאור." },
      { type: "about", title: "אודות העסק", text: "אזור אמון עם ניסיון, יתרונות וסיפור העסק." },
      { type: "gallery", title: "גלריה", text: "תמונות דמו מוכנות להחלפה מהמדיה." },
      { type: "booking", title: "יומן תורים", text: "בלוק מחובר לשרת לזמינות, תאריכים ושעות פנויות." },
      { type: "store", title: "חנות / מוצרים", text: "מוצרים דינמיים מהשרת עם מחיר, מבצע וכפתור רכישה." },
      { type: "testimonials", title: "המלצות", text: "ביקורות לקוחות מוכנות לעיצוב." },
      { type: "faq", title: "שאלות נפוצות", text: "אזור שאלות שמוריד התנגדויות." },
      { type: "contact", title: "יצירת קשר", text: "טופס ליד, וואטסאפ, טלפון ומפה." },
    ],
  },
  {
    id: "architect-minimal",
    name: "Architect Minimal",
    category: "Architecture",
    description: "אתר נקי לאדריכלים, פרויקטים, תהליך עבודה וצור קשר.",
    niche: "אדריכלות",
    heroTitle: "Architect Minimal שמוכן לעבודה",
    heroSubtitle: "אתר נקי לאדריכלים, פרויקטים, תהליך עבודה וצור קשר.",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=80",
    layout: "minimal",
    palette: { primary: "#111827", accent: "#94A3B8", background: "#F8FAFC", surface: "#ffffff", text: "#0f172a", muted: "#64748b" },
    blocks: [
      { type: "header", title: "ניווט עליון", text: "לוגו, תפריט, כפתור פעולה ודף הבית." },
      { type: "hero", title: "פתיח ראשי", text: "כותרת חזקה, תמונת דמו וכפתורי פעולה." },
      { type: "services", title: "שירותים", text: "3-6 שירותים מוכנים לעריכה עם מחירים ותיאור." },
      { type: "about", title: "אודות העסק", text: "אזור אמון עם ניסיון, יתרונות וסיפור העסק." },
      { type: "gallery", title: "גלריה", text: "תמונות דמו מוכנות להחלפה מהמדיה." },
      { type: "booking", title: "יומן תורים", text: "בלוק מחובר לשרת לזמינות, תאריכים ושעות פנויות." },
      { type: "store", title: "חנות / מוצרים", text: "מוצרים דינמיים מהשרת עם מחיר, מבצע וכפתור רכישה." },
      { type: "testimonials", title: "המלצות", text: "ביקורות לקוחות מוכנות לעיצוב." },
      { type: "faq", title: "שאלות נפוצות", text: "אזור שאלות שמוריד התנגדויות." },
      { type: "contact", title: "יצירת קשר", text: "טופס ליד, וואטסאפ, טלפון ומפה." },
    ],
  },
  {
    id: "cleaning-company-blue",
    name: "Cleaning Company Blue",
    category: "Services",
    description: "אתר לחברת ניקיון עם שירותים, אזורי פעילות וטופס הצעת מחיר.",
    niche: "ניקיון",
    heroTitle: "Cleaning Company Blue שמוכן לעבודה",
    heroSubtitle: "אתר לחברת ניקיון עם שירותים, אזורי פעילות וטופס הצעת מחיר.",
    image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=1200&q=80",
    layout: "cleaning",
    palette: { primary: "#075985", accent: "#38BDF8", background: "#F0F9FF", surface: "#ffffff", text: "#0f172a", muted: "#64748b" },
    blocks: [
      { type: "header", title: "ניווט עליון", text: "לוגו, תפריט, כפתור פעולה ודף הבית." },
      { type: "hero", title: "פתיח ראשי", text: "כותרת חזקה, תמונת דמו וכפתורי פעולה." },
      { type: "services", title: "שירותים", text: "3-6 שירותים מוכנים לעריכה עם מחירים ותיאור." },
      { type: "about", title: "אודות העסק", text: "אזור אמון עם ניסיון, יתרונות וסיפור העסק." },
      { type: "gallery", title: "גלריה", text: "תמונות דמו מוכנות להחלפה מהמדיה." },
      { type: "booking", title: "יומן תורים", text: "בלוק מחובר לשרת לזמינות, תאריכים ושעות פנויות." },
      { type: "store", title: "חנות / מוצרים", text: "מוצרים דינמיים מהשרת עם מחיר, מבצע וכפתור רכישה." },
      { type: "testimonials", title: "המלצות", text: "ביקורות לקוחות מוכנות לעיצוב." },
      { type: "faq", title: "שאלות נפוצות", text: "אזור שאלות שמוריד התנגדויות." },
      { type: "contact", title: "יצירת קשר", text: "טופס ליד, וואטסאפ, טלפון ומפה." },
    ],
  },
  {
    id: "therapy-nlp-warm",
    name: "Therapy NLP Warm",
    category: "Wellness",
    description: "אתר למטפלים רגשיים, NLP, אימון אישי ויומן פגישות.",
    niche: "טיפול",
    heroTitle: "Therapy NLP Warm שמוכן לעבודה",
    heroSubtitle: "אתר למטפלים רגשיים, NLP, אימון אישי ויומן פגישות.",
    image: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&w=1200&q=80",
    layout: "therapy",
    palette: { primary: "#7C2D12", accent: "#FDBA74", background: "#FFF7ED", surface: "#ffffff", text: "#0f172a", muted: "#64748b" },
    blocks: [
      { type: "header", title: "ניווט עליון", text: "לוגו, תפריט, כפתור פעולה ודף הבית." },
      { type: "hero", title: "פתיח ראשי", text: "כותרת חזקה, תמונת דמו וכפתורי פעולה." },
      { type: "services", title: "שירותים", text: "3-6 שירותים מוכנים לעריכה עם מחירים ותיאור." },
      { type: "about", title: "אודות העסק", text: "אזור אמון עם ניסיון, יתרונות וסיפור העסק." },
      { type: "gallery", title: "גלריה", text: "תמונות דמו מוכנות להחלפה מהמדיה." },
      { type: "booking", title: "יומן תורים", text: "בלוק מחובר לשרת לזמינות, תאריכים ושעות פנויות." },
      { type: "store", title: "חנות / מוצרים", text: "מוצרים דינמיים מהשרת עם מחיר, מבצע וכפתור רכישה." },
      { type: "testimonials", title: "המלצות", text: "ביקורות לקוחות מוכנות לעיצוב." },
      { type: "faq", title: "שאלות נפוצות", text: "אזור שאלות שמוריד התנגדויות." },
      { type: "contact", title: "יצירת קשר", text: "טופס ליד, וואטסאפ, טלפון ומפה." },
    ],
  },
  {
    id: "music-teacher-creative",
    name: "Music Teacher Creative",
    category: "Education",
    description: "אתר למורה למוזיקה, שיעורים, וידאו, המלצות והרשמה.",
    niche: "מוזיקה",
    heroTitle: "Music Teacher Creative שמוכן לעבודה",
    heroSubtitle: "אתר למורה למוזיקה, שיעורים, וידאו, המלצות והרשמה.",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80",
    layout: "music",
    palette: { primary: "#312E81", accent: "#F43F5E", background: "#EEF2FF", surface: "#ffffff", text: "#0f172a", muted: "#64748b" },
    blocks: [
      { type: "header", title: "ניווט עליון", text: "לוגו, תפריט, כפתור פעולה ודף הבית." },
      { type: "hero", title: "פתיח ראשי", text: "כותרת חזקה, תמונת דמו וכפתורי פעולה." },
      { type: "services", title: "שירותים", text: "3-6 שירותים מוכנים לעריכה עם מחירים ותיאור." },
      { type: "about", title: "אודות העסק", text: "אזור אמון עם ניסיון, יתרונות וסיפור העסק." },
      { type: "gallery", title: "גלריה", text: "תמונות דמו מוכנות להחלפה מהמדיה." },
      { type: "booking", title: "יומן תורים", text: "בלוק מחובר לשרת לזמינות, תאריכים ושעות פנויות." },
      { type: "store", title: "חנות / מוצרים", text: "מוצרים דינמיים מהשרת עם מחיר, מבצע וכפתור רכישה." },
      { type: "testimonials", title: "המלצות", text: "ביקורות לקוחות מוכנות לעיצוב." },
      { type: "faq", title: "שאלות נפוצות", text: "אזור שאלות שמוריד התנגדויות." },
      { type: "contact", title: "יצירת קשר", text: "טופס ליד, וואטסאפ, טלפון ומפה." },
    ],
  },
  {
    id: "catering-chef-premium",
    name: "Catering Chef Premium",
    category: "Food",
    description: "אתר לקייטרינג, שף פרטי, תפריטים, גלריה והזמנות.",
    niche: "אוכל",
    heroTitle: "Catering Chef Premium שמוכן לעבודה",
    heroSubtitle: "אתר לקייטרינג, שף פרטי, תפריטים, גלריה והזמנות.",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80",
    layout: "chef",
    palette: { primary: "#713F12", accent: "#EAB308", background: "#FEFCE8", surface: "#ffffff", text: "#0f172a", muted: "#64748b" },
    blocks: [
      { type: "header", title: "ניווט עליון", text: "לוגו, תפריט, כפתור פעולה ודף הבית." },
      { type: "hero", title: "פתיח ראשי", text: "כותרת חזקה, תמונת דמו וכפתורי פעולה." },
      { type: "services", title: "שירותים", text: "3-6 שירותים מוכנים לעריכה עם מחירים ותיאור." },
      { type: "about", title: "אודות העסק", text: "אזור אמון עם ניסיון, יתרונות וסיפור העסק." },
      { type: "gallery", title: "גלריה", text: "תמונות דמו מוכנות להחלפה מהמדיה." },
      { type: "booking", title: "יומן תורים", text: "בלוק מחובר לשרת לזמינות, תאריכים ושעות פנויות." },
      { type: "store", title: "חנות / מוצרים", text: "מוצרים דינמיים מהשרת עם מחיר, מבצע וכפתור רכישה." },
      { type: "testimonials", title: "המלצות", text: "ביקורות לקוחות מוכנות לעיצוב." },
      { type: "faq", title: "שאלות נפוצות", text: "אזור שאלות שמוריד התנגדויות." },
      { type: "contact", title: "יצירת קשר", text: "טופס ליד, וואטסאפ, טלפון ומפה." },
    ],
  },
  {
    id: "tech-repair-lab",
    name: "Tech Repair Lab",
    category: "Tech",
    description: "אתר לטכנאי מחשבים, מובייל, מעבדת תיקונים ושירות עד הבית.",
    niche: "טכנולוגיה",
    heroTitle: "Tech Repair Lab שמוכן לעבודה",
    heroSubtitle: "אתר לטכנאי מחשבים, מובייל, מעבדת תיקונים ושירות עד הבית.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    layout: "tech",
    palette: { primary: "#1E3A8A", accent: "#22D3EE", background: "#EFF6FF", surface: "#ffffff", text: "#0f172a", muted: "#64748b" },
    blocks: [
      { type: "header", title: "ניווט עליון", text: "לוגו, תפריט, כפתור פעולה ודף הבית." },
      { type: "hero", title: "פתיח ראשי", text: "כותרת חזקה, תמונת דמו וכפתורי פעולה." },
      { type: "services", title: "שירותים", text: "3-6 שירותים מוכנים לעריכה עם מחירים ותיאור." },
      { type: "about", title: "אודות העסק", text: "אזור אמון עם ניסיון, יתרונות וסיפור העסק." },
      { type: "gallery", title: "גלריה", text: "תמונות דמו מוכנות להחלפה מהמדיה." },
      { type: "booking", title: "יומן תורים", text: "בלוק מחובר לשרת לזמינות, תאריכים ושעות פנויות." },
      { type: "store", title: "חנות / מוצרים", text: "מוצרים דינמיים מהשרת עם מחיר, מבצע וכפתור רכישה." },
      { type: "testimonials", title: "המלצות", text: "ביקורות לקוחות מוכנות לעיצוב." },
      { type: "faq", title: "שאלות נפוצות", text: "אזור שאלות שמוריד התנגדויות." },
      { type: "contact", title: "יצירת קשר", text: "טופס ליד, וואטסאפ, טלפון ומפה." },
    ],
  },
  {
    id: "wedding-makeup-artist",
    name: "Wedding Makeup Artist",
    category: "Beauty",
    description: "אתר לאיפור כלות, שיער, גלריה, חבילות ותיאום ניסיון.",
    niche: "יופי",
    heroTitle: "Wedding Makeup Artist שמוכן לעבודה",
    heroSubtitle: "אתר לאיפור כלות, שיער, גלריה, חבילות ותיאום ניסיון.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    layout: "wedding",
    palette: { primary: "#BE185D", accent: "#FDE68A", background: "#FFF1F2", surface: "#ffffff", text: "#0f172a", muted: "#64748b" },
    blocks: [
      { type: "header", title: "ניווט עליון", text: "לוגו, תפריט, כפתור פעולה ודף הבית." },
      { type: "hero", title: "פתיח ראשי", text: "כותרת חזקה, תמונת דמו וכפתורי פעולה." },
      { type: "services", title: "שירותים", text: "3-6 שירותים מוכנים לעריכה עם מחירים ותיאור." },
      { type: "about", title: "אודות העסק", text: "אזור אמון עם ניסיון, יתרונות וסיפור העסק." },
      { type: "gallery", title: "גלריה", text: "תמונות דמו מוכנות להחלפה מהמדיה." },
      { type: "booking", title: "יומן תורים", text: "בלוק מחובר לשרת לזמינות, תאריכים ושעות פנויות." },
      { type: "store", title: "חנות / מוצרים", text: "מוצרים דינמיים מהשרת עם מחיר, מבצע וכפתור רכישה." },
      { type: "testimonials", title: "המלצות", text: "ביקורות לקוחות מוכנות לעיצוב." },
      { type: "faq", title: "שאלות נפוצות", text: "אזור שאלות שמוריד התנגדויות." },
      { type: "contact", title: "יצירת קשר", text: "טופס ליד, וואטסאפ, טלפון ומפה." },
    ],
  },
  {
    id: "landing-leads-fast",
    name: "Landing Leads Fast",
    category: "Landing",
    description: "דף נחיתה מהיר למבצע, שירות, קמפיין וטופס לידים.",
    niche: "לידים",
    heroTitle: "Landing Leads Fast שמוכן לעבודה",
    heroSubtitle: "דף נחיתה מהיר למבצע, שירות, קמפיין וטופס לידים.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    layout: "landing",
    palette: { primary: "#4C1D95", accent: "#22C55E", background: "#F5F3FF", surface: "#ffffff", text: "#0f172a", muted: "#64748b" },
    blocks: [
      { type: "header", title: "ניווט עליון", text: "לוגו, תפריט, כפתור פעולה ודף הבית." },
      { type: "hero", title: "פתיח ראשי", text: "כותרת חזקה, תמונת דמו וכפתורי פעולה." },
      { type: "services", title: "שירותים", text: "3-6 שירותים מוכנים לעריכה עם מחירים ותיאור." },
      { type: "about", title: "אודות העסק", text: "אזור אמון עם ניסיון, יתרונות וסיפור העסק." },
      { type: "gallery", title: "גלריה", text: "תמונות דמו מוכנות להחלפה מהמדיה." },
      { type: "booking", title: "יומן תורים", text: "בלוק מחובר לשרת לזמינות, תאריכים ושעות פנויות." },
      { type: "store", title: "חנות / מוצרים", text: "מוצרים דינמיים מהשרת עם מחיר, מבצע וכפתור רכישה." },
      { type: "testimonials", title: "המלצות", text: "ביקורות לקוחות מוכנות לעיצוב." },
      { type: "faq", title: "שאלות נפוצות", text: "אזור שאלות שמוריד התנגדויות." },
      { type: "contact", title: "יצירת קשר", text: "טופס ליד, וואטסאפ, טלפון ומפה." },
    ],
  }
];

const readyWebsiteTemplates: ReadyWebsiteTemplate[] = READY_WEBSITE_TEMPLATE_SEEDS.map(
  (template) => ({
    ...template,
    preview: template.image,
    html: buildReadyWebsiteHtml(template),
  })
);

function buildReadyWebsiteHtml(template: ReadyWebsiteTemplateSeed) {
  const p = template.palette;
  const daysHtml = Array.from({ length: 35 }, (_, index) => {
    const active = [8, 12, 16, 21, 25].includes(index) ? " on" : "";
    return `<button class="day${active}">${(index % 30) + 1}</button>`;
  }).join("");
  const blockLabels = template.blocks.map((block) => block.title).join(" • ");

  return `
<section class="biz-ready-site" data-bizuply-ready-template="${template.id}" dir="rtl" style="--site-primary:${p.primary};--site-accent:${p.accent};--site-bg:${p.background};--site-surface:${p.surface};--site-text:${p.text};--site-muted:${p.muted};font-family:Heebo,Arial,sans-serif;background:${p.background};color:${p.text};overflow:hidden;border-radius:34px;">
  <style>
    .biz-ready-site * { box-sizing:border-box; }
    .biz-ready-site .wrap { width:min(1120px,calc(100% - 42px)); margin:0 auto; }
    .biz-ready-site .top { display:flex;align-items:center;justify-content:space-between;gap:18px;padding:22px 0; }
    .biz-ready-site .brand { font-size:22px;font-weight:1000;color:var(--site-primary);letter-spacing:-.04em; }
    .biz-ready-site .menu { display:flex;gap:10px;flex-wrap:wrap; }
    .biz-ready-site .menu span { padding:10px 14px;border-radius:999px;background:rgba(255,255,255,.75);border:1px solid rgba(15,23,42,.08);font-size:13px;font-weight:900;color:var(--site-muted); }
    .biz-ready-site .btn { display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 20px;border-radius:999px;background:var(--site-primary);color:#fff;font-weight:1000;text-decoration:none;border:0;box-shadow:0 14px 34px rgba(15,23,42,.14); }
    .biz-ready-site .btn.light { background:#fff;color:var(--site-primary);border:1px solid rgba(15,23,42,.09);box-shadow:none; }
    .biz-ready-site .hero { display:grid;grid-template-columns:1fr 1fr;gap:34px;align-items:center;padding:42px 0 54px; }
    .biz-ready-site .hero h1 { margin:0;font-size:clamp(42px,6vw,82px);line-height:.92;font-weight:1000;letter-spacing:-.07em;color:var(--site-primary); }
    .biz-ready-site .hero p { margin:24px 0 0;font-size:21px;line-height:1.75;font-weight:850;color:var(--site-text); }
    .biz-ready-site .hero-actions { display:flex;gap:12px;flex-wrap:wrap;margin-top:26px; }
    .biz-ready-site .hero-img { min-height:470px;border-radius:36px;background-image:linear-gradient(180deg,rgba(0,0,0,.04),rgba(0,0,0,.18)),url('${template.image}');background-size:cover;background-position:center;box-shadow:0 32px 80px rgba(15,23,42,.16);position:relative;overflow:hidden; }
    .biz-ready-site .hero-img:after { content:'תמונה להחלפה';position:absolute;left:18px;top:18px;background:#fff;color:var(--site-primary);padding:9px 13px;border-radius:999px;font-weight:1000;font-size:12px; }
    .biz-ready-site .kpis { display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:-24px auto 44px; }
    .biz-ready-site .kpi { background:#fff;border:1px solid rgba(15,23,42,.08);border-radius:26px;padding:22px;box-shadow:0 18px 44px rgba(15,23,42,.06); }
    .biz-ready-site .kpi strong { display:block;font-size:30px;color:var(--site-primary); }
    .biz-ready-site .kpi span { font-size:13px;font-weight:900;color:var(--site-muted); }
    .biz-ready-site .section { padding:54px 0; }
    .biz-ready-site .section-head { display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:24px; }
    .biz-ready-site .eyebrow { color:var(--site-accent);font-weight:1000;font-size:14px; }
    .biz-ready-site h2 { margin:8px 0 0;font-size:clamp(30px,4vw,52px);line-height:1;font-weight:1000;letter-spacing:-.05em;color:var(--site-primary); }
    .biz-ready-site .grid3 { display:grid;grid-template-columns:repeat(3,1fr);gap:18px; }
    .biz-ready-site .card { background:#fff;border:1px solid rgba(15,23,42,.08);border-radius:30px;padding:26px;box-shadow:0 18px 46px rgba(15,23,42,.06); }
    .biz-ready-site .card h3 { margin:0;font-size:22px;font-weight:1000;color:var(--site-primary); }
    .biz-ready-site .card p { margin:12px 0 0;font-size:15px;line-height:1.75;font-weight:800;color:var(--site-muted); }
    .biz-ready-site .price { margin-top:18px;font-size:20px;font-weight:1000;color:var(--site-accent); }
    .biz-ready-site .about { display:grid;grid-template-columns:.9fr 1.1fr;gap:24px;align-items:center; }
    .biz-ready-site .about-box { background:var(--site-primary);color:#fff;border-radius:36px;padding:34px; }
    .biz-ready-site .about-box h2 { color:#fff; }
    .biz-ready-site .about-box p { font-size:17px;line-height:1.9;font-weight:800;color:rgba(255,255,255,.8); }
    .biz-ready-site .checklist { display:grid;gap:12px; }
    .biz-ready-site .check { background:#fff;border-radius:22px;padding:18px 20px;font-weight:1000;color:var(--site-primary);border:1px solid rgba(15,23,42,.08); }
    .biz-ready-site .gallery { display:grid;grid-template-columns:1.2fr .8fr .8fr;grid-auto-rows:190px;gap:16px; }
    .biz-ready-site .photo { border-radius:30px;background-image:url('${template.image}');background-size:cover;background-position:center;box-shadow:0 18px 50px rgba(15,23,42,.12); }
    .biz-ready-site .photo.big { grid-row:span 2; }
    .biz-ready-site .booking-widget { background:#fff;border:1px solid rgba(15,23,42,.08);border-radius:34px;padding:26px;box-shadow:0 22px 60px rgba(15,23,42,.08); }
    .biz-ready-site .calendar { display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:18px; }
    .biz-ready-site .month { border-radius:26px;background:linear-gradient(180deg,#fff,var(--site-bg));border:1px solid rgba(15,23,42,.08);padding:18px; }
    .biz-ready-site .days { display:grid;grid-template-columns:repeat(7,1fr);gap:7px;margin-top:12px; }
    .biz-ready-site .day { aspect-ratio:1;border-radius:14px;background:#fff;border:1px solid rgba(15,23,42,.08);display:grid;place-items:center;font-size:12px;font-weight:1000;color:var(--site-primary); }
    .biz-ready-site .day.on { background:var(--site-primary);color:#fff; }
    .biz-ready-site .times { display:grid;grid-template-columns:repeat(2,1fr);gap:10px;align-content:start; }
    .biz-ready-site .time { min-height:46px;border-radius:16px;background:var(--site-bg);border:1px solid rgba(15,23,42,.08);font-weight:1000;color:var(--site-primary); }
    .biz-ready-site .products { display:grid;grid-template-columns:repeat(4,1fr);gap:16px; }
    .biz-ready-site .product-img { height:150px;border-radius:24px;background-image:url('${template.image}');background-size:cover;background-position:center; }
    .biz-ready-site .quote { font-size:18px;line-height:1.8;font-weight:900;color:var(--site-text); }
    .biz-ready-site .faq-item { background:#fff;border:1px solid rgba(15,23,42,.08);border-radius:22px;padding:18px 20px;margin-bottom:12px;font-weight:1000;color:var(--site-primary); }
    .biz-ready-site .contact { display:grid;grid-template-columns:1fr 1fr;gap:20px; }
    .biz-ready-site input,.biz-ready-site textarea { width:100%;border:1px solid rgba(15,23,42,.1);border-radius:18px;padding:16px 18px;margin-bottom:12px;font-weight:800;outline:none; }
    .biz-ready-site .footer { padding:28px 0;border-top:1px solid rgba(15,23,42,.08);font-weight:900;color:var(--site-muted); }
    @media(max-width:800px){.biz-ready-site .hero,.biz-ready-site .about,.biz-ready-site .calendar,.biz-ready-site .contact{grid-template-columns:1fr;}.biz-ready-site .grid3,.biz-ready-site .products,.biz-ready-site .kpis{grid-template-columns:1fr;}.biz-ready-site .gallery{grid-template-columns:1fr;}}
  </style>

  <div class="wrap top" data-bizuply-block="header">
    <div class="brand">שם העסק שלך</div>
    <div class="menu"><span>בית</span><span>שירותים</span><span>יומן</span><span>חנות</span><span>צור קשר</span></div>
    <a class="btn" href="#booking">קביעת תור</a>
  </div>

  <div class="wrap hero" data-bizuply-block="hero">
    <div><div class="eyebrow">${template.niche} · אתר מוכן לעבודה</div><h1>${template.heroTitle}</h1><p>${template.heroSubtitle}</p><div class="hero-actions"><a class="btn" href="#booking">פתיחת יומן</a><a class="btn light" href="#services">צפייה בשירותים</a></div></div>
    <div class="hero-img" role="img" aria-label="תמונת תבנית"></div>
  </div>

  <div class="wrap kpis" data-bizuply-block="trust"><div class="kpi"><strong>10</strong><span>בלוקים מוכנים בתבנית</span></div><div class="kpi"><strong>Live</strong><span>יומן וזמינות מהשרת</span></div><div class="kpi"><strong>CRM</strong><span>לידים נכנסים למערכת</span></div></div>

  <div id="services" class="wrap section" data-bizuply-block="services" data-source="bizuply-services"><div class="section-head"><div><div class="eyebrow">שירותים</div><h2>שירותים שמוכנים לעריכה</h2></div><a class="btn light" href="#booking">לתיאום</a></div><div class="grid3"><div class="card"><h3>שירות ראשון</h3><p>תיאור שירות קצר, מקצועי וברור ללקוח.</p><div class="price">₪350</div></div><div class="card"><h3>שירות שני</h3><p>אפשר לערוך שם, מחיר, משך ותיאור מתוך המערכת.</p><div class="price">₪550</div></div><div class="card"><h3>שירות שלישי</h3><p>כרטיס שירות מחובר למערכת השירותים של העסק.</p><div class="price">₪750</div></div></div></div>

  <div class="wrap section about" data-bizuply-block="about"><div class="about-box"><div class="eyebrow">אודות</div><h2>עסק שנראה אמין כבר מהשנייה הראשונה</h2><p>אזור אודות מוכן עם טקסט מקצועי, יתרונות, ניסיון וסיבה ברורה למה לבחור דווקא בעסק הזה.</p></div><div class="checklist"><div class="check">✓ עיצוב מקצועי ומוכן לפרסום</div><div class="check">✓ תבנית מלאה עם 10 בלוקים</div><div class="check">✓ כל הטקסטים והתמונות ניתנים להחלפה</div><div class="check">✓ מותאם למובייל ולדסקטופ</div></div></div>

  <div class="wrap section" data-bizuply-block="gallery"><div class="section-head"><div><div class="eyebrow">גלריה</div><h2>תמונות דמו להחלפה</h2></div></div><div class="gallery"><div class="photo big"></div><div class="photo"></div><div class="photo"></div><div class="photo"></div><div class="photo"></div></div></div>

  <div id="booking" class="wrap section" data-bizuply-block="booking" data-bizuply-widget="booking-calendar" data-api="/api/businesses/{{businessId}}/availability" data-services-api="/api/businesses/{{businessId}}/services"><div class="section-head"><div><div class="eyebrow">יומן תורים</div><h2>בחירת תאריך ושעה פנויה</h2></div><span class="btn light">מחובר ליומן בשרת</span></div><div class="booking-widget"><strong>בחרו שירות ואז תאריך</strong><p style="color:var(--site-muted);font-weight:800;line-height:1.8">בפרסום האתר, הרנדרר צריך למשוך שעות פנויות מהשרת לפי businessId, workingHours, services ו-appointments.</p><div class="calendar"><div class="month"><strong>יוני 2026</strong><div class="days">${daysHtml}</div></div><div class="times"><button class="time">09:00</button><button class="time">10:30</button><button class="time">12:00</button><button class="time">14:30</button><button class="time">16:00</button><button class="time">18:00</button><button class="btn">אישור תור</button></div></div></div></div>

  <div class="wrap section" data-bizuply-block="store" data-bizuply-widget="products-grid" data-api="/api/businesses/{{businessId}}/products"><div class="section-head"><div><div class="eyebrow">חנות</div><h2>מוצרים מהחנות</h2></div><a class="btn light" href="#contact">שאלה על מוצר</a></div><div class="products"><div class="card"><div class="product-img"></div><h3>מוצר 1</h3><p>מוצר דמו להחלפה.</p><div class="price">₪99</div></div><div class="card"><div class="product-img"></div><h3>מוצר 2</h3><p>נמשך מהשרת בחנות.</p><div class="price">₪149</div></div><div class="card"><div class="product-img"></div><h3>מוצר 3</h3><p>כולל מחיר ומבצע.</p><div class="price">₪199</div></div><div class="card"><div class="product-img"></div><h3>מוצר 4</h3><p>כפתור רכישה בהמשך.</p><div class="price">₪249</div></div></div></div>

  <div class="wrap section" data-bizuply-block="testimonials"><div class="section-head"><div><div class="eyebrow">המלצות</div><h2>מה לקוחות אומרים</h2></div></div><div class="grid3"><div class="card"><p class="quote">“שירות מקצועי, מהיר ונעים. האתר נראה מעולה.”</p><div class="price">★★★★★</div></div><div class="card"><p class="quote">“קבעתי תור בקלות והכל היה ברור.”</p><div class="price">★★★★★</div></div><div class="card"><p class="quote">“חוויה יוקרתית ומסודרת מההתחלה.”</p><div class="price">★★★★★</div></div></div></div>

  <div class="wrap section" data-bizuply-block="faq"><div class="section-head"><div><div class="eyebrow">שאלות</div><h2>שאלות נפוצות</h2></div></div><div class="faq-item">איך קובעים תור? דרך היומן באתר ובחירת שעה פנויה.</div><div class="faq-item">אפשר להחליף צבעים? כן, דרך פלטות צבע או צבעי מיתוג.</div><div class="faq-item">אפשר לערוך תמונות וטקסטים? כן, כל אזור בתבנית ניתן לעריכה.</div></div>

  <div id="contact" class="wrap section contact" data-bizuply-block="lead-form" data-api="/api/businesses/{{businessId}}/leads"><div><div class="eyebrow">יצירת קשר</div><h2>השאירו פרטים ונחזור אליכם</h2><p style="color:var(--site-muted);font-weight:800;line-height:1.8">טופס ליד מחובר ל-CRM של Bizuply.</p></div><form><input placeholder="שם מלא"/><input placeholder="טלפון"/><textarea placeholder="מה תרצו לדעת?" rows="4"></textarea><button class="btn" type="button">שליחת פנייה</button></form></div>

  <div class="wrap footer" data-bizuply-block="footer">${blockLabels} · כל הזכויות שמורות לעסק שלך</div>
</section>`;
}


export default function StudioSidebar({
  activePanel,
  setActivePanel,
  onAddHtml,
  onApplyTemplate,
  onApplyPalette,
  onOpenMedia,
  pages = [],
  activePageId,
  activePageSections = [],
  onSelectPage,
  onAddPage,
  onUpdatePageTitle,
  onSelectSection,
  onDeleteSection,
  onDuplicateSection,
  onMoveSectionUp,
  onMoveSectionDown,
  onOpenSectionsPanel,
}: Props) {
  const navigate = useNavigate();
  const { user } = useAuth() as {
    user?: { businessId?: string; business?: { _id?: string } } | null;
  };

  const businessId = user?.businessId || user?.business?._id || "";

  const openStoreManagementPage = () => {
    const targetPath = businessId
      ? `/business/${businessId}/store/products`
      : "/store/products";

    navigate(targetPath);
  };

  const [elementCategory, setElementCategory] = useState<ElementCategory>("text");
  const [sectionCategory, setSectionCategory] =
    useState<SectionCategory>("welcome");

  const [search, setSearch] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [newPageTitle, setNewPageTitle] = useState("");
  const [expandedPages, setExpandedPages] = useState<Record<string, boolean>>({});

  const currentPanel: StudioPanel = activePanel || "templates";
  const isPanelOpen = Boolean(activePanel);

  useEffect(() => {
    if (!successMessage) return;

    const timer = window.setTimeout(() => setSuccessMessage(""), 2200);

    return () => window.clearTimeout(timer);
  }, [successMessage]);

  useEffect(() => {
    if (!activePageId) return;

    setExpandedPages((prev) => ({
      ...prev,
      [activePageId]: true,
    }));
  }, [activePageId]);

  const sectionCountByCategory = useMemo(() => {
    return sectionTemplates.reduce<Record<string, number>>((acc, section) => {
      acc[section.category] = (acc[section.category] || 0) + 1;
      return acc;
    }, {});
  }, []);

  const elementCountByCategory = useMemo(() => {
    return studioElements.reduce<Record<string, number>>((acc, element) => {
      acc[element.category] = (acc[element.category] || 0) + 1;
      return acc;
    }, {});
  }, []);

  const smartBlocks = useMemo(() => {
    return smartBlockIds
      .map((id) => studioElements.find((element) => element.id === id))
      .filter(Boolean) as StudioElement[];
  }, []);

  const normalizedSearch = search.trim().toLowerCase();

  const activePage = useMemo(() => {
    return (
      pages.find((page) => page.id === activePageId) ||
      pages.find((page) => page.isHome) ||
      pages[0] ||
      null
    );
  }, [activePageId, pages]);

  const filteredPages = useMemo(() => {
    if (!normalizedSearch) return pages;

    return pages.filter((page) => {
      const haystack = `${page.title} ${page.slug}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [normalizedSearch, pages]);

  const filteredElements = useMemo(() => {
    return studioElements.filter((element) => {
      const matchesCategory = element.category === elementCategory;

      if (!normalizedSearch) return matchesCategory;

      const haystack = `${element.label} ${element.description || ""} ${
        element.category
      }`.toLowerCase();

      return matchesCategory && haystack.includes(normalizedSearch);
    });
  }, [elementCategory, normalizedSearch]);

  const filteredSections = useMemo(() => {
    return sectionTemplates.filter((section) => {
      const matchesCategory = section.category === sectionCategory;

      if (!normalizedSearch) return matchesCategory;

      const haystack = `${section.title} ${section.description} ${
        section.category
      }`.toLowerCase();

      return matchesCategory && haystack.includes(normalizedSearch);
    });
  }, [sectionCategory, normalizedSearch]);

  const filteredPageTemplates = useMemo(() => {
    if (!normalizedSearch) return readyWebsiteTemplates;

    return readyWebsiteTemplates.filter((template) => {
      const haystack = `${template.name} ${template.category} ${template.description} ${template.niche} ${template.blocks.map((block) => block.title).join(" ")}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [normalizedSearch]);

  const storeSectionTemplates = useMemo(() => {
    return sectionTemplates.filter((section) => section.category === "store");
  }, []);

  const clearSearch = () => setSearch("");

  const handlePanelClick = (panel: StudioPanel) => {
    if (activePanel === panel) {
      setActivePanel(null);
      clearSearch();
      return;
    }

    setActivePanel(panel);
    clearSearch();
  };

  const handleAddHtml = (html: string, label = "הסקשן") => {
    onAddHtml(html);
    setSuccessMessage(`${label} נוסף לעמוד הפעיל`);
  };

  const handleApplyTemplate = (template: PageTemplate) => {
    onApplyTemplate(template);
    setSuccessMessage(`התבנית ${template.name} הוחלה על העמוד הפעיל`);
  };

  const handleApplyPalette = (palette: ThemePalette) => {
    onApplyPalette(palette);

    const root = document.documentElement;
    root.style.setProperty("--biz-primary", palette.colors.primary);
    root.style.setProperty("--biz-secondary", palette.colors.secondary);
    root.style.setProperty("--biz-accent", palette.colors.accent);
    root.style.setProperty("--biz-bg", palette.colors.background);
    root.style.setProperty("--biz-text", palette.colors.text);
    root.style.setProperty("--biz-heading-font", palette.font.heading);
    root.style.setProperty("--biz-body-font", palette.font.body);

    setSuccessMessage(`ערכת העיצוב ${palette.name} הוחלה`);
  };

  const handleAddPage = () => {
    const title = newPageTitle.trim();

    if (!title) {
      setSuccessMessage("כתבי שם לעמוד החדש");
      return;
    }

    onAddPage?.(title, "blank");
    setNewPageTitle("");
    setSuccessMessage(`העמוד ${title} נוצר`);
  };

  const togglePage = (pageId: string) => {
    setExpandedPages((prev) => ({
      ...prev,
      [pageId]: !prev[pageId],
    }));
  };

  const openSectionCategory = (kind?: string) => {
    if (kind && sectionCategories.some((category) => category.key === kind)) {
      setSectionCategory(kind as SectionCategory);
    }

    setActivePanel("sections");
    onOpenSectionsPanel?.(kind);
  };

  return (
    <aside
      dir="rtl"
      className="grid min-h-0 overflow-hidden border-l border-slate-200 bg-white shadow-[0_18px_70px_rgba(15,23,42,0.06)] transition-[grid-template-columns] duration-300"
      style={{
        gridTemplateColumns: isPanelOpen
          ? "96px minmax(390px, 430px)"
          : "96px 0px",
      }}
    >
      <nav className="flex min-h-0 flex-col items-center gap-2 overflow-y-auto border-l border-slate-100 bg-white px-3 py-4">
        {navItems.map((item) => {
          const active = isPanelOpen && activePanel === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => handlePanelClick(item.key)}
              title={item.hint}
              className={[
                "group relative flex w-full flex-col items-center justify-center rounded-[1.35rem] px-2 py-3 text-[11px] font-black transition",
                active
                  ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-xl shadow-violet-100"
                  : "text-slate-500 hover:bg-violet-50 hover:text-violet-700",
              ].join(" ")}
            >
              {active && (
                <span className="absolute -left-1 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-violet-700" />
              )}

              <span
                className={[
                  "mb-1 grid h-8 w-8 place-items-center rounded-xl text-lg leading-none transition",
                  active
                    ? "bg-white/18 text-white"
                    : "bg-slate-50 text-slate-500 group-hover:bg-white group-hover:text-violet-700",
                ].join(" ")}
              >
                {item.icon}
              </span>

              <span className="leading-4">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div
        className={[
          "min-h-0 overflow-hidden border-l border-slate-100 bg-white transition-opacity duration-200",
          isPanelOpen ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      >
        <div className="flex h-full min-h-0 flex-col">
          <PanelHeader
            title={panelTitles[currentPanel].title}
            subtitle={panelTitles[currentPanel].subtitle}
            onClose={() => {
              setActivePanel(null);
              clearSearch();
            }}
          />

          {successMessage && (
            <div className="mx-4 mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-black text-emerald-700">
              {successMessage}
            </div>
          )}

          <div className="min-h-0 flex-1 overflow-y-auto bg-white p-4">
            {currentPanel === "templates" && (
              <Panel>
                <SearchBox
                  value={search}
                  onChange={setSearch}
                  placeholder="חיפוש תבנית..."
                />

                <CompactNotice
                  title="30 אתרים מוכנים כמו Wix"
                  text={`כל כרטיס הוא אתר מלא עם 10 בלוקים. לחיצה מחליפה את העמוד: ${activePage?.title || "לא נבחר"}`}
                />

                <div className="grid grid-cols-2 gap-3">
                  {filteredPageTemplates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onClick={() => handleApplyTemplate(template)}
                    />
                  ))}
                </div>

                {filteredPageTemplates.length === 0 && <EmptyState />}
              </Panel>
            )}

            {currentPanel === "add" && (
              <Panel>
                <SearchBox
                  value={search}
                  onChange={setSearch}
                  placeholder="חיפוש אלמנט..."
                />

                <CategoryGrid>
                  {elementCategories.map((category) => (
                    <CategoryButton
                      key={category.key}
                      active={elementCategory === category.key}
                      icon={category.icon}
                      label={category.label}
                      count={elementCountByCategory[category.key] || 0}
                      onClick={() => setElementCategory(category.key)}
                    />
                  ))}
                </CategoryGrid>

                <div className="grid grid-cols-2 gap-3">
                  {filteredElements.map((element) => (
                    <ElementCard
                      key={element.id}
                      element={element}
                      onClick={() => handleAddHtml(element.html, element.label)}
                    />
                  ))}
                </div>

                {filteredElements.length === 0 && <EmptyState />}
              </Panel>
            )}

            {currentPanel === "sections" && (
              <Panel>
                <SearchBox
                  value={search}
                  onChange={setSearch}
                  placeholder="חיפוש סקשן..."
                />

                <CompactNotice
                  title="הוספת סקשן"
                  text={`הסקשן יתווסף לעמוד: ${activePage?.title || "לא נבחר"}`}
                />

                <CategoryGrid>
                  {sectionCategories.map((category) => (
                    <CategoryButton
                      key={category.key}
                      active={sectionCategory === category.key}
                      label={category.label}
                      count={sectionCountByCategory[category.key] || 0}
                      onClick={() => setSectionCategory(category.key)}
                    />
                  ))}
                </CategoryGrid>

                <div className="space-y-3">
                  {filteredSections.map((section) => (
                    <SectionCard
                      key={section.id}
                      section={section}
                      onClick={() => handleAddHtml(section.html, section.title)}
                    />
                  ))}
                </div>

                {filteredSections.length === 0 && <EmptyState />}
              </Panel>
            )}

            {currentPanel === "theme" && (
              <Panel>
                <CompactNotice
                  title="עיצוב כללי"
                  text="בחירת ערכה מעדכנת צבעים ופונטים באתר."
                />

                <div className="space-y-3">
                  {themePalettes.map((palette) => (
                    <PaletteCard
                      key={palette.id}
                      palette={palette}
                      onClick={() => handleApplyPalette(palette)}
                    />
                  ))}
                </div>

                <p className="mb-3 mt-6 text-sm font-black text-slate-900">
                  פונטים
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {fontOptions.map((font) => (
                    <button
                      key={font}
                      type="button"
                      onClick={() =>
                        setSuccessMessage(
                          `הפונט ${font} נבחר דרך ערכת העיצוב.`
                        )
                      }
                      className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-xs font-black text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                      style={{ fontFamily: font }}
                    >
                      {font}
                    </button>
                  ))}
                </div>
              </Panel>
            )}

            {currentPanel === "pages" && (
              <PagesHierarchyPanel
                pages={filteredPages}
                activePageId={activePageId}
                activePageSections={activePageSections}
                expandedPages={expandedPages}
                search={search}
                setSearch={setSearch}
                newPageTitle={newPageTitle}
                setNewPageTitle={setNewPageTitle}
                onAddPage={handleAddPage}
                onTogglePage={togglePage}
                onSelectPage={(pageId) => onSelectPage?.(pageId)}
                onUpdatePageTitle={(pageId, title) =>
                  onUpdatePageTitle?.(pageId, title)
                }
                onAddSection={() => openSectionCategory()}
                onSelectSection={(sectionId) => onSelectSection?.(sectionId)}
                onDeleteSection={(sectionId) => onDeleteSection?.(sectionId)}
                onDuplicateSection={(sectionId) => onDuplicateSection?.(sectionId)}
                onMoveSectionUp={(sectionId) => onMoveSectionUp?.(sectionId)}
                onMoveSectionDown={(sectionId) => onMoveSectionDown?.(sectionId)}
                onOpenSectionVariants={(kind) => openSectionCategory(kind)}
              />
            )}

            {currentPanel === "media" && (
              <Panel>
                <button
                  type="button"
                  onClick={onOpenMedia}
                  className="w-full rounded-2xl bg-gradient-to-l from-violet-700 to-fuchsia-600 px-4 py-4 text-sm font-black text-white shadow-xl shadow-violet-100 transition hover:-translate-y-0.5"
                >
                  פתיחת מנהל מדיה
                </button>

                <div className="mt-4 grid gap-3">
                  <Info title="תמונה רגילה" text="הוספת תמונה לתוך סקשן או אלמנט." />
                  <Info title="רקע לסקשן" text="בחירת תמונה כרקע לסקשן." />
                  <Info title="וידאו" text="אפשר להוסיף דרך אלמנטים / Embed." />
                </div>
              </Panel>
            )}

            {currentPanel === "store" && (
              <Panel>
                <div className="space-y-5">
                  <div className="rounded-[1.6rem] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-5">
                    <p className="text-sm font-black text-violet-900">
                      ניהול חנות בעמוד מלא
                    </p>
                    <p className="mt-2 text-xs font-bold leading-6 text-slate-500">
                      מוצרים, קטגוריות, הגדרות, קופונים והזמנות מנוהלים בעמוד נפרד ונוח.
                      כאן בסטודיו מוסיפים רק תצוגות חנות דינמיות לאתר.
                    </p>

                    <button
                      type="button"
                      onClick={openStoreManagementPage}
                      className="mt-4 w-full rounded-2xl bg-gradient-to-l from-violet-700 to-fuchsia-600 px-4 py-4 text-sm font-black text-white shadow-xl shadow-violet-100 transition hover:-translate-y-0.5"
                    >
                      פתיחת ניהול חנות
                    </button>
                  </div>

                  <div className="grid gap-3">
                    <StoreNavButton
                      title="הוספת מוצרים"
                      text="פותח עמוד מלא להוספת מוצר, תמונות, מחיר, מלאי וקטגוריה."
                      onClick={openStoreManagementPage}
                    />

                    <StoreNavButton
                      title="רשימת מוצרים"
                      text="ניהול גריד המוצרים, עריכה, מחיקה וסינון לפי קטגוריות."
                      onClick={openStoreManagementPage}
                    />

                    <StoreNavButton
                      title="הגדרות חנות"
                      text="מטבע, משלוחים, וואטסאפ, מדיניות החזרות ותשלומים."
                      onClick={openStoreManagementPage}
                    />

                    <StoreNavButton
                      title="קטגוריות מוצרים"
                      text="יצירת קטגוריות ועמודי קטגוריה כמו Shopify."
                      onClick={openStoreManagementPage}
                    />

                    <StoreNavButton
                      title="קופונים והזמנות"
                      text="ניהול מבצעים, קודי קופון והזמנות לקוחות."
                      onClick={openStoreManagementPage}
                    />
                  </div>

                  <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-black text-slate-900">
                      תצוגת חנות באתר
                    </p>
                    <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
                      אחרי שהמוצרים נשמרים בעמוד הניהול, הוסיפי לעמוד סקשן חנות.
                      הסקשן ימשוך אוטומטית את המוצרים מהשרת.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {storeSectionTemplates.map((section) => (
                      <SmartButton
                        key={section.id}
                        title={section.title}
                        text={section.description || "תצוגת חנות דינמית לעמוד הפעיל"}
                        onClick={() => handleAddHtml(section.html, section.title)}
                      />
                    ))}
                  </div>

                  {storeSectionTemplates.length === 0 && (
                    <EmptyState text="לא נמצאו תצוגות חנות. צריך לוודא שיש סקשנים מסוג store בקובץ sectionTemplates.ts." />
                  )}
                </div>
              </Panel>
            )}

            {["bookings", "services", "club", "leads"].includes(
              currentPanel
            ) && (
              <Panel>
                <div className="space-y-3">
                  {smartBlocks.map((block) => (
                    <SmartButton
                      key={block.id}
                      title={block.label}
                      text={block.description || "בלוק חכם שמתחבר למערכת"}
                      onClick={() => handleAddHtml(block.html, block.label)}
                    />
                  ))}
                </div>

                {smartBlocks.length === 0 && (
                  <EmptyState text="לא נמצאו בלוקים חכמים. צריך לעדכן את elementLibrary.ts." />
                )}
              </Panel>
            )}

            {currentPanel === "animations" && (
              <Panel>
                <Info title="Fade Up" text="כניסה מלמטה עם שקיפות." />
                <Info title="Zoom In" text="כניסה עם הגדלה עדינה." />
                <Info title="Slide Right" text="כניסה מצד ימין." />
                <Info title="Blur Reveal" text="חשיפה עם טשטוש יוקרתי." />
              </Panel>
            )}

            {currentPanel === "seo" && (
              <Panel>
                <Info title="כותרת SEO" text="תתחבר לשמירת האתר והפרסום." />
                <Info title="תיאור SEO" text="מופיע בגוגל ובשיתוף קישור." />
                <Info title="Open Graph" text="תמונת שיתוף לפייסבוק ווואטסאפ." />
              </Panel>
            )}

            {currentPanel === "settings" && (
              <Panel>
                <Info title="דומיין" text="hadar-beauty.bizuply.com או דומיין אישי." />
                <Info title="אנליטיקס" text="חיבור Google Analytics / Pixel." />
                <Info title="סטטוס פרסום" text="טיוטה / פורסם / לא פעיל." />
              </Panel>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

function PagesHierarchyPanel({
  pages,
  activePageId,
  activePageSections,
  expandedPages,
  search,
  setSearch,
  newPageTitle,
  setNewPageTitle,
  onAddPage,
  onTogglePage,
  onSelectPage,
  onUpdatePageTitle,
  onAddSection,
  onSelectSection,
  onDeleteSection,
  onDuplicateSection,
  onMoveSectionUp,
  onMoveSectionDown,
  onOpenSectionVariants,
}: {
  pages: StudioSitePage[];
  activePageId?: string;
  activePageSections: StudioPageSection[];
  expandedPages: Record<string, boolean>;
  search: string;
  setSearch: (value: string) => void;
  newPageTitle: string;
  setNewPageTitle: (value: string) => void;
  onAddPage: () => void;
  onTogglePage: (pageId: string) => void;
  onSelectPage: (pageId: string) => void;
  onUpdatePageTitle: (pageId: string, title: string) => void;
  onAddSection: () => void;
  onSelectSection: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onDuplicateSection: (sectionId: string) => void;
  onMoveSectionUp: (sectionId: string) => void;
  onMoveSectionDown: (sectionId: string) => void;
  onOpenSectionVariants: (kind?: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <input
          value={newPageTitle}
          onChange={(event) => setNewPageTitle(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") onAddPage();
          }}
          placeholder="שם עמוד חדש..."
          className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400 focus:border-violet-400"
        />

        <button
          type="button"
          onClick={onAddPage}
          className="h-11 rounded-xl bg-violet-700 px-4 text-xs font-black text-white shadow-lg shadow-violet-100 transition hover:bg-violet-800"
        >
          + עמוד
        </button>
      </div>

      <SearchBox
        value={search}
        onChange={setSearch}
        placeholder="חיפוש עמוד..."
      />

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2">
        <div className="mb-2 flex items-center justify-between px-2 py-1">
          <p className="text-xs font-black text-slate-500">עמודים באתר</p>
          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black text-slate-400">
            {pages.length}
          </span>
        </div>

        <div className="space-y-2">
          {pages.map((page) => {
            const active = page.id === activePageId;
            const expanded = expandedPages[page.id] ?? active;

            return (
              <LightPageRow
                key={page.id}
                page={page}
                active={active}
                expanded={expanded}
                sections={active ? activePageSections : []}
                onToggle={() => onTogglePage(page.id)}
                onSelectPage={() => onSelectPage(page.id)}
                onUpdateTitle={(title) => onUpdatePageTitle(page.id, title)}
                onAddSection={onAddSection}
                onSelectSection={onSelectSection}
                onDeleteSection={onDeleteSection}
                onDuplicateSection={onDuplicateSection}
                onMoveSectionUp={onMoveSectionUp}
                onMoveSectionDown={onMoveSectionDown}
                onOpenSectionVariants={onOpenSectionVariants}
              />
            );
          })}

          {pages.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-5 text-center">
              <p className="text-sm font-black text-slate-700">אין עמודים</p>
              <p className="mt-1 text-xs font-bold text-slate-400">
                צרי עמוד חדש כדי להתחיל.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LightPageRow({
  page,
  active,
  expanded,
  sections,
  onToggle,
  onSelectPage,
  onUpdateTitle,
  onAddSection,
  onSelectSection,
  onDeleteSection,
  onDuplicateSection,
  onMoveSectionUp,
  onMoveSectionDown,
  onOpenSectionVariants,
}: {
  page: StudioSitePage;
  active: boolean;
  expanded: boolean;
  sections: StudioPageSection[];
  onToggle: () => void;
  onSelectPage: () => void;
  onUpdateTitle: (title: string) => void;
  onAddSection: () => void;
  onSelectSection: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onDuplicateSection: (sectionId: string) => void;
  onMoveSectionUp: (sectionId: string) => void;
  onMoveSectionDown: (sectionId: string) => void;
  onOpenSectionVariants: (kind?: string) => void;
}) {
  const [editingTitle, setEditingTitle] = useState(page.title);

  useEffect(() => {
    setEditingTitle(page.title);
  }, [page.title]);

  return (
    <div
      className={[
        "overflow-hidden rounded-xl border bg-white transition",
        active
          ? "border-violet-300 shadow-sm ring-2 ring-violet-50"
          : "border-slate-200 hover:border-violet-200",
      ].join(" ")}
    >
      <div className="grid min-h-[54px] grid-cols-[34px_1fr_auto] items-center gap-2 px-2">
        <button
          type="button"
          onClick={onToggle}
          className="grid h-8 w-8 place-items-center rounded-lg text-sm font-black text-slate-400 transition hover:bg-violet-50 hover:text-violet-700"
        >
          {expanded ? "⌄" : "›"}
        </button>

        <div className="grid min-w-0 grid-cols-[24px_1fr] items-center gap-2">
          <button
            type="button"
            onClick={onSelectPage}
            className={[
              "grid h-7 w-7 place-items-center rounded-lg text-xs transition",
              active ? "bg-violet-100 text-violet-700" : "text-slate-400 hover:bg-slate-100",
            ].join(" ")}
            title={page.isHome ? "דף הבית" : "פתח עמוד"}
          >
            {page.isHome ? "⌂" : "▦"}
          </button>

          <input
            value={editingTitle}
            onChange={(event) => setEditingTitle(event.target.value)}
            onBlur={() => onUpdateTitle(editingTitle.trim() || page.title)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onUpdateTitle(editingTitle.trim() || page.title);
                event.currentTarget.blur();
              }
            }}
            className="h-9 min-w-0 rounded-lg border border-transparent bg-transparent px-2 text-right text-sm font-black text-slate-900 outline-none transition hover:border-slate-200 hover:bg-slate-50 focus:border-violet-400 focus:bg-white"
          />
        </div>

        <div className="flex items-center">
          <LightToolButton title="פתח עמוד" onClick={onSelectPage}>
            {active ? "פתוח" : "פתח"}
          </LightToolButton>

          <LightIconButton title="עיצוב" onClick={onSelectPage}>
            🎨
          </LightIconButton>

          <LightIconButton title="הגדרות" onClick={onSelectPage}>
            ⚙
          </LightIconButton>

          <LightIconButton title="גרירה">
            ⠿
          </LightIconButton>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50 px-3 py-3">
          {active ? (
            <>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-black text-slate-500">
                  סקשנים בעמוד
                </span>

                <button
                  type="button"
                  onClick={onAddSection}
                  className="h-8 rounded-lg bg-violet-700 px-3 text-[11px] font-black text-white transition hover:bg-violet-800"
                >
                  + סקשן
                </button>
              </div>

              <div className="relative pr-4">
                <div className="absolute right-[7px] top-1 h-[calc(100%-8px)] w-px bg-slate-200" />

                <div className="space-y-2">
                  {sections.map((section, index) => (
                    <LightSectionRow
                      key={section.id}
                      section={section}
                      index={index + 1}
                      onSelect={() => onSelectSection(section.id)}
                      onDelete={() => onDeleteSection(section.id)}
                      onDuplicate={() => onDuplicateSection(section.id)}
                      onMoveUp={() => onMoveSectionUp(section.id)}
                      onMoveDown={() => onMoveSectionDown(section.id)}
                      onOpenVariants={() => onOpenSectionVariants(section.kind)}
                    />
                  ))}

                  {sections.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-center">
                      <p className="text-xs font-bold text-slate-500">
                        אין סקשנים בעמוד הזה.
                      </p>
                      <button
                        type="button"
                        onClick={onAddSection}
                        className="mt-3 rounded-lg bg-violet-700 px-4 py-2 text-xs font-black text-white"
                      >
                        הוסף סקשן ראשון
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={onSelectPage}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-black text-slate-500 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
            >
              פתחי את העמוד כדי לראות את הסקשנים שלו
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function LightSectionRow({
  section,
  index,
  onSelect,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onOpenVariants,
}: {
  section: StudioPageSection;
  index: number;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onOpenVariants: () => void;
}) {
  const kindLabel = sectionKindLabels[section.kind] || section.kind || "סקשן";

  return (
    <div className="relative pr-4">
      <span className="absolute right-[-8px] top-5 h-px w-4 bg-slate-200" />
      <span className="absolute right-[-15px] top-[13px] grid h-6 w-6 place-items-center rounded-full border border-slate-200 bg-white text-[10px] font-black text-slate-400">
        {index}
      </span>

      <div className="grid min-h-[46px] grid-cols-[1fr_auto] items-center gap-2 rounded-lg border border-slate-200 bg-white px-2">
        <button type="button" onClick={onSelect} className="min-w-0 text-right">
          <p className="truncate text-xs font-black text-slate-900">
            {section.title}
          </p>
          <p className="mt-0.5 text-[10px] font-bold text-slate-400">
            {kindLabel}
          </p>
        </button>

        <div className="flex items-center">
          <LightToolButton title="בחר" onClick={onSelect}>
            עריכה
          </LightToolButton>
          <LightIconButton title="מבנה" onClick={onOpenVariants}>
            🎨
          </LightIconButton>
          <LightIconButton title="שכפל" onClick={onDuplicate}>
            ⧉
          </LightIconButton>
          <LightIconButton title="למעלה" onClick={onMoveUp}>
            ↑
          </LightIconButton>
          <LightIconButton title="למטה" onClick={onMoveDown}>
            ↓
          </LightIconButton>
          <LightIconButton title="מחק" onClick={onDelete}>
            🗑
          </LightIconButton>
        </div>
      </div>
    </div>
  );
}

function LightToolButton({
  title,
  children,
  onClick,
}: {
  title: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="h-8 rounded-r-lg border border-slate-200 bg-white px-3 text-xs font-black text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
    >
      {children}
    </button>
  );
}

function LightIconButton({
  title,
  children,
  onClick,
}: {
  title: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="-mr-px grid h-8 w-9 place-items-center border border-slate-200 bg-white text-xs font-black text-slate-500 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
    >
      {children}
    </button>
  );
}

function CompactNotice({ title, text }: { title: string; text: string }) {
  return (
    <div className="mb-4 rounded-[1.2rem] border border-violet-100 bg-violet-50 px-4 py-3">
      <p className="text-sm font-black text-violet-800">{title}</p>
      <p className="mt-1 text-xs font-bold leading-5 text-violet-600">{text}</p>
    </div>
  );
}

function PanelHeader({
  title,
  subtitle,
  onClose,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
}) {
  return (
    <div className="border-b border-slate-200 bg-white px-5 py-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-950">
            {title}
          </h2>
          <p className="mt-1 text-sm font-bold leading-6 text-slate-400">
            {subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-white text-lg font-black text-slate-400 shadow-sm transition hover:bg-slate-950 hover:text-white"
          title="סגירת פאנל"
        >
          ×
        </button>
      </div>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return <section>{children}</section>;
}

function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2 rounded-[1.2rem] border border-slate-200 bg-white px-3 py-2 shadow-sm">
      <span className="text-sm text-slate-400">⌕</span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent py-2 text-sm font-bold text-slate-700 outline-none placeholder:text-slate-400"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="rounded-full bg-slate-100 px-2 py-1 text-xs font-black text-slate-400 hover:text-rose-500"
        >
          ×
        </button>
      )}
    </div>
  );
}

function CategoryGrid({ children }: { children: React.ReactNode }) {
  return <div className="mb-5 grid grid-cols-2 gap-2">{children}</div>;
}

function CategoryButton({
  active,
  icon,
  label,
  count,
  onClick,
}: {
  active: boolean;
  icon?: string;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-[1.15rem] px-3 py-3 text-right text-xs font-black transition",
        active
          ? "bg-violet-700 text-white shadow-xl shadow-violet-100"
          : "border border-slate-200 bg-white text-slate-600 hover:bg-violet-50 hover:text-violet-700",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-2">
        <span>
          {icon && <span className="ml-2">{icon}</span>}
          {label}
        </span>

        <span
          className={[
            "rounded-full px-2 py-0.5 text-[10px] font-black",
            active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400",
          ].join(" ")}
        >
          {count}
        </span>
      </div>
    </button>
  );
}

function TemplateCard({
  template,
  onClick,
}: {
  template: PageTemplate;
  onClick: () => void;
}) {
  const readyTemplate = template as ReadyWebsiteTemplate;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white text-right shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-2xl"
    >
      <MiniWebsitePreview template={readyTemplate} />

      <div className="p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="rounded-full bg-violet-50 px-3 py-1 text-[10px] font-black text-violet-700">
            {readyTemplate.category}
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black text-emerald-700">
            10 בלוקים
          </span>
        </div>

        <p className="truncate text-sm font-black text-slate-950">
          {readyTemplate.name}
        </p>
        <p className="mt-1 line-clamp-2 text-[11px] font-bold leading-5 text-slate-500">
          {readyTemplate.description}
        </p>

        <div className="mt-3 grid grid-cols-5 gap-1.5">
          {readyTemplate.blocks.slice(0, 10).map((block) => (
            <span
              key={`${readyTemplate.id}-${block.type}`}
              className="h-1.5 rounded-full"
              style={{ backgroundColor: readyTemplate.palette.accent }}
              title={block.title}
            />
          ))}
        </div>
      </div>
    </button>
  );
}

function MiniWebsitePreview({ template }: { template: ReadyWebsiteTemplate }) {
  const p = template.palette;

  return (
    <div
      className="relative h-56 overflow-hidden border-b border-slate-100 bg-white"
      style={{ background: p.background }}
    >
      <div className="absolute inset-0 scale-[0.36] origin-top-right" dir="rtl">
        <div
          className="w-[720px] overflow-hidden rounded-[34px] border border-white/70 bg-white shadow-2xl"
          style={{ background: p.background, color: p.text }}
        >
          <div className="flex items-center justify-between px-8 py-5">
            <div className="text-[26px] font-black tracking-tight" style={{ color: p.primary }}>
              שם העסק שלך
            </div>
            <div className="flex gap-2">
              {['בית', 'שירותים', 'יומן', 'חנות', 'קשר'].map((item) => (
                <span key={item} className="rounded-full bg-white px-4 py-2 text-[13px] font-black text-slate-500">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-7 px-8 pb-8">
            <div>
              <div className="mb-3 text-[15px] font-black" style={{ color: p.accent }}>
                {template.niche} · אתר מוכן
              </div>
              <h3 className="m-0 text-[54px] font-black leading-[0.9] tracking-[-0.07em]" style={{ color: p.primary }}>
                {template.heroTitle}
              </h3>
              <p className="mt-5 text-[18px] font-extrabold leading-8 text-slate-600">
                {template.heroSubtitle}
              </p>
              <div className="mt-5 flex gap-3">
                <span className="rounded-full px-7 py-4 text-[15px] font-black text-white" style={{ background: p.primary }}>
                  פתיחת יומן
                </span>
                <span className="rounded-full bg-white px-7 py-4 text-[15px] font-black" style={{ color: p.primary }}>
                  שירותים
                </span>
              </div>
            </div>

            <div
              className="h-[320px] rounded-[34px] bg-cover bg-center shadow-xl"
              style={{ backgroundImage: `url(${template.image})` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 px-8 pb-7">
            {template.blocks.slice(2, 5).map((block) => (
              <div key={block.type} className="rounded-[24px] bg-white p-5 shadow-sm">
                <div className="mb-2 h-3 w-16 rounded-full" style={{ background: p.accent }} />
                <div className="text-[18px] font-black" style={{ color: p.primary }}>{block.title}</div>
                <div className="mt-2 h-2 w-full rounded-full bg-slate-200" />
                <div className="mt-2 h-2 w-3/4 rounded-full bg-slate-200" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 px-8 pb-8">
            <div className="rounded-[26px] bg-white p-5 shadow-sm">
              <div className="text-[18px] font-black" style={{ color: p.primary }}>יומן תורים</div>
              <div className="mt-4 grid grid-cols-7 gap-1">
                {Array.from({ length: 21 }, (_, i) => (
                  <span
                    key={i}
                    className="h-6 rounded-lg"
                    style={{ background: [4, 9, 15].includes(i) ? p.primary : '#e2e8f0' }}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-[26px] bg-white p-5 shadow-sm">
              <div className="text-[18px] font-black" style={{ color: p.primary }}>חנות / לידים</div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {Array.from({ length: 6 }, (_, i) => (
                  <span key={i} className="h-12 rounded-xl bg-slate-200" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <span className="absolute right-3 top-3 rounded-full bg-violet-700 px-3 py-1 text-[10px] font-black text-white shadow-lg">
        החל
      </span>
      <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black text-slate-600 shadow-sm">
        תצוגה מלאה
      </span>
    </div>
  );
}

function ElementCard({
  element,
  onClick,
}: {
  element: StudioElement;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:bg-violet-50 hover:shadow-xl"
    >
      <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-lg font-black text-violet-700 transition group-hover:bg-violet-700 group-hover:text-white">
        {element.icon}
      </span>

      <span className="text-xs font-black text-slate-800">
        {element.label}
      </span>

      {element.description && (
        <span className="mt-1 block text-[11px] font-bold leading-4 text-slate-400">
          {element.description}
        </span>
      )}
    </button>
  );
}

function SectionCard({
  section,
  onClick,
}: {
  section: SectionTemplate;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-[1.25rem] border border-slate-200 bg-white p-3 text-right shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl"
    >
      <div className="relative mb-3 overflow-hidden rounded-xl bg-slate-100">
        <img
          src={section.preview}
          alt=""
          className="h-36 w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-black text-violet-700 shadow-sm">
          הוספה
        </span>
      </div>

      <p className="text-sm font-black text-slate-950">{section.title}</p>

      <p className="mt-1 text-xs font-bold leading-5 text-slate-400">
        {section.description}
      </p>
    </button>
  );
}

function PaletteCard({
  palette,
  onClick,
}: {
  palette: ThemePalette;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-[1.25rem] border border-slate-200 bg-white p-4 text-right shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl"
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {Object.entries(palette.colors).map(([key, color]) => (
          <span
            key={`${key}-${color}`}
            className="h-9 w-9 rounded-xl border border-white shadow"
            style={{ backgroundColor: color }}
            title={key}
          />
        ))}
      </div>

      <p className="text-base font-black text-slate-950">{palette.name}</p>

      <p className="mt-1 text-xs font-bold leading-5 text-slate-400">
        {palette.description}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-500"
          style={{ fontFamily: palette.font.heading }}
        >
          {palette.font.heading}
        </span>

        <span
          className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-500"
          style={{ fontFamily: palette.font.body }}
        >
          {palette.font.body}
        </span>
      </div>
    </button>
  );
}

function StoreNavButton({
  title,
  text,
  onClick,
}: {
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-right shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:bg-violet-50 hover:shadow-xl"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-black text-slate-950">
            {title}
          </span>
          <span className="mt-1 block text-xs font-bold leading-5 text-slate-500">
            {text}
          </span>
        </span>

        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-50 text-lg font-black text-violet-700">
          ›
        </span>
      </div>
    </button>
  );
}

function SmartButton({
  title,
  text,
  onClick,
}: {
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-right shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:bg-violet-50 hover:shadow-xl"
    >
      <p className="text-sm font-black text-slate-950">{title}</p>
      <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
        {text}
      </p>
    </button>
  );
}

function Info({ title, text }: { title: string; text: string }) {
  return (
    <div className="mb-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-black text-slate-950">{title}</p>
      <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
        {text}
      </p>
    </div>
  );
}

function EmptyState({ text }: { text?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
      <p className="text-sm font-black text-slate-700">לא נמצאו תוצאות</p>
      <p className="mt-1 text-xs font-bold text-slate-400">
        {text || "נסי לבחור קטגוריה אחרת או למחוק את החיפוש."}
      </p>
    </div>
  );
}
