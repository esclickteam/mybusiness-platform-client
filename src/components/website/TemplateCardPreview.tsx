import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  getStudioTemplateRenderer,
  hasStudioTemplateRenderer,
} from "../site-builder/studio/data/templates/templateRendererRegistry";

type TemplateCardPreviewProps = {
  templateKey: string;
  title?: string;
  /** First row cards mount live preview immediately */
  eager?: boolean;
};

const DESIGN_WIDTH = 1440;
const DESIGN_HEIGHT = 1800;

function normalizeKey(value: string | null | undefined) {
  return String(value || "").trim().toLowerCase();
}

function pickHeroImage(data: Record<string, unknown> | undefined) {
  if (!data) return "";
  const direct = data.heroImage ?? data.image ?? data.hero?.image;
  return typeof direct === "string" && direct.trim() ? direct.trim() : "";
}

export function canRenderTemplatePreview(
  templateKey: string | null | undefined,
) {
  return hasStudioTemplateRenderer(templateKey);
}

/**
 * Gallery card preview: hero image shows instantly; full live homepage mounts
 * only when the card is near the viewport (or eager for first row).
 */
export default function TemplateCardPreview({
  templateKey,
  title,
  eager = false,
}: TemplateCardPreviewProps) {
  const key = normalizeKey(templateKey);
  const frameRef = useRef<HTMLDivElement>(null);
  const [frameWidth, setFrameWidth] = useState(320);
  const [active, setActive] = useState(eager);

  const renderer = useMemo(
    () => (key ? getStudioTemplateRenderer(key) : null),
    [key],
  );

  const data = (renderer?.defaultData || {}) as Record<string, unknown>;
  const heroImage = pickHeroImage(data);

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
    if (eager) {
      setActive(true);
      return undefined;
    }

    const frame = frameRef.current;
    if (!frame || typeof IntersectionObserver === "undefined") {
      setActive(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "480px 0px", threshold: 0.01 },
    );

    observer.observe(frame);
    return () => observer.disconnect();
  }, [eager, key]);

  const scale = Math.max(frameWidth / DESIGN_WIDTH, 0.05);
  const shouldMount = Boolean(renderer?.Component && active);

  const homePage = renderer?.pages?.[0];
  const pageId = homePage?.id || "home";
  const pageSlug = homePage?.slug || "/";
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
      {heroImage ? (
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-top"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="absolute inset-0 bg-slate-100" />
      )}

      {!shouldMount ? (
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
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
            [data-template-card-live="${key}"] .tpl-ken,
            [data-template-card-live="${key}"] .tpl-marquee-track,
            [data-template-card-live="${key}"] .tpl-float,
            [data-template-card-live="${key}"] .tpl-pulse-line,
            [data-template-card-live="${key}"] .tpl-sweep::after {
              animation-delay: 0s !important;
              animation-duration: revert-layer !important;
              animation-iteration-count: infinite !important;
              animation-fill-mode: both !important;
              transform: none;
            }
            [data-template-card-live="${key}"] .tpl-ken {
              animation-direction: alternate !important;
              transform: unset !important;
            }
            [data-template-card-live="${key}"] .tpl-marquee-track {
              animation-timing-function: linear !important;
              transform: unset !important;
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
