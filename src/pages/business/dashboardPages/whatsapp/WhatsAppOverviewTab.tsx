import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2, PlugZap, RefreshCw } from "lucide-react";
import {
  getWhatsAppAccountHealth,
  getWhatsAppHubActivity,
  type WhatsAppAccountHealth,
  type WhatsAppHubActivityEvent,
} from "../../../../api/whatsappApi";
import { getIntlLocale, getTextDirection } from "../../../../i18n/localeUtils";
import { btnPrimary, btnSecondary, cardBase } from "../../../../styles/bizuplyUi";
import {
  formatMessagingLimit,
  formatQualityRating,
  qualityBadgeClass,
  toneBadgeClass,
} from "./hubFormat";
import { useWhatsAppVisualQaOverride } from "../../../dev/whatsappVisualQaContext";
import { useWhatsAppHubContext } from "../../../dev/useWhatsAppHubContext";

function StatCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <article className={`${cardBase} px-3 py-2.5`}>
      <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <div className="mt-1.5">{children}</div>
    </article>
  );
}

export default function WhatsAppOverviewTab() {
  const { t, i18n } = useTranslation();
  const {
    businessId,
    connection,
    connectionLoading,
    syncWithMeta,
    syncing,
  } = useWhatsAppHubContext();
  const visualQa = useWhatsAppVisualQaOverride();
  const [health, setHealth] = useState<WhatsAppAccountHealth | null>(null);
  const [activity, setActivity] = useState<WhatsAppHubActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const locale = getIntlLocale(i18n.language);

  useEffect(() => {
    if (visualQa) {
      setHealth({
        connection: visualQa.connection,
        metrics: [
          { key: "templatesApproved", label: "", value: 12, source: "Meta" },
          { key: "templatesPending", label: "", value: 2, source: "Meta" },
          { key: "templatesRejected", label: "", value: 1, source: "Meta" },
        ],
        chart7d: [],
        comparison: {
          current: { sent: 48, delivered: 45, read: 31, failed: 2 },
          previous: {},
        },
        messagingLimits: {
          raw: "TIER_10K",
          currentKey: "10k",
          currentLabel: "10K",
          description: "",
          numeric: 10000,
          steps: [],
          source: "Meta",
          available: true,
          updatedAt: new Date().toISOString(),
        },
      });
      setActivity([
        {
          id: "1",
          type: "message_delivered",
          at: new Date().toISOString(),
          title: "appointment_reminder",
        },
        {
          id: "2",
          type: "template_approved",
          at: new Date(Date.now() - 3600000).toISOString(),
          title: "welcome_he",
        },
        {
          id: "3",
          type: "meta_sync",
          at: new Date(Date.now() - 7200000).toISOString(),
          title: "Meta sync",
        },
      ]);
      setLoading(false);
      return;
    }
    if (!businessId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [data, act] = await Promise.all([
          getWhatsAppAccountHealth(businessId),
          getWhatsAppHubActivity(businessId, { limit: 12 }).catch(() => ({
            events: [] as WhatsAppHubActivityEvent[],
          })),
        ]);
        if (!cancelled) {
          setHealth(data);
          setActivity(act.events || []);
        }
      } catch {
        if (!cancelled) setError(t("whatsapp.hub.overviewLoadError"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [businessId, t, connection?.lastMetaSyncAt, visualQa]);

  const templateSummary = useMemo(() => {
    const metrics = health?.metrics || [];
    const pick = (key: string) =>
      metrics.find((m) => m.key === key)?.value as number | undefined;
    return {
      approved: pick("templatesApproved") ?? 0,
      pending: pick("templatesPending") ?? 0,
      rejected: pick("templatesRejected") ?? 0,
    };
  }, [health]);

  const msgStats = useMemo(() => {
    const c = health?.comparison?.current || {};
    return {
      sent: Number(c.sent ?? 0),
      delivered: Number(c.delivered ?? 0),
      read: Number(c.read ?? 0),
      failed: Number(c.failed ?? 0),
    };
  }, [health]);

  const quality = formatQualityRating(
    connection?.qualityRating || health?.connection?.qualityRating
  );
  const limit = formatMessagingLimit(
    connection?.messagingLimitTier ||
      health?.messagingLimits?.raw ||
      health?.connection?.messagingLimitTier
  );

  const busy = (connectionLoading && !connection) || loading;

  return (
    <div dir={getTextDirection(i18n.language)} className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-black text-slate-900">
          {t("whatsapp.hub.overviewTitle")}
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {!connection?.connected ? (
            <Link to="../connection" className={`${btnPrimary} !px-3 !py-1.5 text-xs`}>
              <PlugZap className="h-3.5 w-3.5" />
              {t("whatsapp.hub.connectCta")}
            </Link>
          ) : (
            <button
              type="button"
              className={`${btnSecondary} !px-3 !py-1.5 text-xs`}
              disabled={syncing}
              onClick={() => void syncWithMeta()}
            >
              {syncing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              {t("whatsapp.hub.syncWithMeta")}
            </button>
          )}
        </div>
      </div>

      {error ? (
        <div className={`${cardBase} border-rose-100 bg-rose-50/60 px-3 py-2 text-xs font-semibold text-rose-700`}>
          {error}
        </div>
      ) : null}

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {busy ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`${cardBase} h-[72px] animate-pulse bg-slate-50`} />
          ))
        ) : (
          <>
            <StatCard label={t("whatsapp.hub.cards.status")}>
              <div className="flex flex-wrap gap-1">
                <span
                  className={`rounded-md border px-1.5 py-0.5 text-[11px] font-bold ${toneBadgeClass(
                    connection?.connected ? "ok" : "neutral"
                  )}`}
                >
                  {connection?.connected
                    ? t("whatsapp.hub.connected")
                    : t("whatsapp.hub.disconnected")}
                </span>
                <span
                  className={`rounded-md border px-1.5 py-0.5 text-[11px] font-bold ${toneBadgeClass(
                    connection?.readyToSend ? "ok" : "warn"
                  )}`}
                >
                  {connection?.readyToSend
                    ? t("whatsapp.hub.ready")
                    : t("whatsapp.hub.issue")}
                </span>
              </div>
            </StatCard>
            <StatCard label={t("whatsapp.hub.cards.quality")}>
              {quality ? (
                <span
                  className={`inline-flex rounded-md border px-2 py-0.5 text-sm font-black ${qualityBadgeClass(
                    connection?.qualityRating
                  )}`}
                >
                  {quality}
                </span>
              ) : (
                <span className="text-sm font-semibold text-slate-400">—</span>
              )}
            </StatCard>
            <StatCard label={t("whatsapp.hub.cards.messagingLimit")}>
              <p className="text-sm font-black text-slate-900">
                {limit || "—"}
              </p>
            </StatCard>
            <StatCard label={t("whatsapp.hub.cards.templates")}>
              <p className="text-sm font-black text-slate-900">
                <span className="text-emerald-700">{templateSummary.approved}</span>
                <span className="mx-1 text-slate-300">/</span>
                <span className="text-amber-700">{templateSummary.pending}</span>
                <span className="mx-1 text-slate-300">/</span>
                <span className="text-rose-700">{templateSummary.rejected}</span>
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-slate-400">
                {t("whatsapp.hub.approved")} · {t("whatsapp.hub.pending")} ·{" "}
                {t("whatsapp.hub.rejected")}
              </p>
            </StatCard>
            <StatCard label={t("whatsapp.hub.cards.messagesWindow")}>
              <p className="text-sm font-black text-slate-900">
                {msgStats.sent.toLocaleString(locale)}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-slate-400">
                {t("whatsapp.hub.last7days")} · {t("whatsapp.hub.delivered")}{" "}
                {msgStats.delivered} · {t("whatsapp.hub.failed")} {msgStats.failed}
              </p>
            </StatCard>
          </>
        )}
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
        <article className={`${cardBase} p-3 sm:p-4`}>
          <h3 className="text-sm font-black text-slate-900">
            {t("whatsapp.hub.accountDetails")}
          </h3>
          <dl className="mt-3 grid gap-x-4 gap-y-2.5 sm:grid-cols-2">
            {[
              ["WABA ID", connection?.wabaId || "—", true],
              ["Phone Number ID", connection?.phoneNumberId || "—", true],
              [
                t("whatsapp.hub.phone"),
                connection?.displayPhoneNumber || "—",
                true,
              ],
              [
                t("whatsapp.hub.displayName"),
                connection?.verifiedName || "—",
                false,
              ],
              [
                t("whatsapp.hub.cards.verification"),
                connection?.businessVerificationStatus || "—",
                false,
              ],
              ["WABA", connection?.wabaName || "—", false],
            ].map(([label, value, ltr]) => (
              <div key={String(label)}>
                <dt className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                  {label}
                </dt>
                <dd
                  className="mt-0.5 break-all text-sm font-bold text-slate-800"
                  dir={ltr ? "ltr" : undefined}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </article>

        <article className={`${cardBase} p-3 sm:p-4`}>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-black text-slate-900">
              {t("whatsapp.hub.activityTitle")}
            </h3>
            <Link
              to="../messages/history"
              className="text-[11px] font-black text-emerald-700"
            >
              {t("whatsapp.nav.history")} →
            </Link>
          </div>
          <div className="mt-2 max-h-[280px] space-y-1.5 overflow-y-auto">
            {!activity.length ? (
              <p className="rounded-lg border border-dashed border-slate-200 px-3 py-8 text-center text-xs font-semibold text-slate-400">
                {t("whatsapp.hub.activityEmpty")}
              </p>
            ) : (
              activity.slice(0, 10).map((event) => (
                <div
                  key={event.id}
                  className="flex items-start justify-between gap-2 rounded-lg border border-slate-100 px-2.5 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                      {event.type.replace(/_/g, " ")}
                    </p>
                    <p className="truncate text-xs font-bold text-slate-800">
                      {event.title}
                    </p>
                  </div>
                  <time className="shrink-0 text-[10px] font-semibold text-slate-400">
                    {event.at
                      ? new Date(event.at).toLocaleString(locale, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </time>
                </div>
              ))
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
