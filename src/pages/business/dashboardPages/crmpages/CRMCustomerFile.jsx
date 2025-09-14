import React, { useState } from "react";
import "./CRMCustomerProfile.css";

export default function CRMCustomerFile({ client, isNew = false, onClose }) {
  const [newClient, setNewClient] = useState({
    fullName: client?.fullName || "",
    phone: client?.phone || "",
    email: client?.email || "",
    address: client?.address || "",
  });

  const handleSave = () => {
    if (!newClient.fullName || !newClient.phone) {
      alert("שם מלא וטלפון הם שדות חובה");
      return;
    }
    // כאן בעתיד שמירה ל-API
    console.log("📌 לקוח חדש:", newClient);
    onClose(); // חוזר למסך לקוחות
  };

  // === מצב יצירת לקוח חדש ===
  if (isNew) {
    return (
      <div className="crm-customer-profile">
        <h2>➕ לקוח חדש</h2>
        <div className="new-client-form">
          <input
            type="text"
            placeholder="שם מלא"
            value={newClient.fullName}
            onChange={(e) => setNewClient({ ...newClient, fullName: e.target.value })}
          />
          <input
            type="tel"
            placeholder="טלפון"
            value={newClient.phone}
            onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
          />
          <input
            type="email"
            placeholder="אימייל"
            value={newClient.email}
            onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="כתובת"
            value={newClient.address}
            onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
          />

          <div className="form-actions">
            <button className="save-client-btn" onClick={handleSave}>💾 שמור</button>
            <button className="cancel-btn" onClick={onClose}>↩ חזרה</button>
          </div>
        </div>
      </div>
    );
  }

  // === מצב צפייה בתיק לקוח קיים ===
  return (
    <div className="crm-customer-profile">
      <h2>תיק לקוח – {client?.fullName}</h2>
      <p>📞 {client?.phone} | ✉️ {client?.email} | 📍 {client?.address}</p>

      {/* כאן נשאר ה-Timeline, משימות, שיחות וכו' */}
      <p>כאן יוצג ה-Timeline של הלקוח</p>

      <div className="form-actions">
        <button className="cancel-btn" onClick={onClose}>↩ חזרה</button>
      </div>
    </div>
  );
}
