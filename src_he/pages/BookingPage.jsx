import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import AppointmentBooking from "./AppointmentBooking";

export default function BookingPage() {
  const { businessId } = useParams();
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!businessId) return;
    setLoading(true);
    api
      .get(`/business/${businessId}/services`)
      .then(res => {
        setServices(res.data);
        setError("");
      })
      .catch(() => setError("שגיאה בטעינת שירותים"))
      .finally(() => setLoading(false));
  }, [businessId]);

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: "20px" }}>
      <h2>קביעת תור</h2>

      {loading && <p>טוען שירותים…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && services.length > 0 && (
        <select
          value={serviceId}
          onChange={e => setServiceId(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "8px",
            marginBottom: "20px"
          }}
        >
          <option value="">– בחרי שירות –</option>
          {services.map(s => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
      )}

      {serviceId && (
        <AppointmentBooking
          businessId={businessId}
          serviceId={serviceId}
        />
      )}
    </div>
  );
}
