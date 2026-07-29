import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import "./CrmProductHero.css";

export default function CrmProductHero() {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();

  return (
    <section className="crm-hero" aria-label={t("productPages.crm.badge")} dir={dir}>
      <div className="crm-hero__atmosphere" aria-hidden="true">
        <span className="crm-hero__orb crm-hero__orb--a" />
        <span className="crm-hero__orb crm-hero__orb--b" />
        <span className="crm-hero__grid" />
      </div>

      <div className="crm-hero__inner">
        <motion.h1
          className="crm-hero__title"
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {t("productPages.crm.heroDisplayTitle")}
        </motion.h1>

        <motion.div
          className="crm-hero__actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link to="/register" className="crm-hero__btn crm-hero__btn--primary">
            {t("productPages.ctaPrimary")}
          </Link>
          <Link to="/pricing" className="crm-hero__btn crm-hero__btn--ghost">
            {t("productPages.ctaPricing")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
