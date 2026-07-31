import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Activity, Loader2, RefreshCw } from "lucide-react";
import {
  getWhatsAppAccountHealth,
  syncWhatsAppAccountHealth,
  type WhatsAppAccountHealth,
  type WhatsAppHealthMetric,
  type WhatsAppMessagingLimits,
} from "../../../../api/whatsappApi";
import {
  btnPrimary,
  btnSecondary,
  cardBase,
} from "../../../../styles/bizuplyUi";

type OutletCtx = { businessId: string | null };

function formatMetricValue(
  value: unknown,
  locale: string | undefined
): string {
  if (value == null) return "—";
  if (typeof value === "string" || typeof value === "number") {
    if (
      typeof value === "string" &&
      /^\d{4}-\d{2}-\d{2}T/.test(value)
    ) {
      try {
        return new Date(value).toLocaleString(locale);
      } catch {
        return value;
      }
    }
    return String(value);
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (item && typeof item === "object" && "code" in item) {
          const row = item as { code: string; count: number };
          return `${row.code} (${row.count})`;
        }
        return String(item);
      })
      .join(" · ");
  }
  return JSON.stringify(value);
}

function sourceBadgeClass(source: string) {
  if (source === "Meta") return "bg-sky-50 text-sky-700 border-sky-100";
  if (source === "Webhook")
    return "bg-violet-50 text-violet-700 border-violet-100";
  return "bg-emerald-50 text-emerald-700 border-emerald-100";
}

