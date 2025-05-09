// src/components/ChartComponent.jsx
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import API from '../api';
import DashboardCards from "./DashboardCards";
import "./dashboard.css";

function ChartComponent({ businessId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!businessId) {
        setError("⚠️ מזהה העסק לא זמין.");
        setLoading(false);
        return;
      }

      try {
        // ✅ כאן השתנה הנתיב מ-/businesses ל-/business
        const response = await API.get(`/api/business/${businessId}/stats`);
        setStats(response.data);
      } catch (err) {
        console.error("❌ שגיאה בטעינת סטטיסטיקות:", err);
        setError("⚠️ לא ניתן לטעון נתונים.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [businessId]);

  if (loading) return <p className="loading-text">⏳ טוען נתונים...</p>;
  if (error)   return <p className="error-text">{error}</p>;

  const data = {
    labels: ["לקוחות", "בקשות", "הזמנות"],
    datasets: [
      {
        label: "נתוני העסק",
        data: [
          stats.views_count   || 0,
          stats.requests_count|| 0,
          stats.orders_count  || 0,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <DashboardCards stats={stats} />
      <div className="chart-container">
        <Bar data={data} options={{ responsive: true }} />
      </div>
    </div>
  );
}

export default ChartComponent;
