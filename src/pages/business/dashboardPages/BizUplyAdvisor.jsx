import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";

import BusinessAdvisorTab from "./BizUplyTabs/BusinessAdvisorTab";
import MarketingAdvisorTab from "./BizUplyTabs/MarketingAdvisorTab";
import AiPartnerTab from "./BizUplyTabs/AiPartnerTab";

import "./BizUplyAdvisor.css";

const BizUplyAdvisor = () => {
  const [activeTab, setActiveTab] = useState("business");
  const [businessDetails, setBusinessDetails] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const { user, loading } = useAuth();
  const token = localStorage.getItem("token");

  /* =========================
     FETCH BUSINESS + APPOINTMENTS
  ========================= */
  useEffect(() => {
    if (!user?.businessId || !token) {
      setBusinessDetails(null);
      setAppointments([]);
      setSelectedAppointmentId(null);
      return;
    }

    // Fetch business details
    fetch(`/api/business/${user.businessId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch business details");
        return res.json();
      })
      .then((data) => {
        setBusinessDetails(data);
      })
      .catch(() => {
        setBusinessDetails(null);
      });

    // Fetch appointments
    fetch(`/api/appointments?businessId=${user.businessId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch appointments");
        return res.json();
      })
      .then((data) => {
        setAppointments(data);
        if (data.length > 0) {
          setSelectedAppointmentId(data[0]._id);
        } else {
          setSelectedAppointmentId(null);
        }
      })
      .catch(() => {
        setAppointments([]);
        setSelectedAppointmentId(null);
      });
  }, [user?.businessId, token]);

  /* =========================
     RENDER TAB CONTENT
  ========================= */
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
            onAppointmentChange={(e) =>
              setSelectedAppointmentId(e.target.value)
            }
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
            onAppointmentChange={(e) =>
              setSelectedAppointmentId(e.target.value)
            }
          />
        );

      case "partner":
        return (
          <AiPartnerTab
            businessId={user?.businessId}
            token={token}
          />
        );

      default:
        return null;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="BizUply-container">
      <h1 className="BizUply-header">🧠 BizUply Advisor</h1>

      <div className="tab-buttons">
        <button
          className={activeTab === "business" ? "active" : ""}
          onClick={() => setActiveTab("business")}
        >
          Business Advisor
        </button>

        <button
          className={activeTab === "marketing" ? "active" : ""}
          onClick={() => setActiveTab("marketing")}
        >
          Marketing Advisor
        </button>

        <button
          className={activeTab === "partner" ? "active" : ""}
          onClick={() => setActiveTab("partner")}
        >
          Personal AI Partner
        </button>
      </div>

      <div className="tab-content">{renderTab()}</div>
    </div>
  );
};

export default BizUplyAdvisor;
