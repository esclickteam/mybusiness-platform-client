import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";

export type TheaterFilm = {
  src: string;
  poster: string;
  width: number;
  height: number;
  duration: number;
  chapters: { id: string; at: number; seek: number }[];
};

export type TheaterStep = { id: string; label: string; title: string; body: string };

type Labels = {
  region: string;
  play: string;
  pause: string;
  prev: string;
  next: string;
  step: string;
};

const MOBILE_QUERY = "(max-width: 760px)";

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

function chapterAt(film: TheaterFilm, time: number) {
  let index = 0;
  film.chapters.forEach((chapter, i) => {
    if (time + 0.05 >= chapter.at) index = i;
  });
  return index;
}

export default function ProductTheater({
  desktop,
  mobile,
  steps,
  labels,
  seekRequest,
}: {
  desktop: TheaterFilm;
  mobile: TheaterFilm;
  steps: TheaterStep[];
  labels: Labels;
  /** Bumped by "watch this step" links elsewhere on the page. */
  seekRequest?: { index: number; nonce: number } | null;
}) {
  const narrow = useMedia(MOBILE_QUERY);
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const film = narrow ? mobile : desktop;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const userPaused = useRef(false);
  const inView = useRef(false);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const activeRef = useRef(0);

  const paintProgress = useCallback(() => {
    const video = videoRef.current;
    const tabs = tabsRef.current;
    if (!video || !tabs) return;
    const time = video.currentTime;
    const index = chapterAt(film, time);
    const start = film.chapters[index].at;
    const end = film.chapters[index + 1]?.at ?? film.duration;
    const local = Math.min(1, Math.max(0, (time - start) / Math.max(0.1, end - start)));
    tabs.querySelectorAll<HTMLElement>("[data-step]").forEach((node, i) => {
      node.style.setProperty("--fill", i < index ? "1" : i === index ? local.toFixed(4) : "0");
    });
    if (index !== activeRef.current) {
      activeRef.current = index;
      setActive(index);
    }
  }, [film]);

  useEffect(() => {
    if (!playing) return undefined;
    let frame = 0;
    const loop = () => {
      paintProgress();
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [paintProgress, playing]);

  const play = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    void video.play().catch(() => setPlaying(false));
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    setReady(false);
    activeRef.current = 0;
    setActive(0);
    video.load();
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onLoaded = () => {
      setReady(true);
      paintProgress();
      if (inView.current && !userPaused.current && !reduced) play();
    };
    const onEnded = () => {
      video.currentTime = 0;
      if (!userPaused.current) play();
    };
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("loadeddata", onLoaded);
    video.addEventListener("ended", onEnded);
    video.addEventListener("timeupdate", paintProgress);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("timeupdate", paintProgress);
    };
  }, [film.src, paintProgress, play, reduced]);

  useEffect(() => {
    const node = rootRef.current;
    const video = videoRef.current;
    if (!node || !video) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = Boolean(entry?.isIntersecting);
        if (!inView.current) video.pause();
        else if (!userPaused.current && !reduced && video.readyState >= 2) play();
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [play, reduced]);

  const freezeFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return false;
    const rect = video.getBoundingClientRect();
    const scale = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.max(1, Math.round(rect.width * scale));
    canvas.height = Math.max(1, Math.round(rect.height * scale));
    const context = canvas.getContext("2d");
    if (!context) return false;
    try {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
    } catch {
      return false;
    }
    canvas.classList.remove("is-fading");
    canvas.classList.add("is-on");
    return true;
  }, []);

  const goTo = useCallback(
    (index: number, { resume = true }: { resume?: boolean } = {}) => {
      const video = videoRef.current;
      if (!video) return;
      const count = film.chapters.length;
      const next = ((index % count) + count) % count;
      const frozen = freezeFrame();
      const release = () => {
        const canvas = canvasRef.current;
        if (!canvas || !frozen) return;
        requestAnimationFrame(() => {
          canvas.classList.add("is-fading");
          canvas.classList.remove("is-on");
        });
      };
      video.addEventListener("seeked", release, { once: true });
      video.currentTime = film.chapters[next].seek;
      activeRef.current = next;
      setActive(next);
      paintProgress();
      if (resume) {
        userPaused.current = false;
        play();
      }
    },
    [film, freezeFrame, paintProgress, play],
  );

  useEffect(() => {
    if (!seekRequest) return;
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
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      play();
    } else {
      userPaused.current = true;
      video.pause();
    }
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
    goTo(target);
    tabsRef.current?.querySelector<HTMLButtonElement>(`[data-step="${target}"]`)?.focus();
  };

  const step = steps[active] || steps[0];

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
              onClick={() => goTo(index)}
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
      <div
        className={`ht-stage${ready ? " is-ready" : ""}`}
        id="ht-stage"
        role="tabpanel"
        aria-labelledby={`ht-tab-${step.id}`}
      >
        <img
          className="ht-poster"
          src={film.poster}
          alt=""
          width={film.width}
          height={film.height}
          fetchPriority="high"
          decoding="async"
        />
        <video
          ref={videoRef}
          className="ht-video"
          muted
          playsInline
          preload="auto"
          poster={film.poster}
          width={film.width}
          height={film.height}
          aria-label={labels.region}
          onClick={toggle}
        >
          <source src={film.src} type="video/mp4" />
        </video>
        <canvas ref={canvasRef} className="ht-freeze" aria-hidden="true" />
        {!playing && ready ? (
          <button type="button" className="ht-big-play" onClick={toggle} aria-label={labels.play}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path className="ht-fill" d="M8 5l11 7-11 7z" /></svg>
          </button>
        ) : null}
      </div>
      <div className="ht-caption" aria-live="polite">
        <p className="ht-caption-step">
          {labels.step.replace("{n}", String(active + 1)).replace("{total}", String(steps.length))}
        </p>
        <h3>{step.title}</h3>
        <p>{step.body}</p>
      </div>
    </div>
  );
}
