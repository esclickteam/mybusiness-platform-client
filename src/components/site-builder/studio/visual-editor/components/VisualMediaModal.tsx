import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Check,
  Crop,
  Image as ImageIcon,
  Loader2,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Upload,
  Wand2,
  X,
} from "lucide-react";

import { MEDIA_LIBRARY } from "../library/mediaLibrary";
import {
  PEXELS_MEDIA_CATEGORIES,
  searchPexelsMedia,
  type PexelsCategory,
  type PexelsMediaItem,
} from "../library/pexelsMediaService";
import { readVisualContent } from "../utils/visualData";
import {
  buildMediaEditFilter,
  type VisualMediaEditValues,
} from "../utils/visualMediaUtils";

export type VisualMediaModalMode = "change" | "edit";

export type { VisualMediaEditValues };

export type VisualMediaModalApplyPayload = {
  src: string;
  alt?: string;
  mediaType?: "image" | "video" | string;
  width?: number;
  height?: number;
};

type VisualMediaModalProps = {
  open: boolean;
  mode: VisualMediaModalMode;
  elementId: string;
  elementLabel?: string;
  currentSrc?: string;
  currentAlt?: string;
  mediaType?: "image" | "video" | string;
  editorData?: Record<string, any>;
  isUploading?: boolean;
  onClose: () => void;
  onModeChange?: (mode: VisualMediaModalMode) => void;
  onApplyMedia: (payload: VisualMediaModalApplyPayload) => void;
  onUploadFile: (file: File) => void | Promise<void>;
  onApplyEdit?: (values: VisualMediaEditValues) => void;
  onResetEdit?: () => void;
};

type ChangeTab = "site" | "library" | "pexels" | "upload" | "url";

const DEFAULT_EDIT_VALUES: VisualMediaEditValues = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  exposure: 100,
  sharpness: 0,
  vignette: 0,
};

const EDIT_TOOLS: Array<{
  key: keyof VisualMediaEditValues;
  label: string;
  min: number;
  max: number;
}> = [
  { key: "brightness", label: "בהירות", min: 0, max: 200 },
  { key: "contrast", label: "ניגודיות", min: 0, max: 200 },
  { key: "saturation", label: "רוויה", min: 0, max: 200 },
  { key: "exposure", label: "חשיפה", min: 0, max: 200 },
  { key: "sharpness", label: "חדות", min: 0, max: 100 },
  { key: "vignette", label: "וינייט", min: 0, max: 100 },
];

