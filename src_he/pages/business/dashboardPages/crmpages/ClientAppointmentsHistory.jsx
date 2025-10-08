import React, { useState, useEffect } from "react";
import API from "@api";

const ClientAppointmentsHistory = ({ businessId, email, phone, onClose }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!businessId || (!email && !phone)) return;

    async function fetchAppointments() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ businessId });
        if (email) params.append("email", email);
        if (phone) params.append("phone", phone);

        const res = await API.get(`/appointments/appointments-by-client?${params.toString()}`);
        setAppointments(res.data);
      } catch (err) {
        setError("Error loading appointment history");
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, [businessId, email, phone]);

  return (
    <div style={{
      position: "fixed",
      top: "10%",
      left: "10%",
      right: "10%",
      bottom: "10%",
      backgroundColor: "#fff",
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "20px",
      overflowY: "auto",
      boxShadow: "0 0 10px rgba(0,0,0,0.3)",
      zIndex: 1000,
      color: "black", // Added black text color for the entire container
    }}>
      <button 
        onClick={onClose} 
        style={{ float: "right", fontSize: "18px", padding: "5px 10px", cursor: "pointer" }}
        aria-label="Close appointments history"
      >
        ✖
      </button>
      <h3>Appointment History</h3>

      {loading && <p>Loading appointments...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && appointments.length === 0 && <p>No appointments to display</p>}

      {!loading && appointments.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", color: "black" }}>
          <thead>
            <tr style={{ backgroundColor: "#eee" }}>
              <th style={{ border: "1px solid #ccc", padding: "8px", color: "black" }}>Date</th>
              <th style={{ border: "1px solid #ccc", padding: "8px", color: "black" }}>Time</th>
              <th style={{ border: "1px solid #ccc", padding: "8px", color: "black" }}>Service</th>
              <th style={{ border: "1px solid #ccc", padding: "8px", color: "black" }}>Status</th>
              <th style={{ border: "1px solid #ccc", padding: "8px", color: "black" }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt._id} style={{ borderBottom: "1px solid #ddd", color: "black" }}>
                <td style={{ padding: "8px", textAlign: "center" }}>{appt.date || "-"}</td>
                <td style={{ padding: "8px", textAlign: "center" }}>{appt.time || "-"}</td>
                <td style={{ padding: "8px", textAlign: "center" }}>{appt.serviceName || "-"}</td>
                <td style={{ padding: "8px", textAlign: "center" }}>{appt.status || "-"}</td>
                <td style={{ padding: "8px", textAlign: "center" }}>{appt.note || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClientAppointmentsHistory;
