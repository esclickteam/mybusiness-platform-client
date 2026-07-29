import React from "react";
import { motion } from "framer-motion";

type SiteType = {
  label: string;
  from: "right" | "left";
};

const SITE_TYPES: SiteType[] = [
  { label: "אתר תדמית", from: "right" },
  { label: "אתר חנות", from: "left" },
  { label: "אתר זימון פגישות", from: "right" },
  { label: "אתר נדל״ן", from: "left" },
  { label: "אתר מסעדה", from: "right" },
  { label: "אתר קורסים", from: "left" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function WebsiteTypesReveal() {
  return (
    <section className="wb-types" aria-label="סוגי אתרים">
      <div className="wb-types__inner">
        {SITE_TYPES.map((item, index) => {
          const fromX = item.from === "right" ? 120 : -120;
          return (
            <motion.p
              key={item.label}
              className={`wb-types__line wb-types__line--${item.from}`}
              initial={{ opacity: 0, x: fromX, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.55 }}
              transition={{
                duration: 0.85,
                delay: index * 0.08,
                ease,
              }}
            >
              {item.label}
            </motion.p>
          );
        })}
      </div>
    </section>
  );
}
