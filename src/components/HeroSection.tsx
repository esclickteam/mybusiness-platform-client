"use client";

import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../i18n/localeUtils";
import SourcesMarquee from "./SourcesMarquee";
import "../styles/homeWow.css";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function HeroSection() {
  const { t, i18n } = useTranslation();
  const reduceMotion = useReducedMotion();
  const dir = getTextDirection(i18n.language);
  if (
    typeof document !== "undefined" &&
    (document.querySelector("#bizuply-first-paint .home-hero") ||
      document.querySelector("[data-kept-hero]"))
  ) {
    return null;
  }

  return (
    <section className="home-hero" dir={dir}>
      <div className="home-hero__glow" aria-hidden="true" />
      <div className="home-hero__grid">
        <div>
          <motion.h1
            className="home-hero__title"
            initial={reduceMotion ? false : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
          >
            {t("home.headline")}
          </motion.h1>
          <motion.p
            className="home-hero__lead"
            initial={reduceMotion ? false : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16, ease: EASE }}
          >
            {t("home.subtitle")}
          </motion.p>
          <p className="home-hero__note">{t("home.supportLine")}</p>
          <motion.div
            className="home-hero__actions"
            initial={reduceMotion ? false : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: EASE }}
          >
            <Link to="/register" className="home-cta home-cta--primary">
              {t("home.startTrial")}
            </Link>
            <Link to="/platform" className="home-cta home-cta--ghost">
              {t("home.explore")}
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="home-stage"
          initial={reduceMotion ? false : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
        >
          <img
            className="home-stage__main"
            src="/demo-media/crm/poster.jpg"
            alt={t("home.stageAlt")}
            width={960}
            height={600}
            fetchPriority="high"
            decoding="async"
          />
          <img
            className="home-stage__float home-stage__float--a"
            src="/demo-media/whatsapp/poster.jpg"
            alt={t("home.stageWhatsappAlt")}
            width={640}
            height={400}
          />
          <img
            className="home-stage__float home-stage__float--b"
            src="/demo-media/appointments/poster.jpg"
            alt={t("home.stageAppointmentsAlt")}
            width={640}
            height={400}
          />
          <span className="home-cursor" aria-hidden="true" />
        </motion.div>
      </div>
      <SourcesMarquee />
    </section>
  );
}
