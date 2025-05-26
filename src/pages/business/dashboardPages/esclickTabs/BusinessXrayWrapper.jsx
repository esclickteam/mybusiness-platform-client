import React, { useState } from "react";
import XrayTab from "./XrayTab";
import BusinessXrayReport from "./BusinessXrayReport";
import "./BusinessXrayReport.css"; // להבטיח שיש עיצוב לכפתור ול־report

const BusinessXrayWrapper = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_URL;

  if (!apiBaseUrl) {
    throw new Error("Missing VITE_API_URL environment variable");
  }

  const handleSubmitAnswers = async (answers, businessType) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/business-xray`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ answers, businessType })
      });

      const result = await response.json();
      setReportData(result);
    } catch (error) {
      console.error("שגיאה בשליחת השאלון:", error);
      alert("אירעה שגיאה בשליחת השאלון. נסה/י שוב מאוחר יותר.");
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
            <button onClick={handleReset} className="xray-reset-btn">
              🔁 התחלה מחדש
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BusinessXrayWrapper;
