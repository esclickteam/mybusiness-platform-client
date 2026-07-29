import React, { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import type { LucideIcon } from "lucide-react";

export type ShowcaseItem = {
  id: string;
  icon: LucideIcon;
  title: string;
  text: string;
  accent: string;
  /** Visual rendered in the sticky stage while this item is active. */
  render: () => React.ReactNode;
};

type Props = {
  items: ShowcaseItem[];
  /** Milliseconds each item stays active before auto-advancing. */
  interval?: number;
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Feature deep-dive: a rail of expandable topics beside a sticky stage.
 * Advances on its own while visible, and stops rotating once the user picks a topic.
 */
export default function StickyShowcase({ items, interval = 6200 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (!inView || locked || reduceMotion || items.length < 2) return;
    const id = window.setInterval(
      () => setActive((value) => (value + 1) % items.length),
      interval,
    );
    return () => window.clearInterval(id);
  }, [inView, locked, reduceMotion, items.length, interval]);

  const activeItem = items[active];

  return (
    <div className="pm-sticky" ref={ref}>
      <div className="pm-sticky__rail">
        {items.map((item, index) => {
          const isActive = index === active;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              className={`pm-sticky__item${isActive ? " is-active" : ""}`}
              style={{ "--pm-item-accent": item.accent } as React.CSSProperties}
              aria-expanded={isActive}
              onClick={() => {
                setActive(index);
                setLocked(true);
              }}
            >
              {isActive ? (
                <motion.span
                  className="pm-sticky__progress"
                  aria-hidden="true"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{
                    duration: locked || reduceMotion ? 0.4 : interval / 1000,
                    ease: "linear",
                  }}
                />
              ) : null}

              <span className="pm-sticky__item-head">
                <span className="pm-sticky__item-icon">
                  <Icon size={17} />
                </span>
                <span className="pm-sticky__item-title">{item.title}</span>
              </span>

              <AnimatePresence initial={false}>
                {isActive ? (
                  <motion.span
                    className="pm-sticky__item-body"
                    style={{ display: "block" }}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <span
                      className="pm-sticky__item-text"
                      style={{ display: "block" }}
                    >
                      {item.text}
                    </span>
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </button>
          );
        })}
      </div>

      <div className="pm-sticky__stage">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem.id}
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduceMotion ? undefined : { opacity: 0, y: -18, scale: 0.98 }
            }
            transition={{ duration: 0.55, ease: EASE }}
          >
            {activeItem.render()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
