import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
import { usePartnerHostBranding } from "../../hooks/usePartnerHostBranding";

const HomePage = lazy(() => import("../Home"));

export default function PartnerHostHome() {
  const { ready, isResolvedPartnerHost } = usePartnerHostBranding();
  if (!ready) return null;
  if (isResolvedPartnerHost) {
    return <Navigate to="/plans" replace />;
  }
  return <HomePage />;
}
