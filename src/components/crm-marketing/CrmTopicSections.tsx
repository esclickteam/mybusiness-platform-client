import React, { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useTranslation } from "react-i18next";
import { crmTopicSections, type CrmTopicSection } from "./crmSectionsData";

const ease = [0.22, 1, 0.36, 1] as const;

export default function CrmTopicSections() {
  return (
    <div className="crm-topics">
      {crmTopicSections.map((section, index) => (
        <TopicSection key={section.id} section={section} index={index} />
      ))}
    </div>
  );
}

function TopicSection({
  section,
  index,
}: {
  section: CrmTopicSection;
  index: number;
}) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.35,
  });

  const primaryY = useTransform(smooth, [0, 1], reduceMotion ? [0, 0] : [64, -64]);
  const cardY = useTransform(smooth, [0, 1], reduceMotion ? [0, 0] : [110, -80]);
  const phoneY = useTransform(smooth, [0, 1], reduceMotion ? [0, 0] : [130, -100]);
  const phoneRotate = useTransform(smooth, [0, 1], reduceMotion ? [0, 0] : [-5, 5]);
  const glowScale = useTransform(smooth, [0, 0.5, 1], [0.86, 1.1, 0.9]);
  const stageY = useTransform(smooth, [0, 1], reduceMotion ? [0, 0] : [24, -24]);

  const phoneShot = section.gallery.find((item) => item.frame === "phone");
  const cardShots = section.gallery.filter((item) => item.frame !== "phone");

  return (
    <section
      ref={ref}
      className={`crm-topic crm-topic--${section.id}`}
      style={{ "--crm-topic-accent": section.accent } as React.CSSProperties}
      aria-labelledby={`crm-topic-${section.id}`}
    >
      <div className="crm-topic__header">
        <motion.p
          className="crm-topic__eyebrow"
          initial={reduceMotion ? false : { opacity: 0, y: 14, letterSpacing: "0.34em" }}
          whileInView={{ opacity: 1, y: 0, letterSpacing: "0.16em" }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 0.55, ease }}
        >
          {t(`productPages.crm.section${capitalize(section.id)}Badge`)}
        </motion.p>

        <motion.h2
          id={`crm-topic-${section.id}`}
          className="crm-topic__title"
          initial={reduceMotion ? false : { opacity: 0, y: 28, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 0.75, ease }}
        >
          {t(section.titleKey)}
        </motion.h2>

        <motion.p
          className="crm-topic__text"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 0.6, delay: 0.06, ease }}
        >
          {t(section.textKey)}
        </motion.p>
      </div>

      <motion.div
        className="crm-topic__stage"
        style={{ y: stageY }}
        initial={reduceMotion ? false : { opacity: 0, y: 56, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.9, ease }}
      >
        <motion.div
          className="crm-topic__glow"
          style={{ scale: glowScale }}
          aria-hidden="true"
        />
        <div className="crm-topic__grid" aria-hidden="true" />

        <motion.div
          className="crm-topic__layer crm-topic__layer--primary"
          style={{ y: primaryY }}
          initial={reduceMotion ? false : { opacity: 0, y: 70, scale: 0.92 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease }}
        >
          <div className="crm-topic__panel">
            <div className="crm-topic__shine" aria-hidden="true" />
            <img
              src={section.primary}
              alt={t(section.titleKey)}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={index === 0 ? "high" : "auto"}
            />
          </div>
        </motion.div>

        {cardShots.map((item, i) => (
          <motion.div
            key={item.src}
            className={`crm-topic__layer crm-topic__layer--card crm-topic__layer--card-${i + 1}`}
            style={{ y: cardY }}
            initial={
              reduceMotion
                ? false
                : { opacity: 0, y: 90, x: i % 2 === 0 ? 40 : -40, scale: 0.88 }
            }
            whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.9, delay: 0.16 + i * 0.08, ease }}
          >
            <div className="crm-topic__panel">
              <div className="crm-topic__shine crm-topic__shine--delay" aria-hidden="true" />
              <img src={item.src} alt="" loading="lazy" decoding="async" />
            </div>
          </motion.div>
        ))}

        {phoneShot ? (
          <motion.div
            className="crm-topic__layer crm-topic__layer--phone"
            style={{ y: phoneY, rotate: phoneRotate }}
            initial={reduceMotion ? false : { opacity: 0, y: 110, scale: 0.84 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 1, delay: 0.24, type: "spring", stiffness: 120, damping: 16 }}
          >
            <div className="crm-topic__phone">
              <span className="crm-topic__phone-notch" aria-hidden="true" />
              <img
                src={phoneShot.src}
                alt=""
                className="crm-topic__phone-img"
                loading="lazy"
                decoding="async"
              />
            </div>
          </motion.div>
        ) : null}
      </motion.div>
    </section>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
