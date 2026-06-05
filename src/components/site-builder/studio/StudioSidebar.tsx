import React, { useEffect, useMemo, useState } from "react";
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

type Props = {
  activePanel: ActiveStudioPanel;
  setActivePanel: (value: ActiveStudioPanel) => void;
  onAddHtml: (html: string) => void;
  onApplyTemplate: (template: PageTemplate) => void;
  onApplyPalette: (palette: ThemePalette) => void;
  onOpenMedia: () => void;

  pages?: StudioSitePage[];
  activePageId?: string;
  onSelectPage?: (pageId: string) => void;
  onAddPage?: (title: string, type?: StudioSitePageType) => void;
  onUpdatePageTitle?: (pageId: string, title: string) => void;
};

type PageBlockDefinition = {
  id: string;
  title: string;
  kind: SectionCategory;
  description: string;
  required?: boolean;
};

const navItems: { key: StudioPanel; label: string; icon: string; hint: string }[] = [
  { key: "templates", label: "תבניות", icon: "▦", hint: "אתרים מוכנים" },
  { key: "add", label: "אלמנטים", icon: "+", hint: "בלוקים קטנים" },
  { key: "sections", label: "סקשנים", icon: "▭", hint: "חלקי אתר" },
  { key: "theme", label: "עיצוב", icon: "◐", hint: "צבעים ופונטים" },
  { key: "pages", label: "דפים", icon: "▤", hint: "היררכיית אתר" },
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

const pageTypeLabels: Record<StudioSitePageType, string> = {
  home: "דף בית",
  about: "אודות",
  service: "שירות",
  store: "חנות",
  product: "מוצר",
  booking: "תורים",
  landing: "נחיתה",
  contact: "צור קשר",
  gallery: "גלריה",
  course: "קורס",
  miniSaas: "Mini SaaS",
  blank: "עמוד ריק",
};

const pageTypeDescriptions: Record<StudioSitePageType, string> = {
  home: "עמוד ראשי עם פתיח, אודות, מוצרים, שירותים וביקורות.",
  about: "עמוד שמספר על העסק, הסיפור, הערכים והצוות.",
  service: "עמוד לשירות ספציפי עם פירוט, מחיר ותיאום.",
  store: "עמוד חנות עם מוצרים, קטגוריות ומבצעים.",
  product: "עמוד מוצר עם תמונות, מחיר, וריאציות וקנייה.",
  booking: "עמוד קביעת תורים ושעות זמינות.",
  landing: "עמוד מכירה ממוקד ללידים או מבצע.",
  contact: "עמוד יצירת קשר עם טופס, וואטסאפ ופרטים.",
  gallery: "עמוד גלריה / תיק עבודות.",
  course: "עמוד קורס דיגיטלי, שיעורים והרשמה.",
  miniSaas: "עמוד למוצר דיגיטלי / מערכת SaaS.",
  blank: "עמוד חופשי להתחלה נקייה.",
};

const pageTypeOptions: { value: StudioSitePageType; label: string }[] = [
  { value: "home", label: "דף בית" },
  { value: "about", label: "אודות" },
  { value: "service", label: "שירות" },
  { value: "store", label: "חנות" },
  { value: "product", label: "מוצר" },
  { value: "booking", label: "תורים" },
  { value: "landing", label: "נחיתה / מבצע" },
  { value: "contact", label: "צור קשר" },
  { value: "gallery", label: "גלריה" },
  { value: "course", label: "קורס" },
  { value: "miniSaas", label: "Mini SaaS" },
  { value: "blank", label: "ריק" },
];

const pageBlocksByType: Record<StudioSitePageType, PageBlockDefinition[]> = {
  home: [
    { id: "home-header", title: "Header", kind: "header", description: "לוגו, תפריט וכפתורי ניווט", required: true },
    { id: "home-hero", title: "פתיח ראשי", kind: "hero", description: "המסר הראשון של העסק", required: true },
    { id: "home-about", title: "אודות קצר", kind: "about", description: "תקציר על העסק" },
    { id: "home-store", title: "מוצרים נפוצים", kind: "store", description: "מוצרים מובילים מהחנות" },
    { id: "home-services", title: "שירותים מובילים", kind: "services", description: "שירותים מרכזיים" },
    { id: "home-reviews", title: "ביקורות", kind: "reviews", description: "אמון לקוחות" },
    { id: "home-contact", title: "צור קשר", kind: "contact", description: "טופס / וואטסאפ / פרטים" },
  ],
  about: [
    { id: "about-hero", title: "פתיח אודות", kind: "hero", description: "כותרת לעמוד אודות" },
    { id: "about-story", title: "סיפור העסק", kind: "about", description: "הסבר אישי ומקצועי על העסק", required: true },
    { id: "about-team", title: "צוות", kind: "team", description: "אנשי צוות / בעל העסק" },
    { id: "about-gallery", title: "גלריה", kind: "gallery", description: "תמונות מהעסק או מהעבודות" },
    { id: "about-reviews", title: "ביקורות", kind: "reviews", description: "לקוחות ממליצים" },
    { id: "about-contact", title: "יצירת קשר", kind: "contact", description: "מעבר לפנייה" },
  ],
  service: [
    { id: "service-hero", title: "פתיח שירות", kind: "hero", description: "כותרת לשירות" },
    { id: "service-details", title: "פירוט שירות", kind: "services", description: "מה מקבלים בשירות", required: true },
    { id: "service-gallery", title: "לפני / אחרי", kind: "gallery", description: "תוצאות או דוגמאות" },
    { id: "service-booking", title: "קביעת תור", kind: "booking", description: "הובלה להזמנה" },
    { id: "service-reviews", title: "ביקורות", kind: "reviews", description: "חיזוק אמון" },
    { id: "service-contact", title: "צור קשר", kind: "contact", description: "פנייה מהירה" },
  ],
  store: [
    { id: "store-hero", title: "פתיח חנות", kind: "hero", description: "כותרת ותיאור החנות" },
    { id: "store-products", title: "גריד מוצרים", kind: "store", description: "מוצרים וקטגוריות", required: true },
    { id: "store-promo", title: "מבצעים", kind: "promotion", description: "הטבות וקופונים" },
    { id: "store-reviews", title: "ביקורות", kind: "reviews", description: "ביקורות על מוצרים" },
    { id: "store-social", title: "סושיאל", kind: "social", description: "אינסטגרם / טיקטוק / וואטסאפ" },
    { id: "store-contact", title: "יצירת קשר", kind: "contact", description: "שאלות לפני רכישה" },
  ],
  product: [
    { id: "product-gallery", title: "תמונות מוצר", kind: "gallery", description: "גלריית מוצר" },
    { id: "product-info", title: "פרטי מוצר", kind: "store", description: "מחיר, תיאור וכפתור קנייה", required: true },
    { id: "product-promo", title: "הטבה", kind: "promotion", description: "מבצע למוצר" },
    { id: "product-reviews", title: "ביקורות מוצר", kind: "reviews", description: "אמון רכישה" },
    { id: "product-contact", title: "שאלות", kind: "contact", description: "פנייה לפני קנייה" },
  ],
  booking: [
    { id: "booking-hero", title: "פתיח תורים", kind: "hero", description: "הובלה לקביעת תור" },
    { id: "booking-calendar", title: "יומן / שעות", kind: "booking", description: "זמינות ותיאום", required: true },
    { id: "booking-services", title: "בחירת שירות", kind: "services", description: "איזה שירות לתאם" },
    { id: "booking-reviews", title: "ביקורות", kind: "reviews", description: "חיזוק אמון" },
    { id: "booking-contact", title: "עזרה", kind: "contact", description: "צור קשר במקום תור" },
  ],
  landing: [
    { id: "landing-hero", title: "Hero מכירתי", kind: "hero", description: "כותרת חזקה והצעה" },
    { id: "landing-promo", title: "מבצע", kind: "promotion", description: "הצעה / הטבה / קופון", required: true },
    { id: "landing-form", title: "טופס ליד", kind: "form", description: "איסוף פרטים" },
    { id: "landing-list", title: "יתרונות", kind: "list", description: "למה כדאי" },
    { id: "landing-reviews", title: "המלצות", kind: "testimonials", description: "אמון" },
    { id: "landing-contact", title: "יצירת קשר", kind: "contact", description: "פנייה מהירה" },
  ],
  contact: [
    { id: "contact-hero", title: "פתיח צור קשר", kind: "hero", description: "כותרת לעמוד" },
    { id: "contact-form", title: "טופס", kind: "form", description: "שם, טלפון והודעה", required: true },
    { id: "contact-details", title: "פרטי קשר", kind: "contact", description: "טלפון, כתובת, וואטסאפ" },
    { id: "contact-social", title: "רשתות חברתיות", kind: "social", description: "קישורים חברתיים" },
    { id: "contact-bot", title: "בוט חכם", kind: "bot", description: "שאלות ותשובות מהירות" },
  ],
  gallery: [
    { id: "gallery-hero", title: "פתיח גלריה", kind: "hero", description: "כותרת לגלריה" },
    { id: "gallery-grid", title: "גלריית תמונות", kind: "gallery", description: "תיק עבודות", required: true },
    { id: "gallery-reviews", title: "ביקורות", kind: "reviews", description: "אמון אחרי צפייה" },
    { id: "gallery-contact", title: "צור קשר", kind: "contact", description: "פנייה אחרי צפייה" },
  ],
  course: [
    { id: "course-hero", title: "פתיח קורס", kind: "hero", description: "שם הקורס והבטחה" },
    { id: "course-details", title: "תוכנית הקורס", kind: "course", description: "שיעורים ותוכן", required: true },
    { id: "course-list", title: "מה לומדים", kind: "list", description: "יתרונות ותכנים" },
    { id: "course-form", title: "הרשמה", kind: "form", description: "איסוף נרשמים" },
    { id: "course-reviews", title: "המלצות", kind: "testimonials", description: "בוגרים ממליצים" },
  ],
  miniSaas: [
    { id: "saas-hero", title: "פתיח מערכת", kind: "hero", description: "הצגת המוצר הדיגיטלי" },
    { id: "saas-features", title: "פיצ׳רים", kind: "miniSaas", description: "מה המערכת יודעת לעשות", required: true },
    { id: "saas-services", title: "שירותים / יכולות", kind: "services", description: "פירוט יכולות" },
    { id: "saas-bot", title: "AI / בוט", kind: "bot", description: "חיבור חכם" },
    { id: "saas-form", title: "הרשמה / דמו", kind: "form", description: "איסוף לידים" },
  ],
  blank: [
    { id: "blank-hero", title: "פתיח", kind: "hero", description: "בלוק פתיחה בסיסי" },
    { id: "blank-text", title: "טקסט", kind: "text", description: "טקסט חופשי" },
    { id: "blank-list", title: "רשימה", kind: "list", description: "נקודות / יתרונות" },
    { id: "blank-form", title: "טופס", kind: "form", description: "טופס בסיסי" },
    { id: "blank-contact", title: "צור קשר", kind: "contact", description: "פנייה" },
  ],
};

const panelTitles: Record<StudioPanel, { title: string; subtitle: string }> = {
  templates: {
    title: "תבניות אתר",
    subtitle: "בחירת תבנית מלאה מחליפה את כל האתר לפי תחום וסגנון.",
  },
  add: {
    title: "אלמנטים",
    subtitle: "הוסיפי טקסטים, כפתורים, תמונות, טפסים, גלריות ועוד.",
  },
  sections: {
    title: "סקשנים",
    subtitle: "חלקים מוכנים לאתר: Hero, אודות, שירותים, תורים, חנות ועוד.",
  },
  theme: {
    title: "עיצוב כללי",
    subtitle: "ערכות צבעים ופונטים שמיועדות להשפיע על כל האתר.",
  },
  pages: {
    title: "היררכיית האתר",
    subtitle: "דפים → בלוקים → קישורים. כל דף לפי שם שבעל העסק קובע.",
  },
  media: {
    title: "מדיה",
    subtitle: "תמונות, וידאו ורקעים לאתר.",
  },
  store: {
    title: "חנות",
    subtitle: "בלוקים חכמים להצגת מוצרים ומבצעים.",
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

export default function StudioSidebar({
  activePanel,
  setActivePanel,
  onAddHtml,
  onApplyTemplate,
  onApplyPalette,
  onOpenMedia,
  pages = [],
  activePageId,
  onSelectPage,
  onAddPage,
  onUpdatePageTitle,
}: Props) {
  const [elementCategory, setElementCategory] = useState<ElementCategory>("text");
  const [sectionCategory, setSectionCategory] =
    useState<SectionCategory>("welcome");

  const [search, setSearch] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageType, setNewPageType] = useState<StudioSitePageType>("blank");

  const [expandedPageIds, setExpandedPageIds] = useState<Record<string, boolean>>(
    {}
  );

  const currentPanel: StudioPanel = activePanel || "templates";
  const isPanelOpen = Boolean(activePanel);

  useEffect(() => {
    if (!successMessage) return;

    const timer = window.setTimeout(() => setSuccessMessage(""), 2200);

    return () => window.clearTimeout(timer);
  }, [successMessage]);

  useEffect(() => {
    if (!pages.length) return;

    setExpandedPageIds((prev) => {
      const next = { ...prev };

      pages.forEach((page, index) => {
        if (page.id === activePageId || index === 0) {
          next[page.id] = true;
        }
      });

      return next;
    });
  }, [activePageId, pages]);

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
      const haystack = `${page.title} ${page.slug} ${page.type} ${
        pageTypeLabels[page.type]
      }`.toLowerCase();

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
    if (!normalizedSearch) return pageTemplates;

    return pageTemplates.filter((template) => {
      const haystack = `${template.name} ${template.category} ${template.description}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [normalizedSearch]);

  const clearSearch = () => setSearch("");

  const togglePageExpanded = (pageId: string) => {
    setExpandedPageIds((prev) => ({
      ...prev,
      [pageId]: !prev[pageId],
    }));
  };

  const handlePanelClick = (panel: StudioPanel) => {
    const clickedSameOpenPanel = activePanel === panel;

    if (clickedSameOpenPanel) {
      setActivePanel(null);
      clearSearch();
      return;
    }

    setActivePanel(panel);
    clearSearch();
  };

  const handleAddHtml = (html: string, label = "האלמנט") => {
    onAddHtml(html);
    setSuccessMessage(`${label} נוסף לעמוד`);
  };

  const handleApplyTemplate = (template: PageTemplate) => {
    onApplyTemplate(template);
    setSuccessMessage(`התבנית ${template.name} הוחלה על האתר`);
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

    onAddPage?.(title, newPageType);
    setNewPageTitle("");
    setNewPageType("blank");
    setSuccessMessage(`העמוד ${title} נוסף`);
  };

  const handleAddBlock = (block: PageBlockDefinition) => {
    const relatedSections = sectionTemplates.filter(
      (section) => section.category === block.kind
    );

    const firstSection = relatedSections[0];

    if (!firstSection) {
      setSectionCategory(block.kind);
      setActivePanel("sections");
      setSuccessMessage("לא נמצאה תבנית מוכנה. פתחתי את קטגוריית הסקשנים.");
      return;
    }

    handleAddHtml(firstSection.html, block.title);
  };

  const handleOpenBlockCategory = (block: PageBlockDefinition) => {
    setSectionCategory(block.kind);
    setActivePanel("sections");
    setSuccessMessage(`נפתחו מבנים מסוג ${block.title}`);
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
                "group relative flex w-full flex-col items-center justify-center rounded-[1.4rem] px-2 py-3 text-[11px] font-black transition",
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
          "min-h-0 overflow-hidden border-l border-slate-100 bg-gradient-to-b from-white to-slate-50/60 transition-opacity duration-200",
          isPanelOpen ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      >
        <div className="flex min-h-0 h-full flex-col">
          <PanelHeader
            title={panelTitles[currentPanel].title}
            subtitle={panelTitles[currentPanel].subtitle}
            onClose={() => {
              setActivePanel(null);
              clearSearch();
            }}
          />

          {successMessage && (
            <div className="mx-5 mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-black text-emerald-700">
              {successMessage}
            </div>
          )}

          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            {currentPanel === "templates" && (
              <Panel>
                <SearchBox
                  value={search}
                  onChange={setSearch}
                  placeholder="חיפוש תבנית לפי תחום..."
                />

                <div className="mb-5 grid grid-cols-2 gap-3">
                  <MiniStat label="תבניות מלאות" value={pageTemplates.length} />
                  <MiniStat label="עריכה חופשית" value="100%" />
                </div>

                <div className="mb-4 rounded-[1.6rem] border border-violet-100 bg-violet-50 p-4">
                  <p className="text-sm font-black text-violet-800">
                    לחיצה על תבנית מחליפה את כל האתר
                  </p>
                  <p className="mt-1 text-xs font-bold leading-5 text-violet-600">
                    Header, Hero, סקשנים, צבעים ואווירה לפי התבנית שבחרת.
                  </p>
                </div>

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

                <div className="space-y-4">
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
                <div className="mb-6 rounded-[1.8rem] border border-violet-100 bg-gradient-to-br from-violet-50 to-fuchsia-50 p-4">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-lg shadow-sm">
                    ✨
                  </div>

                  <p className="text-sm font-black text-slate-950">
                    עיצוב שמיועד לכל האתר
                  </p>
                  <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
                    בחירת ערכה מעדכנת צבעים, כפתורים, רקעים ופונטים ב-Canvas.
                  </p>
                </div>

                <p className="mb-3 text-sm font-black text-slate-900">
                  ערכות צבעים
                </p>

                <div className="space-y-3">
                  {themePalettes.map((palette) => (
                    <PaletteCard
                      key={palette.id}
                      palette={palette}
                      onClick={() => handleApplyPalette(palette)}
                    />
                  ))}
                </div>

                <p className="mb-3 mt-8 text-sm font-black text-slate-900">
                  פונטים
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {fontOptions.map((font) => (
                    <button
                      key={font}
                      type="button"
                      onClick={() =>
                        setSuccessMessage(
                          `הפונט ${font} נבחר. החיבור המלא יתבצע דרך ערכת העיצוב.`
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
              <Panel>
                <SiteHierarchyHeader
                  totalPages={pages.length}
                  activePage={activePage}
                />

                <SearchBox
                  value={search}
                  onChange={setSearch}
                  placeholder="חיפוש דף / בלוק..."
                />

                <AddPageInline
                  title={newPageTitle}
                  setTitle={setNewPageTitle}
                  type={newPageType}
                  setType={setNewPageType}
                  onAdd={handleAddPage}
                />

                <div className="mb-4 rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-slate-950">
                        מבנה האתר
                      </p>
                      <p className="mt-1 text-xs font-bold leading-5 text-slate-400">
                        דף → בלוקים בעמוד → כפתורים מקושרים באינספקטור.
                      </p>
                    </div>

                    <span className="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-black text-violet-700">
                      Tree
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredPages.map((page) => {
                    const blocks = pageBlocksByType[page.type] || pageBlocksByType.blank;
                    const expanded = expandedPageIds[page.id] !== false;
                    const active = page.id === activePage?.id;

                    return (
                      <HierarchyPageNode
                        key={page.id}
                        page={page}
                        active={active}
                        expanded={expanded}
                        blocks={blocks}
                        sectionCountByCategory={sectionCountByCategory}
                        onToggle={() => togglePageExpanded(page.id)}
                        onSelect={() => onSelectPage?.(page.id)}
                        onUpdateTitle={(title) =>
                          onUpdatePageTitle?.(page.id, title)
                        }
                        onAddBlock={handleAddBlock}
                        onOpenBlockCategory={handleOpenBlockCategory}
                      />
                    );
                  })}
                </div>

                {filteredPages.length === 0 && (
                  <EmptyState text="לא נמצאו דפים. אפשר ליצור עמוד חדש לפי שם שהעסק קובע." />
                )}
              </Panel>
            )}

            {currentPanel === "media" && (
              <Panel>
                <button
                  type="button"
                  onClick={onOpenMedia}
                  className="w-full rounded-3xl bg-gradient-to-l from-violet-700 to-fuchsia-600 px-4 py-4 text-sm font-black text-white shadow-xl shadow-violet-100 transition hover:-translate-y-0.5"
                >
                  פתיחת מנהל מדיה
                </button>

                <div className="mt-4 grid gap-3">
                  <Info title="תמונה רגילה" text="הוספת תמונה לתוך הסקשן או האלמנט הנבחר." />
                  <Info title="רקע לסקשן" text="בחירת תמונה כרקע לחלק באתר." />
                  <Info title="וידאו" text="אפשר להוסיף דרך אלמנטים / Embed." />
                </div>
              </Panel>
            )}

            {["store", "bookings", "services", "club", "leads"].includes(
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
                <Info title="Carousel" text="קרוסלות נמצאות בספריית האלמנטים." />
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

function SiteHierarchyHeader({
  totalPages,
  activePage,
}: {
  totalPages: number;
  activePage: StudioSitePage | null;
}) {
  return (
    <div className="mb-4 overflow-hidden rounded-[1.8rem] border border-violet-100 bg-gradient-to-br from-violet-700 via-fuchsia-600 to-slate-950 p-4 text-white shadow-xl shadow-violet-100">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 text-lg font-black">
          ▤
        </div>

        <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-black">
          {totalPages} דפים
        </span>
      </div>

      <p className="text-lg font-black">היררכיית אתר אמיתית</p>
      <p className="mt-1 text-xs font-bold leading-5 text-white/75">
        בוחרים דף, רואים תחתיו את הבלוקים שלו, וכל כפתור יכול לקשר לדף לפי השם
        שבעל העסק קבע.
      </p>

      {activePage && (
        <div className="mt-4 rounded-2xl bg-white/12 p-3">
          <p className="text-[11px] font-black text-white/60">עמוד פעיל</p>
          <p className="mt-1 text-sm font-black">{activePage.title}</p>
        </div>
      )}
    </div>
  );
}

function AddPageInline({
  title,
  setTitle,
  type,
  setType,
  onAdd,
}: {
  title: string;
  setTitle: (value: string) => void;
  type: StudioSitePageType;
  setType: (value: StudioSitePageType) => void;
  onAdd: () => void;
}) {
  return (
    <div className="mb-4 rounded-[1.6rem] border border-slate-200 bg-white p-3 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-black text-slate-950">+ עמוד חדש</p>
        <span className="text-[11px] font-bold text-slate-400">
          לפי שם העסק
        </span>
      </div>

      <div className="grid gap-2">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="שם עמוד, לדוגמה: קולקציית קיץ"
          className="min-h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-violet-400 focus:bg-white"
        />

        <div className="grid grid-cols-[1fr_auto] gap-2">
          <select
            value={type}
            onChange={(event) => setType(event.target.value as StudioSitePageType)}
            className="min-h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-xs font-black text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white"
          >
            {pageTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onAdd}
            className="min-h-11 rounded-2xl bg-slate-950 px-5 text-xs font-black text-white transition hover:bg-violet-700"
          >
            יצירה
          </button>
        </div>
      </div>
    </div>
  );
}

function HierarchyPageNode({
  page,
  active,
  expanded,
  blocks,
  sectionCountByCategory,
  onToggle,
  onSelect,
  onUpdateTitle,
  onAddBlock,
  onOpenBlockCategory,
}: {
  page: StudioSitePage;
  active: boolean;
  expanded: boolean;
  blocks: PageBlockDefinition[];
  sectionCountByCategory: Record<string, number>;
  onToggle: () => void;
  onSelect: () => void;
  onUpdateTitle: (title: string) => void;
  onAddBlock: (block: PageBlockDefinition) => void;
  onOpenBlockCategory: (block: PageBlockDefinition) => void;
}) {
  const [editingTitle, setEditingTitle] = useState(page.title);

  useEffect(() => {
    setEditingTitle(page.title);
  }, [page.title]);

  return (
    <article
      className={[
        "relative overflow-hidden rounded-[1.55rem] border bg-white shadow-sm transition",
        active
          ? "border-violet-300 shadow-xl shadow-violet-100"
          : "border-slate-200 hover:border-violet-200",
      ].join(" ")}
    >
      <div
        className={[
          "absolute right-0 top-0 h-full w-1",
          active ? "bg-violet-700" : "bg-transparent",
        ].join(" ")}
      />

      <div className="p-3">
        <div className="flex items-start gap-2">
          <button
            type="button"
            onClick={onToggle}
            className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-slate-100 text-xs font-black text-slate-500 transition hover:bg-violet-50 hover:text-violet-700"
            title={expanded ? "סגירת בלוקים" : "פתיחת בלוקים"}
          >
            {expanded ? "⌄" : "›"}
          </button>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black text-slate-500">
                {pageTypeLabels[page.type]}
              </span>

              {page.isHome && (
                <span className="rounded-full bg-violet-50 px-3 py-1 text-[10px] font-black text-violet-700">
                  ראשי
                </span>
              )}
            </div>

            <label className="grid gap-1">
              <span className="text-[10px] font-black text-slate-400">
                שם הדף
              </span>

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
                className="min-h-10 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-black text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white"
              />
            </label>

            <div className="mt-2 flex items-center justify-between gap-2 rounded-2xl bg-slate-50 px-3 py-2">
              <span className="text-[10px] font-black text-slate-400">
                כתובת
              </span>

              <span
                dir="ltr"
                className="max-w-[180px] truncate text-xs font-black text-slate-700"
              >
                {page.isHome ? "/" : `/${page.slug}`}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onSelect}
            className={[
              "min-h-10 rounded-2xl px-3 text-xs font-black transition",
              active
                ? "bg-violet-700 text-white shadow-lg shadow-violet-100"
                : "bg-slate-950 text-white hover:bg-violet-700",
            ].join(" ")}
          >
            {active ? "עמוד פעיל" : "פתח דף"}
          </button>

          <button
            type="button"
            onClick={onToggle}
            className="min-h-10 rounded-2xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
          >
            {expanded ? "הסתר בלוקים" : "הצג בלוקים"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50/80 px-3 pb-3 pt-4">
          <div className="relative pr-4">
            <div className="absolute right-[7px] top-0 h-full w-px bg-slate-200" />

            <div className="space-y-2">
              {blocks.map((block, index) => (
                <HierarchyBlockNode
                  key={block.id}
                  block={block}
                  index={index + 1}
                  count={sectionCountByCategory[block.kind] || 0}
                  onAdd={() => onAddBlock(block)}
                  onOpen={() => onOpenBlockCategory(block)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

function HierarchyBlockNode({
  block,
  index,
  count,
  onAdd,
  onOpen,
}: {
  block: PageBlockDefinition;
  index: number;
  count: number;
  onAdd: () => void;
  onOpen: () => void;
}) {
  return (
    <div className="relative pr-5">
      <span className="absolute right-[-8px] top-5 h-px w-5 bg-slate-200" />
      <span className="absolute right-[-13px] top-[14px] grid h-6 w-6 place-items-center rounded-full border border-slate-200 bg-white text-[10px] font-black text-slate-400">
        {index}
      </span>

      <div className="rounded-[1.2rem] border border-slate-200 bg-white p-3 shadow-sm">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-black text-slate-950">
                {block.title}
              </p>

              {block.required && (
                <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[9px] font-black text-rose-500">
                  מומלץ
                </span>
              )}
            </div>

            <p className="mt-1 line-clamp-2 text-[11px] font-bold leading-4 text-slate-400">
              {block.description}
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-400">
            {count}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onAdd}
            className="min-h-9 rounded-xl bg-slate-950 px-2 text-[11px] font-black text-white transition hover:bg-violet-700"
          >
            הוסף
          </button>

          <button
            type="button"
            onClick={onOpen}
            className="min-h-9 rounded-xl border border-slate-200 bg-white px-2 text-[11px] font-black text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
          >
            מבנים
          </button>
        </div>
      </div>
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
    <div className="mb-4 flex items-center gap-2 rounded-[1.4rem] border border-slate-200 bg-white px-3 py-2 shadow-sm">
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
        "rounded-[1.35rem] px-3 py-3 text-right text-xs font-black transition",
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

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[1.4rem] border border-slate-200 bg-white p-3 shadow-sm">
      <p className="text-xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-bold text-slate-400">{label}</p>
    </div>
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
      className="group rounded-[1.7rem] border border-slate-200 bg-white p-2 text-right shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl"
    >
      <div className="relative mb-3 overflow-hidden rounded-2xl bg-slate-100">
        <img
          src={template.preview}
          alt=""
          className="h-28 w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-black text-violet-700 shadow-sm">
          החל
        </span>

        <span className="absolute right-2 top-2 rounded-full bg-slate-950/80 px-3 py-1 text-[10px] font-black text-white">
          תבנית מלאה
        </span>
      </div>

      <p className="text-sm font-black text-slate-950">{template.name}</p>
      <p className="mt-1 text-[11px] font-bold text-violet-600">
        {template.category}
      </p>
      <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-slate-400">
        {template.description}
      </p>
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
      className="group rounded-3xl border border-slate-100 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:bg-violet-50 hover:shadow-xl"
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
      className="group w-full rounded-[1.7rem] border border-slate-200 bg-white p-3 text-right shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl"
    >
      <div className="relative mb-3 overflow-hidden rounded-2xl bg-slate-100">
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
      className="w-full rounded-[1.7rem] border border-slate-200 bg-white p-4 text-right shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl"
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
      className="w-full rounded-3xl border border-slate-200 bg-white p-4 text-right shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:bg-violet-50 hover:shadow-xl"
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
    <div className="mb-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-black text-slate-950">{title}</p>
      <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
        {text}
      </p>
    </div>
  );
}

function EmptyState({ text }: { text?: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center">
      <p className="text-sm font-black text-slate-700">לא נמצאו תוצאות</p>
      <p className="mt-1 text-xs font-bold text-slate-400">
        {text || "נסי לבחור קטגוריה אחרת או למחוק את החיפוש."}
      </p>
    </div>
  );
}
