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
          <motion.h1
            className="crm-hero__title"
            custom={0.08}
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
            custom={0.22}
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
    </section>
  );
}
