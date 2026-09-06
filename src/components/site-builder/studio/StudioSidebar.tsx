import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import {
  studioCategoryLabel,
  studioElementDescription,
  studioElementLabel,
  studioSectionDescription,
  studioSectionKindLabel,
  studioSectionTitle,
} from "../../../i18n/studioLibraryLabels";
import { localizeBuiltInText } from "../../../i18n/localizeBuiltInTemplateSeed";
import { fontOptions, getThemePalettes } from "./data/themePalettes";
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
  /** Opens full page SEO / GSC settings modal (preferred over stub SEO panel). */
  onOpenPageSeo?: (tab?: "seo" | "advanced" | "social" | "settings") => void;

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

const smartBlockIds = [
  "bizuply-services",
  "bizuply-booking",
  "bizuply-products",
  "bizuply-lead-form",
  "bizuply-reviews",
  "bizuply-club",
];

export default function StudioSidebar({
  activePanel,
  setActivePanel,
  onAddHtml,
  onApplyPalette,
  onOpenMedia,
  onOpenPageSeo,
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth() as {
    user?: { businessId?: string; business?: { _id?: string } } | null;
  };

  const navItems: { key: StudioPanel; label: string; icon: string; hint: string }[] = [
    { key: "add", label: t("studio.elements"), icon: "+", hint: t("studio.elementsHint") },
    { key: "sections", label: t("studio.sections"), icon: "▭", hint: t("studio.sectionsHint") },
    { key: "theme", label: t("studio.design"), icon: "◐", hint: t("studio.designHint") },
    { key: "pages", label: t("studio.pages"), icon: "▤", hint: t("studio.pagesHint") },
    { key: "media", label: t("studio.media"), icon: "▧", hint: t("studio.mediaHint") },
    { key: "store", label: t("studio.store"), icon: "◈", hint: t("studio.storeHint") },
    { key: "services", label: t("studio.services"), icon: "◇", hint: t("studio.servicesHint") },
    { key: "bookings", label: t("studio.bookings"), icon: "◷", hint: t("studio.bookingsHint") },
    { key: "club", label: t("studio.club"), icon: "♛", hint: t("studio.clubHint") },
    { key: "leads", label: t("studio.leads"), icon: "✉", hint: t("studio.leadsHint") },
    { key: "animations", label: t("studio.motion"), icon: "✺", hint: t("studio.motionHint") },
    { key: "seo", label: t("studio.seo.label"), icon: "⌕", hint: t("studio.seoHint") },
    { key: "settings", label: t("studio.settings"), icon: "⚙", hint: t("studio.settingsHint") },
  ];

  const panelTitles: Record<StudioPanel, { title: string; subtitle: string }> = {
    templates: {
      title: t("studio.pageTemplates"),
      subtitle: t("studio.pageTemplatesHint"),
    },
    add: {
      title: t("studio.elements"),
      subtitle: t("studio.elementsSubtitle"),
    },
    sections: {
      title: t("studio.sections"),
      subtitle: t("studio.sectionsSubtitle"),
    },
    theme: {
      title: t("studio.designTitle"),
      subtitle: t("studio.designSubtitle"),
    },
    pages: {
      title: t("studio.pages"),
      subtitle: t("studio.pagesSubtitle"),
    },
    media: {
      title: t("studio.media"),
      subtitle: t("studio.mediaSubtitle"),
    },
    store: {
      title: t("studio.store"),
      subtitle: t("studio.storeSubtitle"),
    },
    services: {
      title: t("studio.services"),
      subtitle: t("studio.servicesSubtitle"),
    },
    bookings: {
      title: t("studio.bookings"),
      subtitle: t("studio.bookingsSubtitle"),
    },
    club: {
      title: t("studio.club"),
      subtitle: t("studio.clubSubtitle"),
    },
    leads: {
      title: t("studio.leads"),
      subtitle: t("studio.leadsSubtitle"),
    },
    animations: {
      title: t("studio.motion"),
      subtitle: t("studio.motionSubtitle"),
    },
    seo: {
      title: t("studio.seo.label"),
      subtitle: t("studio.seoSubtitle"),
    },
    settings: {
      title: t("studio.settings"),
      subtitle: t("studio.settingsSubtitle"),
    },
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

  const currentPanel: StudioPanel = activePanel || "pages";
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

  const localizedElementCategories = useMemo(
    () =>
      elementCategories.map((category) => ({
        ...category,
        label: studioCategoryLabel(t, category.key, category.label),
      })),
    [t]
  );

  const localizedSectionCategories = useMemo(
    () =>
      sectionCategories.map((category) => ({
        ...category,
        label: studioSectionKindLabel(t, category.key, category.label),
      })),
    [t]
  );

  const localizedStudioElements = useMemo(
    () =>
      studioElements.map((element) => ({
        ...element,
        label: studioElementLabel(t, element.id, element.label),
        description: studioElementDescription(
          t,
          element.id,
          element.description || ""
        ),
      })),
    [t]
  );

  const localizedSectionTemplates = useMemo(
    () =>
      sectionTemplates.map((section) => ({
        ...section,
        title: studioSectionTitle(t, section.id, section.title),
        description: studioSectionDescription(
          t,
          section.id,
          section.description || ""
        ),
      })),
    [t]
  );

  const filteredElements = useMemo(() => {
    return localizedStudioElements.filter((element) => {
      const matchesCategory = element.category === elementCategory;

      if (!normalizedSearch) return matchesCategory;

      const haystack = `${element.label} ${element.description || ""} ${
        element.category
      }`.toLowerCase();

      return matchesCategory && haystack.includes(normalizedSearch);
    });
  }, [elementCategory, localizedStudioElements, normalizedSearch]);

  const filteredSections = useMemo(() => {
    return localizedSectionTemplates.filter((section) => {
      const matchesCategory = section.category === sectionCategory;

      if (!normalizedSearch) return matchesCategory;

      const haystack = `${section.title} ${section.description} ${
        section.category
      }`.toLowerCase();

      return matchesCategory && haystack.includes(normalizedSearch);
    });
  }, [localizedSectionTemplates, normalizedSearch, sectionCategory]);

  const storeSectionTemplates = useMemo(() => {
    return localizedSectionTemplates.filter((section) => section.category === "store");
  }, [localizedSectionTemplates]);

  const clearSearch = () => setSearch("");

  const handlePanelClick = (panel: StudioPanel) => {
    if (panel === "seo" && onOpenPageSeo) {
      onOpenPageSeo("advanced");
      setActivePanel(null);
      clearSearch();
      return;
    }

    if (activePanel === panel) {
      setActivePanel(null);
      clearSearch();
      return;
    }

    setActivePanel(panel);
    clearSearch();
  };

  const handleAddHtml = (html: string, label = t("studio.theSection")) => {
    onAddHtml(localizeBuiltInText(html));
    setSuccessMessage(t("studio.addedToPage", { label }));
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

    setSuccessMessage(t("studio.paletteApplied", { name: palette.name }));
  };

  const handleAddPage = () => {
    const title = newPageTitle.trim();

    if (!title) {
      setSuccessMessage(t("studio.enterPageName"));
      return;
    }

    onAddPage?.(title, "blank");
    setNewPageTitle("");
    setSuccessMessage(t("studio.pageCreated", { title }));
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
      className={[
        "grid min-h-0 overflow-hidden border-l border-slate-200 bg-white shadow-[0_18px_70px_rgba(15,23,42,0.06)] transition-[grid-template-columns] duration-300",
        isPanelOpen ? "grid-cols-[96px_minmax(390px,430px)]" : "grid-cols-[96px_0px]",
      ].join(" ")}
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
                  ? "bg-gradient-to-br from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 text-slate-800 shadow-xl shadow-violet-100"
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
              "min-h-0 flex-1 overflow-y-auto p-4",
              "bg-white",
            ].join(" ")}
          >
            {currentPanel === "add" && (
              <Panel>
                <SearchBox
                  value={search}
                  onChange={setSearch}
                  placeholder={t("studio.searchElement")}
                />

                <CategoryGrid>
                  {localizedElementCategories.map((category) => (
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
                  placeholder={t("studio.searchSection")}
                />

                <CompactNotice
                  title={t("studio.addSection")}
                  text={t("studio.sectionWillBeAdded", {
                    title: activePage?.title || t("studio.noPageSelected"),
                  })}
                />

                <CategoryGrid>
                  {localizedSectionCategories.map((category) => (
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
                  title={t("studio.designTitle")}
                  text={t("studio.designNotice")}
                />

                <div className="space-y-3">
                  {getThemePalettes().map((palette) => (
                    <PaletteCard
                      key={palette.id}
                      palette={palette}
                      onClick={() => handleApplyPalette(palette)}
                    />
                  ))}
                </div>

                <p className="mb-3 mt-6 text-sm font-black text-slate-900">
                  {t("studio.fonts")}
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {fontOptions.map((font) => (
                    <button
                      key={font}
                      type="button"
                      onClick={() =>
                        setSuccessMessage(
                          t("studio.fontSelectedViaTheme", { font })
                        )
                      }
                      className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-xs font-black text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
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
                  className="w-full rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 px-4 py-4 text-sm font-black text-black shadow-xl shadow-violet-100 transition hover:-translate-y-0.5"
                >
                  {t("studio.openMediaManager")}
                </button>

                <div className="mt-4 grid gap-3">
                  <Info title={t("studio.regularImage")} text={t("studio.regularImageHint")} />
                  <Info title={t("studio.sectionBackground")} text={t("studio.sectionBackgroundHint")} />
                  <Info title={t("studio.video")} text={t("studio.videoHint")} />
                </div>
              </Panel>
            )}

            {currentPanel === "store" && (
              <Panel>
                <div className="space-y-5">
                  <div className="rounded-[1.6rem] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-5">
                    <p className="text-sm font-black text-violet-900">
                      {t("studio.storeFullPage")}
                    </p>
                    <p className="mt-2 text-xs font-bold leading-6 text-slate-500">
                      {t("studio.storeFullPageText")}
                    </p>

                    <button
                      type="button"
                      onClick={openStoreManagementPage}
                      className="mt-4 w-full rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 px-4 py-4 text-sm font-black text-black shadow-xl shadow-violet-100 transition hover:-translate-y-0.5"
                    >
                      {t("studio.openStoreManagement")}
                    </button>
                  </div>

                  <div className="grid gap-3">
                    <StoreNavButton
                      title={t("studio.addProducts")}
                      text={t("studio.addProductsHint")}
                      onClick={openStoreManagementPage}
                    />

                    <StoreNavButton
                      title={t("studio.productList")}
                      text={t("studio.productListHint")}
                      onClick={openStoreManagementPage}
                    />

                    <StoreNavButton
                      title={t("studio.storeSettings")}
                      text={t("studio.storeSettingsHint")}
                      onClick={openStoreManagementPage}
                    />

                    <StoreNavButton
                      title={t("studio.productCategories")}
                      text={t("studio.productCategoriesHint")}
                      onClick={openStoreManagementPage}
                    />

                    <StoreNavButton
                      title={t("studio.couponsOrders")}
                      text={t("studio.couponsOrdersHint")}
                      onClick={openStoreManagementPage}
                    />
                  </div>

                  <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-black text-slate-900">
                      {t("studio.storeDisplay")}
                    </p>
                    <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
                      {t("studio.storeDisplayText")}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {storeSectionTemplates.map((section) => (
                      <SmartButton
                        key={section.id}
                        title={section.title}
                        text={section.description || t("studio.storeSectionDefault")}
                        onClick={() => handleAddHtml(section.html, section.title)}
                      />
                    ))}
                  </div>

                  {storeSectionTemplates.length === 0 && (
                    <EmptyState text={t("studio.noStoreViews")} />
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
                      text={block.description || t("studio.smartBlockDefault")}
                      onClick={() => handleAddHtml(block.html, block.label)}
                    />
                  ))}
                </div>

                {smartBlocks.length === 0 && (
                  <EmptyState text={t("studio.noSmartBlocks")} />
                )}
              </Panel>
            )}

            {currentPanel === "animations" && (
              <Panel>
                <Info title="Fade Up" text={t("studio.fadeUpHint")} />
                <Info title="Zoom In" text={t("studio.zoomInHint")} />
                <Info title="Slide Right" text={t("studio.slideRightHint")} />
                <Info title="Blur Reveal" text={t("studio.blurRevealHint")} />
              </Panel>
            )}

            {currentPanel === "seo" && (
              <Panel>
                <div className="space-y-3 p-1">
                  <p className="text-sm font-black text-slate-900">
                    {t("studio.seoGscTitle")}
                  </p>
                  <p className="text-xs font-semibold leading-5 text-slate-500">
                    {t("studio.seoGscText")}
                  </p>
                  <button
                    type="button"
                    onClick={() => onOpenPageSeo?.("advanced")}
                    className="flex h-12 w-full items-center justify-center rounded-2xl bg-violet-700 px-4 text-sm font-black text-white transition hover:bg-violet-800"
                  >
                    {t("studio.openVerificationGuide")}
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenPageSeo?.("seo")}
                    className="flex h-11 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 transition hover:bg-slate-50"
                  >
                    {t("studio.basicPageSeo")}
                  </button>
                </div>
              </Panel>
            )}

            {currentPanel === "settings" && (
              <Panel>
                <Info title={t("studio.domain")} text={t("studio.domainHint", { slug: "your-business" })} />
                <Info title={t("studio.analytics")} text={t("studio.analyticsHint")} />
                <Info title={t("studio.publishStatus")} text={t("studio.publishStatusHint")} />
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
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <input
          value={newPageTitle}
          onChange={(event) => setNewPageTitle(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") onAddPage();
          }}
          placeholder={t("studio.newPagePlaceholder")}
          className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400 focus:border-violet-400"
        />

        <button
          type="button"
          onClick={onAddPage}
          className="h-11 rounded-xl bg-violet-700 px-4 text-xs font-black text-black shadow-lg shadow-violet-100 transition hover:bg-violet-800"
        >
          {t("studio.addPage")}
        </button>
      </div>

      <SearchBox
        value={search}
        onChange={setSearch}
        placeholder={t("studio.searchPage")}
      />

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2">
        <div className="mb-2 flex items-center justify-between px-2 py-1">
          <p className="text-xs font-black text-slate-500">{t("studio.sitePages")}</p>
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
              <p className="text-sm font-black text-slate-700">{t("studio.noPages")}</p>
              <p className="mt-1 text-xs font-bold text-slate-400">
                {t("studio.noPagesHint")}
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
  const { t } = useTranslation();
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
            title={page.isHome ? t("studio.homePage") : t("studio.openPage")}
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
          <LightToolButton title={t("studio.openPage")} onClick={onSelectPage}>
            {active ? t("studio.opened") : t("studio.open")}
          </LightToolButton>

          <LightIconButton title={t("studio.design")} onClick={onSelectPage}>
            🎨
          </LightIconButton>

          <LightIconButton title={t("studio.settings")} onClick={onSelectPage}>
            ⚙
          </LightIconButton>

          <LightIconButton title={t("studio.drag")}>
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
                  {t("studio.pageSections")}
                </span>

                <button
                  type="button"
                  onClick={onAddSection}
                  className="h-8 rounded-lg bg-violet-700 px-3 text-[11px] font-black text-black transition hover:bg-violet-800"
                >
                  {t("studio.addSection")}
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
                        {t("studio.noSectionsOnPage")}
                      </p>
                      <button
                        type="button"
                        onClick={onAddSection}
                        className="mt-3 rounded-lg bg-violet-700 px-4 py-2 text-xs font-black text-black"
                      >
                        {t("studio.addFirstSection")}
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
              {t("studio.openPageToSeeSections")}
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
  const { t } = useTranslation();
  const kindLabel = t(`studio.kind.${section.kind}`, {
    defaultValue: section.kind || t("studio.kind.section"),
  });

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
          <LightToolButton title={t("studio.select")} onClick={onSelect}>
            {t("studio.edit")}
          </LightToolButton>
          <LightIconButton title={t("studio.structure")} onClick={onOpenVariants}>
            🎨
          </LightIconButton>
          <LightIconButton title={t("studio.duplicate")} onClick={onDuplicate}>
            ⧉
          </LightIconButton>
          <LightIconButton title={t("studio.moveUp")} onClick={onMoveUp}>
            ↑
          </LightIconButton>
          <LightIconButton title={t("studio.moveDown")} onClick={onMoveDown}>
            ↓
          </LightIconButton>
          <LightIconButton title={t("studio.delete")} onClick={onDelete}>
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
  const { t } = useTranslation();
  return (
    <div className="border-b border-slate-200 bg-white px-5 py-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-800">
            {title}
          </h2>
          <p className="mt-1 text-sm font-bold leading-6 text-slate-400">
            {subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-white text-lg font-black text-slate-400 shadow-sm transition hover:border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 hover:text-white"
          title={t("studio.closePanel")}
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
      <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-lg font-black text-violet-700 transition group-hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100 group-hover:text-white">
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
  const { t } = useTranslation();
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
          {t("studio.add")}
        </span>
      </div>

      <p className="text-sm font-black text-slate-800">{section.title}</p>

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
  const { t } = useTranslation();
  const swatches = [
    "bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70",
    "bg-fuchsia-500",
    "bg-sky-400",
    "bg-emerald-400",
    "bg-amber-400",
    "border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800",
  ];

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-[1.25rem] border border-slate-200 bg-white p-4 text-right shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl"
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {swatches.map((swatch, index) => (
          <span
            key={`${palette.id || palette.name}-${index}`}
            className={[
              "h-9 w-9 rounded-xl border border-white shadow",
              swatch,
            ].join(" ")}
            title={t("studio.colorN", { n: index + 1 })}
          />
        ))}
      </div>

      <p className="text-base font-black text-slate-800">{palette.name}</p>

      <p className="mt-1 text-xs font-bold leading-5 text-slate-400">
        {palette.description}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-500">
          {t("studio.headings")}: {palette.font.heading}
        </span>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-500">
          {t("studio.bodyText")}: {palette.font.body}
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
          <span className="block text-sm font-black text-slate-800">
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
      <p className="text-sm font-black text-slate-800">{title}</p>
      <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
        {text}
      </p>
    </button>
  );
}

function Info({ title, text }: { title: string; text: string }) {
  return (
    <div className="mb-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-black text-slate-800">{title}</p>
      <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
        {text}
      </p>
    </div>
  );
}


function EmptyState({ text }: { text?: string }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
      <p className="text-sm font-black text-slate-700">{t("studio.noResults")}</p>
      <p className="mt-1 text-xs font-bold text-slate-400">
        {text || t("studio.noResultsHint")}
      </p>
    </div>
  );
}
