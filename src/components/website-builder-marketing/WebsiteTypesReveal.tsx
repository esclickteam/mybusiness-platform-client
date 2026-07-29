import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import AutoScrollTemplatePreview from "./AutoScrollTemplatePreview";
import { websiteTypeBlocks } from "./websiteTypeBlocks";

const ease = [0.22, 1, 0.36, 1] as const;

export default function WebsiteTypesReveal() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="wb-types" aria-label="סוגי אתרים">
      <div className="wb-types__inner">
        {websiteTypeBlocks.map((block, index) => {
          const fromX = block.from === "right" ? 140 : -140;
          const flip = block.from === "left";

          return (
            <motion.article
              key={block.id}
              className={`wb-type-block${flip ? " is-flip" : ""}`}
              style={
                {
                  "--wb-type-accent": block.accent,
                  "--wb-type-accent-soft": block.accentSoft,
                } as React.CSSProperties
              }
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, x: fromX, filter: "blur(10px)" }
              }
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.28 }}
              transition={{ duration: 1.35, ease }}
            >
              <div className="wb-type-block__copy">
                <span className="wb-type-block__index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="wb-type-block__title">{block.label}</h2>
                <p className="wb-type-block__teaser">{block.teaser}</p>

                <ul className="wb-type-block__points">
                  {block.points.map((point, i) => (
                    <motion.li
                      key={point}
                      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.15 + i * 0.09,
                        ease,
                      }}
                    >
                      <Check size={14} strokeWidth={3} aria-hidden="true" />
                      {point}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="wb-type-block__preview">
                <AutoScrollTemplatePreview
                  templateId={block.templateId}
                  title={block.templateTitle}
                  accent={block.accent}
                  accentSoft={block.accentSoft}
                />
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
