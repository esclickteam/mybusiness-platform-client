import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Billing.css";

/**
 * 💳 Billing & Subscription Page
 * כולל ניהול מנוי + היסטוריית תשלומים
 */
export default function SubscriptionPlanCard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [cancelled, setCancelled] = useState(user?.subscriptionCancelled || false);
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

  /* 🚫 ביטול חידוש אוטומטי */
  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel your subscription renewal?")) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/paypal/subscription/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?._id }),
      });

      if (!res.ok) throw new Error("Failed to cancel subscription");
      setCancelled(true);
      alert("Auto-renewal cancelled. You’ll keep access until your billing period ends.");
    } catch (err) {
      console.error(err);
      alert("Failed to cancel renewal. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  /* 💰 שליפת היסטוריית תשלומים */
  useEffect(() => {
    if (!user?._id) return;
    const fetchPayments = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/paypal/payments/user/${user._id}`);
        const data = await res.json();
        setPayments(data || []);
      } catch (err) {
        console.error("Failed to load payments:", err);
      } finally {
        setLoadingPayments(false);
      }
    };
    fetchPayments();
  }, [user?._id]);

  /* 📅 נתונים כלליים */
  const plan = user?.subscriptionPlan || "trial";
  const isActive = user?.isSubscriptionValid && !(!cancelled && user?.subscriptionStatus === "CANCELLED");
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

  // 🧠 סטטוס חכם
  let statusText = "Cancelled / Expired";
  let statusClass = "status-cancelled";
  let tooltip = "";

  if (isActive && cancelled) {
    statusText = "Active (auto-renew cancelled)";
    statusClass = "status-cancelled-soon";
    tooltip = "Your plan remains active until the end of your current billing period.";
  } else if (isActive) {
    statusText = "Active";
    statusClass = "status-active";
  }

  return (
    <div className="billing-page">
      <div className="billing-container">
        {/* 🧭 Header */}
        <div className="billing-header">
          <h1>Billing & Subscription</h1>
          <p>Manage your current plan, payments, and renewals.</p>
        </div>

        {/* 💳 Subscription Info */}
        <div className="subscription-info">
          <div className="info-row">
            <span>Plan:</span>
            <strong>{planName}</strong>
          </div>

          <div className="info-row">
            <span>Status:</span>
            <div className="status-wrapper" title={tooltip}>
              <strong className={statusClass}>{statusText}</strong>
              {tooltip && <span className="tooltip-icon">ℹ️</span>}
            </div>
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

        {/* 🔘 Buttons */}
        {isActive && plan === "monthly" && !cancelled && (
          <button className="cancel-btn" onClick={handleCancel} disabled={loading}>
            {loading ? "Cancelling..." : "Cancel Auto-Renewal"}
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

        {/* 💰 Payment History */}
        <div className="payment-history">
          <h2>Payment History</h2>
          {loadingPayments ? (
            <p>Loading payments...</p>
          ) : payments.length === 0 ? (
            <p className="no-payments">No payments found.</p>
          ) : (
            <table className="payment-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id}>
                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td>{p.plan?.toUpperCase() || "-"}</td>
                    <td>${p.amount?.toFixed(2) || "0.00"}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          p.status === "paid" || p.status === "active"
                            ? "paid"
                            : p.status.includes("cancelled")
                            ? "cancelled"
                            : "pending"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 📞 Support */}
        <div className="billing-support">
          Need help? <a href="/contact">Contact Support</a>
        </div>
      </div>
    </div>
  );
}
