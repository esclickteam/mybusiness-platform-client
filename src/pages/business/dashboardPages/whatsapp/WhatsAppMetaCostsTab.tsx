import React from "react";
import { useWhatsAppHubContext } from "../../../dev/useWhatsAppHubContext";
import MetaCostCalculator from "./MetaCostCalculator";

export default function WhatsAppMetaCostsTab() {
  const { businessId, connection } = useWhatsAppHubContext();
  return (
    <MetaCostCalculator
      variant="dashboard"
      businessId={businessId}
      connected={Boolean(connection?.connected)}
    />
  );
}
