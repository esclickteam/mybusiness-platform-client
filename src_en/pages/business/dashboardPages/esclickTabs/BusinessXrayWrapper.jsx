```javascript
import React, { useState } from "react";
import XrayTab from "./XrayTab";
import BusinessXrayReport from "./BusinessXrayReport";
import "./BusinessXrayReport.css"; // Ensure there is styling for the button and the report

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
      console.error("Error submitting the questionnaire:", error);
      alert("An error occurred while submitting the questionnaire. Please try again later.");
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
              🔁 Restart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BusinessXrayWrapper;
```