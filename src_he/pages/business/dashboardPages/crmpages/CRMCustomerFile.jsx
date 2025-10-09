import React, { useState, useEffect } from "react";
import API from "@api";
import { useQueryClient } from "@tanstack/react-query";
import "./CRMCustomerProfile.css";

// Importing the new component
import ClientTasksAndNotes from "../../../../components/CRM/ClientTasksAndNotes";

export default function CRMCustomerFile({
  client,
  isNew = false,
  onClose,
  businessId,
}) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("appointments");
  const [customerData, setCustomerData] = useState(null);

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

  // === Saving to server ===
  const handleSave = async () => {
    if (!newClient.fullName.trim() || !newClient.phone.trim()) {
      alert("❌ Full name and phone are required fields");
      return;
    }
    try {
      await API.post(`/crm-clients`, { ...newClient, businessId });
      queryClient.invalidateQueries(["clients", businessId]);
      alert("✅ The client has been saved successfully!");
      onClose();
    } catch (err) {
      console.error("❌ Error saving client:", err);
      alert("❌ Saving the client failed");
    }
  };

  // === Fetching full customer file ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(`/crm-customer/${client._id}`, {
          params: { businessId },
        });
        setCustomerData(res.data);
      } catch (err) {
        console.error("❌ Error loading customer file:", err);
      }
    };
    if (client?._id && businessId && !isNew) fetchData();
  }, [client?._id, businessId, isNew]);

  // ✨ Existing customer file with tabs
  return (
    <div className="crm-customer-profile">
      <h2>Customer File – {client?.fullName}</h2>
      <p>
        📞 {client?.phone} | ✉️ {client?.email || "-"} | 📍 {client?.address || "-"}
      </p>

      {/* Tab buttons */}
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
          🗂 Documentation & Tasks
        </button>
      </div>

      {/* Tab content */}
      <div className="tab-content">
        {!customerData ? (
          <p>⏳ Loading data...</p>
        ) : (
          <>
            {activeTab === "appointments" && (
              <div>
                {customerData.appointments?.length === 0 ? (
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
              </div>
            )}

            {activeTab === "events" && (
              <div className="timeline">
                {customerData.events?.length === 0 ? (
                  <p>No events for this client</p>
                ) : (
                  customerData.events.map((e) => (
                    <div key={e._id} className="timeline-item">
                      <span>
                        {e.type === "call" && "📞"}
                        {e.type === "message" && "💬"}
                        {e.type === "meeting" && "📅"}
                        {e.type === "task" && "✅"}
                        {e.type === "file" && "📄"}
                      </span>{" "}
                      <strong>{e.title}</strong> – {e.date || "No date"}
                      {e.notes && <p>{e.notes}</p>}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "invoices" && (
              <div>
                {customerData.invoices?.length === 0 ? (
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
              </div>
            )}

            {activeTab === "files" && (
              <div>
                {customerData.files?.length === 0 ? (
                  <p>No files for this client</p>
                ) : (
                  <ul className="file-list">
                    {customerData.files.map((f) => (
                      <li key={f._id}>
                        <a href={f.url} target="_blank" rel="noopener noreferrer">
                          📄 {f.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {activeTab === "extras" && (
              <ClientTasksAndNotes clientId={client._id} businessId={businessId} />
            )}
          </>
        )}
      </div>

      <div className="form-actions">
        <button className="cancel-btn" onClick={onClose}>
          ↩ Back
        </button>
      </div>
    </div>
  );
}
