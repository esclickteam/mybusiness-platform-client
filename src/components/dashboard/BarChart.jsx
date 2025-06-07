import React, { useEffect, useState } from "react";
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

const monthMap = {
  ינואר: "ינו", פברואר: "פבר", מרץ: "מרץ", אפריל: "אפר",
  מאי: "מאי", יוני: "יוני", יולי: "יולי", אוגוסט: "אוג",
  ספטמבר: "ספט", אוקטובר: "אוק", נובמבר: "נוב", דצמבר: "דצמ",
};

function formatMonthlyData(appointments) {
  const counts = {
    ינו: 0, פבר: 0, מרץ: 0, אפר: 0,
    מאי: 0, יוני: 0, יולי: 0, אוג: 0,
    ספט: 0, אוק: 0, נוב: 0, דצמ: 0,
  };

  appointments.forEach(appt => {
    if (!appt.date) return;
    const fullMonth = new Date(appt.date).toLocaleString("he-IL", { month: "long" });
    const shortMonth = monthMap[fullMonth];
    if (counts[shortMonth] !== undefined) counts[shortMonth]++;
  });

  return Object.entries(counts).map(([name, customers]) => ({ name, customers }));
}

const BarChartComponent = ({ appointments = [], title = "לקוחות שהזמינו פגישות לפי חודשים 📊" }) => {
  const [data, setData] = useState(() => formatMonthlyData([]));
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    setData(formatMonthlyData(appointments));
  }, [appointments]);

  const showLegend = data.some(d => d.customers > 0);

  return (
    <div className="graph-box">
      <h4 className="graph-title">{title}</h4>
      <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#666" }}>
        סה"כ פגישות שנקבעו לפי חודש לאורך השנה
      </p>
      <div className="graph-scroll">
        <ResponsiveContainer width="100%" height={isMobile ? 280 : 400}>
          <BarChart
            data={data}
            layout="horizontal"
            margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
            barCategoryGap="40%"
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
                angle: isMobile ? -45 : 0,
                textAnchor: isMobile ? "end" : "middle",
              }}
              height={isMobile ? 60 : 40}
              tickMargin={12}
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
              labelFormatter={(value) => `חודש: ${value}`}
              formatter={(value) => [`${value} לקוחות`, '']}
            />
            {showLegend && (
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
            )}
            <Bar
              dataKey="customers"
              name="לקוחות"
              fill="#6a5acd"
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartComponent;
