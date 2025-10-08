```javascript
import React, { useState, useEffect } from "react";
import "./PlanComparisonGrid.css";

const plans = [
  {
    key: "free",
    name: "Free",
    price: "₪0",
    color: "#f44336",
    features: [false, false, false, false],
  },
  {
    key: "advanced",
    name: "Advanced",
    price: "₪89",
    color: "#9c27b0",
    features: [true, true, false, false],
  },
  {
    key: "professional",
    name: "Professional",
    price: "₪189",
    color: "#3f51b5",
    features: [true, true, true, false],
  },
  {
    key: "vip",
    name: "VIP",
    price: "₪219",
    color: "#ff9800",
    features: [true, true, true, true],
  },
];

const features = [
  "Receiving inquiries",
  "Chat with customers",
  "Store/queue management",
  "Business collaboration",
];

const PlanComparisonGrid = ({ onSelectPlan }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? (
    <div className="comparison-cards-wrapper">
      <h2 className="comparison-title">Package Comparison</h2>
      {plans.map((plan) => (
        <div
          key={plan.key}
          className="comparison-card"
          style={{ borderTop: `6px solid ${plan.color}` }}
        >
          <h3 style={{ backgroundColor: plan.color }}>{plan.name}</h3>
          <p className="price">{plan.price} / month</p>
          <ul>
            {features.map((feature, idx) => (
              <li key={idx}>
                {plan.features[idx] ? "✔️" : "❌"} {feature}
              </li>
            ))}
          </ul>
          <button
            onClick={() => onSelectPlan(plan.key)}
            className="select-button"
          >
            Select {plan.name} Package
          </button>
        </div>
      ))}
    </div>
  ) : (
    <div className="comparison-table-wrapper">
      <h2 className="comparison-title">Package Comparison</h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr repeat(4, 1fr)",
        gap: "12px",
        alignItems: "stretch",
        minWidth: "700px"
      }}>
        <div style={{ fontWeight: "bold", paddingTop: "58px" }}>
          {features.map((feature, index) => (
            <div key={index} style={{ padding: "12px 8px", minHeight: "50px" }}>{feature}</div>
          ))}
        </div>
        {plans.map((plan) => (
          <div
            key={plan.key}
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              textAlign: "center",
              borderTop: `6px solid ${plan.color}`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{
                backgroundColor: plan.color,
                color: "white",
                padding: "10px",
                fontWeight: "bold",
                fontSize: "18px"
              }}>{plan.name}</div>
              <div style={{ fontSize: "16px", margin: "12px 0" }}>{plan.price} / month</div>
              {plan.features.map((enabled, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "12px 8px",
                    color: enabled ? "#4caf50" : "#f44336",
                    fontWeight: "bold",
                    fontSize: "18px",
                    minHeight: "50px"
                  }}
                >
                  {enabled ? "✔" : "✖"}
                </div>
              ))}
            </div>
            <button
              onClick={() => onSelectPlan(plan.key)}
              className="select-button"
            >
              Select {plan.name} Package
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanComparisonGrid;
```