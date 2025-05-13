import React, { useState } from "react";
import "./ClientDashboard.css";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import OrdersPage from "../pages/client/OrdersPage";
import SearchBusinessPage from "../pages/client/SearchBusinessPage";
import FavoritesPage from "../pages/client/FavoritesPage";
import ChatPage from "../components/ChatPage";

export default function ClientDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("orders");

  const renderTabContent = () => {
    switch (activeTab) {
      case "orders":
        return <OrdersPage />;
      case "messages":
        return (
          <ChatPage
            isBusiness={false}
            userId={user.userId}
            clientProfilePic={user.avatarUrl}
            businessProfilePic={null}
            initialPartnerId={null}
          />
        );
      case "favorites":
        return <FavoritesPage />;
      case "search":
        return <SearchBusinessPage />;
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
          className={`client-tab-button ${activeTab === "search" ? "active" : ""}`}
          onClick={() => setActiveTab("search")}
        >
          🔎 חיפוש עסקים
        </button>

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
