import React, {
  Component,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getStudioTemplateRenderer } from "../site-builder/studio/data/templates/templateRendererRegistry";

const DESIGN_WIDTH = 1440;
const DESIGN_MIN_HEIGHT = 2200;

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
  return /terms|privacy|תקנון|מדיניות|cookie/.test(hay);
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export default function AutoScrollTemplatePreview({
  templateId,
  title,
  accent,
  accentSoft,
}: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [frameWidth, setFrameWidth] = useState(520);
  const [frameHeight, setFrameHeight] = useState(360);
  const [contentHeight, setContentHeight] = useState(DESIGN_MIN_HEIGHT);
  const [inView, setInView] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [scrolling, setScrolling] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const renderer = useMemo(
    () => getStudioTemplateRenderer(templateId),
    [templateId],
  );

  const pages = useMemo(() => {
    const all = renderer?.pages || [];
    const filtered = all.filter((page) => !isSkippablePage(page));
    return (filtered.length ? filtered : all).slice(0, 5);
  }, [renderer]);

  const activePage = pages[pageIndex] || pages[0] || {
    id: "home",
    name: "בית",
    slug: "/",
  };

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
    const el = frameRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "120px 0px", threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const node = contentRef.current;
    if (!node) return;

    const measure = () => {
      const height = Math.max(
        node.scrollHeight,
        node.offsetHeight,
        DESIGN_MIN_HEIGHT * 0.7,
      );
      if (height > 0) setContentHeight(height);
    };

    const raf = window.requestAnimationFrame(measure);
    const t = window.setTimeout(measure, 80);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [inView, activePage.id, templateId]);

  const scale = Math.max(frameWidth / DESIGN_WIDTH, 0.05);
  const scaledPageHeight = Math.max(contentHeight, DESIGN_MIN_HEIGHT) * scale;
  const maxScroll = Math.max(0, scaledPageHeight - frameHeight);
  const scrollDuration = Math.min(8.5, Math.max(4.8, maxScroll / 160));
  const scrollDurationRef = useRef(scrollDuration);
  scrollDurationRef.current = scrollDuration;

  // Auto tour: scroll page slowly, then advance to next page.
  useEffect(() => {
    if (!inView || reducedMotion || pages.length === 0) {
      setScrolling(false);
      return;
    }

    let cancelled = false;

    const run = async () => {
      setScrolling(false);
      await wait(1000);
      if (cancelled) return;

      setScrolling(true);
      await wait(scrollDurationRef.current * 1000 + 800);
      if (cancelled) return;

      setScrolling(false);
      await wait(700);
      if (cancelled) return;

      setPageIndex((value) => (value + 1) % pages.length);
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [inView, pageIndex, pages.length, reducedMotion]);

  const Component = renderer?.Component as
    | React.ComponentType<Record<string, unknown>>
    | undefined;
  const data = (renderer?.defaultData || {}) as Record<string, unknown>;

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
        {!inView || !Component ? (
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
            `}</style>
            <div
              className="wb-type-preview__scale"
              style={{
                width: DESIGN_WIDTH,
                height: Math.max(contentHeight, DESIGN_MIN_HEIGHT),
                transform: `translateX(-50%) translateY(${
                  scrolling ? -maxScroll : 0
                }px) scale(${scale})`,
                transformOrigin: "top center",
                transition: `transform ${
                  scrolling ? scrollDuration : 0.7
                }s cubic-bezier(0.22, 0.61, 0.36, 1)`,
              }}
            >
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
            </div>
          </PreviewErrorBoundary>
        )}
      </div>
    </div>
  );
}
