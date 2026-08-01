import React from "react";
import { useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import AdminSoftphone from "../AdminSoftphone";
import StaffHeader from "./StaffHeader";

/**
 * Staff softphone host — same behavior as admin:
 * top header launcher + floating softphone panel, survives /staff navigation.
 */
export default function StaffSoftphoneHost() {
  const { user } = useAuth() as { user: { role?: string } | null };
  const location = useLocation();
  const isStaff = user?.role === "worker" || user?.role === "manager";
  const onStaffRoute = location.pathname.startsWith("/staff");

  if (!isStaff || !onStaffRoute) return null;

  return (
    <>
      <StaffHeader />
      {/* Spacer so page content clears the fixed top header */}
      <div className="h-[72px] sm:h-[68px]" aria-hidden="true" />
      {/* Identical softphone panel/engine as admin; header opens it */}
      <div className="contents" data-softphone-host="staff">
        <AdminSoftphone launcher="hidden" />
      </div>
    </>
  );
}
