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

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL; 
// למשל: http://localhost:3001 או הכתובת של ה־server ב־Vercel/AWS

const BarChartComponent = ({
  token,          // טוקן JWT לתקשורת מאובטחת
  businessId,     // ה-businessId שעליו רוצים לקבל עדכונים
  title = "לקוחות שהזמינו פגישות לפי חודשים 📊",
}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // 1. מתחברים לסוקט
    const socket = io(SOCKET_URL, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      auth: {
        token,
        businessId,
      },
    });

    // 2. עם התחברות – מבקשים את כל הפגישות הנוכחיות
    socket.on("connect", () => {
      socket.emit("getAppointments", null, (res) => {
        if (res.ok) {
          // ממירים לרשימת חודשים
          setData(formatMonthlyData(res.appointments));
        } else {
          console.error("Error fetching initial appointments:", res.error);
        }
      });
    });

    // 3. מאזינים לאירוע שבו נוצרה פגישה חדשה
    socket.on("allAppointmentsUpdated", ({ ok, appointments }) => {
      if (ok) {
        setData(formatMonthlyData(appointments));
      } else {
        console.error("Error in allAppointmentsUpdated:", appointments);
      }
    });

    // 4. ניקוי כשמורידים את הקומפוננטה
    return () => {
      socket.disconnect();
    };
  }, [token, businessId]);

  // פונקציה המסכמת לפי חודש
  function formatMonthlyData(appointments) {
    // יוצרים מילון חודש=>מספר פגישות
    const counts = {
      "ינואר":0, "פברואר":0, "מרץ":0, "אפריל":0,
      "מאי":0, "יוני":0, "יולי":0, "אוגוסט":0,
      "ספטמבר":0, "אוקטובר":0, "נובמבר":0, "דצמבר":0,
    };
    appointments.forEach(appt => {
      const month = new Date(appt.date).toLocaleString("he-IL", { month: "long" });
      if (counts[month] !== undefined) counts[month]++;
    });
    // מחזירים מערך ממויין לפי סדר חודשים
    return Object.entries(counts).map(([name, customers]) => ({ name, customers }));
  }

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
