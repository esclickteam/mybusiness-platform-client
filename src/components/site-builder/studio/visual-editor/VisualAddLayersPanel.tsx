import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ArrowDownToLine,
  ArrowUpToLine,
  Code2,
  Eye,
  EyeOff,
  FileText,
  Grid3X3,
  ImagePlus,
  Layers3,
  MousePointer2,
  PanelTop,
  Plus,
  RefreshCw,
  Save,
  Search,
  Sparkles,
  Trash2,
  Upload,
  WandSparkles,
  Video,
  X,
} from "lucide-react";

import ProfessionalMediaBrowser from "./library/ProfessionalMediaBrowser";
import AnimatedIconBrowser from "./library/AnimatedIconBrowser";
import LottieAnimationBrowser from "./library/LottieAnimationBrowser";
import {
  SECTION_LIBRARY,
  getSectionsByCategory,
} from "./library/sectionLibrary";
import {
  SECTION_LIBRARY_NAV,
  type SectionLibraryNavId,
} from "./library/sectionCategories";
import SectionLibraryCardPreview from "./library/SectionLibraryCardPreview";
import {
  PAGE_LIBRARY,
  PAGE_LIBRARY_NAV,
  getPagesByCategory,
} from "./library/pageLibrary";
import type { VisualLibraryPageTemplate } from "./library/visualLibraryTypes";

type PanelMode = "add" | "layers" | "code" | null;
type AddPanelTab =
  | "elements"
  | "sections"
  | "pages"
  | "icons"
  | "animations"
  | "media";

type ElementCategory =
  | "all"
  | "text"
  | "buttons"
  | "media"
  | "shapes";

type VisualAddLayersPanelProps = {
  editor: any;
  mode: PanelMode;
  onClose: () => void;
  onAddHtml?: (
    html: string,
  ) => string | void | Promise<string | void>;
  onAddLibraryPage?: (page: VisualLibraryPageTemplate) => void;
};

type LayerItem = {
  id: string;
  label: string;
  type: string;
  zIndex: number;
  hidden?: boolean;
  locked?: boolean;
  inserted?: boolean;
};

type LibraryElement = {
  id: string;
  title: string;
  description: string;
  category: Exclude<ElementCategory, "all">;
  preview:
    | "heading"
    | "paragraph"
    | "button"
    | "image"
    | "video"
    | "box"
    | "divider";
  action: () => void | Promise<any>;
};

const ELEMENT_CATEGORY_LABELS: Array<{
  id: ElementCategory;
  label: string;
}> = [
  { id: "all", label: "הכול" },
  { id: "text", label: "טקסט" },
  { id: "buttons", label: "כפתורים" },
  { id: "media", label: "מדיה" },
  { id: "shapes", label: "קופסאות וצורות" },
];

function CodeField({
  label,
  value,
  onChange,
  placeholder,
  rows = 7,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-800">
        {label}
      </span>

      <textarea
        dir="ltr"
        rows={rows}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        spellCheck={false}
        className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-950 p-3 font-mono text-xs leading-6 text-emerald-300 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
      />
    </label>
  );
}

function ElementPreview({
  kind,
}: {
  kind: LibraryElement["preview"];
}) {
  if (kind === "heading") {
    return (
      <div className="flex h-full items-center justify-center bg-white px-6">
        <div className="w-full text-center">
          <div className="mx-auto h-3 w-24 rounded-full bg-slate-900" />
          <div className="mx-auto mt-3 h-2 w-40 rounded-full bg-slate-300" />
        </div>
      </div>
    );
  }

  if (kind === "paragraph") {
    return (
      <div className="flex h-full items-center justify-center bg-white px-7">
        <div className="w-full space-y-2">
          <div className="h-2 w-full rounded-full bg-slate-500" />
          <div className="h-2 w-5/6 rounded-full bg-slate-300" />
          <div className="h-2 w-2/3 rounded-full bg-slate-300" />
        </div>
      </div>
    );
  }

  if (kind === "button") {
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <div className="rounded-full bg-violet-600 px-8 py-3 text-xs font-black text-white shadow-lg shadow-violet-200">
          לחצו כאן
        </div>
      </div>
    );
  }

  if (kind === "image") {
    return (
      <div className="relative h-full overflow-hidden bg-gradient-to-br from-sky-100 via-indigo-100 to-violet-200">
        <div className="absolute bottom-0 left-0 h-16 w-24 rounded-tr-[70px] bg-emerald-300/80" />
        <div className="absolute right-7 top-5 h-10 w-10 rounded-full bg-amber-300" />
        <div className="absolute bottom-5 right-6 h-11 w-28 rounded-2xl bg-white/75 backdrop-blur" />
      </div>
    );
  }

  if (kind === "video") {
    return (
      <div className="relative flex h-full items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-700/70 to-sky-500/30" />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-xl">
          <Video className="h-5 w-5 text-slate-950" />
        </div>
      </div>
    );
  }

  if (kind === "box") {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50 p-5">
        <div className="h-full w-full rounded-[28px] border border-slate-300 bg-white shadow-[0_14px_30px_rgba(15,23,42,0.08)]" />
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center bg-white px-8">
      <div className="h-1 w-full rounded-full bg-slate-900" />
    </div>
  );
}

function NavigationButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group flex w-full flex-col items-center gap-2 rounded-2xl px-2 py-3 text-[11px] font-black transition",
        active
          ? "bg-violet-50 text-violet-700"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-10 w-10 items-center justify-center rounded-xl transition",
          active
            ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
            : "bg-slate-100 text-slate-600 group-hover:bg-white group-hover:shadow-sm",
        ].join(" ")}
      >
        {icon}
      </span>
      {label}
    </button>
  );
}

export default function VisualAddLayersPanel({
  editor,
  mode,
  onClose,
  onAddHtml,
  onAddLibraryPage,
}: VisualAddLayersPanelProps) {
  const [layers, setLayers] =
    useState<LayerItem[]>([]);
  const [addTab, setAddTab] = useState<AddPanelTab>("sections");
  const [elementCategory, setElementCategory] =
    useState<ElementCategory>("all");
  const [sectionCategory, setSectionCategory] =
    useState<SectionLibraryNavId>("all");
  const [pageCategory, setPageCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [mediaQuery, setMediaQuery] = useState("");

  const [codeScope, setCodeScope] = useState<"site" | "page">("site");
  const [codeDraft, setCodeDraft] = useState({
    enabled: true,
    css: "",
    headHtml: "",
    bodyStartHtml: "",
    bodyEndHtml: "",
    javascript: "",
  });

  const selectedElementId = String(
    editor?.selectedElement?.id || "",
  );

  const refreshLayers = () => {
    const next =
      typeof editor?.getLayerItems === "function"
        ? editor.getLayerItems()
        : [];

    setLayers(Array.isArray(next) ? next : []);
  };

  useEffect(() => {
    if (mode !== "layers") return;

    refreshLayers();

    const timer =
      window.setInterval(refreshLayers, 700);

    return () => window.clearInterval(timer);
  }, [
    mode,
    editor?.data,
    editor?.selectedElement?.id,
  ]);

  useEffect(() => {
    if (mode !== "code") return;

    const source =
      codeScope === "site"
        ? editor?.siteCustomCode
        : editor?.pageCustomCode || editor?.customCode;

    setCodeDraft({
      enabled: source?.enabled !== false,
      css: String(source?.css || ""),
      headHtml: String(source?.headHtml || ""),
      bodyStartHtml: String(source?.bodyStartHtml || ""),
      bodyEndHtml: String(source?.bodyEndHtml || ""),
      javascript: String(source?.javascript || ""),
    });
  }, [
    mode,
    codeScope,
    editor?.siteCustomCode,
    editor?.pageCustomCode,
    editor?.customCode,
  ]);

  useEffect(() => {
    if (mode !== "add") return;

    setAddTab("elements");
    setElementCategory("all");
    setSearchQuery("");
    setMediaQuery("");
  }, [mode]);

  const closeAfter = (
    action: () => void | Promise<any>,
  ) => {
    // סוגרים את פאנל ההוספה מיד אחרי שהוספנו סקשן / אלמנט
    void Promise.resolve(action()).finally(() => {
      onClose();
    });
  };

  const elements = useMemo<LibraryElement[]>(
    () => [
      {
        id: "heading",
        title: "כותרת",
        description: "כותרת גדולה ומודגשת",
        category: "text",
        preview: "heading",
        action: () => editor?.addText?.(),
      },
      {
        id: "paragraph",
        title: "פסקת טקסט",
        description: "טקסט חופשי לתוכן והסברים",
        category: "text",
        preview: "paragraph",
        action: () => editor?.addText?.(),
      },
      {
        id: "button",
        title: "כפתור מעוצב",
        description: "כפתור עצמאי עם קישור",
        category: "buttons",
        preview: "button",
        action: () => editor?.addButton?.(),
      },
      {
        id: "image",
        title: "תמונה",
        description: "העלאה מהמחשב והחלפה חופשית",
        category: "media",
        preview: "image",
        action: () => editor?.addImage?.(),
      },
      {
        id: "video",
        title: "סרטון",
        description: "וידאו אוטומטי, מושתק ובלולאה",
        category: "media",
        preview: "video",
        action: () => editor?.addVideo?.(),
      },
      {
        id: "box",
        title: "קופסה מעוצבת",
        description: "רקע, מסגרת או שכבת תוכן",
        category: "shapes",
        preview: "box",
        action: () => editor?.addBox?.(),
      },
      {
        id: "divider",
        title: "קו מפריד",
        description: "קו עצמאי לגרירה וצביעה",
        category: "shapes",
        preview: "divider",
        action: () => editor?.addDivider?.(),
      },
    ],
    [editor],
  );

  const filteredElements = useMemo(() => {
    const normalizedSearch = searchQuery
      .trim()
      .toLowerCase();

    return elements.filter((item) => {
      const matchesCategory =
        elementCategory === "all" ||
        item.category === elementCategory;

      const matchesSearch =
        !normalizedSearch ||
        `${item.title} ${item.description}`
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [
    elementCategory,
    elements,
    searchQuery,
  ]);

  const filteredSections = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    const base =
      sectionCategory === "blank"
        ? []
        : sectionCategory === "all"
          ? SECTION_LIBRARY
          : getSectionsByCategory(sectionCategory);

    return base.filter((item) => {
      if (!normalizedSearch) return true;
      return `${item.title} ${item.description} ${(item.keywords || []).join(" ")}`
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [searchQuery, sectionCategory]);

  const filteredPages = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    const base = getPagesByCategory(pageCategory);

    return base.filter((item) => {
      if (!normalizedSearch) return true;
      return `${item.title} ${item.description} ${(item.keywords || []).join(" ")}`
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [searchQuery, pageCategory]);

  const activeSectionCategoryLabel =
    SECTION_LIBRARY_NAV.find((item) => item.id === sectionCategory)
      ?.label || "הכול";

  const activePageCategoryLabel =
    PAGE_LIBRARY_NAV.find((item) => item.id === pageCategory)?.label ||
    "הכול";

  const handleAddLibraryPage = (page: VisualLibraryPageTemplate) => {
    closeAfter(() => {
      if (typeof onAddLibraryPage === "function") {
        onAddLibraryPage(page);
        return;
      }

      if (typeof editor?.addLibraryPage === "function") {
        editor.addLibraryPage(page.id);
      }
    });
  };

  const selectedLayer = useMemo(
    () =>
      layers.find(
        (item) => item.id === selectedElementId,
      ) || null,
    [layers, selectedElementId],
  );

  if (!mode) return null;

  const panelWidthClass =
    mode === "add"
      ? addTab === "sections" || addTab === "pages"
        ? "w-[min(1280px,calc(100vw-32px))]"
        : "w-[1160px]"
      : "w-[480px]";

  const title =
    mode === "add"
      ? addTab === "sections"
        ? "הוספת סקשן"
        : addTab === "pages"
          ? "הוספת עמוד"
          : "הוספת אלמנטים"
      : mode === "layers"
        ? "שכבות"
        : "קוד מותאם";

  return (
    <aside
      data-editor-only="true"
      data-bizuply-editor-only="true"
      className={[
        "fixed bottom-4 right-4 top-[88px] z-[2147483200] flex max-w-[calc(100vw-32px)] overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_32px_100px_rgba(15,23,42,0.24)]",
        panelWidthClass,
      ].join(" ")}
      dir="rtl"
    >
      {mode === "add" ? (
        <>
          <nav className="flex w-[96px] shrink-0 flex-col border-l border-slate-200 bg-white p-3">
            <div className="mb-3 flex h-11 items-center justify-center">
              <Sparkles className="h-5 w-5 text-violet-600" />
            </div>

            <div className="space-y-2">
              <NavigationButton
                active={addTab === "elements"}
                icon={
                  <Grid3X3 className="h-5 w-5" />
                }
                label="אלמנטים"
                onClick={() =>
                  setAddTab("elements")
                }
              />

              <NavigationButton
                active={addTab === "sections"}
                icon={
                  <PanelTop className="h-5 w-5" />
                }
                label="סקשנים"
                onClick={() =>
                  setAddTab("sections")
                }
              />

              <NavigationButton
                active={addTab === "pages"}
                icon={
                  <FileText className="h-5 w-5" />
                }
                label="עמודים"
                onClick={() => setAddTab("pages")}
              />

              <NavigationButton
                active={addTab === "icons"}
                icon={
                  <Grid3X3 className="h-5 w-5" />
                }
                label="אייקונים"
                onClick={() =>
                  setAddTab("icons")
                }
              />

              <NavigationButton
                active={addTab === "animations"}
                icon={
                  <WandSparkles className="h-5 w-5" />
                }
                label="אנימציות"
                onClick={() =>
                  setAddTab("animations")
                }
              />

              <NavigationButton
                active={addTab === "media"}
                icon={
                  <ImagePlus className="h-5 w-5" />
                }
                label="מדיה"
                onClick={() => setAddTab("media")}
              />
            </div>

            <div className="mt-auto">
              <button
                type="button"
                onClick={() =>
                  closeAfter(() =>
                    editor?.addImage?.(),
                  )
                }
                className="flex w-full flex-col items-center gap-2 rounded-2xl px-2 py-3 text-[11px] font-black text-slate-500 transition hover:bg-slate-50 hover:text-violet-700"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <Upload className="h-5 w-5" />
                </span>
                העלאה
              </button>
            </div>
          </nav>

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="flex h-[74px] shrink-0 items-center justify-between border-b border-slate-200 px-6">
              <div>
                <h2 className="text-xl font-black text-slate-950">
                  {title}
                </h2>
                <p className="mt-1 text-xs font-bold text-slate-400">
                  {addTab === "icons"
                    ? "בחרו אייקון, צבע ואפקט והוסיפו לעמוד"
                    : addTab === "animations"
                      ? "בחרו אנימציית Lottie מקצועית והוסיפו לעמוד"
                      : addTab === "sections"
                        ? `ספריית סקשנים · ${SECTION_LIBRARY.length} עיצובים בעברית`
                        : addTab === "pages"
                          ? `ספריית עמודים · ${PAGE_LIBRARY.length} תבניות בעברית`
                          : "בחרו אלמנט, סקשן או מדיה והוסיפו לעמוד"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    closeAfter(() =>
                      editor?.addImage?.(),
                    )
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-violet-700 transition hover:border-violet-300 hover:bg-violet-50"
                >
                  <Upload className="h-4 w-4" />
                  העלאה
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                  aria-label="סגירה"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </header>

            {addTab === "media" ? (
              <ProfessionalMediaBrowser
                editor={editor}
                query={mediaQuery}
                onQueryChange={setMediaQuery}
              />
            ) : addTab === "icons" ? (
              <AnimatedIconBrowser
                editor={editor}
                onInserted={() => {
                  window.setTimeout(
                    refreshLayers,
                    50,
                  );
                  onClose();
                }}
              />
            ) : addTab === "animations" ? (
              <LottieAnimationBrowser
                editor={editor}
                onAddHtml={onAddHtml}
                onInserted={() => {
                  window.setTimeout(
                    refreshLayers,
                    50,
                  );
                  onClose();
                }}
              />
            ) : addTab === "pages" ? (
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="shrink-0 border-b border-slate-200 bg-white px-6 py-4">
                  <label className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-violet-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-100">
                    <Search className="h-5 w-5 shrink-0 text-slate-400" />

                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(event) =>
                        setSearchQuery(event.target.value)
                      }
                      placeholder="חיפוש עמודים..."
                      className="min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
                    />
                  </label>
                </div>

                <div className="flex min-h-0 flex-1 overflow-hidden">
                  <aside className="w-[220px] shrink-0 overflow-y-auto border-l border-slate-200 bg-white p-3">
                    <p className="mb-3 px-2 text-[11px] font-black uppercase tracking-wide text-slate-400">
                      קטגוריות
                    </p>
                    {PAGE_LIBRARY_NAV.map((categoryItem) => (
                      <button
                        key={categoryItem.id}
                        type="button"
                        onClick={() => setPageCategory(categoryItem.id)}
                        className={[
                          "mb-1 flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-right text-xs font-black transition",
                          pageCategory === categoryItem.id
                            ? "bg-slate-100 text-slate-950"
                            : "text-slate-600 hover:bg-slate-50",
                        ].join(" ")}
                      >
                        <span>{categoryItem.label}</span>
                        {categoryItem.id === "all" ? (
                          <span className="rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-black text-violet-700">
                            {PAGE_LIBRARY.length}
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-200/70 px-1.5 py-0.5 text-[10px] font-black text-slate-500">
                            {getPagesByCategory(categoryItem.id).length}
                          </span>
                        )}
                      </button>
                    ))}
                  </aside>

                  <div className="min-h-0 flex-1 overflow-y-auto bg-[#f7f8fb] p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-black text-slate-950">
                          ספריית עמודים · {activePageCategoryLabel}
                        </h3>
                        <p className="mt-1 text-xs font-bold text-slate-400">
                          לחיצה יוצרת עמוד חדש עם הסקשנים המוכנים
                        </p>
                      </div>

                      <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-500 shadow-sm">
                        {filteredPages.length} עמודים
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
                      {filteredPages.map((page) => (
                        <button
                          key={page.id}
                          type="button"
                          onClick={() => handleAddLibraryPage(page)}
                          className="group overflow-hidden rounded-[22px] border border-slate-200 bg-white text-right shadow-sm transition duration-200 hover:-translate-y-1 hover:border-violet-300 hover:shadow-[0_20px_45px_rgba(91,33,182,0.12)]"
                        >
                          <div className="flex h-[120px] items-center justify-center border-b border-slate-100 bg-gradient-to-br from-violet-50 via-white to-sky-50">
                            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 transition group-hover:bg-violet-600 group-hover:text-white">
                              <FileText className="h-6 w-6" />
                            </span>
                          </div>

                          <div className="flex items-start justify-between gap-3 p-4">
                            <div className="min-w-0">
                              <h4 className="truncate text-sm font-black text-slate-950">
                                {page.title}
                              </h4>
                              <p className="mt-1 line-clamp-2 text-xs font-bold leading-5 text-slate-400">
                                {page.description}
                              </p>
                              <p className="mt-2 text-[11px] font-black text-violet-600">
                                {page.sectionIds.length} סקשנים
                              </p>
                            </div>

                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700 transition group-hover:bg-violet-600 group-hover:text-white">
                              <Plus className="h-4 w-4" />
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {filteredPages.length === 0 ? (
                      <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                        <p className="text-sm font-black text-slate-700">
                          לא נמצאו עמודים
                        </p>
                        <p className="mt-2 text-xs font-bold text-slate-400">
                          נסו חיפוש אחר או עברו לקטגוריה אחרת
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="shrink-0 border-b border-slate-200 bg-white px-6 py-4">
                  <label className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-violet-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-100">
                    <Search className="h-5 w-5 shrink-0 text-slate-400" />

                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(event) =>
                        setSearchQuery(
                          event.target.value,
                        )
                      }
                      placeholder={
                        addTab === "sections"
                          ? "חיפוש סקשנים..."
                          : "חיפוש אלמנטים..."
                      }
                      className="min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
                    />
                  </label>

                  {addTab === "elements" ? (
                    <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                      {ELEMENT_CATEGORY_LABELS.map(
                        (categoryItem) => (
                          <button
                            key={categoryItem.id}
                            type="button"
                            onClick={() =>
                              setElementCategory(
                                categoryItem.id,
                              )
                            }
                            className={[
                              "whitespace-nowrap rounded-full px-4 py-2 text-xs font-black transition",
                              elementCategory ===
                              categoryItem.id
                                ? "bg-slate-950 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                            ].join(" ")}
                          >
                            {categoryItem.label}
                          </button>
                        ),
                      )}
                    </div>
                  ) : null}
                </div>

                <div
                  className={
                    addTab === "sections"
                      ? "flex min-h-0 flex-1 overflow-hidden"
                      : "min-h-0 flex-1 overflow-y-auto bg-[#f7f8fb] p-6"
                  }
                >
                  {addTab === "elements" ? (
                    <>
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-black text-slate-950">
                            אלמנטים
                          </h3>
                          <p className="mt-1 text-xs font-bold text-slate-400">
                            לחיצה מוסיפה את האלמנט
                            לקנבס
                          </p>
                        </div>

                        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-500 shadow-sm">
                          {filteredElements.length}{" "}
                          פריטים
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        {filteredElements.map(
                          (item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() =>
                                closeAfter(
                                  item.action,
                                )
                              }
                              className="group overflow-hidden rounded-[22px] border border-slate-200 bg-white text-right shadow-sm transition duration-200 hover:-translate-y-1 hover:border-violet-300 hover:shadow-[0_18px_40px_rgba(91,33,182,0.12)]"
                            >
                              <div className="h-[132px] overflow-hidden border-b border-slate-100 bg-white">
                                <ElementPreview
                                  kind={
                                    item.preview
                                  }
                                />
                              </div>

                              <div className="p-4">
                                <h4 className="text-sm font-black text-slate-950">
                                  {item.title}
                                </h4>
                                <p className="mt-1 text-xs font-bold leading-5 text-slate-400">
                                  {
                                    item.description
                                  }
                                </p>
                              </div>
                            </button>
                          ),
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex min-h-0 flex-1 gap-0">
                      <aside className="w-[220px] shrink-0 overflow-y-auto border-l border-slate-200 bg-white p-3">
                        <p className="mb-3 px-2 text-[11px] font-black uppercase tracking-wide text-slate-400">
                          קטגוריות
                        </p>
                        {SECTION_LIBRARY_NAV.map((categoryItem) => (
                          <button
                            key={categoryItem.id}
                            type="button"
                            onClick={() => {
                              if (categoryItem.id === "blank") {
                                closeAfter(() =>
                                  editor?.addSection?.(
                                    "after",
                                    undefined,
                                    "blank",
                                  ),
                                );
                                return;
                              }
                              setSectionCategory(categoryItem.id);
                            }}
                            className={[
                              "mb-1 flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-right text-xs font-black transition",
                              sectionCategory === categoryItem.id
                                ? "bg-slate-100 text-slate-950"
                                : "text-slate-600 hover:bg-slate-50",
                              categoryItem.id === "blank"
                                ? "text-violet-700"
                                : "",
                            ].join(" ")}
                          >
                            <span>{categoryItem.label}</span>
                            {categoryItem.id === "all" ? (
                              <span className="rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-black text-violet-700">
                                {SECTION_LIBRARY.length}
                              </span>
                            ) : null}
                            {categoryItem.id !== "blank" &&
                            categoryItem.id !== "all" ? (
                              <span className="rounded-full bg-slate-200/70 px-1.5 py-0.5 text-[10px] font-black text-slate-500">
                                {
                                  getSectionsByCategory(categoryItem.id)
                                    .length
                                }
                              </span>
                            ) : null}
                          </button>
                        ))}
                      </aside>

                      <div className="min-h-0 flex-1 overflow-y-auto bg-[#f7f8fb] p-5">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <div>
                            <h3 className="text-base font-black text-slate-950">
                              ספריית סקשנים · {activeSectionCategoryLabel}
                            </h3>
                            <p className="mt-1 text-xs font-bold text-slate-400">
                              בחרו עיצוב — התצוגה הקטנה מראה את מבנה הסקשן
                            </p>
                          </div>

                          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-500 shadow-sm">
                            {filteredSections.length} סקשנים
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
                          {filteredSections.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() =>
                                closeAfter(() => {
                                  if (
                                    typeof editor?.addLibrarySection ===
                                    "function"
                                  ) {
                                    editor.addLibrarySection(item.id);
                                    return;
                                  }
                                  editor?.addSection?.(
                                    "after",
                                    undefined,
                                    item.id,
                                  );
                                })
                              }
                              className="group overflow-hidden rounded-[22px] border border-slate-200 bg-white text-right shadow-sm transition duration-200 hover:-translate-y-1 hover:border-violet-300 hover:shadow-[0_20px_45px_rgba(91,33,182,0.12)]"
                            >
                              <div className="relative h-[190px] overflow-hidden border-b border-slate-100 bg-white">
                                <SectionLibraryCardPreview section={item} />
                              </div>

                              <div className="flex items-start justify-between gap-3 p-3.5">
                                <div className="min-w-0">
                                  <h4 className="truncate text-sm font-black text-slate-950">
                                    {item.title}
                                  </h4>
                                  <p className="mt-1 line-clamp-2 text-xs font-bold leading-5 text-slate-400">
                                    {item.description}
                                  </p>
                                </div>

                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700 transition group-hover:bg-violet-600 group-hover:text-white">
                                  <Plus className="h-4 w-4" />
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>

                        {filteredSections.length === 0 ? (
                          <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                            <p className="text-sm font-black text-slate-700">
                              לא נמצאו סקשנים בקטגוריה זו
                            </p>
                            <p className="mt-2 text-xs font-bold text-slate-400">
                              נסו חיפוש אחר או עברו לקטגוריה אחרת
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                {mode === "layers" ? (
                  <Layers3 className="h-5 w-5" />
                ) : (
                  <Code2 className="h-5 w-5" />
                )}
              </span>

              <h2 className="text-base font-black text-slate-950">
                {title}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
              aria-label="סגירה"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          {mode === "layers" ? (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3">
                <span className="text-xs font-black text-slate-500">
                  {layers.length} שכבות
                </span>

                <button
                  type="button"
                  onClick={refreshLayers}
                  className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-black text-slate-600"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  רענון
                </button>
              </div>

              <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
                {layers.map((item) => {
                  const active =
                    item.id === selectedElementId;

                  return (
                    <div
                      key={item.id}
                      className={[
                        "rounded-2xl border p-2",
                        active
                          ? "border-violet-400 bg-violet-50"
                          : "border-slate-200 bg-white",
                      ].join(" ")}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          editor?.selectByElementId?.(
                            item.id,
                          )
                        }
                        className="flex w-full items-center gap-2 rounded-xl p-2 text-right"
                      >
                        <MousePointer2 className="h-4 w-4 shrink-0 text-violet-600" />

                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-black text-slate-900">
                            {item.label ||
                              item.type}
                          </span>

                          <span className="block truncate text-[11px] font-bold text-slate-400">
                            {item.type} · שכבה{" "}
                            {item.zIndex}
                          </span>
                        </span>
                      </button>

                      {active ? (
                        <div className="grid grid-cols-4 gap-1 border-t border-violet-100 pt-2">
                          <button
                            type="button"
                            title="לחזית"
                            onClick={() =>
                              editor?.bringToFront?.(
                                item.id,
                              )
                            }
                            className="flex h-9 items-center justify-center rounded-lg bg-white text-slate-600"
                          >
                            <ArrowUpToLine className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            title="לרקע"
                            onClick={() =>
                              editor?.sendToBack?.(
                                item.id,
                              )
                            }
                            className="flex h-9 items-center justify-center rounded-lg bg-white text-slate-600"
                          >
                            <ArrowDownToLine className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            title={
                              item.hidden
                                ? "הצגה"
                                : "הסתרה"
                            }
                            onClick={() =>
                              editor?.toggleElementHidden?.(
                                item.id,
                              )
                            }
                            className="flex h-9 items-center justify-center rounded-lg bg-white text-slate-600"
                          >
                            {item.hidden ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>

                          <button
                            type="button"
                            title="מחיקה"
                            onClick={() =>
                              editor?.deleteElement?.(
                                item.id,
                              )
                            }
                            className="flex h-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              {selectedLayer ? (
                <div className="shrink-0 border-t border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-500">
                  מסומן: {selectedLayer.label}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setCodeScope("site")}
                  className={[
                    "rounded-xl px-3 py-2.5 text-xs font-black transition",
                    codeScope === "site"
                      ? "bg-white text-violet-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-800",
                  ].join(" ")}
                >
                  כל האתר
                </button>
                <button
                  type="button"
                  onClick={() => setCodeScope("page")}
                  className={[
                    "rounded-xl px-3 py-2.5 text-xs font-black transition",
                    codeScope === "page"
                      ? "bg-white text-violet-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-800",
                  ].join(" ")}
                >
                  עמוד זה בלבד
                </button>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3 text-xs font-bold leading-6 text-slate-600">
                {codeScope === "site"
                  ? "קוד ברמת האתר רץ בכל העמודים — מתאים לפיקסל, Analytics, CSS גלובלי."
                  : "קוד ברמת העמוד רץ רק בעמוד הנוכחי — בנוסף לקוד של כל האתר."}
              </div>

              <label className="flex items-center justify-between rounded-2xl border border-slate-200 p-3">
                <span className="text-sm font-black text-slate-800">
                  הפעלת קוד מותאם
                </span>

                <input
                  type="checkbox"
                  checked={codeDraft.enabled}
                  onChange={(event) =>
                    setCodeDraft((current) => ({
                      ...current,
                      enabled:
                        event.target.checked,
                    }))
                  }
                />
              </label>

              <CodeField
                label="Custom CSS"
                value={codeDraft.css}
                onChange={(css) =>
                  setCodeDraft((current) => ({
                    ...current,
                    css,
                  }))
                }
                placeholder=".my-class { color: red; }"
              />

              <CodeField
                label="Head HTML"
                value={codeDraft.headHtml}
                onChange={(headHtml) =>
                  setCodeDraft((current) => ({
                    ...current,
                    headHtml,
                  }))
                }
                placeholder='<meta name="..." content="..." />'
                rows={5}
              />

              <CodeField
                label="HTML בתחילת ה־Body"
                value={codeDraft.bodyStartHtml}
                onChange={(bodyStartHtml) =>
                  setCodeDraft((current) => ({
                    ...current,
                    bodyStartHtml,
                  }))
                }
                placeholder="<!-- קוד שיופיע לפני האתר -->"
                rows={4}
              />

              <CodeField
                label="HTML בסוף ה־Body"
                value={codeDraft.bodyEndHtml}
                onChange={(bodyEndHtml) =>
                  setCodeDraft((current) => ({
                    ...current,
                    bodyEndHtml,
                  }))
                }
                placeholder="<!-- קוד שיופיע אחרי האתר -->"
                rows={4}
              />

              <CodeField
                label="Custom JavaScript"
                value={codeDraft.javascript}
                onChange={(javascript) =>
                  setCodeDraft((current) => ({
                    ...current,
                    javascript,
                  }))
                }
                placeholder="console.log('Bizuply custom code');"
              />

              <div className="rounded-2xl bg-amber-50 p-3 text-xs font-bold leading-6 text-amber-800">
                CSS מתעדכן מיד בעורך. Head HTML מופיע בעריכה (בלי
                סקריפטים). JavaScript רץ בתצוגה מקדימה ובאתר המפורסם בלבד.
                שמרו גם טיוטה/פרסום כדי שהקוד יישמר בשרת.
              </div>

              <button
                type="button"
                onClick={() => {
                  if (codeScope === "site") {
                    if (
                      typeof editor?.updateSiteCustomCode !==
                      "function"
                    ) {
                      window.alert(
                        "שמירת קוד ברמת האתר לא זמינה. רעננו את הדף ונסו שוב.",
                      );
                      return;
                    }
                    editor.updateSiteCustomCode(codeDraft);
                  } else {
                    if (
                      typeof editor?.updateCustomCode !== "function"
                    ) {
                      window.alert(
                        "שמירת קוד מותאם לא זמינה כרגע. רעננו את הדף ונסו שוב.",
                      );
                      return;
                    }
                    editor.updateCustomCode(codeDraft);
                  }
                  onClose();
                }}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 text-sm font-black text-white"
              >
                <Save className="h-4 w-4" />
                {codeScope === "site"
                  ? "שמירת קוד לכל האתר"
                  : "שמירת קוד לעמוד זה"}
              </button>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
