// src/components/dashboard/DashboardSkeleton.jsx
import React from "react";
import "./DashboardSkeleton.css";

const DashboardSkeleton = () => {
  return (
    <div className="dashboard-skeleton">
      <div className="skeleton-header skeleton-rect" />
      <div className="skeleton-cards">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton-card skeleton-rect" />
        ))}
      </div>
      <div className="skeleton-chart skeleton-rect" />
      <div className="skeleton-insights skeleton-rect" />
      <div className="skeleton-actions skeleton-rect" />
      <div className="skeleton-table skeleton-rect" />
      <div className="skeleton-calendar skeleton-rect" />
      <div className="skeleton-weekly-summary skeleton-rect" />
    </div>
  );
};

export default DashboardSkeleton;
