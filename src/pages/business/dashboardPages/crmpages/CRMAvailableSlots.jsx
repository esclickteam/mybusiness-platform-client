import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CRMAvailableSlots.css";

const generateSlots = (start, end, duration, breaks = []) => {
  const parseTime = (str) => {
    const [h, m = "00"] = str.split(":");
    return parseInt(h) * 60 + parseInt(m);
  };
  const formatTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const startMin = parseTime(start);
  const endMin = parseTime(end);
  const breakRanges = breaks.map(b => {
    const [from, to] = b.replace(/\s/g, "").split("-");
    return [parseTime(from), parseTime(to)];
  });

  const slots = [];
  for (let t = startMin; t + duration <= endMin; t += duration) {
    const isBreak = breakRanges.some(([from, to]) => t < to && (t + duration) > from);
    if (!isBreak) {
      slots.push(formatTime(t));
    }
  }
  return slots;
};

const CRMAvailableSlots = ({ businessId, serviceId, token }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [workHours, setWorkHours] = useState(null);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // פונקציה לפורמט תאריך ל-YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().slice(0, 10);
  };

  useEffect(() => {
    if (!businessId || !serviceId || !selectedDate) return;

    setLoading(true);
    setError(null);

    const dateStr = formatDate(selectedDate);

    // בקשה מקבילית ל-work hours ול-pending appointments
    Promise.all([
      fetch(`/api/appointments/get-work-hours?businessId=${businessId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => {
        if (!res.ok) throw new Error("Failed to fetch work hours");
        return res.json();
      }),
      fetch(`/api/appointments/slots?businessId=${businessId}&serviceId=${serviceId}&date=${dateStr}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => {
        if (!res.ok) throw new Error("Failed to fetch booked slots");
        return res.json();
      }),
    ])
      .then(([workHoursData, slotsData]) => {
        setWorkHours(workHoursData.workHours || null);
        setBookedTimes(slotsData.slots || []);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [businessId, serviceId, selectedDate, token]);

  const availableSlots = workHours
    ? generateSlots(workHours.start, workHours.end, workHours.duration || 30, workHours.breaks || [])
        .filter(slot => !bookedTimes.includes(slot))
    : [];

  return (
    <div className="crm-available-slots">
      <h3>🗓️ זמינות תורים לפי יומן</h3>
      <Calendar
        locale="he-IL"
        value={selectedDate}
        onChange={setSelectedDate}
      />

      <h4>תאריך נבחר: {selectedDate.toLocaleDateString("he-IL")}</h4>

      {loading && <p>טוען נתונים...</p>}
      {error && <p style={{ color: "red" }}>שגיאה: {error}</p>}

      {workHours ? (
        <>
          <p>שעות פעילות: {workHours.start} - {workHours.end}</p>
          <ul className="slot-list">
            {availableSlots.length > 0 ? (
              availableSlots.map(slot => (
                <li key={slot}>🕒 {slot}</li>
              ))
            ) : (
              <li>אין שעות פנויות ביום זה</li>
            )}
          </ul>
        </>
      ) : (
        !loading && <p>⚠️ אין הגדרות פעילות ליום זה ביומן</p>
      )}
    </div>
  );
};

export default CRMAvailableSlots;
