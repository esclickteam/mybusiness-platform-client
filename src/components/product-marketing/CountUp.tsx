import React, { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

type Props = {
  to: number;
  from?: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  /** Decimal places to render. */
  decimals?: number;
};

/** Counts from `from` to `to` the first time it scrolls into view. */
export default function CountUp({
  to,
  from = 0,
  duration = 1.6,
  suffix = "",
  prefix = "",
  decimals = 0,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(reduceMotion ? to : from);

  useEffect(() => {
    if (!inView || reduceMotion) {
      if (reduceMotion) setValue(to);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const total = duration * 1000;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / total);
      // easeOutExpo keeps the last digits from crawling
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(from + (to - from) * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduceMotion, from, to, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString("he-IL", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
