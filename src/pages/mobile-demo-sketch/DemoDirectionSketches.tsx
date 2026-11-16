import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import { Helmet } from "react-helmet-async";
import { PRODUCT_SCREENS } from "./DemoUxSketches";
import "./demoDirectionSketches.css";

type Shot = {
  key: string;
  title: string;
  line: string;
  src: string;
  width: number;
  height: number;
  Screen?: () => ReactElement;
};

const screen = (file: string) => new URL(`./screens/${file}`, import.meta.url).href;

const FLOW: Shot[] = [
  { key: "dash", title: "לוח בקרה", line: "13 לידים חדשים", src: screen("dash.png"), width: 360, height: 374 },
  { key: "crm", title: "לידים ולקוחות", line: "תמר לוי · הילה גולן", src: screen("crm.png"), width: 360, height: 420 },
  { key: "lead", title: "כרטיס ליד", line: "תמר לוי · 052-5552266", src: screen("lead.png"), width: 360, height: 520 },
  { key: "wa", title: "WhatsApp", line: "הודעה שנשלחה ללקוח", src: screen("wa.png"), width: 360, height: 240 },
  { key: "auto", title: "אוטומציה", line: "העברה לכרטיס הלקוח", src: screen("auto.png"), width: 360, height: 260 },
  { key: "meta", title: "קמפיינים", line: "18,211 חשיפות", src: screen("meta.png"), width: 360, height: 250 },
  { key: "site", title: "בניית אתר", line: "תבנית Spalcio", src: screen("site.png"), width: 360, height: 490 },
];

const LIVE: Shot[] = PRODUCT_SCREENS.map((item) => ({
  key: item.key,
  title: item.title,
  line: "",
  src: "",
  width: 260,
  height: 220,
  Screen: item.Screen,
}));

function Window({ shot, index }: { shot: Shot; index: number }) {
  const Screen = shot.Screen;
  return (
    <article className="dd-window" dir="rtl" style={{ ["--i" as string]: index }}>
      <header>
        <span className="dd-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <strong>{shot.title}</strong>
        <em>{shot.line}</em>
      </header>
      {Screen ? (
        <Screen />
      ) : (
        <img
          src={shot.src}
          alt=""
          width={shot.width}
          height={shot.height}
          loading="eager"
          decoding="async"
        />
      )}
    </article>
  );
}

function Stage({ shots }: { shots: Shot[] }) {
  const loop = [...shots, ...shots];
  return (
    <div className="dd-viewport is-flow">
      <div className="dd-track">
        {loop.map((shot, index) => (
          <Window key={`${shot.key}-${index}`} shot={shot} index={index % shots.length} />
        ))}
      </div>
    </div>
  );
}

function HorizontalShowcase({ shots, paused }: { shots: Shot[]; paused: boolean }) {
  const count = shots.length;
  const slides = useMemo(() => [shots[count - 1], ...shots, shots[0]], [shots, count]);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ x: 0, active: false });
  const [index, setIndex] = useState(1);
  const [animate, setAnimate] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [metrics, setMetrics] = useState({ view: 0, widths: [] as number[] });

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;
    const measure = () => {
      const widths = [...node.querySelectorAll<HTMLElement>(".dd-h-slide")].map((slide) => slide.offsetWidth);
      setMetrics({ view: node.clientWidth, widths });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused || reduced || !visible || metrics.widths.length === 0) return;
    const timer = window.setTimeout(() => {
      setAnimate(true);
      setIndex((value) => value + 1);
    }, 1900);
    return () => window.clearTimeout(timer);
  }, [paused, reduced, visible, index, metrics.widths.length]);

  function commit(next: number) {
    drag.current.active = false;
    setDragX(0);
    setAnimate(true);
    setIndex(next);
  }

  function onTransitionEnd(event: React.TransitionEvent<HTMLDivElement>) {
    if (event.target !== trackRef.current || event.propertyName !== "transform") return;
    if (index === slides.length - 1) {
      setAnimate(false);
      setIndex(1);
    } else if (index === 0) {
      setAnimate(false);
      setIndex(count);
    }
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    drag.current = { x: event.clientX, active: true };
    event.currentTarget.setPointerCapture(event.pointerId);
    setAnimate(false);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return;
    setDragX(event.clientX - drag.current.x);
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return;
    const dx = event.clientX - drag.current.x;
    if (dx <= -42) commit(index + 1);
    else if (dx >= 42) commit(index - 1);
    else commit(index);
  }

  const center = metrics.widths.slice(0, index).reduce((sum, width) => sum + width, 0) + (metrics.widths[index] || 0) / 2;
  const shift = metrics.widths.length === 0 ? 0 : metrics.view / 2 - center + dragX;
  const activeShot = slides[index];

  return (
    <div
      className="dd-h-viewport"
      ref={viewportRef}
      dir="ltr"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div
        className="dd-h-track"
        ref={trackRef}
        data-animate={animate ? "true" : "false"}
        onTransitionEnd={onTransitionEnd}
        style={{ transform: `translateX(${shift}px)` }}
      >
        {slides.map((shot, position) => (
          <div
            className={position === index ? "dd-h-slide is-active" : "dd-h-slide"}
            key={`${shot.key}-${position}`}
            aria-hidden={position !== index}
            style={{ ["--ratio" as string]: shot.width / shot.height }}
          >
            <Window shot={shot} index={position} />
          </div>
        ))}
      </div>
      <p className="dd-h-caption">{activeShot.title}</p>
    </div>
  );
}

export function MobileProductRow() {
  const [paused, setPaused] = useState(false);
  return (
    <div className="dd-stage dd-home">
      <HorizontalShowcase shots={LIVE} paused={paused} />
      <button
        type="button"
        className="dd-pause"
        aria-pressed={paused}
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? "הפעלה" : "השהיה"}
      </button>
    </div>
  );
}

export default function DemoDirectionSketches() {
  const [sketch, setSketch] = useState<"a" | "b">("a");
  const [paused, setPaused] = useState(false);
  return (
    <main className="dd-page" data-paused={paused ? "true" : "false"} lang="he" dir="rtl">
      <Helmet>
        <title>סקיצות להדגמת המוצר | BizUply</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <header className="dd-top">
        <p className="dd-brand">BizUply</p>
        <h1>שתי סקיצות להדגמה</h1>
        <p className="dd-note">מסכים אמיתיים מחשבון ההדגמה. סקיצה לבחירה, לא הסרטון הסופי.</p>
        <div className="dd-switch" role="tablist" aria-label="בחירת סקיצה">
          <button type="button" role="tab" aria-selected={sketch === "a"} onClick={() => setSketch("a")}>
            סקיצה A · תצוגה אופקית
          </button>
          <button type="button" role="tab" aria-selected={sketch === "b"} onClick={() => setSketch("b")}>
            סקיצה B · גלילה אנכית
          </button>
        </div>
      </header>
      <section className="dd-stage" aria-label={sketch === "a" ? "סקיצה A" : "סקיצה B"}>
        {sketch === "a" ? <HorizontalShowcase shots={FLOW} paused={paused} /> : <Stage shots={FLOW} />}
      </section>
      <button
        type="button"
        className="dd-pause"
        aria-pressed={paused}
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? "הפעלה" : "השהיה"}
      </button>
    </main>
  );
}
