import React, { useEffect, useMemo, useRef, useState } from "react";

const PREVIEW_WIDTH = 1280;
const PREVIEW_HEIGHT = 1600;

type SiteCardPreviewProps = {
  html: string;
  css?: string;
  title?: string;
};

/*
  A static thumbnail has no JS, so entrance motion (CSS reveals, scroll-triggered
  reveals, floating loops) would otherwise be captured before it finishes and the
  first block would look empty. This CSS forces every animation to jump to its
  final frame and reveals common "start hidden" states — presentation only, it
  never changes the site's elements or content.
*/
const FREEZE_MOTION_CSS = `
  *, *::before, *::after {
    animation-delay: 0s !important;
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    animation-fill-mode: both !important;
    transition: none !important;
  }
  [data-reveal], [data-animate], [data-motion], .bizuply-reveal-up,
  [style*="opacity:0"], [style*="opacity: 0"],
  [style*="visibility:hidden"], [style*="visibility: hidden"] {
    opacity: 1 !important;
    visibility: visible !important;
    transform: none !important;
    filter: none !important;
  }
`;

function buildSrcDoc(html: string, css = "") {
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<base target="_blank" />
<style>
  html, body {
    margin: 0;
    padding: 0;
    background: #fff;
    overflow: hidden;
  }
  body { width: ${PREVIEW_WIDTH}px; }
  ${css || ""}
  ${FREEZE_MOTION_CSS}
</style>
</head>
<body>${html}</body>
</html>`;
}

/**
 * Live thumbnail of a saved site: renders the exact saved HTML/CSS in a
 * scaled, sandboxed, non-interactive iframe so the card shows the site
 * "as it was saved". Rendering is deferred until the card is near the
 * viewport to keep the grid light.
 */
export default function SiteCardPreview({
  html,
  css = "",
  title,
}: SiteCardPreviewProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [frameWidth, setFrameWidth] = useState(420);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const update = () => {
      const rect = frame.getBoundingClientRect();
      if (rect.width) setFrameWidth(rect.width);
    };

    update();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const srcDoc = useMemo(() => buildSrcDoc(html, css), [html, css]);
  const scale = Math.max(frameWidth / PREVIEW_WIDTH, 0.05);

  return (
    <div
      ref={frameRef}
      className="relative h-full w-full overflow-hidden bg-white"
      aria-hidden="true"
    >
      {!isVisible ? (
        <div className="absolute inset-0 animate-pulse bg-slate-100" />
      ) : (
        <div
          className="pointer-events-none absolute left-1/2 top-0"
          style={{
            width: PREVIEW_WIDTH,
            height: PREVIEW_HEIGHT,
            transform: `translateX(-50%) scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          <iframe
            title={title || "תצוגה מקדימה של האתר"}
            srcDoc={srcDoc}
            sandbox=""
            tabIndex={-1}
            loading="lazy"
            className="block border-0"
            style={{
              width: PREVIEW_WIDTH,
              height: PREVIEW_HEIGHT,
              background: "#fff",
            }}
          />
        </div>
      )}
    </div>
  );
}
