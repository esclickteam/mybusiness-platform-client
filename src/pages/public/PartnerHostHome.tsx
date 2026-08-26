import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
import { usePartnerHostBranding } from "../../hooks/usePartnerHostBranding";

const HomePage = lazy(() => import("../Home"));

export default function PartnerHostHome() {
  const { ready, isResolvedPartnerHost, branding, looksLikePartnerHost } =
    usePartnerHostBranding();
  if (!ready) return null;
  if (isResolvedPartnerHost) {
    return <Navigate to="/plans" replace />;
  }
  const slug = String(branding?.slug || "").trim();
  if (looksLikePartnerHost && slug) {
    return <Navigate to={`/p/${encodeURIComponent(slug)}/plans`} replace />;
  }
  if (looksLikePartnerHost) {
    return (
      <div className="grid min-h-[50vh] place-items-center p-8 text-center">
        <h1 className="text-2xl font-black">העמוד לא נמצא</h1>
      </div>
    );
  }
  return <HomePage />;
}
