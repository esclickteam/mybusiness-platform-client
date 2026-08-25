import React, { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { isPartnerWhiteLabelHostname } from "../../lib/partnerHost.mjs";

export default function RedirectIfPartnerHost({
  children,
  to = "/plans",
}: {
  children: ReactNode;
  to?: string;
}) {
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  if (isPartnerWhiteLabelHostname(host)) return <Navigate to={to} replace />;
  return <>{children}</>;
}
