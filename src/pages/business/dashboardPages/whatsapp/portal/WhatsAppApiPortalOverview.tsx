import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";
import {
  getWhatsAppExternalApiSettings,
  type WhatsAppExternalApiSettings,
} from "../../../../../api/whatsappApi";
import { useWhatsAppApiSubscription, type WhatsAppApiBusinessProfile } from "../../../../../api/whatsappApiPortal";
import { whatsappBasePath } from "../hubNavigation";
import WhatsAppApiSubscriptionCard, { useSubscriptionCopy } from "./WhatsAppApiSubscriptionCard";
import WhatsAppApiSetupSteps, { subscriptionStepStatus, type SetupStep } from "./WhatsAppApiSetupSteps";
import WhatsAppApiBusinessDetailsCard, { BUSINESS_DETAILS_ANCHOR } from "./WhatsAppApiBusinessDetailsCard";

type Props = {
  businessId: string | null | undefined;
  connected: boolean;
  messageSent: boolean;
};

export default function WhatsAppApiPortalOverview({ businessId, connected, messageSent }: Props) {
  const { t } = useTranslation();
  const location = useLocation();
  const base = whatsappBasePath(location.pathname);
  const welcome = new URLSearchParams(location.search).get("welcome") === "whatsapp_api";
  const { access, loading } = useWhatsAppApiSubscription(businessId);
  const subscription = useSubscriptionCopy(access);
  const [settings, setSettings] = useState<WhatsAppExternalApiSettings | null>(null);
  const [profile, setProfile] = useState<WhatsAppApiBusinessProfile | null>(access?.profile ?? null);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileSource, setProfileSource] = useState(access);

  // Billing actions return access without `profile`; keep the last known one.
  if (access !== profileSource) {
    setProfileSource(access);
    if (access && "profile" in access) setProfile(access.profile ?? null);
  }

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
    ...(profile
      ? [{ key: "details" as const, status: profile.pending ? ("todo" as const) : ("done" as const), to: `#${BUSINESS_DETAILS_ANCHOR}` }]
      : []),
    { key: "connect", status: connected ? "done" : "todo", to: `${base}/connection` },
    { key: "apiKey", status: hasKey ? "done" : "todo", to: `${base}/developers` },
    { key: "webhook", status: hasWebhook ? "done" : "todo", to: `${base}/developers` },
    { key: "firstMessage", status: messageSent ? "done" : "todo", to: `${base}/developers` },
  ];

  return (
    <div className="space-y-3" data-testid="wa-api-portal-overview">
      <WhatsAppApiSubscriptionCard access={access} loading={loading} businessId={businessId} compact />
      {businessId && profile?.pending ? (
        <WhatsAppApiBusinessDetailsCard
          businessId={businessId}
          profile={profile}
          onSaved={(saved) => {
            setProfile(saved);
            setProfileSaved(true);
          }}
        />
      ) : null}
      {profileSaved ? (
        <p
          className="flex items-center gap-2 rounded-md border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800"
          role="status"
        >
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          {t("whatsappApiPortal.setup.businessDetails.saved")}
        </p>
      ) : null}
      <WhatsAppApiSetupSteps steps={steps} welcome={welcome} />
    </div>
  );
}
