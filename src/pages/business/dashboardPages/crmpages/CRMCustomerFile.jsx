import React, { useState, useEffect, useMemo } from "react";
import API from "@api";
import { useQueryClient } from "@tanstack/react-query";
import "./CRMCustomerProfile.css";
import dashboardDemoAppointmentsByClient from "@/demo/dashboardDemoAppointmentsByClient";

// Components
import ClientTasksAndNotes from "../../../../components/CRM/ClientTasksAndNotes";

const DEMO_MODE = true;

/* =========================
   Demo helpers
========================= */
function getDemoStatus(client) {
  return client?.status || "Active";
}



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
     FORM STATE
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
     DEMO DERIVED DATA
  ========================= */
  const clientStatus = useMemo(
    () => (DEMO_MODE ? getDemoStatus(client) : null),
    [client]
  );

 

  /* =========================
     FETCH CUSTOMER FILE
  ========================= */
  useEffect(() => {
  if (DEMO_MODE && client?._id) {
    setCustomerData({
      appointments:
        dashboardDemoAppointmentsByClient[client._id] || [],
    });
    return;
  }

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
      {/* Header */}
      <div className="customer-header">
        <h2>
          Customer File – {client?.fullName || "New Client"}
          {clientStatus && (
            <span className={`client-badge ${clientStatus.toLowerCase()}`}>
              {clientStatus}
            </span>
          )}
        </h2>

        <p className="customer-meta">
          📞 {client?.phone || "-"} | ✉️ {client?.email || "-"} | 📍{" "}
          {client?.address || "-"}
        </p>
      </div>

   
      {/* Tabs */}
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

      {/* Content */}
      <div className="tab-content">
        {loading ? (
          <p>⏳ Loading data...</p>
        ) : error ? (
          <p className="error-text">❌ {error}</p>
        ) : (
          <>
            {/* Appointments */}
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

            {/* Notes & Tasks */}
            {activeTab === "extras" && (
              <ClientTasksAndNotes
                clientId={client?._id}
                businessId={businessId}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
