import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LayoutTemplate } from "lucide-react";

import {
  getTemplateFullPageScreenshotUrl,
  hasTemplateFullPageScreenshot,
} from "../../utils/templateScreenshot";
import { getTextDirection, isHebrewLanguage } from "../../i18n/localeUtils";

type TemplateCardPreviewProps = {
  templateKey: string;
  title?: string;
  /**
   * Full-page template screenshot URL only.
   * Must NOT be a hero/cover/featured image.
   */
  fullPageScreenshot?: string;
  /** First-viewport cards may eager-load; others stay lazy. */
  eager?: boolean;
};

const DESIGN_WIDTH = 1440;
const DESIGN_HEIGHT = 1920;

function resolveScreenshotSrc(
  templateKey: string,
  fullPageScreenshot?: string,
) {
  const explicit = String(fullPageScreenshot || "").trim();
  if (explicit) return explicit;
  return getTemplateFullPageScreenshotUrl(templateKey);
}

export function canRenderTemplatePreview(
  templateKey?: string | null,
) {
  return hasTemplateFullPageScreenshot(templateKey);
}

function PreviewPlaceholder({ title }: { title?: string }) {
  const { t } = useTranslation();
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#eef1f4] p-4">
      <LayoutTemplate className="h-10 w-10 text-[#9ca3af]" aria-hidden />
      <span className="max-w-[85%] truncate text-center text-xs font-bold text-[#6b7280]">
        {title || t("leftover.templatePreview.comingSoon", "Template photo coming soon")}
      </span>
    </div>
  );
}

function ScreenshotThumb({
  src,
  title,
  templateKey,
  eager,
  onError,
}: {
  src: string;
  title?: string;
  templateKey: string;
  eager: boolean;
  onError: () => void;
}) {
  const { t } = useTranslation();
  return (
    <img
      src={src}
      alt={title || templateKey || t("leftover.templatePreview.fullShot", "Full template screenshot")}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      onError={onError}
      className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top"
    />
  );
}

/**
 * Gallery card: Hebrew keeps the matching screenshot.
 * Other dashboard languages mount a localized live embed when the card is near
 * the viewport so the thumbnail language matches the gallery chrome.
 */
export default function TemplateCardPreview({
  templateKey,
  title,
  fullPageScreenshot,
  eager = false,
}: TemplateCardPreviewProps) {
  const { t, i18n } = useTranslation();
  const src = resolveScreenshotSrc(templateKey, fullPageScreenshot);
  const [failed, setFailed] = useState(false);
  const [inView, setInView] = useState(eager);
  const [liveReady, setLiveReady] = useState(false);
  const [frameWidth, setFrameWidth] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const previewLabel = title || templateKey || t("leftover.templatePreview.preview", "Preview");
  const useLive = Boolean(templateKey) && !isHebrewLanguage(i18n.language);
  const scale = frameWidth > 0 ? frameWidth / DESIGN_WIDTH : 0.2;

  useEffect(() => {
    setLiveReady(false);
  }, [i18n.language, templateKey]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const update = () => {
      const width = el.getBoundingClientRect().width;
      if (width) setFrameWidth(width);
    };
    update();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!useLive || inView) return;
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
        }
      },
      { rootMargin: "240px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, useLive]);

  if ((!src || failed) && !useLive) {
    return (
      <div
        className="relative h-full w-full overflow-hidden bg-[#eef1f4]"
        aria-label={previewLabel}
      >
        <PreviewPlaceholder title={title} />
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className="relative h-full w-full overflow-hidden bg-[#eef1f4]"
      aria-label={previewLabel}
      dir={getTextDirection(i18n.language)}
    >
      {src && !failed && !liveReady ? (
        <ScreenshotThumb
          src={src}
          title={title}
          templateKey={templateKey}
          eager={eager}
          onError={() => setFailed(true)}
        />
      ) : !liveReady ? (
        <PreviewPlaceholder title={title} />
      ) : null}
      {useLive && inView ? (
        <iframe
          title={previewLabel}
          src={`/embed/template/${encodeURIComponent(templateKey)}?mode=preview&lang=${encodeURIComponent(i18n.language)}`}
          className="pointer-events-none absolute left-0 top-0 border-0 bg-white"
          style={{
            width: DESIGN_WIDTH,
            height: DESIGN_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
          loading={eager ? "eager" : "lazy"}
          tabIndex={-1}
          aria-hidden
          onLoad={() => setLiveReady(true)}
        />
      ) : null}
    </div>
  );
}
