import React, { useEffect, useState } from "react";

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

const SelectTimeFromSlots = ({ date, selectedTime, onChange, serviceDuration = 30 }) => {
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    if (!date) {
      setAvailableSlots([]);
      return;
    }

    // קבלת ימי עבודה לפי אינדקס יום בשבוע
    const workHours = JSON.parse(localStorage.getItem("demoWorkHours_calendar") || "{}");
    const appointments = JSON.parse(localStorage.getItem("demoAppointments") || "[]");

    const dayIdx = new Date(date).getDay();
    const config = workHours[dayIdx];
    if (!config || !config.start || !config.end) {
      setAvailableSlots([]);
      return;
    }

    // איסוף שעות שהתיאומים תפוסים באותו יום
    const booked = appointments
      .filter(a => a.date === new Date(date).toLocaleDateString("he-IL"))
      .map(a => a.time);

    // מחולל הזמנים הפנוי
    const allSlots = generateSlots(config.start, config.end, serviceDuration, config.breaks || []);
    const freeSlots = allSlots.filter(t => !booked.includes(t));

    setAvailableSlots(freeSlots);
  }, [date, serviceDuration]);

  return (
    <div className="time-select-wrapper">
      <label>שעה:</label>
      <select value={selectedTime} onChange={(e) => onChange(e.target.value)}>
        <option value="">בחר שעה</option>
        {availableSlots.map((time) => (
          <option key={time} value={time}>{time}</option>
        ))}
      </select>
    </div>
  );
};

export default SelectTimeFromSlots;
