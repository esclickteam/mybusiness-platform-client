import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import API from "@api";
import CRMCustomerFile from "./CRMCustomerFile"; // תיק לקוח מלא
import "./CRMClientsTab.css";

// ✅ מביא את הלקוחות מתוך ה־CRMClients API
const fetchClients = async (businessId) => {
  if (!businessId) return [];
  const res = await API.get(`/crm-clients/${businessId}`);
  return res.data.map((c) => ({
    fullName: c.fullName || "לא ידוע",
    phone: (c.phone || "").toString().replace(/\s/g, "") || "אין טלפון",
    email: (c.email || "").replace(/\s/g, "") || "-",
    address: c.address || "-",
    id: c._id || Date.now(),
    appointments: c.appointments || [],
  }));
};

const CRMClientsTab = ({ businessId }) => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [creatingNew, setCreatingNew] = useState(false);

  const {
    data: clients = [],
    isLoading,
    error,
  } = useQuery({
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

  const handleDelete = async (client) => {
    if (window.confirm(`האם למחוק את הלקוח "${client.fullName}"?`)) {
      try {
        await API.delete(`/crm-clients/${client.id}`);
        queryClient.invalidateQueries(["clients", businessId]);
        alert("✅ הלקוח נמחק בהצלחה");
      } catch (err) {
        console.error("❌ שגיאה במחיקת לקוח:", err);
        alert("❌ מחיקה נכשלה");
      }
    }
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
        <button
          className="add-client-btn"
          onClick={() => {
            setSelectedClient(null);
            setCreatingNew(true);
          }}
        >
          ➕ צור לקוח חדש
        </button>
      </div>

      {isLoading ? (
        <p>טוען לקוחות...</p>
      ) : error ? (
        <p>שגיאה בטעינת לקוחות</p>
      ) : (
        <>
          {!creatingNew && !selectedClient && (
            <table className="clients-table">
              <thead>
                <tr>
                  <th>שם</th>
                  <th>טלפון</th>
                  <th>כתובת</th>
                  <th>אימייל</th>
                  <th>פעולות</th>
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
                      <td data-label="טלפון" className="phone-cell">
                        {client.phone}
                      </td>
                      <td data-label="כתובת" className="address-cell">
                        {client.address}
                      </td>
                      <td data-label="אימייל" className="email-cell">
                        {client.email}
                      </td>
                      <td data-label="פעולות">
                        <button
                          className="show-history-btn"
                          onClick={() => {
                            setSelectedClient(client);
                            setCreatingNew(false);
                          }}
                        >
                          📂 פתח תיק לקוח
                        </button>
                        <button
                          className="edit-client-btn"
                          onClick={() => {
                            setSelectedClient(client);
                            setCreatingNew(true);
                          }}
                        >
                          ✏ ערוך
                        </button>
                        <button
                          className="delete-client-btn"
                          onClick={() => handleDelete(client)}
                        >
                          🗑 מחק
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {(creatingNew || selectedClient) && (
            <CRMCustomerFile
              client={
                creatingNew && !selectedClient
                  ? { fullName: "", phone: "", email: "", address: "" }
                  : selectedClient
              }
              isNew={creatingNew && !selectedClient}
              onClose={() => {
                setCreatingNew(false);
                setSelectedClient(null);
                queryClient.invalidateQueries(["clients", businessId]);
              }}
              businessId={businessId}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CRMClientsTab;
