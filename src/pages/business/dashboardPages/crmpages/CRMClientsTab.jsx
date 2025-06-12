import React, { useState, useEffect } from "react";
import "./CRMClientsTab.css";
import API from "@api"; // נתיב ל־API שלך

const CRMClientsTab = ({ businessId }) => {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [newClient, setNewClient] = useState({ name: "", phone: "", email: "" });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    console.log("CRMClientsTab useEffect triggered, businessId:", businessId);
    if (!businessId) {
      console.warn("No businessId provided, skipping fetchClients");
      return;
    }

    async function fetchClients() {
      setLoading(true);
      try {
        console.log("Fetching clients for businessId:", businessId);
        const res = await API.get(`/appointments/clients-from-appointments?businessId=${businessId}`);
        console.log("clients from API:", res.data);  // לוג נתוני הלקוחות שהתקבלו
        const normalizedClients = res.data.map(c => ({
          fullName: c.clientName || "",  // תיקון שם השדה ל-clientName
          phone: (c.clientPhone || "").replace(/\s/g, ""), // תיקון שם השדה ל-clientPhone
          email: (c.email || "").replace(/\s/g, ""),
          address: c.address || "",         // הוספת שדה כתובת
          id: c._id || Date.now(),          // שימוש ב-ID ייחודי אם קיים
        }));
        console.log("normalized clients:", normalizedClients); // לוג הנתונים לאחר הנרמול
        setClients(normalizedClients);
      } catch (error) {
        console.error("Error loading clients:", error.response || error);
      } finally {
        setLoading(false);
      }
    }
    fetchClients();
  }, [businessId]);

  const filteredClients = clients.filter(
    (client) =>
      client.fullName.toLowerCase().includes(search.toLowerCase()) ||
      client.phone.includes(search)
  );

  const handleAddClient = () => {
    if (!newClient.name || !newClient.phone) {
      alert("יש למלא שם וטלפון לפחות");
      return;
    }

    if (saving) return;
    setSaving(true);

    setClients((prev) => [
      ...prev,
      {
        fullName: newClient.name,
        phone: newClient.phone,
        email: newClient.email,
        address: "",               // אפשר להוסיף שדה כתובת גם כאן, כרגע ריק
        id: Date.now(),
      },
    ]);

    setNewClient({ name: "", phone: "", email: "" });
    setShowForm(false);
    setSaving(false);
  };

  return (
    <div className="crm-tab-content">
      <h2>👥 לקוחות</h2>

      <div className="clients-header">
        <input
          type="text"
          placeholder="חפש לפי שם או טלפון..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <button className="add-client-btn" onClick={() => setShowForm(!showForm)}>
          ➕ לקוח חדש
        </button>
      </div>

      {showForm && (
        <div className="add-client-form">
          <input
            type="text"
            placeholder="שם מלא"
            value={newClient.name}
            onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
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
          <button className="save-client-btn" onClick={handleAddClient} disabled={saving}>
            שמור לקוח
          </button>
        </div>
      )}

      {loading ? (
        <p>טוען לקוחות...</p>
      ) : (
        <table className="clients-table">
          <thead>
            <tr>
              <th>שם</th>
              <th>טלפון</th>
              <th>כתובת</th>
              <th>אימייל</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan="4">לא נמצאו לקוחות</td>
              </tr>
            ) : (
              filteredClients.map((client) => (
                <tr key={client.id}>
                  <td>{client.fullName}</td>
                  <td className="phone-cell">{client.phone}</td>
                  <td className="address-cell">{client.address}</td>
                  <td className="email-cell">{client.email}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CRMClientsTab;
