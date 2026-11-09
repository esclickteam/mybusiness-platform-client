import { useEffect, useRef, useState } from "react";

export type ProcessStep = {
  id: string;
  label: string;
  /** Start time in seconds within the continuous process film. */
  at: number;
};

type Props = {
  src: string;
  poster: string;
  /** Optional portrait / mobile-native film (preferred under 900px). */
  mobileSrc?: string;
  mobilePoster?: string;
  steps: ProcessStep[];
  /** Optional mobile chapter marks (used with mobileSrc). */
  mobileSteps?: ProcessStep[];
  className?: string;
  /** Accessible label for the process stage. */
  label: string;
  playLabel: string;
  pauseLabel: string;
  restartLabel: string;
  prevLabel: string;
  nextLabel: string;
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false,
  );
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(query.matches);
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);
  return reduced;
}

function useNarrowStage() {
  const [narrow, setNarrow] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 900px)").matches : false,
  );
  useEffect(() => {
    const query = window.matchMedia("(max-width: 900px)");
    const apply = () => setNarrow(query.matches);
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);
  return narrow;
}

/**
 * Continuous product process theater — no laptop/browser chrome.
 * Salesforce-style stage controls: play/pause, prev/next, restart, clickable steps.
 * Autoplays muted when in view (respects reduced-motion). No digital zoom/Ken Burns.
 */
export default function ProductProcessTheater({
  src,
  poster,
  mobileSrc,
  mobilePoster,
  steps,
  mobileSteps,
  className,
  label,
  playLabel,
  pauseLabel,
  restartLabel,
  prevLabel,
  nextLabel,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const narrow = useNarrowStage();
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [mobileFailed, setMobileFailed] = useState(false);

  const useMobileFilm = Boolean(narrow && mobileSrc && !mobileFailed);
  const filmSrc = useMobileFilm ? (mobileSrc as string) : src;
  const filmPoster = useMobileFilm && mobilePoster ? mobilePoster : poster;
  const portrait = useMobileFilm;
  const activeSteps = useMobileFilm && mobileSteps?.length ? mobileSteps : steps;

  useEffect(() => {
    const video = videoRef.current;
    const root = rootRef.current;
    if (!video || !root || reduced) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
          void video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
        } else {
          video.pause();
          setPlaying(false);
        }
      },
      { threshold: [0, 0.4, 0.75] },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [reduced, filmSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    const onTime = () => {
      const duration = video.duration || 1;
      setProgress(Math.min(1, video.currentTime / duration));
      let index = 0;
      for (let i = 0; i < activeSteps.length; i += 1) {
        if (video.currentTime + 0.08 >= activeSteps[i].at) index = i;
      }
      setActive((current) => (current === index ? current : index));
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onReady = () => setReady(true);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("loadeddata", onReady);
    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("loadeddata", onReady);
    };
  }, [activeSteps, filmSrc]);

  useEffect(() => {
    setReady(false);
    setActive(0);
    setProgress(0);
  }, [filmSrc]);

  const flashTransition = () => {
    if (reduced) return;
    setTransitioning(true);
    window.setTimeout(() => setTransitioning(false), 280);
  };

  const seekStep = (index: number) => {
    const video = videoRef.current;
    const step = activeSteps[index];
    if (!video || !step) return;
    flashTransition();
    video.currentTime = step.at;
    setActive(index);
    if (!reduced) {
      void video.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().then(() => setPlaying(true)).catch(() => {});
    else {
      video.pause();
      setPlaying(false);
    }
  };

  const restart = () => {
    seekStep(0);
  };

  const goPrev = () => {
    seekStep(Math.max(0, active - 1));
  };

  const goNext = () => {
    seekStep(Math.min(activeSteps.length - 1, active + 1));
  };

  return (
    <div
      ref={rootRef}
      className={className ? `hx-theater ${className}` : "hx-theater"}
      data-ready={ready ? "1" : "0"}
      data-portrait={portrait ? "1" : "0"}
      data-transitioning={transitioning ? "1" : "0"}
    >
      <div className="hx-theater-screen" role="region" aria-label={label}>
        <video
          key={filmSrc}
          ref={videoRef}
          className="hx-theater-video"
          src={filmSrc}
          poster={filmPoster}
          muted
          playsInline
          preload="metadata"
          loop
          onError={() => {
            if (useMobileFilm) setMobileFailed(true);
          }}
        />
        <div className="hx-theater-veil" aria-hidden="true" />
        <div className="hx-theater-flash" aria-hidden="true" />
        <div className="hx-theater-controls" role="group" aria-label={label}>
          <button type="button" className="hx-theater-btn hx-theater-btn-ghost" onClick={goPrev} aria-label={prevLabel}>
            {prevLabel}
          </button>
          <button type="button" className="hx-theater-btn" onClick={toggle} aria-label={playing ? pauseLabel : playLabel}>
            {playing ? pauseLabel : playLabel}
          </button>
          <button type="button" className="hx-theater-btn hx-theater-btn-ghost" onClick={goNext} aria-label={nextLabel}>
            {nextLabel}
          </button>
          <button type="button" className="hx-theater-btn hx-theater-btn-ghost" onClick={restart} aria-label={restartLabel}>
            {restartLabel}
          </button>
        </div>
      </div>
      <div className="hx-theater-track" aria-hidden="true">
        <span style={{ width: `${progress * 100}%` }} />
      </div>
      <ol className="hx-theater-steps">
        {activeSteps.map((step, index) => (
          <li key={step.id}>
            <button
              type="button"
              className={index === active ? "is-on" : undefined}
              aria-current={index === active ? "step" : undefined}
              onClick={() => seekStep(index)}
            >
              <em>{String(index + 1).padStart(2, "0")}</em>
              <span>{step.label}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
