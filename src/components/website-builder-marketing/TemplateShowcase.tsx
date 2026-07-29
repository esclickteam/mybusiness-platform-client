import React, { useCallback, useEffect, useRef, useState } from "react";
import TemplateBrowserMockup from "./TemplateBrowserMockup";
import {
  websiteHeroTemplates,
  type WebsiteHeroTemplate,
} from "./websiteHeroTemplates";

type Slot = "center" | "near-start" | "near-end" | "far-start" | "far-end" | "hidden";

function slotForOffset(offset: number): Slot {
  switch (offset) {
    case 0:
      return "center";
    case -1:
      return "near-start";
    case 1:
      return "near-end";
    case -2:
      return "far-start";
    case 2:
      return "far-end";
    default:
      return "hidden";
  }
}

function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

function shortestOffset(from: number, to: number, length: number) {
  let delta = to - from;
  if (delta > length / 2) delta -= length;
  if (delta < -length / 2) delta += length;
  return delta;
}

type Props = {
  templates?: WebsiteHeroTemplate[];
};

export default function TemplateShowcase({
  templates = websiteHeroTemplates,
}: Props) {
  const count = templates.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  useEffect(() => {
    templates.forEach((template) => {
      const img = new Image();
      img.decoding = "async";
      img.src = template.desktopImage;
    });
  }, [templates]);

  const goTo = useCallback(
    (index: number) => {
      setActive((current) => {
        const nextIndex = wrapIndex(index, count);
        return current === nextIndex ? current : nextIndex;
      });
    },
    [count],
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (paused || reducedMotion || count < 2) return;
    const id = window.setInterval(() => {
      setActive((value) => wrapIndex(value + 1, count));
    }, 4500);
    return () => window.clearInterval(id);
  }, [paused, reducedMotion, count]);

  const activeTemplate = templates[active];

  useEffect(() => {
    const hero = stageRef.current?.closest(".wb-hero") as HTMLElement | null;
    if (!hero || !activeTemplate) return;
    hero.style.setProperty("--wb-stage-glow", activeTemplate.accent);
    hero.style.setProperty("--wb-stage-glow-soft", activeTemplate.accentSoft);
  }, [activeTemplate]);

  return (
    <div
      className="wb-hero__stage-wrap"
      style={
        {
          "--wb-stage-glow": activeTemplate?.accent,
          "--wb-stage-glow-soft": activeTemplate?.accentSoft,
        } as React.CSSProperties
      }
    >
      <div className="wb-hero__stage-glow" aria-hidden="true">
        <span className="wb-hero__stage-glow-core" />
        <span className="wb-hero__stage-glow-ring" />
        <span className="wb-hero__stage-glow-floor" />
      </div>

      <div
        ref={stageRef}
        className={`wb-hero__stage${paused ? " is-paused" : ""}`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={(event) => {
          touchStartX.current = event.changedTouches[0]?.clientX ?? null;
          setPaused(true);
        }}
        onTouchEnd={(event) => {
          const start = touchStartX.current;
          const end = event.changedTouches[0]?.clientX;
          touchStartX.current = null;
          setPaused(false);
          if (start == null || end == null) return;
          const delta = end - start;
          if (Math.abs(delta) < 40) return;
          if (delta > 0) next();
          else prev();
        }}
        role="region"
        aria-roledescription="carousel"
        aria-label="תצוגת תבניות אתרים"
      >
        {templates.map((template, index) => {
          const offset = shortestOffset(active, index, count);
          const slot = slotForOffset(offset);
          return (
            <button
              key={template.id}
              type="button"
              className="wb-template"
              data-slot={slot}
              aria-label={`תבנית ${template.title} — ${template.category}`}
              aria-current={slot === "center" ? "true" : undefined}
              tabIndex={slot === "hidden" ? -1 : 0}
              onClick={() => goTo(index)}
            >
              <TemplateBrowserMockup
                src={template.desktopImage}
                title={template.title}
                accent={template.accent}
                accentSoft={template.accentSoft}
                priority={Math.abs(offset) <= 1}
                isCenter={slot === "center"}
              />
            </button>
          );
        })}
      </div>

      <div className="wb-hero__dots-nav" role="tablist" aria-label="בחירת תבנית">
        {templates.map((template, index) => (
          <button
            key={template.id}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-label={template.title}
            className={`wb-hero__dot${index === active ? " is-active" : ""}`}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </div>
  );
}
