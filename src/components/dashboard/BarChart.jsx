import React, { useEffect, useState } from "react";
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

function formatMonthlyData(appointments) {
  const counts = {
    ינואר: 0, פברואר: 0, מרץ: 0, אפריל: 0,
    מאי: 0, יוני: 0, יולי: 0, אוגוסט: 0,
    ספטמבר: 0, אוקטובר: 0, נובמבר: 0, דצמבר: 0,
  };

  appointments.forEach(appt => {
    if (!appt.date) return;
    const month = new Date(appt.date).toLocaleString("he-IL", { month: "long" });
    if (counts[month] !== undefined) counts[month]++;
  });

  return Object.entries(counts).map(([name, customers]) => ({ name, customers }));
}

const BarChartComponent = ({ appointments = [], title = "לקוחות שהזמינו פגישות לפי חודשים 📊" }) => {
  const [data, setData] = useState(() => formatMonthlyData([]));

  useEffect(() => {
    setData(formatMonthlyData(appointments));
  }, [appointments]);

  return (
    <div className="graph-box">
      <h4 className="graph-title">{title}</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 30, right: 20, left: 20, bottom: 120 }}
          barCategoryGap="50%"
          barGap={8}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="name"
            interval={0}
            tick={{
              fill: "#4b0082",
              fontSize: 12,
              fontWeight: 700,
              angle: -45,
              textAnchor: "end",
            }}
            tickMargin={16}
            axisLine={{ stroke: "#4b0082" }}
            tickLine={false}
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
