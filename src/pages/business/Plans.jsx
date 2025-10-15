import React, { useState } from "react";
import "../../styles/Plans.css";

export default function Plans() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  const plans = {
    monthly: { price: 150, total: 150, save: 0 },
    yearly: { price: 1600, total: 1600, save: 200 }, // $200 savings compared to monthly
  };

  const { price, total, save } = plans[selectedPeriod];

  return (
    <div className="plans-page">
      {/* 🌟 Header */}
      <header className="plans-header">
        <h1>Choose Your BizUply Plan</h1>
        <p>
          All the tools your business needs — in one smart platform.  
          Start your <strong>14-day free trial</strong> today. No credit card required.
        </p>
      </header>

      {/* 🔘 Toggle Between Monthly / Yearly */}
      <div className="plans-toggle">
        {["monthly", "yearly"].map((period) => (
          <button
            key={period}
            className={`toggle-btn ${selectedPeriod === period ? "active" : ""}`}
            onClick={() => setSelectedPeriod(period)}
          >
            {period === "monthly" ? "Monthly" : "Yearly"}
          </button>
        ))}
      </div>

      {/* 💼 Main Plan Card */}
      <section className="plan-card-container">
        <div className="plan-card highlight">
          <h2>BizUply Professional Plan</h2>
          <p className="plan-desc">
            Access every BizUply feature — including your AI Partner, CRM, messaging,  
            client reviews, and collaboration tools — all from one powerful dashboard.
          </p>

          <div className="plan-price">
            <span className="price">${price}</span>
            <span className="duration">
              {selectedPeriod === "monthly" ? "/month" : "/year"}
            </span>
          </div>

          <ul className="plan-features">
  <li><span className="checkmark">✔</span> Professional Business Page</li>
  <li><span className="checkmark">✔</span> Smart CRM for Clients & Appointments</li>
  <li><span className="checkmark">✔</span> Built-in Messaging System</li>
  <li><span className="checkmark">✔</span> Ratings & Reviews Management</li>
  <li><span className="checkmark">✔</span> Business Collaboration Network</li>
  <li><span className="checkmark">✔</span> AI Business Advisor & Smart Insights</li>
  <li><span className="checkmark">✔</span> Create and Track Client Tasks or Follow-ups</li>
  <li><span className="checkmark">✔</span> Log and Document Client Calls or Meetings</li>
  <li><span className="checkmark">✔</span> Automated Notifications and Smart Alerts</li>
  <li><span className="checkmark">✔</span> Predictive Analytics & Personalized Recommendations</li>
</ul>

          <button className="plan-btn primary">Try Free for 14 Days</button>

          {/* 🧾 Summary Box */}
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
