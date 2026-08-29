import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2, Pencil, Plug, Sparkles } from "lucide-react";
import { btnPrimary, btnSecondary } from "../../../../styles/bizuplyUi";
import type {
  AiAutomationRecommendation,
  AiCampaignSessionResponse,
} from "../../../../api/metaAiCampaignApi";

export type EnableAllResult = {
  enabledCount: number;
  failedCount: number;
  failed: Array<{ key: string; reason: string }>;
} | null;

function blockedCopy(
  rec: AiAutomationRecommendation,
  t: (key: string) => string
) {
  if (rec.blockedReason === "WHATSAPP_DISCONNECTED") {
    return t("metaCampaigns.ai.automations.needsWhatsApp");
  }
  if (rec.blockedReason === "WHATSAPP_TEMPLATE_REQUIRED") {
    return t("metaCampaigns.ai.automations.needsTemplate");
  }
  if (rec.blockedReason === "CAMPAIGN_ID_REQUIRED") {
    return t("metaCampaigns.ai.automations.needsCampaign");
  }
  return rec.reason || rec.description || "";
}

export default function MetaAiAutomationRecommendations({
  session,
  businessId,
  loading,
  enablingKey,
  enableAllResult,
  onEnable,
  onEnableAll,
  onDismiss,
}: {
  session: AiCampaignSessionResponse;
  businessId: string;
  loading: boolean;
  enablingKey: string | null;
  enableAllResult: EnableAllResult;
  onEnable: (key: string) => void;
  onEnableAll: () => void;
  onDismiss: (key: string) => void;
}) {
  const { t } = useTranslation();
  const rows = session.automationRecommendations || [];
  const visible = rows.filter((row) => row.status !== "DISMISSED");
  const dismissed = rows.filter((row) => row.status === "DISMISSED");
  const enableable = visible.filter(
    (row) =>
      row.status === "RECOMMENDED" && row.blockedReason !== "CAMPAIGN_ID_REQUIRED"
  );
  const whatsappPath = `/business/${businessId}/dashboard/whatsapp/settings`;

  return (
    <section className="space-y-3" data-testid="meta-ai-automations">
      <div>
        <p className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-violet-700">
          <Sparkles className="h-3.5 w-3.5" />
          {t("metaCampaigns.ai.automations.badge")}
        </p>
        <h3 className="mt-1 text-lg font-black text-slate-900">
          {t("metaCampaigns.ai.automations.title")}
        </h3>
      </div>

      {loading ? (
        <div
          className="flex items-center gap-2 py-4 text-sm font-semibold text-slate-600"
          data-testid="meta-ai-automations-loading"
        >
          <Loader2 className="h-4 w-4 animate-spin text-violet-600" />
          {t("metaCampaigns.ai.automations.loading")}
        </div>
      ) : null}

      {!loading && !visible.length && !dismissed.length ? (
        <p
          className="text-sm font-semibold text-slate-500"
          data-testid="meta-ai-automations-empty"
        >
          {t("metaCampaigns.ai.automations.empty")}
        </p>
      ) : null}

      {enableAllResult ? (
        <div
          className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700"
          data-testid="meta-ai-automations-partial"
        >
          {t("metaCampaigns.ai.automations.enableAllResult", {
            enabled: enableAllResult.enabledCount,
            failed: enableAllResult.failedCount,
          })}
          {enableAllResult.failed.map((item) => (
            <p key={item.key} className="mt-1 text-xs font-semibold text-amber-800">
              {item.key}: {item.reason}
            </p>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-3">
        {visible.map((rec) => {
          const unavailable = rec.status === "UNAVAILABLE";
          const created = rec.status === "CREATED";
          const waitingCampaign =
            rec.status === "RECOMMENDED" &&
            rec.blockedReason === "CAMPAIGN_ID_REQUIRED";
          return (
            <article
              key={rec.key}
              className="rounded-xl border border-slate-200 bg-white p-4"
              data-testid="meta-ai-automation-card"
              data-key={rec.key}
              data-status={rec.status}
            >
              <h4 className="text-sm font-black text-slate-900">
                {rec.name || rec.key}
              </h4>
              <p className="mt-1 text-sm font-semibold text-slate-600">
                {unavailable || waitingCampaign
                  ? blockedCopy(rec, t)
                  : rec.description || rec.reason}
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                {created ? (
                  <>
                    <span
                      className="inline-flex items-center text-xs font-black uppercase tracking-wide text-emerald-700"
                      data-testid="meta-ai-automation-active"
                    >
                      {t("metaCampaigns.ai.automations.active")}
                    </span>
                    {rec.automationWorkflowId ? (
                      <Link
                        to={`/business/${businessId}/dashboard/automations/${rec.automationWorkflowId}`}
                        className={btnSecondary}
                        data-testid="meta-ai-automation-edit"
                      >
                        <Pencil className="h-4 w-4" />
                        {t("metaCampaigns.ai.automations.edit")}
                      </Link>
                    ) : null}
                  </>
                ) : null}
                {unavailable && rec.blockedReason === "WHATSAPP_DISCONNECTED" ? (
                  <Link
                    to={whatsappPath}
                    className={btnPrimary}
                    data-testid="meta-ai-automation-wa-connect"
                  >
                    <Plug className="h-4 w-4" />
                    {t("metaCampaigns.ai.automations.connectWhatsApp")}
                  </Link>
                ) : null}
                {unavailable && rec.blockedReason !== "WHATSAPP_DISCONNECTED" ? (
                  <span
                    className="text-xs font-bold text-amber-800"
                    data-testid="meta-ai-automation-unavailable"
                  >
                    {blockedCopy(rec, t)}
                  </span>
                ) : null}
                {waitingCampaign ? (
                  <span className="text-xs font-bold text-slate-500">
                    {t("metaCampaigns.ai.automations.needsCampaign")}
                  </span>
                ) : null}
                {rec.status === "RECOMMENDED" && !waitingCampaign ? (
                  <button
                    type="button"
                    className={btnPrimary}
                    data-testid="meta-ai-automation-enable"
                    disabled={Boolean(enablingKey)}
                    onClick={() => onEnable(rec.key)}
                  >
                    {enablingKey === rec.key ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : null}
                    {t("metaCampaigns.ai.automations.enable")}
                  </button>
                ) : null}
                {rec.status === "RECOMMENDED" ? (
                  <button
                    type="button"
                    className={btnSecondary}
                    data-testid="meta-ai-automation-dismiss"
                    disabled={Boolean(enablingKey)}
                    onClick={() => onDismiss(rec.key)}
                  >
                    {t("metaCampaigns.ai.automations.dismiss")}
                  </button>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      {dismissed.map((rec) => (
        <p
          key={rec.key}
          className="text-xs font-semibold text-slate-400"
          data-testid="meta-ai-automation-dismissed"
        >
          {t("metaCampaigns.ai.automations.dismissed")}: {rec.name || rec.key}
        </p>
      ))}

      {enableable.length > 1 ? (
        <button
          type="button"
          className={btnPrimary}
          data-testid="meta-ai-automation-enable-all"
          disabled={Boolean(enablingKey)}
          onClick={onEnableAll}
        >
          {enablingKey === "all" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : null}
          {t("metaCampaigns.ai.automations.enableAll")}
        </button>
      ) : null}
    </section>
  );
}
