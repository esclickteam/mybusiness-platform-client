import { useEffect, useId, useRef, useState, type PointerEvent, type ReactElement, type ReactNode, type RefObject, type TransitionEvent } from "react";
import { Helmet } from "react-helmet-async";
import "./demoUxSketches.css";

type Sketch = {
  id: string;
  title: string;
  change: string;
  Screen: () => ReactElement;
};

function Board({ className, children }: { className: string; children: ReactNode }) {
  return <div className={`ux2-board ${className}`}>{children}</div>;
}

function DashboardScreen() {
  const raw = useId().replace(/:/g, "");
  return (
    <Board className="ux2-dash">
      <div className="ux2-kpis">
        <p><b dir="ltr">128</b><span>לידים</span><em dir="ltr">+18%</em></p>
        <p><b dir="ltr">41%</b><span>המרה</span><em dir="ltr">+6%</em></p>
        <p><b dir="ltr">₪186K</b><span>הכנסה</span><em dir="ltr">+12%</em></p>
        <p><b dir="ltr">23</b><span>משימות</span><em>פתוחות</em></p>
      </div>
      <div className="ux2-chart">
        <svg viewBox="0 0 240 72" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id={`d${raw}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7c3aed" stopOpacity="0.38" />
              <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 52 C28 50 38 30 62 32 S104 58 132 28 S176 10 210 16 S232 22 240 14 V72 H0 Z" fill={`url(#d${raw})`} />
          <path d="M0 52 C28 50 38 30 62 32 S104 58 132 28 S176 10 210 16 S232 22 240 14" fill="none" stroke="#6d28d9" strokeWidth="2.4" />
          <circle cx="210" cy="16" r="3.2" fill="#fff" stroke="#6d28d9" strokeWidth="2" />
        </svg>
        <ol>
          <li>א׳</li><li>ב׳</li><li>ג׳</li><li>ד׳</li><li>ה׳</li><li>ו׳</li><li>ש׳</li>
        </ol>
      </div>
      <ul className="ux2-feed">
        <li><i>ת</i><b>תמר לוי</b><span>ליד חדש מ־Meta</span><em>עכשיו</em></li>
        <li><i>ד</i><b>דניאל כהן</b><span>פגישה נקבעה</span><em>14:30</em></li>
        <li><i>נ</i><b>נועה ברק</b><span>עסקה נסגרה</span><em>אתמול</em></li>
      </ul>
    </Board>
  );
}

function CrmPipelineScreen() {
  const stages = [
    { name: "חדש", lead: "תמר לוי", value: "₪4,800" },
    { name: "בטיפול", lead: "דניאל כהן", value: "₪6,200" },
    { name: "פגישה", lead: "נועה ברק", value: "₪8,900" },
  ];
  return (
    <Board className="ux2-crm-a">
      <p className="ux2-crm-metric"><b dir="ltr">₪86K</b><span>בצנרת</span></p>
      {stages.map((stage) => (
        <p key={stage.name}>
          <em>{stage.name}</em>
          <b>{stage.lead}</b>
          <span dir="ltr">{stage.value}</span>
        </p>
      ))}
    </Board>
  );
}

function CrmLeadScreen() {
  return (
    <Board className="ux2-crm-b">
      <ol>
        <li>חדש</li>
        <li className="is-on">בטיפול</li>
        <li>פגישה</li>
      </ol>
      <article>
        <header><b>תמר לוי</b><em>בטיפול</em></header>
        <p>מקור · Meta</p>
        <strong dir="ltr">₪4,800</strong>
        <footer><span>הפעולה הבאה</span><b>שיחת WhatsApp</b></footer>
      </article>
    </Board>
  );
}

function WhatsAppScreen() {
  return (
    <Board className="ux2-wa">
      <aside>
        <strong>שיחות</strong>
        <p className="is-on"><i>ת</i><b>תמר לוי</b><span>10:30 מושלם</span><em>2</em></p>
        <p><i>ד</i><b>דניאל כהן</b><span>קיבלתי את ההצעה</span></p>
        <p><i>נ</i><b>נועה ברק</b><span>תודה, נסגר</span></p>
      </aside>
      <section>
        <header><i>ת</i><b>תמר לוי</b><span>מחוברת · Meta</span></header>
        <div className="ux2-thread">
          <p>יש תור השבוע?</p>
          <p className="out">מחר ב־10:30.</p>
          <p>מתאים לי</p>
          <p className="out">קבעתי, אישור נשלח.</p>
        </div>
        <div className="ux2-compose"><span>הודעה</span><b>↑</b></div>
      </section>
    </Board>
  );
}

function AutomationScreen() {
  return (
    <Board className="ux2-auto">
      <div className="ux2-auto-top">
        <b>ליד ממודעה</b>
        <em>פעיל</em>
        <span>128 היום · 96%</span>
      </div>
      <div className="ux2-flow" dir="ltr">
        <p className="n-task"><small>פעולה</small><b>משימה</b></p>
        <p className="n-if"><small>תנאי</small><b dir="ltr">₪2,000+</b></p>
        <p className="n-trigger"><small>טריגר</small><b>ליד חדש</b></p>
        <p className="n-wa"><small>פעולה</small><b>WhatsApp</b></p>
      </div>
    </Board>
  );
}

function MetaScreen() {
  const raw = useId().replace(/:/g, "");
  return (
    <Board className="ux2-meta">
      <div className="ux2-meta-top">
        <b>לידים · תל אביב</b>
        <em>פעיל</em>
      </div>
      <div className="ux2-metrics">
        <p><b dir="ltr">₪4,820</b><span>הוצאה</span></p>
        <p><b dir="ltr">186K</b><span>חשיפות</span></p>
        <p><b dir="ltr">4.8%</b><span>CTR</span></p>
        <p><b dir="ltr">312</b><span>לידים</span></p>
      </div>
      <svg viewBox="0 0 244 70" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={`m${raw}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2563eb" stopOpacity="0.35" />
            <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[18, 36, 54].map((y) => <line key={y} x1="0" y1={y} x2="244" y2={y} stroke="#e4e0f2" strokeWidth="1" />)}
        <path d="M0 54 C30 50 46 40 70 38 S118 46 146 24 S190 8 244 16 V70 H0 Z" fill={`url(#m${raw})`} />
        <path d="M0 54 C30 50 46 40 70 38 S118 46 146 24 S190 8 244 16" fill="none" stroke="#2563eb" strokeWidth="2.4" />
      </svg>
      <ul>
        <li><b>מודעת קוסמטיקה</b><span /><em dir="ltr">₪2,140</em></li>
        <li><b>מודעת פגישת היכרות</b><span /><em dir="ltr">₪1,680</em></li>
      </ul>
    </Board>
  );
}

function SiteScreen() {
  return (
    <Board className="ux2-site">
      <div className="ux2-editor">
        <b>Petaluxe</b>
        <span>עריכה</span>
        <span className="is-on">תצוגה</span>
        <span>פרסום</span>
      </div>
      <img src="/template-screenshots/petaluxe.webp" alt="תבנית האתר Petaluxe" />
      <p>גלריה · 12</p>
    </Board>
  );
}

const SKETCHES: Sketch[] = [
  {
    id: "dash",
    title: "לוח בקרה",
    change: "ארבעה מדדים, גרף שבועי ושלוש פעולות אחרונות ממלאים את החלון. אין כרטיס יחיד עם שטח ריק.",
    Screen: DashboardScreen,
  },
  {
    id: "crm-a",
    title: "CRM · צינור",
    change: "חלופה A. שלושה שלבים, כרטיס ליד אחד בכל שלב, ומדד אחד: הסכום בצנרת.",
    Screen: CrmPipelineScreen,
  },
  {
    id: "crm-b",
    title: "CRM · כרטיס",
    change: "חלופה B. ליד אחד בולט עם סטטוס, שווי והפעולה הבאה, ומעליו שלבי המכירה.",
    Screen: CrmLeadScreen,
  },
  {
    id: "wa",
    title: "WhatsApp",
    change: "רשימת שיחות לצד שיחה פתוחה: כותרת לקוח, בועות ושורת מענה. זה ממשק, לא הודעה בודדת.",
    Screen: WhatsAppScreen,
  },
  {
    id: "auto",
    title: "אוטומציות",
    change: "תרשים על קנבס: טריגר, תנאי ושני ענפי פעולה מחוברים בקווים, לא ערימת קופסאות.",
    Screen: AutomationScreen,
  },
  {
    id: "meta",
    title: "קמפיינים",
    change: "קמפיין פעיל עם הוצאה, חשיפות, CTR, לידים וגרף מגמה. שתי מודעות סוגרות את החלון.",
    Screen: MetaScreen,
  },
  {
    id: "site",
    title: "בניית אתרים",
    change: "תבנית אמיתית מהמוצר, עם סרגל עריכה, תצוגה ופרסום. התמונה ממלאת את החלון.",
    Screen: SiteScreen,
  },
];

function useCarouselMotion(
  viewportRef: RefObject<HTMLDivElement | null>,
  trackRef: RefObject<HTMLDivElement | null>,
  count: number,
  paused: boolean,
) {
  const drag = useRef({ x: 0, active: false });
  const [index, setIndex] = useState(1);
  const [animate, setAnimate] = useState(true);
  const [dragX, setDragX] = useState(0);
  const [metrics, setMetrics] = useState({ view: 0, widths: [] as number[] });
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);

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
      const widths = [...node.querySelectorAll<HTMLElement>(".ux2-slide")].map((slide) => slide.offsetWidth);
      setMetrics({ view: node.clientWidth, widths });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [count, viewportRef]);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [viewportRef]);

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

  function onTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (event.target !== trackRef.current || event.propertyName !== "transform") return;
    if (index === count + 1) {
      setAnimate(false);
      setIndex(1);
    } else if (index === 0) {
      setAnimate(false);
      setIndex(count);
    }
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    drag.current = { x: event.clientX, active: true };
    event.currentTarget.setPointerCapture(event.pointerId);
    setAnimate(false);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return;
    setDragX(event.clientX - drag.current.x);
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return;
    const dx = event.clientX - drag.current.x;
    if (dx <= -42) commit(index + 1);
    else if (dx >= 42) commit(index - 1);
    else commit(index);
  }

  const center = metrics.widths.slice(0, index).reduce((sum, width) => sum + width, 0) + (metrics.widths[index] || 0) / 2;
  const shift = metrics.widths.length === 0 ? 0 : metrics.view / 2 - center + dragX;

  return {
    index,
    animate,
    shift,
    onTransitionEnd,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    jump(next: number) {
      setAnimate(true);
      setIndex(next);
    },
  };
}

function WindowFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="ux2-window">
      <header>
        <span><i /><i /><i /></span>
        <strong>{title}</strong>
      </header>
      {children}
    </article>
  );
}

export default function DemoUxSketches() {
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState(SKETCHES[0].id);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slides = [SKETCHES[SKETCHES.length - 1], ...SKETCHES, SKETCHES[0]];
  const motion = useCarouselMotion(viewportRef, trackRef, SKETCHES.length, paused);
  const active = SKETCHES[(motion.index - 1 + SKETCHES.length) % SKETCHES.length];
  const chosen = SKETCHES.find((sketch) => sketch.id === selected) || SKETCHES[0];
  const Chosen = chosen.Screen;

  return (
    <main className="ux2-page" lang="he" dir="rtl">
      <Helmet>
        <title>סקיצות UX לחלונות ההדגמה | BizUply</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <header className="ux2-intro">
        <p>BizUply</p>
        <h1>שתי חלופות ל־CRM</h1>
        <p>חמש הסקיצות שאושרו נשארו כמו שהן. ל־CRM יש שתי חלופות בתוך אותה קרוסלה: צינור נקי, או כרטיס לקוח מרכזי.</p>
      </header>

      <section className="ux2-stage" aria-label="תצוגה בתוך הקרוסלה">
        <div
          className="ux2-viewport"
          ref={viewportRef}
          dir="ltr"
          onPointerDown={motion.onPointerDown}
          onPointerMove={motion.onPointerMove}
          onPointerUp={motion.onPointerUp}
          onPointerCancel={motion.onPointerUp}
        >
          <div
            className="ux2-track"
            ref={trackRef}
            data-animate={motion.animate ? "true" : "false"}
            onTransitionEnd={motion.onTransitionEnd}
            style={{ transform: `translateX(${motion.shift}px)` }}
          >
            {slides.map((sketch, position) => {
              const Screen = sketch.Screen;
              return (
                <div className={position === motion.index ? "ux2-slide is-active" : "ux2-slide"} key={`${sketch.id}-${position}`}>
                  <WindowFrame title={sketch.title}>
                    <Screen />
                  </WindowFrame>
                </div>
              );
            })}
          </div>
        </div>
        <p className="ux2-caption">{active.title}</p>
        <button type="button" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
          {paused ? "הפעלה" : "השהיה"}
        </button>
      </section>

      <div className="ux2-tabs" role="tablist" aria-label="בחירת מסך">
        {SKETCHES.map((sketch, position) => (
          <button
            key={sketch.id}
            type="button"
            role="tab"
            aria-selected={selected === sketch.id}
            onClick={() => {
              setSelected(sketch.id);
              motion.jump(position + 1);
            }}
          >
            {sketch.title}
          </button>
        ))}
      </div>

      <section className="ux2-detail" aria-label={chosen.title}>
        <div className="ux2-stage ux2-still">
          <WindowFrame title={chosen.title}>
            <Chosen />
          </WindowFrame>
        </div>
        <h2>{chosen.title}</h2>
        <p>{chosen.change}</p>
      </section>
    </main>
  );
}
