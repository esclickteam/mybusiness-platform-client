import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, CalendarClock, LayoutTemplate } from "lucide-react";
import TemplateShowcase from "./TemplateShowcase";
import WebsiteTypesReveal from "./WebsiteTypesReveal";
import { StatStrip, WordReveal } from "../product-marketing";
import { getWebsiteHeroStats } from "./websiteMarketingData";
import "./WebsiteBuilderHero.css";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function WebsiteBuilderHero() {
  const reduceMotion = useReducedMotion();
  const { t } = useTranslation();

  return (
    <>
      <section className="wb-hero" aria-label={t("websitePage.hero.aria")}>
        <div className="wb-hero__glow" aria-hidden="true">
          <span className="g1" />
          <span className="g2" />
          <span className="g3" />
        </div>
        <div className="wb-hero__dots" aria-hidden="true" />

        <div className="wb-hero__inner">
          <div className="wb-hero__copy">
            <motion.div
              className="wb-hero__badges"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <span className="pm-badge">
                <span className="pm-badge__dot" />
                {t("websitePage.hero.badgeTemplates")}
              </span>
              <span className="pm-badge">
                <LayoutTemplate size={13} aria-hidden="true" />
                {t("websitePage.hero.badgeEditor")}
              </span>
              <span className="pm-badge">
                <CalendarClock size={13} aria-hidden="true" />
                {t("websitePage.hero.badgeStore")}
              </span>
            </motion.div>

            <h1 className="wb-hero__title">
              <WordReveal text={t("websitePage.hero.titleLead")} delay={0.15} />{" "}
              <span className="wb-hero__title-grad">
                <WordReveal text={t("websitePage.hero.titleHighlight")} delay={0.42} />
              </span>
            </h1>

            <motion.p
              className="wb-hero__lead"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.7, ease: EASE }}
            >
              {t("websitePage.hero.lead")}
            </motion.p>

            <motion.div
              className="wb-hero__actions"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.68, duration: 0.7, ease: EASE }}
            >
              <Link to="/pricing" className="pm-cta pm-cta--primary">
                {t("websitePage.hero.ctaPackages")}
                <ArrowLeft size={17} aria-hidden="true" />
              </Link>
            </motion.div>
          </div>

          <div id="wb-templates" className="wb-hero__templates">
            <TemplateShowcase />
          </div>

          <motion.div
            className="wb-hero__stats"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.7, ease: EASE }}
          >
            <StatStrip stats={getWebsiteHeroStats(t)} />
          </motion.div>
        </div>
      </section>

      <WebsiteTypesReveal />
    </>
  );
}
