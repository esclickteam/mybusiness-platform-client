import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Billing.css";

export default function SubscriptionPlanCard() {
  const { user, refreshUser, setUser } = useAuth();
  const navigate = useNavigate();

  const [loadingCancel, setLoadingCancel] = useState(false);
  const [loadingResume, setLoadingResume] = useState(false);

  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);

  const [infoMessage, setInfoMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const isCancelled = Boolean(user?.subscriptionCancelled);
  const isActive = Boolean(user?.isSubscriptionValid);

  const rawBase = import.meta.env.VITE_API_URL || "";
  const API_BASE = rawBase.endsWith("/api") ? rawBase : `${rawBase}/api`;

  const userId = user?._id || user?.userId || user?.id;

  /* =========================================================
      🚫 Cancel Auto Renew
  ========================================================= */
  const handleCancel = async () => {
    setInfoMessage(null);
    setErrorMessage(null);
    setLoadingCancel(true);

    try {
      const res = await fetch(`${API_BASE}/stripe/cancel-subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) throw new Error(`Failed to cancel subscription`);

      setUser((prev) => ({
        ...prev,
        subscriptionCancelled: true,
      }));

      await refreshUser(true);

      setInfoMessage(
        "Auto-renewal was cancelled. You’ll keep access until the end of your billing cycle."
      );
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to cancel renewal. Please contact support.");
    } finally {
      setLoadingCancel(false);
    }
  };

  /* =========================================================
      🔄 Resume Auto Renew
  ========================================================= */
  const handleResume = async () => {
    setInfoMessage(null);
    setErrorMessage(null);
    setLoadingResume(true);

    try {
      const res = await fetch(`${API_BASE}/stripe/resume-subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) throw new Error(`Resume failed`);

      setUser((prev) => ({
        ...prev,
        subscriptionCancelled: false,
      }));

      await refreshUser(true);

      setInfoMessage("Auto-renewal has been successfully restored.");
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to resume subscription. Please contact support.");
    } finally {
      setLoadingResume(false);
    }
  };

  /* =========================================================
      💰 Load Payment History
  ========================================================= */
  useEffect(() => {
    if (!userId) return;

    const fetchPayments = async () => {
      try {
        const res = await fetch(`${API_BASE}/stripe/payments/user/${userId}`);
        if (!res.ok) throw new Error();

        const data = await res.json();
        setPayments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPayments(false);
      }
    };

    fetchPayments();
  }, [userId, API_BASE]);

  /* =========================================================
      📅 Subscription Details
  ========================================================= */
  const plan = user?.subscriptionPlan || "trial";

  const endDate = user?.subscriptionEnd
    ? new Date(user.subscriptionEnd).toLocaleDateString()
    : "—";

  const statusText = isActive
    ? isCancelled
      ? "Active (auto-renew off)"
      : "Active"
    : "Expired";

  const statusClass = isActive ? "status-active" : "status-cancelled";

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
        <div className="billing-header">
          <h1>Billing & Subscription</h1>
          <p>Manage your plan, renewals and payments.</p>
        </div>

        <div className="subscription-info card">
          <div className="info-row">
            <span>Plan</span>
            <strong>{planName}</strong>
          </div>

          <div className="info-row">
            <span>Status</span>
            <strong className={statusClass}>{statusText}</strong>
          </div>

          <div className="info-row">
            <span>{plan === "monthly" ? "Next Billing" : "Valid Until"}</span>
            <strong>{endDate}</strong>
          </div>

          <div className="info-row">
            <span>Billing Type</span>
            <strong>{billingType}</strong>
          </div>

          {infoMessage && (
            <div className="info-message success">{infoMessage}</div>
          )}

          {errorMessage && (
            <div className="info-message error">{errorMessage}</div>
          )}

          {isActive && plan === "monthly" && !isCancelled && (
            <button
              className="cancel-btn"
              onClick={handleCancel}
              disabled={loadingCancel}
            >
              {loadingCancel ? "Cancelling…" : "Turn off auto-renew"}
            </button>
          )}

          {isActive && isCancelled && (
            <button
              className="renew-btn"
              onClick={handleResume}
              disabled={loadingResume}
            >
              {loadingResume ? "Resuming…" : "Resume subscription"}
            </button>
          )}

          {!isActive && (
            <button className="renew-btn" onClick={() => navigate("/pricing")}>
              Renew / Upgrade Plan
            </button>
          )}
        </div>

        <div className="payment-history card">
          <h2>Payment History</h2>

          {loadingPayments ? (
            <p className="loading">Loading payments…</p>
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
                        {p.status}
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
