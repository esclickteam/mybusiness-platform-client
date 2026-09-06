import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../../../../i18n/localeUtils";
import {
  Check,
  Crop,
  Image as ImageIcon,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Upload,
  Wand2,
  X,
} from "lucide-react";

import { MEDIA_LIBRARY } from "../library/mediaLibrary";
import ProfessionalMediaBrowser from "../library/ProfessionalMediaBrowser";
import type { PexelsMediaItem } from "../library/pexelsMediaService";
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
  { key: "brightness", label: "Brightness", min: 0, max: 200 },
  { key: "contrast", label: "Contrast", min: 0, max: 200 },
  { key: "saturation", label: "Saturation", min: 0, max: 200 },
  { key: "exposure", label: "Exposure", min: 0, max: 200 },
  { key: "sharpness", label: "Sharpness", min: 0, max: 100 },
  { key: "vignette", label: "Vignette", min: 0, max: 100 },
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
  fallbackLabel: string,
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
        label: label || fallbackLabel,
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
  elementLabel,
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
  const { t, i18n } = useTranslation();
  const pageDir = getTextDirection(i18n.language);
  const resolvedLabel = elementLabel || t("studio.mediaModal.media");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [changeTab, setChangeTab] = useState<ChangeTab>("pexels");
  const [searchQuery, setSearchQuery] = useState("");
  const [pexelsQuery, setPexelsQuery] = useState("");
  const [selectedSrc, setSelectedSrc] = useState("");
  const [selectedMediaType, setSelectedMediaType] = useState<"image" | "video">(
    mediaType === "video" ? "video" : "image",
  );
  const [urlValue, setUrlValue] = useState("");
  const [altValue, setAltValue] = useState("");
  const [editValues, setEditValues] =
    useState<VisualMediaEditValues>(DEFAULT_EDIT_VALUES);

  const siteMedia = useMemo(
    () => collectSiteMedia(editorData, t("studio.mediaModal.siteFile")),
    [editorData, t],
  );

  const previewSrc = selectedSrc || currentSrc;
  const isVideo = selectedMediaType === "video";

  const applySelectedMedia = (
    src: string,
    alt: string,
    nextMediaType: "image" | "video" = "image",
  ) => {
    setSelectedSrc(src);
    setSelectedMediaType(nextMediaType);
    setAltValue(alt);
  };

  const detectMediaType = (src: string, explicit?: string) => {
    const cleanType = String(explicit || "").trim().toLowerCase();
    if (cleanType === "video") return "video" as const;
    if (cleanType === "image") return "image" as const;

    const lower = String(src || "").toLowerCase();
    if (
      lower.includes("/video/upload/") ||
      /\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i.test(lower)
    ) {
      return "video" as const;
    }

    return "image" as const;
  };

  useEffect(() => {
    if (!open) return;

    setSelectedSrc(currentSrc);
    setSelectedMediaType(mediaType === "video" ? "video" : "image");
    setUrlValue(currentSrc);
    setAltValue(currentAlt);
    setEditValues(DEFAULT_EDIT_VALUES);
    setChangeTab("pexels");
  }, [open, currentSrc, currentAlt, siteMedia.length]);

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
      alt: altValue || resolvedLabel,
      mediaType: selectedMediaType,
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
    { id: "pexels", label: t("studio.mediaModal.pexels") },
    { id: "site", label: t("studio.mediaModal.siteFiles") },
    { id: "library", label: t("studio.mediaModal.library") },
    { id: "upload", label: t("studio.mediaModal.upload") },
    { id: "url", label: t("studio.mediaModal.url") },
  ];

  const handlePexelsSelect = (item: PexelsMediaItem) => {
    applySelectedMedia(
      item.src,
      item.alt || item.title || resolvedLabel,
      item.mediaType === "video" ? "video" : "image",
    );
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[2147483600] flex items-center justify-center border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800/55 p-4 backdrop-blur-sm"
      dir={pageDir}
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
              aria-label={t("studio.mediaModal.close")}
            >
              <X className="h-4 w-4" />
            </button>

            <div>
              <h2 className="text-lg font-black text-slate-900">
                {mode === "change"
                  ? t("studio.mediaModal.chooseMedia")
                  : t("studio.mediaModal.imageStudio")}
              </h2>
              <p className="text-sm font-semibold text-slate-500">
                {resolvedLabel}
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
              {t("studio.mediaModal.change")}
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
              {t("studio.mediaModal.edit")}
            </button>
          </div>
        </header>

        {mode === "change" ? (
          <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_280px]">
            <aside className="border-b border-slate-200 bg-slate-50/70 p-4 lg:border-b-0 lg:border-l">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 px-4 py-3 text-sm font-black text-black transition hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100"
              >
                <Upload className="h-4 w-4" />
                {t("studio.mediaModal.uploadMedia")}
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
              {changeTab === "pexels" ? (
                <ProfessionalMediaBrowser
                  query={pexelsQuery}
                  onQueryChange={setPexelsQuery}
                  mode="select"
                  selectedId={selectedSrc}
                  onSelect={handlePexelsSelect}
                  showUploadButton
                  onUpload={() => fileInputRef.current?.click()}
                />
              ) : (
                <>
              <div className="border-b border-slate-200 p-4">
                <div className="relative">
                  <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={t("studio.mediaModal.searchLibrary")}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white pr-11 pl-4 text-sm font-bold text-slate-800 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                  />
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                {changeTab === "upload" ? (
                  <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-slate-200 bg-slate-50 px-6 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-100 text-violet-700">
                      <Upload className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900">
                      {t("studio.mediaModal.uploadFile")}
                    </h3>
                    <p className="mt-2 max-w-md text-sm font-semibold leading-7 text-slate-500">
                      {t("studio.mediaModal.uploadHint")}
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-6 rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 transition hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100"
                    >
                      {t("studio.mediaModal.chooseFile")}
                    </button>
                  </div>
                ) : null}

                {changeTab === "url" ? (
                  <div className="mx-auto flex max-w-xl flex-col gap-4">
                    <label className="text-sm font-black text-slate-700">
                      {t("studio.mediaModal.urlLabel")}
                    </label>
                    <input
                      value={urlValue}
                      onChange={(event) => {
                        setUrlValue(event.target.value);
                        applySelectedMedia(
                          event.target.value,
                          altValue,
                          detectMediaType(event.target.value),
                        );
                      }}
                      dir="ltr"
                      placeholder="https://..."
                      className="h-12 rounded-2xl border border-slate-200 px-4 text-left text-sm font-bold text-slate-800 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                    />
                    <label className="text-sm font-black text-slate-700">
                      {t("studio.mediaModal.alt")}
                    </label>
                    <input
                      value={altValue}
                      onChange={(event) => setAltValue(event.target.value)}
                      placeholder={t("studio.mediaModal.altPh")}
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
                          applySelectedMedia(
                            item.src,
                            item.alt || altValue,
                            detectMediaType(item.src),
                          );
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
                        {t("studio.mediaModal.noSiteFiles")}
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
                          applySelectedMedia(
                            item.src,
                            item.alt || item.title,
                            detectMediaType(item.src, item.mediaType),
                          );
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
              </div>
                </>
              )}
            </section>

            <aside className="flex min-h-0 flex-col border-t border-slate-200 bg-slate-50/60 p-4 lg:border-t-0 lg:border-r">
              <div className="mb-4 text-sm font-black text-slate-700">
                {t("studio.mediaModal.preview")}
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
                        alt={altValue || resolvedLabel}
                        className="h-full w-full object-cover"
                      />
                    )
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm font-bold text-slate-400">
                      {t("studio.mediaModal.noPreview")}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 text-xs font-semibold leading-6 text-slate-500">
                {t("studio.mediaModal.idLabel")}<span dir="ltr">{elementId}</span>
              </div>

              <button
                type="button"
                disabled={!previewSrc || isUploading}
                onClick={handleApply}
                className="mt-auto rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 px-5 py-3 text-sm font-black text-black transition hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUploading ? t("studio.mediaModal.uploading") : t("studio.mediaModal.chooseMedia")}
              </button>
            </aside>
          </div>
        ) : (
          <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="border-b border-slate-200 bg-slate-50/70 p-4 lg:border-b-0 lg:border-l">
              <div className="space-y-1">
                {[
                  { icon: <Crop className="h-4 w-4" />, label: t("studio.mediaModal.crop"), id: "crop" },
                  { icon: <SlidersHorizontal className="h-4 w-4" />, label: t("studio.mediaModal.adjust"), id: "adjust" },
                  { icon: <Wand2 className="h-4 w-4" />, label: t("studio.mediaModal.filters"), id: "filters" },
                  { icon: <Sparkles className="h-4 w-4" />, label: t("studio.mediaModal.autoEnhance"), id: "auto" },
                ].map((tool) => (
                  <div
                    key={tool.id}
                    className={[
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black",
                      tool.id === "adjust"
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
                  {t("studio.mediaModal.imageAdjust")}
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
                    {t("studio.mediaModal.reset")}
                  </button>
                </div>
              </div>

              <div className="grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px]">
                <div className="flex items-center justify-center bg-slate-100 p-6">
                  {previewSrc ? (
                    <img
                      src={previewSrc}
                      alt={altValue || resolvedLabel}
                      className="max-h-[58vh] max-w-full rounded-[24px] object-contain shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
                      style={{ filter: buildMediaEditFilter(editValues) }}
                    />
                  ) : (
                    <div className="text-sm font-bold text-slate-500">
                      {t("studio.mediaModal.noImage")}
                    </div>
                  )}
                </div>

                <div className="overflow-y-auto border-t border-slate-200 p-5 xl:border-t-0 xl:border-r">
                  <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <span className="text-sm font-black text-slate-700">
                      {t("studio.mediaModal.autoEnhance")}
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
                      {t("studio.mediaModal.enable")}
                    </button>
                  </div>

                  <div className="space-y-5">
                    {EDIT_TOOLS.map((tool) => (
                      <label
                        key={tool.key}
                        className="block rounded-2xl border border-slate-200 bg-white px-4 py-3"
                      >
                        <div className="mb-2 flex items-center justify-between text-sm font-black text-slate-700">
                          <span>{t(`studio.mediaModal.${tool.key}`, tool.label)}</span>
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
              ? t("studio.mediaModal.pickHint")
              : t("studio.mediaModal.saveHint")}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              {t("studio.mediaModal.cancel")}
            </button>

            {mode === "edit" ? (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 px-5 py-3 text-sm font-black text-black transition hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100"
              >
                <Check className="h-4 w-4" />
                {t("studio.mediaModal.save")}
              </button>
            ) : (
              <button
                type="button"
                disabled={!previewSrc || isUploading}
                onClick={handleApply}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 px-5 py-3 text-sm font-black text-black transition hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ImageIcon className="h-4 w-4" />
                {isUploading ? t("studio.mediaModal.uploading") : t("studio.mediaModal.chooseMedia")}
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
