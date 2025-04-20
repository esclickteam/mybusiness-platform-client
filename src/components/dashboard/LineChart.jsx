import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const LineChartComponent = ({ stats }) => {
  const isTestUser = stats?.mock === true;

  const dummyLabels = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];
  const dummyData = dummyLabels.map((label, index) => ({
    name: label,
    views: [20, 40, 35, 60, 50, 70, 88][index],
    requests: [5, 6, 8, 7, 9, 10, 14][index],
    orders: [1, 2, 4, 5, 3, 5, 6][index],
  }));

  const realData = (stats?.weekly_labels || []).map((label, index) => ({
    name: label,
    views: stats?.weekly_views?.[index] || 0,
    requests: stats?.weekly_requests?.[index] || 0,
    orders: stats?.weekly_orders?.[index] || 0,
  }));

  const data = isTestUser ? dummyData : realData;

  return (
    <div className="chart-container" style={{ marginTop: "30px" }}>
      <h3 style={{ textAlign: "center" }}>📈 פעילות בשבוע האחרון</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="views" stroke="#6a5acd" strokeWidth={2} />
          <Line type="monotone" dataKey="requests" stroke="#ffa07a" strokeWidth={2} />
          <Line type="monotone" dataKey="orders" stroke="#90ee90" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;