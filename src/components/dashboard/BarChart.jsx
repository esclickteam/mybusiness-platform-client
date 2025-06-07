import React from "react";
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

const defaultData = [ /* … הנתונים שלך … */ ];

const BarChartComponent = ({
  dataProp = defaultData,
  title = "לקוחות שהזמינו פגישות לפי חודשים 📊",
}) => {
  return (
    <div className="graph-box">
      <h4 className="graph-title">{title}</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={dataProp}
          margin={{
            top: 30,
            right: 10,
            left: 10,
            bottom: 120,    // מקום גדול יותר לתוויות סובבות
          }}
          barCategoryGap="30%"
          barGap={4}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="name"
            interval={0}
            angle={-45}               // סיבוב 45° נגד כיוון השעון
            textAnchor="end"          // מיישר את הקצה התחתון של הטקסט
            tick={{ 
              fill: "#4b0082", 
              fontSize: 10,           // גופן קטן יותר במובייל
              fontWeight: 600 
            }}
            tickMargin={8}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{
              fill: "#4b0082",
              fontSize: 12,
              fontWeight: 600,
            }}
            axisLine={false}
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
              marginBottom: 8,
              fontWeight: 600,
              color: "#4b0082",
              fontSize: 12,
            }}
          />
          <Bar
            dataKey="customers"
            name="לקוחות"
            fill="#6a5acd"
            radius={[4, 4, 0, 0]}
            barSize={16}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
