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
  steps: ProcessStep[];
  className?: string;
  /** Accessible label for the process stage. */
  label: string;
  playLabel: string;
  pauseLabel: string;
  restartLabel: string;
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

/**
 * Continuous product process theater — no laptop/browser chrome.
 * Autoplays muted when in view (respects reduced-motion). Steps seek the film.
 */
export default function ProductProcessTheater({
  src,
  poster,
  steps,
  className,
  label,
  playLabel,
  pauseLabel,
  restartLabel,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const root = rootRef.current;
    if (!video || !root || reduced) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
          void video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
        } else {
          video.pause();
          setPlaying(false);
        }
      },
      { threshold: [0, 0.45, 0.75] },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [reduced, src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    const onTime = () => {
      const duration = video.duration || 1;
      setProgress(Math.min(1, video.currentTime / duration));
      let index = 0;
      for (let i = 0; i < steps.length; i += 1) {
        if (video.currentTime + 0.05 >= steps[i].at) index = i;
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
  }, [steps]);

  const seekStep = (index: number) => {
    const video = videoRef.current;
    const step = steps[index];
    if (!video || !step) return;
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
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    setActive(0);
    if (!reduced) void video.play().then(() => setPlaying(true)).catch(() => {});
  };

  return (
    <div
      ref={rootRef}
      className={className ? `hx-theater ${className}` : "hx-theater"}
      data-ready={ready ? "1" : "0"}
    >
      <div className="hx-theater-screen" role="region" aria-label={label}>
        <video
          ref={videoRef}
          className="hx-theater-video"
          src={src}
          poster={poster}
          muted
          playsInline
          preload="metadata"
          loop
        />
        <div className="hx-theater-veil" aria-hidden="true" />
        <div className="hx-theater-controls">
          <button type="button" className="hx-theater-btn" onClick={toggle} aria-label={playing ? pauseLabel : playLabel}>
            {playing ? pauseLabel : playLabel}
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
        {steps.map((step, index) => (
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
