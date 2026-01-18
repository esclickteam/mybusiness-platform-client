import React, { useState, useEffect, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CRMAvailableSlots.css";

const CRMAvailableSlots = ({
  businessId,
  serviceId,
  duration = 30,     // ⏱️ משך פגישה בדקות (דינמי)
  token,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // YYYY-MM-DD
  const dateStr = useMemo(
    () => selectedDate.toISOString().slice(0, 10),
    [selectedDate]
  );

  useEffect(() => {
    if (!businessId || !serviceId || !selectedDate || !duration) return;

    setLoading(true);
    setError(null);

    fetch(
      `/appointments/slots?businessId=${businessId}&serviceId=${serviceId}&date=${dateStr}&duration=${duration}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch available slots");
        return res.json();
      })
      .then((data) => {
        setAvailableSlots(data.slots || []);
      })
      .catch((err) => {
        console.error("Error fetching slots:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [businessId, serviceId, dateStr, duration, token]);

  return (
    <div className="crm-available-slots">
      <h3>🗓️ Available Appointments</h3>

      <Calendar
        locale="en-US"
        value={selectedDate}
        onChange={setSelectedDate}
      />

      <div className="slots-meta">
        <strong>Date:</strong>{" "}
        {selectedDate.toLocaleDateString("en-US")}
        <br />
        <strong>Duration:</strong>{" "}
        {duration < 60
          ? `${duration} minutes`
          : `${Math.floor(duration / 60)}h${
              duration % 60 ? ` ${duration % 60}m` : ""
            }`}
      </div>

      {loading && <p>Loading available slots…</p>}

      {error && <p className="error">Error: {error}</p>}

      {!loading && !error && (
        <>
          {availableSlots.length > 0 ? (
            <ul className="slot-list">
              {availableSlots.map((slot) => (
                <li key={slot} className="slot-item">
                  🕒 {slot}
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty">No available slots for this date</p>
          )}
        </>
      )}
    </div>
  );
};

export default CRMAvailableSlots;
