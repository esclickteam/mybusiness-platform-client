import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import API from "@api";
import CRMCustomerFile from "./CRMCustomerFile";
import "./CRMClientsTab.css";

/* =====================================================
   Fetch clients
===================================================== */
const fetchClients = async (businessId) => {
  if (!businessId) return [];

  const res = await API.get(`/crm-clients/${businessId}`);

  return res.data.map((c) => ({
    _id: c._id,
    fullName: c.fullName || "Unknown",
    phone: (c.phone || "").toString().replace(/\s/g, ""),
    email: (c.email || "").replace(/\s/g, "") || "-",
    address: c.address || "-",
  }));
};

export default function CRMClientsTab({ businessId }) {
  const queryClient = useQueryClient();

  /* =====================================================
     UI STATE
  ===================================================== */
  const [mode, setMode] = useState("list"); 
  // "list" | "create" | "view"

  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);

  /* =====================================================
     CREATE CLIENT FORM STATE
  ===================================================== */
  const [newClient, setNewClient] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
  });

  /* =====================================================
     QUERY
  ===================================================== */
  const {
    data: clients = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["clients", businessId],
    queryFn: () => fetchClients(businessId),
    enabled: !!businessId,
  });

  /* =====================================================
     FILTER
  ===================================================== */
  const filteredClients = clients.filter((client) => {
    return (
      client.fullName.toLowerCase().includes(search.toLowerCase()) ||
      client.phone.includes(search)
    );
  });

  /* =====================================================
     ACTIONS
  ===================================================== */
  const handleDelete = async (client) => {
    if (!window.confirm(`Delete client "${client.fullName}"?`)) return;

    try {
      await API.delete(`/crm-clients/${client._id}`);
      queryClient.invalidateQueries(["clients", businessId]);
      alert("Client deleted");
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleCreateClient = async () => {
    if (!newClient.fullName || !newClient.phone) {
      alert("Full name and phone are required");
      return;
    }

    try {
      const res = await API.post("/crm-clients", {
        ...newClient,
        businessId,
      });

      queryClient.invalidateQueries(["clients", businessId]);

      setSelectedClient(res.data);
      setMode("view");

      setNewClient({
        fullName: "",
        phone: "",
        email: "",
        address: "",
      });
    } catch (err) {
      alert("Failed to create client");
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */
  return (
    <div className="crm-tab-content">
      <h2>👥 Clients</h2>

      {/* ================= HEADER ================= */}
      {mode === "list" && (
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
            onClick={() => setMode("create")}
          >
            ➕ Create New Client
          </button>
        </div>
      )}

      {/* ================= LIST ================= */}
      {mode === "list" && (
        <>
          {isLoading ? (
            <p>Loading clients...</p>
          ) : error ? (
            <p>Error loading clients</p>
          ) : (
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
                      <td>{client.fullName}</td>
                      <td>{client.phone}</td>
                      <td>{client.address}</td>
                      <td>{client.email}</td>
                      <td>
                        <button
                          onClick={() => {
                            setSelectedClient(client);
                            setMode("view");
                          }}
                        >
                          📂 Open
                        </button>

                        <button
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
        </>
      )}

      {/* ================= CREATE ================= */}
      {mode === "create" && (
        <div className="crm-card">
          <h3>Create New Client</h3>

          <input
            placeholder="Full name"
            value={newClient.fullName}
            onChange={(e) =>
              setNewClient({ ...newClient, fullName: e.target.value })
            }
          />

          <input
            placeholder="Phone"
            value={newClient.phone}
            onChange={(e) =>
              setNewClient({ ...newClient, phone: e.target.value })
            }
          />

          <input
            placeholder="Email"
            value={newClient.email}
            onChange={(e) =>
              setNewClient({ ...newClient, email: e.target.value })
            }
          />

          <input
            placeholder="Address"
            value={newClient.address}
            onChange={(e) =>
              setNewClient({ ...newClient, address: e.target.value })
            }
          />

          <div className="actions">
            <button onClick={() => setMode("list")}>Cancel</button>
            <button className="primary" onClick={handleCreateClient}>
              Save Client
            </button>
          </div>
        </div>
      )}

      {/* ================= VIEW ================= */}
      {mode === "view" && selectedClient && (
        <CRMCustomerFile
          client={selectedClient}
          businessId={businessId}
          onClose={() => {
            setSelectedClient(null);
            setMode("list");
            queryClient.invalidateQueries(["clients", businessId]);
          }}
        />
      )}
    </div>
  );
}
