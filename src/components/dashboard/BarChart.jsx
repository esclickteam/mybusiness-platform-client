import React from "react";
import { useMediaQuery } from "react-responsive";
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

const defaultData = [
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
  dataProp = defaultData,
  title = "לקוחות שהזמינו פגישות לפי חודשים 📊",
}) => {
  // נזהה אם המסך צר מ-768px
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className="graph-box">
      <h4 className="graph-title">{title}</h4>
      <ResponsiveContainer
        width="100%"
        aspect={isMobile ? 1.2 : 2} // יחס רוחב:גובה גמיש
      >
        <BarChart
          data={dataProp}
          margin={{
            top: 30,
            right: 20,
            left: 20,
            bottom: isMobile ? 60 : 100, // פחות מרווח תחתון בנייד
          }}
          barCategoryGap={isMobile ? "30%" : "50%"}
          barGap={isMobile ? 8 : 12}
          barSize={isMobile ? 12 : 20}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="name"
            interval={0}
            tick={{
              fill: "#4b0082",
              fontSize: isMobile ? 10 : 14,
              fontWeight: 700,
            }}
            tickMargin={isMobile ? 8 : 16}
            axisLine={{ stroke: "#4b0082" }}
            tickLine={false}
            textAnchor="middle"
          />
          <YAxis
            tick={{
              fill: "#4b0082",
              fontSize: isMobile ? 10 : 14,
              fontWeight: 600,
            }}
            axisLine={{ stroke: "#4b0082" }}
            tickLine={false}
          />
          <Tooltip
            cursor={false}
            wrapperStyle={{ fontSize: isMobile ? 12 : 14 }}
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
              marginBottom: isMobile ? 8 : 12,
              fontWeight: "600",
              color: "#4b0082",
              fontSize: isMobile ? 12 : 14,
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
