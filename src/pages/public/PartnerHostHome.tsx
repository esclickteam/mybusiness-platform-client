import React, { lazy, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { fetchPublicPartnerBranding } from "../../lib/partnerApi";
import type { PublicPartnerBranding } from "../../lib/partnerBranding";
import BizuplyLoader from "../../components/ui/BizuplyLoader";

const HomePage = lazy(() => import("../Home"));

export default function PartnerHostHome() {
  const [branding, setBranding] = useState<PublicPartnerBranding | null | undefined>(
    undefined
  );

  useEffect(() => {
    let cancelled = false;
    fetchPublicPartnerBranding({ host: window.location.host })
      .then((data) => {
        if (!cancelled) setBranding(data || null);
      })
      .catch(() => {
        if (!cancelled) setBranding(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (branding === undefined) {
    return <BizuplyLoader fullScreen label="טוען..." />;
  }
  const hostSales = Boolean(
    branding?.slug && (branding.whiteLabelEnabled || branding.urls?.subdomainUrl)
  );
  if (hostSales) {
    return <Navigate to="/plans" replace />;
  }
  return <HomePage />;
}
