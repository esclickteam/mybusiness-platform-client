import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import XrayTab from "./XrayTab";
import BusinessXrayReport from "./BusinessXrayReport";
import "./BusinessXrayReport.css"; // ensure there is styling for the button and report

const BusinessXrayWrapper = () => {
  const { t } = useTranslation();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_URL;

  if (!apiBaseUrl) {
    throw new Error("Missing VITE_API_URL environment variable");
  }

  const handleSubmitAnswers = async (payload) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/business-xray`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      setReportData(result);
    } catch (error) {
      console.error("Error submitting questionnaire:", error);
      alert(t("leftover.xray.submitError"));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setReportData(null);
  };

  return (
    <div className="xray-wrapper">
      {!reportData ? (
        <XrayTab onSubmit={handleSubmitAnswers} loading={loading} />
      ) : (
        <>
          <BusinessXrayReport
            data={reportData.scoresByCategory}
            insights={reportData.insights}
            businessType={reportData.businessType}
          />
          <div className="xray-reset-row">
            <button type="button" onClick={handleReset} className="xray-reset-btn">
              {t("leftover.xrayChrome.restart")}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BusinessXrayWrapper;
