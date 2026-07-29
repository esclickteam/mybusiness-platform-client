import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  CheckCircle2,
  Layers,
  Monitor,
  MousePointer2,
  Redo2,
  Rocket,
  Smartphone,
  Tablet,
  Undo2,
} from "lucide-react";
import "./WebsiteStudioSimulator.css";

const EASE = [0.22, 1, 0.36, 1] as const;

type StepId = "select" | "design" | "reorder" | "device" | "publish";

type Step = {
  id: StepId;
  label: string;
  hint: string;
  /** Where the ghost cursor parks, in % of the studio frame. */
  cursor: { x: number; y: number };
  ms: number;
};

const STEPS: Step[] = [
  {
    id: "select",
    label: "בוחרים סקשן",
    hint: "לחיצה על אלמנט פותחת סרגל עריכה צף",
    cursor: { x: 50, y: 34 },
    ms: 2600,
  },
  {
    id: "design",
    label: "משנים עיצוב",
    hint: "לשונית עיצוב — צבעים, טיפוגרפיה ומרווחים",
    cursor: { x: 11, y: 42 },
    ms: 3000,
  },
  {
    id: "reorder",
    label: "מסדרים מחדש",
    hint: "גרירה של סקשנים ועמודים בפאנל השכבות",
    cursor: { x: 89, y: 50 },
    ms: 3000,
  },
  {
    id: "device",
    label: "בודקים במובייל",
    hint: "מעבר בין דסקטופ, טאבלט ומובייל",
    cursor: { x: 50, y: 13 },
    ms: 2800,
  },
  {
    id: "publish",
    label: "מפרסמים",
    hint: "האתר עולה לכתובת שלכם ב־sites.bizuply.com",
    cursor: { x: 87, y: 13 },
    ms: 3200,
  },
];

const INSPECTOR_TABS = [
  "תוכן",
  "עיצוב",
  "פריסה",
  "מדיה",
  "תנועה",
  "מתקדם",
] as const;

const TAB_BY_STEP: Record<StepId, number> = {
  select: 0,
  design: 1,
  reorder: 2,
  device: 2,
  publish: 5,
};

type SectionId = "hero" | "services" | "gallery" | "form";

const SECTION_LABEL: Record<SectionId, string> = {
  hero: "כותרת ראשית",
  services: "שירותים",
  gallery: "גלריה",
  form: "טופס לידים",
};

const BASE_ORDER: SectionId[] = ["hero", "services", "gallery", "form"];
const REORDERED: SectionId[] = ["hero", "gallery", "services", "form"];

const PALETTE = ["#7c3aed", "#e11d8c", "#0891b2", "#f59e0b"];

