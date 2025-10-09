// src/components/dashboard/BusinessComparison.js
import React from "react";

const BusinessComparison = ({ stats }) => {
  if (!stats || typeof stats !== "object") return null;

  const myOrders = stats.orders_count || 0;
  const average = stats.average_orders_in_field || 0;

  if (average === 0) {
    return (
      <div className="graph-box">
        <h4>Industry Comparison</h4>
        <p>Not enough data for a comparison.</p>
      </div>
    );
  }

  const diff = myOrders - average;
  const diffPercent = Math.round((diff / average) * 100);
  const isAbove = diff > 0;

  return (
    <div className="graph-box">
      <h4>📊 Comparison to Your Industry</h4>
      <p style={{ fontSize: "15px" }}>
        In the <strong>{stats.businessType || "Businesses"}</strong> category, the average monthly
        orders are: <strong>{average}</strong>
      </p>
      <p
        style={{
          fontSize: "16px",
          color: isAbove ? "green" : "red",
          fontWeight: "bold",
        }}
      >
        Your business: {myOrders} ({isAbove ? "+" : ""}
        {diffPercent}% {isAbove ? "above" : "below"} average)
      </p>
    </div>
  );
};

export default BusinessComparison;
