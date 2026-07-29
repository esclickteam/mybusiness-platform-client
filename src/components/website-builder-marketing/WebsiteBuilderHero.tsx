import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, CalendarClock, LayoutTemplate, Sparkles } from "lucide-react";
import TemplateShowcase from "./TemplateShowcase";
import WebsiteTypesReveal from "./WebsiteTypesReveal";
import { StatStrip, WordReveal } from "../product-marketing";
import { websiteHeroStats } from "./websiteMarketingData";
import "./WebsiteBuilderHero.css";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function WebsiteBuilderHero() {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <section className="wb-hero" aria-label="בניית אתרים">
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
                205 תבניות מוכנות
              </span>
              <span className="pm-badge">
                <LayoutTemplate size={13} aria-hidden="true" />
                עורך ויזואלי
              </span>
              <span className="pm-badge">
                <CalendarClock size={13} aria-hidden="true" />
                חנות ותורים
              </span>
            </motion.div>

            <h1 className="wb-hero__title">
              <WordReveal text="בונים אתר מקצועי" delay={0.15} />{" "}
              <span className="wb-hero__title-grad">
                <WordReveal text="שמביא לקוחות" delay={0.42} />
              </span>
            </h1>

            <motion.p
              className="wb-hero__lead"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.7, ease: EASE }}
            >
              בוחרים תבנית מתוך 205 תבניות לפי תחום, עורכים כל אלמנט במקום,
              מוסיפים חנות, יומן ותוספים — ומפרסמים לכתובת שלכם. כל פנייה מהאתר
              נכנסת ישר לצינור הלידים ב־CRM.
            </motion.p>

            <motion.div
              className="wb-hero__actions"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.68, duration: 0.7, ease: EASE }}
            >
              <Link to="/register" className="pm-cta pm-cta--primary">
                מתחילים לבנות
                <ArrowLeft size={17} aria-hidden="true" />
              </Link>
              <a href="#wb-templates" className="pm-cta pm-cta--ghost">
                <Sparkles size={16} aria-hidden="true" />
                רואים תבניות
              </a>
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
            <StatStrip stats={websiteHeroStats} />
          </motion.div>
        </div>
      </section>

      <WebsiteTypesReveal />
    </>
  );
}
