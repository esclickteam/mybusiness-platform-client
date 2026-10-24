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

  return (
    <section className="home-hero" dir={dir}>
      <div className="home-hero__glow" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-8 pt-16 sm:px-6 sm:pt-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:px-8 lg:pb-4 lg:pt-24">
        <div>
          <motion.p
            className="home-brand"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            Bizuply
          </motion.p>
          <motion.h1
            className="home-hero__title"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
          >
            {t("home.headline")}
          </motion.h1>
          <motion.p
            className="home-hero__lead"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16, ease: EASE }}
          >
            {t("home.subtitle")}
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: EASE }}
          >
            <Link to="/register" className="home-cta home-cta--primary">
              {t("home.startTrial")}
            </Link>
            <Link to="/pricing" className="home-cta home-cta--ghost">
              {t("home.viewPricing")}
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="home-stage"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
        >
          <img
            className="home-stage__main"
            src="/demo-media/forms/lead.png"
            alt={t("home.stageAlt")}
            width={1200}
            height={750}
          />
          <img
            className="home-stage__float home-stage__float--a"
            src="/demo-media/whatsapp/still-3.jpg"
            alt={t("home.stageWhatsappAlt")}
            width={640}
            height={400}
          />
          <img
            className="home-stage__float home-stage__float--b"
            src="/demo-media/appointments/still-8.jpg"
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
