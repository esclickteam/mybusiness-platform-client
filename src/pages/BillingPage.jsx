import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Billing.css";

/**
 * 💳 Billing & Subscription Page – Professional Canva-Style UX
 */
export default function SubscriptionPlanCard() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);

  const isCancelled = user?.subscriptionCancelled || false;

  const rawBase = import.meta.env.VITE_API_URL || "";
  const API_BASE = rawBase.endsWith("/api") ? rawBase : `${rawBase}/api`;
  const userId = user?._id || user?.userId || user?.id;

  /* 🚫 ביטול חידוש אוטומטי */
  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel auto-renewal?")) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/stripe/cancel-subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) throw new Error(`Failed to cancel subscription (${res.status})`);

      await refreshUser();

      alert("Auto-renewal cancelled. You’ll keep access until the end of your billing cycle.");
      
    } catch (err) {
      console.error("❌ Cancel subscription error:", err);
      alert("Failed to cancel renewal. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  /* 💰 היסטוריית תשלומים */
  useEffect(() => {
    if (!userId) return;

    const fetchPayments = async () => {
      try {
        const res = await fetch(`${API_BASE}/stripe/payments/user/${userId}`);
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const data = await res.json();
        setPayments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Failed to load payments:", err);
      } finally {
        setLoadingPayments(false);
      }
    };

    fetchPayments();
  }, [userId, API_BASE]);

  /* 📅 נתוני מנוי */
  const plan = user?.subscriptionPlan || "trial";
  const endDate = user?.subscriptionEnd
    ? new Date(user.subscriptionEnd).toLocaleDateString()
    : "—";

  const statusText = user?.isSubscriptionValid ? "Active" : "Cancelled / Expired";
  const statusClass = user?.isSubscriptionValid ? "status-active" : "status-cancelled";

  const planName =
    plan === "yearly"
      ? "BizUply Yearly Plan"
      : plan === "monthly"
      ? "BizUply Monthly Plan"
      : "Trial Plan";

  const billingType =
    plan === "monthly"
      ? isCancelled
        ? "Recurring (auto-renew off)"
        : "Recurring (auto-renew)"
      : plan === "yearly"
      ? "One-time payment"
      : "Trial Access";

  return (
    <div className="billing-page">
      <div className="billing-container fade-in">

        {/* 🧭 Header */}
        <div className="billing-header">
          <h1>Billing & Subscription</h1>
          <p>Manage your current plan, payments, and renewals.</p>
        </div>

        {/* 💳 Subscription Info */}
        <div className="subscription-info card">

          <div className="info-row">
            <span>Plan:</span>
            <strong>{planName}</strong>
          </div>

          <div className="info-row">
            <span>Status:</span>
            <strong className={statusClass}>{statusText}</strong>
          </div>

          {user?.isSubscriptionValid && isCancelled && (
            <div className="note-canva">
              You will lose access on <strong>{endDate}</strong>
            </div>
          )}

          <div className="info-row">
            <span>{plan === "monthly" ? "Next Billing:" : "Valid Until:"}</span>
            <strong>{endDate}</strong>
          </div>

          <div className="info-row">
            <span>Billing Type:</span>
            <strong>{billingType}</strong>
          </div>

          {/* Buttons */}
          {user?.isSubscriptionValid && plan === "monthly" && !isCancelled && (
            <button className="cancel-btn" onClick={handleCancel} disabled={loading}>
              {loading ? "Cancelling..." : "Cancel Auto-Renewal"}
            </button>
          )}

          {user?.isSubscriptionValid && isCancelled && (
            <button className="renew-btn" onClick={() => (window.location.href = "/plans")}>
              Resume Subscription
            </button>
          )}

          {!user?.isSubscriptionValid && (
            <button className="renew-btn" onClick={() => (window.location.href = "/plans")}>
              Renew / Upgrade Plan
            </button>
          )}
        </div>

        {/* 💰 Payment History */}
        <div className="payment-history card">
          <h2>Payment History</h2>

          {loadingPayments ? (
            <p className="loading">Loading payments...</p>
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
                            : p.status?.includes("cancelled")
                            ? "cancelled"
                            : "pending"
                        }`}
                      >
                        {p.status === "paid"
                          ? "Completed"
                          : p.status === "active"
                          ? "Active"
                          : p.status?.charAt(0).toUpperCase() + p.status?.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="billing-support">
          Need help? <a href="/contact">Contact Support</a>
        </div>
      </div>
    </div>
  );
}
