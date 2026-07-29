import React, {
  Component,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getStudioTemplateRenderer } from "../site-builder/studio/data/templates/templateRendererRegistry";

const DESIGN_WIDTH = 1440;
/** Tall enough to show header + full hero, not a mid-cut crop */
const DESIGN_VIEW_HEIGHT = 980;

type Props = {
  templateId: string;
  title: string;
  accent: string;
  accentSoft: string;
  isCenter?: boolean;
  mountLive?: boolean;
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
    console.error("[LiveTemplateMockup] failed", error);
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

export default function LiveTemplateMockup({
  templateId,
  title,
  accent,
  accentSoft,
  isCenter = false,
  mountLive = true,
}: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [frameWidth, setFrameWidth] = useState(640);

  const renderer = useMemo(
    () => getStudioTemplateRenderer(templateId),
    [templateId],
  );

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width) setFrameWidth(rect.width);
    };
    update();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Scale by width only so the live template fills the frame without mid-cropping the hero.
  const scale = Math.max(frameWidth / DESIGN_WIDTH, 0.05);

  const Component = renderer?.Component as
    | React.ComponentType<Record<string, unknown>>
    | undefined;
  const data = (renderer?.defaultData || {}) as Record<string, unknown>;
  const pageId = renderer?.pages?.[0]?.id || "home";
  const pageSlug = renderer?.pages?.[0]?.slug || "/";

  const fallback = (
    <div
      className="wb-mockup__fallback"
      style={{
        background: `linear-gradient(145deg, ${accentSoft}, ${accent})`,
      }}
    >
      <span>{title}</span>
    </div>
  );

  return (
    <div
      className={`wb-mockup-shell${isCenter ? " is-center" : ""}`}
      style={
        {
          "--wb-glow": accent,
          "--wb-glow-soft": accentSoft,
        } as React.CSSProperties
      }
    >
      <span className="wb-mockup-glow" aria-hidden="true" />
      <div className="wb-mockup">
        <div className="wb-mockup__chrome">
          <span className="wb-mockup__dot" />
          <span className="wb-mockup__dot" />
          <span className="wb-mockup__dot" />
          <span className="wb-mockup__url" />
        </div>
        <div ref={frameRef} className="wb-mockup__viewport">
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
                [data-wb-live="${templateId}"] {
                  width: ${DESIGN_WIDTH}px !important;
                  max-width: ${DESIGN_WIDTH}px !important;
                  overflow: hidden !important;
                  background: #fff;
                }
                [data-wb-live="${templateId}"] .min-h-screen,
                [data-wb-live="${templateId}"] [class*="min-h-screen"],
                [data-wb-live="${templateId}"] [style*="min-height: 100vh"],
                [data-wb-live="${templateId}"] [style*="min-height:100vh"] {
                  min-height: ${DESIGN_VIEW_HEIGHT}px !important;
                }
                [data-wb-live="${templateId}"] header,
                [data-wb-live="${templateId}"] [class*="sticky"],
                [data-wb-live="${templateId}"] [class*="fixed"] {
                  position: relative !important;
                  top: auto !important;
                  inset: auto !important;
                }
                [data-wb-live="${templateId}"] [data-reveal],
                [data-wb-live="${templateId}"] [data-animate],
                [data-wb-live="${templateId}"] [class*="opacity-0"] {
                  opacity: 1 !important;
                  visibility: visible !important;
                  transform: none !important;
                  filter: none !important;
                }
                ${
                  !isCenter
                    ? `
                [data-wb-live="${templateId}"] *,
                [data-wb-live="${templateId}"] *::before,
                [data-wb-live="${templateId}"] *::after {
                  animation-play-state: paused !important;
                }`
                    : ""
                }
              `}</style>
              <div
                className="wb-mockup__live-scale"
                style={{
                  width: DESIGN_WIDTH,
                  height: DESIGN_VIEW_HEIGHT,
                  transform: `translateX(-50%) scale(${scale})`,
                  transformOrigin: "top center",
                  left: "50%",
                }}
              >
                <div
                  data-wb-live={templateId}
                  data-template-id={templateId}
                  data-bizuply-preview="hero"
                  dir="rtl"
                  style={{
                    width: DESIGN_WIDTH,
                    height: DESIGN_VIEW_HEIGHT,
                    overflow: "hidden",
                    pointerEvents: "none",
                  }}
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
            </PreviewErrorBoundary>
          )}
        </div>
      </div>
    </div>
  );
}
