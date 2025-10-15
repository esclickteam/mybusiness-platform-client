import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Plans.css";

function Plans() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const plans = [
    {
      id: "1",
      title: "Monthly Plan",
      price: 150,
      duration: "per month",
      savings: null,
      description: "Full access to all BizUply features. Flexible and cancel anytime.",
      features: [
        "AI-powered business assistant",
        "Smart CRM for clients & appointments",
        "Automated WhatsApp & email reminders",
        "Booking, payments, and reviews system",
      ],
      buttonText: "Try Free for 14 Days",
      highlight: false,
    },
    {
      id: "3",
      title: "Quarterly Plan",
      price: 420,
      duration: "every 3 months",
      savings: "Save $30",
      description: "Perfect for growing businesses with consistent client flow.",
      features: [
        "Everything in Monthly plan",
        "Advanced analytics dashboard",
        "AI automations and marketing insights",
        "Priority support and setup assistance",
      ],
      buttonText: "Try Free for 14 Days",
      highlight: true,
      badge: "Most Popular",
    },
    {
      id: "12",
      title: "Yearly Plan",
      price: 1500,
      duration: "per year",
      savings: "Save $300",
      description: "Best value — designed for professionals and studios.",
      features: [
        "Everything in Quarterly plan",
        "Dedicated account manager",
        "Early access to new BizUply AI features",
        "VIP onboarding & training",
      ],
      buttonText: "Try Free for 14 Days",
      highlight: false,
    },
  ];

  const handleSelectPlan = (plan) => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/checkout", {
      state: {
        planName: `BizUply ${plan.title}`,
        totalPrice: plan.price,
        duration: plan.id,
      },
    });
  };

  return (
    <div className="plans-page">
      {/* 💜 Header */}
      <header className="plans-header">
        <h1>Plans built for every business</h1>
        <p>
          Experience BizUply’s full power — one system, one price, unlimited possibilities.
          Start your free 14-day trial today.
        </p>
      </header>

      {/* 💎 Plans Grid */}
      <section className="plans-grid">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`plan-card ${plan.highlight ? "highlight" : ""}`}
          >
            {plan.badge && <div className="plan-badge">{plan.badge}</div>}
            <h2>{plan.title}</h2>
            <p className="plan-desc">{plan.description}</p>

            <div className="plan-price">
              ${plan.price}
              <span> / {plan.duration}</span>
            </div>

            {plan.savings && <p className="plan-savings">{plan.savings}</p>}

            <ul className="plan-features">
              {plan.features.map((f, i) => (
                <li key={i}>
                  <span className="checkmark">✓</span> {f}
                </li>
              ))}
            </ul>

            <button
              className={`plan-btn ${plan.highlight ? "primary" : "secondary"}`}
              onClick={() => handleSelectPlan(plan)}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </section>

      {/* 🧠 Footer Philosophy */}
      <footer className="plans-footer">
        <h3>💜 One platform for all businesses</h3>
        <p>
          Whether you’re an independent professional or a growing company — BizUply
          gives you the same advanced tools trusted by top businesses.
          <br />
          Full automation. Smart insights. Seamless growth.
        </p>
      </footer>
    </div>
  );
}

export default Plans;
