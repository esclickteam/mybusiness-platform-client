import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, CalendarClock, Facebook, ShieldCheck } from "lucide-react";
import { StatStrip, WordReveal } from "../product-marketing";
import { crmHeroStats } from "./crmMarketingData";
import "./CrmProductHero.css";

const ease = [0.16, 1, 0.3, 1] as const;

export default function CrmProductHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="crm-hero" aria-label="CRM ולידים" dir="rtl">
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
            Meta App Review Developers
          </span>
          <span className="pm-badge">
            <span className="pm-badge__dot" />
            לידים בזמן אמת
          </span>
          <span className="pm-badge">
            <CalendarClock size={13} aria-hidden="true" />
            יומן תורים מסונכרן
          </span>
        </motion.div>

        <h1 className="crm-hero__title">
          <WordReveal text="כל ליד, כל לקוח, כל פגישה" delay={0.14} />{" "}
          <span className="crm-hero__title-grad">
            <WordReveal text="במקום אחד" delay={0.5} />
          </span>
        </h1>

        <motion.p
          className="crm-hero__lead"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7, ease }}
        >
          פניות מ־Facebook, מ־Instagram, מ־Google Ads ומהאתר שלכם נכנסות
          אוטומטית לצינור אחד עם סטטוס, תיעוד ומשימות. ומשם ממשיכים לתיק לקוח,
          ליומן תורים ולקטלוג שירותים — באותה מערכת.
        </motion.p>

        <motion.div
          className="crm-hero__trust"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.68, duration: 0.65, ease }}
        >
          <ShieldCheck size={17} aria-hidden="true" />
          <p>
            אנחנו Meta App Review Developers — אפליקציית BizUply עברה את תהליך
            ה־App Review של Meta לחיבור Lead Ads לעסקים
          </p>
        </motion.div>

        <motion.div
          className="crm-hero__actions"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.76, duration: 0.65, ease }}
        >
          <Link to="/register" className="pm-cta pm-cta--primary">
            מתחילים בחינם
            <ArrowLeft size={17} aria-hidden="true" />
          </Link>
          <Link to="/pricing" className="pm-cta pm-cta--ghost">
            לצפייה במסלולים
          </Link>
        </motion.div>

        <motion.div
          className="crm-hero__stats"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.88, duration: 0.7, ease }}
        >
          <StatStrip stats={crmHeroStats} />
        </motion.div>
      </div>
    </section>
  );
}
