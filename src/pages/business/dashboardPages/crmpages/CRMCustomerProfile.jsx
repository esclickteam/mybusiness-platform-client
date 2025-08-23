// crmpages/CRMCustomerProfile.jsx
import React, { useState } from "react";
import { Phone, Mail, Calendar, CreditCard } from "lucide-react";
import "./CRMCustomerProfile.css";

// ייבוא רכיבים קיימים
import ClientAppointmentsHistory from "./ClientAppointmentsHistory";
import CRMAppointmentsTab from "./CRMAppointmentsTab";
import CRMServicesTab from "./CRMServicesTab";

export default function CRMCustomerProfile({ customer, onBack }) {
  const [activeTab, setActiveTab] = useState("overview");

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div>
            <h3>📊 סקירה כללית</h3>
            <p>כאן אפשר לשים סיכום: מספר פגישות, הכנסות מהלקוח, שירותים פופולריים, המלצות AI וכו׳.</p>
          </div>
        );
      case "appointments":
        return (
          <div>
            <h3>📅 פגישות</h3>
            {/* מציג היסטוריה של פגישות ללקוח */}
            <ClientAppointmentsHistory customerId={customer.id} />
            {/* או טאב כללי לניהול תיאומים */}
            <CRMAppointmentsTab customerId={customer.id} />
          </div>
        );
      case "payments":
        return (
          <div>
            <h3>💳 תשלומים</h3>
            <p>כאן נציג דוחות תשלומים / חשבוניות לפי הלקוח (בהמשך אפשר לחבר ל־Cardcom).</p>
          </div>
        );
      case "messages":
        return (
          <div>
            <h3>💬 הודעות</h3>
            <p>כאן נטמיע את רכיב הצ׳אט מול הלקוח (כבר דיברנו שיש לך `CollabChat` ו־`ChatComponent`).</p>
          </div>
        );
      case "tasks":
        return (
          <div>
            <h3>✅ משימות</h3>
            <p>כאן נוסיף ניהול משימות ותזכורות אוטומטיות ללקוח.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="customer-profile-container">
      {/* כפתור חזרה */}
      <button className="back-btn" onClick={onBack}>⬅ חזרה ללקוחות</button>

      {/* Header */}
      <div className="customer-header">
        <div className="customer-info">
          <img
            src={customer.avatar || "/default-avatar.png"}
            alt={customer.name}
            className="customer-avatar"
          />
          <div>
            <h2>{customer.name}</h2>
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
