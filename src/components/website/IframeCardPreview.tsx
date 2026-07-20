import React, { useEffect, useRef, useState } from "react";

const DESIGN_WIDTH = 1440;
const DESIGN_HEIGHT = 2400;

type IframeCardPreviewProps = {
  src: string;
  title?: string;
  /** Webflow-style slow pan down on card hover to reveal more of the page */
  enableHoverPan?: boolean;
};

/**
 * Renders a live, isolated preview by embedding a same-origin route in an
 * <iframe> and scaling the whole desktop page down to the card width. The
 * iframe uses the app's real renderer, so the preview matches the actual
 * site 1:1. Loading is deferred until the card nears the viewport.
 */
export default function IframeCardPreview({
  src,
  title,
  enableHoverPan = false,
}: IframeCardPreviewProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(420);
  const [containerHeight, setContainerHeight] = useState(560);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const update = () => {
      const rect = frame.getBoundingClientRect();
      if (rect.width) setContainerWidth(rect.width);
      if (rect.height) setContainerHeight(rect.height);
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

  useEffect(() => {
    setIsLoaded(false);
  }, [src]);

  const scale = Math.max(containerWidth / DESIGN_WIDTH, 0.05);
  const scaledHeight = DESIGN_HEIGHT * scale;
  const maxPan = Math.max(scaledHeight - containerHeight, 0);
  const panY = enableHoverPan && isHovered ? Math.min(maxPan * 0.45, 260) : 0;

  return (
    <div
      ref={frameRef}
      className="relative h-full w-full overflow-hidden bg-white"
      aria-hidden="true"
      onMouseEnter={() => enableHoverPan && setIsHovered(true)}
      onMouseLeave={() => enableHoverPan && setIsHovered(false)}
    >
      {!isLoaded ? (
        <div className="absolute inset-0 animate-pulse bg-slate-100" />
      ) : null}

      {isVisible ? (
        <div
          className="pointer-events-none absolute left-0 top-0 will-change-transform"
          style={{
            width: DESIGN_WIDTH,
            height: DESIGN_HEIGHT,
            transform: `translateY(${-panY}px) scale(${scale})`,
            transformOrigin: "top left",
            transition: enableHoverPan
              ? "transform 1.8s cubic-bezier(0.22, 1, 0.36, 1)"
              : undefined,
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
