import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import "./CrmProductHero.css";

const fade = {
  hidden: { opacity: 0, y: 22 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function CrmProductHero() {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();

  return (
    <section className="crm-hero" aria-label={t("productPages.crm.badge")} dir={dir}>
      <div className="crm-hero__atmosphere" aria-hidden="true">
        <span className="crm-hero__wash crm-hero__wash--a" />
        <span className="crm-hero__wash crm-hero__wash--b" />
        <span className="crm-hero__grid" />
      </div>

      <div className="crm-hero__inner">
        <div className="crm-hero__copy">
          <motion.p
            className="crm-hero__brand"
            custom={0.05}
            variants={fade}
            initial="hidden"
            animate="show"
          >
            BizUply <span>CRM</span>
          </motion.p>

          <motion.h1
            className="crm-hero__title"
            custom={0.14}
            variants={fade}
            initial="hidden"
            animate="show"
          >
            {t("productPages.crm.heroTitle")}{" "}
            <span className="crm-hero__accent">
              {t("productPages.crm.heroHighlight")}
            </span>
          </motion.h1>

          <motion.p
            className="crm-hero__subtitle"
            custom={0.24}
            variants={fade}
            initial="hidden"
            animate="show"
          >
            {t("productPages.crm.heroSubtitle")}
          </motion.p>

          <motion.div
            className="crm-hero__actions"
            custom={0.34}
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
      </div>

      <motion.div
        className="crm-hero__visual"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img
          src="/images/crm-preview-v2.png"
          alt={t("productPages.crm.heroImageAlt")}
          className="crm-hero__shot"
          decoding="async"
          fetchPriority="high"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
