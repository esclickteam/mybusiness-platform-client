import React from "react";
import { useParams } from "react-router-dom";
import ClientBookingPage from "./ClientBookingPage";
import PublicIntroBookingPage from "./PublicIntroBookingPage";

const OBJECT_ID_RE = /^[a-fA-F0-9]{24}$/;

/**
 * Tenant / customer calendar stays at `/book/:businessId` (Mongo ObjectId).
 * יומן BizUply public booking is `/book/bizuply/:token`.
 *
 * Fallback: a non-ObjectId `/book/:id` still opens the BizUply page so Meta
 * templates registered as `https://bizuply.com/book/{{1}}` keep working
 * without colliding with tenant business IDs.
 */
export default function BookRouteDispatch() {
  const params = useParams();
  const value = String(params.businessId || params.token || "").trim();
  if (OBJECT_ID_RE.test(value)) {
    return <ClientBookingPage />;
  }
  return <PublicIntroBookingPage />;
}
