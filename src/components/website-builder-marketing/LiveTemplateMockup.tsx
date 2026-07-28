import React, {
  Component,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getStudioTemplateRenderer } from "../site-builder/studio/data/templates/templateRendererRegistry";

const DESIGN_WIDTH = 1440;
const DESIGN_HEIGHT = 1100;

type Props = {
  templateId: string;
  title: string;
  accent: string;
  accentSoft: string;
  isCenter?: boolean;
  /** Mount heavy live DOM only when near the carousel focus */
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
      const w = el.getBoundingClientRect().width;
      if (w) setFrameWidth(w);
    };
    update();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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
              {!isCenter ? (
                <style>{`
                  [data-wb-live="${templateId}"] *,
                  [data-wb-live="${templateId}"] *::before,
                  [data-wb-live="${templateId}"] *::after {
                    animation-play-state: paused !important;
                  }
                `}</style>
              ) : null}
              <div
                className="wb-mockup__live-scale"
                style={{
                  width: DESIGN_WIDTH,
                  height: DESIGN_HEIGHT,
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                }}
              >
                <div
                  data-wb-live={templateId}
                  data-template-id={templateId}
                  data-bizuply-preview="hero"
                  dir="rtl"
                  style={{
                    width: DESIGN_WIDTH,
                    minHeight: DESIGN_HEIGHT,
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
