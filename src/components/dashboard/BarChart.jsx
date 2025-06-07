import React from "react";
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

const BarChartComponent = ({ data, title = "לקוחות שהזמינו שירות לפי חודשים 📊" }) => {
  return (
    <div className="graph-box" style={{ padding: '1rem', background: '#fff', borderRadius: 12, boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
      <h4
        style={{
          textAlign: "center",
          marginBottom: 12,
          marginTop: 10,
          color: "#4b0082",
          fontWeight: "700",
        }}
      >
        {title}
      </h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 30, right: 40, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="name"
            tick={{ fill: "#4b0082", fontSize: 14, fontWeight: 600 }}
            axisLine={{ stroke: "#4b0082" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#4b0082", fontSize: 14, fontWeight: 600 }}
            axisLine={{ stroke: "#4b0082" }}
            tickLine={false}
          />
          <Tooltip
            wrapperStyle={{ fontSize: 14 }}
            contentStyle={{ backgroundColor: "#fafafa", borderRadius: 8, borderColor: "#ddd" }}
          />
          <Legend
            verticalAlign="top"
            align="center"
            wrapperStyle={{ marginBottom: 12, fontWeight: '600', color: "#4b0082" }}
          />
          {/* עמודה אחת בלבד ללקוחות */}
          <Bar dataKey="customers" name="לקוחות" fill="#6a5acd" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
