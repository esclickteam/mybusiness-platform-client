import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

type Props = {
  /** 0–100 */
  value: number;
  label: string;
  size?: number;
};

/** Circular score meter that draws itself when scrolled into view. */
export default function ProgressRing({ value, label, size = 136 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const gradientId = `pm-ring-${label.replace(/\W+/g, "")}`;
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const target = Math.max(0, Math.min(100, value));

  return (
    <div
      ref={ref}
      className="pm-ring"
      style={{ "--pm-ring-size": `${size}px` } as React.CSSProperties}
      role="img"
      aria-label={`${label}: ${target}`}
    >
      <svg viewBox="0 0 100 100">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <circle className="pm-ring__track" cx="50" cy="50" r={radius} />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset:
              inView || reduceMotion
                ? circumference * (1 - target / 100)
                : circumference,
          }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <span className="pm-ring__label">
        <span className="pm-ring__number">{target}</span>
        <span className="pm-ring__caption">{label}</span>
      </span>
    </div>
  );
}
