import React, { useRef } from "react";
import "./BarChartComponent.css";
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

const data = [
  { name: "ינואר", customers: 10 },
  { name: "פברואר", customers: 15 },
  { name: "מרץ", customers: 7 },
  { name: "אפריל", customers: 20 },
  { name: "מאי", customers: 0 },
  { name: "יוני", customers: 5 },
  { name: "יולי", customers: 0 },
  { name: "אוגוסט", customers: 12 },
  { name: "ספטמבר", customers: 8 },
  { name: "אוקטובר", customers: 6 },
  { name: "נובמבר", customers: 10 },
  { name: "דצמבר", customers: 4 },
];

const BarChartComponent = ({
  dataProp = data,
  title = "לקוחות שהזמינו פגישות לפי חודשים 📊",
}) => {
  const wrapperRef = useRef(null);

  return (
    <div className="graph-box" ref={wrapperRef}>
      <h4>{title}</h4>
      <ResponsiveContainer width="100%" height={550}>
        <BarChart
          data={dataProp}
          margin={{ top: 30, right: 20, left: 20, bottom: 140 }}
          barCategoryGap={80}
          barGap={8}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            type="category"
            dataKey="name"
            interval={0}
            height={120}
            tick={{ fill: "#4b0082", fontSize: 14, fontWeight: 700 }}
            axisLine={{ stroke: "#4b0082" }}
            tickLine={false}
            angle={0}
            textAnchor="middle"
          />
          <YAxis
            tick={{ fill: "#4b0082", fontSize: 14, fontWeight: 600 }}
            axisLine={{ stroke: "#4b0082" }}
            tickLine={false}
          />
          <Tooltip
            cursor={false}
            wrapperStyle={{ fontSize: 14 }}
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
              fontWeight: "600",
              color: "#4b0082",
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
