import React, { useEffect, useMemo, useRef, useState } from "react";

import { getSectionTemplateById } from "./sectionLibrary";
import SectionTemplateCanvasPreview from "./SectionTemplateCanvasPreview";
import type { VisualLibraryPageTemplate } from "./visualLibraryTypes";
import type { VisualSectionTheme } from "./sectionTheme";

const CANVAS_WIDTH = 1100;

function numericHeight(value: string | number | undefined) {
  if (typeof value === "number") return value;
  const parsed = Number.parseFloat(String(value || ""));
  return Number.isFinite(parsed) ? parsed : 520;
}

/**
 * Wix-style page card: stacks page section blueprints, scales to card width,
 * and clips from the top so the composition is readable at a glance.
 */
export default function PageLibraryCardPreview({
  page,
  theme,
}: {
  page: VisualLibraryPageTemplate;
  theme?: VisualSectionTheme;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [frameWidth, setFrameWidth] = useState(280);
  const [isVisible, setIsVisible] = useState(false);

  const sections = useMemo(() => {
    return (page.sectionIds || [])
      .map((id) => getSectionTemplateById(id))
      .filter(
        (section): section is NonNullable<typeof section> =>
          Boolean(section) && section!.id !== "section-footer",
      );
  }, [page.sectionIds]);

  const totalHeight = useMemo(() => {
    if (!sections.length) return 720;
    return sections.reduce(
      (sum, section) => sum + numericHeight(section.minHeight),
      0,
    );
  }, [sections]);

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
      { rootMargin: "360px" },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !isVisible) return;

    const updateSize = () => {
      const rect = frame.getBoundingClientRect();
      if (rect.width) setFrameWidth(rect.width);
    };

    updateSize();
    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(updateSize);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [isVisible]);

  const scale = Math.max(frameWidth / CANVAS_WIDTH, 0.1);

  return (
    <div
      ref={frameRef}
      className="relative h-full w-full overflow-hidden bg-[#e8eaee]"
      aria-hidden="true"
    >
      {!isVisible || sections.length === 0 ? (
        <div className="absolute inset-0 animate-pulse bg-slate-100" />
      ) : (
        <div
          className="pointer-events-none absolute left-1/2 top-0"
          style={{
            width: CANVAS_WIDTH,
            height: totalHeight,
            transform: `translateX(-50%) scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          {sections.map((section) => {
            const height = numericHeight(section.minHeight);
            return (
              <div
                key={`${page.id}-${section.id}`}
                style={{
                  width: CANVAS_WIDTH,
                  height,
                  position: "relative",
                  overflow: "hidden",
                  backgroundColor: section.backgroundColor || "#ffffff",
                }}
              >
                <SectionTemplateCanvasPreview
                  section={section}
                  theme={theme}
                  fit="none"
                  align="top"
                  forceVisible
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
