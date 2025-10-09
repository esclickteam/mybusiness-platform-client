import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CRMAvailableSlots.css";

const CRMAvailableSlots = ({ businessId, serviceId, token }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Format date as YYYY-MM-DD
  const formatDate = (date) => date.toISOString().slice(0, 10);

  useEffect(() => {
    if (!businessId || !serviceId || !selectedDate) return;

    setLoading(true);
    setError(null);

    const dateStr = formatDate(selectedDate);

    fetch(
      `/appointments/slots?businessId=${businessId}&serviceId=${serviceId}&date=${dateStr}`,
      {
        headers: { Authorization: `Bearer ${token}` },
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
  }, [businessId, serviceId, selectedDate, token]);

  return (
    <div className="crm-available-slots">
      <h3>🗓️ Available Appointments by Calendar</h3>
      <Calendar locale="en-US" value={selectedDate} onChange={setSelectedDate} />

      <h4>Selected Date: {selectedDate.toLocaleDateString("en-US")}</h4>

      {loading && <p>Loading data...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && (
        <>
          {availableSlots.length > 0 ? (
            <ul className="slot-list">
              {availableSlots.map((slot) => (
                <li key={slot}>🕒 {slot}</li>
              ))}
            </ul>
          ) : (
            <p>No available time slots on this day</p>
          )}
        </>
      )}
    </div>
  );
};

export default CRMAvailableSlots;
