import React, { useEffect, useState, useMemo } from "react";
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

// English month map
const monthMap = {
  January: "Jan",
  February: "Feb",
  March: "Mar",
  April: "Apr",
  May: "May",
  June: "Jun",
  July: "Jul",
  August: "Aug",
  September: "Sep",
  October: "Oct",
  November: "Nov",
  December: "Dec",
};

function formatMonthlyData(appointments) {
  const counts = {
    Jan: 0, Feb: 0, Mar: 0, Apr: 0,
    May: 0, Jun: 0, Jul: 0, Aug: 0,
    Sep: 0, Oct: 0, Nov: 0, Dec: 0,
  };

  appointments.forEach((appt) => {
    if (!appt.date) return;
    const fullMonth = new Date(appt.date).toLocaleString("en-US", { month: "long" });
    const shortMonth = monthMap[fullMonth];
    if (counts[shortMonth] !== undefined) counts[shortMonth]++;
  });

  return Object.entries(counts).map(([name, customers]) => ({ name, customers }));
}

const BarChartComponent = ({
  appointments = [],
  title = "Clients Who Booked Appointments by Month 📊",
}) => {
  const [viewMode, setViewMode] = useState("bar");
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const data = useMemo(() => formatMonthlyData(appointments), [appointments]);
  const total = useMemo(() => data.reduce((sum, d) => sum + d.customers, 0), [data]);
  const average = useMemo(() => total / 12, [total]);
  const maxMonth = useMemo(
    () =>
      data.reduce(
        (max, curr) => (curr.customers > max.customers ? curr : max),
        data[0] || { name: "-", customers: 0 }
      ),
    [data]
  );

  const showLegend = data.some((d) => d.customers > 0);

  return (
    <div className="graph-box" dir="ltr">
      <h2 className="graph-title">{title}</h2>

      <div className="chart-buttons">
        <button
          className={viewMode === "bar" ? "active" : ""}
          onClick={() => setViewMode("bar")}
          aria-label="Bar view"
        >
          📊 Bars
        </button>
        <button
          className={viewMode === "line" ? "active" : ""}
          onClick={() => setViewMode("line")}
          aria-label="Line view"
        >
          📈 Line
        </button>
        <button
          className={viewMode === "table" ? "active" : ""}
          onClick={() => setViewMode("table")}
          aria-label="Table view"
        >
          📋 Table
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
                contentStyle={{
                  backgroundColor: "#fafafa",
                  borderRadius: 8,
                  borderColor: "#ddd",
                }}
                labelFormatter={(value) => `Month: ${value}`}
                formatter={(value) => [`${value} clients`, ""]}
              />
              {showLegend && (
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
              )}
              <Bar dataKey="customers" name="Clients" radius={[5, 5, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.name === maxMonth.name ? "#4caf50" : "#6a5acd"
                    }
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
                contentStyle={{
                  backgroundColor: "#fafafa",
                  borderRadius: 8,
                  borderColor: "#ddd",
                }}
                labelFormatter={(value) => `Month: ${value}`}
                formatter={(value) => [`${value} clients`, ""]}
              />
              <Legend verticalAlign="top" align="center" />
              <Line
                type="monotone"
                dataKey="customers"
                name="Clients"
                stroke="#4b0082"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          )}

          {viewMode === "table" && (
            <div style={{ width: "100%", overflowX: "auto" }}>
              <table
                style={{
                  margin: "0 auto",
                  direction: "ltr",
                  borderCollapse: "collapse",
                  fontSize: "0.9rem",
                  width: "100%",
                }}
              >
                <thead>
                  <tr>
                    <th style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>
                      Month
                    </th>
                    <th style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>
                      Appointments
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={i}>
                      <td
                        style={{
                          padding: "6px",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {row.name}
                      </td>
                      <td
                        style={{
                          padding: "6px",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {row.customers}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ResponsiveContainer>
      </div>

      <div
        className="summary-text"
        style={{
          textAlign: "center",
          fontSize: "0.85rem",
          color: "#4b0082",
          marginTop: "1rem",
        }}
      >
        Total Appointments: {total} • Monthly Avg: {average.toFixed(1)} • Peak:{" "}
        {maxMonth.name} ({maxMonth.customers})
      </div>
    </div>
  );
};

export default BarChartComponent;
