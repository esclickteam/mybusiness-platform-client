import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import "./CrmProductHero.css";

const ease = [0.16, 1, 0.3, 1] as const;

export default function CrmProductHero() {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();
  const reduceMotion = useReducedMotion();

  return (
    <section className="crm-hero" aria-label={t("productPages.crm.badge")} dir={dir}>
      <div className="crm-hero__atmosphere" aria-hidden="true">
        <span className="crm-hero__orb crm-hero__orb--a" />
        <span className="crm-hero__orb crm-hero__orb--b" />
        <span className="crm-hero__orb crm-hero__orb--c" />
        <span className="crm-hero__grid" />
        <span className="crm-hero__beam" />
      </div>

      <div className="crm-hero__inner">
        <motion.h1
          className="crm-hero__title"
          initial={reduceMotion ? false : { opacity: 0, y: 36, filter: "blur(12px)", scale: 0.96 }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
          transition={{ duration: 0.85, ease }}
        >
          {t("productPages.crm.heroDisplayTitle")}
        </motion.h1>

        <motion.div
          className="crm-hero__actions"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.65, ease }}
        >
          <motion.div whileHover={reduceMotion ? undefined : { y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link to="/register" className="crm-hero__btn crm-hero__btn--primary">
              {t("productPages.ctaPrimary")}
            </Link>
          </motion.div>
          <motion.div whileHover={reduceMotion ? undefined : { y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link to="/pricing" className="crm-hero__btn crm-hero__btn--ghost">
              {t("productPages.ctaPricing")}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
