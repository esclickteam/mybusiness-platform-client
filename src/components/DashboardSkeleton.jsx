// Re-export the unified logo loader for any legacy skeleton imports.
import React from "react";
import BizuplyLoader from "./ui/BizuplyLoader";

const DashboardSkeleton = () => {
  return <BizuplyLoader fullScreen label="Loading dashboard..." />;
};

export default DashboardSkeleton;
