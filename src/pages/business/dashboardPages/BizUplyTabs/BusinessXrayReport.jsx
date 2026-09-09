import React from "react";
import { useTranslation } from "react-i18next";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import "./BusinessXrayReport.css";

const BUSINESS_TYPE_LABEL_KEYS = {
  services: "leftover.xrayChrome.typeServices",
  commerce: "leftover.xrayChrome.typeCommerce",
  restaurant: "leftover.xrayChrome.typeRestaurant",
  studio: "leftover.xrayChrome.typeStudio",
};

const BusinessXrayReport = ({ data, insights, businessType }) => {
  const { t } = useTranslation();
  if (!data || !insights) return <p>{t("leftover.xrayChrome.noData")}</p>;

  // Convert score object to recharts format
  const chartData = Object.entries(data).map(([category, score]) => ({
    subject: category,
    A: parseFloat(score),
    fullMark: 5
  }));

  const businessTypeLabel = BUSINESS_TYPE_LABEL_KEYS[businessType]
    ? t(BUSINESS_TYPE_LABEL_KEYS[businessType])
    : businessType;

  return (
    <div className="report-container">
      <h2>{t("leftover.xrayChrome.reportTitle")}</h2>
      <p>{t("leftover.xrayChrome.businessTypeLabel")} <strong>{businessTypeLabel}</strong></p>

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
        <h3>{t("leftover.xrayChrome.insightsTitle")}</h3>
        <pre>{insights}</pre>
      </div>
    </div>
  );
};

export default BusinessXrayReport;
