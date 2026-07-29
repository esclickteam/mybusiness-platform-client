import React from "react";
import { useTranslation } from "react-i18next";
import { ImagePlus, MoreHorizontal } from "lucide-react";

export type AdPlacementPreviewProps = {
  adFormat: string;
  pageName: string;
  primaryText: string;
  headline: string;
  description?: string;
  ctaLabel: string;
  imageUrl?: string;
  displayLink?: string;
  link?: string;
  creativeFormat?: "single" | "video" | "carousel";
  carouselImages?: string[];
};

function isStoryFormat(adFormat: string) {
  const value = String(adFormat || "").toUpperCase();
  return (
    value.includes("STORY") ||
    value.includes("REELS") ||
    value === "INSTAGRAM_REELS"
  );
}

function isInstagramFormat(adFormat: string) {
  return String(adFormat || "").toUpperCase().includes("INSTAGRAM");
}

export default function AdPlacementPreview({
  adFormat,
  pageName,
  primaryText,
  headline,
  description,
  ctaLabel,
  imageUrl,
  displayLink,
  link,
  creativeFormat = "single",
  carouselImages = [],
}: AdPlacementPreviewProps) {
  const { t } = useTranslation();
  const story = isStoryFormat(adFormat);
  const instagram = isInstagramFormat(adFormat);
  const pageInitial = (pageName || "P").trim().slice(0, 1).toUpperCase() || "P";
  const domain =
    displayLink ||
    String(link || "")
      .replace(/^https?:\/\//, "")
      .split("/")[0] ||
    "example.com";

  const mediaUrl =
    imageUrl ||
    carouselImages.find(Boolean) ||
    "";

  const sponsored = t("metaCampaigns.preview.sponsored");

  if (story) {
    return (
      <div className="mx-auto w-full max-w-[320px]">
        <div className="relative overflow-hidden rounded-[2rem] border-[6px] border-slate-900 bg-slate-900 shadow-2xl">
          <div className="absolute inset-x-0 top-0 z-20 flex gap-1 px-3 pt-3">
            <div className="h-0.5 flex-1 rounded-full bg-white/90" />
            <div className="h-0.5 flex-1 rounded-full bg-white/35" />
            <div className="h-0.5 flex-1 rounded-full bg-white/35" />
          </div>
          <div className="absolute inset-x-0 top-5 z-20 flex items-center gap-2 px-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-amber-400 text-xs font-black text-white">
              {pageInitial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-black text-white drop-shadow">
                {pageName || "Page"}
              </p>
              <p className="text-[10px] font-semibold text-white/80">{sponsored}</p>
            </div>
            <MoreHorizontal className="h-4 w-4 text-white/80" />
          </div>

          <div className="relative aspect-[9/16] w-full bg-slate-800">
            {mediaUrl ? (
              <img
                src={mediaUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-slate-700 to-slate-900 text-slate-300">
                <ImagePlus className="h-10 w-10 opacity-70" />
                <p className="px-6 text-center text-xs font-semibold">
                  {t("metaCampaigns.preview.mediaPlaceholder")}
                </p>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 pb-5 pt-16">
              <p className="line-clamp-3 text-sm font-semibold text-white drop-shadow">
                {primaryText || t("metaCampaigns.preview.primaryPlaceholder")}
              </p>
              <p className="mt-2 line-clamp-2 text-base font-black text-white">
                {headline || t("metaCampaigns.preview.headlinePlaceholder")}
              </p>
              <button
                type="button"
                className="mt-3 w-full rounded-xl bg-white px-3 py-2.5 text-sm font-black text-slate-900"
              >
                {ctaLabel || "Learn more"}
              </button>
            </div>
          </div>
        </div>
        <p className="mt-3 text-center text-xs font-semibold text-slate-500">
          {instagram
            ? t("metaCampaigns.preview.storyHintIg")
            : t("metaCampaigns.preview.storyHintFb")}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[420px]">
      <div
        className={[
          "overflow-hidden border bg-white shadow-lg",
          instagram ? "rounded-xl border-slate-200" : "rounded-2xl border-slate-200",
        ].join(" ")}
      >
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div
            className={[
              "flex h-10 w-10 items-center justify-center text-sm font-black text-white",
              instagram
                ? "rounded-full bg-gradient-to-br from-fuchsia-500 via-rose-500 to-amber-400"
                : "rounded-full bg-[#1877F2]",
            ].join(" ")}
          >
            {pageInitial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-black text-slate-900">
              {pageName || "Page"}
            </p>
            <p className="text-[11px] font-semibold text-slate-400">{sponsored}</p>
          </div>
          <MoreHorizontal className="h-4 w-4 text-slate-400" />
        </div>

        <div className="px-3 pb-2 text-sm font-semibold leading-relaxed text-slate-800 whitespace-pre-wrap">
          {primaryText || t("metaCampaigns.preview.primaryPlaceholder")}
        </div>

        {creativeFormat === "carousel" && carouselImages.filter(Boolean).length > 1 ? (
          <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto px-2 pb-2">
            {carouselImages.filter(Boolean).map((src, index) => (
              <img
                key={`${src}-${index}`}
                src={src}
                alt=""
                className="h-52 w-[85%] shrink-0 snap-center rounded-lg object-cover"
              />
            ))}
          </div>
        ) : mediaUrl ? (
          <img
            src={mediaUrl}
            alt=""
            className="max-h-[360px] w-full object-cover"
          />
        ) : (
          <div className="flex h-56 flex-col items-center justify-center gap-2 bg-slate-100 text-slate-400">
            <ImagePlus className="h-10 w-10" />
            <p className="text-xs font-semibold">
              {t("metaCampaigns.preview.mediaPlaceholder")}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-3 py-3">
          <div className="min-w-0">
            <p className="truncate text-[11px] font-bold uppercase tracking-wide text-slate-400">
              {domain}
            </p>
            <p className="truncate text-sm font-black text-slate-900">
              {headline || t("metaCampaigns.preview.headlinePlaceholder")}
            </p>
            {description ? (
              <p className="truncate text-xs font-semibold text-slate-500">
                {description}
              </p>
            ) : null}
          </div>
          <span className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-black text-slate-800">
            {ctaLabel || "Learn more"}
          </span>
        </div>
      </div>
    </div>
  );
}
