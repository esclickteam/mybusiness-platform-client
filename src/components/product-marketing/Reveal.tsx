import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children: React.ReactNode;
  /** Direction the element travels in from. */
  from?: "up" | "down" | "start" | "end" | "scale";
  delay?: number;
  duration?: number;
  distance?: number;
  blur?: boolean;
  amount?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "span" | "header";
  style?: React.CSSProperties;
};

/** Scroll-triggered entrance wrapper used across the product marketing pages. */
export function Reveal({
  children,
  from = "up",
  delay = 0,
  duration = 0.75,
  distance = 32,
  blur = false,
  amount = 0.25,
  className,
  as = "div",
  style,
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;

  const offset: Record<string, Record<string, number>> = {
    up: { y: distance },
    down: { y: -distance },
    start: { x: distance },
    end: { x: -distance },
    scale: {},
  };

  const hidden = {
    opacity: 0,
    ...offset[from],
    ...(from === "scale" ? { scale: 0.94 } : {}),
    ...(blur ? { filter: "blur(12px)" } : {}),
  };

  return (
    <Tag
      className={className}
      style={style}
      initial={reduceMotion ? false : hidden}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        ...(blur ? { filter: "blur(0px)" } : {}),
      }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const staggerChild: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

type StaggerProps = {
  children: React.ReactNode;
  className?: string;
  amount?: number;
  gap?: number;
};

/** Parent that cascades its `StaggerItem` children into view. */
export function Stagger({
  children,
  className,
  amount = 0.15,
  gap = 0.08,
}: StaggerProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={
        reduceMotion
          ? undefined
          : { ...staggerParent, show: { transition: { staggerChildren: gap } } }
      }
      initial={reduceMotion ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  style,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: "div" | "article" | "li";
}) {
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag className={className} style={style} variants={staggerChild}>
      {children}
    </Tag>
  );
}

/**
 * Headline that assembles itself word by word.
 *
 * Deliberately animates only opacity and offset: a `filter` on the word spans
 * gives them their own painting context, which stops an ancestor's
 * `background-clip: text` gradient from reaching them and renders the words
 * invisible.
 */
export function WordReveal({
  text,
  className,
  delay = 0,
  step = 0.055,
}: {
  text: string;
  className?: string;
  delay?: number;
  step?: number;
}) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");

  if (reduceMotion) return <span className={className}>{text}</span>;

  return (
    <span className={`pm-words ${className || ""}`.trim()}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="pm-word"
          initial={{ opacity: 0, y: "0.45em" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: delay + index * step,
            ease: EASE,
          }}
        >
          {word}
          {index < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </span>
  );
}

export { EASE as revealEase };
