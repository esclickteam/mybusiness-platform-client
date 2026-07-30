import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import {
  listWhatsAppCampaigns,
  listWhatsAppLogs,
  type WhatsAppCampaign,
  type WhatsAppMessageLog,
} from "../../../../api/whatsappApi";
import { cardBase } from "../../../../styles/bizuplyUi";

type OutletCtx = { businessId: string | null };

function statusClass(status: string) {
  if (
    status === "sent" ||
    status === "delivered" ||
    status === "read" ||
    status === "completed" ||
    status === "received"
  ) {
    return "bg-emerald-50 text-emerald-700";
  }
  if (status === "failed") return "bg-rose-50 text-rose-700";
  return "bg-slate-100 text-slate-600";
}

export default function WhatsAppHistoryTab() {
  const { t } = useTranslation();
  const { businessId } = useOutletContext<OutletCtx>();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<WhatsAppMessageLog[]>([]);
  const [campaigns, setCampaigns] = useState<WhatsAppCampaign[]>([]);

  useEffect(() => {
    if (!businessId) return;
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const [logRows, campaignRows] = await Promise.all([
          listWhatsAppLogs(businessId, 80),
          listWhatsAppCampaigns(businessId),
        ]);
        if (cancelled) return;
        setLogs(logRows);
        setCampaigns(campaignRows);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.error || t("whatsapp.errors.loadHistory")
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [businessId, t]);

  if (loading) {
    return (
      <div className={`${cardBase} flex items-center justify-center gap-2 p-10`}>
        <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
        <span className="text-sm font-semibold text-slate-600">
          {t("whatsapp.loading")}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className={`${cardBase} p-4 sm:p-5`}>
        <h2 className="text-lg font-black text-slate-900">
          {t("whatsapp.history.campaignsTitle")}
        </h2>
        <p className="mt-1 text-sm font-medium text-slate-500">
          {t("whatsapp.history.campaignsSubtitle")}
        </p>

        <div className="mt-4 space-y-2">
          {campaigns.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 px-3 py-10 text-center text-sm font-medium text-slate-400">
              {t("whatsapp.history.noCampaigns")}
            </p>
          ) : (
            campaigns.map((campaign) => (
              <article
                key={campaign._id}
                className="rounded-xl border border-slate-200 px-3 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      {campaign.name || campaign.templateName || "—"}
                    </h3>
                    <p className="mt-0.5 text-xs font-medium text-slate-500">
                      {campaign.createdAt
                        ? new Date(campaign.createdAt).toLocaleString()
                        : ""}
                    </p>
                  </div>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-black ${statusClass(campaign.status)}`}
                  >
                    {t(`whatsapp.history.status.${campaign.status}`, {
                      defaultValue: campaign.status,
                    })}
                  </span>
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-500">
                  {t("whatsapp.history.campaignStats", {
                    total: campaign.stats?.total ?? 0,
                    sent: campaign.stats?.sent ?? 0,
                    failed: campaign.stats?.failed ?? 0,
                  })}
                </p>
              </article>
            ))
          )}
        </div>
      </section>

      <section className={`${cardBase} overflow-hidden`}>
        <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
          <h2 className="text-lg font-black text-slate-900">
            {t("whatsapp.history.messagesTitle")}
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {t("whatsapp.history.messagesSubtitle")}
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {logs.length === 0 ? (
            <p className="px-4 py-12 text-center text-sm font-medium text-slate-400">
              {t("whatsapp.history.noMessages")}
            </p>
          ) : (
            logs.map((log) => (
              <div
                key={log._id}
                className="grid gap-2 px-4 py-3 sm:grid-cols-[1fr_auto] sm:px-5"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-black text-slate-900">
                      {log.recipientName || log.recipientPhone}
                    </p>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[11px] font-black ${statusClass(log.status)}`}
                    >
                      {t(`whatsapp.history.status.${log.status}`, {
                        defaultValue: log.status,
                      })}
                    </span>
                    {log.direction && (
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-black text-slate-600">
                        {t(`whatsapp.history.direction.${log.direction}`, {
                          defaultValue: log.direction,
                        })}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs font-semibold text-slate-500" dir="ltr">
                    {log.recipientPhone}
                  </p>
                  <p className="mt-1 line-clamp-3 text-sm font-medium text-slate-600 whitespace-pre-wrap">
                    {log.body || "—"}
                  </p>
                  {log.templateName && (
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      {t("whatsapp.history.template")}: {log.templateName}
                      {log.templateLanguage ? ` (${log.templateLanguage})` : ""}
                    </p>
                  )}
                  {log.providerMessageId && (
                    <p className="mt-1 break-all font-mono text-[11px] font-semibold text-slate-500" dir="ltr">
                      Meta Message ID: {log.providerMessageId}
                    </p>
                  )}
                  {log.error && (
                    <p className="mt-1 text-xs font-semibold text-rose-600">
                      {t("whatsapp.history.failureReason")}: {log.error}
                    </p>
                  )}
                </div>
                <div className="text-xs font-semibold text-slate-400 sm:text-end">
                  <p>
                    {log.sentAt || log.createdAt
                      ? new Date(log.sentAt || log.createdAt || "").toLocaleString()
                      : ""}
                  </p>
                  <p className="mt-1">
                    {t(`whatsapp.history.source.${log.source || "manual"}`, {
                      defaultValue: log.source || "manual",
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
