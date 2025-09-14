import React, { useState } from "react";
import API from "@api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import "./CRMCustomerProfile.css";

export default function CRMCustomerFile({ client, isNew = false, onClose, businessId }) {
  const queryClient = useQueryClient();

  // ✅ מצב התחלתי: טופס ריק אם זה לקוח חדש
  const [newClient, setNewClient] = useState(
    isNew
      ? { fullName: "", phone: "", email: "", address: "" }
      : {
          fullName: client?.fullName || "",
          phone: client?.phone || "",
          email: client?.email || "",
          address: client?.address || "",
        }
  );

  // === שמירה לשרת ===
  const handleSave = async () => {
    if (!newClient.fullName || !newClient.phone) {
      alert("❌ שם מלא וטלפון הם שדות חובה");
      return;
    }
    try {
      await API.post(`/crm-clients`, { ...newClient, businessId });
      queryClient.invalidateQueries(["clients", businessId]);
      alert("✅ הלקוח נשמר בהצלחה!");
      onClose();
    } catch (err) {
      console.error("❌ שגיאה בשמירת לקוח:", err);
      alert("❌ שמירת הלקוח נכשלה");
    }
  };

  // === שליפת פגישות של הלקוח הנוכחי לפי crmClientId ===
  const { data: clientAppointments = [], isLoading, isError } = useQuery({
    queryKey: ["appointments", "by-client", client?._id],
    queryFn: () =>
      API.get(`/appointments/by-client/${client?._id}`, {
        params: { businessId }, // ✅ חובה לשלוח גם מזהה עסק
      }).then((res) => res.data),
    enabled: !!client?._id && !!businessId,
  });

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
            <button className="save-client-btn" onClick={handleSave}>
              💾 שמור
            </button>
            <button className="cancel-btn" onClick={onClose}>
              ↩ חזרה
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✨ תיק לקוח קיים
  return (
    <div className="crm-customer-profile">
      <h2>תיק לקוח – {client?.fullName}</h2>
      <p>
        📞 {client?.phone} | ✉️ {client?.email} | 📍 {client?.address}
      </p>

      <h3>📆 הפגישות של הלקוח</h3>
      {isLoading && <p>טוען פגישות...</p>}
      {isError && <p>❌ שגיאה בטעינת פגישות</p>}

      {clientAppointments.length === 0 ? (
        <p>אין פגישות ללקוח זה.</p>
      ) : (
        <table className="appointments-table">
          <thead>
            <tr>
              <th>שירות</th>
              <th>תאריך</th>
              <th>שעה</th>
              <th>הערה</th>
            </tr>
          </thead>
          <tbody>
            {clientAppointments.map((appt) => (
              <tr key={appt._id}>
                <td>{appt.serviceName}</td>
                <td>{appt.date}</td>
                <td>{appt.time}</td>
                <td>{appt.note || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="form-actions">
        <button className="cancel-btn" onClick={onClose}>
          ↩ חזרה
        </button>
      </div>
    </div>
  );
}
