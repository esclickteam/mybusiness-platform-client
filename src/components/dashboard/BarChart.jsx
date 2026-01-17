import React, { useState, useMemo } from "react";
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

/* =========================
   Month Helpers
========================= */
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
    const fullMonth = new Date(appt.date).toLocaleString("en-US", {
      month: "long",
    });
    const shortMonth = monthMap[fullMonth];
    if (counts[shortMonth] !== undefined) counts[shortMonth]++;
  });

  return Object.entries(counts).map(([name, customers]) => ({
    name,
    customers,
  }));
}

/* =========================
   Component
========================= */
const BarChartComponent = ({
  appointments = [],
  title = "Clients Who Booked Appointments",
}) => {
  const [viewMode, setViewMode] = useState("bar");
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const data = useMemo(
    () => formatMonthlyData(appointments),
    [appointments]
  );

  const total = useMemo(
    () => data.reduce((sum, d) => sum + d.customers, 0),
    [data]
  );

  const average = useMemo(() => total / 12, [total]);

  const maxMonth = useMemo(
    () =>
      data.reduce(
        (max, curr) =>
          curr.customers > max.customers ? curr : max,
        data[0] || { name: "-", customers: 0 }
      ),
    [data]
  );

  const hasData = total > 0;

  return (
    <div className="graph-box" dir="ltr">
      {/* ===== Header ===== */}
      <div className="graph-header">
        <h3 className="graph-title">{title}</h3>

        <div className="chart-buttons">
          <button
            className={viewMode === "bar" ? "active" : ""}
            onClick={() => setViewMode("bar")}
          >
            Bars
          </button>
          <button
            className={viewMode === "line" ? "active" : ""}
            onClick={() => setViewMode("line")}
          >
            Line
          </button>
          <button
            className={viewMode === "table" ? "active" : ""}
            onClick={() => setViewMode("table")}
          >
            Table
          </button>
        </div>
      </div>

      {/* ===== Chart Area ===== */}
      <div className="graph-scroll">
        {hasData ? (
          <ResponsiveContainer width="100%" height={isMobile ? 260 : 360}>
            {viewMode === "bar" && (
              <BarChart
                data={data}
                margin={{ top: 20, right: 20, left: 10, bottom: 50 }}
                barCategoryGap="40%"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fontWeight: 600 }}
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                  formatter={(v) => [`${v} appointments`, ""]}
                />
                <Bar dataKey="customers" radius={[6, 6, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        entry.name === maxMonth.name
                          ? "#16a34a"
                          : "#6a11cb"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            )}

            {viewMode === "line" && (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="customers"
                  stroke="#6a11cb"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        ) : (
          <div className="empty-chart">
            No appointments data yet.
          </div>
        )}
      </div>

      {/* ===== Insight / Summary ===== */}
      <div className="chart-insight">
        <strong>{maxMonth.name}</strong> was your busiest month with{" "}
        <strong>{maxMonth.customers}</strong> appointments.
        <div className="chart-subtext">
          Total: {total} • Monthly Avg: {average.toFixed(1)}
        </div>
      </div>
    </div>
  );
};

export default BarChartComponent;
