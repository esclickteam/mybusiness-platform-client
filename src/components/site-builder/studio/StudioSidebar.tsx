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
import { pageTemplates } from "./data/pageTemplates";
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
    title: "תבניות אתר מוכנות",
    subtitle: "30 תבניות מלאות כמו Wix. לחיצה אחת מחליפה את העמוד הפעיל.",
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

type ProfessionalTemplateDef = {
  id: string;
  name: string;
  category: string;
  description: string;
  tone: string;
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  image: string;
  sections: string[];
  features: string[];
};

const PROFESSIONAL_TEMPLATE_DEFS: ProfessionalTemplateDef[] = [
  {
    id: "biz-pro-consulting",
    name: "Business Pro",
    category: "Business",
    description: "אתר יוקרתי ליועצים, חברות ונותני שירותים עם לידים, שירותים והמלצות.",
    tone: "עסקי נקי",
    primary: "#0f172a",
    secondary: "#475569",
    accent: "#7c3aed",
    bg: "#f8fafc",
    image: "office",
    sections: ["פתיח", "שירותים", "אודות", "המלצות", "לידים"],
    features: ["Lead Form", "Services", "Testimonials"],
  },
  {
    id: "beauty-pink-luxury",
    name: "Beauty Luxury",
    category: "Beauty",
    description: "תבנית יוקרתית לקוסמטיקה, ציפורניים, איפור קבוע ומכוני יופי.",
    tone: "ורוד יוקרתי",
    primary: "#9d174d",
    secondary: "#831843",
    accent: "#f9a8d4",
    bg: "#fff7fb",
    image: "beauty",
    sections: ["פתיח", "שירותים", "יומן", "גלריה", "ביקורות"],
    features: ["Booking", "Gallery", "Reviews"],
  },
  {
    id: "clinic-calm-booking",
    name: "Clinic Booking",
    category: "Booking",
    description: "אתר לקליניקה, מטפלים ורופאים עם יומן תורים מובנה ותצוגת שירותים.",
    tone: "רגוע ומקצועי",
    primary: "#0f766e",
    secondary: "#115e59",
    accent: "#5eead4",
    bg: "#f0fdfa",
    image: "clinic",
    sections: ["פתיח", "שירותים", "יומן", "אודות", "שאלות"],
    features: ["Booking", "FAQ", "Services"],
  },
  {
    id: "store-luxury-products",
    name: "Luxury Store",
    category: "Store",
    description: "חנות יוקרתית למוצרים, קולקציות, מבצעים ועמוד מוצר.",
    tone: "חנות פרימיום",
    primary: "#111827",
    secondary: "#78350f",
    accent: "#f59e0b",
    bg: "#fffbeb",
    image: "store",
    sections: ["פתיח", "מוצרים", "קטגוריות", "מבצע", "יצירת קשר"],
    features: ["Products", "Categories", "Coupons"],
  },
  {
    id: "law-dark-gold",
    name: "Law Firm Gold",
    category: "Law",
    description: "תבנית יוקרתית לעורכי דין, משרדים וייעוץ משפטי.",
    tone: "שחור זהב",
    primary: "#111827",
    secondary: "#374151",
    accent: "#d97706",
    bg: "#f9fafb",
    image: "law",
    sections: ["פתיח", "תחומי התמחות", "אודות", "המלצות", "פנייה"],
    features: ["Lead Form", "Practice Areas", "Reviews"],
  },
  {
    id: "fitness-black-neon",
    name: "Fitness Studio",
    category: "Fitness",
    description: "תבנית חזקה למאמני כושר, סטודיו, פילאטיס ויוגה.",
    tone: "ספורטיבי",
    primary: "#020617",
    secondary: "#1e293b",
    accent: "#22c55e",
    bg: "#f8fafc",
    image: "fitness",
    sections: ["פתיח", "מסלולים", "יומן", "תוצאות", "פנייה"],
    features: ["Booking", "Pricing", "Gallery"],
  },
  {
    id: "restaurant-warm",
    name: "Restaurant Warm",
    category: "Restaurant",
    description: "אתר למסעדה, בית קפה וקייטרינג עם תפריט, גלריה והזמנות.",
    tone: "חמים ומזמין",
    primary: "#7f1d1d",
    secondary: "#431407",
    accent: "#fb923c",
    bg: "#fff7ed",
    image: "food",
    sections: ["פתיח", "תפריט", "גלריה", "הזמנה", "מפה"],
    features: ["Menu", "Gallery", "Lead Form"],
  },
  {
    id: "real-estate-premium",
    name: "Real Estate Pro",
    category: "Real Estate",
    description: "תבנית לנדלן, מתווכים ופרויקטים עם נכסים, לידים ואמון.",
    tone: "יוקרתי נקי",
    primary: "#172554",
    secondary: "#334155",
    accent: "#38bdf8",
    bg: "#eff6ff",
    image: "realestate",
    sections: ["פתיח", "נכסים", "אודות", "המלצות", "לידים"],
    features: ["Listings", "Lead Form", "Testimonials"],
  },
  {
    id: "events-gold",
    name: "Events Planner",
    category: "Events",
    description: "אתר למפיקים, אירועים, אולמות וספקים עם גלריה וטופס פנייה.",
    tone: "אירועים זהב",
    primary: "#422006",
    secondary: "#78350f",
    accent: "#fbbf24",
    bg: "#fffbeb",
    image: "events",
    sections: ["פתיח", "חבילות", "גלריה", "המלצות", "פנייה"],
    features: ["Gallery", "Packages", "Leads"],
  },
  {
    id: "portfolio-creator",
    name: "Creator Portfolio",
    category: "Portfolio",
    description: "פורטפוליו מרשים למעצבים, צלמים, אמנים ויוצרי תוכן.",
    tone: "קריאייטיב",
    primary: "#18181b",
    secondary: "#52525b",
    accent: "#e11d48",
    bg: "#fafafa",
    image: "portfolio",
    sections: ["פתיח", "עבודות", "אודות", "לקוחות", "יצירת קשר"],
    features: ["Portfolio", "Clients", "Contact"],
  },
  {
    id: "landing-fast-leads",
    name: "Lead Landing",
    category: "Landing",
    description: "דף נחיתה חד ומהיר לקמפיינים, לידים, מבצע והשארת פרטים.",
    tone: "מכירתי",
    primary: "#312e81",
    secondary: "#4c1d95",
    accent: "#a855f7",
    bg: "#f5f3ff",
    image: "landing",
    sections: ["פתיח", "יתרונות", "מחיר", "שאלות", "לידים"],
    features: ["Lead Form", "Pricing", "FAQ"],
  },
  {
    id: "education-course",
    name: "Course Academy",
    category: "Education",
    description: "אתר לקורסים, מורים, מרצים וסדנאות עם סילבוס והרשמה.",
    tone: "אקדמי מודרני",
    primary: "#1d4ed8",
    secondary: "#0f172a",
    accent: "#60a5fa",
    bg: "#eff6ff",
    image: "education",
    sections: ["פתיח", "קורסים", "סילבוס", "המלצות", "הרשמה"],
    features: ["Courses", "Lead Form", "FAQ"],
  },
  {
    id: "barber-dark",
    name: "Barber Dark",
    category: "Beauty",
    description: "תבנית למספרות וברברים עם יומן תורים, שירותים וגלריה.",
    tone: "כהה וגברי",
    primary: "#0f172a",
    secondary: "#292524",
    accent: "#f97316",
    bg: "#f5f5f4",
    image: "barber",
    sections: ["פתיח", "שירותים", "יומן", "גלריה", "מיקום"],
    features: ["Booking", "Services", "Map"],
  },
  {
    id: "spa-soft",
    name: "Spa Serenity",
    category: "Beauty",
    description: "אתר רך לספא, טיפולים, עיסוי, רפואה משלימה וקליניקות יופי.",
    tone: "רך ומרגיע",
    primary: "#365314",
    secondary: "#64748b",
    accent: "#bef264",
    bg: "#f7fee7",
    image: "spa",
    sections: ["פתיח", "טיפולים", "יומן", "חבילות", "ביקורות"],
    features: ["Booking", "Packages", "Reviews"],
  },
  {
    id: "architect-minimal",
    name: "Architect Minimal",
    category: "Portfolio",
    description: "תבנית נקייה לאדריכלים, מעצבי פנים וסטודיו לעיצוב.",
    tone: "מינימליסטי",
    primary: "#111827",
    secondary: "#6b7280",
    accent: "#a3a3a3",
    bg: "#fafafa",
    image: "interior",
    sections: ["פתיח", "פרויקטים", "אודות", "תהליך", "פנייה"],
    features: ["Portfolio", "Process", "Leads"],
  },
  {
    id: "photographer-bold",
    name: "Photo Studio",
    category: "Portfolio",
    description: "אתר לצלמים, וידאו וסטודיו עם גלריות גדולות ותיק עבודות.",
    tone: "ויזואלי",
    primary: "#0c0a09",
    secondary: "#44403c",
    accent: "#f43f5e",
    bg: "#fafaf9",
    image: "photo",
    sections: ["פתיח", "גלריה", "חבילות", "המלצות", "פנייה"],
    features: ["Gallery", "Pricing", "Contact"],
  },
  {
    id: "medical-white-blue",
    name: "Medical Center",
    category: "Clinic",
    description: "תבנית למרכז רפואי, מרפאה, רופא פרטי וקליניקות מקצועיות.",
    tone: "אמין ונקי",
    primary: "#075985",
    secondary: "#0f766e",
    accent: "#7dd3fc",
    bg: "#f0f9ff",
    image: "medical",
    sections: ["פתיח", "שירותים", "רופאים", "יומן", "יצירת קשר"],
    features: ["Booking", "Team", "Services"],
  },
  {
    id: "agency-gradient",
    name: "Digital Agency",
    category: "Business",
    description: "תבנית לסוכנות דיגיטל, פרסום, מדיה, מיתוג ושיווק.",
    tone: "צעיר וטכנולוגי",
    primary: "#4c1d95",
    secondary: "#0f172a",
    accent: "#06b6d4",
    bg: "#f8fafc",
    image: "agency",
    sections: ["פתיח", "שירותים", "תוצאות", "לקוחות", "לידים"],
    features: ["Services", "Case Studies", "Lead Form"],
  },
  {
    id: "coach-premium",
    name: "Coach Premium",
    category: "Business",
    description: "אתר למאמנים אישיים, עסקיים, NLP ויועצים עם קביעת שיחה.",
    tone: "אישי ויוקרתי",
    primary: "#581c87",
    secondary: "#3b0764",
    accent: "#c084fc",
    bg: "#faf5ff",
    image: "coach",
    sections: ["פתיח", "שיטה", "תוכניות", "יומן", "המלצות"],
    features: ["Booking", "Programs", "Reviews"],
  },
  {
    id: "kids-colorful",
    name: "Kids Studio",
    category: "Education",
    description: "תבנית לחוגים, גני ילדים, סדנאות לילדים ופעילויות משפחה.",
    tone: "צבעוני נקי",
    primary: "#0e7490",
    secondary: "#be123c",
    accent: "#facc15",
    bg: "#ecfeff",
    image: "kids",
    sections: ["פתיח", "פעילויות", "חוגים", "גלריה", "הרשמה"],
    features: ["Courses", "Gallery", "Lead Form"],
  },
  {
    id: "auto-garage",
    name: "Auto Garage",
    category: "Business",
    description: "אתר למוסך, שטיפת רכב, דיטיילינג ושירותי רכב.",
    tone: "טכני וחזק",
    primary: "#020617",
    secondary: "#334155",
    accent: "#ef4444",
    bg: "#f8fafc",
    image: "auto",
    sections: ["פתיח", "שירותים", "מחירים", "ביקורות", "וואטסאפ"],
    features: ["Services", "Pricing", "WhatsApp"],
  },
  {
    id: "home-services",
    name: "Home Services",
    category: "Business",
    description: "תבנית לאינסטלטור, חשמלאי, טכנאי מזגנים וגינון.",
    tone: "אמין ומהיר",
    primary: "#1e3a8a",
    secondary: "#475569",
    accent: "#f59e0b",
    bg: "#f8fafc",
    image: "tools",
    sections: ["פתיח", "שירותים", "אזורים", "ביקורות", "קריאה עכשיו"],
    features: ["Services", "Reviews", "Lead Form"],
  },
  {
    id: "jewelry-store",
    name: "Jewelry Boutique",
    category: "Store",
    description: "חנות אלגנטית לתכשיטים, אקססוריז, מתנות ומוצרי פרימיום.",
    tone: "בוטיק זהב",
    primary: "#3f3f46",
    secondary: "#713f12",
    accent: "#eab308",
    bg: "#fefce8",
    image: "jewelry",
    sections: ["פתיח", "קולקציות", "מוצרים", "מבצע", "פוטר"],
    features: ["Store", "Collections", "Products"],
  },
  {
    id: "fashion-shop",
    name: "Fashion Shop",
    category: "Store",
    description: "תבנית לחנות אופנה, בגדים, מותגים, קולקציות ומבצעים.",
    tone: "אופנתי",
    primary: "#be185d",
    secondary: "#111827",
    accent: "#fb7185",
    bg: "#fff1f2",
    image: "fashion",
    sections: ["פתיח", "קולקציות", "מוצרים", "אודות", "הטבה"],
    features: ["Store", "Products", "Coupon"],
  },
  {
    id: "tech-saas",
    name: "Tech SaaS",
    category: "Landing",
    description: "דף נחיתה למוצר דיגיטלי, אפליקציה, מערכת SaaS או סטארטאפ.",
    tone: "טכנולוגי",
    primary: "#1e1b4b",
    secondary: "#312e81",
    accent: "#22d3ee",
    bg: "#eef2ff",
    image: "saas",
    sections: ["פתיח", "פיצ׳רים", "מחירים", "שאלות", "התחלה"],
    features: ["Pricing", "Features", "CTA"],
  },
  {
    id: "finance-clean",
    name: "Finance Clean",
    category: "Business",
    description: "אתר לרואה חשבון, יועץ מס, ביטוח, פיננסים ומשכנתאות.",
    tone: "אמין ומדויק",
    primary: "#064e3b",
    secondary: "#0f172a",
    accent: "#10b981",
    bg: "#f0fdf4",
    image: "finance",
    sections: ["פתיח", "שירותים", "תהליך", "המלצות", "פנייה"],
    features: ["Services", "Process", "Lead Form"],
  },
  {
    id: "wedding-vendor",
    name: "Wedding Vendor",
    category: "Events",
    description: "אתר לספקי חתונות, שמלות, איפור, צילום, DJ והפקה.",
    tone: "רומנטי יוקרתי",
    primary: "#881337",
    secondary: "#713f12",
    accent: "#f9a8d4",
    bg: "#fff7ed",
    image: "wedding",
    sections: ["פתיח", "חבילות", "גלריה", "המלצות", "פנייה"],
    features: ["Gallery", "Packages", "Leads"],
  },
  {
    id: "cleaning-company",
    name: "Cleaning Company",
    category: "Business",
    description: "תבנית לחברות ניקיון, אחזקה, פוליש ושירותים לעסקים ובתים.",
    tone: "נקי ומסודר",
    primary: "#0369a1",
    secondary: "#475569",
    accent: "#38bdf8",
    bg: "#f0f9ff",
    image: "cleaning",
    sections: ["פתיח", "שירותים", "לפני אחרי", "ביקורות", "הצעת מחיר"],
    features: ["Services", "Gallery", "Lead Form"],
  },
  {
    id: "pet-care",
    name: "Pet Care",
    category: "Booking",
    description: "אתר למספרת כלבים, וטרינר, פנסיון וטיפול בחיות.",
    tone: "חם וחברותי",
    primary: "#92400e",
    secondary: "#365314",
    accent: "#fbbf24",
    bg: "#fef3c7",
    image: "pets",
    sections: ["פתיח", "שירותים", "יומן", "גלריה", "פנייה"],
    features: ["Booking", "Services", "Gallery"],
  },
  {
    id: "travel-guide",
    name: "Travel Guide",
    category: "Landing",
    description: "אתר למדריכי טיולים, סיורים, אטרקציות וחוויות.",
    tone: "חוויה והרפתקה",
    primary: "#065f46",
    secondary: "#0f766e",
    accent: "#f97316",
    bg: "#ecfdf5",
    image: "travel",
    sections: ["פתיח", "מסלולים", "גלריה", "מחירים", "הרשמה"],
    features: ["Packages", "Gallery", "Lead Form"],
  },
];

