import React, { useEffect, useRef, useState } from "react";

const DESIGN_WIDTH = 1440;
const DESIGN_HEIGHT = 2000;

type IframeCardPreviewProps = {
  src: string;
  title?: string;
};

/**
 * Renders a live, isolated preview by embedding a same-origin route in an
 * <iframe> and scaling the whole desktop page down to the card width. The
 * iframe uses the app's real renderer, so the preview matches the actual
 * site 1:1 (including the user's edits and images). Loading is deferred until
 * the card nears the viewport to keep the grid light.
 */
export default function IframeCardPreview({ src, title }: IframeCardPreviewProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(420);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const update = () => {
      const rect = frame.getBoundingClientRect();
      if (rect.width) setContainerWidth(rect.width);
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
      { rootMargin: "320px" },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const scale = Math.max(containerWidth / DESIGN_WIDTH, 0.05);

  return (
    <div
      ref={frameRef}
      className="relative h-full w-full overflow-hidden bg-white"
      aria-hidden="true"
    >
      {!isLoaded ? (
        <div className="absolute inset-0 animate-pulse bg-slate-100" />
      ) : null}

      {isVisible ? (
        <div
          className="pointer-events-none absolute left-0 top-0"
          style={{
            width: DESIGN_WIDTH,
            height: DESIGN_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <iframe
            src={src}
            title={title || "תצוגה מקדימה"}
            tabIndex={-1}
            scrolling="no"
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            style={{
              width: DESIGN_WIDTH,
              height: DESIGN_HEIGHT,
              border: 0,
              background: "#fff",
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
