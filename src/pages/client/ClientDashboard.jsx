import React, { useState, useEffect } from "react";
import "./ClientDashboard.css";
import { Link, useNavigate } from "react-router-dom";

function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const [userName, setUserName] = useState("לקוח");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.name) {
      setUserName(user.name);
    }
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "orders":
        return <p>📄 כאן תוכל לצפות בהזמנות שביצעת.</p>;
      case "messages":
        return <p>💬 כאן תוכל לנהל שיחות עם בעלי עסקים.</p>;
      case "favorites":
        return <p>⭐ כאן תוכל לצפות בעסקים ששמרת.</p>;
      default:
        return null;
    }
  };

  return (
    <div className="client-dashboard">
      <h1 className="client-dashboard-title">שלום {userName} 👋</h1>
      <p className="client-dashboard-subtitle">מה תרצה לעשות היום?</p>

      <div className="client-tabs">
        <Link to="/search">
          <button className="client-tab-button">🔎 חיפוש עסקים</button>
        </Link>

        <button
          className={`client-tab-button ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          📄 ההזמנות שלי
        </button>

        <button
          className={`client-tab-button ${activeTab === "messages" ? "active" : ""}`}
          onClick={() => setActiveTab("messages")}
        >
          💬 ההודעות שלי
        </button>

        <button
          className={`client-tab-button ${activeTab === "favorites" ? "active" : ""}`}
          onClick={() => setActiveTab("favorites")}
        >
          ⭐ מועדפים
        </button>
      </div>

      <div className="client-tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default ClientDashboard;
