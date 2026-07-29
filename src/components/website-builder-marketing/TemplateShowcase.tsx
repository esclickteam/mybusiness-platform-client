import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LiveTemplateMockup from "./LiveTemplateMockup";
import {
  websiteHeroTemplates,
  type WebsiteHeroTemplate,
} from "./websiteHeroTemplates";

type Slot =
  | "center"
  | "near-start"
  | "near-end"
  | "far-start"
  | "far-end"
  | "back-start"
  | "back-end"
  | "hidden";

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
    case -3:
      return "back-start";
    case 3:
      return "back-end";
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
  const [warmed, setWarmed] = useState<Record<string, true>>(() => ({
    [templates[0]?.id]: true,
  }));
  const touchStartX = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const parallaxRef = useRef({ x: 0, y: 0 });
  const switchingTimer = useRef<number | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);

  const prefersReduced = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    setReducedMotion(prefersReduced);
  }, [prefersReduced]);

  const markSwitching = useCallback(() => {
    if (reducedMotion) return;
    setIsSwitching(true);
    if (switchingTimer.current != null) {
      window.clearTimeout(switchingTimer.current);
    }
    switchingTimer.current = window.setTimeout(() => {
      setIsSwitching(false);
      switchingTimer.current = null;
    }, 560);
  }, [reducedMotion]);

  const goTo = useCallback(
    (index: number) => {
      const nextIndex = wrapIndex(index, count);
      setActive((current) => {
        if (current === nextIndex) return current;
        markSwitching();
        return nextIndex;
      });
    },
    [count, markSwitching],
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    return () => {
      if (switchingTimer.current != null) {
        window.clearTimeout(switchingTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || count < 2) return;
    const id = window.setInterval(() => {
      setActive((value) => {
        markSwitching();
        return wrapIndex(value + 1, count);
      });
    }, 4200);
    return () => window.clearInterval(id);
  }, [paused, reducedMotion, count, markSwitching]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") next();
      if (event.key === "ArrowRight") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  useEffect(() => {
    const stage = stageRef.current;
    const wrap = stage?.parentElement;
    if (!stage || !wrap || reducedMotion) return;
    if (window.matchMedia("(max-width: 900px)").matches) return;

    const onMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      parallaxRef.current = {
        x: Math.max(-8, Math.min(8, px * 12)),
        y: Math.max(-6, Math.min(6, py * 8)),
      };
      wrap.style.setProperty("--px", `${parallaxRef.current.x}px`);
      wrap.style.setProperty("--py", `${parallaxRef.current.y}px`);
    };

    const onLeave = () => {
      wrap.style.setProperty("--px", "0px");
      wrap.style.setProperty("--py", "0px");
    };

    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, [reducedMotion]);

  const activeTemplate = templates[active];

  // Keep nearby slides warm so live swaps stay quick after first visit.
  useEffect(() => {
    const ids = [
      templates[active]?.id,
      templates[wrapIndex(active - 1, count)]?.id,
      templates[wrapIndex(active + 1, count)]?.id,
    ].filter(Boolean) as string[];

    setWarmed((prev) => {
      let changed = false;
      const nextMap = { ...prev };
      ids.forEach((id) => {
        if (!nextMap[id]) {
          nextMap[id] = true;
          changed = true;
        }
      });
      return changed ? nextMap : prev;
    });
  }, [active, count, templates]);

  useEffect(() => {
    const hero = stageRef.current?.closest(".wb-hero") as HTMLElement | null;
    if (!hero || !activeTemplate) return;
    hero.style.setProperty("--wb-stage-glow", activeTemplate.accent);
    hero.style.setProperty("--wb-stage-glow-soft", activeTemplate.accentSoft);
    hero.dataset.activeTemplate = activeTemplate.id;
  }, [activeTemplate]);

  return (
    <div
      className={`wb-hero__stage-wrap${isSwitching ? " is-switching" : ""}`}
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
          const nearby = Math.abs(offset) <= 1;
          const mountLive = Boolean(warmed[template.id] || nearby);
          return (
            <button
              key={template.id}
              type="button"
              className="wb-template"
              data-slot={slot}
              aria-label={`תבנית ${template.title} — ${template.category}`}
              aria-current={slot === "center" ? "true" : undefined}
              onClick={() => goTo(index)}
            >
              <LiveTemplateMockup
                templateId={template.id}
                title={template.title}
                accent={template.accent}
                accentSoft={template.accentSoft}
                isCenter={slot === "center"}
                mountLive={mountLive}
              />
            </button>
          );
        })}
      </div>

      <div className="wb-hero__controls">
        <button
          type="button"
          className="wb-hero__nav-btn"
          aria-label="תבנית קודמת"
          onClick={prev}
        >
          <ChevronRight size={18} />
        </button>

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

        <button
          type="button"
          className="wb-hero__nav-btn"
          aria-label="תבנית הבאה"
          onClick={next}
        >
          <ChevronLeft size={18} />
        </button>
      </div>
    </div>
  );
}
