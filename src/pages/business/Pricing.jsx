import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Pricing.css";

export default function Plans() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const plans = {
    monthly: { price: 149, total: 149, save: 0 },
    yearly: { price: 1490, total: 1490, save: 298 },
  };

  const { price, total, save } = plans[selectedPeriod];

  const API_BASE = import.meta.env.VITE_API_URL;
  const userId = user?._id || user?.userId || user?.id;

  const now = new Date();
  const trialExpired =
    user?.subscriptionPlan === "trial" &&
    user?.subscriptionEnd &&
    new Date(user.subscriptionEnd) < now;

  /* ========================================
      🟦 STRIPE CHECKOUT
  ======================================== */
  const handleStripeCheckout = async () => {
    try {
      setLoading(true);

      if (!userId) {
        alert("User data not loaded yet.");
        return;
      }

      const res = await fetch(`${API_BASE}/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          plan: selectedPeriod,
        }),
      });

      const data = await res.json();

      if (!data.url) {
        alert("Failed to start Stripe Checkout");
        return;
      }

      window.location.href = data.url;

    } catch (err) {
      console.error(err);
      alert("Error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="plans-page">
      <header className="plans-header">
        <h1>Choose Your BizUply Plan</h1>
        <p>
          All the tools your business needs — in one smart platform.{" "}
          {!trialExpired ? (
            <>
              Start your <strong>14-day free trial</strong> today. No credit
              card required.
            </>
          ) : (
            <>
              Your free trial has ended. Choose a plan below to continue
              enjoying BizUply.
            </>
          )}
        </p>
      </header>

      <div className="plans-toggle">
        {["monthly", "yearly"].map((period) => (
          <button
            key={period}
            className={`toggle-btn ${
              selectedPeriod === period ? "active" : ""
            }`}
            onClick={() => setSelectedPeriod(period)}
          >
            {period === "monthly" ? "Monthly" : "Yearly"}
          </button>
        ))}
      </div>

      <section className="plan-card-container">
        <div className="plan-card highlight">
          <h2>BizUply Professional Plan</h2>

          <p className="plan-desc">
            Access every BizUply feature — including your AI Partner, CRM,
            messaging, client reviews, and collaboration tools — all from one
            powerful dashboard.
          </p>

          <div className="plan-price">
            <span className="price">${price}</span>
            <span className="duration">
              {selectedPeriod === "monthly" ? "/month" : "/year"}
            </span>
          </div>

          <ul className="plan-features">
            <li>✔ Professional Business Page</li>
            <li>✔ Smart CRM for Clients & Appointments</li>
            <li>✔ Built-in Messaging System</li>
            <li>✔ Ratings & Reviews Management</li>
            <li>✔ Business Collaboration Network</li>
            <li>✔ AI Business Advisor & Smart Insights</li>
            <li>✔ Create and Track Client Tasks</li>
            <li>✔ Log and Document Client Calls</li>
            <li>✔ Automated Notifications</li>
            <li>✔ Predictive Analytics</li>
          </ul>

          {success ? (
            <button className="plan-btn success">✅ Payment Successful!</button>
          ) : loading ? (
            <button className="plan-btn loading">Processing…</button>
          ) : (
            <button
              className="plan-btn primary"
              onClick={() => navigate("/register")}
            >
              Try Free for 14 Days
            </button>
          )}

          <div className="summary-box">
            <div className="summary-row">
              <span>Total to pay:</span>
              <strong>${total}</strong>
            </div>

            {save > 0 && (
              <div className="summary-row save">
                <span>You save:</span>
                <strong>${save}</strong>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}