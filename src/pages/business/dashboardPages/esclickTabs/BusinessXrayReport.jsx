import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import "./BusinessXrayReport.css";

const BusinessXrayReport = ({ data, insights, businessType }) => {
  if (!data || !insights) return <p>לא נמצאו נתונים להצגה.</p>;

  // המרת אובייקט ציונים למבנה של recharts
  const chartData = Object.entries(data).map(([category, score]) => ({
    subject: category,
    A: parseFloat(score),
    fullMark: 5
  }));

  return (
    <div className="report-container">
      <h2>📊 דוח רנטגן עסקי</h2>
      <p>סוג עסק: <strong>{businessType}</strong></p>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={chartData} outerRadius={90}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 5]} />
            <Radar name="ציון" dataKey="A" stroke="#7e57c2" fill="#7e57c2" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="insights-box">
        <h3>🧠 תובנות מותאמות לעסק שלך:</h3>
        <pre>{insights}</pre>
      </div>
    </div>
  );
};

export default BusinessXrayReport;
