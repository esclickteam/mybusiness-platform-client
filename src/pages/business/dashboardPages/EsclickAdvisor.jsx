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
  const [appointments, setAppointments] = useState([]); // שמירת רשימת פגישות
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null); // מזהה פגישה נבחרת
  const { user, loading } = useAuth();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user?.businessId || !token) {
      setBusinessDetails(null);
      setAppointments([]);
      setSelectedAppointmentId(null);
      return;
    }

    // חיבור לסוקט
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
    if (!user?.businessId || !token) {
      setBusinessDetails(null);
      setAppointments([]);
      setSelectedAppointmentId(null);
      return;
    }

    // בקשה לקבלת פרטי העסק
    fetch(`/api/business/${user.businessId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch business details");
        return res.json();
      })
      .then(data => {
        setBusinessDetails(data);
      })
      .catch(err => {
        console.error(err);
        setBusinessDetails(null);
      });

    // בקשה לקבלת רשימת פגישות לעסק (צריך לוודא שהנתיב תקין)
    fetch(`/api/appointments?businessId=${user.businessId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch appointments");
        return res.json();
      })
      .then(data => {
        setAppointments(data);
        if (data.length > 0) setSelectedAppointmentId(data[0]._id); // בחר פגישה ראשונה כברירת מחדל
      })
      .catch(err => {
        console.error(err);
        setAppointments([]);
        setSelectedAppointmentId(null);
      });
  }, [user?.businessId, token]);

  useEffect(() => {
    if (activeTab === "business") {
      setHasBusinessNotification(false);
    }
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleAppointmentChange = (e) => {
    setSelectedAppointmentId(e.target.value);
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
        return (
          <>
            {/* בחירת פגישה לשליחת תזכורת */}
            <label>
              בחר פגישה לשליחת תזכורת:
              <select value={selectedAppointmentId || ""} onChange={handleAppointmentChange}>
                <option value="" disabled>בחר פגישה</option>
                {appointments.map((appt) => (
                  <option key={appt._id} value={appt._id}>
                    {appt.clientName} - {appt.date} {appt.time}
                  </option>
                ))}
              </select>
            </label>

            <AiPartnerTab
              businessId={user?.businessId}
              token={token}
              appointmentId={selectedAppointmentId}
            />
          </>
        );
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
