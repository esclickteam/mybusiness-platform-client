import React, { useEffect, useRef, useState } from "react";

import { hasStudioTemplateRenderer } from "../site-builder/studio/data/templates/templateRendererRegistry";
import { getTemplateCoverUrl } from "../../utils/templateCover";
import IframeCardPreview from "./IframeCardPreview";

type TemplateCardPreviewProps = {
  templateKey: string;
  title?: string;
  /** Prefer passing the gallery image so the card paints immediately */
  posterUrl?: string;
  /** First row of cards can load the image eagerly */
  eager?: boolean;
};

function normalizeKey(value: string | null | undefined) {
  return String(value || "").trim().toLowerCase();
}

export function canRenderTemplatePreview(
  templateKey: string | null | undefined,
) {
  return (
    Boolean(getTemplateCoverUrl(templateKey)) ||
    hasStudioTemplateRenderer(templateKey)
  );
}

/**
 * Instant marketplace thumbnail: static cover first (paints immediately),
 * optional live iframe only while hovered so scrolling stays smooth.
 */
export default function TemplateCardPreview({
  templateKey,
  title,
  posterUrl,
  eager = false,
}: TemplateCardPreviewProps) {
  const key = normalizeKey(templateKey);
  const cover = String(posterUrl || "").trim() || getTemplateCoverUrl(key);
  const canLive = hasStudioTemplateRenderer(key);

  const rootRef = useRef<HTMLDivElement>(null);
  const [showLive, setShowLive] = useState(false);
  const hoverTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        window.clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  const handleEnter = () => {
    if (!canLive) return;
    if (hoverTimerRef.current) window.clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = window.setTimeout(() => {
      setShowLive(true);
    }, 280);
  };

  const handleLeave = () => {
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setShowLive(false);
  };

  if (!key) {
    return <div className="h-full w-full bg-slate-100" />;
  }

  return (
    <div
      ref={rootRef}
      className="relative h-full w-full overflow-hidden bg-[#f3f4f6]"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {cover ? (
        <img
          src={cover}
          alt={title || key}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={eager ? "high" : "auto"}
          className="
            absolute inset-0 h-full w-full object-cover object-top
            transition duration-500 ease-out
            group-hover:scale-[1.03]
          "
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-violet-50" />
      )}

      {showLive && canLive ? (
        <div className="absolute inset-0">
          <IframeCardPreview
            src={`/embed/template/${encodeURIComponent(key)}`}
            title={title || key}
            enableHoverPan
            activateOn="immediate"
          />
        </div>
      ) : null}
    </div>
  );
}
