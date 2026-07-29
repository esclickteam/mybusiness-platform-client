import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import StatStrip from "./StatStrip";
import type { MarketingStat } from "./StatStrip";
import { WordReveal } from "./Reveal";
import "./CenteredProductHero.css";

const ease = [0.16, 1, 0.3, 1] as const;

export type HeroBadge = {
  label: string;
  icon?: React.ReactNode;
  live?: boolean;
};

type Props = {
  ariaLabel: string;
  accent?: "violet" | "pink" | "cyan" | "emerald";
  badges: HeroBadge[];
  title: string;
  titleHighlight: string;
  lead: string;
  note?: {
    icon: React.ReactNode;
    text: string;
  };
  primaryLabel?: string;
  primaryTo?: string;
  stats: MarketingStat[];
};

export default function CenteredProductHero({
  ariaLabel,
  accent = "violet",
  badges,
  title,
  titleHighlight,
  lead,
  note,
  primaryLabel = "לצפייה בחבילות",
  primaryTo = "/pricing",
  stats,
}: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="pm-hero"
      data-accent={accent === "violet" ? undefined : accent}
      aria-label={ariaLabel}
      dir="rtl"
    >
      <div className="pm-hero__atmosphere" aria-hidden="true">
        <span className="pm-hero__orb pm-hero__orb--a" />
        <span className="pm-hero__orb pm-hero__orb--b" />
        <span className="pm-hero__orb pm-hero__orb--c" />
        <span className="pm-hero__grid" />
      </div>

      <div className="pm-hero__inner">
        <motion.div
          className="pm-hero__badges"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          {badges.map((badge) => (
            <span key={badge.label} className="pm-badge">
              {badge.live ? <span className="pm-badge__dot" /> : null}
              {badge.icon}
              {badge.label}
            </span>
          ))}
        </motion.div>

        <h1 className="pm-hero__title">
          <WordReveal text={title} delay={0.14} />{" "}
          <span className="pm-hero__title-grad">
            <WordReveal text={titleHighlight} delay={0.5} />
          </span>
        </h1>

        <motion.p
          className="pm-hero__lead"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7, ease }}
        >
          {lead}
        </motion.p>

        {note ? (
          <motion.div
            className="pm-hero__note"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.65, ease }}
          >
            {note.icon}
            <p>{note.text}</p>
          </motion.div>
        ) : null}

        <motion.div
          className="pm-hero__actions"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.76, duration: 0.65, ease }}
        >
          <Link to={primaryTo} className="pm-cta pm-cta--primary">
            {primaryLabel}
            <ArrowLeft size={17} aria-hidden="true" />
          </Link>
        </motion.div>

        <motion.div
          className="pm-hero__stats"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.88, duration: 0.7, ease }}
        >
          <StatStrip stats={stats} />
        </motion.div>
      </div>
    </section>
  );
}
