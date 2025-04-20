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

const SelectTimeFromSlots = ({ date, selectedTime, onChange }) => {
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    if (!date) return;

    const workHours = JSON.parse(localStorage.getItem("demoWorkHours_calendar") || "{}");
    const appointments = JSON.parse(localStorage.getItem("demoAppointments") || "[]");

    const config = workHours[new Date(date).toDateString()];
    if (!config) return setAvailableSlots([]);

    const booked = appointments
      .filter(a => a.date === new Date(date).toLocaleDateString("he-IL"))
      .map(a => a.time);

    const all = generateSlots(config.start, config.end, config.duration || 30, config.breaks || []);
    const free = all.filter(t => !booked.includes(t));

    setAvailableSlots(free);
  }, [date]);

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
