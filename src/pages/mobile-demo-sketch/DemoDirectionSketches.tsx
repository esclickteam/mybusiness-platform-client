import { useState } from "react";
import { Helmet } from "react-helmet-async";
import "./demoDirectionSketches.css";

const SCREENS = {
  dash: "/demo-direction/dash.png",
  crm: "/demo-direction/crm.png",
  lead: "/demo-direction/lead.png",
  wa: "/demo-direction/wa.png",
  auto: "/demo-direction/auto.png",
  meta: "/demo-direction/meta.png",
  site: "/demo-direction/site.png",
} as const;

type Shot = { key: string; title: string; src: string; alt: string };

const FLOW: Shot[] = [
  { key: "dash", title: "לוח בקרה", src: SCREENS.dash, alt: "מדדי לוח הבקרה של חשבון ההדגמה" },
  { key: "crm", title: "לידים ולקוחות", src: SCREENS.crm, alt: "כרטיסי לידים אמיתיים" },
  { key: "lead", title: "כרטיס ליד", src: SCREENS.lead, alt: "כרטיס הליד של תמר לוי" },
  { key: "wa", title: "WhatsApp", src: SCREENS.wa, alt: "הודעת וואטסאפ לדוגמה" },
  { key: "auto", title: "אוטומציה", src: SCREENS.auto, alt: "פעולה בתוך תהליך אוטומציה" },
  { key: "meta", title: "קמפיינים", src: SCREENS.meta, alt: "מדדי קמפיין Meta" },
  { key: "site", title: "בניית אתר", src: SCREENS.site, alt: "תבנית אתר אמיתית" },
];

function Board({ shot, className = "" }: { shot: Shot; className?: string }) {
  return (
    <figure className={`dd-board ${className}`.trim()}>
      <figcaption>{shot.title}</figcaption>
      <img src={shot.src} alt={shot.alt} />
    </figure>
  );
}

function Showcase() {
  return (
    <div className="dd-collage" aria-hidden="false">
      <Board shot={FLOW[1]} className="is-wide" />
      <Board shot={FLOW[3]} />
      <Board shot={FLOW[5]} className="is-meta" />
      <Board shot={FLOW[6]} className="is-site" />
      <Board shot={FLOW[4]} className="is-auto" />
      <span className="dd-cursor" aria-hidden="true" />
    </div>
  );
}

function Flow() {
  const cards = [...FLOW, ...FLOW];
  return (
    <div className="dd-viewport">
      <div className="dd-track">
        {cards.map((shot, index) => (
          <Board key={`${shot.key}-${index}`} shot={shot} />
        ))}
      </div>
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
        <p className="dd-note">חלונות אמיתיים מחשבון ההדגמה. זו סקיצה לבחירה, לא הסרטון הסופי.</p>
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
        {sketch === "a" ? <Showcase /> : <Flow />}
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
