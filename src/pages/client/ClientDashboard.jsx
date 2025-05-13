// src/pages/client/ClientDashboard.jsx
import React, { useState } from "react";
import "./ClientDashboard.css";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function ClientDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("orders");

  const renderTabContent = () => {
    switch (activeTab) {
      case "search":
        return (
          <div className="placeholder">
            <h2>🔎 חיפוש עסקים</h2>
            <p>
              עכשיו תוכל לחפש עסקים.{" "}
              <Link to="/client/search">לעמוד החיפוש</Link>
            </p>
          </div>
        );
      case "orders":
        return (
          <div className="placeholder">
            <h2>📄 ההזמנות שלי</h2>
            <p>
              כאן יופיעו ההזמנות שביצעת.{" "}
              <Link to="/client/orders">לעמוד ההזמנות</Link>
            </p>
          </div>
        );
      case "messages":
        return (
          <div className="placeholder">
            <h2>💬 ההודעות שלי</h2>
            <p>
              כאן תוכל לנהל שיחות עם בעלי עסקים.{" "}
              <Link to="/client/messages">לעמוד ההודעות</Link>
            </p>
          </div>
        );
      case "favorites":
        return (
          <div className="placeholder">
            <h2>⭐ מועדפים</h2>
            <p>
              כאן יופיעו המועדפים שלך.{" "}
              <Link to="/client/favorites">לעמוד המועדפים</Link>
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="client-dashboard">
      <h1 className="client-dashboard-title">שלום {user.name} 👋</h1>
      <p className="client-dashboard-subtitle">מה תרצה לעשות היום?</p>

      <div className="client-tabs">
        <button
          className={`client-tab-button ${
            activeTab === "search" ? "active" : ""
          }`}
          onClick={() => setActiveTab("search")}
        >
          🔎 חיפוש עסקים
        </button>

        <button
          className={`client-tab-button ${
            activeTab === "orders" ? "active" : ""
          }`}
          onClick={() => setActiveTab("orders")}
        >
          📄 ההזמנות שלי
        </button>

        <button
          className={`client-tab-button ${
            activeTab === "messages" ? "active" : ""
          }`}
          onClick={() => setActiveTab("messages")}
        >
          💬 ההודעות שלי
        </button>

        <button
          className={`client-tab-button ${
            activeTab === "favorites" ? "active" : ""
          }`}
          onClick={() => setActiveTab("favorites")}
        >
          ⭐ מועדפים
        </button>
      </div>

      <div className="client-tab-content">{renderTabContent()}</div>
    </div>
  );
}
