import React, { useState, useEffect } from "react";
import API from "@api";
import { useQueryClient } from "@tanstack/react-query";
import "./CRMCustomerProfile.css";

export default function CRMCustomerFile({
  client,
  isNew = false,
  onClose,
  businessId,
}) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("appointments");
  const [customerData, setCustomerData] = useState(null);

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
    if (!newClient.fullName.trim() || !newClient.phone.trim()) {
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

  // === שליפת תיק לקוח מלא (פגישות + אירועים + חשבוניות + קבצים) ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(`/crm-customer/${client._id}`, {
          params: { businessId },
        });
        setCustomerData(res.data);
      } catch (err) {
        console.error("❌ שגיאה בטעינת תיק לקוח:", err);
      }
    };

    if (client?._id && businessId && !isNew) {
      fetchData();
    }
  }, [client?._id, businessId, isNew]);

  // ✨ מסך יצירת לקוח חדש
  if (isNew) {
    return (
      <div className="add-client-card">
        <div className="card-header">
          <span className="card-icon">👤</span>
          <h2>לקוח חדש</h2>
        </div>

        <div className="add-client-form">
          <input
            type="text"
            placeholder="שם מלא"
            value={newClient.fullName}
            onChange={(e) =>
              setNewClient({ ...newClient, fullName: e.target.value })
            }
          />
          <input
            type="tel"
            placeholder="טלפון"
            value={newClient.phone}
            onChange={(e) =>
              setNewClient({ ...newClient, phone: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="אימייל"
            value={newClient.email}
            onChange={(e) =>
              setNewClient({ ...newClient, email: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="כתובת"
            value={newClient.address}
            onChange={(e) =>
              setNewClient({ ...newClient, address: e.target.value })
            }
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

  // ✨ תיק לקוח קיים עם טאבים
  return (
    <div className="crm-customer-profile">
      <h2>תיק לקוח – {client?.fullName}</h2>
      <p>
        📞 {client?.phone} | ✉️ {client?.email || "-"} | 📍{" "}
        {client?.address || "-"}
      </p>

      {/* כפתורי טאבים */}
      <div className="tabs-header">
        <button
          className={activeTab === "appointments" ? "active" : ""}
          onClick={() => setActiveTab("appointments")}
        >
          📅 פגישות
        </button>
        <button
          className={activeTab === "events" ? "active" : ""}
          onClick={() => setActiveTab("events")}
        >
          📝 אירועים
        </button>
        <button
          className={activeTab === "invoices" ? "active" : ""}
          onClick={() => setActiveTab("invoices")}
        >
          💰 חשבוניות
        </button>
        <button
          className={activeTab === "files" ? "active" : ""}
          onClick={() => setActiveTab("files")}
        >
          📄 קבצים
        </button>
      </div>

      {/* תוכן טאב */}
      <div className="tab-content">
        {!customerData ? (
          <p>⏳ טוען נתונים...</p>
        ) : (
          <>
            {activeTab === "appointments" && (
              <div>
                {customerData.appointments?.length === 0 ? (
                  <p>אין פגישות ללקוח זה</p>
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
                      {customerData.appointments.map((appt) => (
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
              </div>
            )}

            {activeTab === "events" && (
              <div className="timeline">
                {customerData.events?.length === 0 ? (
                  <p>אין אירועים ללקוח זה</p>
                ) : (
                  customerData.events.map((e) => (
                    <div key={e._id} className="timeline-item">
                      <span>
                        {e.type === "call" && "📞"}
                        {e.type === "message" && "💬"}
                        {e.type === "meeting" && "📅"}
                        {e.type === "task" && "✅"}
                        {e.type === "file" && "📄"}
                      </span>{" "}
                      <strong>{e.title}</strong> – {e.date || "ללא תאריך"}
                      {e.notes && <p>{e.notes}</p>}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "invoices" && (
              <div>
                {customerData.invoices?.length === 0 ? (
                  <p>אין חשבוניות ללקוח זה</p>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>מספר</th>
                        <th>תאריך</th>
                        <th>סכום</th>
                        <th>סטטוס</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerData.invoices.map((inv) => (
                        <tr key={inv._id}>
                          <td>{inv.number}</td>
                          <td>{inv.date}</td>
                          <td>{inv.amount} ₪</td>
                          <td>{inv.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === "files" && (
              <div>
                {customerData.files?.length === 0 ? (
                  <p>אין קבצים ללקוח זה</p>
                ) : (
                  <ul className="file-list">
                    {customerData.files.map((f) => (
                      <li key={f._id}>
                        <a
                          href={f.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          📄 {f.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div className="form-actions">
        <button className="cancel-btn" onClick={onClose}>
          ↩ חזרה
        </button>
      </div>
    </div>
  );
}
