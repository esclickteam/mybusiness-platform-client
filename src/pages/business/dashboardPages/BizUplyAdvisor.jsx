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
     טעינת פרטי עסק + תורים
  ========================= */
  useEffect(() => {
    if (!user?.businessId || !token) {
      setBusinessDetails(null);
      setAppointments([]);
      setSelectedAppointmentId(null);
      return;
    }

    // טעינת פרטי העסק
    fetch(`/api/business/${user.businessId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("שגיאה בטעינת פרטי העסק");
        return res.json();
      })
      .then((data) => {
        setBusinessDetails(data);
      })
      .catch(() => {
        setBusinessDetails(null);
      });

    // טעינת תורים
    fetch(`/api/appointments?businessId=${user.businessId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("שגיאה בטעינת התורים");
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

  useEffect(() => {
    console.group("🟣 בדיקת מעבר טאב");
    console.log("activeTab:", activeTab);

    requestAnimationFrame(() => {
      const tabContent = document.querySelector(".tab-content");
      const advisor = document.querySelector(".advisor-chat-container");
      const chatWrapper = document.querySelector(".chat-box-wrapper");
      const chatBox = document.querySelector(".chat-box");

      console.log("גובה tab-content:", tabContent?.offsetHeight);
      console.log("גובה advisor-chat-container:", advisor?.offsetHeight);
      console.log("גובה chat-box-wrapper:", chatWrapper?.offsetHeight);
      console.log("גובה chat-box:", chatBox?.offsetHeight);

      console.log(
        "תצוגת tab-content:",
        tabContent && getComputedStyle(tabContent).display
      );

      console.log(
        "overflow של advisor:",
        advisor && getComputedStyle(advisor).overflow
      );

      console.groupEnd();

      window.dispatchEvent(new Event("resize"));
    });
  }, [activeTab]);

  /* =========================
     הצגת תוכן לפי טאב
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
        return <AiPartnerTab businessId={user?.businessId} token={token} />;

      default:
        return null;
    }
  };

  if (loading) {
    return <div>טוען...</div>;
  }

  /* =========================
     תצוגה
  ========================= */
  return (
    <div className="BizUply-container" dir="rtl">
      <h1 className="BizUply-header">יועץ BizUply</h1>

      <div className="tab-buttons">
        <button
          type="button"
          className={activeTab === "business" ? "active" : ""}
          onClick={() => setActiveTab("business")}
        >
          יועץ עסקי
        </button>

        <button
          type="button"
          className={activeTab === "marketing" ? "active" : ""}
          onClick={() => setActiveTab("marketing")}
        >
          יועץ שיווקי
        </button>

        <button
          type="button"
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

export default BizUplyAdvisor;