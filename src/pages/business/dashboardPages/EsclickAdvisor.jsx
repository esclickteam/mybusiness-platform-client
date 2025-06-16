import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // הנתיב תתאים למבנה שלך
import BusinessAdvisorTab from "./esclickTabs/BusinessAdvisorTab";
import MarketingAdvisorTab from "./esclickTabs/MarketingAdvisorTab";
import BusinessXrayWrapper from "./esclickTabs/BusinessXrayWrapper";
import AiPartnerTab from "./esclickTabs/AiPartnerTab";
import "./EsclickAdvisor.css";

const EsclickAdvisor = () => {
  const [activeTab, setActiveTab] = useState("business");

  // שליפת token ו-businessId מתוך הקונטקסט
  const { user, loading } = useAuth();
  const token = localStorage.getItem("token"); // או תוכל להעביר אותו גם בקונטקסט אם שמרת שם

  const renderTab = () => {
    switch (activeTab) {
      case "business":
        return <BusinessAdvisorTab />;
      case "marketing":
        return <MarketingAdvisorTab />;
      case "xray":
        return <BusinessXrayWrapper />;
      case "partner":
        return <AiPartnerTab businessId={user?.businessId} token={token} />;
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
          onClick={() => setActiveTab("business")}
        >
          יועץ עסקי
        </button>
        <button
          className={activeTab === "marketing" ? "active" : ""}
          onClick={() => setActiveTab("marketing")}
        >
          יועץ שיווקי
        </button>
        <button
          className={activeTab === "xray" ? "active" : ""}
          onClick={() => setActiveTab("xray")}
        >
          רנטגן עסקי
        </button>
        <button
          className={activeTab === "partner" ? "active" : ""}
          onClick={() => setActiveTab("partner")}
        >
          שותף AI אישי
        </button>
      </div>

      <div className="tab-content">{renderTab()}</div>
    </div>
  );
};

export default EsclickAdvisor;
