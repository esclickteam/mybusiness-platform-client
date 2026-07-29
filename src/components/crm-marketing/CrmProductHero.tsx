import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import CrmPipelinePreview from "./CrmPipelinePreview";
import "./CrmProductHero.css";

const fade = {
  hidden: { opacity: 0, y: 26, filter: "blur(8px)" },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function CrmProductHero() {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();

  return (
    <section className="crm-hero" aria-label={t("productPages.crm.badge")} dir={dir}>
      <div className="crm-hero__atmosphere" aria-hidden="true">
        <span className="crm-hero__orb crm-hero__orb--a" />
        <span className="crm-hero__orb crm-hero__orb--b" />
        <span className="crm-hero__orb crm-hero__orb--c" />
        <span className="crm-hero__sheen" />
        <span className="crm-hero__grid" />
      </div>

      <div className="crm-hero__inner">
        <div className="crm-hero__copy">
          <motion.h1
            className="crm-hero__title"
            custom={0.05}
            variants={fade}
            initial="hidden"
            animate="show"
          >
            {t("productPages.crm.heroTitle")}{" "}
            <span className="crm-hero__accent">
              {t("productPages.crm.heroHighlight")}
            </span>
          </motion.h1>

          <motion.div
            className="crm-hero__actions"
            custom={0.18}
            variants={fade}
            initial="hidden"
            animate="show"
          >
            <Link to="/register" className="crm-hero__btn crm-hero__btn--primary">
              {t("productPages.ctaPrimary")}
            </Link>
            <Link to="/pricing" className="crm-hero__btn crm-hero__btn--ghost">
              {t("productPages.ctaPricing")}
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="crm-hero__stage"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="crm-hero__stage-float"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <CrmPipelinePreview />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
