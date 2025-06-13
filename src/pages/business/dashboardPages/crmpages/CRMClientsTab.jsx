import React, { useState, useEffect } from "react";
import "./CRMClientsTab.css";
import API from "@api";
import ClientAppointmentsHistory from "./ClientAppointmentsHistory";

const CRMClientsTab = ({ businessId }) => {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    if (!businessId) return;

    async function fetchClients() {
      setLoading(true);
      try {
        const res = await API.get(
          `/appointments/clients-from-appointments?businessId=${businessId}`
        );
        const normalizedClients = res.data.map((c) => ({
          fullName: c.fullName || c.clientName || "לא ידוע",
          phone:
            (c.phone || c.clientPhone || "")
              .toString()
              .replace(/\s/g, "") || "אין טלפון",
          email: (c.email || "").replace(/\s/g, "") || "-",
          address: c.address || "-",
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

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.fullName.toLowerCase().includes(search.toLowerCase()) ||
      client.phone.includes(search);
    return matchesSearch;
  });

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
        {/* הסרתי את סינון הסטטוס */}
      </div>

      {loading ? (
        <p>טוען לקוחות...</p>
      ) : (
        <>
          <table className="clients-table">
            <thead>
              <tr>
                <th>שם</th><th>טלפון</th><th>כתובת</th><th>אימייל</th><th>היסטוריית תורים</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length === 0 ? (
                <tr><td colSpan="5">לא נמצאו לקוחות</td></tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id}>
                    <td>{client.fullName}</td>
                    <td className="phone-cell">{client.phone}</td>
                    <td className="address-cell">{client.address}</td>
                    <td className="email-cell">{client.email}</td>
                    <td>
                      <button
                        className="show-history-btn"
                        onClick={() => setSelectedClient(client)}
                        aria-label={`הצג היסטוריית תורים עבור ${client.fullName}`}
                      >
                        הצג היסטוריה
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {selectedClient && (
            <ClientAppointmentsHistory
              businessId={businessId}
              email={selectedClient.email}
              phone={selectedClient.phone}
              onClose={() => setSelectedClient(null)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CRMClientsTab;
