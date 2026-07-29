"use client";

import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";

/** Endless drift of the channels that feed the lead list. */
export default function SourcesMarquee() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  const sources =
    (t("live.sources", { returnObjects: true }) as unknown as
      | string[]
      | undefined) || [];

  if (!sources.length) return null;

  const lane = [...sources, ...sources];

  return (
    <div className="relative overflow-hidden py-6">
      <p className="mb-5 text-center text-xs font-black uppercase tracking-[0.24em] text-slate-400">
        {t("live.sourcesEyebrow")}
      </p>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />

        <motion.div
          className="flex w-max gap-3"
          animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        >
          {lane.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="whitespace-nowrap rounded-full border border-slate-100 bg-white px-5 py-2.5 text-sm font-black text-slate-600 shadow-sm"
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
