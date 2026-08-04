import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPublicBookingServices } from "../api/publicBookingApi";
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
    getPublicBookingServices(businessId)
      .then((list) => {
        setServices(Array.isArray(list) ? list : []);
        setError("");
      })
      .catch((err) => {
        const status = err?.response?.status;
        setError(status === 404 ? "Business not found" : "Error loading services");
      })
      .finally(() => setLoading(false));
  }, [businessId]);

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: "20px" }}>
      <h2>Book an Appointment</h2>

      {loading && <p>Loading services…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && services.length > 0 && (
        <select
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <option value="">– Select a service –</option>
          {services.map((s) => (
            <option key={s._id || s.id} value={s._id || s.id}>
              {s.name}
            </option>
          ))}
        </select>
      )}

      {serviceId && (
        <AppointmentBooking businessId={businessId} serviceId={serviceId} />
      )}
    </div>
  );
}
