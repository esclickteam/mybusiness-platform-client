import React from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../../../i18n/localeUtils";
import WhatsAppExternalApiSettingsCard from "./WhatsAppExternalApiSettingsCard";
import type { WhatsAppHubOutletContext } from "./WhatsAppMain";

export default function WhatsAppDevelopersTab() {
  const { t, i18n } = useTranslation();
  const { businessId, connection } = useOutletContext<WhatsAppHubOutletContext>();

  return (
    <div dir={getTextDirection(i18n.language)} className="space-y-4">
      <div>
        <h2 className="text-lg font-black text-slate-900">
          {t("whatsapp.hub.developersTitle")}
        </h2>
        <p className="mt-0.5 text-sm font-semibold text-slate-500">
          {t("whatsapp.hub.developersSubtitle")}
        </p>
      </div>
      {businessId ? (
        <WhatsAppExternalApiSettingsCard
          businessId={businessId}
          linked={Boolean(connection?.connected)}
        />
      ) : null}
    </div>
  );
}
