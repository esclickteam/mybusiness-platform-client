import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
import { isPartnerWhiteLabelHostname } from "../../lib/partnerHost.mjs";

const HomePage = lazy(() => import("../Home"));

export default function PartnerHostHome() {
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  if (isPartnerWhiteLabelHostname(host)) {
    return <Navigate to="/plans" replace />;
  }
  return <HomePage />;
}
