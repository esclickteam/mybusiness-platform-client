import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import API from "@api";

const ClientAppointmentsHistory = ({ businessId, email, phone, onClose }) => {
  const { t } = useTranslation();
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
        setError(t("leftover.appointHistoryChrome.loadError"));
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, [businessId, email, phone, t]);

  return (
    <div
      style={{
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
        color: "black",
      }}
    >
      <button
        onClick={onClose}
        style={{ float: "right", fontSize: "18px", padding: "5px 10px", cursor: "pointer" }}
        aria-label={t("leftover.appointHistoryChrome.closeAria")}
      >
        ✖
      </button>
      <h3>{t("leftover.appointHistoryChrome.title")}</h3>
      {loading && <p>{t("leftover.loading.appointments")}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && appointments.length === 0 && <p>{t("leftover.appointHistoryChrome.empty")}</p>}
      {!loading && appointments.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", color: "black" }}>
          <thead>
            <tr style={{ backgroundColor: "#eee" }}>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>{t("leftover.appointHistoryChrome.date")}</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>{t("leftover.appointHistoryChrome.time")}</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>{t("leftover.appointHistoryChrome.service")}</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>{t("leftover.appointHistoryChrome.status")}</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>{t("leftover.appointHistoryChrome.notes")}</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt._id} style={{ borderBottom: "1px solid #ddd" }}>
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
