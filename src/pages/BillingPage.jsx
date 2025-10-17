import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Billing.css"; // ✅ נפרד מ-Plans.css

/**
 * 💳 SubscriptionPlanCard
 * הצגת פרטי מנוי וביטול דרך עמוד Billing
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
    <div className="billing-page">
      <div className="billing-container">
        <div className="billing-header">
          <h1>Billing & Subscription</h1>
          <p>Manage your active plan, payments, and renewals.</p>
        </div>

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

        <div className="billing-support">
          Need help? <a href="/contact">Contact Support</a>
        </div>
      </div>
    </div>
  );
}
