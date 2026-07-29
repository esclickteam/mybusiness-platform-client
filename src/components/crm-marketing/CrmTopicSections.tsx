import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { crmTopicSections } from "./crmSectionsData";

const ease = [0.22, 1, 0.36, 1] as const;

export default function CrmTopicSections() {
  const { t } = useTranslation();

  return (
    <div className="crm-topics">
      {crmTopicSections.map((section, index) => {
        const reverse = index % 2 === 1;
        return (
          <section
            key={section.id}
            className={`crm-topic${reverse ? " is-reverse" : ""}`}
            style={{ "--crm-topic-accent": section.accent } as React.CSSProperties}
            aria-labelledby={`crm-topic-${section.id}`}
          >
            <div className="crm-topic__copy">
              <motion.p
                className="crm-topic__eyebrow"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, ease }}
              >
                {t(`productPages.crm.section${capitalize(section.id)}Badge`)}
              </motion.p>
              <motion.h2
                id={`crm-topic-${section.id}`}
                className="crm-topic__title"
                initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, ease }}
              >
                {t(section.titleKey)}
              </motion.h2>
              <motion.p
                className="crm-topic__text"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.55, delay: 0.06, ease }}
              >
                {t(section.textKey)}
              </motion.p>
            </div>

            <div className="crm-topic__visual">
              <motion.div
                className="crm-topic__primary"
                initial={{ opacity: 0, y: 36, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.7, ease }}
              >
                <img
                  src={section.primary}
                  alt={t(section.titleKey)}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={index === 0 ? "high" : "auto"}
                />
              </motion.div>

              <div className="crm-topic__secondary">
                {section.secondary.map((src, i) => (
                  <motion.div
                    key={src}
                    className="crm-topic__shot"
                    initial={{ opacity: 0, y: 28, x: reverse ? -18 : 18 }}
                    whileInView={{ opacity: 1, y: 0, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.65, delay: 0.12 + i * 0.1, ease }}
                  >
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
