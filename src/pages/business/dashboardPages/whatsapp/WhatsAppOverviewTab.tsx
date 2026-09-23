import React, { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Loader2,
  PlugZap,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import {
  getWhatsAppAccountHealth,
  type WhatsAppAccountHealth,
} from "../../../../api/whatsappApi";
import { getIntlLocale, getTextDirection } from "../../../../i18n/localeUtils";
import { btnPrimary, btnSecondary, cardBase } from "../../../../styles/bizuplyUi";
import type { WhatsAppHubOutletContext } from "./WhatsAppMain";
import {
  formatMessagingLimit,
  formatNameStatus,
  formatQualityRating,
  nameStatusBadgeClass,
  qualityBadgeClass,
  toneBadgeClass,
} from "./hubFormat";

function MetricSkeleton() {
  return (
    <div className={`${cardBase} animate-pulse p-4`}>
      <div className="h-3 w-24 rounded bg-slate-100" />
      <div className="mt-3 h-6 w-32 rounded bg-slate-100" />
    </div>
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
  } = useOutletContext<WhatsAppHubOutletContext>();
  const [health, setHealth] = useState<WhatsAppAccountHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const locale = getIntlLocale(i18n.language);

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getWhatsAppAccountHealth(businessId);
        if (!cancelled) setHealth(data);
      } catch {
        if (!cancelled) setError(t("whatsapp.hub.overviewLoadError"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [businessId, t, connection?.lastMetaSyncAt]);

  const templateSummary = useMemo(() => {
    const metrics = health?.metrics || [];
    const pick = (key: string) =>
      metrics.find((m) => m.key === key)?.value as number | undefined;
    return {
      approved: pick("templatesApproved") ?? 0,
      pending: pick("templatesPending") ?? 0,
      rejected: pick("templatesRejected") ?? 0,
      paused: pick("templatesPaused") ?? 0,
      total:
        (pick("templatesApproved") ?? 0) +
        (pick("templatesPending") ?? 0) +
        (pick("templatesRejected") ?? 0) +
        (pick("templatesPaused") ?? 0) +
        (pick("templatesDisabled") ?? 0),
    };
  }, [health]);

  const monthStats = useMemo(() => {
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
  const nameStatus = formatNameStatus(
    connection?.nameStatus || health?.connection?.nameStatus
  );
  const limit = formatMessagingLimit(
    connection?.messagingLimitTier ||
      health?.messagingLimits?.raw ||
      health?.connection?.messagingLimitTier
  );
  const lastSync =
    connection?.lastMetaSyncAt ||
    health?.messagingLimits?.updatedAt ||
    null;

  return (
    <div dir={getTextDirection(i18n.language)} className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900">
            {t("whatsapp.hub.overviewTitle")}
          </h2>
          <p className="mt-0.5 text-sm font-semibold text-slate-500">
            {t("whatsapp.hub.overviewSubtitle")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!connection?.connected ? (
            <Link to="../connection" className={btnPrimary}>
              <PlugZap className="h-4 w-4" />
              {t("whatsapp.hub.connectCta")}
            </Link>
          ) : (
            <button
              type="button"
              className={btnSecondary}
              disabled={syncing}
              onClick={() => void syncWithMeta()}
            >
              {syncing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {t("whatsapp.hub.syncWithMeta")}
            </button>
          )}
        </div>
      </div>

      {error ? (
        <div className={`${cardBase} border-rose-100 bg-rose-50/60 p-4 text-sm font-semibold text-rose-700`}>
          {error}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {connectionLoading || loading ? (
          <>
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
          </>
        ) : (
          <>
            <article className={`${cardBase} p-4`}>
              <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                {t("whatsapp.hub.cards.status")}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${toneBadgeClass(
                    connection?.connected ? "ok" : "neutral"
                  )}`}
                >
                  {connection?.connected
                    ? t("whatsapp.hub.connected")
                    : t("whatsapp.hub.disconnected")}
                </span>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${toneBadgeClass(
                    connection?.readyToSend ? "ok" : "warn"
                  )}`}
                >
                  {connection?.readyToSend
                    ? t("whatsapp.hub.ready")
                    : t("whatsapp.hub.issue")}
                </span>
              </div>
              <p className="mt-3 text-sm font-bold text-slate-800" dir="ltr">
                {connection?.displayPhoneNumber || "—"}
              </p>
            </article>

            <article className={`${cardBase} p-4`}>
              <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                {t("whatsapp.hub.cards.displayName")}
              </p>
              <p className="mt-2 text-base font-black text-slate-900">
                {connection?.verifiedName || "—"}
              </p>
              {nameStatus ? (
                <span
                  className={`mt-2 inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${nameStatusBadgeClass(
                    connection?.nameStatus
                  )}`}
                >
                  {nameStatus}
                </span>
              ) : null}
            </article>

            <article className={`${cardBase} p-4`}>
              <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                {t("whatsapp.hub.cards.quality")}
              </p>
              {quality ? (
                <span
                  className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-sm font-black ${qualityBadgeClass(
                    connection?.qualityRating
                  )}`}
                >
                  {quality}
                </span>
              ) : (
                <p className="mt-2 text-sm font-semibold text-slate-400">
                  {t("whatsapp.hub.notAvailableFromMeta")}
                </p>
              )}
            </article>

            <article className={`${cardBase} p-4`}>
              <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                {t("whatsapp.hub.cards.messagingLimit")}
              </p>
              <p className="mt-2 text-base font-black text-slate-900">
                {limit || t("whatsapp.hub.notAvailableFromMeta")}
              </p>
            </article>

            <article className={`${cardBase} p-4`}>
              <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                WABA ID
              </p>
              <p className="mt-2 break-all font-mono text-sm font-bold text-slate-800" dir="ltr">
                {connection?.wabaId || "—"}
              </p>
              <p className="mt-3 text-[11px] font-black uppercase tracking-wide text-slate-400">
                Phone Number ID
              </p>
              <p className="mt-1 break-all font-mono text-sm font-bold text-slate-800" dir="ltr">
                {connection?.phoneNumberId || "—"}
              </p>
            </article>

            <article className={`${cardBase} p-4`}>
              <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                {t("whatsapp.hub.cards.verification")}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-sky-600" />
                <p className="text-sm font-bold text-slate-800">
                  {connection?.businessVerificationStatus ||
                    t("whatsapp.hub.notAvailableFromMeta")}
                </p>
              </div>
            </article>
          </>
        )}
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <article className={`${cardBase} p-4 lg:col-span-1`}>
          <h3 className="text-sm font-black text-slate-900">
            {t("whatsapp.hub.cards.templates")}
          </h3>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div>
              <dt className="text-slate-400 font-semibold">{t("whatsapp.hub.total")}</dt>
              <dd className="font-black text-slate-900">{templateSummary.total}</dd>
            </div>
            <div>
              <dt className="text-slate-400 font-semibold">{t("whatsapp.hub.approved")}</dt>
              <dd className="font-black text-emerald-700">{templateSummary.approved}</dd>
            </div>
            <div>
              <dt className="text-slate-400 font-semibold">{t("whatsapp.hub.pending")}</dt>
              <dd className="font-black text-amber-700">{templateSummary.pending}</dd>
            </div>
            <div>
              <dt className="text-slate-400 font-semibold">{t("whatsapp.hub.rejected")}</dt>
              <dd className="font-black text-rose-700">{templateSummary.rejected}</dd>
            </div>
          </dl>
          <Link to="../templates" className="mt-3 inline-flex text-xs font-black text-emerald-700">
            {t("whatsapp.hub.viewTemplates")} →
          </Link>
        </article>

        <article className={`${cardBase} p-4 lg:col-span-1`}>
          <h3 className="text-sm font-black text-slate-900">
            {t("whatsapp.hub.cards.messagesWindow")}
          </h3>
          <p className="mt-0.5 text-xs font-semibold text-slate-400">
            {t("whatsapp.hub.last7days")}
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div>
              <dt className="text-slate-400 font-semibold">{t("whatsapp.hub.sent")}</dt>
              <dd className="font-black">{monthStats.sent}</dd>
            </div>
            <div>
              <dt className="text-slate-400 font-semibold">{t("whatsapp.hub.delivered")}</dt>
              <dd className="font-black">{monthStats.delivered}</dd>
            </div>
            <div>
              <dt className="text-slate-400 font-semibold">{t("whatsapp.hub.read")}</dt>
              <dd className="font-black">{monthStats.read}</dd>
            </div>
            <div>
              <dt className="text-slate-400 font-semibold">{t("whatsapp.hub.failed")}</dt>
              <dd className="font-black text-rose-700">{monthStats.failed}</dd>
            </div>
          </dl>
        </article>

        <article className={`${cardBase} p-4 lg:col-span-1`}>
          <h3 className="text-sm font-black text-slate-900">
            {t("whatsapp.hub.cards.lastSync")}
          </h3>
          <p className="mt-3 text-sm font-bold text-slate-800">
            {lastSync
              ? new Date(lastSync).toLocaleString(locale)
              : t("whatsapp.hub.neverSynced")}
          </p>
          <p className="mt-2 text-xs font-semibold text-slate-400">
            {t("whatsapp.hub.syncHint")}
          </p>
        </article>
      </div>
    </div>
  );
}
