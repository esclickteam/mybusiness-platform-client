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

const CRMAvailableSlots = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [workHours, setWorkHours] = useState({});
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const workHours = JSON.parse(localStorage.getItem("demoWorkHours_calendar") || "{}");
    const appointments = JSON.parse(localStorage.getItem("demoAppointments") || "[]");
  
    console.log("📅 workHours (מהיומן):", workHours);
    console.log("📩 appointments (מהלקוחות):", appointments);
  }, []);
  
  useEffect(() => {
    const calendarData = JSON.parse(localStorage.getItem("demoWorkHours_calendar") || "{}");
    const appointmentData = JSON.parse(localStorage.getItem("demoAppointments") || "[]");
    setWorkHours(calendarData);
    setAppointments(appointmentData);
  }, []);

  const dateKey = selectedDate.toDateString();
  const config = workHours[dateKey];

  const bookedTimes = appointments
    .filter((a) => a.date === selectedDate.toLocaleDateString("he-IL") && a.time)
    .map((a) => a.time);

  const availableSlots = config
    ? generateSlots(config.start, config.end, config.duration || 30, config.breaks || [])
        .filter((slot) => !bookedTimes.includes(slot))
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
      {config ? (
        <>
          <p>שעות פעילות: {config.start} - {config.end}</p>
          <ul className="slot-list">
            {availableSlots.length > 0 ? (
              availableSlots.map((slot) => (
                <li key={slot}>🕒 {slot}</li>
              ))
            ) : (
              <li>אין שעות פנויות ביום זה</li>
            )}
          </ul>
        </>
      ) : (
        <p>⚠️ אין הגדרות פעילות ליום זה ביומן</p>
      )}
    </div>
  );
};

export default CRMAvailableSlots;
