import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Plans.css";

/**
 * 💳 SubscriptionPlanCard
 * עמוד הצגת מנוי – Billing & Subscription
 */
export default function SubscriptionPlanCard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

  /* 🚫 ביטול מנוי */
  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel your subscription?")) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/paypal/subscription/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?._id }),
      });

      if (!res.ok) throw new Error("Failed to cancel subscription");
      setCancelled(true);
      alert("Your subscription has been cancelled.");
    } catch (err) {
      console.error(err);
      alert("Failed to cancel subscription. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  /* 📅 נתונים */
  const plan = user?.subscriptionPlan || "trial";
  const isActive = user?.isSubscriptionValid && !cancelled;
  const endDate = user?.subscriptionEnd
    ? new Date(user.subscriptionEnd).toLocaleDateString()
    : "—";

  const planName =
    plan === "yearly"
      ? "BizUply Yearly Plan"
      : plan === "monthly"
      ? "BizUply Monthly Plan"
      : "Trial Plan";

  const billingType =
    plan === "monthly"
      ? "Recurring (auto-renew)"
      : plan === "yearly"
      ? "One-time payment"
      : "Trial Access";

  const statusClass = isActive ? "status-active" : "status-cancelled";
  const statusText = isActive ? "Active" : "Cancelled / Expired";

  /* 🎨 תצוגה */
  return (
    <div className="subscription-card">
      <h2 className="subscription-title">My Subscription</h2>

      <div className="subscription-info">
        <div className="info-row">
          <span>Plan:</span>
          <strong>{planName}</strong>
        </div>

        <div className="info-row">
          <span>Status:</span>
          <strong className={statusClass}>{statusText}</strong>
        </div>

        <div className="info-row">
          <span>{plan === "monthly" ? "Next Billing:" : "Valid Until:"}</span>
          <strong>{endDate}</strong>
        </div>

        <div className="info-row">
          <span>Billing Type:</span>
          <strong>{billingType}</strong>
        </div>
      </div>

      {isActive && plan === "monthly" && (
        <button
          className="cancel-btn"
          onClick={handleCancel}
          disabled={loading}
        >
          {loading ? "Cancelling..." : "Cancel Subscription"}
        </button>
      )}

      {!isActive && (
        <button
          className="renew-btn"
          onClick={() => (window.location.href = "/plans")}
        >
          Renew / Upgrade Plan
        </button>
      )}

      <p
        style={{
          textAlign: "center",
          marginTop: "1.2rem",
          color: "#666",
          fontSize: "0.9rem",
        }}
      >
        Need help?{" "}
        <a href="/help-center" style={{ color: "#6c63ff", fontWeight: 500 }}>
          Contact Support
        </a>
        .
      </p>
    </div>
  );
}
