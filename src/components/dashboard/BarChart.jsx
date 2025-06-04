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

const BarChartComponent = ({ data }) => {
  return (
    <div className="graph-box">
      <h4
        style={{
          textAlign: "center",
          marginBottom: "10px",
          marginTop: "10px",
        }}
      >
        לקוחות / בקשות / הזמנות 📊
      </h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend
            verticalAlign="top"
            align="center"
            wrapperStyle={{ marginBottom: 8 }}
          />
          <Bar dataKey="customers" name="לקוחות" fill="#6a5acd" />
          <Bar dataKey="requests" name="בקשות" fill="#ffa07a" />
          <Bar dataKey="orders" name="הזמנות" fill="#90ee90" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
