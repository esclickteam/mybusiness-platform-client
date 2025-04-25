// src/pages/business/dashboardPages/Build.jsx
import React from "react";
import BusinessBuilderPage from "../../../components/BusinessBuilderPage";

export default function BuildBusinessPage() {
  // publicView=false => עריכת פרופיל
  return <BusinessBuilderPage publicView={false} />;
}
