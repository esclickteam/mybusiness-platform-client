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
  const nav = def.sections.slice(0, 5);
  const navRects = nav
    .map((_, index) => {
      const x = 392 - index * 54;
      return `<rect x="${x}" y="38" width="42" height="13" rx="6.5" fill="${def.secondary}" opacity="0.28"/>`;
    })
    .join("");

  const cardRects = def.features
    .slice(0, 3)
    .map((feature, index) => {
      const x = 42 + index * 143;
      return `
        <rect x="${x}" y="282" width="126" height="72" rx="16" fill="#fff" filter="url(#shadow)"/>
        <rect x="${x + 18}" y="306" width="58" height="10" rx="5" fill="${def.primary}" opacity="0.9"/>
        <rect x="${x + 18}" y="326" width="88" height="8" rx="4" fill="${def.secondary}" opacity="0.38"/>
        <text x="${x + 108}" y="346" text-anchor="end" font-family="Arial" font-size="8" font-weight="800" fill="${def.accent}">${escapeSvg(feature)}</text>
      `;
    })
    .join("");

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="560" height="390" viewBox="0 0 560 390">
    <defs>
      <linearGradient id="bg-${def.id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${def.bg}"/>
        <stop offset="1" stop-color="#ffffff"/>
      </linearGradient>
      <linearGradient id="photo-${def.id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${def.primary}"/>
        <stop offset="0.55" stop-color="${def.accent}"/>
        <stop offset="1" stop-color="${def.bg}"/>
      </linearGradient>
      <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#0f172a" flood-opacity="0.16"/>
      </filter>
    </defs>

    <rect width="560" height="390" rx="34" fill="url(#bg-${def.id})"/>
    <circle cx="64" cy="54" r="42" fill="${def.accent}" opacity="0.13"/>
    <circle cx="492" cy="300" r="74" fill="${def.primary}" opacity="0.08"/>

    <rect x="28" y="22" width="504" height="48" rx="24" fill="#fff" filter="url(#shadow)"/>
    <circle cx="497" cy="46" r="10" fill="${def.accent}"/>
    <rect x="405" y="39" width="64" height="14" rx="7" fill="${def.primary}" opacity="0.95"/>
    ${navRects}

    <rect x="42" y="96" width="218" height="164" rx="28" fill="url(#photo-${def.id})" filter="url(#shadow)"/>
    <circle cx="216" cy="130" r="44" fill="#fff" opacity="0.18"/>
    <path d="M62 235 C94 184 125 202 153 158 C173 126 222 118 260 110 L260 260 L62 260 Z" fill="#fff" opacity="0.22"/>
    <rect x="68" y="218" width="94" height="16" rx="8" fill="#fff" opacity="0.85"/>

    <rect x="300" y="106" width="170" height="23" rx="11.5" fill="${def.primary}"/>
    <rect x="300" y="140" width="142" height="20" rx="10" fill="${def.primary}" opacity="0.9"/>
    <rect x="300" y="176" width="178" height="11" rx="5.5" fill="${def.secondary}" opacity="0.52"/>
    <rect x="300" y="198" width="154" height="11" rx="5.5" fill="${def.secondary}" opacity="0.36"/>
    <rect x="300" y="232" width="82" height="34" rx="17" fill="${def.accent}"/>
    <rect x="394" y="232" width="74" height="34" rx="17" fill="#fff" opacity="0.95"/>

    ${cardRects}

    <rect x="42" y="365" width="478" height="9" rx="4.5" fill="${def.primary}" opacity="0.08"/>
    <text x="500" y="345" text-anchor="end" font-family="Arial" font-size="20" font-weight="900" fill="${def.primary}">${escapeSvg(def.name)}</text>
  </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function escapeSvg(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getTemplatePhoto(image: string) {
  const photos: Record<string, string> = {
    office: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    beauty: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80",
    clinic: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
    store: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    law: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
    fitness: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
    food: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    realestate: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
    events: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    portfolio: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80",
    landing: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80",
    education: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    barber: "https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=1200&q=80",
    spa: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    interior: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    photo: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1200&q=80",
    medical: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
    agency: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    coach: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
    kids: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=80",
    auto: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80",
    tools: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    jewelry: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
    fashion: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
    saas: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    finance: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
    wedding: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
    cleaning: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=1200&q=80",
    pets: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80",
    travel: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  };

  return photos[image] || photos.office;
}

function buildProfessionalTemplateHtml(def: ProfessionalTemplateDef) {
  const nav = def.sections
    .slice(0, 5)
    .map((section) => `<a href="#${slugify(section)}">${escapeHtml(section)}</a>`)
    .join("");

  const serviceCards = def.features
    .map(
      (feature, index) => `
      <article class="bzx-card">
        <div class="bzx-card-icon">${index + 1}</div>
        <h3>${escapeHtml(feature)}</h3>
        <p>כאן יופיע תוכן אמיתי מהעסק: שירות, מוצר, חבילה, המלצה או טופס לפי סוג התבנית.</p>
      </article>`
    )
    .join("");

  const chips = def.sections
    .map((section) => `<span>${escapeHtml(section)}</span>`)
    .join("");

  return `
<section class="bzx-ready-site" data-biz-section="full-site-template" data-template-id="${def.id}" dir="rtl">
  <style>
    .bzx-ready-site{--p:${def.primary};--s:${def.secondary};--a:${def.accent};--b:${def.bg};font-family:Heebo,Arial,sans-serif;background:var(--b);color:var(--p);border-radius:38px;overflow:hidden;min-height:1180px;box-shadow:0 30px 90px rgba(15,23,42,.08)}
    .bzx-ready-site *{box-sizing:border-box}.bzx-ready-site a{text-decoration:none}.bzx-inner{width:min(1120px,calc(100% - 48px));margin:0 auto}.bzx-header{display:flex;align-items:center;justify-content:space-between;gap:22px;padding:24px 0}.bzx-brand{display:flex;align-items:center;gap:12px;font-size:22px;font-weight:950;letter-spacing:-.04em}.bzx-logo{width:46px;height:46px;border-radius:18px;background:linear-gradient(135deg,var(--p),var(--a));box-shadow:0 20px 45px rgba(15,23,42,.16)}.bzx-nav{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.bzx-nav a{padding:10px 16px;border-radius:999px;background:#fff;color:var(--s);border:1px solid rgba(15,23,42,.08);font-weight:850;font-size:13px}.bzx-cta{background:var(--p)!important;color:#fff!important;border-color:transparent!important}
    .bzx-hero{display:grid;grid-template-columns:1fr 1fr;gap:52px;align-items:center;padding:48px 0 70px}.bzx-kicker{display:inline-flex;align-items:center;gap:8px;padding:10px 16px;border-radius:999px;background:#fff;color:var(--a);font-weight:950;box-shadow:0 16px 45px rgba(15,23,42,.07)}.bzx-title{margin:22px 0 0;font-size:clamp(48px,7vw,96px);line-height:.92;font-weight:950;letter-spacing:-.075em;color:var(--p)}.bzx-title span{color:var(--a)}.bzx-lead{max-width:560px;margin:26px 0 0;font-size:21px;line-height:1.85;font-weight:850;color:var(--s)}.bzx-actions{display:flex;gap:14px;flex-wrap:wrap;margin-top:34px}.bzx-actions a{padding:18px 26px;border-radius:20px;font-weight:950}.bzx-actions a:first-child{background:linear-gradient(135deg,var(--p),var(--a));color:#fff;box-shadow:0 22px 55px rgba(15,23,42,.17)}.bzx-actions a:last-child{background:#fff;color:var(--p);border:1px solid rgba(15,23,42,.08)}
    .bzx-photo{min-height:520px;border-radius:42px;position:relative;overflow:hidden;background:#fff;box-shadow:0 35px 90px rgba(15,23,42,.18)}.bzx-photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.bzx-photo:before{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(15,23,42,0) 35%,rgba(15,23,42,.58));z-index:1}.bzx-photo:after{content:"תמונה להחלפה";position:absolute;right:34px;bottom:32px;color:#fff;font-size:28px;font-weight:950;letter-spacing:-.05em;z-index:2}.bzx-floating{position:absolute;left:28px;top:34px;z-index:3;width:180px;border-radius:24px;background:rgba(255,255,255,.92);padding:18px;box-shadow:0 22px 60px rgba(15,23,42,.18)}.bzx-floating b{display:block;font-size:24px;color:var(--p)}.bzx-floating small{display:block;margin-top:6px;color:var(--s);font-weight:850}
    .bzx-strip{display:flex;gap:10px;flex-wrap:wrap;padding:22px;border-radius:28px;background:#fff;border:1px solid rgba(15,23,42,.08);box-shadow:0 20px 55px rgba(15,23,42,.06);margin-bottom:42px}.bzx-strip span{padding:9px 14px;border-radius:999px;background:var(--b);color:var(--p);font-size:13px;font-weight:950}
    .bzx-section{padding:62px 0}.bzx-center{text-align:center}.bzx-section h2{margin:0;font-size:clamp(34px,4vw,58px);font-weight:950;letter-spacing:-.055em;color:var(--p)}.bzx-section p.bzx-sub{max-width:720px;margin:18px auto 0;color:var(--s);font-size:18px;line-height:1.75;font-weight:800}.bzx-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:34px}.bzx-card{background:#fff;border:1px solid rgba(15,23,42,.08);border-radius:30px;padding:28px;box-shadow:0 18px 55px rgba(15,23,42,.06);min-height:190px}.bzx-card-icon{width:48px;height:48px;border-radius:18px;background:linear-gradient(135deg,var(--p),var(--a));color:#fff;display:grid;place-items:center;font-weight:950}.bzx-card h3{margin:20px 0 0;font-size:22px;font-weight:950;color:var(--p)}.bzx-card p{margin:12px 0 0;color:var(--s);line-height:1.65;font-weight:750}
    .bzx-split{display:grid;grid-template-columns:.9fr 1.1fr;gap:28px;align-items:stretch}.bzx-panel{border-radius:34px;background:#fff;border:1px solid rgba(15,23,42,.08);padding:34px;box-shadow:0 18px 60px rgba(15,23,42,.06)}.bzx-panel h3{margin:0;font-size:30px;font-weight:950;color:var(--p)}.bzx-panel p{color:var(--s);font-weight:800;line-height:1.8}.bzx-placeholder{min-height:330px;border-radius:32px;background:linear-gradient(135deg,var(--a),var(--p));position:relative;overflow:hidden}.bzx-placeholder:before{content:"";position:absolute;inset:28px;border-radius:26px;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.28)}.bzx-placeholder:after{content:"גלריה / מוצר / תמונה";position:absolute;right:30px;bottom:28px;color:#fff;font-weight:950;font-size:24px}
    .bzx-smart{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:30px}.bzx-smart div{border-radius:26px;background:#fff;padding:22px;border:1px dashed rgba(15,23,42,.14);font-weight:950;color:var(--p)}.bzx-smart small{display:block;margin-top:8px;color:var(--s);font-weight:800}.bzx-form{display:grid;gap:12px;margin-top:24px}.bzx-form input,.bzx-form textarea{width:100%;border:1px solid rgba(15,23,42,.12);border-radius:18px;padding:16px;background:#fff;font-family:inherit;font-weight:800}.bzx-form button{border:0;border-radius:20px;background:linear-gradient(135deg,var(--p),var(--a));color:#fff;padding:18px;font-weight:950;font-family:inherit}.bzx-footer{padding:34px 0 46px;color:var(--s);font-weight:850;text-align:center}
    @media(max-width:900px){.bzx-hero,.bzx-split{grid-template-columns:1fr}.bzx-grid,.bzx-smart{grid-template-columns:1fr}.bzx-nav{display:none}.bzx-photo{min-height:340px}.bzx-inner{width:min(100% - 28px,1120px)}}
  </style>

  <div class="bzx-inner">
    <header class="bzx-header">
      <div class="bzx-brand"><i class="bzx-logo"></i><span>שם העסק שלך</span></div>
      <nav class="bzx-nav">${nav}<a class="bzx-cta" href="#contact">צור קשר</a></nav>
    </header>

    <div class="bzx-hero">
      <div>
        <div class="bzx-kicker">● ${escapeHtml(def.tone)}</div>
        <h1 class="bzx-title">${escapeHtml(def.name)}<br/><span>אתר מוכן</span></h1>
        <p class="bzx-lead">${escapeHtml(def.description)} זה אתר שלם מוכן לפרסום: פתיח, שירותים, גלריה, המלצות, טפסים ובלוקים חכמים לפי סוג העסק.</p>
        <div class="bzx-actions"><a href="#contact">קביעת שיחה</a><a href="#services">צפייה בשירותים</a></div>
      </div>
      <div class="bzx-photo" data-biz-editable-image="hero">
        <img src="${getTemplatePhoto(def.image)}" alt="תמונת תבנית להחלפה" />
        <div class="bzx-floating"><b>100%</b><small>תבנית מוכנה לעריכה</small></div>
      </div>
    </div>

    <div class="bzx-strip">${chips}</div>

    <section id="services" class="bzx-section bzx-center">
      <h2>שירותים / מוצרים מובילים</h2>
      <p class="bzx-sub">כאן העסק מציג את הדברים החשובים ביותר. אפשר להחליף טקסטים, תמונות, מחירים, כפתורים וסדר סקשנים.</p>
      <div class="bzx-grid">${serviceCards}</div>
    </section>

    <section class="bzx-section">
      <div class="bzx-split">
        <div class="bzx-placeholder" data-biz-editable-image="gallery"></div>
        <div class="bzx-panel">
          <h3>אודות העסק</h3>
          <p>טקסט מוכן שמספר על העסק בצורה מקצועית, כולל יתרונות, ניסיון, בידול וקריאה לפעולה. בעל העסק יכול לערוך הכל בלחיצה.</p>
          <div class="bzx-smart">
            <div data-biz-smart-block="services">שירותים<small>מחובר למערכת</small></div>
            <div data-biz-smart-block="booking">יומן<small>זמינות ותורים</small></div>
            <div data-biz-smart-block="store">חנות<small>מוצרים ומבצעים</small></div>
          </div>
        </div>
      </div>
    </section>

    <section class="bzx-section bzx-center">
      <h2>לקוחות ממליצים</h2>
      <p class="bzx-sub">סקשן המלצות מוכן. בהמשך אפשר למשוך ביקורות אמיתיות מהמערכת.</p>
      <div class="bzx-grid">
        <article class="bzx-card"><h3>חוויה מעולה</h3><p>שירות מקצועי, מהיר וברור. ממליצה מאוד.</p></article>
        <article class="bzx-card"><h3>תוצאה מושלמת</h3><p>הכול היה מסודר, נוח ואיכותי.</p></article>
        <article class="bzx-card"><h3>יחס אישי</h3><p>קיבלתי מענה מהיר ושירות ברמה גבוהה.</p></article>
      </div>
    </section>

    <section id="contact" class="bzx-section">
      <div class="bzx-panel">
        <h3>השארת פרטים</h3>
        <p>טופס ליד מוכן שמתחבר ללידים של Bizuply. אפשר להחליף לשיחת וואטסאפ, קביעת תור או רכישה.</p>
        <form class="bzx-form" data-biz-smart-block="lead-form">
          <input placeholder="שם מלא" />
          <input placeholder="טלפון" />
          <textarea placeholder="מה תרצו לדעת?" rows="4"></textarea>
          <button type="button">שליחת פנייה</button>
        </form>
      </div>
    </section>

    <footer class="bzx-footer">© שם העסק שלך · אתר נבנה עם Bizuply</footer>
  </div>
</section>`;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\u0590-\u05ff-]/g, "");
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
      __studioTemplate: def,
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

