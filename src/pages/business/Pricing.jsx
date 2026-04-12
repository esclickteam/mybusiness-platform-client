import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Pricing.css";

export default function Plans() {
  const { user } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL;
  const userId = user?._id || user?.userId || user?.id;

  const now = new Date();

  const trialExpired =
    user?.subscriptionPlan === "trial" &&
    user?.subscriptionEnd &&
    new Date(user.subscriptionEnd) < now;

  const handleCheckout = async (plan) => {
    try {
      setLoadingPlan(plan);

      if (!userId) {
        alert("User data not loaded yet.");
        return;
      }

      const res = await fetch(`${API_BASE}/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          plan,
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
      setLoadingPlan(null);
    }
  };

  const features = [
    "Professional Business Page",
    "Smart CRM for Clients & Appointments",
    "Built-in Messaging System",
    "Ratings & Reviews Management",
    "Business Collaboration Network",
    "AI Business Advisor & Smart Insights",
    "Create and Track Client Tasks",
    "Log and Document Client Calls",
    "Automated Notifications",
    "Predictive Analytics",
  ];

  const handleClick = (type) => {
    setSelectedPlan(type);

    // נותן זמן לצביעה לפני מעבר
    setTimeout(() => {
      handleCheckout(type);
    }, 120);
  };

  const renderButton = (type, label) => {
    const isSelected = selectedPlan === type;
    const isLoading = loadingPlan === type;

    return (
      <button
        className={`plan-btn ${isSelected ? "selected" : ""}`}
        aria-pressed={isSelected}
        onClick={() => handleClick(type)}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : label}
      </button>
    );
  };

  return (
    <div className="plans-page">
      <header className="plans-header">
        <h1>Choose Your BizUply Plan</h1>

        <p>
          All the tools your business needs — in one smart platform.{" "}
          {!trialExpired ? (
            <>
              Start your <strong>14-day free trial</strong>. No credit card required.
            </>
          ) : (
            <>Your free trial has ended. Choose a plan below to continue.</>
          )}
        </p>
      </header>

      <section className="plan-card-container two-plans">
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
            {features.map((f, i) => (
              <li key={i}>✔ {f}</li>
            ))}
          </ul>

          {renderButton("monthly", "Start Monthly")}
        </div>

        <div className="plan-card highlight">
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
            {features.map((f, i) => (
              <li key={i}>✔ {f}</li>
            ))}
          </ul>

          {renderButton("yearly", "Start Yearly")}
        </div>
      </section>
    </div>
  );
}