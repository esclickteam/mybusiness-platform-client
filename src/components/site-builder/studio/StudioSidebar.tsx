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


type ReadyWebsiteBlock = {
  type: string;
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
  html: string;
};

type ReadyWebsiteTemplateSeed = Omit<ReadyWebsiteTemplate, "preview" | "html">;

const READY_WEBSITE_TEMPLATE_SEEDS: ReadyWebsiteTemplateSeed[] = [
  {
    "id": "beauty-salon-editorial",
    "name": "Beauty Salon Editorial",
    "category": "beauty",
    "description": "מכון יופי יוקרתי עם תורים, טיפולים, גלריה ומוצרים.",
    "niche": "יופי",
    "layout": "editorial",
    "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1400&q=80",
    "heroTitle": "Beauty Salon Editorial מוכן לעבודה",
    "heroSubtitle": "מכון יופי יוקרתי עם תורים, טיפולים, גלריה ומוצרים.",
    "palette": {
      "primary": "#9D174D",
      "accent": "#F472B6",
      "background": "#FFF1F7",
      "surface": "#ffffff",
      "text": "#0f172a",
      "muted": "#64748b"
    },
    "blocks": [
      {
        "type": "header",
        "title": "Header",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "hero",
        "title": "Hero",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "trust",
        "title": "אמון ומספרים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "services",
        "title": "שירותים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "booking",
        "title": "יומן מחובר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "gallery",
        "title": "גלריה",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "store",
        "title": "חנות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "testimonials",
        "title": "המלצות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "faq",
        "title": "שאלות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "contact",
        "title": "יצירת קשר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      }
    ]
  },
  {
    "id": "barber-dark-split",
    "name": "Barber Dark Split",
    "category": "barber",
    "description": "ברבר שופ כהה עם מחירים, יומן, מוצרים ותמונות לפני אחרי.",
    "niche": "מספרה",
    "layout": "darkSplit",
    "image": "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1400&q=80",
    "heroTitle": "Barber Dark Split מוכן לעבודה",
    "heroSubtitle": "ברבר שופ כהה עם מחירים, יומן, מוצרים ותמונות לפני אחרי.",
    "palette": {
      "primary": "#111827",
      "accent": "#F59E0B",
      "background": "#F8F5EF",
      "surface": "#ffffff",
      "text": "#0f172a",
      "muted": "#64748b"
    },
    "blocks": [
      {
        "type": "header",
        "title": "Header",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "hero",
        "title": "Hero",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "services",
        "title": "שירותים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "pricing",
        "title": "מחירון",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "booking",
        "title": "יומן מחובר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "gallery",
        "title": "גלריה",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "team",
        "title": "צוות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "store",
        "title": "חנות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "testimonials",
        "title": "המלצות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "contact",
        "title": "יצירת קשר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      }
    ]
  },
  {
    "id": "clinic-calendar-first",
    "name": "Clinic Calendar First",
    "category": "clinic",
    "description": "אתר לקליניקה שבו היומן מופיע גבוה וברור עם שעות פנויות.",
    "niche": "קליניקה",
    "layout": "calendarFirst",
    "image": "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1400&q=80",
    "heroTitle": "Clinic Calendar First מוכן לעבודה",
    "heroSubtitle": "אתר לקליניקה שבו היומן מופיע גבוה וברור עם שעות פנויות.",
    "palette": {
      "primary": "#0F766E",
      "accent": "#5EEAD4",
      "background": "#F0FDFA",
      "surface": "#ffffff",
      "text": "#0f172a",
      "muted": "#64748b"
    },
    "blocks": [
      {
        "type": "header",
        "title": "Header",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "hero",
        "title": "Hero",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "booking",
        "title": "יומן מחובר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "services",
        "title": "שירותים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "about",
        "title": "אודות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "doctor",
        "title": "פרופיל מומחה",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "testimonials",
        "title": "המלצות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "faq",
        "title": "שאלות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "lead",
        "title": "טופס ליד",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "contact",
        "title": "יצירת קשר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      }
    ]
  },
  {
    "id": "finance-clean-dashboard",
    "name": "Finance Clean Dashboard",
    "category": "business",
    "description": "רואה חשבון / יועץ מס עם מבנה עסקי, מספרים וטופס פנייה.",
    "niche": "פיננסים",
    "layout": "dashboard",
    "image": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80",
    "heroTitle": "Finance Clean Dashboard מוכן לעבודה",
    "heroSubtitle": "רואה חשבון / יועץ מס עם מבנה עסקי, מספרים וטופס פנייה.",
    "palette": {
      "primary": "#064E3B",
      "accent": "#10B981",
      "background": "#ECFDF5",
      "surface": "#ffffff",
      "text": "#0f172a",
      "muted": "#64748b"
    },
    "blocks": [
      {
        "type": "header",
        "title": "Header",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "hero",
        "title": "Hero",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "stats",
        "title": "נתונים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "services",
        "title": "שירותים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "process",
        "title": "תהליך",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "booking",
        "title": "יומן מחובר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "cases",
        "title": "מקרים / עבודות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "testimonials",
        "title": "המלצות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "faq",
        "title": "שאלות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "contact",
        "title": "יצירת קשר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      }
    ]
  },
  {
    "id": "law-gold-editorial",
    "name": "Law Gold Editorial",
    "category": "law",
    "description": "משרד עורכי דין עם פתיח מכובד, תחומי התמחות וצוות.",
    "niche": "משפטים",
    "layout": "legal",
    "image": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1400&q=80",
    "heroTitle": "Law Gold Editorial מוכן לעבודה",
    "heroSubtitle": "משרד עורכי דין עם פתיח מכובד, תחומי התמחות וצוות.",
    "palette": {
      "primary": "#111827",
      "accent": "#C79A2B",
      "background": "#FFFBEB",
      "surface": "#ffffff",
      "text": "#0f172a",
      "muted": "#64748b"
    },
    "blocks": [
      {
        "type": "header",
        "title": "Header",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "hero",
        "title": "Hero",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "about",
        "title": "אודות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "services",
        "title": "שירותים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "cases",
        "title": "מקרים / עבודות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "team",
        "title": "צוות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "booking",
        "title": "יומן מחובר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "testimonials",
        "title": "המלצות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "faq",
        "title": "שאלות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "contact",
        "title": "יצירת קשר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      }
    ]
  },
  {
    "id": "restaurant-menu-visual",
    "name": "Restaurant Menu Visual",
    "category": "restaurant",
    "description": "מסעדה עם תפריט גדול, גלריה, הזמנת מקום ומבצעים.",
    "niche": "מסעדה",
    "layout": "foodMenu",
    "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80",
    "heroTitle": "Restaurant Menu Visual מוכן לעבודה",
    "heroSubtitle": "מסעדה עם תפריט גדול, גלריה, הזמנת מקום ומבצעים.",
    "palette": {
      "primary": "#7C2D12",
      "accent": "#FB923C",
      "background": "#FFF7ED",
      "surface": "#ffffff",
      "text": "#0f172a",
      "muted": "#64748b"
    },
    "blocks": [
      {
        "type": "header",
        "title": "Header",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "hero",
        "title": "Hero",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "menu",
        "title": "תפריט",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "gallery",
        "title": "גלריה",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "booking",
        "title": "יומן מחובר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "offers",
        "title": "מבצעים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "about",
        "title": "אודות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "testimonials",
        "title": "המלצות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "faq",
        "title": "שאלות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "contact",
        "title": "יצירת קשר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      }
    ]
  },
  {
    "id": "fitness-coach-bold",
    "name": "Fitness Coach Bold",
    "category": "fitness",
    "description": "מאמן כושר עם מסלולים, תוצאות, יומן וחבילות.",
    "niche": "כושר",
    "layout": "bold",
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=80",
    "heroTitle": "Fitness Coach Bold מוכן לעבודה",
    "heroSubtitle": "מאמן כושר עם מסלולים, תוצאות, יומן וחבילות.",
    "palette": {
      "primary": "#020617",
      "accent": "#84CC16",
      "background": "#F7FEE7",
      "surface": "#ffffff",
      "text": "#0f172a",
      "muted": "#64748b"
    },
    "blocks": [
      {
        "type": "header",
        "title": "Header",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "hero",
        "title": "Hero",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "programs",
        "title": "תוכניות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "results",
        "title": "תוצאות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "pricing",
        "title": "מחירון",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "booking",
        "title": "יומן מחובר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "gallery",
        "title": "גלריה",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "testimonials",
        "title": "המלצות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "faq",
        "title": "שאלות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "contact",
        "title": "יצירת קשר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      }
    ]
  },
  {
    "id": "realestate-listings-map",
    "name": "Real Estate Listings Map",
    "category": "realestate",
    "description": "נדל״ן עם נכסים, חיפוש, מפה וטופס ליד.",
    "niche": "נדלן",
    "layout": "listings",
    "image": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=80",
    "heroTitle": "Real Estate Listings Map מוכן לעבודה",
    "heroSubtitle": "נדל״ן עם נכסים, חיפוש, מפה וטופס ליד.",
    "palette": {
      "primary": "#0F172A",
      "accent": "#38BDF8",
      "background": "#F8FAFC",
      "surface": "#ffffff",
      "text": "#0f172a",
      "muted": "#64748b"
    },
    "blocks": [
      {
        "type": "header",
        "title": "Header",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "hero",
        "title": "Hero",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "search",
        "title": "חיפוש",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "listings",
        "title": "נכסים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "map",
        "title": "מפה",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "services",
        "title": "שירותים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "about",
        "title": "אודות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "testimonials",
        "title": "המלצות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "faq",
        "title": "שאלות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "lead",
        "title": "טופס ליד",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      }
    ]
  },
  {
    "id": "photographer-masonry",
    "name": "Photographer Masonry",
    "category": "portfolio",
    "description": "פורטפוליו צילום עם גלריית Masonry, חבילות והזמנה.",
    "niche": "צילום",
    "layout": "masonry",
    "image": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1400&q=80",
    "heroTitle": "Photographer Masonry מוכן לעבודה",
    "heroSubtitle": "פורטפוליו צילום עם גלריית Masonry, חבילות והזמנה.",
    "palette": {
      "primary": "#18181B",
      "accent": "#A855F7",
      "background": "#FAFAFA",
      "surface": "#ffffff",
      "text": "#0f172a",
      "muted": "#64748b"
    },
    "blocks": [
      {
        "type": "header",
        "title": "Header",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "hero",
        "title": "Hero",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "gallery",
        "title": "גלריה",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "services",
        "title": "שירותים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "packages",
        "title": "חבילות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "booking",
        "title": "יומן מחובר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "about",
        "title": "אודות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "testimonials",
        "title": "המלצות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "faq",
        "title": "שאלות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "contact",
        "title": "יצירת קשר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      }
    ]
  },
  {
    "id": "event-planner-luxury",
    "name": "Event Planner Luxury",
    "category": "events",
    "description": "מפיקת אירועים עם גלריה רחבה, חבילות וטופס ליד.",
    "niche": "אירועים",
    "layout": "luxury",
    "image": "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=80",
    "heroTitle": "Event Planner Luxury מוכן לעבודה",
    "heroSubtitle": "מפיקת אירועים עם גלריה רחבה, חבילות וטופס ליד.",
    "palette": {
      "primary": "#581C87",
      "accent": "#FBBF24",
      "background": "#FDF4FF",
      "surface": "#ffffff",
      "text": "#0f172a",
      "muted": "#64748b"
    },
    "blocks": [
      {
        "type": "header",
        "title": "Header",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "hero",
        "title": "Hero",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "gallery",
        "title": "גלריה",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "packages",
        "title": "חבילות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "process",
        "title": "תהליך",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "booking",
        "title": "יומן מחובר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "vendors",
        "title": "ספקים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "testimonials",
        "title": "המלצות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "faq",
        "title": "שאלות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "contact",
        "title": "יצירת קשר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      }
    ]
  },
  {
    "id": "agency-case-study",
    "name": "Agency Case Study",
    "category": "agency",
    "description": "סוכנות שיווק עם תיק עבודות, תוצאות, שירותים ולידים.",
    "niche": "סוכנות",
    "layout": "caseStudy",
    "image": "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80",
    "heroTitle": "Agency Case Study מוכן לעבודה",
    "heroSubtitle": "סוכנות שיווק עם תיק עבודות, תוצאות, שירותים ולידים.",
    "palette": {
      "primary": "#1E1B4B",
      "accent": "#8B5CF6",
      "background": "#F5F3FF",
      "surface": "#ffffff",
      "text": "#0f172a",
      "muted": "#64748b"
    },
    "blocks": [
      {
        "type": "header",
        "title": "Header",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "hero",
        "title": "Hero",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "logos",
        "title": "לקוחות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "services",
        "title": "שירותים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "cases",
        "title": "מקרים / עבודות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "process",
        "title": "תהליך",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "pricing",
        "title": "מחירון",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "testimonials",
        "title": "המלצות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "faq",
        "title": "שאלות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "lead",
        "title": "טופס ליד",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      }
    ]
  },
  {
    "id": "course-creator-sidebar",
    "name": "Course Creator Sidebar",
    "category": "education",
    "description": "אתר לקורס דיגיטלי עם סילבוס, הרשמה ותוכן.",
    "niche": "קורסים",
    "layout": "course",
    "image": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80",
    "heroTitle": "Course Creator Sidebar מוכן לעבודה",
    "heroSubtitle": "אתר לקורס דיגיטלי עם סילבוס, הרשמה ותוכן.",
    "palette": {
      "primary": "#1D4ED8",
      "accent": "#F97316",
      "background": "#EFF6FF",
      "surface": "#ffffff",
      "text": "#0f172a",
      "muted": "#64748b"
    },
    "blocks": [
      {
        "type": "header",
        "title": "Header",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "hero",
        "title": "Hero",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "curriculum",
        "title": "סילבוס",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "benefits",
        "title": "יתרונות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "pricing",
        "title": "מחירון",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "booking",
        "title": "יומן מחובר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "testimonials",
        "title": "המלצות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "faq",
        "title": "שאלות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "store",
        "title": "חנות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "contact",
        "title": "יצירת קשר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      }
    ]
  },
  {
    "id": "store-fashion-catalog",
    "name": "Fashion Store Catalog",
    "category": "store",
    "description": "חנות אופנה עם קטלוג, מוצרים, מבצע ועגלה.",
    "niche": "חנות",
    "layout": "catalog",
    "image": "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=80",
    "heroTitle": "Fashion Store Catalog מוכן לעבודה",
    "heroSubtitle": "חנות אופנה עם קטלוג, מוצרים, מבצע ועגלה.",
    "palette": {
      "primary": "#BE123C",
      "accent": "#FB7185",
      "background": "#FFF1F2",
      "surface": "#ffffff",
      "text": "#0f172a",
      "muted": "#64748b"
    },
    "blocks": [
      {
        "type": "header",
        "title": "Header",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "hero",
        "title": "Hero",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "categories",
        "title": "קטגוריות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "store",
        "title": "חנות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "featured",
        "title": "מומלצים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "benefits",
        "title": "יתרונות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "reviews",
        "title": "ביקורות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "faq",
        "title": "שאלות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "lead",
        "title": "טופס ליד",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "contact",
        "title": "יצירת קשר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      }
    ]
  },
  {
    "id": "jewelry-premium-grid",
    "name": "Jewelry Premium Grid",
    "category": "store",
    "description": "חנות תכשיטים יוקרתית עם מוצרי דמו להחלפה.",
    "niche": "תכשיטים",
    "layout": "jewelry",
    "image": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1400&q=80",
    "heroTitle": "Jewelry Premium Grid מוכן לעבודה",
    "heroSubtitle": "חנות תכשיטים יוקרתית עם מוצרי דמו להחלפה.",
    "palette": {
      "primary": "#78350F",
      "accent": "#F59E0B",
      "background": "#FFFBEB",
      "surface": "#ffffff",
      "text": "#0f172a",
      "muted": "#64748b"
    },
    "blocks": [
      {
        "type": "header",
        "title": "Header",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "hero",
        "title": "Hero",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "collection",
        "title": "קולקציה",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "store",
        "title": "חנות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "story",
        "title": "סיפור מותג",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "gallery",
        "title": "גלריה",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "reviews",
        "title": "ביקורות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "faq",
        "title": "שאלות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "booking",
        "title": "יומן מחובר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "contact",
        "title": "יצירת קשר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      }
    ]
  },
  {
    "id": "plumber-service-fast",
    "name": "Plumber Service Fast",
    "category": "service",
    "description": "אינסטלטור / טכנאי עם קריאה מהירה, אזורי שירות ולידים.",
    "niche": "בעלי מקצוע",
    "layout": "emergency",
    "image": "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=1400&q=80",
    "heroTitle": "Plumber Service Fast מוכן לעבודה",
    "heroSubtitle": "אינסטלטור / טכנאי עם קריאה מהירה, אזורי שירות ולידים.",
    "palette": {
      "primary": "#075985",
      "accent": "#F97316",
      "background": "#F0F9FF",
      "surface": "#ffffff",
      "text": "#0f172a",
      "muted": "#64748b"
    },
    "blocks": [
      {
        "type": "header",
        "title": "Header",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "hero",
        "title": "Hero",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "emergency",
        "title": "קריאה מהירה",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "services",
        "title": "שירותים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "areas",
        "title": "אזורי שירות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "pricing",
        "title": "מחירון",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "booking",
        "title": "יומן מחובר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "reviews",
        "title": "ביקורות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "faq",
        "title": "שאלות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "contact",
        "title": "יצירת קשר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      }
    ]
  },
  {
    "id": "electrician-tech-cards",
    "name": "Electrician Tech Cards",
    "category": "service",
    "description": "חשמלאי עם כרטיסי שירות, זמינות וטופס מהיר.",
    "niche": "חשמל",
    "layout": "techCards",
    "image": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1400&q=80",
    "heroTitle": "Electrician Tech Cards מוכן לעבודה",
    "heroSubtitle": "חשמלאי עם כרטיסי שירות, זמינות וטופס מהיר.",
    "palette": {
      "primary": "#0F172A",
      "accent": "#FACC15",
      "background": "#FEFCE8",
      "surface": "#ffffff",
      "text": "#0f172a",
      "muted": "#64748b"
    },
    "blocks": [
      {
        "type": "header",
        "title": "Header",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "hero",
        "title": "Hero",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "services",
        "title": "שירותים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "process",
        "title": "תהליך",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "pricing",
        "title": "מחירון",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "booking",
        "title": "יומן מחובר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "gallery",
        "title": "גלריה",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "reviews",
        "title": "ביקורות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "faq",
        "title": "שאלות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "contact",
        "title": "יצירת קשר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      }
    ]
  },
  {
    "id": "gardening-organic",
    "name": "Gardening Organic",
    "category": "garden",
    "description": "גינון והדברה עם אזורי שירות, תמונות, יומן והצעת מחיר.",
    "niche": "גינון",
    "layout": "organic",
    "image": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1400&q=80",
    "heroTitle": "Gardening Organic מוכן לעבודה",
    "heroSubtitle": "גינון והדברה עם אזורי שירות, תמונות, יומן והצעת מחיר.",
    "palette": {
      "primary": "#166534",
      "accent": "#84CC16",
      "background": "#F0FDF4",
      "surface": "#ffffff",
      "text": "#0f172a",
      "muted": "#64748b"
    },
    "blocks": [
      {
        "type": "header",
        "title": "Header",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "hero",
        "title": "Hero",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "services",
        "title": "שירותים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "gallery",
        "title": "גלריה",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "process",
        "title": "תהליך",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "booking",
        "title": "יומן מחובר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "areas",
        "title": "אזורי שירות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "reviews",
        "title": "ביקורות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "faq",
        "title": "שאלות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "contact",
        "title": "יצירת קשר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      }
    ]
  },
  {
    "id": "architect-studio-lines",
    "name": "Architect Studio Lines",
    "category": "design",
    "description": "אדריכלות ועיצוב פנים עם פרויקטים, קו נקי וטופס פנייה.",
    "niche": "אדריכלות",
    "layout": "minimalLines",
    "image": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",
    "heroTitle": "Architect Studio Lines מוכן לעבודה",
    "heroSubtitle": "אדריכלות ועיצוב פנים עם פרויקטים, קו נקי וטופס פנייה.",
    "palette": {
      "primary": "#1F2937",
      "accent": "#D97706",
      "background": "#F9FAFB",
      "surface": "#ffffff",
      "text": "#0f172a",
      "muted": "#64748b"
    },
    "blocks": [
      {
        "type": "header",
        "title": "Header",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "hero",
        "title": "Hero",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "projects",
        "title": "פרויקטים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "services",
        "title": "שירותים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "process",
        "title": "תהליך",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "about",
        "title": "אודות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "booking",
        "title": "יומן מחובר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "testimonials",
        "title": "המלצות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "faq",
        "title": "שאלות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "contact",
        "title": "יצירת קשר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      }
    ]
  },
  {
    "id": "interior-design-magazine",
    "name": "Interior Design Magazine",
    "category": "design",
    "description": "אתר מגזיני לעיצוב פנים עם תמונות גדולות וחבילות.",
    "niche": "עיצוב פנים",
    "layout": "magazine",
    "image": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80",
    "heroTitle": "Interior Design Magazine מוכן לעבודה",
    "heroSubtitle": "אתר מגזיני לעיצוב פנים עם תמונות גדולות וחבילות.",
    "palette": {
      "primary": "#3F2E2E",
      "accent": "#EAB308",
      "background": "#FAF7F2",
      "surface": "#ffffff",
      "text": "#0f172a",
      "muted": "#64748b"
    },
    "blocks": [
      {
        "type": "header",
        "title": "Header",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "hero",
        "title": "Hero",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "gallery",
        "title": "גלריה",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "services",
        "title": "שירותים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "packages",
        "title": "חבילות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "process",
        "title": "תהליך",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "booking",
        "title": "יומן מחובר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "reviews",
        "title": "ביקורות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "faq",
        "title": "שאלות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "contact",
        "title": "יצירת קשר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      }
    ]
  },
  {
    "id": "makeup-artist-soft",
    "name": "Makeup Artist Soft",
    "category": "beauty",
    "description": "מאפרת עם גלריית כלות, חבילות ותיאום פגישת ניסיון.",
    "niche": "איפור",
    "layout": "softCards",
    "image": "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1400&q=80",
    "heroTitle": "Makeup Artist Soft מוכן לעבודה",
    "heroSubtitle": "מאפרת עם גלריית כלות, חבילות ותיאום פגישת ניסיון.",
    "palette": {
      "primary": "#BE185D",
      "accent": "#F9A8D4",
      "background": "#FFF7FB",
      "surface": "#ffffff",
      "text": "#0f172a",
      "muted": "#64748b"
    },
    "blocks": [
      {
        "type": "header",
        "title": "Header",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "hero",
        "title": "Hero",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "gallery",
        "title": "גלריה",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "services",
        "title": "שירותים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "packages",
        "title": "חבילות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "booking",
        "title": "יומן מחובר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "about",
        "title": "אודות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "reviews",
        "title": "ביקורות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "faq",
        "title": "שאלות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "contact",
        "title": "יצירת קשר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      }
    ]
  },
  {
    "id": "tattoo-artist-dark-gallery",
    "name": "Tattoo Artist Dark Gallery",
    "category": "tattoo",
    "description": "סטודיו קעקועים עם גלריה כהה, קטלוג ותיאום פגישה.",
    "niche": "קעקועים",
    "layout": "darkGallery",
    "image": "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1400&q=80",
    "heroTitle": "Tattoo Artist Dark Gallery מוכן לעבודה",
    "heroSubtitle": "סטודיו קעקועים עם גלריה כהה, קטלוג ותיאום פגישה.",
    "palette": {
      "primary": "#030712",
      "accent": "#EF4444",
      "background": "#111827",
      "surface": "#ffffff",
      "text": "#0f172a",
      "muted": "#64748b"
    },
    "blocks": [
      {
        "type": "header",
        "title": "Header",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "hero",
        "title": "Hero",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "gallery",
        "title": "גלריה",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "services",
        "title": "שירותים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "artist",
        "title": "אמן",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "booking",
        "title": "יומן מחובר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "store",
        "title": "חנות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "reviews",
        "title": "ביקורות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "faq",
        "title": "שאלות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "contact",
        "title": "יצירת קשר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      }
    ]
  },
  {
    "id": "hotel-boutique-booking",
    "name": "Boutique Hotel Booking",
    "category": "hotel",
    "description": "מלון בוטיק עם חדרים, הזמנה, גלריה ומיקום.",
    "niche": "מלון",
    "layout": "hotel",
    "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80",
    "heroTitle": "Boutique Hotel Booking מוכן לעבודה",
    "heroSubtitle": "מלון בוטיק עם חדרים, הזמנה, גלריה ומיקום.",
    "palette": {
      "primary": "#1E3A8A",
      "accent": "#FBBF24",
      "background": "#EFF6FF",
      "surface": "#ffffff",
      "text": "#0f172a",
      "muted": "#64748b"
    },
    "blocks": [
      {
        "type": "header",
        "title": "Header",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "hero",
        "title": "Hero",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "rooms",
        "title": "חדרים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "booking",
        "title": "יומן מחובר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "gallery",
        "title": "גלריה",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "amenities",
        "title": "מתקנים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "map",
        "title": "מפה",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "reviews",
        "title": "ביקורות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "faq",
        "title": "שאלות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "contact",
        "title": "יצירת קשר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      }
    ]
  },
  {
    "id": "car-detailing-speed",
    "name": "Car Detailing Speed",
    "category": "auto",
    "description": "שטיפת רכבים / דיטיילינג עם חבילות, תור ומוצרים.",
    "niche": "רכב",
    "layout": "speed",
    "image": "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1400&q=80",
    "heroTitle": "Car Detailing Speed מוכן לעבודה",
    "heroSubtitle": "שטיפת רכבים / דיטיילינג עם חבילות, תור ומוצרים.",
    "palette": {
      "primary": "#020617",
      "accent": "#06B6D4",
      "background": "#F0FDFF",
      "surface": "#ffffff",
      "text": "#0f172a",
      "muted": "#64748b"
    },
    "blocks": [
      {
        "type": "header",
        "title": "Header",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "hero",
        "title": "Hero",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "services",
        "title": "שירותים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "packages",
        "title": "חבילות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "gallery",
        "title": "גלריה",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "booking",
        "title": "יומן מחובר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "store",
        "title": "חנות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "reviews",
        "title": "ביקורות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "faq",
        "title": "שאלות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "contact",
        "title": "יצירת קשר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      }
    ]
  },
  {
    "id": "pet-grooming-fun",
    "name": "Pet Grooming Fun",
    "category": "pets",
    "description": "מספרת כלבים / פנסיון עם מבנה צבעוני, גלריה ויומן.",
    "niche": "חיות",
    "layout": "playful",
    "image": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1400&q=80",
    "heroTitle": "Pet Grooming Fun מוכן לעבודה",
    "heroSubtitle": "מספרת כלבים / פנסיון עם מבנה צבעוני, גלריה ויומן.",
    "palette": {
      "primary": "#7C3AED",
      "accent": "#F97316",
      "background": "#FFF7ED",
      "surface": "#ffffff",
      "text": "#0f172a",
      "muted": "#64748b"
    },
    "blocks": [
      {
        "type": "header",
        "title": "Header",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "hero",
        "title": "Hero",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "services",
        "title": "שירותים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "gallery",
        "title": "גלריה",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "booking",
        "title": "יומן מחובר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "store",
        "title": "חנות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "about",
        "title": "אודות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "reviews",
        "title": "ביקורות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "faq",
        "title": "שאלות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "contact",
        "title": "יצירת קשר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      }
    ]
  },
  {
    "id": "therapist-calm",
    "name": "Therapist Calm",
    "category": "therapy",
    "description": "מטפלת רגשית / NLP עם עיצוב רגוע, אמון ויומן.",
    "niche": "טיפול",
    "layout": "calm",
    "image": "https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&w=1400&q=80",
    "heroTitle": "Therapist Calm מוכן לעבודה",
    "heroSubtitle": "מטפלת רגשית / NLP עם עיצוב רגוע, אמון ויומן.",
    "palette": {
      "primary": "#0F766E",
      "accent": "#A7F3D0",
      "background": "#F0FDFA",
      "surface": "#ffffff",
      "text": "#0f172a",
      "muted": "#64748b"
    },
    "blocks": [
      {
        "type": "header",
        "title": "Header",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "hero",
        "title": "Hero",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "about",
        "title": "אודות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "services",
        "title": "שירותים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "booking",
        "title": "יומן מחובר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "process",
        "title": "תהליך",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "testimonials",
        "title": "המלצות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "faq",
        "title": "שאלות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "lead",
        "title": "טופס ליד",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "contact",
        "title": "יצירת קשר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      }
    ]
  },
  {
    "id": "travel-guide-adventure",
    "name": "Travel Guide Adventure",
    "category": "travel",
    "description": "מדריך טיולים עם מסלולים, גלריה, הזמנה וקבוצות.",
    "niche": "טיולים",
    "layout": "adventure",
    "image": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    "heroTitle": "Travel Guide Adventure מוכן לעבודה",
    "heroSubtitle": "מדריך טיולים עם מסלולים, גלריה, הזמנה וקבוצות.",
    "palette": {
      "primary": "#065F46",
      "accent": "#F59E0B",
      "background": "#ECFDF5",
      "surface": "#ffffff",
      "text": "#0f172a",
      "muted": "#64748b"
    },
    "blocks": [
      {
        "type": "header",
        "title": "Header",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "hero",
        "title": "Hero",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "routes",
        "title": "מסלולים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "gallery",
        "title": "גלריה",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "packages",
        "title": "חבילות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "booking",
        "title": "יומן מחובר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "about",
        "title": "אודות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "reviews",
        "title": "ביקורות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "faq",
        "title": "שאלות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "contact",
        "title": "יצירת קשר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      }
    ]
  },
  {
    "id": "music-school-stage",
    "name": "Music School Stage",
    "category": "education",
    "description": "בית ספר למוזיקה עם שיעורים, מורים, יומן והרשמה.",
    "niche": "מוזיקה",
    "layout": "stage",
    "image": "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1400&q=80",
    "heroTitle": "Music School Stage מוכן לעבודה",
    "heroSubtitle": "בית ספר למוזיקה עם שיעורים, מורים, יומן והרשמה.",
    "palette": {
      "primary": "#312E81",
      "accent": "#EC4899",
      "background": "#F5F3FF",
      "surface": "#ffffff",
      "text": "#0f172a",
      "muted": "#64748b"
    },
    "blocks": [
      {
        "type": "header",
        "title": "Header",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "hero",
        "title": "Hero",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "lessons",
        "title": "שיעורים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "teachers",
        "title": "מורים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "booking",
        "title": "יומן מחובר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "plans",
        "title": "מסלולים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "gallery",
        "title": "גלריה",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "reviews",
        "title": "ביקורות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "faq",
        "title": "שאלות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "contact",
        "title": "יצירת קשר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      }
    ]
  },
  {
    "id": "kindergarten-friendly",
    "name": "Kindergarten Friendly",
    "category": "education",
    "description": "גן ילדים עם מבנה חם, ערכים, גלריה וטופס הרשמה.",
    "niche": "גן ילדים",
    "layout": "friendly",
    "image": "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1400&q=80",
    "heroTitle": "Kindergarten Friendly מוכן לעבודה",
    "heroSubtitle": "גן ילדים עם מבנה חם, ערכים, גלריה וטופס הרשמה.",
    "palette": {
      "primary": "#0EA5E9",
      "accent": "#FBBF24",
      "background": "#F0F9FF",
      "surface": "#ffffff",
      "text": "#0f172a",
      "muted": "#64748b"
    },
    "blocks": [
      {
        "type": "header",
        "title": "Header",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "hero",
        "title": "Hero",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "values",
        "title": "ערכים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "gallery",
        "title": "גלריה",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "program",
        "title": "תוכנית",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "team",
        "title": "צוות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "faq",
        "title": "שאלות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "lead",
        "title": "טופס ליד",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "reviews",
        "title": "ביקורות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "contact",
        "title": "יצירת קשר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      }
    ]
  },
  {
    "id": "saas-product-modern",
    "name": "SaaS Product Modern",
    "category": "saas",
    "description": "אתר מוצר SaaS עם פיצ׳רים, מחירים, דמו ולידים.",
    "niche": "סטארטאפ",
    "layout": "saas",
    "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
    "heroTitle": "SaaS Product Modern מוכן לעבודה",
    "heroSubtitle": "אתר מוצר SaaS עם פיצ׳רים, מחירים, דמו ולידים.",
    "palette": {
      "primary": "#4C1D95",
      "accent": "#22C55E",
      "background": "#F5F3FF",
      "surface": "#ffffff",
      "text": "#0f172a",
      "muted": "#64748b"
    },
    "blocks": [
      {
        "type": "header",
        "title": "Header",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "hero",
        "title": "Hero",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "features",
        "title": "פיצ׳רים",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "dashboard",
        "title": "דשבורד",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "pricing",
        "title": "מחירון",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "process",
        "title": "תהליך",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "testimonials",
        "title": "המלצות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "faq",
        "title": "שאלות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "lead",
        "title": "טופס ליד",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "contact",
        "title": "יצירת קשר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      }
    ]
  },
  {
    "id": "landing-launch-offer",
    "name": "Landing Launch Offer",
    "category": "landing",
    "description": "דף נחיתה חד לעסק, מבצע, הוכחות וטופס ליד.",
    "niche": "דף נחיתה",
    "layout": "landing",
    "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80",
    "heroTitle": "Landing Launch Offer מוכן לעבודה",
    "heroSubtitle": "דף נחיתה חד לעסק, מבצע, הוכחות וטופס ליד.",
    "palette": {
      "primary": "#BE123C",
      "accent": "#22C55E",
      "background": "#FFF1F2",
      "surface": "#ffffff",
      "text": "#0f172a",
      "muted": "#64748b"
    },
    "blocks": [
      {
        "type": "header",
        "title": "Header",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "hero",
        "title": "Hero",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "offer",
        "title": "הצעה",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "benefits",
        "title": "יתרונות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "proof",
        "title": "הוכחות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "pricing",
        "title": "מחירון",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "faq",
        "title": "שאלות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "lead",
        "title": "טופס ליד",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "testimonials",
        "title": "המלצות",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      },
      {
        "type": "contact",
        "title": "יצירת קשר",
        "text": "בלוק מלא לעריכה עם תוכן דמו, תמונות דמו וחיבור דינמי כשצריך."
      }
    ]
  }
];

const readyWebsiteTemplates: ReadyWebsiteTemplate[] = READY_WEBSITE_TEMPLATE_SEEDS.map(
  (template) => ({
    ...template,
    preview: template.image,
    html: buildReadyWebsiteHtml(template),
  })
);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildReadyWebsiteHtml(template: ReadyWebsiteTemplateSeed) {
  const p = template.palette;
  const blockOrder = template.blocks.map((block) => block.type);
  const blocksHtml = blockOrder
    .filter((type) => type !== "header" && type !== "hero")
    .map((type, index) => renderReadyBlock(type, template, index))
    .join("\n");

  return `
<section class="bzw-site bzw-${template.layout}" data-bizuply-ready-template="${template.id}" dir="rtl" style="--bzw-primary:${p.primary};--bzw-accent:${p.accent};--bzw-bg:${p.background};--bzw-surface:${p.surface};--bzw-text:${p.text};--bzw-muted:${p.muted};--bzw-image:url('${template.image}');font-family:Heebo,Arial,sans-serif;background:var(--bzw-bg);color:var(--bzw-text);overflow:hidden;">
  <style>
    .bzw-site *{box-sizing:border-box}.bzw-site{border-radius:34px;min-height:100%;}.bzw-site .wrap{width:min(1120px,calc(100% - 44px));margin:0 auto}.bzw-site .top{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:22px 0}.bzw-site .brand{font-size:23px;font-weight:1000;letter-spacing:-.05em;color:var(--bzw-primary)}.bzw-site .nav{display:flex;gap:9px;flex-wrap:wrap}.bzw-site .nav span{border:1px solid rgba(15,23,42,.09);background:rgba(255,255,255,.72);border-radius:999px;padding:9px 13px;font-size:13px;font-weight:900;color:var(--bzw-muted)}.bzw-site .btn{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 20px;border-radius:999px;border:0;background:var(--bzw-primary);color:#fff;text-decoration:none;font-weight:1000;box-shadow:0 18px 44px rgba(15,23,42,.16)}.bzw-site .btn.alt{background:#fff;color:var(--bzw-primary);border:1px solid rgba(15,23,42,.1);box-shadow:none}.bzw-site .hero{padding:42px 0 52px}.bzw-site h1{margin:0;font-size:clamp(42px,6vw,84px);line-height:.92;letter-spacing:-.075em;font-weight:1000;color:var(--bzw-primary)}.bzw-site h2{margin:8px 0 0;font-size:clamp(30px,4vw,54px);line-height:1;letter-spacing:-.055em;font-weight:1000;color:var(--bzw-primary)}.bzw-site p{font-size:17px;line-height:1.8;font-weight:800;color:var(--bzw-muted)}.bzw-site .eyebrow{font-size:13px;font-weight:1000;color:var(--bzw-accent)}.bzw-site .section{padding:54px 0}.bzw-site .section-head{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:24px}.bzw-site .card{background:var(--bzw-surface);border:1px solid rgba(15,23,42,.09);border-radius:28px;padding:24px;box-shadow:0 18px 54px rgba(15,23,42,.07)}.bzw-site .card h3{margin:0;font-size:22px;font-weight:1000;color:var(--bzw-primary)}.bzw-site .grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.bzw-site .grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.bzw-site .photo{min-height:240px;border-radius:32px;background-image:linear-gradient(180deg,rgba(0,0,0,.03),rgba(0,0,0,.2)),var(--bzw-image);background-size:cover;background-position:center;position:relative;box-shadow:0 24px 70px rgba(15,23,42,.16)}.bzw-site .photo:after{content:'תמונה להחלפה';position:absolute;left:16px;top:16px;background:#fff;color:var(--bzw-primary);border-radius:999px;padding:8px 12px;font-size:12px;font-weight:1000}.bzw-site .price{font-size:21px;font-weight:1000;color:var(--bzw-accent);margin-top:14px}.bzw-site .calendar-box{background:#fff;border:1px solid rgba(15,23,42,.09);border-radius:32px;padding:24px;box-shadow:0 24px 74px rgba(15,23,42,.08)}.bzw-site .calendar-ui{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:18px}.bzw-site .days{display:grid;grid-template-columns:repeat(7,1fr);gap:7px}.bzw-site .day{aspect-ratio:1;border-radius:13px;border:1px solid rgba(15,23,42,.08);background:var(--bzw-bg);display:grid;place-items:center;font-size:12px;font-weight:1000;color:var(--bzw-primary)}.bzw-site .day.on{background:var(--bzw-primary);color:#fff}.bzw-site .times{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;align-content:start}.bzw-site .time{min-height:43px;border-radius:15px;border:1px solid rgba(15,23,42,.08);background:var(--bzw-bg);font-weight:1000;color:var(--bzw-primary)}.bzw-site input,.bzw-site textarea{width:100%;border:1px solid rgba(15,23,42,.11);border-radius:17px;padding:15px 17px;margin-bottom:11px;font-weight:850;outline:none}.bzw-site .footer{padding:28px 0;border-top:1px solid rgba(15,23,42,.09);font-weight:900;color:var(--bzw-muted)}
    .bzw-editorial .hero{display:grid;grid-template-columns:.85fr 1.15fr;gap:36px;align-items:center}.bzw-editorial .hero-media{display:grid;grid-template-columns:1fr .55fr;gap:14px}.bzw-editorial .hero-media .photo:first-child{min-height:520px}.bzw-editorial .hero-media .photo:nth-child(2){min-height:250px;margin-top:70px}
    .bzw-darkSplit{background:#050505!important;color:#fff}.bzw-darkSplit .top,.bzw-darkSplit .section{background:#050505}.bzw-darkSplit h1,.bzw-darkSplit h2,.bzw-darkSplit .brand{color:#fff}.bzw-darkSplit .hero{display:grid;grid-template-columns:1.1fr .9fr;gap:34px;align-items:center}.bzw-darkSplit .card{background:#111827;color:#fff;border-color:rgba(255,255,255,.12)}.bzw-darkSplit p{color:rgba(255,255,255,.72)}
    .bzw-calendarFirst .hero{display:grid;grid-template-columns:.9fr 1.1fr;gap:26px;align-items:center}.bzw-calendarFirst .hero .calendar-box{order:-1}.bzw-calendarFirst .hero h1{font-size:clamp(38px,5vw,70px)}
    .bzw-dashboard .hero{display:grid;grid-template-columns:1fr 1fr;gap:26px}.bzw-dashboard .hero-dashboard{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.bzw-dashboard .hero-dashboard .card{min-height:140px}.bzw-dashboard .hero-dashboard .card:first-child{grid-column:span 2;background:var(--bzw-primary);color:#fff}.bzw-dashboard .hero-dashboard .card:first-child h3{color:#fff}
    .bzw-legal .hero{display:grid;grid-template-columns:.75fr 1.25fr;gap:30px;border-top:1px solid rgba(15,23,42,.16);border-bottom:1px solid rgba(15,23,42,.16)}.bzw-legal .hero h1{font-family:Georgia,serif;letter-spacing:-.045em}.bzw-legal .card{border-radius:8px}.bzw-legal .btn{border-radius:8px}
    .bzw-foodMenu .hero{display:grid;grid-template-columns:1fr 1fr;gap:28px}.bzw-foodMenu .menu-board{background:var(--bzw-primary);border-radius:40px;padding:34px;color:#fff}.bzw-foodMenu .menu-row{display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,.25);padding:13px 0;font-weight:1000}.bzw-foodMenu h2{font-family:Georgia,serif}
    .bzw-bold .hero{text-align:center;max-width:980px;margin:0 auto}.bzw-bold .hero h1{font-size:clamp(54px,8vw,110px)}.bzw-bold .hero-strip{margin-top:28px;display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.bzw-bold .photo{min-height:180px}.bzw-bold .card{background:#020617;color:#fff}.bzw-bold .card h3{color:#fff}
    .bzw-listings .hero{display:grid;grid-template-columns:1fr .9fr;gap:24px}.bzw-listings .searchbar{display:grid;grid-template-columns:2fr 1fr 1fr auto;gap:10px;background:#fff;border-radius:28px;padding:12px;margin-top:24px;box-shadow:0 20px 60px rgba(15,23,42,.08)}.bzw-listings .listing{display:grid;grid-template-columns:120px 1fr;gap:14px;align-items:center}
    .bzw-masonry .hero{display:grid;grid-template-columns:.8fr 1.2fr;gap:22px}.bzw-masonry .masonry{columns:3 220px;column-gap:16px}.bzw-masonry .masonry .photo{break-inside:avoid;margin:0 0 16px;min-height:180px}.bzw-masonry .masonry .photo:nth-child(2n){min-height:280px}
    .bzw-luxury .hero{text-align:center}.bzw-luxury .hero h1{font-family:Georgia,serif}.bzw-luxury .wide-photo{min-height:430px;margin-top:28px;border-radius:44px}.bzw-luxury .card{border-radius:999px;text-align:center}
    .bzw-caseStudy .hero{display:grid;grid-template-columns:1.05fr .95fr;gap:24px}.bzw-caseStudy .case-wall{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;transform:rotate(-2deg)}.bzw-caseStudy .case-wall .card:nth-child(2){transform:translateY(38px)}
    .bzw-course .hero{display:grid;grid-template-columns:.65fr 1.35fr;gap:28px}.bzw-course .lesson-list{background:#fff;border-radius:30px;padding:20px;box-shadow:0 24px 70px rgba(15,23,42,.08)}.bzw-course .lesson{display:flex;justify-content:space-between;padding:14px;border-bottom:1px solid rgba(15,23,42,.08);font-weight:1000}
    .bzw-catalog .hero{display:grid;grid-template-columns:1fr 1fr;gap:24px}.bzw-catalog .product-collage{display:grid;grid-template-columns:repeat(2,1fr);gap:13px}.bzw-catalog .product-collage .photo{min-height:220px}.bzw-catalog .product-collage .photo:nth-child(1){grid-row:span 2}
    .bzw-jewelry .hero{display:grid;grid-template-columns:1fr 1fr;gap:24px}.bzw-jewelry .hero .photo{border-radius:50%;min-height:470px}.bzw-jewelry .card{border-radius:999px;text-align:center}.bzw-jewelry h1{font-family:Georgia,serif}
    .bzw-emergency .hero{display:grid;grid-template-columns:1.15fr .85fr;gap:24px}.bzw-emergency .callbox{background:var(--bzw-primary);color:#fff;border-radius:34px;padding:34px}.bzw-emergency .callbox h2{color:#fff}.bzw-emergency .top{position:sticky;top:0;background:rgba(255,255,255,.88);backdrop-filter:blur(14px);z-index:2}
    .bzw-techCards .hero{display:grid;grid-template-columns:.9fr 1.1fr;gap:22px}.bzw-techCards .tech-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.bzw-techCards .tech-grid .card{min-height:170px;border-radius:22px}.bzw-techCards .tech-grid .card:nth-child(odd){background:var(--bzw-primary);}.bzw-techCards .tech-grid .card:nth-child(odd) h3{color:#fff}
    .bzw-organic .hero{display:grid;grid-template-columns:1fr 1fr;gap:26px}.bzw-organic .photo{border-radius:80px 22px 80px 22px}.bzw-organic .card{border-radius:34px 12px 34px 12px}
    .bzw-minimalLines .hero{display:grid;grid-template-columns:.55fr 1.45fr;gap:30px;border-bottom:1px solid rgba(15,23,42,.14)}.bzw-minimalLines .photo{border-radius:0;min-height:520px}.bzw-minimalLines .card{border-radius:0;box-shadow:none}.bzw-minimalLines .btn{border-radius:0}
    .bzw-magazine .hero{display:grid;grid-template-columns:1.2fr .8fr;gap:26px}.bzw-magazine .mag-title{font-family:Georgia,serif}.bzw-magazine .photo{min-height:520px}.bzw-magazine .section-head{border-bottom:2px solid var(--bzw-primary);padding-bottom:16px}
    .bzw-softCards .hero{text-align:center}.bzw-softCards .bubble-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:30px}.bzw-softCards .bubble-grid .photo{border-radius:45% 55% 42% 58%;min-height:230px}.bzw-softCards .card{border-radius:42px}
    .bzw-darkGallery{background:#050505!important;color:#fff}.bzw-darkGallery h1,.bzw-darkGallery h2,.bzw-darkGallery .brand{color:#fff}.bzw-darkGallery p{color:rgba(255,255,255,.7)}.bzw-darkGallery .hero{display:grid;grid-template-columns:.9fr 1.1fr;gap:22px}.bzw-darkGallery .masonry .photo{filter:grayscale(.3)}.bzw-darkGallery .card{background:#111827;border-color:rgba(255,255,255,.12)}.bzw-darkGallery .card h3{color:#fff}
    .bzw-hotel .hero{display:grid;grid-template-columns:1fr;}.bzw-hotel .booking-bar{display:grid;grid-template-columns:repeat(4,1fr) auto;gap:10px;background:#fff;border-radius:28px;padding:14px;margin-top:-34px;position:relative;z-index:1;box-shadow:0 18px 50px rgba(15,23,42,.12)}.bzw-hotel .hero .photo{min-height:520px}
    .bzw-speed .hero{display:grid;grid-template-columns:1.1fr .9fr;gap:22px}.bzw-speed .hero h1{font-style:italic}.bzw-speed .photo{transform:skewX(-4deg);border-radius:22px}.bzw-speed .card{transform:skewX(-2deg)}
    .bzw-playful .hero{display:grid;grid-template-columns:.9fr 1.1fr;gap:24px}.bzw-playful .photo{border-radius:42px 42px 140px 42px}.bzw-playful .card{border-radius:38px;box-shadow:0 20px 0 rgba(249,115,22,.12)}
    .bzw-calm .hero{display:grid;grid-template-columns:1fr 1fr;gap:26px}.bzw-calm .hero,.bzw-calm .card{border-radius:48px}.bzw-calm .photo{border-radius:48px;min-height:500px}.bzw-calm .btn{border-radius:20px}
    .bzw-adventure .hero{display:grid;grid-template-columns:.85fr 1.15fr;gap:22px}.bzw-adventure .route-strip{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:22px}.bzw-adventure .route-strip .card{background:var(--bzw-primary);}.bzw-adventure .route-strip .card h3{color:#fff}
    .bzw-stage{background:#0b1025!important;color:#fff}.bzw-stage h1,.bzw-stage h2,.bzw-stage .brand{color:#fff}.bzw-stage p{color:rgba(255,255,255,.72)}.bzw-stage .hero{text-align:center}.bzw-stage .stage-photo{min-height:430px;border-radius:999px 999px 28px 28px;margin-top:28px}.bzw-stage .card{background:#161b33;border-color:rgba(255,255,255,.12)}.bzw-stage .card h3{color:#fff}
    .bzw-friendly .hero{display:grid;grid-template-columns:1fr 1fr;gap:24px}.bzw-friendly .hero h1{letter-spacing:-.045em}.bzw-friendly .photo{border-radius:24px 80px 24px 80px}.bzw-friendly .card{border-radius:30px;border:3px solid rgba(14,165,233,.16)}
    .bzw-saas .hero{display:grid;grid-template-columns:.95fr 1.05fr;gap:26px}.bzw-saas .app-window{background:#fff;border-radius:32px;padding:16px;box-shadow:0 24px 80px rgba(15,23,42,.14)}.bzw-saas .app-bar{height:34px;border-radius:18px;background:var(--bzw-bg);margin-bottom:14px}.bzw-saas .dashboard-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.bzw-saas .dashboard-grid .card:first-child{grid-column:span 2;background:var(--bzw-primary)}.bzw-saas .dashboard-grid .card:first-child h3{color:#fff}
    .bzw-landing .hero{display:grid;grid-template-columns:1fr .85fr;gap:24px}.bzw-landing .offer-box{background:#fff;border-radius:38px;padding:28px;box-shadow:0 30px 90px rgba(15,23,42,.16);border:2px solid var(--bzw-accent)}.bzw-landing .hero h1{font-size:clamp(50px,7vw,100px)}
    @media(max-width:800px){.bzw-site .hero,.bzw-site .grid3,.bzw-site .grid4,.bzw-site .calendar-ui,.bzw-site .contact-grid,.bzw-site .searchbar,.bzw-site .booking-bar{grid-template-columns:1fr!important}.bzw-site .photo{min-height:280px}.bzw-site .wrap{width:min(100% - 24px,1120px)}}
  </style>
  ${renderHeader(template)}
  ${renderHero(template)}
  ${blocksHtml}
  <div class="wrap footer" data-bizuply-block="footer">${escapeHtml(template.name)} · אתר מוכן עם ${template.blocks.length} בלוקים · כל התוכן ניתן לעריכה</div>
</section>`;
}

function renderHeader(template: ReadyWebsiteTemplateSeed) {
  const labels = ["בית", "שירותים", "יומן", "חנות", "צור קשר"];
  if (template.layout === "landing") labels.splice(2, 2, "מבצע", "הוכחות");
  if (template.layout === "hotel") labels.splice(2, 1, "חדרים");
  return `<header class="wrap top" data-bizuply-block="header"><div class="brand">שם העסק שלך</div><nav class="nav">${labels.map((label) => `<span>${label}</span>`).join("")}</nav><a class="btn" href="#booking">קביעת תור</a></header>`;
}

function renderHero(template: ReadyWebsiteTemplateSeed) {
  const title = escapeHtml(template.heroTitle);
  const text = escapeHtml(template.heroSubtitle);
  const actions = `<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:24px"><a class="btn" href="#booking">קביעת תור</a><a class="btn alt" href="#contact">צור קשר</a></div>`;
  if (template.layout === "calendarFirst") return `<section class="wrap hero" data-bizuply-block="hero">${renderCalendarWidget()}<div><div class="eyebrow">${escapeHtml(template.niche)}</div><h1>${title}</h1><p>${text}</p>${actions}</div></section>`;
  if (template.layout === "dashboard") return `<section class="wrap hero" data-bizuply-block="hero"><div><div class="eyebrow">${escapeHtml(template.niche)}</div><h1>${title}</h1><p>${text}</p>${actions}</div><div class="hero-dashboard"><div class="card"><h3>₪24K</h3><p>חיסכון/ערך ללקוחות</p></div><div class="card"><h3>98%</h3><p>שביעות רצון</p></div><div class="card"><h3>24/7</h3><p>פניות מהאתר</p></div></div></section>`;
  if (template.layout === "foodMenu") return `<section class="wrap hero" data-bizuply-block="hero"><div><div class="eyebrow">${escapeHtml(template.niche)}</div><h1>${title}</h1><p>${text}</p>${actions}</div><div class="menu-board"><h2 style="color:#fff">תפריט היום</h2><div class="menu-row"><span>מנה ראשונה</span><b>₪49</b></div><div class="menu-row"><span>מנה עיקרית</span><b>₪89</b></div><div class="menu-row"><span>קינוח</span><b>₪39</b></div></div></section>`;
  if (template.layout === "bold") return `<section class="wrap hero" data-bizuply-block="hero"><div class="eyebrow">${escapeHtml(template.niche)}</div><h1>${title}</h1><p>${text}</p>${actions}<div class="hero-strip"><div class="photo"></div><div class="photo"></div><div class="photo"></div><div class="photo"></div></div></section>`;
  if (template.layout === "listings") return `<section class="wrap hero" data-bizuply-block="hero"><div><div class="eyebrow">${escapeHtml(template.niche)}</div><h1>${title}</h1><p>${text}</p><div class="searchbar"><input placeholder="אזור"/><input placeholder="חדרים"/><input placeholder="תקציב"/><button class="btn" type="button">חיפוש</button></div></div><div class="photo"></div></section>`;
  if (template.layout === "masonry") return `<section class="wrap hero" data-bizuply-block="hero"><div><div class="eyebrow">${escapeHtml(template.niche)}</div><h1>${title}</h1><p>${text}</p>${actions}</div><div class="masonry"><div class="photo"></div><div class="photo"></div><div class="photo"></div><div class="photo"></div></div></section>`;
  if (template.layout === "luxury") return `<section class="wrap hero" data-bizuply-block="hero"><div class="eyebrow">${escapeHtml(template.niche)}</div><h1>${title}</h1><p>${text}</p>${actions}<div class="photo wide-photo"></div></section>`;
  if (template.layout === "caseStudy") return `<section class="wrap hero" data-bizuply-block="hero"><div><div class="eyebrow">${escapeHtml(template.niche)}</div><h1>${title}</h1><p>${text}</p>${actions}</div><div class="case-wall"><div class="card"><h3>קמפיין</h3><p>תוצאות אמיתיות</p></div><div class="card"><h3>מיתוג</h3><p>שפה חזקה</p></div><div class="card"><h3>לידים</h3><p>מערכת מחוברת</p></div><div class="card"><h3>אתר</h3><p>מוכן להמרה</p></div></div></section>`;
  if (template.layout === "course") return `<section class="wrap hero" data-bizuply-block="hero"><div class="lesson-list"><div class="lesson"><span>01 מבוא</span><b>12 דק׳</b></div><div class="lesson"><span>02 כלים</span><b>35 דק׳</b></div><div class="lesson"><span>03 תרגול</span><b>28 דק׳</b></div><div class="lesson"><span>04 בונוס</span><b>18 דק׳</b></div></div><div><div class="eyebrow">${escapeHtml(template.niche)}</div><h1>${title}</h1><p>${text}</p>${actions}</div></section>`;
  if (template.layout === "catalog") return `<section class="wrap hero" data-bizuply-block="hero"><div><div class="eyebrow">${escapeHtml(template.niche)}</div><h1>${title}</h1><p>${text}</p>${actions}</div><div class="product-collage"><div class="photo"></div><div class="photo"></div><div class="photo"></div></div></section>`;
  if (template.layout === "jewelry") return `<section class="wrap hero" data-bizuply-block="hero"><div><div class="eyebrow">${escapeHtml(template.niche)}</div><h1>${title}</h1><p>${text}</p>${actions}</div><div class="photo"></div></section>`;
  if (template.layout === "emergency") return `<section class="wrap hero" data-bizuply-block="hero"><div><div class="eyebrow">${escapeHtml(template.niche)}</div><h1>${title}</h1><p>${text}</p>${actions}</div><div class="callbox"><h2>קריאה מהירה</h2><p>טופס קצר, וואטסאפ, טלפון וזמינות לפי אזור.</p><a class="btn alt" href="#contact">דברו איתי עכשיו</a></div></section>`;
  if (template.layout === "techCards") return `<section class="wrap hero" data-bizuply-block="hero"><div><div class="eyebrow">${escapeHtml(template.niche)}</div><h1>${title}</h1><p>${text}</p>${actions}</div><div class="tech-grid"><div class="card"><h3>בדיקה</h3></div><div class="card"><h3>תיקון</h3></div><div class="card"><h3>תחזוקה</h3></div><div class="card"><h3>חירום</h3></div><div class="card"><h3>אחריות</h3></div><div class="card"><h3>זמינות</h3></div></div></section>`;
  if (template.layout === "softCards") return `<section class="wrap hero" data-bizuply-block="hero"><div class="eyebrow">${escapeHtml(template.niche)}</div><h1>${title}</h1><p>${text}</p>${actions}<div class="bubble-grid"><div class="photo"></div><div class="photo"></div><div class="photo"></div></div></section>`;
  if (template.layout === "hotel") return `<section class="wrap hero" data-bizuply-block="hero"><div><div class="eyebrow">${escapeHtml(template.niche)}</div><h1>${title}</h1><p>${text}</p></div><div class="photo"></div><div class="booking-bar"><input placeholder="צ׳ק אין"/><input placeholder="צ׳ק אאוט"/><input placeholder="אורחים"/><input placeholder="חדר"/><button class="btn">בדיקה</button></div></section>`;
  if (template.layout === "stage") return `<section class="wrap hero" data-bizuply-block="hero"><div class="eyebrow">${escapeHtml(template.niche)}</div><h1>${title}</h1><p>${text}</p>${actions}<div class="photo stage-photo"></div></section>`;
  if (template.layout === "saas") return `<section class="wrap hero" data-bizuply-block="hero"><div><div class="eyebrow">${escapeHtml(template.niche)}</div><h1>${title}</h1><p>${text}</p>${actions}</div><div class="app-window"><div class="app-bar"></div><div class="dashboard-grid"><div class="card"><h3>Dashboard</h3></div><div class="card"><h3>CRM</h3></div><div class="card"><h3>AI</h3></div><div class="card"><h3>Leads</h3></div></div></div></section>`;
  if (template.layout === "landing") return `<section class="wrap hero" data-bizuply-block="hero"><div><div class="eyebrow">${escapeHtml(template.niche)}</div><h1>${title}</h1><p>${text}</p>${actions}</div><div class="offer-box"><h2>מבצע השקה</h2><p>הצעה חזקה, בולטת וברורה עם טופס ליד מחובר ל-CRM.</p><div class="price">₪2,000</div><button class="btn" type="button">אני רוצה פרטים</button></div></section>`;
  if (template.layout === "editorial") return `<section class="wrap hero" data-bizuply-block="hero"><div class="hero-media"><div class="photo"></div><div class="photo"></div></div><div><div class="eyebrow">${escapeHtml(template.niche)}</div><h1>${title}</h1><p>${text}</p>${actions}</div></section>`;
  return `<section class="wrap hero" data-bizuply-block="hero"><div><div class="eyebrow">${escapeHtml(template.niche)}</div><h1>${title}</h1><p>${text}</p>${actions}</div><div class="photo"></div></section>`;
}

function renderCalendarWidget() {
  const days = Array.from({ length: 35 }, (_, index) => `<button class="day${[8, 12, 16, 21, 25].includes(index) ? " on" : ""}">${(index % 30) + 1}</button>`).join("");
  return `<div id="booking" class="calendar-box" data-bizuply-block="booking" data-bizuply-widget="booking-calendar" data-api="/api/businesses/{{businessId}}/availability" data-services-api="/api/businesses/{{businessId}}/services" data-appointments-api="/api/businesses/{{businessId}}/appointments"><div class="eyebrow">יומן מחובר לשרת</div><h2>בחרו שעה פנויה</h2><p>בפרסום האתר הרנדרר מושך Services, WorkingHours ו-Appointments לפי businessId.</p><div class="calendar-ui"><div><b>יוני 2026</b><div class="days">${days}</div></div><div class="times"><button class="time">09:00</button><button class="time">10:30</button><button class="time">12:00</button><button class="time">14:30</button><button class="time">16:00</button><button class="btn" type="button">אישור תור</button></div></div></div>`;
}

function renderReadyBlock(type: string, template: ReadyWebsiteTemplateSeed, _index: number) {
  const titleMap: Record<string, string> = {
    trust: "למה לקוחות בוחרים בנו", services: "השירותים שלנו", pricing: "חבילות ומחירים", gallery: "גלריית עבודות", store: "מוצרים מהחנות", testimonials: "לקוחות ממליצים", faq: "שאלות נפוצות", contact: "השאירו פרטים", about: "קצת על העסק", process: "איך זה עובד", team: "הצוות", cases: "עבודות ומקרים", menu: "תפריט", offers: "מבצעים", programs: "תוכניות", results: "תוצאות", search: "חיפוש מתקדם", listings: "נכסים נבחרים", map: "מיקום ואזורי שירות", packages: "חבילות", vendors: "ספקים", logos: "לקוחות", curriculum: "סילבוס", benefits: "יתרונות", categories: "קטגוריות", featured: "מוצרים מומלצים", reviews: "ביקורות", collection: "קולקציה", story: "סיפור המותג", emergency: "שירות מהיר", areas: "אזורי שירות", projects: "פרויקטים", artist: "האמן", rooms: "חדרים", amenities: "מתקנים", routes: "מסלולים", lessons: "שיעורים", teachers: "מורים", plans: "מסלולים", values: "ערכים", program: "תוכנית", features: "פיצ׳רים", dashboard: "דשבורד", offer: "הצעה מיוחדת", proof: "הוכחות", doctor: "המומחה", lead: "טופס ליד"
  };
  if (type === "booking") return `<div class="wrap section">${renderCalendarWidget()}</div>`;
  if (type === "store") return `<section class="wrap section" data-bizuply-block="store" data-bizuply-widget="products-grid" data-api="/api/businesses/{{businessId}}/products"><div class="section-head"><div><div class="eyebrow">חנות מחוברת</div><h2>${titleMap[type]}</h2></div><a class="btn alt" href="#contact">שאלה על מוצר</a></div><div class="grid4"><div class="card"><div class="photo" style="min-height:140px"></div><h3>מוצר 1</h3><p>מוצר דמו להחלפה.</p><div class="price">₪99</div></div><div class="card"><div class="photo" style="min-height:140px"></div><h3>מוצר 2</h3><p>נמשך מהשרת.</p><div class="price">₪149</div></div><div class="card"><div class="photo" style="min-height:140px"></div><h3>מוצר 3</h3><p>כולל מחיר ומבצע.</p><div class="price">₪199</div></div><div class="card"><div class="photo" style="min-height:140px"></div><h3>מוצר 4</h3><p>כפתור רכישה.</p><div class="price">₪249</div></div></div></section>`;
  if (["gallery","projects","cases","rooms","routes"].includes(type)) return `<section class="wrap section" data-bizuply-block="${type}"><div class="section-head"><div><div class="eyebrow">${escapeHtml(template.niche)}</div><h2>${titleMap[type] || type}</h2></div></div><div class="masonry"><div class="photo"></div><div class="photo"></div><div class="photo"></div><div class="photo"></div><div class="photo"></div></div></section>`;
  if (type === "contact" || type === "lead") return `<section id="contact" class="wrap section contact-grid" data-bizuply-block="lead-form" data-api="/api/businesses/{{businessId}}/leads" style="display:grid;grid-template-columns:1fr 1fr;gap:20px"><div><div class="eyebrow">CRM</div><h2>${titleMap[type]}</h2><p>הטופס מחובר ללידים של Bizuply ויכול לשלוח התראת וואטסאפ / מייל.</p></div><form><input placeholder="שם מלא"/><input placeholder="טלפון"/><textarea rows="4" placeholder="מה תרצו לדעת?"></textarea><button class="btn" type="button">שליחת פנייה</button></form></section>`;
  if (type === "faq") return `<section class="wrap section" data-bizuply-block="faq"><div class="section-head"><div><div class="eyebrow">שאלות</div><h2>${titleMap[type]}</h2></div></div><div class="card"><h3>איך קובעים תור?</h3><p>דרך היומן באתר ובחירת שעה פנויה.</p></div><div class="card" style="margin-top:12px"><h3>אפשר לערוך את התבנית?</h3><p>כן. תמונות, צבעים, טקסטים, כפתורים וסדר סקשנים.</p></div><div class="card" style="margin-top:12px"><h3>האם החנות מחוברת?</h3><p>כן, בלוק החנות כולל data-api למוצרים של העסק.</p></div></section>`;
  const cardTitles = ["שירות ראשון", "שירות שני", "שירות שלישי"];
  if (["services","pricing","packages","programs","lessons","features","benefits","categories","plans","values"].includes(type)) {
    return `<section class="wrap section" data-bizuply-block="${type}"><div class="section-head"><div><div class="eyebrow">${escapeHtml(template.niche)}</div><h2>${titleMap[type] || type}</h2></div><a class="btn alt" href="#booking">קביעת תור</a></div><div class="grid3">${cardTitles.map((name, i) => `<div class="card"><h3>${name}</h3><p>תיאור מקצועי מוכן לעריכה לפי העסק.</p><div class="price">₪${(i+1)*150}</div></div>`).join("")}</div></section>`;
  }
  if (["testimonials","reviews","proof"].includes(type)) return `<section class="wrap section" data-bizuply-block="testimonials"><div class="section-head"><div><div class="eyebrow">אמון</div><h2>${titleMap[type] || type}</h2></div></div><div class="grid3"><div class="card"><h3>★★★★★</h3><p>חוויה מקצועית, ברורה ומעוצבת.</p></div><div class="card"><h3>★★★★★</h3><p>הזמנתי תור תוך דקה והכול היה מסודר.</p></div><div class="card"><h3>★★★★★</h3><p>אתר שנראה יוקרתי ומוכר.</p></div></div></section>`;
  return `<section class="wrap section" data-bizuply-block="${type}"><div class="section-head"><div><div class="eyebrow">${escapeHtml(template.niche)}</div><h2>${titleMap[type] || type}</h2></div></div><div class="grid3"><div class="card"><h3>01</h3><p>בלוק מלא לעריכה עם טקסט מוכן.</p></div><div class="card"><h3>02</h3><p>מבנה שונה לפי סוג התבנית.</p></div><div class="card"><h3>03</h3><p>תמונות דמו, כפתורים וחיבור דינמי.</p></div></div></section>`;
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
      const haystack = `${template.name} ${template.category} ${template.description} ${template.niche} ${template.layout} ${template.blocks.map((block) => block.title).join(" ")}`.toLowerCase();
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
                  title="30 אתרים מוכנים — כל אחד מבנה אחר"
                  text={`כל כרטיס מציג את האתר עצמו בקטן. לחיצה מחליפה את העמוד: ${activePage?.title || "לא נבחר"}`}
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
            {readyTemplate.niche}
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black text-emerald-700">
            {readyTemplate.blocks.length} בלוקים
          </span>
        </div>

        <p className="truncate text-sm font-black text-slate-950">
          {readyTemplate.name}
        </p>
        <p className="mt-1 line-clamp-2 text-[11px] font-bold leading-5 text-slate-500">
          {readyTemplate.description}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-[10px] font-black text-slate-400">
            מבנה: {readyTemplate.layout}
          </span>
          <span className="rounded-full bg-slate-950 px-3 py-1 text-[10px] font-black text-white">
            החל אתר
          </span>
        </div>
      </div>
    </button>
  );
}

function MiniWebsitePreview({ template }: { template: ReadyWebsiteTemplate }) {
  return (
    <div className="relative h-[210px] overflow-hidden rounded-t-[1.35rem] border-b border-slate-200 bg-slate-100">
      <div className="absolute left-2 top-2 z-10 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black text-violet-700 shadow-sm">
        תצוגה מלאה
      </div>
      <div className="absolute right-2 top-2 z-10 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black text-slate-700 shadow-sm">
        {template.blocks.length} בלוקים
      </div>

      <div
        className="pointer-events-none absolute right-0 top-0 origin-top-right"
        style={{
          width: "1120px",
          minHeight: "1300px",
          transform: "scale(0.205)",
        }}
        dangerouslySetInnerHTML={{ __html: template.html }}
      />
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
