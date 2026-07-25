import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  getStudioTemplateRenderer,
  hasStudioTemplateRenderer,
} from "../site-builder/studio/data/templates/templateRendererRegistry";
import {
  releaseGalleryPreview,
  scheduleTemplatePreview,
} from "../../utils/templatePreviewScheduler";

type TemplateCardPreviewProps = {
  templateKey: string;
  title?: string;
  /** Optional cover shown until the live site mounts */
  coverImage?: string;
  /** Prefer mounting sooner for the first visible cards */
  eager?: boolean;
};

/** Desktop width of the template canvas inside the card. */
const DESIGN_WIDTH = 1440;
/** Tall homepage canvas so hover can scroll through beautiful sections. */
const DESIGN_HEIGHT = 4600;

function normalizeKey(value: string | null | undefined) {
  return String(value || "").trim().toLowerCase();
}

export function canRenderTemplatePreview(
  templateKey: string | null | undefined,
) {
  return hasStudioTemplateRenderer(templateKey);
}

/**
 * Webflow-style card preview:
 * - shows the hero / top of the real template
 * - on hover (desktop) or tap (mobile) smoothly scrolls down the long page
 * - mounts only when near the viewport to keep the gallery fast
 */
export default function TemplateCardPreview({
  templateKey,
  title,
  coverImage,
  eager = false,
}: TemplateCardPreviewProps) {
  const key = normalizeKey(templateKey);
  const frameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [frameWidth, setFrameWidth] = useState(320);
  const [frameHeight, setFrameHeight] = useState(400);
  const [contentHeight, setContentHeight] = useState(DESIGN_HEIGHT);
  const [inView, setInView] = useState(eager);
  const [active, setActive] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [pinned, setPinned] = useState(false);

  const renderer = useMemo(
    () => (key ? getStudioTemplateRenderer(key) : null),
    [key],
  );

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const update = () => {
      const rect = frame.getBoundingClientRect();
      if (rect.width) setFrameWidth(rect.width);
      if (rect.height) setFrameHeight(rect.height);
    };

    update();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting || entry.intersectionRatio > 0);
      },
      { rootMargin: "220px 0px", threshold: 0.01 },
    );

    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!key) return;

    if (!inView) {
      releaseGalleryPreview(key);
      setActive(false);
      return;
    }

    const subscribe = scheduleTemplatePreview(key);
    return subscribe((isActive) => setActive(isActive));
  }, [inView, key]);

  useEffect(() => {
    if (!active) return;
    const node = contentRef.current;
    if (!node) return;

    const measure = () => {
      const height = Math.max(node.scrollHeight, node.offsetHeight, DESIGN_HEIGHT * 0.7);
      if (height > 0) setContentHeight(height);
    };

    measure();
    const timer = window.setTimeout(measure, 320);
    const timer2 = window.setTimeout(measure, 900);

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(measure);
      observer.observe(node);
      return () => {
        window.clearTimeout(timer);
        window.clearTimeout(timer2);
        observer.disconnect();
      };
    }

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(timer2);
    };
  }, [active, key]);

  const scale = Math.max(frameWidth / DESIGN_WIDTH, 0.04);
  const pageHeight = Math.max(contentHeight, DESIGN_HEIGHT * 0.75);
  const scaledPageHeight = pageHeight * scale;
  const maxScroll = Math.max(0, scaledPageHeight - frameHeight);
  const shouldMount = Boolean(renderer?.Component && active && inView);
  const isScrolling = scrolling || pinned;

  const homePage = renderer?.pages?.[0];
  const pageId = homePage?.id || "home";
  const pageSlug = homePage?.slug || "/";
  const data = (renderer?.defaultData || {}) as Record<string, unknown>;
  const Component = renderer?.Component as
    | React.ComponentType<Record<string, unknown>>
    | undefined;

  const scrollDuration = isScrolling
    ? Math.min(7.5, Math.max(3.2, maxScroll / 180))
    : 1.15;

  return (
    <div
      ref={frameRef}
      className="group/preview relative h-full w-full overflow-hidden bg-[#f3f4f6]"
      aria-label={title || key || "תצוגה מקדימה"}
      onMouseEnter={() => setScrolling(true)}
      onMouseLeave={() => {
        setScrolling(false);
        setPinned(false);
      }}
      onFocus={() => setScrolling(true)}
      onBlur={() => {
        setScrolling(false);
        setPinned(false);
      }}
      onClick={(event) => {
        // Tap-to-scroll on touch devices; ignore clicks on nested buttons.
        if ((event.target as HTMLElement).closest("button,a")) return;
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        setPinned((value) => !value);
        setScrolling(true);
      }}
    >
      {coverImage ? (
        <img
          src={coverImage}
          alt=""
          aria-hidden
          className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ${
            shouldMount ? "opacity-0" : "opacity-100"
          }`}
        />
      ) : null}

      {!shouldMount ? (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-slate-100 via-slate-50 to-slate-200" />
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
              animation: none !important;
              transition: none !important;
            }
          `}</style>

          <div
            className="pointer-events-none absolute left-1/2 top-0 will-change-transform"
            style={{
              width: DESIGN_WIDTH,
              height: pageHeight,
              transform: `translateX(-50%) translateY(${
                isScrolling ? -maxScroll : 0
              }px) scale(${scale})`,
              transformOrigin: "top center",
              transition: `transform ${scrollDuration}s cubic-bezier(0.22, 0.61, 0.36, 1)`,
            }}
          >
            <div
              ref={contentRef}
              data-template-card-live={key}
              data-template-id={key}
              dir="rtl"
              className="w-full bg-white"
            >
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

      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/20 to-transparent opacity-40" />
    </div>
  );
}
