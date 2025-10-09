import React from "react";
import DashboardCards from "./DashboardCards";
// Instead of useDashboardSocket – import the hook from the context
import { useDashboardStats } from "../context/DashboardSocketContext";

export default function DashboardLive() {
  // Assuming the Provider is already defined higher up in the component tree
  // so there's no need to receive a token or create a socket here
  const stats = useDashboardStats();

  // If stats hasn’t loaded yet (null/undefined), show default values
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
