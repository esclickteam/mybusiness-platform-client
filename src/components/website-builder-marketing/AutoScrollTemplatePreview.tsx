import React, {
  Component,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { VisualPageStackKeepAliveProvider } from "../site-builder/runtime/VisualPageStack";
import { getStudioTemplateRenderer } from "../site-builder/studio/data/templates/templateRendererRegistry";
import {
  reportPreviewVisibility,
  subscribePreviewMount,
} from "./previewMountCoordinator";

const DESIGN_WIDTH = 1440;
const DESIGN_MIN_HEIGHT = 2200;
/** ~35px/s — slow enough to actually read the page content */
const SCROLL_PX_PER_SEC = 35;
const SCROLL_DURATION_MIN = 18;
const SCROLL_DURATION_MAX = 40;

type Props = {
  templateId: string;
  title: string;
  accent: string;
  accentSoft: string;
};

class PreviewErrorBoundary extends Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error("[AutoScrollTemplatePreview] failed", error);
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

function isSkippablePage(page: { id: string; name: string; slug: string }) {
  const hay = `${page.id} ${page.name} ${page.slug}`.toLowerCase();
  return /terms|privacy|תקנון|מדיניות|cookie|accessibility|faq|shipping|orders/.test(
    hay,
  );
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function computeScrollMetrics(
  contentHeight: number,
  frameWidth: number,
  frameHeight: number,
) {
  const scale = Math.max(frameWidth / DESIGN_WIDTH, 0.05);
  const scaledPageHeight = Math.max(contentHeight, DESIGN_MIN_HEIGHT) * scale;
  const maxScroll = Math.max(0, scaledPageHeight - frameHeight);
  const duration = Math.min(
    SCROLL_DURATION_MAX,
    Math.max(SCROLL_DURATION_MIN, maxScroll / SCROLL_PX_PER_SEC),
  );
  return { scale, maxScroll, duration };
}

export default function AutoScrollTemplatePreview({
  templateId,
  title,
  accent,
  accentSoft,
}: Props) {
  const instanceId = useId();
  const frameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [frameWidth, setFrameWidth] = useState(520);
  const [frameHeight, setFrameHeight] = useState(360);
  const [contentHeight, setContentHeight] = useState(DESIGN_MIN_HEIGHT);
  const [inView, setInView] = useState(false);
  const [isPrimary, setIsPrimary] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [scrolling, setScrolling] = useState(false);
  /** Frozen at scroll-start so mid-load height growth cannot yank the transform. */
  const [activeScroll, setActiveScroll] = useState<{
    maxScroll: number;
    duration: number;
    contentHeight: number;
    scale: number;
  } | null>(null);
  const scrollingRef = useRef(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const renderer = useMemo(
    () => getStudioTemplateRenderer(templateId),
    [templateId],
  );

  const pages = useMemo(() => {
    const all = renderer?.pages || [];
    const filtered = all.filter((page) => !isSkippablePage(page));
    // Keep the tour short so each page can linger and stay readable.
    return (filtered.length ? filtered : all).slice(0, 4);
  }, [renderer]);

  const activePage = pages[pageIndex] || pages[0] || {
    id: "home",
    name: "בית",
    slug: "/",
  };

  const mountLive = inView && isPrimary;

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width) setFrameWidth(rect.width);
      if (rect.height) setFrameHeight(rect.height);
    };
    update();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    return subscribePreviewMount((activeId) => {
      setIsPrimary(activeId === instanceId);
    });
  }, [instanceId]);

  useEffect(() => {
    const el = frameRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      reportPreviewVisibility(instanceId, 1, true);
      setInView(true);
      return () => {
        reportPreviewVisibility(instanceId, 0, false);
      };
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        const intersecting = entry.isIntersecting;
        setInView(intersecting);
        reportPreviewVisibility(
          instanceId,
          intersecting ? entry.intersectionRatio : 0,
          intersecting,
        );
      },
      // Tight margin so the next heavy template does not mount while scrolling.
      { rootMargin: "0px 0px", threshold: [0, 0.2, 0.35, 0.5, 0.75, 1] },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      reportPreviewVisibility(instanceId, 0, false);
    };
  }, [instanceId]);

  const measureContent = () => {
    const node = contentRef.current;
    if (!node) return 0;
    const height = Math.max(
      node.scrollHeight,
      node.offsetHeight,
      DESIGN_MIN_HEIGHT * 0.7,
    );
    // Never resize the scrolling layer mid-pass — that is what made Velmora "fall".
    if (height > 0 && !scrollingRef.current) setContentHeight(height);
    return height;
  };

  useEffect(() => {
    if (!mountLive) return;

    const raf = window.requestAnimationFrame(measureContent);
    // Remeasure after images/fonts settle so the tour covers the real page.
    const t1 = window.setTimeout(measureContent, 120);
    const t2 = window.setTimeout(measureContent, 700);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [mountLive, activePage.id, templateId]);

  const liveMetrics = computeScrollMetrics(
    contentHeight,
    frameWidth,
    frameHeight,
  );

  // Auto tour: scroll page slowly, then advance to next page.
  useEffect(() => {
    if (!mountLive || reducedMotion || pages.length === 0) {
      scrollingRef.current = false;
      setScrolling(false);
      setActiveScroll(null);
      return;
    }

    let cancelled = false;

    const run = async () => {
      scrollingRef.current = false;
      setScrolling(false);
      setActiveScroll(null);

      // Wait for layout + images so height (and scroll distance) is stable.
      await wait(900);
      if (cancelled) return;
      const settledHeight = measureContent() || contentHeight;
      await wait(1100);
      if (cancelled) return;
      const finalHeight = measureContent() || settledHeight || contentHeight;

      const metrics = computeScrollMetrics(
        finalHeight,
        frameRef.current?.getBoundingClientRect().width || frameWidth,
        frameRef.current?.getBoundingClientRect().height || frameHeight,
      );

      // Freeze distance/duration/height for this pass — later image loads must not yank Y.
      scrollingRef.current = true;
      setActiveScroll({
        maxScroll: metrics.maxScroll,
        duration: metrics.duration,
        contentHeight: finalHeight,
        scale: metrics.scale,
      });
      setScrolling(true);
      await wait(metrics.duration * 1000 + 400);
      if (cancelled) return;

      scrollingRef.current = false;
      setScrolling(false);
      setActiveScroll(null);
      await wait(1100);
      if (cancelled) return;

      setPageIndex((value) => (value + 1) % pages.length);
    };

    void run();
    return () => {
      cancelled = true;
      scrollingRef.current = false;
    };
    // contentHeight intentionally omitted — we re-measure inside the tour.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mountLive, pageIndex, pages.length, reducedMotion, frameWidth, frameHeight]);

  const Component = renderer?.Component as
    | React.ComponentType<Record<string, unknown>>
    | undefined;
  const data = (renderer?.defaultData || {}) as Record<string, unknown>;

  const scrollOffset =
    scrolling && activeScroll ? -activeScroll.maxScroll : 0;
  const scrollDuration = activeScroll?.duration ?? liveMetrics.duration;
  const layerScale = activeScroll?.scale ?? liveMetrics.scale;
  const layerHeight = Math.max(
    activeScroll?.contentHeight ?? contentHeight,
    DESIGN_MIN_HEIGHT,
  );

  const fallback = (
    <div
      className="wb-type-preview__fallback"
      style={{
        background: `linear-gradient(145deg, ${accentSoft}, ${accent})`,
      }}
    >
      <span>{title}</span>
    </div>
  );

  return (
    <div
      className="wb-type-preview"
      style={
        {
          "--wb-glow": accent,
          "--wb-glow-soft": accentSoft,
        } as React.CSSProperties
      }
    >
      <span className="wb-type-preview__glow" aria-hidden="true" />
      <div className="wb-type-preview__chrome">
        <span />
        <span />
        <span />
        <i />
      </div>
      <div ref={frameRef} className="wb-type-preview__viewport">
        {!mountLive || !Component ? (
          fallback
        ) : (
          <PreviewErrorBoundary fallback={fallback}>
            {renderer?.editorCss ? (
              <style
                dangerouslySetInnerHTML={{
                  __html: String(renderer.editorCss),
                }}
              />
            ) : null}
            <style>{`
              [data-wb-tour="${templateId}"] [data-reveal],
              [data-wb-tour="${templateId}"] [data-animate],
              [data-wb-tour="${templateId}"] [class*="opacity-0"] {
                opacity: 1 !important;
                visibility: visible !important;
                transform: none !important;
                filter: none !important;
              }
              [data-wb-tour="${templateId}"] header,
              [data-wb-tour="${templateId}"] [class*="sticky"],
              [data-wb-tour="${templateId}"] [class*="fixed"] {
                position: relative !important;
                top: auto !important;
                inset: auto !important;
              }
              [data-wb-tour="${templateId}"] *,
              [data-wb-tour="${templateId}"] *::before,
              [data-wb-tour="${templateId}"] *::after {
                animation: none !important;
              }
              [data-wb-tour="${templateId}"] img {
                content-visibility: auto;
              }
            `}</style>
            <div
              className="wb-type-preview__scale"
              style={{
                width: DESIGN_WIDTH,
                height: layerHeight,
                transform: `translateX(-50%) translateY(${scrollOffset}px) scale(${layerScale})`,
                transformOrigin: "top center",
                // Linear keeps pace readable; ease curves feel like a fast skim.
                transition: `transform ${
                  scrolling ? scrollDuration : 0.85
                }s linear`,
              }}
            >
              <VisualPageStackKeepAliveProvider keepAlive={false}>
                <div
                  ref={contentRef}
                  key={`${templateId}:${activePage.id}`}
                  data-wb-tour={templateId}
                  data-template-id={templateId}
                  dir="rtl"
                  style={{
                    width: DESIGN_WIDTH,
                    minHeight: DESIGN_MIN_HEIGHT,
                    background: "#fff",
                    pointerEvents: "none",
                  }}
                >
                  <Component
                    initialPage={activePage.id}
                    initialPageId={activePage.id}
                    activePageId={activePage.id}
                    currentPageId={activePage.id}
                    pageId={activePage.id}
                    page={activePage.id}
                    initialSlug={activePage.slug}
                    activePageSlug={activePage.slug}
                    currentPageSlug={activePage.slug}
                    pageSlug={activePage.slug}
                    mode="preview"
                    data={data}
                    templateData={data}
                    isStudioStatic
                  />
                </div>
              </VisualPageStackKeepAliveProvider>
            </div>
          </PreviewErrorBoundary>
        )}
      </div>
    </div>
  );
}
