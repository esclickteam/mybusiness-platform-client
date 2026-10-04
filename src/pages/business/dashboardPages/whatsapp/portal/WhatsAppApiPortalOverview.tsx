import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  getWhatsAppExternalApiSettings,
  type WhatsAppExternalApiSettings,
} from "../../../../../api/whatsappApi";
import { useWhatsAppApiSubscription } from "../../../../../api/whatsappApiPortal";
import { whatsappBasePath } from "../hubNavigation";
import WhatsAppApiSubscriptionCard, { useSubscriptionCopy } from "./WhatsAppApiSubscriptionCard";
import WhatsAppApiSetupSteps, { subscriptionStepStatus, type SetupStep } from "./WhatsAppApiSetupSteps";

type Props = {
  businessId: string | null | undefined;
  connected: boolean;
  messageSent: boolean;
};

export default function WhatsAppApiPortalOverview({ businessId, connected, messageSent }: Props) {
  const location = useLocation();
  const base = whatsappBasePath(location.pathname);
  const welcome = new URLSearchParams(location.search).get("welcome") === "whatsapp_api";
  const { access, loading } = useWhatsAppApiSubscription(businessId);
  const subscription = useSubscriptionCopy(access);
  const [settings, setSettings] = useState<WhatsAppExternalApiSettings | null>(null);

  useEffect(() => {
    if (!businessId) return undefined;
    let cancelled = false;
    getWhatsAppExternalApiSettings(businessId)
      .then((data) => {
        if (!cancelled) setSettings(data);
      })
      .catch(() => {
        if (!cancelled) setSettings(null);
      });
    return () => {
      cancelled = true;
    };
  }, [businessId]);

  const hasKey = Boolean(settings?.keys?.some((k) => k.status === "active"));
  const hasWebhook = Boolean(settings?.webhook?.url);

  const steps: SetupStep[] = [
    {
      key: "subscription",
      status: loading ? "todo" : subscriptionStepStatus(subscription.state),
      to: `${base}/billing`,
      detail: loading ? undefined : `${subscription.label} · ${subscription.detail}`,
    },
    { key: "connect", status: connected ? "done" : "todo", to: `${base}/connection` },
    { key: "apiKey", status: hasKey ? "done" : "todo", to: `${base}/developers` },
    { key: "webhook", status: hasWebhook ? "done" : "todo", to: `${base}/developers` },
    { key: "firstMessage", status: messageSent ? "done" : "todo", to: `${base}/developers` },
  ];

  return (
    <div className="space-y-3" data-testid="wa-api-portal-overview">
      <WhatsAppApiSubscriptionCard access={access} loading={loading} businessId={businessId} compact />
      <WhatsAppApiSetupSteps steps={steps} welcome={welcome} />
    </div>
  );
}
