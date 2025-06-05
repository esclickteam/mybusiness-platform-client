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
  console.log("MonthlyComparisonChart data received:", data);

  if (
    !data ||
    !Array.isArray(data.months) ||
    !Array.isArray(data.thisYear) ||
    !Array.isArray(data.lastYear)
  ) {
    console.warn("Invalid or incomplete data for MonthlyComparisonChart:", data);
    return <p style={{ textAlign: "center", color: "red" }}>אין נתונים להצגה בגרף החודשי</p>;
  }

  const chartData = data.months.map((month, index) => ({
    name: month,
    thisYear: data.thisYear[index] || 0,
    lastYear: data.lastYear[index] || 0,
  }));

  console.log("Processed chartData:", chartData);

  return (
    <div className="graph-box" style={{ marginTop: 40 }}>
      <h4 style={{ textAlign: "center", marginBottom: 10 }}>
        📊 השוואת הכנסות חודשית
      </h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
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
