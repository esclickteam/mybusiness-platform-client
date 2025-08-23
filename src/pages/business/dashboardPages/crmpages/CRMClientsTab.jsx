import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import API from "@api";
import ClientAppointmentsHistory from "./ClientAppointmentsHistory";
import "./CRMClientsTab.css";

const fetchClients = async (businessId) => {
  if (!businessId) return [];
  const res = await API.get(`/appointments/clients-from-appointments?businessId=${businessId}`);
  return res.data.map((c) => ({
    fullName: c.fullName || c.clientName || "לא ידוע",
    phone: (c.phone || c.clientPhone || "").toString().replace(/\s/g, "") || "אין טלפון",
    email: (c.email || "").replace(/\s/g, "") || "-",
    address: c.address || "-",
    id: c._id || Date.now(),
  }));
};

const CRMClientsTab = ({ businessId }) => {
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);

  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ["clients", businessId],
    queryFn: () => fetchClients(businessId),
    enabled: !!businessId,
  });

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
      </div>

      {isLoading ? (
        <p>טוען לקוחות...</p>
      ) : error ? (
        <p>שגיאה בטעינת לקוחות</p>
      ) : (
        <>
          <table className="clients-table">
            <thead>
              <tr>
                <th>שם</th>
                <th>טלפון</th>
                <th>כתובת</th>
                <th>אימייל</th>
                <th>היסטוריית תורים</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan="5">לא נמצאו לקוחות</td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id}>
                    <td data-label="שם">{client.fullName}</td>
                    <td data-label="טלפון" className="phone-cell">{client.phone}</td>
                    <td data-label="כתובת" className="address-cell">{client.address}</td>
                    <td data-label="אימייל" className="email-cell">{client.email}</td>
                    <td data-label="היסטוריית תורים">
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
