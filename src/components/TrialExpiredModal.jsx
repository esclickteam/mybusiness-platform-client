import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./TrialExpiredModal.css";

/**
 * 💜 TrialExpiredModal
 * מוצג כאשר תקופת ניסיון הסתיימה
 * ללא logout, ללא ניתוק, UX SaaS תקני
 */
export default function TrialExpiredModal() {
  const navigate = useNavigate();
  const { user } = useAuth();

  /* ===========================
     🔁 ניווט לבילינג (בדשבורד)
  =========================== */
  const handleUpgrade = () => {
    if (!user?.businessId) return;
    navigate(
      `/business/${user.businessId}/dashboard/billing`,
      { replace: true }
    );
  };

  /* ===========================
     🔙 חזרה לדף הבית (ללא logout)
  =========================== */
  const handleBackHome = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="trial-overlay">
      <div className="trial-modal fade-in" role="dialog" aria-modal="true">

        {/* 🔹 Progress Bar */}
        <div className="trial-progress">
          <div className="trial-progress-fill" />
        </div>

        {/* 🕓 כותרת */}
        <h2 className="trial-title">
          ⏳ Your 14-Day Free Trial Has Ended
        </h2>

        {/* 💬 טקסט */}
        <p className="trial-text">
          Upgrade now to keep using{" "}
          <strong>BizUply’s</strong> smart automations,
          CRM, and AI tools.
        </p>

        {/* ⚡ דחיפות */}
        <p className="trial-urgency">
          Don’t lose access to your data and automations.
        </p>

        {/* 🔘 כפתורים */}
        <div className="trial-buttons">
          <button
            className="upgrade-btn"
            onClick={handleUpgrade}
          >
            Upgrade & Keep My Access
          </button>

          <button
            className="back-btn"
            onClick={handleBackHome}
          >
            ← Back to Home
          </button>
        </div>

        {/* 💬 CTA משני */}
        <p
          className="contact-link"
          onClick={() => navigate("/contact")}
        >
          Need more time? <span>Contact us for an extension</span>
        </p>

        {/* 💜 Footer רך */}
        <p className="note">
          We’re glad you tried <strong>BizUply</strong>.  
          Let’s keep your business running smoothly 🚀
        </p>
      </div>
    </div>
  );
}