export default function WebsiteStudioSimulator() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const id = window.setTimeout(() => {
      setIndex((value) => {
        const next = value + 1;
        if (next >= STEPS.length) {
          setCycle((c) => c + 1);
          return 0;
        }
        return next;
      });
    }, STEPS[index].ms);
    return () => window.clearTimeout(id);
  }, [inView, reduceMotion, index]);

  const step = STEPS[index];
  const reached = (id: StepId) => STEPS.findIndex((s) => s.id === id) <= index;

  const accent = useMemo(
    () => (reached("design") ? PALETTE[(cycle + 1) % PALETTE.length] : PALETTE[0]),
    [cycle, index],
  );

  const order = reached("reorder") ? REORDERED : BASE_ORDER;
  const device: "desktop" | "tablet" | "mobile" = reached("device")
    ? "mobile"
    : "desktop";
  const published = step.id === "publish";
  const selected: SectionId = reached("reorder") ? "gallery" : "hero";

  return (
    <div
      className="wbs"
      ref={ref}
      style={{ "--wbs-accent": accent } as React.CSSProperties}
    >
      <div className="wbs__frame">
        <div className="wbs__chrome">
          <span className="wbs__dot" />
          <span className="wbs__dot" />
          <span className="wbs__dot" />
          <span className="wbs__url">
            <span className="wbs__url-lock" aria-hidden="true" />
            app.bizuply.com/website/studio
          </span>
        </div>

        <div className="wbs__topbar">
          <div className="wbs__topbar-group">
            <motion.button
              type="button"
              className={`wbs__publish${published ? " is-done" : ""}`}
              tabIndex={-1}
              aria-hidden="true"
              animate={
                step.id === "publish" && !reduceMotion
                  ? { scale: [1, 0.94, 1] }
                  : { scale: 1 }
              }
              transition={{ duration: 0.4, ease: EASE }}
            >
              {published ? <CheckCircle2 size={13} /> : <Rocket size={13} />}
              {published ? "פורסם" : "פרסום"}
            </motion.button>
            <span className="wbs__history">
              <Undo2 size={13} />
              <Redo2 size={13} />
              <b>80</b>
            </span>
          </div>

          <div className="wbs__devices" role="presentation">
            {(
              [
                ["desktop", Monitor],
                ["tablet", Tablet],
                ["mobile", Smartphone],
              ] as const
            ).map(([key, Icon]) => (
              <span
                key={key}
                className={`wbs__device${device === key ? " is-active" : ""}`}
              >
                <Icon size={13} />
              </span>
            ))}
          </div>

          <div className="wbs__pages" aria-hidden="true">
            <span className="is-active">בית</span>
            <span>שירותים</span>
            <span>גלריה</span>
            <span>צור קשר</span>
          </div>
        </div>

        <div className="wbs__body">
          {/* Layers rail */}
          <aside className="wbs__layers" aria-hidden="true">
            <p className="wbs__panel-title">
              <Layers size={12} />
              שכבות
            </p>
            <ul>
              {order.map((id) => (
                <motion.li
                  key={id}
                  layout
                  transition={{ duration: 0.55, ease: EASE }}
                  className={selected === id ? "is-selected" : undefined}
                >
                  <span className="wbs__layer-grip" />
                  {SECTION_LABEL[id]}
                </motion.li>
              ))}
            </ul>
            <p className="wbs__panel-note">6 עמודים · 12 סקשנים</p>
          </aside>

          {/* Canvas */}
          <div className="wbs__canvas">
            <motion.div
              className={`wbs__viewport wbs__viewport--${device}`}
              layout
              transition={{ duration: 0.6, ease: EASE }}
            >
              {order.map((id) => (
                <motion.div
                  key={id}
                  layout
                  transition={{ duration: 0.6, ease: EASE }}
                  className={`wbs__block wbs__block--${id}${
                    selected === id ? " is-selected" : ""
                  }`}
                >
                  {selected === id ? (
                    <>
                      <span className="wbs__marker">{SECTION_LABEL[id]}</span>
                      <AnimatePresence>
                        <motion.span
                          className="wbs__floating-toolbar"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3, ease: EASE }}
                        >
                          <i>B</i>
                          <i>A</i>
                          <i />
                          <i />
                        </motion.span>
                      </AnimatePresence>
                    </>
                  ) : null}

                  {id === "hero" ? (
                    <div className="wbs__hero">
                      <span className="wbs__bar w-70" />
                      <span className="wbs__bar w-45" />
                      <span className="wbs__bar wbs__bar--thin w-55" />
                      <span className="wbs__pill" />
                    </div>
                  ) : null}

                  {id === "services" ? (
                    <div className="wbs__cards">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="wbs__card">
                          <i className="wbs__card-icon" />
                          <i className="wbs__bar w-80" />
                          <i className="wbs__bar wbs__bar--thin w-60" />
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {id === "gallery" ? (
                    <div className="wbs__gallery">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <span key={i} className="wbs__tile" />
                      ))}
                    </div>
                  ) : null}

                  {id === "form" ? (
                    <div className="wbs__form">
                      <span className="wbs__field" />
                      <span className="wbs__field" />
                      <span className="wbs__submit" />
                      <span className="wbs__form-tag">→ ליד ב־CRM</span>
                    </div>
                  ) : null}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Inspector */}
          <aside className="wbs__inspector" aria-hidden="true">
            <div className="wbs__tabs">
              {INSPECTOR_TABS.map((tab, i) => (
                <span
                  key={tab}
                  className={i === TAB_BY_STEP[step.id] ? "is-active" : undefined}
                >
                  {tab}
                </span>
              ))}
            </div>

            <p className="wbs__panel-title">צבע מיתוג</p>
            <div className="wbs__swatches">
              {PALETTE.map((color) => (
                <motion.span
                  key={color}
                  className={`wbs__swatch${
                    color === accent ? " is-active" : ""
                  }`}
                  style={{ background: color }}
                  animate={
                    color === accent && !reduceMotion
                      ? { scale: [1, 1.22, 1] }
                      : { scale: 1 }
                  }
                  transition={{ duration: 0.45, ease: EASE }}
                />
              ))}
            </div>

            <p className="wbs__panel-title">טיפוגרפיה</p>
            <div className="wbs__row">
              <span className="wbs__input">Assistant</span>
              <span className="wbs__input wbs__input--sm">64</span>
            </div>

            <p className="wbs__panel-title">מרווחים</p>
            <div className="wbs__slider">
              <motion.span
                className="wbs__slider-fill"
                animate={{ width: reached("design") ? "72%" : "38%" }}
                transition={{ duration: 0.7, ease: EASE }}
              />
            </div>

            <div className="wbs__toggle">
              <span>אנימציית כניסה</span>
              <span
                className={`wbs__switch${reached("design") ? " is-on" : ""}`}
              />
            </div>
          </aside>
        </div>

        {/* Ghost cursor — positioned against the whole frame so it can reach the top bar */}
        {!reduceMotion ? (
          <motion.span
            className="wbs__cursor"
            aria-hidden="true"
            animate={{ left: `${step.cursor.x}%`, top: `${step.cursor.y}%` }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <MousePointer2 size={16} />
            <b>{step.label}</b>
          </motion.span>
        ) : null}

        <AnimatePresence>
          {published ? (
            <motion.div
              className="wbs__toast"
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <CheckCircle2 size={16} />
              <span>
                האתר באוויר · <b>studio-demo.sites.bizuply.com</b>
              </span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <ol className="wbs__timeline">
        {STEPS.map((item, i) => (
          <li
            key={item.id}
            className={i === index ? "is-active" : i < index ? "is-done" : ""}
          >
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-current={i === index}
            >
              <span className="wbs__timeline-track">
                <motion.span
                  className="wbs__timeline-fill"
                  initial={false}
                  animate={{ scaleX: i < index ? 1 : i === index ? 1 : 0 }}
                  transition={{
                    duration:
                      i === index && !reduceMotion ? item.ms / 1000 : 0.3,
                    ease: "linear",
                  }}
                />
              </span>
              <b>{item.label}</b>
              <i>{item.hint}</i>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
