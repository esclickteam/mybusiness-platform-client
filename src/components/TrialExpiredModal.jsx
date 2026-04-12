import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./TrialExpiredModal.css";

/**
 * 💜 TrialExpiredModal
 * מוצג כאשר תקופת הניסיון הסתיימה
 * מפנה לעמוד חבילות במקום Stripe
 */
export default function TrialExpiredModal() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  /* ===========================
     🚀 Redirect to Plans Page
  =========================== */
  const handleUpgrade = () => {
    console.log("🟣 Redirecting to plans page");

    setLoading(true);

    // נותן אפקט לחיצה קטן
    setTimeout(() => {
      navigate("/plans?from=trial", { replace: true });
    }, 150);
  };

  /* ===========================
     🔙 Back to Home
  =========================== */
  const handleBackHome = () => {
    console.log("↩️ Back to home clicked");
    navigate("/", { replace: true });
  };

  return (
    <div className="trial-overlay">
      <div
        className="trial-modal fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="trial-title"
      >
        {/* 🔹 Progress Bar */}
        <div className="trial-progress">
          <div className="trial-progress-fill" />
        </div>

        {/* 🕓 Title */}
        <h2 id="trial-title" className="trial-title">
          ⏳ Your 14-Day Free Trial Has Ended
        </h2>

        {/* 💬 Description */}
        <p className="trial-text">
          Upgrade now to keep using <strong>BizUply’s</strong> smart automations,
          CRM, and AI tools.
        </p>

        {/* ⚡ Urgency */}
        <p className="trial-urgency">
          Don’t lose access to your data and automations.
        </p>

        {/* 🔘 Actions */}
        <div className="trial-buttons">
          <button
            className="upgrade-btn"
            onClick={handleUpgrade}
            disabled={loading}
          >
            {loading ? "Loading plans..." : "Upgrade & Keep My Access"}
          </button>
        </div>

        {/* 💬 Secondary CTA */}
        <p
          className="contact-link"
          onClick={() => {
            console.log("📩 Contact us clicked");
            navigate("/contact");
          }}
        >
          Need more time? <span>Contact us for an extension</span>
        </p>

        {/* 💜 Footer */}
        <p className="note">
          We’re glad you tried <strong>BizUply</strong>.  
          Let’s keep your business running smoothly 🚀
        </p>
      </div>
    </div>
  );
}