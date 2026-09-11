import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BizuplyLoader from "./ui/BizuplyLoader";
import {
  INVISTIMO_BUSINESS_ID,
  isInvistimoAdminBusiness,
} from "../utils/invistimoAdmin";

/**
 * Cosmetic convenience route. Authorization still depends on role + businessId.
 */
export default function InvistimoAdminRedirect() {
  const { user, loading, initialized } = useAuth() as {
    user: {
      role?: string;
      businessId?: string | null;
    } | null;
    loading: boolean;
    initialized?: boolean;
  };

  if (loading || initialized === false) {
    return <BizuplyLoader fullScreen />;
  }

  const role = String(user?.role || "").toLowerCase();
  const businessId = String(user?.businessId || "").trim();

  if (role === "admin") {
    return (
      <Navigate
        to={`/business/${INVISTIMO_BUSINESS_ID}/dashboard/dashboard`}
        replace
      />
    );
  }

  if (role === "business" && isInvistimoAdminBusiness(businessId)) {
    return (
      <Navigate
        to={`/business/${businessId}/dashboard/dashboard`}
        replace
      />
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to="/unauthorized" replace />;
}
