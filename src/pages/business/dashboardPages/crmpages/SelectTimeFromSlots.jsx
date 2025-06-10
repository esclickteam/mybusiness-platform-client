import React, { useEffect, useState } from "react";
import API from "@api";
import { useAuth } from "../../../../context/AuthContext";

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

const SelectTimeFromSlots = ({ date, selectedTime, onChange, businessId, serviceDuration = 30 }) => {
  const { socket } = useAuth();
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    if (!date || !businessId) {
      setAvailableSlots([]);
      setBookedSlots([]);
      return;
    }

    const fetchData = async () => {
      try {
        const workHoursRes = await API.get("/appointments/get-work-hours", {
          params: { businessId }
        });
        const workHours = workHoursRes.data.workHours || {};

        const apptsRes = await API.get("/appointments/by-date", {
          params: { businessId, date }
        });
        const booked = apptsRes.data || [];

        const dayIdx = new Date(date).toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
        const config = workHours[dayIdx];

        if (!config || !config.start || !config.end) {
          setAvailableSlots([]);
          setBookedSlots([]);
          return;
        }

        const allSlots = generateSlots(config.start, config.end, serviceDuration, config.breaks || []);
        const freeSlots = allSlots.filter(t => !booked.includes(t));

        setAvailableSlots(freeSlots);
        setBookedSlots(booked);

      } catch (err) {
        console.error("Error fetching slots or work hours:", err);
        setAvailableSlots([]);
        setBookedSlots([]);
      }
    };

    fetchData();
  }, [date, businessId, serviceDuration]);

  useEffect(() => {
    if (!socket || !businessId) return;

    const updateSlots = () => {
      if (!date) return;
      API.get("/appointments/by-date", {
        params: { businessId, date }
      }).then(res => {
        const booked = res.data || [];
        setBookedSlots(booked);
        setAvailableSlots(prevSlots => prevSlots.filter(t => !booked.includes(t)));
      });
    };

    socket.on("appointmentUpdated", updateSlots);
    socket.on("appointmentCreated", updateSlots);
    socket.on("appointmentDeleted", updateSlots);

    return () => {
      socket.off("appointmentUpdated", updateSlots);
      socket.off("appointmentCreated", updateSlots);
      socket.off("appointmentDeleted", updateSlots);
    };
  }, [socket, businessId, date]);

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
