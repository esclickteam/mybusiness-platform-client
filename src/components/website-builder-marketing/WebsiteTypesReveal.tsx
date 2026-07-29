import React from "react";
import { motion } from "framer-motion";
import AutoScrollTemplatePreview from "./AutoScrollTemplatePreview";
import { websiteTypeBlocks } from "./websiteTypeBlocks";

const ease = [0.22, 1, 0.36, 1] as const;

export default function WebsiteTypesReveal() {
  return (
    <section className="wb-types" aria-label="סוגי אתרים">
      <div className="wb-types__inner">
        {websiteTypeBlocks.map((block) => {
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
              initial={{ opacity: 0, x: fromX, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.28 }}
              transition={{ duration: 1.35, ease }}
            >
              <div className="wb-type-block__copy">
                <h2 className="wb-type-block__title">{block.label}</h2>
                <p className="wb-type-block__teaser">{block.teaser}</p>
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
