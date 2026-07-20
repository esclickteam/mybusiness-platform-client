import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  getStudioTemplateRenderer,
  hasStudioTemplateRenderer,
} from "../site-builder/studio/data/templates/templateRendererRegistry";
import { scheduleTemplatePreview } from "../../utils/templatePreviewScheduler";

type TemplateCardPreviewProps = {
  templateKey: string;
  title?: string;
  /** Kept for API compat — gallery now batch-loads all cards on open */
  eager?: boolean;
};

const DESIGN_WIDTH = 1440;
const DESIGN_HEIGHT = 1800;

function normalizeKey(value: string | null | undefined) {
  return String(value || "").trim().toLowerCase();
}

export function canRenderTemplatePreview(
  templateKey: string | null | undefined,
) {
  return hasStudioTemplateRenderer(templateKey);
}

/**
 * Live scaled homepage of the real template (site content, not stock photos).
 * Activation is scheduled in fast batches for the whole gallery so cards fill
 * within seconds like Webflow — without waiting for scroll.
 */
export default function TemplateCardPreview({
  templateKey,
  title,
}: TemplateCardPreviewProps) {
  const key = normalizeKey(templateKey);
  const frameRef = useRef<HTMLDivElement>(null);
  const [frameWidth, setFrameWidth] = useState(320);
  const [active, setActive] = useState(false);

  const renderer = useMemo(
    () => (key ? getStudioTemplateRenderer(key) : null),
    [key],
  );

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const update = () => {
      const width = frame.getBoundingClientRect().width;
      if (width) setFrameWidth(width);
    };

    update();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!key) return;

    const subscribe = scheduleTemplatePreview(key);
    return subscribe((isActive) => setActive(isActive));
  }, [key]);

  const scale = Math.max(frameWidth / DESIGN_WIDTH, 0.05);
  const shouldMount = Boolean(renderer?.Component && active);

  const homePage = renderer?.pages?.[0];
  const pageId = homePage?.id || "home";
  const pageSlug = homePage?.slug || "/";
  const data = (renderer?.defaultData || {}) as Record<string, unknown>;
  const Component = renderer?.Component as
    | React.ComponentType<Record<string, unknown>>
    | undefined;

  return (
    <div
      ref={frameRef}
      className="relative h-full w-full overflow-hidden bg-white"
      aria-label={title || key || "תצוגה מקדימה"}
      aria-hidden={!title}
    >
      {!shouldMount ? (
        <div className="absolute inset-0 animate-pulse bg-slate-100" />
      ) : null}

      {shouldMount && Component ? (
        <>
          {renderer?.editorCss ? (
            <style
              dangerouslySetInnerHTML={{ __html: String(renderer.editorCss) }}
            />
          ) : null}

          <style>{`
            [data-template-card-live="${key}"] [data-reveal],
            [data-template-card-live="${key}"] [data-animate],
            [data-template-card-live="${key}"] [data-motion],
            [data-template-card-live="${key}"] .bizuply-reveal-up,
            [data-template-card-live="${key}"] [class*="opacity-0"] {
              opacity: 1 !important;
              visibility: visible !important;
              transform: none !important;
              filter: none !important;
            }
            [data-template-card-live="${key}"] *,
            [data-template-card-live="${key}"] *::before,
            [data-template-card-live="${key}"] *::after {
              animation-delay: 0s !important;
              animation-duration: 1ms !important;
              animation-iteration-count: 1 !important;
              animation-fill-mode: both !important;
            }
          `}</style>

          <div
            className="pointer-events-none absolute left-1/2 top-0"
            style={{
              width: DESIGN_WIDTH,
              height: DESIGN_HEIGHT,
              transform: `translateX(-50%) scale(${scale})`,
              transformOrigin: "top center",
            }}
          >
            <div data-template-card-live={key} data-template-id={key} dir="rtl">
              <Component
                initialPage={pageId}
                initialPageId={pageId}
                activePageId={pageId}
                currentPageId={pageId}
                pageId={pageId}
                initialSlug={pageSlug}
                activePageSlug={pageSlug}
                currentPageSlug={pageSlug}
                pageSlug={pageSlug}
                mode="preview"
                data={data}
                templateData={data}
                isStudioStatic
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
