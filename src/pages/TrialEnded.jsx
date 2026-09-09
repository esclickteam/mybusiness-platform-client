import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import "./TrialEnded.css";

export default function TrialEnded() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="trial-ended-wrapper">
      <motion.div
        className="trial-ended-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="emoji">⏰</div>
        <h1>{t("billing.trialEnded.title")}</h1>
        <p className="desc">{t("billing.trialEnded.description")}</p>

        <button
          className="upgrade-btn"
          onClick={() => navigate("/pricing")}
        >
          {t("billing.trialEnded.upgradeCta")}
        </button>

        <button
          className="contact-btn"
          onClick={() => navigate("/contact")}
        >
          {t("billing.trialEnded.contactCta")}
        </button>

        <p className="small-text">{t("billing.trialEnded.footer")}</p>
      </motion.div>
    </div>
  );
}
