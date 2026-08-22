import React from "react";
import { useParams } from "react-router-dom";
import ClientBookingPage from "./ClientBookingPage";
import PublicIntroBookingPage from "./PublicIntroBookingPage";

export default function BookRouteDispatch() {
  const params = useParams();
  const value = String(params.businessId || params.token || "").trim();
  if (/^[a-fA-F0-9]{24}$/.test(value)) {
    return <ClientBookingPage />;
  }
  return <PublicIntroBookingPage />;
}
