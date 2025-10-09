import React from "react";
import DashboardCards from "./DashboardCards";
// Instead of useDashboardSocket – import the hook from the context
import { useDashboardStats } from "../context/DashboardSocketContext";

export default function DashboardLive() {
  // Assuming the Provider has already been set higher up
  // and there is no need to get a token or establish a socket here
  const stats = useDashboardStats();

  // If stats have not arrived yet (null/undefined), default values can be displayed
  const safeStats = stats || {
    views_count: 0,
    requests_count: 0,
    orders_count: 0,
    reviews_count: 0,
    messages_count: 0,
    appointments_count: 0,
    open_leads_count: 0,
  };

  return <DashboardCards stats={safeStats} />;
}
