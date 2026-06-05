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
  { key: "templates", label: "תבניות", icon: "▦", hint: "אתרים מוכנים" },
  { key: "add", label: "אלמנטים", icon: "+", hint: "בלוקים קטנים" },
  { key: "sections", label: "סקשנים", icon: "▭", hint: "חלקי אתר" },
  { key: "theme", label: "עיצוב", icon: "◐", hint: "צבעים ופונטים" },
  { key: "pages", label: "דפים", icon: "▤", hint: "עמודים וסקשנים" },
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
    subtitle: "סקשנים מוכנים שאפשר להוסיף לעמוד הפעיל.",
  },
  theme: {
    title: "עיצוב כללי",
    subtitle: "ערכות צבעים ופונטים שמיועדות להשפיע על כל האתר.",
  },
  pages: {
    title: "דפים וסקשנים",
    subtitle: "דף הוא עמוד נפרד. סקשנים הם החלקים שבתוך העמוד הפעיל.",
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
  const [elementCategory, setElementCategory] = useState<ElementCategory>("text");
  const [sectionCategory, setSectionCategory] =
    useState<SectionCategory>("welcome");

  const [search, setSearch] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageType, setNewPageType] = useState<StudioSitePageType>("blank");

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

    onAddPage?.(title, newPageType);
    setNewPageTitle("");
    setNewPageType("blank");
    setSuccessMessage(`העמוד ${title} נוצר ונפתח`);
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
                    תבנית מחליפה את העמוד הפעיל
                  </p>
                  <p className="mt-1 text-xs font-bold leading-5 text-violet-600">
                    דף הוא עמוד נפרד. תבנית כאן מחליפה רק את העמוד שאת עורכת כרגע.
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

                <div className="mb-4 rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-sm font-black text-slate-950">
                    הוספת סקשן לעמוד הפעיל
                  </p>
                  <p className="mt-1 text-xs font-bold leading-5 text-slate-400">
                    העמוד הפעיל: {activePage?.title || "לא נבחר"}
                  </p>
                </div>

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
                <HierarchyIntro
                  activePageTitle={activePage?.title || ""}
                  pagesCount={pages.length}
                  sectionsCount={activePageSections.length}
                />

                <SearchBox
                  value={search}
                  onChange={setSearch}
                  placeholder="חיפוש דף..."
                />

                <AddPageBox
                  title={newPageTitle}
                  setTitle={setNewPageTitle}
                  type={newPageType}
                  setType={setNewPageType}
                  onAdd={handleAddPage}
                />

                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-black text-slate-950">
                    עמודים באתר
                  </p>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-500">
                    דף = עמוד נפרד
                  </span>
                </div>

                <div className="space-y-3">
                  {filteredPages.map((page) => {
                    const active = page.id === activePage?.id;
                    const expanded = expandedPages[page.id] ?? active;

                    return (
                      <PageTreeNode
                        key={page.id}
                        page={page}
                        active={active}
                        expanded={expanded}
                        sections={active ? activePageSections : []}
                        onToggle={() => togglePage(page.id)}
                        onSelectPage={() => onSelectPage?.(page.id)}
                        onUpdateTitle={(title) =>
                          onUpdatePageTitle?.(page.id, title)
                        }
                        onAddSection={() => openSectionCategory()}
                        onSelectSection={(sectionId) => onSelectSection?.(sectionId)}
                        onDeleteSection={(sectionId) => onDeleteSection?.(sectionId)}
                        onDuplicateSection={(sectionId) =>
                          onDuplicateSection?.(sectionId)
                        }
                        onMoveSectionUp={(sectionId) => onMoveSectionUp?.(sectionId)}
                        onMoveSectionDown={(sectionId) =>
                          onMoveSectionDown?.(sectionId)
                        }
                        onOpenSectionVariants={(kind) => openSectionCategory(kind)}
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

function HierarchyIntro({
  activePageTitle,
  pagesCount,
  sectionsCount,
}: {
  activePageTitle: string;
  pagesCount: number;
  sectionsCount: number;
}) {
  return (
    <div className="mb-4 rounded-[1.8rem] border border-violet-100 bg-gradient-to-br from-violet-700 via-fuchsia-600 to-slate-950 p-4 text-white shadow-xl shadow-violet-100">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 text-lg font-black">
          ▤
        </div>

        <div className="flex gap-2">
          <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-black">
            {pagesCount} דפים
          </span>
          <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-black">
            {sectionsCount} סקשנים
          </span>
        </div>
      </div>

      <p className="text-lg font-black">דפים וסקשנים</p>
      <p className="mt-1 text-xs font-bold leading-5 text-white/75">
        דף הוא עמוד נפרד. סקשנים הם החלקים שקיימים בתוך העמוד הפעיל.
      </p>

      {activePageTitle && (
        <div className="mt-4 rounded-2xl bg-white/12 p-3">
          <p className="text-[11px] font-black text-white/60">עמוד פעיל</p>
          <p className="mt-1 text-sm font-black">{activePageTitle}</p>
        </div>
      )}
    </div>
  );
}

function AddPageBox({
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
          עמוד נפרד לגמרי
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

function PageTreeNode({
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
    <article
      className={[
        "overflow-hidden rounded-[1.45rem] border bg-white shadow-sm transition",
        active
          ? "border-violet-300 shadow-xl shadow-violet-100"
          : "border-slate-200 hover:border-violet-200",
      ].join(" ")}
    >
      <div className="p-3">
        <div className="flex items-start gap-2">
          <button
            type="button"
            onClick={onToggle}
            className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-slate-100 text-xs font-black text-slate-500 transition hover:bg-violet-50 hover:text-violet-700"
            title={expanded ? "הסתרת סקשנים" : "הצגת סקשנים"}
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
                  דף ראשי
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
            onClick={onSelectPage}
            className={[
              "min-h-10 rounded-2xl px-3 text-xs font-black transition",
              active
                ? "bg-violet-700 text-white shadow-lg shadow-violet-100"
                : "bg-slate-950 text-white hover:bg-violet-700",
            ].join(" ")}
          >
            {active ? "הדף פתוח" : "פתח דף"}
          </button>

          <button
            type="button"
            onClick={onToggle}
            className="min-h-10 rounded-2xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
          >
            {expanded ? "הסתר סקשנים" : "הצג סקשנים"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50/80 px-3 pb-3 pt-4">
          {active ? (
            <>
              <div className="mb-3 flex items-center justify-between gap-2 pr-4">
                <p className="text-xs font-black text-slate-500">
                  סקשנים בעמוד הזה
                </p>

                <button
                  type="button"
                  onClick={onAddSection}
                  className="rounded-xl bg-slate-950 px-3 py-2 text-[11px] font-black text-white transition hover:bg-violet-700"
                >
                  + סקשן
                </button>
              </div>

              <div className="relative pr-4">
                <div className="absolute right-[7px] top-0 h-full w-px bg-slate-200" />

                {sections.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-center">
                    <p className="text-xs font-black text-slate-600">
                      אין עדיין סקשנים בעמוד הזה
                    </p>
                    <button
                      type="button"
                      onClick={onAddSection}
                      className="mt-3 rounded-xl bg-violet-700 px-4 py-2 text-[11px] font-black text-white"
                    >
                      הוספת סקשן ראשון
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {sections.map((section, index) => (
                      <SectionTreeNode
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
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
              <p className="text-xs font-bold leading-5 text-slate-500">
                כדי לראות ולערוך את הסקשנים של הדף הזה, פתחי קודם את הדף.
              </p>
              <button
                type="button"
                onClick={onSelectPage}
                className="mt-3 rounded-xl bg-slate-950 px-4 py-2 text-[11px] font-black text-white transition hover:bg-violet-700"
              >
                פתח דף
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function SectionTreeNode({
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
    <div className="relative pr-5">
      <span className="absolute right-[-8px] top-5 h-px w-5 bg-slate-200" />
      <span className="absolute right-[-13px] top-[14px] grid h-6 w-6 place-items-center rounded-full border border-slate-200 bg-white text-[10px] font-black text-slate-400">
        {index}
      </span>

      <div className="rounded-[1.1rem] border border-slate-200 bg-white p-3 shadow-sm">
        <button
          type="button"
          onClick={onSelect}
          className="block w-full text-right"
        >
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-xs font-black text-slate-950">
                {section.title}
              </p>
              <p className="mt-1 text-[11px] font-bold text-slate-400">
                {kindLabel} · {section.tagName}
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-black text-violet-700">
              סקשן
            </span>
          </div>
        </button>

        <div className="mt-2 grid grid-cols-5 gap-1">
          <TinyAction onClick={onSelect} label="בחר" />
          <TinyAction onClick={onDuplicate} label="שכפל" />
          <TinyAction onClick={onMoveUp} label="↑" />
          <TinyAction onClick={onMoveDown} label="↓" />
          <TinyAction danger onClick={onDelete} label="מחק" />
        </div>

        <button
          type="button"
          onClick={onOpenVariants}
          className="mt-2 min-h-8 w-full rounded-xl border border-slate-200 bg-white px-2 text-[11px] font-black text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
        >
          החלפת מבנה / הוספת מבנה דומה
        </button>
      </div>
    </div>
  );
}

function TinyAction({
  label,
  onClick,
  danger = false,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "min-h-8 rounded-lg px-1 text-[10px] font-black transition",
        danger
          ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
          : "bg-slate-100 text-slate-500 hover:bg-violet-50 hover:text-violet-700",
      ].join(" ")}
    >
      {label}
    </button>
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
