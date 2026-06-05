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
    subtitle: "תבנית מחליפה רק את העמוד הפעיל, לא יוצרת דפים בכוח.",
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
    subtitle: "עמוד חדש הוא דף נפרד. בתוך כל דף מוסיפים סקשנים.",
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
    if (!normalizedSearch) return pageTemplates;

    return pageTemplates.filter((template) => {
      const haystack = `${template.name} ${template.category} ${template.description}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [normalizedSearch]);

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

          <div
            className={[
              "min-h-0 flex-1 overflow-y-auto",
              currentPanel === "pages" ? "bg-[#263238] p-5" : "bg-white p-4",
            ].join(" ")}
          >
            {currentPanel === "templates" && (
              <Panel>
                <SearchBox
                  value={search}
                  onChange={setSearch}
                  placeholder="חיפוש תבנית..."
                />

                <CompactNotice
                  title="תבנית לעמוד הפעיל"
                  text={`עמוד פעיל: ${activePage?.title || "לא נבחר"}`}
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
    <div className="space-y-4 text-white">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onAddPage}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-l-md rounded-r-none bg-[#ff9f0a] px-4 text-base font-black text-white shadow-lg shadow-black/20 transition hover:bg-[#ffb02e]"
        >
          <span className="text-2xl leading-none">＋</span>
          <span>הוסף עמוד חדש</span>
        </button>

        <button
          type="button"
          className="grid h-12 w-12 place-items-center rounded-r-md rounded-l-none bg-[#ff9f0a] text-white transition hover:bg-[#ffb02e]"
          title="אפשרויות"
        >
          ▾
        </button>
      </div>

      <div className="rounded-md bg-[#11191c] p-3 shadow-xl shadow-black/20">
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <input
            value={newPageTitle}
            onChange={(event) => setNewPageTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") onAddPage();
            }}
            placeholder="שם עמוד חדש..."
            className="h-10 rounded-none border border-white/15 bg-[#0c1214] px-3 text-sm font-bold text-white outline-none placeholder:text-white/35 focus:border-[#ff9f0a]"
          />

          <button
            type="button"
            onClick={onAddPage}
            className="h-10 bg-[#ff9f0a] px-4 text-xs font-black text-white transition hover:bg-[#ffb02e]"
          >
            הוסף
          </button>
        </div>
      </div>

      <div className="rounded-md bg-[#11191c] p-3 shadow-xl shadow-black/20">
        <DarkSearchBox
          value={search}
          onChange={setSearch}
          placeholder="חיפוש עמוד..."
        />
      </div>

      <div className="space-y-3">
        {pages.map((page) => {
          const active = page.id === activePageId;
          const expanded = expandedPages[page.id] ?? active;

          return (
            <DarkPageRow
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
          <div className="rounded-md border border-dashed border-white/20 bg-[#11191c] p-6 text-center">
            <p className="text-sm font-black text-white">אין עמודים</p>
            <p className="mt-1 text-xs font-bold text-white/45">
              צרי עמוד חדש כדי להתחיל.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function DarkPageRow({
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
        "border bg-[#10191a] shadow-lg shadow-black/20 transition",
        active ? "border-[#ff9f0a]" : "border-transparent",
      ].join(" ")}
    >
      <div className="grid min-h-[72px] grid-cols-[36px_1fr_auto] items-center gap-3 px-3">
        <button
          type="button"
          onClick={onToggle}
          className="grid h-10 w-9 place-items-center text-lg font-black text-white/55 transition hover:text-[#ff9f0a]"
          title={expanded ? "סגור" : "פתח"}
        >
          {expanded ? "▾" : "▸"}
        </button>

        <div className="grid min-w-0 grid-cols-[auto_1fr] items-center gap-3">
          <button
            type="button"
            onClick={onSelectPage}
            className="text-xl text-white/80 transition hover:text-[#ff9f0a]"
            title={page.isHome ? "בית" : "פתח עמוד"}
          >
            {page.isHome ? "⌂" : "⠿"}
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
            className="h-11 min-w-0 border border-white/20 bg-transparent px-3 text-right text-base font-black text-white outline-none transition hover:border-white/35 focus:border-[#ff9f0a]"
          />
        </div>

        <div className="flex items-center justify-end">
          <DarkToolButton title="עריכה" onClick={onSelectPage}>
            עריכה
          </DarkToolButton>

          <DarkIconButton title="עיצוב" onClick={onSelectPage}>
            🎨
          </DarkIconButton>

          <DarkIconButton title="הגדרות" onClick={onSelectPage}>
            ⚙
          </DarkIconButton>

          <DarkIconButton title="גרירה">
            ⠿
          </DarkIconButton>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-white/10 bg-[#0b1113] px-3 py-3">
          {active ? (
            <>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-black text-white/55">
                  סקשנים בעמוד
                </span>

                <button
                  type="button"
                  onClick={onAddSection}
                  className="h-9 bg-[#ff9f0a] px-4 text-xs font-black text-white transition hover:bg-[#ffb02e]"
                >
                  + הוסף סקשן
                </button>
              </div>

              <div className="space-y-2">
                {sections.map((section, index) => (
                  <DarkSectionRow
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
                  <div className="border border-dashed border-white/15 bg-[#10191a] p-4 text-center">
                    <p className="text-xs font-bold text-white/50">
                      אין סקשנים בעמוד הזה.
                    </p>
                    <button
                      type="button"
                      onClick={onAddSection}
                      className="mt-3 bg-[#ff9f0a] px-4 py-2 text-xs font-black text-white"
                    >
                      הוסף סקשן ראשון
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={onSelectPage}
              className="w-full border border-white/15 bg-[#10191a] px-4 py-3 text-xs font-black text-white/60 transition hover:border-[#ff9f0a] hover:text-white"
            >
              פתחי את העמוד כדי לראות את הסקשנים שלו
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function DarkSectionRow({
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
    <div className="grid min-h-[54px] grid-cols-[32px_1fr_auto] items-center gap-2 border border-white/10 bg-[#152123] px-3">
      <span className="grid h-7 w-7 place-items-center bg-white/5 text-[10px] font-black text-white/45">
        {index}
      </span>

      <button type="button" onClick={onSelect} className="min-w-0 text-right">
        <p className="truncate text-sm font-black text-white">{section.title}</p>
        <p className="mt-0.5 text-[10px] font-bold text-white/40">
          {kindLabel}
        </p>
      </button>

      <div className="flex items-center">
        <DarkToolButton title="בחר" onClick={onSelect}>
          עריכה
        </DarkToolButton>
        <DarkIconButton title="מבנה" onClick={onOpenVariants}>
          🎨
        </DarkIconButton>
        <DarkIconButton title="שכפל" onClick={onDuplicate}>
          ⧉
        </DarkIconButton>
        <DarkIconButton title="למעלה" onClick={onMoveUp}>
          ↑
        </DarkIconButton>
        <DarkIconButton title="למטה" onClick={onMoveDown}>
          ↓
        </DarkIconButton>
        <DarkIconButton title="מחק" onClick={onDelete}>
          🗑
        </DarkIconButton>
        <DarkIconButton title="גרירה">⠿</DarkIconButton>
      </div>
    </div>
  );
}

function DarkToolButton({
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
      className="h-10 border border-white/15 bg-white/10 px-4 text-sm font-bold text-white transition hover:border-[#ff9f0a] hover:bg-[#ff9f0a] hover:text-white"
    >
      {children}
    </button>
  );
}

function DarkIconButton({
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
      className="grid h-10 w-11 place-items-center border border-r-0 border-white/15 bg-white/10 text-sm font-black text-white/80 transition hover:border-[#ff9f0a] hover:bg-[#ff9f0a] hover:text-white"
    >
      {children}
    </button>
  );
}

function DarkSearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] border border-white/15 bg-[#0c1214]">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 bg-transparent px-3 text-sm font-bold text-white outline-none placeholder:text-white/35"
      />

      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="h-10 w-10 text-sm font-black text-white/50 hover:text-[#ff9f0a]"
        >
          ×
        </button>
      ) : (
        <span className="grid h-10 w-10 place-items-center text-white/35">⌕</span>
      )}
    </div>
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
      className="group rounded-[1.25rem] border border-slate-200 bg-white p-2 text-right shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl"
    >
      <div className="relative mb-3 overflow-hidden rounded-xl bg-slate-100">
        <img
          src={template.preview}
          alt=""
          className="h-28 w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-black text-violet-700 shadow-sm">
          החל
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
