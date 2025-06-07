// src/components/BarChartComponent.jsx

import React from "react";
import "./BarChartComponent.css";  // ייבוא הקובץ CSS
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

const BarChartComponent = ({
  data = [],
  title = "לקוחות שהזמינו פגישות לפי חודשים 📊",
}) => {
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
