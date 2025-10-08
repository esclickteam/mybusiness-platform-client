import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const LineChartComponent = ({ stats }) => {
  const isValidStats =
    stats &&
    Array.isArray(stats.weekly_labels) &&
    stats.weekly_labels.length > 0 &&
    Array.isArray(stats.weekly_views) &&
    Array.isArray(stats.weekly_requests) &&
    Array.isArray(stats.weekly_orders);

  if (!isValidStats) {
    return (
      <div style={{ textAlign: "center", marginTop: 30 }}>
        <h3>📈 פעילות בשבוע האחרון</h3>
        <p>אין נתונים להצגה</p>
      </div>
    );
  }

  const data = stats.weekly_labels.map((label, index) => ({
    name: label,
    views: stats.weekly_views[index] || 0,
    requests: stats.weekly_requests[index] || 0,
    orders: stats.weekly_orders[index] || 0,
  }));

  return (
    <div className="chart-container" style={{ marginTop: 30 }}>
      <h3 style={{ textAlign: "center" }}>📈 פעילות בשבוע האחרון</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="views"
            stroke="#6a5acd"
            strokeWidth={2}
            name="צפיות"
          />
          <Line
            type="monotone"
            dataKey="requests"
            stroke="#ffa07a"
            strokeWidth={2}
            name="פניות"
          />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#90ee90"
            strokeWidth={2}
            name="הזמנות"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
