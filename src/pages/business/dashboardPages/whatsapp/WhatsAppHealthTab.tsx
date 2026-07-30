import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
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

function formatMetricValue(value: unknown): string {
  if (value == null) return "—";
  if (typeof value === "string" || typeof value === "number") {
    if (
      typeof value === "string" &&
      /^\d{4}-\d{2}-\d{2}T/.test(value)
    ) {
      try {
        return new Date(value).toLocaleString("he-IL");
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

function MetricCard({ metric }: { metric: WhatsAppHealthMetric }) {
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
        {formatMetricValue(metric.value)}
      </p>
    </article>
  );
}

function MessagingLimitsPanel({
  limits,
}: {
  limits: WhatsAppMessagingLimits;
}) {
  const available = Boolean(limits.available && limits.currentKey);
  return (
    <section className={`${cardBase} p-4 sm:p-5`} dir="rtl">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-black text-slate-900">
            הגבלות על התכתבות
          </h3>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            מקור: {limits.source}
            {limits.updatedAt
              ? ` · עודכן ${new Date(limits.updatedAt).toLocaleString("he-IL")}`
              : ""}
          </p>
        </div>
        <span className="rounded-md border border-sky-100 bg-sky-50 px-2 py-0.5 text-[10px] font-black text-sky-700">
          Meta
        </span>
      </div>

      {!available ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm font-semibold text-amber-800">
          עדיין לא התקבלה מגבלת התכתבות מ-Meta. לחצו על &quot;סנכרון ממטא&quot;.
          אם המגבלה מופיעה במנהל WhatsApp (למשל 10,000) והסנכרון לא מושך אותה,
          ייתכן שההרשאה או גרסת ה-API של Meta לא מחזירות את השדה לחשבון זה.
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
                  נוכחית
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
  const { businessId } = useOutletContext<OutletCtx>();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [health, setHealth] = useState<WhatsAppAccountHealth | null>(null);

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
          "טעינת נתוני הבריאות נכשלה"
      );
    } finally {
      setLoading(false);
    }
  }, [businessId]);

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
          "סנכרון ממטא נכשל"
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
    const keys: Array<{ key: string; label: string }> = [
      { key: "sent", label: "נשלחו" },
      { key: "delivered", label: "נמסרו" },
      { key: "read", label: "נקראו" },
      { key: "failed", label: "נכשלו" },
      { key: "uniqueRecipients", label: "נמענים ייחודיים" },
      { key: "inbound", label: "נכנסות" },
      { key: "outbound", label: "יוצאות" },
    ];
    return keys
      .map((row) => {
        const cur = Number(current[row.key] ?? 0);
        const prev = Number(previous[row.key] ?? 0);
        const delta = cur - prev;
        return { ...row, cur, prev, delta };
      })
      .filter((row) => row.cur > 0 || row.prev > 0);
  }, [health]);

  if (!businessId) {
    return (
      <div className={`${cardBase} p-6 text-sm font-semibold text-slate-600`} dir="rtl">
        לא נמצא מזהה עסק.
      </div>
    );
  }

  return (
    <div className="space-y-4" dir="rtl">
      <header className={`${cardBase} flex flex-wrap items-center justify-between gap-3 p-4`}>
        <div>
          <p className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wide text-emerald-700">
            <Activity className="h-3.5 w-3.5" />
            WhatsApp
          </p>
          <h2 className="mt-1 text-lg font-black text-slate-900">
            נתוני שימוש ובריאות החשבון
          </h2>
          <p className="mt-0.5 text-sm font-semibold text-slate-500">
            נתונים אמיתיים מ-Meta, Webhook והיסטוריית ההודעות של BizUply
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" className={btnSecondary} onClick={load} disabled={loading}>
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            רענון
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
            סנכרון ממטא
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
          טוען נתונים…
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
                  description: "שיחה ביוזמת העסק בפרק זמן של 24 שעות",
                  numeric: null,
                  steps: [
                    { key: "250", label: "250" },
                    { key: "2000", label: "2,000" },
                    { key: "10000", label: "10,000" },
                    { key: "100000", label: "100,000" },
                    { key: "unlimited", label: "ללא הגבלה" },
                  ],
                  source: "Meta",
                  available: false,
                }
              }
            />
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {(health.metrics || []).map((metric) => (
              <MetricCard key={metric.key} metric={metric} />
            ))}
          </div>

          {chart.length ? (
            <section className={`${cardBase} p-4`}>
              <h3 className="text-sm font-black text-slate-900">
                גרף שימוש של 7 הימים האחרונים
              </h3>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                מקור: היסטוריית ההודעות של BizUply
              </p>
              <div className="mt-4 flex h-40 items-end gap-2">
                {chart.map((day) => (
                  <div key={day.date} className="flex flex-1 flex-col items-center gap-1">
                    <div className="flex h-28 w-full items-end justify-center gap-0.5">
                      <div
                        className="w-1.5 rounded-t bg-sky-400"
                        style={{ height: `${(day.sent / maxChart) * 100}%` }}
                        title={`נשלחו ${day.sent}`}
                      />
                      <div
                        className="w-1.5 rounded-t bg-emerald-500"
                        style={{ height: `${(day.delivered / maxChart) * 100}%` }}
                        title={`נמסרו ${day.delivered}`}
                      />
                      <div
                        className="w-1.5 rounded-t bg-violet-500"
                        style={{ height: `${(day.read / maxChart) * 100}%` }}
                        title={`נקראו ${day.read}`}
                      />
                      <div
                        className="w-1.5 rounded-t bg-rose-400"
                        style={{ height: `${(day.failed / maxChart) * 100}%` }}
                        title={`נכשלו ${day.failed}`}
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
                  <span className="h-2 w-2 rounded-full bg-sky-400" /> נשלחו
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> נמסרו
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-violet-500" /> נקראו
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-rose-400" /> נכשלו
                </span>
              </div>
            </section>
          ) : null}

          {comparisonRows.length ? (
            <section className={`${cardBase} p-4`}>
              <h3 className="text-sm font-black text-slate-900">
                השוואה ל-7 הימים הקודמים
              </h3>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                מקור: היסטוריית ההודעות של BizUply
              </p>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-right text-xs font-black text-slate-500">
                      <th className="px-2 py-2">מדד</th>
                      <th className="px-2 py-2">7 ימים אחרונים</th>
                      <th className="px-2 py-2">7 ימים קודמים</th>
                      <th className="px-2 py-2">הפרש</th>
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
