// src/components/BarChartComponent.jsx

import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./BarChartComponent.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";

// פונקציה חיצונית לשימוש לאתחול ולעדכונים
function formatMonthlyData(appointments) {
  const counts = {
    ינואר: 0, פברואר: 0, מרץ: 0, אפריל: 0,
    מאי: 0, יוני: 0, יולי: 0, אוגוסט: 0,
    ספטמבר: 0, אוקטובר: 0, נובמבר: 0, דצמבר: 0,
  };

  appointments.forEach(appt => {
    const month = new Date(appt.date).toLocaleString("he-IL", { month: "long" });
    console.log(`[formatMonthlyData] Appointment date: ${appt.date}, month: ${month}`);
    if (counts[month] !== undefined) counts[month]++;
  });

  console.log('[formatMonthlyData] Counts by month:', counts);

  return Object.entries(counts)
    .map(([name, customers]) => ({ name, customers }));
}

const BarChartComponent = ({
  token,
  businessId,
  title = "לקוחות שהזמינו פגישות לפי חודשים 📊",
}) => {
  // אתחול עם כל החודשים
  const [data, setData] = useState(() => formatMonthlyData([]));

  useEffect(() => {
    console.log("[BarChartComponent] Initializing socket connection...");
    const socket = io(SOCKET_URL, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      auth: { token, businessId },
    });

    socket.on("connect", () => {
      console.log("[Socket] Connected with id:", socket.id);
      socket.emit("getAppointments", null, (res) => {
        if (res.ok) {
          console.log("[Socket] Initial appointments received:", res.appointments);
          setData(formatMonthlyData(res.appointments));
        } else {
          console.error("[Socket] Error fetching initial appointments:", res.error);
        }
      });
    });

    socket.on("disconnect", (reason) => {
      console.warn("[Socket] Disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("[Socket] Connection error:", err.message);
    });

    // 2. עדכון מלא
    socket.on("allAppointmentsUpdated", (appointments) => {
      console.log("[Socket] allAppointmentsUpdated event received:", appointments);
      setData(formatMonthlyData(appointments));
    });

    // 3. עדכון בזמן אמת לפגישה חדשה
    socket.on("appointmentUpdated", (newAppt) => {
      console.log("[Socket] appointmentUpdated event received:", newAppt);
      setData(prev => {
        const next = prev.map(item => ({ ...item }));
        const m = new Date(newAppt.date).toLocaleString("he-IL", { month: "long" });
        const idx = next.findIndex(o => o.name === m);
        if (idx !== -1) {
          next[idx].customers += 1;
        } else {
          console.warn(`[Socket] Month '${m}' not found in current data.`);
        }
        console.log("[Socket] Updated data after appointmentUpdated:", next);
        return next;
      });
    });

    return () => {
      console.log("[BarChartComponent] Disconnecting socket...");
      socket.disconnect();
    };
  }, [token, businessId]);

  return (
    <div className="graph-box">
      <h4 className="graph-title">{title}</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 30, right: 20, left: 20, bottom: 100 }}
          barCategoryGap="50%"
          barGap={8}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="name"
            interval={0}
            tick={{ fill: "#4b0082", fontSize: 12, fontWeight: 700 }}
            tickMargin={16}
            axisLine={{ stroke: "#4b0082" }}
            tickLine={false}
            textAnchor="middle"
          />
          <YAxis
            tick={{ fill: "#4b0082", fontSize: 12, fontWeight: 600 }}
            axisLine={{ stroke: "#4b0082" }}
            tickLine={false}
          />
          <Tooltip
            cursor={false}
            wrapperStyle={{ fontSize: 12 }}
            contentStyle={{
              backgroundColor: "#fafafa",
              borderRadius: 8,
              borderColor: "#ddd",
            }}
          />
          <Legend
            verticalAlign="top"
            align="center"
            wrapperStyle={{
              marginBottom: 12,
              fontWeight: 600,
              color: "#4b0082",
              fontSize: 12,
            }}
          />
          <Bar
            dataKey="customers"
            name="לקוחות"
            fill="#6a5acd"
            radius={[5, 5, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
