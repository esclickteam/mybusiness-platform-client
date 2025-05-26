import React, { useState } from "react";
import XrayTab from "./XrayTab";
import BusinessXrayReport from "./BusinessXrayReport";

const BusinessXrayWrapper = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_URL;

  if (!apiBaseUrl) {
    throw new Error("Missing REACT_APP_API_URL environment variable");
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
    <div>
      {!reportData ? (
        <XrayTab onSubmit={handleSubmitAnswers} loading={loading} />
      ) : (
        <>
          <BusinessXrayReport
            data={reportData.scoresByCategory}
            insights={reportData.insights}
            businessType={reportData.businessType}
          />
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button onClick={handleReset} className="submit-button">
              🔁 התחלה מחדש
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BusinessXrayWrapper;
