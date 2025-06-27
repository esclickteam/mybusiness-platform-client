// EsclickAdvisor.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { io } from "socket.io-client";

import BusinessAdvisorTab from "./esclickTabs/BusinessAdvisorTab";
import MarketingAdvisorTab from "./esclickTabs/MarketingAdvisorTab";
import AiPartnerTab from "./esclickTabs/AiPartnerTab";
import AiRecommendations from "./esclickTabs/AiRecommendations"; 
import "./EsclickAdvisor.css";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

const EsclickAdvisor = () => {
  const [activeTab, setActiveTab] = useState("business");
  const [hasBusinessNotification, setHasBusinessNotification] = useState(false);
  const [businessDetails, setBusinessDetails] = useState(null);
  const { user, loading } = useAuth();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user?.businessId || !token) return;

    // חיבור לסוקט עם אישור
    const socket = io(SOCKET_URL, {
      auth: { token, businessId: user.businessId },
      transports: ["websocket"],
    });

    socket.on("newRecommendation", () => {
      setHasBusinessNotification(true);
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.businessId, token]);

  useEffect(() => {
    if (!user?.businessId || !token) return;

    // בקשה לקבלת פרטי העסק מהשרת
    fetch(`/api/business/${user.businessId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setBusinessDetails(data);
      })
      .catch(console.error);
  }, [user?.businessId, token]);

  useEffect(() => {
    if (activeTab === "business") {
      setHasBusinessNotification(false);
    }
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderTab = () => {
    switch (activeTab) {
      case "business":
        return (
          <BusinessAdvisorTab
            businessId={user?.businessId}
            businessDetails={businessDetails}
          />
        );
      case "marketing":
        return <MarketingAdvisorTab businessId={user?.businessId} />;
      case "partner":
        return <AiPartnerTab businessId={user?.businessId} token={token} />;
      case "recommendations":
        return <AiRecommendations businessId={user?.businessId} token={token} />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div>טוען...</div>;
  }

  return (
    <div className="esclick-container">
      <h1 className="esclick-header">🧠 יועץ עסקליק</h1>

      <div className="tab-buttons">
        <button
          className={activeTab === "business" ? "active" : ""}
          onClick={() => handleTabChange("business")}
        >
          יועץ עסקי
          {hasBusinessNotification && <span className="notification-dot" />}
        </button>
        <button
          className={activeTab === "marketing" ? "active" : ""}
          onClick={() => handleTabChange("marketing")}
        >
          יועץ שיווקי
        </button>
        <button
          className={activeTab === "partner" ? "active" : ""}
          onClick={() => handleTabChange("partner")}
        >
          שותף AI אישי
        </button>
        <button
          className={activeTab === "recommendations" ? "active" : ""}
          onClick={() => handleTabChange("recommendations")}
        >
          המלצות AI
        </button>
      </div>

      <div className="tab-content">{renderTab()}</div>
    </div>
  );
};

export default EsclickAdvisor;
