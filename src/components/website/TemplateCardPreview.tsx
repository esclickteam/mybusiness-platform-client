import React, { Component, useEffect, useMemo, useRef, useState } from "react";

import {
  getStudioTemplateRenderer,
  hasStudioTemplateRenderer,
} from "../site-builder/studio/data/templates/templateRendererRegistry";
import {
  prioritizeGalleryPreview,
  releaseGalleryPreview,
  scheduleTemplatePreview,
} from "../../utils/templatePreviewScheduler";

type TemplateCardPreviewProps = {
  templateKey: string;
  title?: string;
  /**
   * Static fallback ONLY when live render is unavailable.
   * Live templates never show a stock cover — users should see the real site.
   */
  coverImage?: string;
  /** Prefer mounting sooner for the first visible cards */
  eager?: boolean;
};

/** Desktop width of the template canvas inside the card. */
const DESIGN_WIDTH = 1440;
/** Tall enough to show hero + several sections on hover-scroll. */
const DESIGN_HEIGHT = 3600;

function normalizeKey(value: string | null | undefined) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

export function canRenderTemplatePreview(
  templateKey: string | null | undefined,
) {
  return hasStudioTemplateRenderer(templateKey);
}

class PreviewErrorBoundary extends Component<
  {
    fallback: React.ReactNode;
    children: React.ReactNode;
    onError?: () => void;
  },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error("[TemplateCardPreview] live mount failed", error);
    this.props.onError?.();
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

function NeutralPlaceholder({
  title,
  loading = false,
}: {
  title?: string;
  loading?: boolean;
}) {
  return (
    <div
      className={`absolute inset-0 flex items-end justify-start bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300 p-4 ${
        loading ? "animate-pulse" : ""
      }`}
    >
      <div className="rounded-md bg-white/80 px-3 py-2 text-xs font-black text-slate-700 shadow-sm">
        {title || "תבנית"}
      </div>
    </div>
  );
}

/**
 * Webflow-style card preview:
 * - mounts the live template as soon as the card is near the viewport
 * - shows a neutral skeleton until ready (never a stock Unsplash cover)
 * - on hover/tap smoothly scrolls down the long page
 * - concurrent mounts are capped by the scheduler for speed
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
  const [liveReady, setLiveReady] = useState(false);
  const [mountFailed, setMountFailed] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [pinned, setPinned] = useState(false);

  const renderer = useMemo(
    () => (key ? getStudioTemplateRenderer(key) : null),
    [key],
  );
  const canLive = Boolean(renderer?.Component);

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
      { rootMargin: "280px 0px", threshold: 0.01 },
    );

    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!key || !canLive) return;

    if (!inView) {
      releaseGalleryPreview(key);
      setActive(false);
      setLiveReady(false);
      return;
    }

    if (eager) {
      prioritizeGalleryPreview(key);
      setActive(true);
      return () => {
        releaseGalleryPreview(key);
      };
    }

    const subscribe = scheduleTemplatePreview(key, { priority: false });
    return subscribe((isActive) => {
      setActive(isActive);
      if (!isActive) setLiveReady(false);
    });
  }, [canLive, eager, inView, key]);

  useEffect(() => {
    if (!active) return;
    const node = contentRef.current;
    if (!node) return;

    const measure = () => {
      const height = Math.max(
        node.scrollHeight,
        node.offsetHeight,
        DESIGN_HEIGHT * 0.65,
      );
      if (height > 0) setContentHeight(height);
      setLiveReady(true);
    };

    const raf = window.requestAnimationFrame(measure);
    const timer = window.setTimeout(measure, 80);
    const timer2 = window.setTimeout(measure, 320);

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(measure);
      observer.observe(node);
      return () => {
        window.cancelAnimationFrame(raf);
        window.clearTimeout(timer);
        window.clearTimeout(timer2);
        observer.disconnect();
      };
    }

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      window.clearTimeout(timer2);
    };
  }, [active, key]);

  const scale = Math.max(frameWidth / DESIGN_WIDTH, 0.04);
  const pageHeight = Math.max(contentHeight, DESIGN_HEIGHT * 0.7);
  const scaledPageHeight = pageHeight * scale;
  const maxScroll = Math.max(0, scaledPageHeight - frameHeight);
  const shouldMount = Boolean(canLive && active && inView && !mountFailed);
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

  // Live templates: skeleton only. Stock covers hide the real site UX.
  const placeholder = (
    <NeutralPlaceholder title={title} loading={!liveReady} />
  );

  const staticCover =
    !canLive && coverImage ? (
      <img
        src={coverImage}
        alt={title || ""}
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
    ) : (
      placeholder
    );

  const beginScroll = () => {
    if (key) prioritizeGalleryPreview(key);
    setScrolling(true);
  };

  return (
    <div
      ref={frameRef}
      className="group/preview relative h-full w-full overflow-hidden bg-[#eef1f4]"
      aria-label={title || key || "תצוגה מקדימה"}
      onMouseEnter={beginScroll}
      onMouseLeave={() => {
        setScrolling(false);
        setPinned(false);
      }}
      onFocus={beginScroll}
      onBlur={() => {
        setScrolling(false);
        setPinned(false);
      }}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("button,a")) return;
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        prioritizeGalleryPreview(key);
        setPinned((value) => !value);
        setScrolling(true);
      }}
    >
      <div
        className={`absolute inset-0 transition-opacity duration-200 ${
          shouldMount && liveReady ? "opacity-0" : "opacity-100"
        }`}
      >
        {staticCover}
      </div>

      {shouldMount && Component ? (
        <PreviewErrorBoundary
          fallback={<div className="absolute inset-0">{staticCover}</div>}
          onError={() => setMountFailed(true)}
        >
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
              className={`pointer-events-none absolute left-1/2 top-0 will-change-transform transition-opacity duration-200 ${
                liveReady ? "opacity-100" : "opacity-0"
              }`}
              style={{
                width: DESIGN_WIDTH,
                height: pageHeight,
                transform: `translateX(-50%) translateY(${
                  isScrolling ? -maxScroll : 0
                }px) scale(${scale})`,
                transformOrigin: "top center",
                transition: `transform ${scrollDuration}s cubic-bezier(0.22, 0.61, 0.36, 1), opacity 0.2s ease`,
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
        </PreviewErrorBoundary>
      ) : null}
    </div>
  );
}