function makeTemplatePreview(def: ProfessionalTemplateDef) {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="520" height="360" viewBox="0 0 520 360">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${def.bg}"/>
        <stop offset="1" stop-color="#ffffff"/>
      </linearGradient>
      <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${def.primary}"/>
        <stop offset="1" stop-color="${def.accent}"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#0f172a" flood-opacity="0.18"/>
      </filter>
    </defs>
    <rect width="520" height="360" rx="34" fill="url(#bg)"/>
    <rect x="34" y="30" width="452" height="44" rx="22" fill="#fff" filter="url(#shadow)"/>
    <circle cx="66" cy="52" r="9" fill="${def.accent}"/>
    <rect x="88" y="45" width="78" height="14" rx="7" fill="${def.primary}" opacity="0.92"/>
    <rect x="336" y="45" width="46" height="14" rx="7" fill="${def.secondary}" opacity="0.35"/>
    <rect x="394" y="45" width="52" height="14" rx="7" fill="${def.secondary}" opacity="0.24"/>
    <rect x="54" y="104" width="188" height="188" rx="32" fill="url(#accent)" filter="url(#shadow)"/>
    <circle cx="198" cy="142" r="40" fill="#fff" opacity="0.2"/>
    <path d="M82 248 C126 192 158 210 188 160 C202 136 222 125 242 118 L242 292 L82 292 Z" fill="#fff" opacity="0.26"/>
    <rect x="274" y="118" width="164" height="22" rx="11" fill="${def.primary}"/>
    <rect x="274" y="153" width="132" height="16" rx="8" fill="${def.secondary}" opacity="0.68"/>
    <rect x="274" y="181" width="150" height="16" rx="8" fill="${def.secondary}" opacity="0.48"/>
    <rect x="274" y="220" width="80" height="34" rx="17" fill="${def.accent}"/>
    <rect x="366" y="220" width="72" height="34" rx="17" fill="#fff" opacity="0.94"/>
    <rect x="58" y="312" width="94" height="22" rx="11" fill="#fff" opacity="0.9"/>
    <rect x="164" y="312" width="94" height="22" rx="11" fill="#fff" opacity="0.65"/>
    <rect x="270" y="312" width="94" height="22" rx="11" fill="#fff" opacity="0.9"/>
    <text x="450" y="338" text-anchor="end" font-family="Arial" font-size="18" font-weight="800" fill="${def.primary}">${def.name}</text>
  </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildProfessionalTemplateHtml(def: ProfessionalTemplateDef) {
  const sections = def.sections.map((section) => `<span>${escapeHtml(section)}</span>`).join("");
  const features = def.features
    .map((feature) => `<div class="biz-template-feature"><strong>${escapeHtml(feature)}</strong><small>מחובר למערכת Bizuply</small></div>`)
    .join("");

  return `
<section class="biz-template-page" data-biz-section="template" data-template-id="${def.id}" dir="rtl">
  <style>
    .biz-template-page{--p:${def.primary};--s:${def.secondary};--a:${def.accent};--b:${def.bg};font-family:Heebo,Arial,sans-serif;background:linear-gradient(135deg,var(--b),#fff);color:var(--p);padding:42px 34px;border-radius:34px;overflow:hidden;position:relative;min-height:720px}
    .biz-template-page:before{content:"";position:absolute;inset:auto -120px -160px auto;width:380px;height:380px;border-radius:999px;background:var(--a);opacity:.13;filter:blur(18px)}
    .biz-template-top{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-bottom:44px;position:relative;z-index:1}
    .biz-template-logo{display:flex;align-items:center;gap:10px;font-weight:900;font-size:18px}.biz-template-logo i{width:38px;height:38px;border-radius:16px;background:linear-gradient(135deg,var(--p),var(--a));display:block;box-shadow:0 18px 45px rgba(15,23,42,.16)}
    .biz-template-nav{display:flex;gap:10px;flex-wrap:wrap}.biz-template-nav span{padding:9px 14px;border-radius:999px;background:#fff;border:1px solid rgba(15,23,42,.08);font-size:12px;font-weight:800;color:var(--s)}
    .biz-template-hero{display:grid;grid-template-columns:1.05fr .95fr;gap:44px;align-items:center;position:relative;z-index:1}.biz-template-copy h1{font-size:clamp(44px,7vw,82px);line-height:.93;margin:0;font-weight:950;letter-spacing:-.07em}.biz-template-copy p{max-width:520px;margin:24px 0 0;font-size:20px;line-height:1.8;font-weight:800;color:var(--s)}
    .biz-template-actions{display:flex;gap:14px;flex-wrap:wrap;margin-top:30px}.biz-template-actions a{border-radius:20px;padding:16px 24px;text-decoration:none;font-weight:950}.biz-template-actions a:first-child{background:linear-gradient(135deg,var(--p),var(--a));color:#fff;box-shadow:0 18px 45px rgba(15,23,42,.18)}.biz-template-actions a:last-child{background:#fff;color:var(--p);border:1px solid rgba(15,23,42,.08)}
    .biz-template-visual{min-height:430px;border-radius:36px;background:linear-gradient(135deg,var(--p),var(--a));box-shadow:0 30px 80px rgba(15,23,42,.18);position:relative;overflow:hidden}.biz-template-visual:before{content:"";position:absolute;inset:28px;border-radius:28px;background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.35)}.biz-template-visual:after{content:"${escapeHtml(def.tone)}";position:absolute;right:34px;bottom:34px;color:#fff;font-size:28px;font-weight:950;letter-spacing:-.04em}
    .biz-template-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:48px;position:relative;z-index:1}.biz-template-feature{border-radius:24px;background:#fff;border:1px solid rgba(15,23,42,.08);padding:20px;box-shadow:0 18px 55px rgba(15,23,42,.06)}.biz-template-feature strong{display:block;font-size:17px;color:var(--p)}.biz-template-feature small{display:block;margin-top:8px;color:var(--s);font-weight:800}.biz-template-booking{margin-top:18px;border-radius:28px;background:#fff;border:1px dashed color-mix(in srgb,var(--a) 55%,#fff);padding:24px;font-weight:950;color:var(--p);position:relative;z-index:1}
    @media(max-width:860px){.biz-template-hero{grid-template-columns:1fr}.biz-template-grid{grid-template-columns:1fr}.biz-template-top{align-items:flex-start;flex-direction:column}.biz-template-visual{min-height:300px}}
  </style>
  <div class="biz-template-top">
    <div class="biz-template-logo"><i></i><span>שם העסק שלך</span></div>
    <div class="biz-template-nav">${sections}</div>
  </div>
  <div class="biz-template-hero">
    <div class="biz-template-copy">
      <h1>${escapeHtml(def.name)}<br/>שמוכן לפרסום</h1>
      <p>${escapeHtml(def.description)} אפשר לשנות צבעים, כפתורים, מבנה וסקשנים — והבלוקים החכמים מתחברים לשירותים, יומן, לידים וחנות.</p>
      <div class="biz-template-actions"><a href="#contact">השארת פרטים</a><a href="#services">צפייה בשירותים</a></div>
    </div>
    <div class="biz-template-visual"></div>
  </div>
  <div class="biz-template-grid">${features}</div>
  <div class="biz-template-booking" data-biz-smart-block="booking-store-services">בלוקים דינמיים מוכנים: שירותים / יומן תורים / חנות / לידים — לפי סוג התבנית.</div>
</section>`;
}

const PROFESSIONAL_SITE_TEMPLATES: PageTemplate[] = PROFESSIONAL_TEMPLATE_DEFS.map(
  (def) =>
    ({
      id: def.id,
      name: def.name,
      category: def.category,
      description: def.description,
      preview: makeTemplatePreview(def),
      html: buildProfessionalTemplateHtml(def),
      sections: def.sections,
      palette: {
        primary: def.primary,
        secondary: def.secondary,
        accent: def.accent,
        background: def.bg,
        text: def.primary,
      },
      premium: false,
    } as unknown as PageTemplate)
);

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

  const professionalPageTemplates = useMemo(() => {
    const professionalIds = new Set(PROFESSIONAL_SITE_TEMPLATES.map((template) => template.id));
    const legacyTemplates = pageTemplates.filter(
      (template) => !professionalIds.has(template.id)
    );

    return [...PROFESSIONAL_SITE_TEMPLATES, ...legacyTemplates];
  }, []);

  const filteredPageTemplates = useMemo(() => {
    if (!normalizedSearch) return professionalPageTemplates;

    return professionalPageTemplates.filter((template) => {
      const haystack = `${template.name} ${template.category} ${template.description}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [normalizedSearch, professionalPageTemplates]);

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
                  title="30 תבניות אתר מוכנות"
                  text={`בחרי תבנית והיא תופיע מיד בעמוד: ${activePage?.title || "לא נבחר"}. כל תבנית מופיעה כאן בקטן לפני בחירה.`}
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
  return (
    <button
      type="button"
      onClick={onClick}
      className="group overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white text-right shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-2xl"
    >
      <div className="relative overflow-hidden bg-slate-100">
        <img
          src={template.preview}
          alt={template.name}
          className="h-36 w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <span className="absolute right-2 top-2 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black text-slate-700 shadow-sm">
          תצוגה מלאה
        </span>

        <span className="absolute left-2 top-2 rounded-full bg-violet-700 px-3 py-1 text-[10px] font-black text-white shadow-sm">
          החל
        </span>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/70 to-transparent p-3 pt-10">
          <p className="truncate text-sm font-black text-white">{template.name}</p>
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="min-w-0 truncate text-sm font-black text-slate-950">
            {template.name}
          </p>
          <span className="shrink-0 rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-black text-violet-700">
            {template.category}
          </span>
        </div>

        <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-slate-500">
          {template.description}
        </p>
      </div>
    </button>
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
