import React from "react";
import { useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import StaffSoftphoneBar from "./StaffSoftphoneBar";

/** Long-lived staff softphone toolbar — survives staff route changes. */
export default function StaffSoftphoneHost() {
  const { user } = useAuth() as { user: { role?: string } | null };
  const location = useLocation();
  const isStaff =
    user?.role === "worker" || user?.role === "manager";
  const onStaffRoute = location.pathname.startsWith("/staff");
  if (!isStaff || !onStaffRoute) return null;
  return <StaffSoftphoneBar />;
}
