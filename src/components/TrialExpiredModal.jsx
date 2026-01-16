import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./TrialExpiredModal.css";

/**
 * 💜 TrialExpiredModal – גרסה פרימיום עם Progress Bar ו-UX חכם
 * מוצג כשהניסיון נגמר לגמרי (100%)
 */
export default function TrialExpiredModal() {
  const navigate = useNavigate();
  const { logout } = useAuth(); // 👈 נשתמש בזה כדי לוודא יציאה מהדשבורד

  /* ===========================
     🔙 חזרה לדף הבית
     נבצע ניתוק כדי למנוע מהProtectedRoute
     להחזיר שוב למודאל לאחר הניווט
  =========================== */
  const handleBackHome = async () => {
    try {
      await logout(); // ניתוק המשתמש
    } catch (err) {
      console.error("Logout error:", err);
    }
    navigate("/", { replace: true }); // ניווט לדף הבית
  };

  return (
    <div className="trial-overlay">
      <div className="trial-modal fade-in">
        {/* 🔹 Progress Bar */}
        <div className="trial-progress">
          <div className="trial-progress-fill"></div>
        </div>

        {/* 🕓 כותרת ברורה */}
        <h2 className="trial-title">⏳ Your 14-Day Free Trial Has Ended</h2>

        {/* 💬 טקסט קצר וברור */}
        <p className="trial-text">
          Upgrade now to keep using <strong>BizUply’s</strong> smart automations,
          CRM, and AI tools.
        </p>

        {/* ⚡ תחושת דחיפות */}
        <p className="trial-urgency">
          Don’t lose access to your data and automations!
        </p>

        {/* 🔘 כפתורים */}
        <div className="trial-buttons">
          <button
            className="upgrade-btn"
            onClick={() => navigate("/pricing")}
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

        {/* 💬 CTA נוסף / בריחת חירום */}
        <p
          className="contact-link"
          onClick={() => navigate("/contact")}
        >
          Need more time? <span>Contact us for an extension</span>
        </p>

        {/* 💜 הודעת תודה רכה */}
        <p className="note">
          We’re glad you tried <strong>BizUply</strong>.  
          Let’s keep your business running smoothly 🚀
        </p>
      </div>
    </div>
  );
}
