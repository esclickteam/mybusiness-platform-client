import React, { useEffect, useState, useCallback } from "react";
import { Bar } from "react-chartjs-2";
import API from '../api';
import DashboardCards from "./DashboardCards";
import "./dashboard.css";

function ChartComponent({ businessId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    if (!businessId) {
      setError("⚠️ Business ID is not available.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await API.get(`/business/${businessId}/stats`);
      setStats(response.data);
    } catch (err) {
      console.error("❌ Error loading statistics:", err);
      setError("⚠️ Unable to load data.");
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (!businessId) return <p className="error-text">⚠️ Business ID is not available.</p>;
  if (loading) return <p className="loading-text">⏳ Loading data...</p>;
  if (error) return (
    <>
      <p className="error-text">{error}</p>
      <button onClick={fetchStats}>Try Again</button>
    </>
  );

  const data = {
    labels: ["Customers", "Requests", "Orders"],
    datasets: [
      {
        label: "Business Data",
        data: [
          stats.views_count || 0,
          stats.requests_count || 0,
          stats.orders_count || 0,
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
