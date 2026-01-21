import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import "./TrialExpiredModal.css";

/**
 * 💜 TrialExpiredModal
 * מוצג כאשר תקופת הניסיון הסתיימה
 * מפנה ישירות ל־Stripe Checkout ($119 monthly)
 */
export default function TrialExpiredModal() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  /* ===========================
     🚀 Redirect to Stripe – $119 Monthly
  =========================== */
  const handleUpgrade = async () => {
  console.log("🟣 [TrialExpiredModal] Upgrade clicked");

  if (!user?.userId) {
    console.error("❌ No userId – cannot start checkout", user);
    return;
  }

  try {
    setLoading(true);

    console.log("➡️ Creating Stripe Checkout session", {
      userId: user.userId,
      plan: "monthly",
    });

    const res = await API.post(
      "/stripe/create-checkout-session",
      {
        userId: user.userId, // ✅ זה השדה הנכון
        plan: "monthly",     // $119
      }
    );

    console.log("✅ Stripe response:", res.data);

    if (res.data?.url) {
      console.log("🔗 Redirecting to Stripe:", res.data.url);
      window.location.href = res.data.url; // 🔥 redirect אמיתי
    } else {
      throw new Error("Stripe checkout URL missing");
    }
  } catch (err) {
    console.error("❌ Stripe redirect failed:", err);
    alert("Unable to start checkout. Please try again.");
    setLoading(false);
  }
};


  /* ===========================
     🔙 Back to Home (ללא logout)
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
            {loading ? "Redirecting to payment…" : "Upgrade & Keep My Access"}
          </button>

          <button
            className="back-btn"
            onClick={handleBackHome}
            disabled={loading}
          >
            ← Back to Home
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

        {/* 💜 Soft footer */}
        <p className="note">
          We’re glad you tried <strong>BizUply</strong>.  
          Let’s keep your business running smoothly 🚀
        </p>
      </div>
    </div>
  );
}
