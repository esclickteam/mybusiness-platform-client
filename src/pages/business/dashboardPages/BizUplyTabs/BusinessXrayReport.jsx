import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import "./BusinessXrayReport.css";

const BusinessXrayReport = ({ data, insights, businessType }) => {
  if (!data || !insights) return <p>No data found to display.</p>;

  // Convert score object to recharts format
  const chartData = Object.entries(data).map(([category, score]) => ({
    subject: category,
    A: parseFloat(score),
    fullMark: 5
  }));

  return (
    <div className="report-container">
      <h2>📊 Business X-Ray Report</h2>
      <p>Business type: <strong>{businessType}</strong></p>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={chartData} outerRadius={90}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 5]} />
            <Radar name="Score" dataKey="A" stroke="#7e57c2" fill="#7e57c2" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="insights-box">
        <h3>🧠 Insights tailored to your business:</h3>
        <pre>{insights}</pre>
      </div>
    </div>
  );
};

export default BusinessXrayReport;
