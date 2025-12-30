import React, { useState, useEffect } from "react";
import API from "@api";
import { useQueryClient } from "@tanstack/react-query";
import "./CRMCustomerProfile.css";

// Components
import ClientTasksAndNotes from "../../../../components/CRM/ClientTasksAndNotes";

export default function CRMCustomerFile({
  client,
  isNew = false,
  onClose,
  businessId,
}) {
  const queryClient = useQueryClient();

  /* =========================
     UI STATE
  ========================= */
  const [activeTab, setActiveTab] = useState("appointments");

  /* =========================
     DATA STATE
  ========================= */
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* =========================
     FORM STATE (NEW / EDIT)
  ========================= */
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

  /* =========================
     SAVE CLIENT
  ========================= */
  const handleSave = async () => {
    if (!newClient.fullName.trim() || !newClient.phone.trim()) {
      alert("❌ Full name and phone number are required");
      return;
    }

    try {
      await API.post(`/crm-clients`, {
        ...newClient,
        businessId,
      });

      queryClient.invalidateQueries(["clients", businessId]);
      alert("✅ Client saved successfully");
      onClose();
    } catch (err) {
      console.error("❌ Error saving client:", err);
      alert("❌ Failed to save client");
    }
  };

  /* =========================
     FETCH FULL CUSTOMER FILE
  ========================= */
  useEffect(() => {
    const fetchCustomerFile = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await API.get(`/crm-customer/${client._id}`, {
          params: { businessId },
        });

        // ✅ תמיד להחזיר מבנה תקין
        setCustomerData({
          appointments: res.data?.appointments || [],
          events: res.data?.events || [],
          invoices: res.data?.invoices || [],
          files: res.data?.files || [],
        });
      } catch (err) {
        console.error("❌ Error loading customer file:", err);

        // ✅ גם בשגיאה – לא להשאיר Loading
        setCustomerData({
          appointments: [],
          events: [],
          invoices: [],
          files: [],
        });

        setError("Failed to load customer data");
      } finally {
        setLoading(false);
      }
    };

    if (client?._id && businessId && !isNew) {
      fetchCustomerFile();
    }
  }, [client?._id, businessId, isNew]);

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="crm-customer-profile">
      <h2>Customer File – {client?.fullName}</h2>
      <p>
        📞 {client?.phone || "-"} | ✉️ {client?.email || "-"} | 📍{" "}
        {client?.address || "-"}
      </p>

      {/* =========================
          TABS HEADER
      ========================= */}
      <div className="tabs-header">
        <button
          className={activeTab === "appointments" ? "active" : ""}
          onClick={() => setActiveTab("appointments")}
        >
          📅 Appointments
        </button>

        <button
          className={activeTab === "events" ? "active" : ""}
          onClick={() => setActiveTab("events")}
        >
          📝 Events
        </button>

        <button
          className={activeTab === "invoices" ? "active" : ""}
          onClick={() => setActiveTab("invoices")}
        >
          💰 Invoices
        </button>

        <button
          className={activeTab === "files" ? "active" : ""}
          onClick={() => setActiveTab("files")}
        >
          📄 Files
        </button>

        <button
          className={activeTab === "extras" ? "active" : ""}
          onClick={() => setActiveTab("extras")}
        >
          🗂 Notes & Tasks
        </button>
      </div>

      {/* =========================
          TAB CONTENT
      ========================= */}
      <div className="tab-content">
        {loading ? (
          <p>⏳ Loading data...</p>
        ) : error ? (
          <p className="error-text">❌ {error}</p>
        ) : (
          <>
            {/* ===== Appointments ===== */}
            {activeTab === "appointments" && (
              <>
                {customerData.appointments.length === 0 ? (
                  <p>No appointments for this client</p>
                ) : (
                  <table className="appointments-table">
                    <thead>
                      <tr>
                        <th>Service</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Note</th>
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
              </>
            )}

            {/* ===== Events ===== */}
            {activeTab === "events" && (
              <>
                {customerData.events.length === 0 ? (
                  <p>No events for this client</p>
                ) : (
                  <div className="timeline">
                    {customerData.events.map((e) => (
                      <div key={e._id} className="timeline-item">
                        <strong>{e.title}</strong> – {e.date || "No date"}
                        {e.notes && <p>{e.notes}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ===== Invoices ===== */}
            {activeTab === "invoices" && (
              <>
                {customerData.invoices.length === 0 ? (
                  <p>No invoices for this client</p>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Number</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerData.invoices.map((inv) => (
                        <tr key={inv._id}>
                          <td>{inv.number}</td>
                          <td>{inv.date}</td>
                          <td>{inv.amount} $</td>
                          <td>{inv.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}

            {/* ===== Files ===== */}
            {activeTab === "files" && (
              <>
                {customerData.files.length === 0 ? (
                  <p>No files for this client</p>
                ) : (
                  <ul className="file-list">
                    {customerData.files.map((f) => (
                      <li key={f._id}>
                        <a href={f.url} target="_blank" rel="noreferrer">
                          📄 {f.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}

            {/* ===== Notes & Tasks ===== */}
            {activeTab === "extras" && (
              <ClientTasksAndNotes
                clientId={client._id}
                businessId={businessId}
              />
            )}
          </>
        )}
      </div>

      {/* =========================
          ACTIONS
      ========================= */}
      <div className="form-actions">
        <button className="cancel-btn" onClick={onClose}>
          ↩ Back
        </button>
      </div>
    </div>
  );
}
