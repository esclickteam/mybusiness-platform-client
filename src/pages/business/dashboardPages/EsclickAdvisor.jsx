import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { io } from "socket.io-client";

import BusinessAdvisorTab from "./BizUplyTabs/BusinessAdvisorTab";
import MarketingAdvisorTab from "./BizUplyTabs/MarketingAdvisorTab";
import AiPartnerTab from "./BizUplyTabs/AiPartnerTab";
import AiRecommendations from "./BizUplyTabs/AiRecommendations"; 
import "./BizUplyAdvisor.css";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

const BizUplyAdvisor = () => {
  const [activeTab, setActiveTab] = useState("business");
  const [hasBusinessNotification, setHasBusinessNotification] = useState(false);
  const [businessDetails, setBusinessDetails] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const { user, loading } = useAuth();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user?.businessId || !token) {
      setBusinessDetails(null);
      setAppointments([]);
      setSelectedAppointmentId(null);
      return;
    }

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

    fetch(`/api/appointments?businessId=${user.businessId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch appointments");
        return res.json();
      })
      .then(data => {
        setAppointments(data);
        if (data.length > 0) setSelectedAppointmentId(data[0]._id);
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
            userId={user?._id}
            businessDetails={businessDetails}
            appointments={appointments}
            selectedAppointmentId={selectedAppointmentId}
            onAppointmentChange={handleAppointmentChange}
          />
        );
      case "marketing":
        return (
          <MarketingAdvisorTab
            businessId={user?.businessId}
            userId={user?._id}
            businessDetails={businessDetails}
            appointments={appointments}
            selectedAppointmentId={selectedAppointmentId}
            onAppointmentChange={handleAppointmentChange}
          />
        );
      case "partner":
        return (
          <AiPartnerTab
            businessId={user?.businessId}
            token={token}
          />
        );
      case "recommendations":
        return <AiRecommendations businessId={user?.businessId} token={token} />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="BizUply-container">
      <h1 className="BizUply-header">🧠 BizUply Advisor</h1>

      <div className="tab-buttons">
        <button
          className={activeTab === "business" ? "active" : ""}
          onClick={() => handleTabChange("business")}
        >
          Business Advisor
          {hasBusinessNotification && <span className="notification-dot" />}
        </button>
        <button
          className={activeTab === "marketing" ? "active" : ""}
          onClick={() => handleTabChange("marketing")}
        >
          Marketing Advisor
        </button>
        <button
          className={activeTab === "partner" ? "active" : ""}
          onClick={() => handleTabChange("partner")}
        >
          Personal AI Partner
        </button>
        <button
          className={activeTab === "recommendations" ? "active" : ""}
          onClick={() => handleTabChange("recommendations")}
        >
          AI Recommendations
        </button>
      </div>

      <div className="tab-content">{renderTab()}</div>
    </div>
  );
};

export default BizUplyAdvisor;
