import React from "react";
import WhatsAppWebThread from "./whatsappWeb/WhatsAppWebThread";

export default function AdminCrmWhatsAppPanel({
  customerId,
  canSend,
  canTemplates,
  canDemo = true,
  onBanner,
  initialIntent = "message",
}: {
  customerId: string;
  canSend: boolean;
  canTemplates: boolean;
  canDemo?: boolean;
  onBanner: (msg: string) => void;
  initialIntent?: "message" | "follow_up" | "demo" | "payment";
}) {
  return (
    <div className="h-[min(720px,calc(100vh-220px))] min-h-[520px] overflow-hidden rounded-[24px] border border-purple-100">
      <WhatsAppWebThread
        customerId={customerId}
        canSend={canSend}
        canTemplates={canTemplates}
        canDemo={canDemo}
        onBanner={onBanner}
        initialIntent={initialIntent}
        showConnectionCards
      />
    </div>
  );
}
