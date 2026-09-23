import React, { createContext, useContext } from "react";
import type { WhatsAppConnection } from "../../api/whatsappApi";
import type { WhatsAppHubOutletContext } from "../business/dashboardPages/whatsapp/WhatsAppMain";

export type WhatsAppVisualQaOverride = {
  connection: WhatsAppConnection;
  outlet?: Partial<WhatsAppHubOutletContext>;
};

const WhatsAppVisualQaContext = createContext<WhatsAppVisualQaOverride | null>(
  null
);

export function WhatsAppVisualQaProvider({
  value,
  children,
}: {
  value: WhatsAppVisualQaOverride;
  children: React.ReactNode;
}) {
  return (
    <WhatsAppVisualQaContext.Provider value={value}>
      {children}
    </WhatsAppVisualQaContext.Provider>
  );
}

export function useWhatsAppVisualQaOverride() {
  return useContext(WhatsAppVisualQaContext);
}
