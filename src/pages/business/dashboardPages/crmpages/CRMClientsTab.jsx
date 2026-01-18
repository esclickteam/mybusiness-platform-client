import React, { useState, useEffect } from "react";
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
    fullName: c.fullName || "",
    phone: (c.phone || "").toString().replace(/\s/g, ""),
    email: (c.email || "").replace(/\s/g, ""),
    address: c.address || "",
  }));
};

export default function CRMClientsTab({ businessId }) {
  const queryClient = useQueryClient();

  /* =====================================================
     UI STATE
  ===================================================== */
  const [mode, setMode] = useState("list"); 
  // list | create | view | edit

  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);

  /* =====================================================
     FORM STATE (Create + Edit)
  ===================================================== */
  const [formClient, setFormClient] = useState({
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
    const q = search.toLowerCase();
    return (
      client.fullName.toLowerCase().includes(q) ||
      client.phone.includes(q)
    );
  });

  /* =====================================================
     EFFECT – preload edit form
  ===================================================== */
  useEffect(() => {
    if (mode === "edit" && selectedClient) {
      setFormClient({
        fullName: selectedClient.fullName,
        phone: selectedClient.phone,
        email: selectedClient.email,
        address: selectedClient.address,
      });
    }
  }, [mode, selectedClient]);

  /* =====================================================
     ACTIONS
  ===================================================== */
  const handleDelete = async (client, e) => {
    e.stopPropagation();

    if (!window.confirm(`Delete "${client.fullName}"?`)) return;

    try {
      await API.delete(`/crm-clients/${client._id}`);
      queryClient.invalidateQueries(["clients", businessId]);
    } catch {
      alert("Delete failed");
    }
  };

  const handleCreate = async () => {
    if (!formClient.fullName || !formClient.phone) {
      alert("Name and phone are required");
      return;
    }

    try {
      const res = await API.post("/crm-clients", {
        ...formClient,
        businessId,
      });

      queryClient.invalidateQueries(["clients", businessId]);
      setSelectedClient(res.data);
      setMode("view");
    } catch {
      alert("Create failed");
    }
  };

  const handleUpdate = async () => {
    if (!formClient.fullName || !formClient.phone) {
      alert("Name and phone are required");
      return;
    }

    try {
      await API.put(`/crm-clients/${selectedClient._id}`, formClient);
      queryClient.invalidateQueries(["clients", businessId]);
      setMode("view");
    } catch {
      alert("Update failed");
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */
  return (
    <div className="crm-tab-content">
      <h2>👥 Clients</h2>

      {/* ================= LIST ================= */}
      {mode === "list" && (
        <>
          <div className="clients-header">
            <input
              className="search-input"
              placeholder="Search by name or phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="add-client-btn"
              onClick={() => {
                setFormClient({
                  fullName: "",
                  phone: "",
                  email: "",
                  address: "",
                });
                setMode("create");
              }}
            >
              ➕ New Client
            </button>
          </div>

          {isLoading ? (
            <p>Loading…</p>
          ) : error ? (
            <p>Error loading clients</p>
          ) : filteredClients.length === 0 ? (
            <div className="empty-state">
              <h3>No clients yet</h3>
              <p>Create your first client</p>
              <button
                className="primary"
                onClick={() => setMode("create")}
              >
                ➕ Create client
              </button>
            </div>
          ) : (
            <table className="clients-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th />
                </tr>
              </thead>

              <tbody>
  {filteredClients.map((client) => (
    <tr
      key={client._id}
      className="client-row"
      onClick={() => {
        setSelectedClient(client);
        setMode("view");
      }}
    >
      <td>{client.fullName}</td>
      <td>{client.phone}</td>
      <td>{client.email || "-"}</td>

      {/* פעולות */}
      <td className="actions-cell">
        {/* כפתור פתיחת תיק לקוח – ברור וגלוי */}
        <button
          className="open-client-btn"
          onClick={(e) => {
            e.stopPropagation(); // מונע קליק כפול על השורה
            setSelectedClient(client);
            setMode("view");
          }}
        >
          📂 Open
        </button>

        {/* מחיקה */}
        <button
          className="icon-btn danger"
          onClick={(e) => handleDelete(client, e)}
        >
          🗑
        </button>
      </td>
    </tr>
  ))}
</tbody>


            </table>
          )}
        </>
      )}

      {/* ================= CREATE / EDIT ================= */}
      {(mode === "create" || mode === "edit") && (
        <div className="crm-card">
          <h3>
            {mode === "create"
              ? "New Client"
              : "Edit Client"}
          </h3>

          <input
            placeholder="Full name *"
            value={formClient.fullName}
            onChange={(e) =>
              setFormClient({
                ...formClient,
                fullName: e.target.value,
              })
            }
          />

          <input
            placeholder="Phone *"
            value={formClient.phone}
            onChange={(e) =>
              setFormClient({
                ...formClient,
                phone: e.target.value,
              })
            }
          />

          <input
            placeholder="Email"
            value={formClient.email}
            onChange={(e) =>
              setFormClient({
                ...formClient,
                email: e.target.value,
              })
            }
          />

          <input
            placeholder="Address"
            value={formClient.address}
            onChange={(e) =>
              setFormClient({
                ...formClient,
                address: e.target.value,
              })
            }
          />

          <div className="actions">
            <button
              onClick={() =>
                setMode(
                  mode === "edit" ? "view" : "list"
                )
              }
            >
              Cancel
            </button>

            <button
              className="primary"
              onClick={
                mode === "create"
                  ? handleCreate
                  : handleUpdate
              }
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* ================= VIEW ================= */}
      {mode === "view" && selectedClient && (
        <>
          <div className="view-actions">
            <button
              onClick={() => setMode("list")}
            >
              ← Back
            </button>

            <button
              className="primary"
              onClick={() => setMode("edit")}
            >
              ✏️ Edit
            </button>
          </div>

          <CRMCustomerFile
            client={selectedClient}
            businessId={businessId}
            onClose={() => {
              setSelectedClient(null);
              setMode("list");
              queryClient.invalidateQueries([
                "clients",
                businessId,
              ]);
            }}
          />
        </>
      )}
    </div>
  );
}
