import React from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink, KeyRound, Radio } from "lucide-react";
import { getTextDirection } from "../../../../i18n/localeUtils";
import { btnSecondary, cardBase } from "../../../../styles/bizuplyUi";
import WhatsAppExternalApiSettingsCard from "./WhatsAppExternalApiSettingsCard";
import WhatsAppChannelSettingsCard from "./WhatsAppChannelSettingsCard";
import { useWhatsAppHubContext } from "../../../dev/useWhatsAppHubContext";
import { useWhatsAppVisualQaOverride } from "../../../dev/whatsappVisualQaContext";

function SectionHeader({
  tone,
  icon,
  direction,
  title,
  hint,
}: {
  tone: "channel" | "external";
  icon: React.ReactNode;
  direction: string;
  title: string;
  hint: string;
}) {
  const toneClass =
    tone === "channel"
      ? "border-emerald-100 bg-emerald-50/70 text-emerald-800"
      : "border-sky-100 bg-sky-50/70 text-sky-800";
  return (
    <div className="flex items-start gap-3 px-0.5">
      <span
        className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border ${toneClass}`}
      >
        {icon}
      </span>
      <div>
        <p
          className={`text-[10px] font-black uppercase tracking-wide ${
            tone === "channel" ? "text-emerald-700" : "text-sky-700"
          }`}
        >
          {direction}
        </p>
        <h3 className="mt-0.5 text-sm font-black text-slate-900">{title}</h3>
        <p className="mt-0.5 text-[12px] font-semibold text-slate-500">{hint}</p>
      </div>
    </div>
  );
}

export default function WhatsAppDevelopersTab() {
  const { t, i18n } = useTranslation();
  const { businessId, connection } = useWhatsAppHubContext();
  const visualQa = useWhatsAppVisualQaOverride();

  return (
    <div dir={getTextDirection(i18n.language)} className="space-y-5">
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
          href="https://api.bizuply.com/api/v1/whatsapp/docs"
          target="_blank"
          rel="noreferrer"
          className={`${btnSecondary} !px-3 !py-1.5 text-xs`}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          {t("whatsapp.hub.developerDocs")}
        </a>
      </div>

      {visualQa ? (
        <div className="grid gap-3 lg:grid-cols-2">
          <article className={`${cardBase} space-y-2 p-3`}>
            <h3 className="text-sm font-black">
              {t("whatsapp.settings.channelSettingsTitle")}
            </h3>
            <p className="font-mono text-xs" dir="ltr">
              https://api.bizuply.com/api/whatsapp/webhook
            </p>
          </article>
          <article className={`${cardBase} space-y-2 p-3`}>
            <h3 className="text-sm font-black">
              {t("whatsapp.settings.channelExternalApiTitle")}
            </h3>
            <p className="font-mono text-xs" dir="ltr">
              https://api.bizuply.com/api/v1/whatsapp
            </p>
          </article>
        </div>
      ) : businessId ? (
        <div className="wa-hub-developers space-y-6">
          <section className="space-y-2.5">
            <SectionHeader
              tone="channel"
              icon={<Radio className="h-4 w-4" />}
              direction={t("whatsapp.settings.channelSettingsDirection")}
              title={t("whatsapp.settings.channelSettingsTitle")}
              hint={t("whatsapp.settings.channelSettingsHint")}
            />
            <WhatsAppChannelSettingsCard businessId={businessId} />
          </section>
          <section className="space-y-2.5 border-t border-slate-200 pt-5">
            <SectionHeader
              tone="external"
              icon={<KeyRound className="h-4 w-4" />}
              direction={t("whatsapp.settings.channelExternalApiDirection")}
              title={t("whatsapp.settings.channelExternalApiTitle")}
              hint={t("whatsapp.settings.channelExternalApiHint")}
            />
            <WhatsAppExternalApiSettingsCard
              businessId={businessId}
              linked={Boolean(connection?.connected)}
            />
          </section>
        </div>
      ) : null}
    </div>
  );
}
