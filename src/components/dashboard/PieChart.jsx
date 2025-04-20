import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#6a5acd", "#ffa07a", "#90ee90", "#f7c6ff"];

const PieChartComponent = ({ data }) => {
  if (!data || typeof data !== "object") return null;

  const chartData = Object.entries(data).map(([label, value]) => ({ name: label, value }));

  return (
    <div className="chart-container" style={{ marginTop: "40px" }}>
      <h3 style={{ textAlign: "center" }}>💰 התפלגות הכנסות לפי מקור</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name }) => name}
            outerRadius={100}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
