import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import API from "@api";
import CRMCustomerFile from "./CRMCustomerFile"; // Full customer file
import "./CRMClientsTab.css";

// ✅ Fetch clients from the CRMClients API
const fetchClients = async (businessId) => {
  if (!businessId) return [];

  const res = await API.get(`/crm-clients/${businessId}`);

  return res.data.map((c) => ({
    _id: c._id,
    fullName: c.fullName || "Unknown",
    phone: (c.phone || "").toString().replace(/\s/g, "") || "No phone",
    email: (c.email || "").replace(/\s/g, "") || "-",
    address: c.address || "-",

    // ✅ קריטי – תמיד מערך
    appointments: Array.isArray(c.appointments) ? c.appointments : [],
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
    if (window.confirm(`Delete client "${client.fullName}"?`)) {
      try {
        await API.delete(`/crm-clients/${client._id}`);
        queryClient.invalidateQueries(["clients", businessId]);
        alert("✅ Client deleted successfully");
      } catch (err) {
        console.error("❌ Error deleting client:", err);
        alert("❌ Deletion failed");
      }
    }
  };

  return (
    <div className="crm-tab-content">
      <h2>👥 Clients</h2>

      <div className="clients-header">
        <input
          type="text"
          placeholder="Search by name or phone..."
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
          ➕ Create New Client
        </button>
      </div>

      {isLoading ? (
        <p>Loading clients...</p>
      ) : error ? (
        <p>Error loading clients</p>
      ) : (
        <>
          {!creatingNew && !selectedClient && (
            <table className="clients-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan="5">No clients found</td>
                  </tr>
                ) : (
                  filteredClients.map((client) => (
                    <tr key={client._id}>
                      <td data-label="Name">{client.fullName}</td>
                      <td data-label="Phone" className="phone-cell">
                        {client.phone}
                      </td>
                      <td data-label="Address" className="address-cell">
                        {client.address}
                      </td>
                      <td data-label="Email" className="email-cell">
                        {client.email}
                      </td>
                      <td data-label="Actions">
                        <button
                          className="show-history-btn"
                          onClick={() => {
                            setSelectedClient(client);
                            setCreatingNew(false);
                          }}
                        >
                          📂 Open Customer File
                        </button>
                        <button
                          className="edit-client-btn"
                          onClick={() => {
                            setSelectedClient(client);
                            setCreatingNew(true);
                          }}
                        >
                          ✏ Edit
                        </button>
                        <button
                          className="delete-client-btn"
                          onClick={() => handleDelete(client)}
                        >
                          🗑 Delete
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
