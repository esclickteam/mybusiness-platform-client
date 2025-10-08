// src/components/dashboard/BusinessComparison.js
import React from "react";

const BusinessComparison = ({ stats }) => {
  if (!stats || typeof stats !== "object") return null;

  const myOrders = stats.orders_count || 0;
  const average = stats.average_orders_in_field || 0;

  if (average === 0) {
    return (
      <div className="graph-box">
        <h4>השוואה לתחום</h4>
        <p>אין מספיק נתונים להשוואה.</p>
      </div>
    );
  }

  const diff = myOrders - average;
  const diffPercent = Math.round((diff / average) * 100);
  const isAbove = diff > 0;

  return (
    <div className="graph-box">
      <h4>📊 השוואה לתחום שלך</h4>
      <p style={{ fontSize: "15px" }}>
        בתחום <strong>{stats.businessType || "עסקים"}</strong>, ממוצע ההזמנות החודשי הוא:{" "}
        <strong>{average}</strong>
      </p>
      <p style={{ fontSize: "16px", color: isAbove ? "green" : "red", fontWeight: "bold" }}>
        העסק שלך: {myOrders} ({isAbove ? "+" : ""}{diffPercent}% {isAbove ? "מעל" : "מתחת"} לממוצע)
      </p>
    </div>
  );
};

export default BusinessComparison;
