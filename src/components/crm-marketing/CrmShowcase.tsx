import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CrmBrowserMockup from "./CrmBrowserMockup";
import { crmShowcaseScreens } from "./crmShowcaseData";

type Slot = "center" | "near-start" | "near-end" | "hidden";

function slotForOffset(offset: number): Slot {
  if (offset === 0) return "center";
  if (offset === -1) return "near-start";
  if (offset === 1) return "near-end";
  return "hidden";
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

export default function CrmShowcase() {
  const screens = crmShowcaseScreens;
  const count = screens.length;
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
    }, 4200);
    return () => window.clearInterval(id);
  }, [paused, reducedMotion, count]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") next();
      if (event.key === "ArrowRight") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const activeScreen = screens[active];

  useEffect(() => {
    const hero = stageRef.current?.closest(".crm-hero") as HTMLElement | null;
    if (!hero || !activeScreen) return;
    hero.style.setProperty("--crm-stage-glow", activeScreen.accent);
    hero.style.setProperty("--crm-stage-glow-soft", activeScreen.accentSoft);
  }, [activeScreen]);

  return (
    <div
      className="crm-hero__stage-wrap"
      style={
        {
          "--crm-stage-glow": activeScreen?.accent,
          "--crm-stage-glow-soft": activeScreen?.accentSoft,
        } as React.CSSProperties
      }
    >
      <div className="crm-hero__stage-glow" aria-hidden="true">
        <span className="crm-hero__stage-glow-core" />
        <span className="crm-hero__stage-glow-ring" />
        <span className="crm-hero__stage-glow-floor" />
      </div>

      <div
        ref={stageRef}
        className={`crm-hero__stage${paused ? " is-paused" : ""}`}
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
        aria-label="תצוגת מסכי CRM"
      >
        {screens.map((screen, index) => {
          const offset = shortestOffset(active, index, count);
          const slot = slotForOffset(offset);
          return (
            <button
              key={screen.id}
              type="button"
              className="crm-slide"
              data-slot={slot}
              aria-label={`${screen.title} — ${screen.label}`}
              aria-current={slot === "center" ? "true" : undefined}
              tabIndex={slot === "hidden" ? -1 : 0}
              onClick={() => goTo(index)}
            >
              <CrmBrowserMockup
                screenId={screen.id}
                title={screen.title}
                accent={screen.accent}
                accentSoft={screen.accentSoft}
                isCenter={slot === "center"}
              />
            </button>
          );
        })}
      </div>

      <div className="crm-hero__caption">
        <strong>{activeScreen?.title}</strong>
        <span>{activeScreen?.label}</span>
      </div>

      <div className="crm-hero__controls">
        <button
          type="button"
          className="crm-hero__nav-btn"
          aria-label="מסך קודם"
          onClick={prev}
        >
          <ChevronRight size={18} />
        </button>

        <div className="crm-hero__dots-nav" role="tablist" aria-label="בחירת מסך CRM">
          {screens.map((screen, index) => (
            <button
              key={screen.id}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={screen.title}
              className={`crm-hero__dot${index === active ? " is-active" : ""}`}
              onClick={() => goTo(index)}
            />
          ))}
        </div>

        <button
          type="button"
          className="crm-hero__nav-btn"
          aria-label="מסך הבא"
          onClick={next}
        >
          <ChevronLeft size={18} />
        </button>
      </div>
    </div>
  );
}
