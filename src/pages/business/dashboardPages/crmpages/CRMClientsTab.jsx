import React, { useState, useEffect } from "react";
import "./CRMClientsTab.css";
import API from "@api";

const CRMClientsTab = ({ businessId }) => {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!businessId) return;

    async function fetchClients() {
      setLoading(true);
      try {
        const res = await API.get(`/appointments/clients-from-appointments?businessId=${businessId}`);
        const normalizedClients = res.data.map(c => ({
          fullName: c.fullName || "",
          phone: (c.phone || "").replace(/\s/g, ""),
          email: (c.email || "").replace(/\s/g, ""),
          address: c.address || "",
          id: c._id || Date.now(),
        }));
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
        {/* הכפתור הוסר */}
      </div>

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
