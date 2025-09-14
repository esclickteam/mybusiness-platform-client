import React, { useState } from "react";
import API from "@api";
import { useQueryClient } from "@tanstack/react-query";
import "./CRMCustomerProfile.css";

export default function CRMCustomerFile({ client, isNew = false, onClose, businessId }) {
  const queryClient = useQueryClient();

  const [newClient, setNewClient] = useState({
    fullName: client?.fullName || "",
    phone: client?.phone || "",
    email: client?.email || "",
    address: client?.address || "",
  });

  const handleSave = async () => {
    if (!newClient.fullName || !newClient.phone) {
      alert("❌ שם מלא וטלפון הם שדות חובה");
      return;
    }

    try {
      // ✅ שמירה לשרת עם businessId
      await API.post(`/clients?businessId=${businessId}`, newClient);

      // ✅ ריענון רשימת הלקוחות ב-CRMClientsTab
      queryClient.invalidateQueries(["clients", businessId]);

      alert("✅ הלקוח נשמר בהצלחה!");
      onClose(); // חזרה למסך לקוחות
    } catch (err) {
      console.error("❌ שגיאה בשמירת לקוח:", err);
      alert("❌ שמירת הלקוח נכשלה");
    }
  };

  // ✨ מסך יצירת לקוח חדש
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

  // ✨ מסך תיק לקוח קיים
  return (
    <div className="crm-customer-profile">
      <h2>תיק לקוח – {client?.fullName}</h2>
      <p>📞 {client?.phone} | ✉️ {client?.email} | 📍 {client?.address}</p>

      {/* כאן אפשר להוסיף בהמשך Timeline או משימות */}
      <p>כאן יוצג ה-Timeline של הלקוח</p>

      <div className="form-actions">
        <button className="cancel-btn" onClick={onClose}>↩ חזרה</button>
      </div>
    </div>
  );
}
