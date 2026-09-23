import { useOutletContext } from "react-router-dom";
import type { WhatsAppHubOutletContext } from "../business/dashboardPages/whatsapp/WhatsAppMain";
import { useWhatsAppVisualQaOverride } from "./whatsappVisualQaContext";

export function useWhatsAppHubContext(): WhatsAppHubOutletContext {
  const visual = useWhatsAppVisualQaOverride();
  const outlet = useOutletContext<WhatsAppHubOutletContext | undefined>();

  if (visual?.connection) {
    return {
      businessId: "visual-qa-biz",
      connection: visual.connection,
      connectionLoading: false,
      refreshConnection: async () => undefined,
      syncWithMeta: async () => undefined,
      syncing: false,
      openBillingSetup: () => undefined,
      billingUsage: null,
      billingLoading: false,
      billingError: null,
      refreshBilling: async () => undefined,
      ...(visual.outlet || {}),
    };
  }

  if (!outlet) {
    throw new Error("WhatsApp hub context is missing");
  }
  return outlet;
}
