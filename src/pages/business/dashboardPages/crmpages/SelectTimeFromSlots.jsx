import React, { useEffect, useState } from "react";
import API from "@api"; // עדכן לפי הנתיב שלך
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";

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
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    if (!date || !businessId) {
      setAvailableSlots([]);
      setBookedSlots([]);
      return;
    }

    // Fetch work hours and booked appointments from server
    const fetchData = async () => {
      try {
        // שליפת שעות עבודה
        const workHoursRes = await API.get("/appointments/get-work-hours", {
          params: { businessId }
        });
        const workHours = workHoursRes.data.workHours || {};

        // שליפת תיאומים באותו יום
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

  // Optional: setup socket to listen for real-time updates and refresh slots
  useEffect(() => {
    if (!businessId) return;
    const socket = io(SOCKET_URL, { path: "/socket.io", transports: ["websocket"] });

    socket.on("connect", () => {
      console.log("Connected to socket for slots updates");
      socket.emit("joinRoom", `business-${businessId}`);
    });

    socket.on("appointmentUpdated", () => {
      // פשוט מרענן את הנתונים כדי לקבל את הזמינות המעודכנת
      if (date) {
        // קריאה חוזרת לשרת
        API.get("/appointments/by-date", {
          params: { businessId, date }
        }).then(res => {
          const booked = res.data || [];
          setBookedSlots(booked);

          // צריך גם לקבל workHours שוב? תלוי אם משתנים תכופים
          // כאן נניח לא, רק מעדכנים slots
          setAvailableSlots((prevSlots) =>
            prevSlots.filter(t => !booked.includes(t))
          );
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket");
    });

    return () => {
      socket.disconnect();
    };
  }, [businessId, date]);

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
