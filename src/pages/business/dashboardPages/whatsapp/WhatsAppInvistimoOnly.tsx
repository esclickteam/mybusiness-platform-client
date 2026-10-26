import React from "react";
import { Navigate, useOutletContext } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { isInvistimoAdminBusiness } from "../../../../utils/invistimoAdmin";
import { normalizeBusinessId } from "../../../../utils/notificationNavigation";
import type { WhatsAppHubOutletContext } from "./WhatsAppMain";

/**
 * Extra WhatsApp hub screens stay mounted only for the existing Invistimo
 * tenant. Other Bizuply customers keep the previous overview redirect.
 */
export default function WhatsAppInvistimoOnly({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth() as {
    user?: { businessId?: string | null } | null;
  };
  const outlet = useOutletContext<WhatsAppHubOutletContext | null>();
  const businessId =
    normalizeBusinessId(outlet?.businessId) ||
    normalizeBusinessId(user?.businessId) ||
    null;

  if (!isInvistimoAdminBusiness(businessId)) {
    return <Navigate to="../overview" replace />;
  }

  return <>{children}</>;
}
