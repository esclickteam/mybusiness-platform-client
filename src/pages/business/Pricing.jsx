import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Pricing.css";

export default function Plans() {
  const { user } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL;
  const userId = user?._id || user?.userId || user?.id;

  const now = new Date();

  const trialExpired =
    user?.subscriptionPlan === "trial" &&
    user?.subscriptionEnd &&
    new Date(user.subscriptionEnd) < now;

  /* =========================
     💳 STRIPE CHECKOUT
  ========================= */
  const handleCheckout = async (plan) => {
    try {
      setLoadingPlan(plan);

      if (!userId) {
        alert("User not ready");
        return;
      }

      const res = await fetch(
        `${API_BASE}/stripe/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            plan, // 🔥 monthly / yearly
          }),
        }
      );

      const data = await res.json();

      if (!data.url) {
        alert("Stripe failed");
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert("Error, try again");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="plans-page">

      {/* ================= HEADER ================= */}
      <header className="plans-header">
        <h1>Choose Your BizUply Plan</h1>

        <p>
          All the tools your business needs — in one smart platform.{" "}
          {!trialExpired ? (
            <>
              Start your <strong>14-day free trial</strong>. No credit card required.
            </>
          ) : (
            <>
              Your free trial has ended. Choose a plan to continue.
            </>
          )}
        </p>
      </header>

      {/* ================= PLANS ================= */}
      <section className="plan-card-container two-plans">

        {/* ================= MONTHLY ================= */}
        <div className="plan-card">
          <h2>Monthly Plan</h2>

          <div className="plan-price">
            <span className="price">$149</span>
            <span className="duration">/month</span>
          </div>

          <p className="plan-desc">
            Full access to all BizUply features. Flexible monthly billing.
          </p>

          <ul className="plan-features">
            <li>✔ All features included</li>
            <li>✔ AI Business Advisor</li>
            <li>✔ CRM & Messaging</li>
            <li>✔ Cancel anytime</li>
          </ul>

          <button
            className="plan-btn"
            onClick={() => handleCheckout("monthly")}
            disabled={loadingPlan === "monthly"}
          >
            {loadingPlan === "monthly"
              ? "Processing..."
              : "Start Monthly"}
          </button>
        </div>

        {/* ================= YEARLY (HIGHLIGHT) ================= */}
        <div className="plan-card highlight">

          <div className="badge">⭐ Most Popular</div>

          <h2>Yearly Plan</h2>

          <div className="plan-price">
            <span className="price">$1490</span>
            <span className="duration">/year</span>
          </div>

          <div className="yearly-info">
            <span>$124/month</span>
            <span className="save">Save $298</span>
          </div>

          <p className="plan-desc">
            Best value for serious businesses. Save money and grow faster.
          </p>

          <ul className="plan-features">
            <li>✔ Everything in Monthly</li>
            <li>✔ Save 20%</li>
            <li>✔ Priority support</li>
            <li>✔ Better long-term growth</li>
          </ul>

          <button
            className="plan-btn primary"
            onClick={() => handleCheckout("yearly")}
            disabled={loadingPlan === "yearly"}
          >
            {loadingPlan === "yearly"
              ? "Processing..."
              : "Start Yearly"}
          </button>
        </div>

      </section>

    </div>
  );
}