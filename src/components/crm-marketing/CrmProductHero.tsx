import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, CalendarClock, Facebook, ShieldCheck, Zap } from "lucide-react";
import { StatStrip, WordReveal } from "../product-marketing";
import { getCrmHeroStats } from "./crmMarketingData";
import "./CrmProductHero.css";

const ease = [0.16, 1, 0.3, 1] as const;

export default function CrmProductHero() {
  const reduceMotion = useReducedMotion();
  const { t, i18n } = useTranslation();

  return (
    <section
      className="crm-hero"
      aria-label={t("crmPage.hero.ariaLabel")}
      dir={i18n.language === "he" ? "rtl" : "ltr"}
    >
      <div className="crm-hero__atmosphere" aria-hidden="true">
        <span className="crm-hero__orb crm-hero__orb--a" />
        <span className="crm-hero__orb crm-hero__orb--b" />
        <span className="crm-hero__orb crm-hero__orb--c" />
        <span className="crm-hero__grid" />
        <span className="crm-hero__beam" />
      </div>

      <div className="crm-hero__inner">
        <motion.div
          className="crm-hero__badges"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <span className="pm-badge pm-badge--meta">
            <Facebook size={13} aria-hidden="true" />
            {t("crmPage.hero.badgeMeta")}
          </span>
          <span className="pm-badge">
            <span className="pm-badge__dot" />
            {t("crmPage.hero.badgeRealtime")}
          </span>
          <span className="pm-badge">
            <CalendarClock size={13} aria-hidden="true" />
            {t("crmPage.hero.badgeCalendar")}
          </span>
        </motion.div>

        <h1 className="crm-hero__title">
          <WordReveal text={t("crmPage.hero.titleLine1")} delay={0.14} />{" "}
          <span className="crm-hero__title-grad">
            <WordReveal text={t("crmPage.hero.titleLine2")} delay={0.5} />
          </span>
        </h1>

        <motion.p
          className="crm-hero__lead"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7, ease }}
        >
          {t("crmPage.hero.lead")}
        </motion.p>

        <motion.div
          className="crm-hero__trust"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.68, duration: 0.65, ease }}
        >
          <ShieldCheck size={17} aria-hidden="true" />
          <p>{t("crmPage.hero.trust")}</p>
        </motion.div>

        <motion.div
          className="crm-hero__actions"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.76, duration: 0.65, ease }}
        >
          <Link to="/automations" className="pm-cta pm-cta--primary">
            <Zap size={17} aria-hidden="true" />
            {t("crmPage.hero.ctaAutomations")}
            <ArrowLeft size={17} aria-hidden="true" />
          </Link>

          <Link to="/pricing" className="pm-cta pm-cta--ghost">
            {t("crmPage.hero.ctaStartFree")}
          </Link>
        </motion.div>

        <motion.div
          className="crm-hero__stats"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.88, duration: 0.7, ease }}
        >
          <StatStrip stats={getCrmHeroStats(t)} />
        </motion.div>
      </div>
    </section>
  );
}
