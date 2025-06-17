// EsclickAdvisor.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { io } from "socket.io-client";

import BusinessAdvisorTab from "./esclickTabs/BusinessAdvisorTab";
import MarketingAdvisorTab from "./esclickTabs/MarketingAdvisorTab";
import BusinessXrayWrapper from "./esclickTabs/BusinessXrayWrapper";
import AiPartnerTab from "./esclickTabs/AiPartnerTab";
import "./EsclickAdvisor.css";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";
const API_URL = import.meta.env.VITE_API_URL;

const EsclickAdvisor = () => {
  const { user, loading } = useAuth();
  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState("business");
  const [hasAiNotification, setHasAiNotification] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);

  // טען שיחות העסק
  useEffect(() => {
    async function fetchConversations() {
      if (!user?.businessId || !token) return;
      try {
        const res = await fetch(
          `${API_URL}/conversations?businessId=${user.businessId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to load conversations");
        const data = await res.json();
        setConversations(data);
        // בחר שיחה ראשונה כברירת מחדל (אם קיימת)
        if (data.length > 0) {
          setActiveConversationId(data[0].conversationId || data[0]._id);
        }
      } catch (err) {
        console.error("Error loading conversations:", err);
      }
    }
    fetchConversations();
  }, [user?.businessId, token]);

  useEffect(() => {
    if (!user?.businessId || !token) return;

    const socket = io(SOCKET_URL, {
      auth: { token, businessId: user.businessId },
      transports: ["websocket"],
    });

    socket.on("newRecommendation", () => {
      setHasAiNotification(true);
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.businessId, token]);

  useEffect(() => {
    if (activeTab === "partner") {
      setHasAiNotification(false);
    }
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="esclick-container">
      <h1 className="esclick-header">🧠 יועץ עסקליק</h1>

      <div className="tab-buttons">
        <button
          className={activeTab === "business" ? "active" : ""}
          onClick={() => handleTabChange("business")}
        >
          יועץ עסקי
        </button>
        <button
          className={activeTab === "marketing" ? "active" : ""}
          onClick={() => handleTabChange("marketing")}
        >
          יועץ שיווקי
        </button>
        <button
          className={activeTab === "xray" ? "active" : ""}
          onClick={() => handleTabChange("xray")}
        >
          רנטגן עסקי
        </button>
        <button
          className={activeTab === "partner" ? "active" : ""}
          onClick={() => handleTabChange("partner")}
        >
          שותף AI אישי
          {hasAiNotification && <span className="notification-dot" />}
        </button>
      </div>

      {activeTab === "partner" && (
        <>
          {/* רשימת שיחות לבחירה */}
          <div className="conversation-selector">
            <h3>בחר שיחה:</h3>
            {conversations.length === 0 && <p>אין שיחות זמינות.</p>}
            <ul>
              {conversations.map((conv) => {
                const id = conv.conversationId || conv._id;
                return (
                  <li
                    key={id}
                    className={id === activeConversationId ? "active" : ""}
                    onClick={() => setActiveConversationId(id)}
                    style={{
                      cursor: "pointer",
                      fontWeight: id === activeConversationId ? "bold" : "normal",
                    }}
                  >
                    שיחה עם:{" "}
                    {conv.participants
                      .filter((p) => p !== user.businessId)
                      .join(", ")}
                  </li>
                );
              })}
            </ul>
          </div>

          <AiPartnerTab
            businessId={user?.businessId}
            token={token}
            conversationId={activeConversationId}
          />
        </>
      )}

      <div className="tab-content">
        {activeTab === "business" && <BusinessAdvisorTab />}
        {activeTab === "marketing" && <MarketingAdvisorTab />}
        {activeTab === "xray" && <BusinessXrayWrapper />}
      </div>
    </div>
  );
};

export default EsclickAdvisor;
