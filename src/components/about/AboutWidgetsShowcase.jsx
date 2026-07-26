import React, { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

const pages = [
  { key: "home", pct: 92, views: 65, growth: 48.2 },
  { key: "services", pct: 58, views: 28, growth: 22.4 },
  { key: "gallery", pct: 46, views: 18, growth: 16.8 },
  { key: "expertise", pct: 38, views: 12, growth: 11.5 },
  { key: "products", pct: 30, views: 9, growth: 8.2 },
];

function CountUp({ value, decimals = 0, active, suffix = "" }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return undefined;
    let frame = 0;
    const total = 40;
    const id = window.setInterval(() => {
      frame += 1;
      const p = Math.min(1, frame / total);
      const eased = 1 - (1 - p) ** 3;
      const next = value * eased;
      setN(decimals ? Number(next.toFixed(decimals)) : Math.round(next));
      if (p >= 1) window.clearInterval(id);
    }, 18);
    return () => window.clearInterval(id);
  }, [active, value, decimals]);
  return (
    <>
      {decimals ? n.toFixed(decimals) : n}
      {suffix}
    </>
  );
}

export default function AboutWidgetsShowcase({ labels }) {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (!inView) return undefined;
    const t = window.setTimeout(() => setDrawn(true), 180);
    return () => window.clearTimeout(t);
  }, [inView]);

  return (
    <div ref={ref} className="about-widgets-grid">
      <motion.article
        className="about-widget-card"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <h3>{labels.pagesTitle}</h3>
        <div className="about-pages-list">
          {pages.map((row, i) => (
            <div key={row.key} className="about-page-row">
              <div className="about-page-meta">
                <strong>
                  <CountUp
                    value={row.growth}
                    decimals={1}
                    active={inView}
                    suffix="% +"
                  />
                </strong>
                <span>
                  <CountUp value={row.views} active={inView} />
                </span>
              </div>
              <div className="about-page-track">
                <motion.span
                  initial={{ width: 0 }}
                  animate={drawn ? { width: `${row.pct}%` } : { width: 0 }}
                  transition={{ delay: 0.12 + i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <p>{labels.pages[row.key]}</p>
            </div>
          ))}
        </div>
      </motion.article>

      <motion.article
        className="about-widget-card about-widget-card--chart"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay: 0.08 }}
      >
        <div className="about-widget-head">
          <h3>{labels.collabTitle}</h3>
          <span>{labels.showAll}</span>
        </div>

        <div className="about-donut-wrap">
          <svg viewBox="0 0 120 120" className="about-donut">
            <circle cx="60" cy="60" r="40" fill="none" stroke="#EDE9FE" strokeWidth="16" />
            <motion.circle
              cx="60"
              cy="60"
              r="40"
              fill="none"
              stroke="#7C3AED"
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray="125.6 125.6"
              transform="rotate(-90 60 60)"
              initial={{ strokeDashoffset: 125.6 }}
              animate={drawn ? { strokeDashoffset: 0 } : { strokeDashoffset: 125.6 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
        </div>

        <div className="about-collab-stats">
          <div>
            <strong>
              <CountUp value={4} active={inView} />
            </strong>
            <span className="dot dot-a" />
            <p>{labels.activeCollabs}</p>
          </div>
          <div>
            <strong>
              <CountUp value={4} active={inView} />
            </strong>
            <span className="dot dot-b" />
            <p>{labels.inboundRefs}</p>
          </div>
        </div>
      </motion.article>
    </div>
  );
}
