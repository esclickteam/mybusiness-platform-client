// crmpages/CRMCustomerProfile.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Phone, Mail, Calendar, CreditCard } from "lucide-react";
import API from "@api";
import "./CRMCustomerProfile.css";

// ייבוא רכיבים קיימים
import ClientAppointmentsHistory from "./ClientAppointmentsHistory";
import CRMAppointmentsTab from "./CRMAppointmentsTab";
import CRMServicesTab from "./CRMServicesTab";

async function fetchCustomer(id) {
  if (!id) return null;
  const res = await API.get(`/clients/${id}`); // ⚡ תעדכן ל־endpoint האמיתי שלך
  return res.data;
}

export default function CRMCustomerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // טעינת נתוני הלקוח
  const { data: customer, isLoading, error } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => fetchCustomer(id),
    enabled: !!id,
  });

  if (isLoading) return <div className="customer-profile-container">טוען פרטי לקוח...</div>;
  if (error) return <div className="customer-profile-container">שגיאה בטעינת פרטי לקוח</div>;
  if (!customer) return <div className="customer-profile-container">לא נמצא לקוח</div>;

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div>
            <h3>📊 סקירה כללית</h3>
            <p>סה״כ פגישות: {customer.totalAppointments || 0}</p>
            <p>סה״כ הכנסות: ₪{customer.totalPayments || 0}</p>
          </div>
        );
      case "appointments":
        return (
          <div>
            <h3>📅 פגישות</h3>
            <ClientAppointmentsHistory customerId={id} />
            <CRMAppointmentsTab customerId={id} />
          </div>
        );
      case "payments":
        return (
          <div>
            <h3>💳 תשלומים</h3>
            <p>כאן נציג דוחות תשלומים / חשבוניות (נחבר ל־Cardcom בהמשך).</p>
          </div>
        );
      case "messages":
        return (
          <div>
            <h3>💬 הודעות</h3>
            <p>כאן נטמיע את רכיב הצ׳אט מול הלקוח.</p>
          </div>
        );
      case "tasks":
        return (
          <div>
            <h3>✅ משימות</h3>
            <p>כאן נוסיף משימות ותזכורות.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="customer-profile-container">
      {/* כפתור חזרה */}
      <button className="back-btn" onClick={() => navigate("/crm/clients")}>
        ⬅ חזרה ללקוחות
      </button>

      {/* Header */}
      <div className="customer-header">
        <div className="customer-info">
          <img
            src={customer.avatar || "/default-avatar.png"}
            alt={customer.fullName}
            className="customer-avatar"
          />
          <div>
            <h2>{customer.fullName}</h2>
            <p>{customer.tags?.join(", ")}</p>
            <div className="customer-details">
              <span><Phone size={16}/> {customer.phone}</span>
              <span><Mail size={16}/> {customer.email}</span>
            </div>
          </div>
        </div>

        {/* כפתורי פעולה */}
        <div className="customer-actions">
          <button><Phone size={16}/> התקשר</button>
          <button><Mail size={16}/> הודעה</button>
          <button><Calendar size={16}/> פגישה</button>
          <button><CreditCard size={16}/> חשבונית</button>
        </div>
      </div>

      {/* Tabs פנימיים */}
      <div className="customer-tabs">
        <button 
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          סקירה כללית
        </button>
        <button 
          className={activeTab === "appointments" ? "active" : ""}
          onClick={() => setActiveTab("appointments")}
        >
          פגישות
        </button>
        <button 
          className={activeTab === "payments" ? "active" : ""}
          onClick={() => setActiveTab("payments")}
        >
          תשלומים
        </button>
        <button 
          className={activeTab === "messages" ? "active" : ""}
          onClick={() => setActiveTab("messages")}
        >
          הודעות
        </button>
        <button 
          className={activeTab === "tasks" ? "active" : ""}
          onClick={() => setActiveTab("tasks")}
        >
          משימות
        </button>
      </div>

      {/* תוכן הטאבים */}
      <div className="customer-tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
}
