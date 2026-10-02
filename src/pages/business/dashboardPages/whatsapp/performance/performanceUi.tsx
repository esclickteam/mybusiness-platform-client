import React from "react";
import { useTranslation } from "react-i18next";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getIntlLocale } from "../../../../../i18n/localeUtils";
import type { AnalyticsSeriesPoint } from "../../../../../api/whatsappAnalyticsApi";
import { cardBase } from "../../../../../styles/bizuplyUi";

export function reasonText(
  t: (key: string, options?: { defaultValue?: string }) => string,
  code?: string | null
) {
  if (!code) return "";
  return t(`whatsapp.performance.reasons.${code}`, { defaultValue: code });
}

export function formatCount(
  value: number | null | undefined,
  locale: string,
  unavailable: string
) {
  if (value == null || Number.isNaN(value)) return unavailable;
  return value.toLocaleString(locale);
}

export function formatRate(value: number | null | undefined, unavailable: string) {
  if (value == null || Number.isNaN(value)) return unavailable;
  return `${value}%`;
}

export function formatDelta(delta?: { value: number | null; reason: string | null }) {
  if (!delta || delta.value == null) return null;
  const sign = delta.value > 0 ? "+" : "";
  return `${sign}${delta.value}%`;
}

export function StatLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-bold text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-sm font-black text-slate-900">{value}</dd>
    </div>
  );
}

export function MetricCard({
  label,
  value,
  hint,
  source,
  delta,
  deltaLabel,
}: {
  label: string;
  value: string;
  hint?: string;
  source: string;
  delta?: string | null;
  deltaLabel?: string;
}) {
  const positive = delta ? !delta.startsWith("-") : false;
  return (
    <article className={`${cardBase} p-4`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-bold text-slate-500">{label}</p>
        <span className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
          {source}
        </span>
      </div>
      <p className="mt-2 text-2xl font-black tracking-tight text-slate-900">{value}</p>
      {hint ? <p className="mt-1 text-xs font-semibold text-slate-500">{hint}</p> : null}
      {delta ? (
        <p
          className={[
            "mt-2 text-xs font-bold",
            positive ? "text-emerald-700" : "text-rose-600",
          ].join(" ")}
        >
          {delta}
          {deltaLabel ? <span className="ms-1 font-semibold text-slate-400">{deltaLabel}</span> : null}
        </p>
      ) : null}
    </article>
  );
}

export function PerformanceChart({
  series,
  selectedDay,
  onSelectDay,
}: {
  series: AnalyticsSeriesPoint[];
  selectedDay: string | null;
  onSelectDay: (day: string) => void;
}) {
  const { t, i18n } = useTranslation();
  const locale = getIntlLocale(i18n.language);
  const data = series.map((point) => ({
    ...point,
    label: new Date(`${point.date}T00:00:00.000Z`).toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }),
  }));

  return (
    <div dir="ltr" className="h-72 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          onClick={(state) => {
            const date = (state as { activePayload?: Array<{ payload?: { date?: string } }> })
              ?.activePayload?.[0]?.payload?.date;
            if (date) onSelectDay(date);
          }}
        >
          <CartesianGrid stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} width={36} />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const row = payload[0].payload as AnalyticsSeriesPoint & { label: string };
              return (
                <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg" dir="auto">
                  <p className="font-black text-slate-900">{row.label}</p>
                  <p className="mt-1 font-semibold text-emerald-700">
                    {t("whatsapp.performance.cards.sent")} · {t("whatsapp.performance.sourceMeta")}:{" "}
                    {row.metaSent ?? "—"}
                  </p>
                  <p className="font-semibold text-sky-700">
                    {t("whatsapp.performance.cards.delivered")} · {t("whatsapp.performance.sourceMeta")}:{" "}
                    {row.metaDelivered ?? "—"}
                  </p>
                  <p className="font-semibold text-rose-600">
                    {t("whatsapp.performance.cards.failed")} · {t("whatsapp.performance.sourceWebhook")}:{" "}
                    {row.localFailed ?? "—"}
                  </p>
                </div>
              );
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area
            type="monotone"
            dataKey="metaSent"
            name={`${t("whatsapp.performance.cards.sent")} · Meta`}
            stroke="#059669"
            fill="#d1fae5"
            strokeWidth={2}
            connectNulls={false}
            activeDot={{
              r: 5,
              onClick: (_event, dot) => {
                const date = (dot as { payload?: { date?: string } })?.payload?.date;
                if (date) onSelectDay(date);
              },
            }}
          />
          <Area
            type="monotone"
            dataKey="metaDelivered"
            name={`${t("whatsapp.performance.cards.delivered")} · Meta`}
            stroke="#0284c7"
            fill="#e0f2fe"
            strokeWidth={2}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="localFailed"
            name={`${t("whatsapp.performance.cards.failed")} · Webhook`}
            stroke="#e11d48"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
      {selectedDay ? <span className="sr-only">{selectedDay}</span> : null}
    </div>
  );
}

export function DayDetail({
  point,
  onClose,
}: {
  point: AnalyticsSeriesPoint;
  onClose: () => void;
}) {
  const { t, i18n } = useTranslation();
  const locale = getIntlLocale(i18n.language);
  const label = new Date(`${point.date}T00:00:00.000Z`).toLocaleDateString(locale, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
  const unavailable = t("whatsapp.performance.unavailable");
  const cells = [
    {
      source: t("whatsapp.performance.dayMeta"),
      rows: [
        [t("whatsapp.performance.cards.sent"), formatCount(point.metaSent, locale, unavailable)],
        [t("whatsapp.performance.cards.delivered"), formatCount(point.metaDelivered, locale, unavailable)],
        [t("whatsapp.performance.cards.read"), unavailable],
      ],
    },
    {
      source: t("whatsapp.performance.dayLocal"),
      rows: [
        [t("whatsapp.performance.cards.sent"), formatCount(point.localSent, locale, unavailable)],
        [t("whatsapp.performance.cards.delivered"), formatCount(point.localDelivered, locale, unavailable)],
        [t("whatsapp.performance.cards.read"), formatCount(point.localRead, locale, unavailable)],
        [t("whatsapp.performance.cards.failed"), formatCount(point.localFailed, locale, unavailable)],
      ],
    },
  ];

  return (
    <section className={`${cardBase} p-4`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-black text-slate-900">{t("whatsapp.performance.dayDetail")}</h3>
          <p className="text-xs font-semibold text-slate-500">{label} · UTC</p>
        </div>
        <button
          type="button"
          className="text-xs font-bold text-slate-500 underline"
          onClick={onClose}
        >
          {t("whatsapp.performance.close")}
        </button>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {cells.map((group) => (
          <div key={group.source} className="rounded-md border border-slate-100 bg-slate-50/70 p-3">
            <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">{group.source}</p>
            <dl className="mt-2 space-y-1.5">
              {group.rows.map(([name, value]) => (
                <div key={name} className="flex items-center justify-between gap-3 text-sm">
                  <dt className="font-semibold text-slate-500">{name}</dt>
                  <dd className="font-black text-slate-900">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}
