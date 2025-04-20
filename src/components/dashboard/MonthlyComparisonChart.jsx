import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const MonthlyComparisonChart = ({ data }) => {
  const chartData = data.months.map((month, index) => ({
    name: month,
    thisYear: data.thisYear[index] || 0,
    lastYear: data.lastYear[index] || 0
  }));

  return (
    <div className="graph-box">
      <h4 style={{ textAlign: "center", marginBottom: "10px" }}>
        📊 השוואת הכנסות חודשית
      </h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="thisYear" fill="#6a5acd" name="השנה" />
          <Bar dataKey="lastYear" fill="#ffa07a" name="שנה שעברה" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyComparisonChart;
