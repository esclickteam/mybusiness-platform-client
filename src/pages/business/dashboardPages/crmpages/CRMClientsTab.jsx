import React, { useState, useEffect } from "react";
import "./CRMClientsTab.css";
import API from "@api"; // נתיב ל־API שלך

const CRMClientsTab = ({ businessId }) => {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [newClient, setNewClient] = useState({ name: "", phone: "", email: "" });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!businessId) return;

    async function fetchClients() {
      setLoading(true);
      try {
        const res = await API.get(`/appointments/clients-from-appointments?businessId=${businessId}`);
        setClients(res.data);
      } catch (error) {
        console.error("Error loading clients:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchClients();
  }, [businessId]);

  const filteredClients = clients.filter(
    (client) =>
      client.fullName.includes(search) ||
      client.phone.includes(search)
  );

  const handleAddClient = () => {
    if (!newClient.name || !newClient.phone) {
      alert("יש למלא שם וטלפון לפחות");
      return;
    }

    setClients((prev) => [
      ...prev,
      { ...newClient, id: Date.now() },
    ]);

    setNewClient({ name: "", phone: "", email: "" });
    setShowForm(false);
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
          <button className="save-client-btn" onClick={handleAddClient}>
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
              <th>אימייל</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan="3">לא נמצאו לקוחות</td>
              </tr>
            ) : (
              filteredClients.map((client, idx) => (
                <tr key={idx}>
                  <td>{client.fullName}</td>
                  <td>{client.phone}</td>
                  <td>{client.email}</td>
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
