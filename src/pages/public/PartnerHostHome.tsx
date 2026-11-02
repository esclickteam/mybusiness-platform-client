import React from "react";
import { Navigate } from "react-router-dom";
import { usePartnerHostBranding } from "../../hooks/usePartnerHostBranding";
import HomeExperience from "../HomeExperiencePreview";

export default function PartnerHostHome() {
  const { ready, whiteLabelEnabled } = usePartnerHostBranding();
  if (ready && whiteLabelEnabled) {
    return <Navigate to="/plans" replace />;
  }
  return <HomeExperience indexed />;
}
