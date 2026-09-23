import React from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";
import { getTextDirection } from "../../../../i18n/localeUtils";
import { btnSecondary, cardBase } from "../../../../styles/bizuplyUi";
import WhatsAppExternalApiSettingsCard from "./WhatsAppExternalApiSettingsCard";
import { useWhatsAppHubContext } from "../../../dev/useWhatsAppHubContext";
import { useWhatsAppVisualQaOverride } from "../../../dev/whatsappVisualQaContext";

export default function WhatsAppDevelopersTab() {
  const { t, i18n } = useTranslation();
  const { businessId, connection } = useWhatsAppHubContext();
  const visualQa = useWhatsAppVisualQaOverride();

  return (
    <div dir={getTextDirection(i18n.language)} className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-black text-slate-900">
            {t("whatsapp.hub.developersTitle")}
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            {t("whatsapp.hub.developersSubtitle")}
          </p>
        </div>
        <a
          href="/api/v1/whatsapp/docs"
          target="_blank"
          rel="noreferrer"
          className={`${btnSecondary} !px-3 !py-1.5 text-xs`}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          {t("whatsapp.hub.developerDocs")}
        </a>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {[
          {
            title: t("whatsapp.hub.devSectionApi"),
            text: t("whatsapp.hub.devSectionApiHint"),
          },
          {
            title: t("whatsapp.hub.devSectionWebhook"),
            text: t("whatsapp.hub.devSectionWebhookHint"),
          },
          {
            title: t("whatsapp.hub.devSectionDocs"),
            text: t("whatsapp.hub.devSectionDocsHint"),
          },
        ].map((s) => (
          <article key={s.title} className={`${cardBase} px-3 py-2.5`}>
            <p className="text-xs font-black text-slate-900">{s.title}</p>
            <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
              {s.text}
            </p>
          </article>
        ))}
      </div>

      {visualQa ? (
        <div className="grid gap-3 lg:grid-cols-2">
          <article className={`${cardBase} space-y-2 p-3`}>
            <h3 className="text-sm font-black">API Access</h3>
            <p className="text-[10px] font-black uppercase text-slate-400">
              API Base URL
            </p>
            <p className="font-mono text-xs" dir="ltr">
              https://api.bizuply.com/api/v1/whatsapp
            </p>
            <p className="text-[10px] font-black uppercase text-slate-400">
              API Key
            </p>
            <p className="font-mono text-xs">biz_wa_••••••••abcd</p>
            <p className="text-[11px] text-slate-500">
              Scopes: templates.read · messages.send · Last used: today
            </p>
          </article>
          <article className={`${cardBase} space-y-2 p-3`}>
            <h3 className="text-sm font-black">Webhook</h3>
            <p className="text-[10px] font-black uppercase text-slate-400">
              Webhook URL
            </p>
            <p className="font-mono text-xs" dir="ltr">
              https://partner.example/hooks/wa
            </p>
            <p className="text-[10px] font-black uppercase text-slate-400">
              Secret
            </p>
            <p className="font-mono text-xs">whsec_••••••••</p>
            <p className="text-[11px] text-slate-500">
              Last delivery: success · Test Webhook available
            </p>
          </article>
        </div>
      ) : businessId ? (
        <div className="wa-hub-developers">
          <WhatsAppExternalApiSettingsCard
            businessId={businessId}
            linked={Boolean(connection?.connected)}
          />
        </div>
      ) : null}
    </div>
  );
}