function MetricCard({
  metric,
  locale,
}: {
  metric: WhatsAppHealthMetric;
  locale: string | undefined;
}) {
  return (
    <article className={`${cardBase} p-4`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-bold text-slate-500">{metric.label}</p>
        <span
          className={`rounded-md border px-2 py-0.5 text-[10px] font-black ${sourceBadgeClass(metric.source)}`}
        >
          {metric.source}
        </span>
      </div>
      <p className="mt-2 break-words text-base font-black text-slate-900">
        {formatMetricValue(metric.value, locale)}
      </p>
    </article>
  );
}

function MessagingLimitsPanel({
  limits,
  locale,
  t,
}: {
  limits: WhatsAppMessagingLimits;
  locale: string | undefined;
  t: (key: string, options?: Record<string, unknown>) => string;
}) {
  const available = Boolean(limits.available && limits.currentKey);
  return (
    <section className={`${cardBase} p-4 sm:p-5`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-black text-slate-900">
            {t("whatsapp.health.messagingLimitsTitle")}
          </h3>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            {t("whatsapp.health.sourceLine", { source: limits.source })}
            {limits.updatedAt
              ? t("whatsapp.health.updatedAt", {
                  date: new Date(limits.updatedAt).toLocaleString(locale),
                })
              : ""}
          </p>
        </div>
        <span className="rounded-md border border-sky-100 bg-sky-50 px-2 py-0.5 text-[10px] font-black text-sky-700">
          Meta
        </span>
      </div>

      {!available ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm font-semibold text-amber-800">
          {t("whatsapp.health.limitsUnavailable")}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-stretch justify-center gap-2">
        {limits.steps.map((step) => {
          const isCurrent = available && step.key === limits.currentKey;
          return (
            <div
              key={step.key}
              className={[
                "relative min-w-[88px] flex-1 rounded-xl border px-3 py-4 text-center",
                isCurrent
                  ? "border-emerald-300 bg-white shadow-sm"
                  : "border-slate-200 bg-slate-50 text-slate-500",
              ].join(" ")}
            >
              {isCurrent ? (
                <span className="absolute -top-2 start-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-black text-white">
                  {t("whatsapp.health.currentStep")}
                </span>
              ) : null}
              <p
                className={[
                  "text-lg font-black",
                  isCurrent ? "text-slate-900" : "text-slate-500",
                ].join(" ")}
              >
                {step.label}
              </p>
              {isCurrent ? (
                <p className="mt-2 text-[11px] font-semibold leading-snug text-slate-600">
                  {limits.description}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function WhatsAppHealthTab() {
  const { t, i18n } = useTranslation();
  const { businessId } = useOutletContext<OutletCtx>();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [health, setHealth] = useState<WhatsAppAccountHealth | null>(null);

  const locale = i18n.language;

  const load = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    setError("");
    try {
      const data = await getWhatsAppAccountHealth(businessId);
      setHealth(data);
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ||
          (err as Error)?.message ||
          t("whatsapp.health.loadFailed")
      );
    } finally {
      setLoading(false);
    }
  }, [businessId, t]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSync = async () => {
    if (!businessId) return;
    setSyncing(true);
    setError("");
    try {
      const data = await syncWhatsAppAccountHealth(businessId);
      setHealth(data);
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ||
          (err as Error)?.message ||
          t("whatsapp.health.syncFailed")
      );
    } finally {
      setSyncing(false);
    }
  };

  const chart = health?.chart7d || [];
  const maxChart = useMemo(
    () =>
      Math.max(
        1,
        ...chart.map((d) => Math.max(d.sent, d.delivered, d.read, d.failed))
      ),
    [chart]
  );

  const comparisonRows = useMemo(() => {
    const current = health?.comparison?.current || {};
    const previous = health?.comparison?.previous || {};
    const keys = [
      "sent",
      "delivered",
      "read",
      "failed",
      "uniqueRecipients",
      "inbound",
      "outbound",
    ] as const;
    return keys
      .map((key) => {
        const cur = Number(current[key] ?? 0);
        const prev = Number(previous[key] ?? 0);
        const delta = cur - prev;
        return {
          key,
          label: t(`whatsapp.health.metrics.${key}`),
          cur,
          prev,
          delta,
        };
      })
      .filter((row) => row.cur > 0 || row.prev > 0);
  }, [health, t]);

  if (!businessId) {
    return (
      <div className={`${cardBase} p-6 text-sm font-semibold text-slate-600`}>
        {t("whatsapp.health.noBusinessId")}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className={`${cardBase} flex flex-wrap items-center justify-between gap-3 p-4`}>
        <div>
          <p className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wide text-emerald-700">
            <Activity className="h-3.5 w-3.5" />
            WhatsApp
          </p>
          <h2 className="mt-1 text-lg font-black text-slate-900">
            {t("whatsapp.health.title")}
          </h2>
          <p className="mt-0.5 text-sm font-semibold text-slate-500">
            {t("whatsapp.health.subtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" className={btnSecondary} onClick={load} disabled={loading}>
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            {t("whatsapp.health.refresh")}
          </button>
          <button
            type="button"
            className={btnPrimary}
            onClick={handleSync}
            disabled={syncing}
          >
            {syncing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            {t("whatsapp.health.syncFromMeta")}
          </button>
        </div>
      </header>

      {error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
          {error}
        </div>
      ) : null}

      {loading && !health ? (
        <div className={`${cardBase} flex items-center gap-2 p-6 text-sm font-semibold text-slate-600`}>
          <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
          {t("whatsapp.health.loading")}
        </div>
      ) : null}

      {health ? (
        <>
          {health.messagingLimits || health.connection?.connected ? (
            <MessagingLimitsPanel
              limits={
                health.messagingLimits || {
                  raw: "",
                  currentKey: "",
                  currentLabel: "",
                  description: t("whatsapp.health.defaultLimitDescription"),
                  numeric: null,
                  steps: [
                    { key: "250", label: "250" },
                    { key: "2000", label: "2,000" },
                    { key: "10000", label: "10,000" },
                    { key: "100000", label: "100,000" },
                    {
                      key: "unlimited",
                      label: t("whatsapp.health.unlimited"),
                    },
                  ],
                  source: "Meta",
                  available: false,
                }
              }
              locale={locale}
              t={t}
            />
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {(health.metrics || []).map((metric) => (
              <MetricCard key={metric.key} metric={metric} locale={locale} />
            ))}
          </div>

          {chart.length ? (
            <section className={`${cardBase} p-4`}>
              <h3 className="text-sm font-black text-slate-900">
                {t("whatsapp.health.chartTitle")}
              </h3>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                {t("whatsapp.health.chartSource")}
              </p>
              <div className="mt-4 flex h-40 items-end gap-2">
                {chart.map((day) => (
                  <div key={day.date} className="flex flex-1 flex-col items-center gap-1">
                    <div className="flex h-28 w-full items-end justify-center gap-0.5">
                      <div
                        className="w-1.5 rounded-t bg-sky-400"
                        style={{ height: `${(day.sent / maxChart) * 100}%` }}
                        title={t("whatsapp.health.chartTooltip.sent", {
                          count: day.sent,
                        })}
                      />
                      <div
                        className="w-1.5 rounded-t bg-emerald-500"
                        style={{ height: `${(day.delivered / maxChart) * 100}%` }}
                        title={t("whatsapp.health.chartTooltip.delivered", {
                          count: day.delivered,
                        })}
                      />
                      <div
                        className="w-1.5 rounded-t bg-violet-500"
                        style={{ height: `${(day.read / maxChart) * 100}%` }}
                        title={t("whatsapp.health.chartTooltip.read", {
                          count: day.read,
                        })}
                      />
                      <div
                        className="w-1.5 rounded-t bg-rose-400"
                        style={{ height: `${(day.failed / maxChart) * 100}%` }}
                        title={t("whatsapp.health.chartTooltip.failed", {
                          count: day.failed,
                        })}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">
                      {day.date.slice(5)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-[11px] font-bold text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-sky-400" />{" "}
                  {t("whatsapp.health.metrics.sent")}
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />{" "}
                  {t("whatsapp.health.metrics.delivered")}
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-violet-500" />{" "}
                  {t("whatsapp.health.metrics.read")}
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />{" "}
                  {t("whatsapp.health.metrics.failed")}
                </span>
              </div>
            </section>
          ) : null}

          {comparisonRows.length ? (
            <section className={`${cardBase} p-4`}>
              <h3 className="text-sm font-black text-slate-900">
                {t("whatsapp.health.comparisonTitle")}
              </h3>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                {t("whatsapp.health.comparisonSource")}
              </p>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-right text-xs font-black text-slate-500">
                      <th className="px-2 py-2">{t("whatsapp.health.tableMetric")}</th>
                      <th className="px-2 py-2">{t("whatsapp.health.tableCurrent")}</th>
                      <th className="px-2 py-2">{t("whatsapp.health.tablePrevious")}</th>
                      <th className="px-2 py-2">{t("whatsapp.health.tableDelta")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row) => (
                      <tr key={row.key} className="border-b border-slate-50">
                        <td className="px-2 py-2 font-bold text-slate-700">
                          {row.label}
                        </td>
                        <td className="px-2 py-2 font-semibold text-slate-800">
                          {row.cur}
                        </td>
                        <td className="px-2 py-2 font-semibold text-slate-600">
                          {row.prev}
                        </td>
                        <td
                          className={[
                            "px-2 py-2 font-black",
                            row.delta > 0
                              ? "text-emerald-700"
                              : row.delta < 0
                                ? "text-rose-700"
                                : "text-slate-500",
                          ].join(" ")}
                        >
                          {row.delta > 0 ? `+${row.delta}` : row.delta}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
