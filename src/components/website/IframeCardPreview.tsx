import React, { useEffect, useRef, useState } from "react";

const DESIGN_WIDTH = 1440;
const DESIGN_HEIGHT = 2400;

type IframeCardPreviewProps = {
  src: string;
  title?: string;
  enableHoverPan?: boolean;
  /**
   * immediate — mount as soon as rendered (caller already gated on hover)
   * visible — mount when near viewport
   */
  activateOn?: "immediate" | "visible";
};

/**
 * Scaled live preview iframe. Kept optional/on-demand so gallery scrolling
 * stays smooth; prefer a static poster underneath for instant paint.
 */
export default function IframeCardPreview({
  src,
  title,
  enableHoverPan = false,
  activateOn = "visible",
}: IframeCardPreviewProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(420);
  const [containerHeight, setContainerHeight] = useState(560);
  const [isActive, setIsActive] = useState(activateOn === "immediate");
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
    if (activateOn === "immediate") {
      setIsActive(true);
      return;
    }

    const frame = frameRef.current;
    if (!frame) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px" },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, [activateOn, src]);

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
      className="relative h-full w-full overflow-hidden bg-transparent"
      aria-hidden="true"
      onMouseEnter={() => enableHoverPan && setIsHovered(true)}
      onMouseLeave={() => enableHoverPan && setIsHovered(false)}
    >
      {isActive ? (
        <div
          className="pointer-events-none absolute left-0 top-0"
          style={{
            width: DESIGN_WIDTH,
            height: DESIGN_HEIGHT,
            transform: `translateY(${-panY}px) scale(${scale})`,
            transformOrigin: "top left",
            transition: enableHoverPan
              ? "transform 1.6s cubic-bezier(0.22, 1, 0.36, 1)"
              : undefined,
            opacity: isLoaded ? 1 : 0,
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