function getTemplateMeta(template: PageTemplate): ProfessionalTemplateDef | null {
  const withMeta = template as PageTemplate & { __studioTemplate?: ProfessionalTemplateDef };
  return withMeta.__studioTemplate || null;
}

function TemplateCard({
  template,
  onClick,
}: {
  template: PageTemplate;
  onClick: () => void;
}) {
  const meta = getTemplateMeta(template);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group overflow-hidden rounded-[1.45rem] border border-slate-200 bg-white text-right shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-2xl"
    >
      {meta ? (
        <MiniWebsitePreview def={meta} />
      ) : (
        <div className="relative overflow-hidden bg-slate-100">
          <img
            src={template.preview}
            alt={template.name}
            className="h-40 w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <span className="absolute left-2 top-2 rounded-full bg-violet-700 px-3 py-1 text-[10px] font-black text-white shadow-sm">
            החל
          </span>
        </div>
      )}

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

        {meta && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {meta.sections.slice(0, 4).map((section) => (
              <span
                key={`${meta.id}-${section}`}
                className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-500"
              >
                {section}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}

function MiniWebsitePreview({ def }: { def: ProfessionalTemplateDef }) {
  const photo = getTemplatePhoto(def.image);

  return (
    <div
      className="relative h-48 overflow-hidden bg-white"
      style={{ background: `linear-gradient(135deg, ${def.bg}, #ffffff)` }}
    >
      <div className="absolute inset-0 opacity-70">
        <div
          className="absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl"
          style={{ backgroundColor: def.accent }}
        />
        <div
          className="absolute -bottom-14 left-4 h-32 w-32 rounded-full blur-3xl"
          style={{ backgroundColor: def.primary }}
        />
      </div>

      <div className="relative mx-3 mt-3 flex h-8 items-center justify-between rounded-full bg-white/95 px-3 shadow-sm ring-1 ring-slate-200/70">
        <div className="flex items-center gap-1.5">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: def.accent }}
          />
          <span
            className="h-2 w-10 rounded-full"
            style={{ backgroundColor: def.primary }}
          />
        </div>
        <div className="flex gap-1">
          {def.sections.slice(0, 4).map((section) => (
            <span
              key={`${def.id}-nav-${section}`}
              className="h-2 w-7 rounded-full"
              style={{ backgroundColor: def.secondary, opacity: 0.22 }}
            />
          ))}
        </div>
      </div>

      <div className="relative grid grid-cols-[0.9fr_1.1fr] gap-2 px-3 pt-3">
        <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/70">
          <img src={photo} alt="" className="h-24 w-full object-cover" loading="lazy" />
        </div>

        <div className="pt-2">
          <span
            className="mb-2 block h-2.5 w-16 rounded-full"
            style={{ backgroundColor: def.accent }}
          />
          <span
            className="mb-1.5 block h-4 w-full rounded-full"
            style={{ backgroundColor: def.primary }}
          />
          <span
            className="mb-2 block h-4 w-4/5 rounded-full"
            style={{ backgroundColor: def.primary }}
          />
          <span
            className="mb-1.5 block h-2 w-11/12 rounded-full"
            style={{ backgroundColor: def.secondary, opacity: 0.45 }}
          />
          <span
            className="mb-3 block h-2 w-8/12 rounded-full"
            style={{ backgroundColor: def.secondary, opacity: 0.32 }}
          />
          <div className="flex gap-1.5">
            <span
              className="h-6 w-16 rounded-full"
              style={{ backgroundColor: def.primary }}
            />
            <span className="h-6 w-12 rounded-full bg-white shadow-sm ring-1 ring-slate-200" />
          </div>
        </div>
      </div>

      <div className="relative grid grid-cols-3 gap-1.5 px-3 pt-3">
        {def.features.slice(0, 3).map((feature) => (
          <div
            key={`${def.id}-feature-${feature}`}
            className="h-12 rounded-xl bg-white p-2 shadow-sm ring-1 ring-slate-200/70"
          >
            <span
              className="mb-1 block h-2 w-10 rounded-full"
              style={{ backgroundColor: def.primary }}
            />
            <span
              className="block h-1.5 w-full rounded-full"
              style={{ backgroundColor: def.secondary, opacity: 0.26 }}
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-slate-950/75 to-transparent p-3 pt-10">
        <span className="truncate text-sm font-black text-white">{def.name}</span>
        <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black text-violet-700 shadow-sm">
          החל אתר
        </span>
      </div>
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