function isMediaUrl(value: string) {
  const clean = String(value || "").trim();

  if (!/^https?:\/\//i.test(clean)) return false;

  return (
    /\.(avif|gif|jpe?g|png|svg|webp|bmp|mp4|webm|mov)(\?|$)/i.test(clean) ||
    /images\.unsplash\.com|res\.cloudinary\.com|images\.pexels\.com/i.test(
      clean,
    )
  );
}

function collectSiteMedia(
  data: Record<string, any> | undefined,
): Array<{ id: string; src: string; alt: string; label: string }> {
  const seen = new Map<
    string,
    { id: string; src: string; alt: string; label: string }
  >();

  const add = (src: string, alt = "", label = "") => {
    const clean = String(src || "").trim();

    if (!clean || clean.startsWith("blob:") || !isMediaUrl(clean)) return;

    if (!seen.has(clean)) {
      seen.set(clean, {
        id: clean,
        src: clean,
        alt,
        label: label || "קובץ מהאתר",
      });
    }
  };

  const content = readVisualContent(data || {});

  Object.entries(content).forEach(([id, item]) => {
    const record = item as Record<string, any>;
    const src = String(
      record?.src || record?.url || record?.secureUrl || "",
    ).trim();

    add(src, String(record?.alt || ""), id);
  });

  const scan = (value: unknown, path = "") => {
    if (typeof value === "string") {
      add(value, "", path);
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((entry, index) => scan(entry, `${path}.${index}`));
      return;
    }

    if (!value || typeof value !== "object") return;

    Object.entries(value as Record<string, unknown>).forEach(([key, entry]) => {
      if (key.startsWith("__")) return;
      scan(entry, path ? `${path}.${key}` : key);
    });
  };

  scan(data || {});

  return Array.from(seen.values());
}

export default function VisualMediaModal({
  open,
  mode,
  elementId,
  elementLabel = "מדיה",
  currentSrc = "",
  currentAlt = "",
  mediaType = "image",
  editorData,
  isUploading = false,
  onClose,
  onModeChange,
  onApplyMedia,
  onUploadFile,
  onApplyEdit,
  onResetEdit,
}: VisualMediaModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [changeTab, setChangeTab] = useState<ChangeTab>("site");
  const [searchQuery, setSearchQuery] = useState("");
  const [pexelsCategory, setPexelsCategory] =
    useState<PexelsCategory>("business");
  const [pexelsItems, setPexelsItems] = useState<PexelsMediaItem[]>([]);
  const [pexelsLoading, setPexelsLoading] = useState(false);
  const [pexelsError, setPexelsError] = useState("");
  const [selectedSrc, setSelectedSrc] = useState("");
  const [urlValue, setUrlValue] = useState("");
  const [altValue, setAltValue] = useState("");
  const [editValues, setEditValues] =
    useState<VisualMediaEditValues>(DEFAULT_EDIT_VALUES);

  const siteMedia = useMemo(
    () => collectSiteMedia(editorData),
    [editorData],
  );

  const previewSrc = selectedSrc || currentSrc;
  const isVideo = mediaType === "video";

  useEffect(() => {
    if (!open) return;

    setSelectedSrc(currentSrc);
    setUrlValue(currentSrc);
    setAltValue(currentAlt);
    setEditValues(DEFAULT_EDIT_VALUES);
    setChangeTab(siteMedia.length ? "site" : "library");
  }, [open, currentSrc, currentAlt, siteMedia.length]);

  useEffect(() => {
    if (!open || mode !== "change" || changeTab !== "pexels") return;

    const controller = new AbortController();
    const categoryDefinition =
      PEXELS_MEDIA_CATEGORIES.find((item) => item.id === pexelsCategory) ||
      PEXELS_MEDIA_CATEGORIES[0];

    const timer = window.setTimeout(async () => {
      setPexelsLoading(true);
      setPexelsError("");

      try {
        const result = await searchPexelsMedia({
          query:
            String(searchQuery || "").trim() || categoryDefinition.query,
          type: "photos",
          page: 1,
          pageSize: 24,
          category: pexelsCategory,
          signal: controller.signal,
        });

        setPexelsItems(result.items);
      } catch (error) {
        if (!controller.signal.aborted) {
          setPexelsError(
            error instanceof Error
              ? error.message
              : "לא ניתן לטעון תמונות מ־Pexels",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setPexelsLoading(false);
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [open, mode, changeTab, pexelsCategory, searchQuery]);

  useEffect(() => {
    if (!open || mode !== "edit" || !onApplyEdit) return;

    onApplyEdit(editValues);
  }, [editValues, mode, onApplyEdit, open]);

  if (!open || typeof document === "undefined") return null;

  const handleApply = () => {
    const src = String(
      changeTab === "url" ? urlValue : selectedSrc || currentSrc,
    ).trim();

    if (!src) return;

    onApplyMedia({
      src,
      alt: altValue || elementLabel,
      mediaType,
    });
    onClose();
  };

  const filteredLibrary = MEDIA_LIBRARY.filter((item) => {
    const query = String(searchQuery || "").trim().toLowerCase();

    if (!query) return true;

    return [item.title, item.description, ...(item.keywords || [])]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  const filteredSiteMedia = siteMedia.filter((item) => {
    const query = String(searchQuery || "").trim().toLowerCase();

    if (!query) return true;

    return [item.label, item.alt, item.src].join(" ").toLowerCase().includes(query);
  });

  const changeTabs: Array<{ id: ChangeTab; label: string }> = [
    { id: "site", label: "קבצי האתר" },
    { id: "library", label: "ספרייה" },
    { id: "pexels", label: "תמונות מקצועיות" },
    { id: "upload", label: "העלאה" },
    { id: "url", label: "כתובת" },
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-[2147483600] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
      dir="rtl"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-[1180px] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_120px_rgba(15,23,42,0.28)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
              aria-label="סגירה"
            >
              <X className="h-4 w-4" />
            </button>

            <div>
              <h2 className="text-lg font-black text-slate-900">
                {mode === "change" ? "בחירת מדיה" : "סטודיו תמונה"}
              </h2>
              <p className="text-sm font-semibold text-slate-500">
                {elementLabel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => onModeChange?.("change")}
              className={[
                "rounded-xl px-4 py-2 text-sm font-black transition",
                mode === "change"
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-800",
              ].join(" ")}
            >
              שינוי
            </button>
            <button
              type="button"
              disabled={isVideo}
              onClick={() => onModeChange?.("edit")}
              className={[
                "rounded-xl px-4 py-2 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-40",
                mode === "edit"
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-800",
              ].join(" ")}
            >
              עריכה
            </button>
          </div>
        </header>

        {mode === "change" ? (
          <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_280px]">
            <aside className="border-b border-slate-200 bg-slate-50/70 p-4 lg:border-b-0 lg:border-l">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 py-3 text-sm font-black text-white transition hover:bg-violet-700"
              >
                <Upload className="h-4 w-4" />
                העלאת מדיה
              </button>

              <nav className="space-y-1">
                {changeTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setChangeTab(tab.id)}
                    className={[
                      "flex w-full items-center rounded-2xl px-4 py-3 text-right text-sm font-black transition",
                      changeTab === tab.id
                        ? "bg-white text-violet-700 shadow-sm"
                        : "text-slate-600 hover:bg-white/70",
                    ].join(" ")}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </aside>

            <section className="flex min-h-0 flex-col">
              <div className="border-b border-slate-200 p-4">
                <div className="relative">
                  <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="חיפוש תמונות מקצועיות..."
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white pr-11 pl-4 text-sm font-bold text-slate-800 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                  />
                </div>

                {changeTab === "pexels" ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {PEXELS_MEDIA_CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setPexelsCategory(category.id)}
                        className={[
                          "rounded-full px-3 py-1.5 text-xs font-black transition",
                          pexelsCategory === category.id
                            ? "bg-violet-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                        ].join(" ")}
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                {changeTab === "upload" ? (
                  <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-slate-200 bg-slate-50 px-6 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-100 text-violet-700">
                      <Upload className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900">
                      העלאת תמונה או סרטון
                    </h3>
                    <p className="mt-2 max-w-md text-sm font-semibold leading-7 text-slate-500">
                      בחרו קובץ מהמחשב. הקובץ יוצג מיד באתר ויועלה לענן
                      ברקע.
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-6 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-black text-white transition hover:bg-violet-700"
                    >
                      בחירת קובץ
                    </button>
                  </div>
                ) : null}

                {changeTab === "url" ? (
                  <div className="mx-auto flex max-w-xl flex-col gap-4">
                    <label className="text-sm font-black text-slate-700">
                      כתובת תמונה או סרטון
                    </label>
                    <input
                      value={urlValue}
                      onChange={(event) => {
                        setUrlValue(event.target.value);
                        setSelectedSrc(event.target.value);
                      }}
                      dir="ltr"
                      placeholder="https://..."
                      className="h-12 rounded-2xl border border-slate-200 px-4 text-left text-sm font-bold text-slate-800 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                    />
                    <label className="text-sm font-black text-slate-700">
                      טקסט חלופי (Alt)
                    </label>
                    <input
                      value={altValue}
                      onChange={(event) => setAltValue(event.target.value)}
                      placeholder="תיאור קצר של התמונה"
                      className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                    />
                  </div>
                ) : null}

                {changeTab === "site" ? (
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                    {filteredSiteMedia.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSelectedSrc(item.src);
                          setAltValue(item.alt || altValue);
                        }}
                        className={[
                          "group overflow-hidden rounded-[20px] border bg-white text-right shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                          selectedSrc === item.src
                            ? "border-violet-500 ring-4 ring-violet-100"
                            : "border-slate-200",
                        ].join(" ")}
                      >
                        <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                          <img
                            src={item.src}
                            alt={item.alt || item.label}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="px-3 py-2">
                          <div className="truncate text-xs font-black text-slate-800">
                            {item.label}
                          </div>
                        </div>
                      </button>
                    ))}
                    {!filteredSiteMedia.length ? (
                      <div className="col-span-full rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center text-sm font-bold text-slate-500">
                        עדיין אין קבצים באתר. העלו תמונה או בחרו מהספרייה.
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {changeTab === "library" ? (
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                    {filteredLibrary.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSelectedSrc(item.src);
                          setAltValue(item.alt || item.title);
                        }}
                        className={[
                          "group overflow-hidden rounded-[20px] border bg-white text-right shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                          selectedSrc === item.src
                            ? "border-violet-500 ring-4 ring-violet-100"
                            : "border-slate-200",
                        ].join(" ")}
                      >
                        <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                          <img
                            src={item.thumbnail || item.src}
                            alt={item.alt || item.title}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="px-3 py-2">
                          <div className="truncate text-xs font-black text-slate-800">
                            {item.title}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : null}

                {changeTab === "pexels" ? (
                  <>
                    {pexelsLoading ? (
                      <div className="flex min-h-[240px] items-center justify-center text-sm font-bold text-slate-500">
                        <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                        טוען תמונות...
                      </div>
                    ) : null}

                    {pexelsError ? (
                      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
                        {pexelsError}
                      </div>
                    ) : null}

                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                      {pexelsItems.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setSelectedSrc(item.src);
                            setAltValue(item.alt || item.title);
                          }}
                          className={[
                            "group overflow-hidden rounded-[20px] border bg-white text-right shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                            selectedSrc === item.src
                              ? "border-violet-500 ring-4 ring-violet-100"
                              : "border-slate-200",
                          ].join(" ")}
                        >
                          <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                            <img
                              src={item.thumbnail || item.src}
                              alt={item.alt || item.title}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                          </div>
                          <div className="px-3 py-2">
                            <div className="truncate text-xs font-black text-slate-800">
                              {item.title}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            </section>

            <aside className="flex min-h-0 flex-col border-t border-slate-200 bg-slate-50/60 p-4 lg:border-t-0 lg:border-r">
              <div className="mb-4 text-sm font-black text-slate-700">
                תצוגה מקדימה
              </div>

              <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                  {previewSrc ? (
                    isVideo ? (
                      <video
                        src={previewSrc}
                        className="h-full w-full object-cover"
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={previewSrc}
                        alt={altValue || elementLabel}
                        className="h-full w-full object-cover"
                      />
                    )
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm font-bold text-slate-400">
                      אין תצוגה מקדימה
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 text-xs font-semibold leading-6 text-slate-500">
                מזהה: <span dir="ltr">{elementId}</span>
              </div>

              <button
                type="button"
                disabled={!previewSrc || isUploading}
                onClick={handleApply}
                className="mt-auto rounded-2xl bg-violet-600 px-5 py-3 text-sm font-black text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUploading ? "מעלה..." : "בחירת מדיה"}
              </button>
            </aside>
          </div>
        ) : (
          <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="border-b border-slate-200 bg-slate-50/70 p-4 lg:border-b-0 lg:border-l">
              <div className="space-y-1">
                {[
                  { icon: <Crop className="h-4 w-4" />, label: "חיתוך והרחבה" },
                  { icon: <SlidersHorizontal className="h-4 w-4" />, label: "התאמה" },
                  { icon: <Wand2 className="h-4 w-4" />, label: "פילטרים" },
                  { icon: <Sparkles className="h-4 w-4" />, label: "שיפור אוטומטי" },
                ].map((tool) => (
                  <div
                    key={tool.label}
                    className={[
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black",
                      tool.label === "התאמה"
                        ? "bg-white text-violet-700 shadow-sm"
                        : "text-slate-500",
                    ].join(" ")}
                  >
                    {tool.icon}
                    {tool.label}
                  </div>
                ))}
              </div>
            </aside>

            <section className="flex min-h-0 flex-col">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
                <div className="text-sm font-black text-slate-700">
                  התאמת תמונה
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditValues(DEFAULT_EDIT_VALUES);
                      onResetEdit?.();
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 transition hover:bg-slate-50"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    איפוס
                  </button>
                </div>
              </div>

              <div className="grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px]">
                <div className="flex items-center justify-center bg-slate-100 p-6">
                  {previewSrc ? (
                    <img
                      src={previewSrc}
                      alt={altValue || elementLabel}
                      className="max-h-[58vh] max-w-full rounded-[24px] object-contain shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
                      style={{ filter: buildMediaEditFilter(editValues) }}
                    />
                  ) : (
                    <div className="text-sm font-bold text-slate-500">
                      אין תמונה לעריכה
                    </div>
                  )}
                </div>

                <div className="overflow-y-auto border-t border-slate-200 p-5 xl:border-t-0 xl:border-r">
                  <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <span className="text-sm font-black text-slate-700">
                      שיפור אוטומטי
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setEditValues({
                          brightness: 108,
                          contrast: 112,
                          saturation: 108,
                          exposure: 104,
                          sharpness: 18,
                          vignette: 8,
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-violet-50 px-3 py-1.5 text-xs font-black text-violet-700"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      הפעלה
                    </button>
                  </div>

                  <div className="space-y-5">
                    {EDIT_TOOLS.map((tool) => (
                      <label
                        key={tool.key}
                        className="block rounded-2xl border border-slate-200 bg-white px-4 py-3"
                      >
                        <div className="mb-2 flex items-center justify-between text-sm font-black text-slate-700">
                          <span>{tool.label}</span>
                          <span>{editValues[tool.key]}</span>
                        </div>
                        <input
                          type="range"
                          min={tool.min}
                          max={tool.max}
                          value={editValues[tool.key]}
                          onChange={(event) =>
                            setEditValues((current) => ({
                              ...current,
                              [tool.key]: Number(event.target.value),
                            }))
                          }
                          className="w-full accent-violet-600"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        <footer className="flex shrink-0 items-center justify-between border-t border-slate-200 px-5 py-4">
          <div className="text-xs font-semibold text-slate-500">
            {mode === "change"
              ? "בחרו מדיה מהספרייה, מהאתר או העלו קובץ חדש"
              : "השינויים נשמרים על התמונה הנבחרת"}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              ביטול
            </button>

            {mode === "edit" ? (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-black text-white transition hover:bg-violet-700"
              >
                <Check className="h-4 w-4" />
                שמירה
              </button>
            ) : (
              <button
                type="button"
                disabled={!previewSrc || isUploading}
                onClick={handleApply}
                className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-black text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ImageIcon className="h-4 w-4" />
                {isUploading ? "מעלה..." : "בחירת מדיה"}
              </button>
            )}
          </div>
        </footer>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";

            if (!file) return;

            void onUploadFile(file);
            onClose();
          }}
        />
      </div>
    </div>,
    document.body,
  );
}
