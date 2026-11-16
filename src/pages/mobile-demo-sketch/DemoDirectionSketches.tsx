import { useState } from "react";
import { Helmet } from "react-helmet-async";
import "./demoDirectionSketches.css";

type Shot = {
  key: string;
  title: string;
  line: string;
  src: string;
  width: number;
  height: number;
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

const SHOWCASE_KEYS = ["site", "crm", "wa", "meta", "auto"];

function Window({ shot, index }: { shot: Shot; index: number }) {
  return (
    <article className="dd-window" style={{ ["--i" as string]: index }}>
      <header>
        <span className="dd-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <strong>{shot.title}</strong>
        <em>{shot.line}</em>
      </header>
      <img
        src={shot.src}
        alt=""
        width={shot.width}
        height={shot.height}
        loading="eager"
        decoding="async"
      />
    </article>
  );
}

function Stage({ shots, variant }: { shots: Shot[]; variant: "showcase" | "flow" }) {
  const loop = [...shots, ...shots];
  return (
    <div className={`dd-viewport is-${variant}`}>
      <div className="dd-track">
        {loop.map((shot, index) => (
          <Window key={`${shot.key}-${index}`} shot={shot} index={index % shots.length} />
        ))}
      </div>
      {variant === "showcase" ? <span className="dd-cursor" aria-hidden="true" /> : null}
    </div>
  );
}

export default function DemoDirectionSketches() {
  const [sketch, setSketch] = useState<"a" | "b">("a");
  const [paused, setPaused] = useState(false);
  const showcase = SHOWCASE_KEYS.map((key) => FLOW.find((shot) => shot.key === key)!);
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
            סקיצה A · חלונות יחד
          </button>
          <button type="button" role="tab" aria-selected={sketch === "b"} onClick={() => setSketch("b")}>
            סקיצה B · גלילה אנכית
          </button>
        </div>
      </header>
      <section className="dd-stage" aria-label={sketch === "a" ? "סקיצה A" : "סקיצה B"}>
        {sketch === "a" ? <Stage shots={showcase} variant="showcase" /> : <Stage shots={FLOW} variant="flow" />}
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
