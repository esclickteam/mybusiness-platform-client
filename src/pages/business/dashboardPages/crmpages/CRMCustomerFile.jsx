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
  const [customerData, setCustomerData] = useState({
    appointments: [],
  });

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
     FETCH CUSTOMER APPOINTMENTS
  ========================= */
  useEffect(() => {
    const fetchCustomerFile = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await API.get(`/crm-customer/${client._id}`, {
          params: { businessId },
        });

        setCustomerData({
          appointments: Array.isArray(res.data?.appointments)
            ? res.data.appointments
            : [],
        });
      } catch (err) {
        console.error("❌ Error loading customer file:", err);
        setCustomerData({ appointments: [] });
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
      <h2>Customer File – {client?.fullName || "New Client"}</h2>
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

            {/* ===== Notes & Tasks ===== */}
            {activeTab === "extras" && (
              <ClientTasksAndNotes
                clientId={client?._id}
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
