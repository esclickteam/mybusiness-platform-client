import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpToLine,
  Box,
  Code2,
  Eye,
  EyeOff,
  Grid3X3,
  ImagePlus,
  Layers3,
  LayoutGrid,
  Minus,
  MousePointer2,
  PanelTop,
  Plus,
  RectangleHorizontal,
  RefreshCw,
  Rows3,
  Save,
  Search,
  Sparkles,
  Trash2,
  Type,
  Upload,
  Video,
  X,
} from "lucide-react";

import ProfessionalMediaBrowser from "./library/ProfessionalMediaBrowser";

type PanelMode = "add" | "layers" | "code" | null;
type AddPanelTab = "elements" | "sections" | "media";
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

type SectionPreset = {
  id: string;
  title: string;
  description: string;
  preview:
    | "hero"
    | "text-image"
    | "cards"
    | "cta"
    | "video-text"
    | "blank";
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

const SECTION_PRESETS: SectionPreset[] = [
  {
    id: "hero",
    title: "Hero עסקי",
    description: "כותרת גדולה, טקסט, כפתור ותמונה",
    preview: "hero",
  },
  {
    id: "text-image",
    title: "טקסט ותמונה",
    description: "מבנה דו־טורי נקי להצגת שירות או סיפור",
    preview: "text-image",
  },
  {
    id: "cards",
    title: "שלוש כרטיסיות",
    description: "שירותים, יתרונות או שלבי עבודה",
    preview: "cards",
  },
  {
    id: "cta",
    title: "קריאה לפעולה",
    description: "סקשן מודגש עם כותרת וכפתור",
    preview: "cta",
  },
  {
    id: "video-text",
    title: "וידאו עם כיתוב",
    description: "וידאו רחב עם תוכן מעליו",
    preview: "video-text",
  },
  {
    id: "blank",
    title: "סקשן ריק",
    description: "אזור נקי לבנייה חופשית",
    preview: "blank",
  },
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
        onChange={(event) => onChange(event.target.value)}
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

function SectionPreview({
  kind,
}: {
  kind: SectionPreset["preview"];
}) {
  if (kind === "hero") {
    return (
      <div className="grid h-full grid-cols-[1fr_1.1fr] gap-3 bg-[#f7f5ff] p-4">
        <div className="flex flex-col justify-center gap-2">
          <div className="h-3 w-3/4 rounded-full bg-slate-950" />
          <div className="h-3 w-1/2 rounded-full bg-slate-950" />
          <div className="mt-1 h-2 w-full rounded-full bg-slate-300" />
          <div className="h-2 w-4/5 rounded-full bg-slate-300" />
          <div className="mt-2 h-7 w-20 rounded-full bg-violet-600" />
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-violet-300 via-sky-200 to-emerald-200" />
      </div>
    );
  }

  if (kind === "text-image") {
    return (
      <div className="grid h-full grid-cols-2 gap-3 bg-white p-4">
        <div className="rounded-2xl bg-gradient-to-br from-amber-100 to-orange-300" />
        <div className="flex flex-col justify-center gap-2">
          <div className="h-3 w-2/3 rounded-full bg-slate-950" />
          <div className="h-2 w-full rounded-full bg-slate-300" />
          <div className="h-2 w-5/6 rounded-full bg-slate-300" />
          <div className="h-2 w-3/4 rounded-full bg-slate-300" />
        </div>
      </div>
    );
  }

  if (kind === "cards") {
    return (
      <div className="grid h-full grid-cols-3 gap-2 bg-slate-50 p-4">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
          >
            <div className="h-8 w-8 rounded-xl bg-violet-100" />
            <div className="mt-4 h-2 w-2/3 rounded-full bg-slate-900" />
            <div className="mt-2 h-2 w-full rounded-full bg-slate-200" />
          </div>
        ))}
      </div>
    );
  }

  if (kind === "cta") {
    return (
      <div className="flex h-full items-center justify-between bg-gradient-to-r from-violet-700 to-indigo-600 px-6">
        <div>
          <div className="h-3 w-40 rounded-full bg-white" />
          <div className="mt-3 h-2 w-52 rounded-full bg-white/55" />
        </div>
        <div className="h-9 w-24 rounded-full bg-white" />
      </div>
    );
  }

  if (kind === "video-text") {
    return (
      <div className="relative flex h-full items-end overflow-hidden bg-slate-900 p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-violet-900 to-indigo-700" />
        <div className="relative w-2/3 rounded-2xl bg-black/35 p-3 backdrop-blur">
          <div className="h-3 w-2/3 rounded-full bg-white" />
          <div className="mt-2 h-2 w-full rounded-full bg-white/50" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white p-4">
      <div className="h-full rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50" />
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
}: VisualAddLayersPanelProps) {
  const [layers, setLayers] = useState<LayerItem[]>([]);
  const [addTab, setAddTab] =
    useState<AddPanelTab>("elements");
  const [elementCategory, setElementCategory] =
    useState<ElementCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [mediaQuery, setMediaQuery] = useState("");

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

    const timer = window.setInterval(refreshLayers, 700);

    return () => window.clearInterval(timer);
  }, [mode, editor?.data, editor?.selectedElement?.id]);

  useEffect(() => {
    if (mode !== "code") return;

    setCodeDraft({
      enabled: editor?.customCode?.enabled !== false,
      css: String(editor?.customCode?.css || ""),
      headHtml: String(editor?.customCode?.headHtml || ""),
      bodyStartHtml: String(
        editor?.customCode?.bodyStartHtml || "",
      ),
      bodyEndHtml: String(
        editor?.customCode?.bodyEndHtml || "",
      ),
      javascript: String(
        editor?.customCode?.javascript || "",
      ),
    });
  }, [mode, editor?.customCode]);

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
    void Promise.resolve(action()).finally(() => {
      window.setTimeout(refreshLayers, 50);
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
  }, [elementCategory, elements, searchQuery]);

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
      ? "w-[980px]"
      : "w-[480px]";

  const title =
    mode === "add"
      ? "הוספת אלמנטים"
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
                icon={<Grid3X3 className="h-5 w-5" />}
                label="אלמנטים"
                onClick={() => setAddTab("elements")}
              />

              <NavigationButton
                active={addTab === "sections"}
                icon={<PanelTop className="h-5 w-5" />}
                label="סקשנים"
                onClick={() => setAddTab("sections")}
              />

              <NavigationButton
                active={addTab === "media"}
                icon={<ImagePlus className="h-5 w-5" />}
                label="מדיה"
                onClick={() => setAddTab("media")}
              />
            </div>

            <div className="mt-auto">
              <button
                type="button"
                onClick={() =>
                  closeAfter(() => editor?.addImage?.())
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
                  בחרו אלמנט, סקשן או מדיה והוסיפו לעמוד
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    closeAfter(() => editor?.addImage?.())
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
            ) : (
              <>
                <div className="shrink-0 border-b border-slate-200 bg-white px-6 py-4">
                  <label className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-violet-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-100">
                    <Search className="h-5 w-5 shrink-0 text-slate-400" />

                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(event) =>
                        setSearchQuery(event.target.value)
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
                        (category) => (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() =>
                              setElementCategory(category.id)
                            }
                            className={[
                              "whitespace-nowrap rounded-full px-4 py-2 text-xs font-black transition",
                              elementCategory === category.id
                                ? "bg-slate-950 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                            ].join(" ")}
                          >
                            {category.label}
                          </button>
                        ),
                      )}
                    </div>
                  ) : null}
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto bg-[#f7f8fb] p-6">
                  {addTab === "elements" ? (
                    <>
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-black text-slate-950">
                            אלמנטים
                          </h3>
                          <p className="mt-1 text-xs font-bold text-slate-400">
                            לחיצה מוסיפה את האלמנט לקנבס
                          </p>
                        </div>

                        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-500 shadow-sm">
                          {filteredElements.length} פריטים
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        {filteredElements.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() =>
                              closeAfter(item.action)
                            }
                            className="group overflow-hidden rounded-[22px] border border-slate-200 bg-white text-right shadow-sm transition duration-200 hover:-translate-y-1 hover:border-violet-300 hover:shadow-[0_18px_40px_rgba(91,33,182,0.12)]"
                          >
                            <div className="h-[132px] overflow-hidden border-b border-slate-100 bg-white">
                              <ElementPreview kind={item.preview} />
                            </div>

                            <div className="p-4">
                              <h4 className="text-sm font-black text-slate-950">
                                {item.title}
                              </h4>
                              <p className="mt-1 text-xs font-bold leading-5 text-slate-400">
                                {item.description}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-black text-slate-950">
                            סקשנים מוכנים
                          </h3>
                          <p className="mt-1 text-xs font-bold text-slate-400">
                            מבנים מוכנים שניתן לערוך לאחר ההוספה
                          </p>
                        </div>

                        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-500 shadow-sm">
                          {SECTION_PRESETS.length} סקשנים
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                        {SECTION_PRESETS.filter((item) => {
                          const normalizedSearch = searchQuery
                            .trim()
                            .toLowerCase();

                          return (
                            !normalizedSearch ||
                            `${item.title} ${item.description}`
                              .toLowerCase()
                              .includes(normalizedSearch)
                          );
                        }).map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() =>
                              closeAfter(() =>
                                editor?.addSection?.(
                                  "after",
                                  undefined,
                                  item.id,
                                ),
                              )
                            }
                            className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white text-right shadow-sm transition duration-200 hover:-translate-y-1 hover:border-violet-300 hover:shadow-[0_20px_45px_rgba(91,33,182,0.12)]"
                          >
                            <div className="h-[175px] overflow-hidden border-b border-slate-100">
                              <SectionPreview kind={item.preview} />
                            </div>

                            <div className="flex items-center justify-between gap-3 p-4">
                              <div>
                                <h4 className="text-sm font-black text-slate-950">
                                  {item.title}
                                </h4>
                                <p className="mt-1 text-xs font-bold leading-5 text-slate-400">
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
                    </>
                  )}
                </div>
              </>
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
                            {item.label || item.type}
                          </span>

                          <span className="block truncate text-[11px] font-bold text-slate-400">
                            {item.type} · שכבה {item.zIndex}
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
                              editor?.sendToBack?.(item.id)
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
                      enabled: event.target.checked,
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
                CSS מתעדכן מיד בעורך. JavaScript מופעל
                בתצוגה ובאתר המפורסם, כדי שלא ישבור את
                כלי העריכה.
              </div>

              <button
                type="button"
                onClick={() => {
                  editor?.updateCustomCode?.(codeDraft);
                  onClose();
                }}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 text-sm font-black text-white"
              >
                <Save className="h-4 w-4" />
                שמירת קוד מותאם
              </button>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
