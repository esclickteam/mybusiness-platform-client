import React, { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { usePartnerHostBranding } from "../../hooks/usePartnerHostBranding";

export default function RedirectIfPartnerHost({
  children,
  to = "/plans",
}: {
  children: ReactNode;
  to?: string;
}) {
  const { ready, isResolvedPartnerHost } = usePartnerHostBranding();
  if (!ready) return null;
  if (isResolvedPartnerHost) return <Navigate to={to} replace />;
  return <>{children}</>;
}
