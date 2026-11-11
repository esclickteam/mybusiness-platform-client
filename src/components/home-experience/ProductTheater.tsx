import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import ProductScene, { type SceneId } from "./ProductScenes";

export type TheaterStep = { id: string; label: string; title: string; body: string };

type Labels = {
  region: string;
  play: string;
  pause: string;
  prev: string;
  next: string;
  step: string;
};

const STEP_MS = 5600;
const SCENE: Record<string, SceneId> = {
  lead: "lead",
  crm: "crm",
  whatsapp: "whatsapp",
  task: "task",
  automation: "automation",
  done: "done",
};

function useMedia(query: string) {
  const [match, setMatch] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );
  useEffect(() => {
    const list = window.matchMedia(query);
    const apply = () => setMatch(list.matches);
    apply();
    list.addEventListener("change", apply);
    return () => list.removeEventListener("change", apply);
  }, [query]);
  return match;
}

export default function ProductTheater({
  steps,
  labels,
  seekRequest,
}: {
  steps: TheaterStep[];
  labels: Labels;
  /** Bumped by "watch this step" links elsewhere on the page. */
  seekRequest?: { index: number; nonce: number } | null;
}) {
  const { i18n } = useTranslation();
  const narrow = useMedia("(max-width: 760px)");
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const rootRef = useRef<HTMLDivElement | null>(null);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const userPaused = useRef(false);
  const inView = useRef(false);
  const activeRef = useRef(0);
  const startedAt = useRef(0);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const lang = (i18n.language || "en").toLowerCase().startsWith("he") ? "he" : "en";
  const poster = `/demo-media/home/theater/${lang}-${narrow ? "mobile" : "desktop"}.webp?v=t6`;

  const paint = useCallback((index: number, local: number) => {
    const tabs = tabsRef.current;
    if (!tabs) return;
    tabs.querySelectorAll<HTMLElement>("[data-step]").forEach((node, i) => {
      const fill = i < index ? 1 : i === index ? local : 0;
      node.style.setProperty("--fill", fill.toFixed(4));
    });
  }, []);

  const goTo = useCallback(
    (index: number, { resume = true }: { resume?: boolean } = {}) => {
      const count = steps.length || 1;
      const next = ((index % count) + count) % count;
      activeRef.current = next;
      setActive(next);
      startedAt.current = performance.now();
      paint(next, 0);
      if (resume && !reduced && inView.current && !userPaused.current) setPlaying(true);
    },
    [paint, reduced, steps.length],
  );

  useEffect(() => {
    if (!playing || reduced) return undefined;
    startedAt.current = performance.now();
    let frame = 0;
    const loop = (now: number) => {
      const local = Math.min(1, (now - startedAt.current) / STEP_MS);
      const index = activeRef.current;
      paint(index, local);
      if (local >= 1) {
        const next = (index + 1) % (steps.length || 1);
        activeRef.current = next;
        setActive(next);
        startedAt.current = now;
        paint(next, 0);
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [paint, playing, reduced, steps.length]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = Boolean(entry?.isIntersecting);
        if (!inView.current) setPlaying(false);
        else if (!userPaused.current && !reduced) setPlaying(true);
      },
      { threshold: 0.45 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (!seekRequest) return;
    userPaused.current = false;
    goTo(seekRequest.index);
  }, [goTo, seekRequest]);

  useEffect(() => {
    const tabs = tabsRef.current;
    const tab = tabs?.querySelector<HTMLElement>(`[data-step="${active}"]`);
    if (!tabs || !tab || tabs.scrollWidth <= tabs.clientWidth) return;
    const left = tab.offsetLeft - (tabs.clientWidth - tab.offsetWidth) / 2;
    tabs.scrollTo({ left, behavior: reduced ? "auto" : "smooth" });
  }, [active, reduced]);

  const toggle = () => {
    if (playing) {
      userPaused.current = true;
      setPlaying(false);
      return;
    }
    userPaused.current = false;
    setPlaying(true);
  };

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const forward = rtl ? "ArrowLeft" : "ArrowRight";
    const back = rtl ? "ArrowRight" : "ArrowLeft";
    let target = -1;
    if (event.key === forward) target = (index + 1) % steps.length;
    else if (event.key === back) target = (index - 1 + steps.length) % steps.length;
    else if (event.key === "Home") target = 0;
    else if (event.key === "End") target = steps.length - 1;
    if (target < 0) return;
    event.preventDefault();
    userPaused.current = false;
    goTo(target);
    tabsRef.current?.querySelector<HTMLButtonElement>(`[data-step="${target}"]`)?.focus();
  };

  const step = steps[active] || steps[0];
  const scene = SCENE[step?.id || "lead"] || "lead";

  return (
    <div className="ht-theater" ref={rootRef} role="region" aria-label={labels.region}>
      <div className="ht-bar">
        <div className="ht-tabs" ref={tabsRef} role="tablist" aria-label={labels.region}>
          {steps.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`ht-tab-${item.id}`}
              aria-selected={index === active}
              aria-controls="ht-stage"
              tabIndex={index === active ? 0 : -1}
              className={`ht-tab${index === active ? " is-active" : ""}${index < active ? " is-done" : ""}`}
              data-step={index}
              onClick={() => {
                userPaused.current = false;
                goTo(index);
              }}
              onKeyDown={(event) => onTabKey(event, index)}
            >
              <span className="ht-tab-num" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span className="ht-tab-label">{item.label}</span>
              <span className="ht-tab-fill" aria-hidden="true" />
            </button>
          ))}
        </div>
        <div className="ht-controls">
          <button type="button" className="ht-ctl" onClick={() => goTo(active - 1)} aria-label={labels.prev}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <button
            type="button"
            className="ht-ctl ht-ctl-main"
            onClick={toggle}
            aria-label={playing ? labels.pause : labels.play}
            aria-pressed={playing}
          >
            {playing ? (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path className="ht-fill" d="M8 5l11 7-11 7z" /></svg>
            )}
          </button>
          <button type="button" className="ht-ctl" onClick={() => goTo(active + 1)} aria-label={labels.next}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>
      </div>
      <div className="ht-stage is-ready" id="ht-stage" role="tabpanel" aria-labelledby={step ? `ht-tab-${step.id}` : undefined}>
        <img className="ps-hold" src={poster} alt="" width={16} height={16} decoding="async" />
        <ProductScene scene={scene} fit />
      </div>
      <div className="ht-caption" aria-live="polite">
        <p className="ht-caption-step">
          {labels.step.replace("{n}", String(active + 1)).replace("{total}", String(steps.length))}
        </p>
        <h3>{step?.title}</h3>
        <p>{step?.body}</p>
      </div>
    </div>
  );
}
