import React, { Component, useEffect, useRef, useState } from "react";

import {
  hasStudioTemplateRenderer,
  loadStudioTemplateRenderer,
  prefetchStudioTemplateRenderer,
  type StudioTemplateRenderer,
} from "../site-builder/studio/data/templates/templateRendererRegistry";
import {
  prioritizeGalleryPreview,
  releaseGalleryPreview,
  scheduleGalleryPreview,
} from "../../utils/templatePreviewScheduler";

type TemplateCardPreviewProps = {
  templateKey: string;
  title?: string;
  /** @deprecated Covers removed — live template only. Kept for call-site compat. */
  coverImage?: string;
  /** Priority queue for above-the-fold cards. */
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

function LivePlaceholder({ title }: { title?: string }) {
  return (
    <div className="absolute inset-0 flex items-end justify-start bg-[#e8ecf1] p-4">
      <div className="h-2 w-24 animate-pulse rounded bg-slate-300/80" />
      <span className="sr-only">{title || "טוען תצוגה"}</span>
    </div>
  );
}

/**
 * Gallery card — live template canvas only (no stock cover photos).
 * Mounts when in viewport / eager / hover via the shared scheduler.
 * Loads one template chunk on demand (not the full registry).
 */
export default function TemplateCardPreview({
  templateKey,
  title,
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
  const [hovering, setHovering] = useState(false);
  const [renderer, setRenderer] = useState<StudioTemplateRenderer | null>(null);

  const canLive = Boolean(key && hasStudioTemplateRenderer(key));

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
      { rootMargin: "480px 0px", threshold: 0.01 },
    );

    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  // Prefetch chunk when card enters viewport / hover — before mount slot opens.
  useEffect(() => {
    if (!key || !canLive) return;
    if (inView || hovering || eager) {
      prefetchStudioTemplateRenderer(key);
    }
  }, [canLive, eager, hovering, inView, key]);

  useEffect(() => {
    if (!key || !canLive || mountFailed) return;

    const wantsLive = inView || hovering || pinned;

    if (!wantsLive) {
      releaseGalleryPreview(key);
      setActive(false);
      setLiveReady(false);
      return;
    }

    if (hovering || pinned || inView) {
      prioritizeGalleryPreview(key);
    }

    const subscribe = scheduleGalleryPreview(key, {
      priority: Boolean(eager || inView || hovering || pinned),
    });

    const unsubscribe = subscribe((isActive) => {
      setActive(isActive);
      if (!isActive) setLiveReady(false);
    });

    return () => {
      unsubscribe();
      releaseGalleryPreview(key);
    };
  }, [canLive, eager, hovering, inView, key, mountFailed, pinned]);

  useEffect(() => {
    if (!active || !key) return;
    let cancelled = false;
    loadStudioTemplateRenderer(key).then((next) => {
      if (cancelled) return;
      if (!next?.Component) {
        setMountFailed(true);
        return;
      }
      setRenderer(next);
    });
    return () => {
      cancelled = true;
    };
  }, [active, key]);

  useEffect(() => {
    if (!active || !renderer?.Component) return;
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
    const timer = window.setTimeout(measure, 40);

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(measure);
      observer.observe(node);
      return () => {
        window.cancelAnimationFrame(raf);
        window.clearTimeout(timer);
        observer.disconnect();
      };
    }

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [active, key, renderer]);

  const scale = Math.max(frameWidth / DESIGN_WIDTH, 0.04);
  const pageHeight = Math.max(contentHeight, DESIGN_HEIGHT * 0.7);
  const scaledPageHeight = pageHeight * scale;
  const maxScroll = Math.max(0, scaledPageHeight - frameHeight);
  const shouldMount = Boolean(
    canLive && active && renderer?.Component && !mountFailed,
  );
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

  const beginHover = () => {
    setHovering(true);
    if (key) {
      prioritizeGalleryPreview(key);
      prefetchStudioTemplateRenderer(key);
    }
    setScrolling(true);
  };

  const endHover = () => {
    setHovering(false);
    setScrolling(false);
    setPinned(false);
  };

  return (
    <div
      ref={frameRef}
      className="group/preview relative h-full w-full overflow-hidden bg-[#eef1f4]"
      aria-label={title || key || "תצוגה מקדימה"}
      onMouseEnter={beginHover}
      onMouseLeave={endHover}
      onFocus={beginHover}
      onBlur={endHover}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("button,a")) return;
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
          return;
        }
        setPinned((value) => !value);
        setScrolling(true);
      }}
    >
      {!liveReady || mountFailed ? <LivePlaceholder title={title} /> : null}

      {shouldMount && Component ? (
        <PreviewErrorBoundary
          fallback={<LivePlaceholder title={title} />}
          onError={() => setMountFailed(true)}
        >
          <div
            className="absolute inset-0 origin-top-left will-change-transform"
            style={{
              width: DESIGN_WIDTH,
              transform: `scale(${scale})`,
              transition: isScrolling
                ? `transform ${scrollDuration}s linear`
                : "transform 0.45s ease",
              transformOrigin: "top left",
            }}
          >
            <div
              ref={contentRef}
              className="pointer-events-none"
              style={{
                width: DESIGN_WIDTH,
                minHeight: DESIGN_HEIGHT,
                transform: isScrolling
                  ? `translateY(-${maxScroll / scale}px)`
                  : "translateY(0)",
                transition: isScrolling
                  ? `transform ${scrollDuration}s linear`
                  : "transform 0.9s ease",
              }}
            >
              <Component
                mode="preview"
                viewMode="preview"
                runtimeMode="preview"
                initialPage={pageId}
                initialPageId={pageId}
                activePageId={pageId}
                currentPageId={pageId}
                pageId={pageId}
                page={pageId}
                initialSlug={pageSlug}
                data={data}
                templateData={data}
                isPublic={false}
                isStudioStatic
              />
            </div>
          </div>
        </PreviewErrorBoundary>
      ) : null}
    </div>
  );
}
