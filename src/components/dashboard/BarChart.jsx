import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import "./BarChartComponent.css";
import {
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const monthMap = {
  ינואר: "ינו", פברואר: "פבר", מרץ: "מרץ", אפריל: "אפר",
  מאי: "מאי", יוני: "יוני", יולי: "יולי", אוגוסט: "אוג",
  ספטמבר: "ספט", אוקטובר: "אוק", נובמבר: "נוב", דצמבר: "דצמ",
};

function formatMonthlyData(appointments) {
  const counts = {
    ינו: 0, פבר: 0, מרץ: 0, אפר: 0,
    מאי: 0, יוני: 0, יולי: 0, אוג: 0,
    ספט: 0, אוק: 0, נוב: 0, דצמ: 0,
  };

  appointments.forEach(appt => {
    if (!appt.date) return;
    const fullMonth = new Date(appt.date).toLocaleString("he-IL", { month: "long" });
    const shortMonth = monthMap[fullMonth];
    if (counts[shortMonth] !== undefined) counts[shortMonth]++;
  });

  return Object.entries(counts).map(([name, customers]) => ({ name, customers }));
}

const BarChartComponent = ({ appointments = [], title = "לקוחות שהזמינו פגישות לפי חודשים 📊" }) => {
  const [data, setData] = useState(() => formatMonthlyData([]));
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [viewMode, setViewMode] = useState("bar"); // "bar", "line", "table"

  useEffect(() => {
    setData(formatMonthlyData(appointments));
  }, [appointments]);

  const showLegend = data.some(d => d.customers > 0);
  const total = data.reduce((sum, d) => sum + d.customers, 0);
  const average = total / 12;
  const maxMonth = data.reduce((max, curr) =>
    curr.customers > max.customers ? curr : max, data[0]);

  return (
    <div className="graph-box">
      <h4 className="graph-title">{title}</h4>

      {/* כפתורי בחירה מעוצבים */}
      <div className="chart-buttons">
        <button
          className={viewMode === "bar" ? "active" : ""}
          onClick={() => setViewMode("bar")}
          aria-label="תצוגת עמודות"
        >
          📊 עמודות
        </button>
        <button
          className={viewMode === "line" ? "active" : ""}
          onClick={() => setViewMode("line")}
          aria-label="תצוגת קווים"
        >
          📈 קווי
        </button>
        <button
          className={viewMode === "table" ? "active" : ""}
          onClick={() => setViewMode("table")}
          aria-label="תצוגת טבלה"
        >
          📋 טבלה
        </button>
      </div>

      <div className="graph-scroll">
        <ResponsiveContainer width="100%" height={isMobile ? 280 : 400}>
          {viewMode === "bar" && (
            <BarChart
              data={data}
              layout="horizontal"
              margin={{ top: 20, right: 20, left: 20, bottom: 80 }}
              barCategoryGap="40%"
              barSize={20}
              animationDuration={800}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="name"
                interval={0}
                angle={-40}
                textAnchor="end"
                tick={{ fill: "#4b0082", fontSize: 12, fontWeight: 700 }}
                height={70}
                tickMargin={8}
                axisLine={{ stroke: "#4b0082" }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "#4b0082", fontSize: 12, fontWeight: 600 }}
                axisLine={{ stroke: "#4b0082" }}
                tickLine={false}
              />
              <Tooltip
                cursor={false}
                wrapperStyle={{ fontSize: 12 }}
                contentStyle={{ backgroundColor: "#fafafa", borderRadius: 8, borderColor: "#ddd" }}
                labelFormatter={(value) => `חודש: ${value}`}
                formatter={(value) => [`${value} לקוחות`, ""]}
              />
              {showLegend && (
                <Legend
                  verticalAlign="top"
                  align="center"
                  wrapperStyle={{ marginBottom: 12, fontWeight: 600, color: "#4b0082", fontSize: 12 }}
                />
              )}
              <Bar dataKey="customers" name="לקוחות" radius={[5, 5, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.name === maxMonth.name ? "#4caf50" : "#6a5acd"}
                  />
                ))}
              </Bar>
            </BarChart>
          )}

          {viewMode === "line" && (
            <LineChart
              data={data}
              margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="name"
                interval={0}
                angle={-40}
                textAnchor="end"
                tick={{ fill: "#4b0082", fontSize: 12, fontWeight: 700 }}
                height={70}
                tickMargin={8}
                axisLine={{ stroke: "#4b0082" }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "#4b0082", fontSize: 12, fontWeight: 600 }}
                axisLine={{ stroke: "#4b0082" }}
                tickLine={false}
              />
              <Tooltip
                cursor={false}
                wrapperStyle={{ fontSize: 12 }}
                contentStyle={{ backgroundColor: "#fafafa", borderRadius: 8, borderColor: "#ddd" }}
                labelFormatter={(value) => `חודש: ${value}`}
                formatter={(value) => [`${value} לקוחות`, ""]}
              />
              <Legend verticalAlign="top" align="center" />
              <Line
                type="monotone"
                dataKey="customers"
                name="לקוחות"
                stroke="#4b0082"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          )}

          {viewMode === "table" && (
            <div style={{ width: "100%", overflowX: "auto" }}>
              <table style={{ margin: "0 auto", direction: "rtl", borderCollapse: "collapse", fontSize: "0.9rem", width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>חודש</th>
                    <th style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>כמות פגישות</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={i}>
                      <td style={{ padding: "6px", borderBottom: "1px solid #eee" }}>{row.name}</td>
                      <td style={{ padding: "6px", borderBottom: "1px solid #eee" }}>{row.customers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ResponsiveContainer>
      </div>

      <div style={{ textAlign: "center", fontSize: "0.85rem", color: "#4b0082", marginTop: "1rem" }}>
        סה"כ פגישות: {total} • ממוצע חודשי: {average.toFixed(1)} • שיא: {maxMonth.name} ({maxMonth.customers})
      </div>
    </div>
  );
};

export default BarChartComponent;
