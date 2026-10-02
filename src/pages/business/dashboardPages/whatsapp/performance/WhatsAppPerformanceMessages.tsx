import React from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { WhatsAppPerformanceView } from "../../../../../api/whatsappAnalyticsApi";
import { cardBase } from "../../../../../styles/bizuplyUi";
import { getIntlLocale } from "../../../../../i18n/localeUtils";
import { DayDetail, PerformanceChart, StatLine, formatCount, formatRate, reasonText } from "./performanceUi";
import type { PerformanceContext } from "./WhatsAppPerformanceLayout";

export function MessagesBody({
  view,
  selectedDay,
  onSelectDay,
}: {
  view: WhatsAppPerformanceView;
  selectedDay: string | null;
  onSelectDay: (day: string | null) => void;
}) {
  const { t, i18n } = useTranslation();
  const locale = getIntlLocale(i18n.language);
  const unavailable = t("whatsapp.performance.unavailable");
  const point = view.series.find((row) => row.date === selectedDay) || null;
  const messaging = view.meta.messaging;

  return (
    <div className="space-y-4">
      {!messaging.available ? (
        <p className={`${cardBase} p-4 text-sm font-semibold text-slate-600`}>
          {reasonText(t, messaging.reason || "NOT_SYNCED")}
        </p>
      ) : null}
      <section className={`${cardBase} p-4`}>
        <h3 className="text-sm font-black text-slate-900">{t("whatsapp.performance.chartTitle")}</h3>
        <p className="mb-3 text-xs font-semibold text-slate-500">{t("whatsapp.performance.chartHint")}</p>
        <PerformanceChart series={view.series} selectedDay={selectedDay} onSelectDay={onSelectDay} />
      </section>
      {point ? <DayDetail point={point} onClose={() => onSelectDay(null)} /> : null}
      <div className="space-y-2 md:hidden">
        {view.series.map((row) => {
          const delivery =
            row.metaSent && row.metaDelivered != null
              ? Math.round((row.metaDelivered / row.metaSent) * 1000) / 10
              : null;
          const selected = row.date === selectedDay;
          return (
            <button
              key={row.date}
              type="button"
              className={[
                cardBase,
                "w-full p-3 text-start",
                selected ? "ring-2 ring-emerald-400" : "",
              ].join(" ")}
              onClick={() => onSelectDay(row.date)}
            >
              <p className="text-sm font-black text-slate-900">
                {new Date(`${row.date}T00:00:00.000Z`).toLocaleDateString(locale, {
                  timeZone: "UTC",
                })}
              </p>
              <dl className="mt-2 grid grid-cols-2 gap-2">
                <StatLine
                  label={`${t("whatsapp.performance.columns.sent")} · ${t("whatsapp.performance.sourceMeta")}`}
                  value={formatCount(row.metaSent, locale, unavailable)}
                />
                <StatLine
                  label={`${t("whatsapp.performance.columns.delivered")} · ${t("whatsapp.performance.sourceMeta")}`}
                  value={formatCount(row.metaDelivered, locale, unavailable)}
                />
                <StatLine
                  label={`${t("whatsapp.performance.columns.deliveryRate")} · ${t("whatsapp.performance.sourceMeta")}`}
                  value={formatRate(delivery, unavailable)}
                />
                <StatLine
                  label={`${t("whatsapp.performance.columns.read")} · ${t("whatsapp.performance.sourceWebhook")}`}
                  value={formatCount(row.localRead, locale, unavailable)}
                />
                <StatLine
                  label={`${t("whatsapp.performance.columns.failed")} · ${t("whatsapp.performance.sourceWebhook")}`}
                  value={formatCount(row.localFailed, locale, unavailable)}
                />
              </dl>
            </button>
          );
        })}
      </div>
      <div className={`${cardBase} hidden overflow-x-auto md:block`}>
        <table className="min-w-[720px] w-full text-start text-sm">
          <thead className="bg-slate-50 text-[11px] font-black tracking-wide text-slate-400">
            <tr>
              {[
                "date",
                "sent",
                "delivered",
                "deliveryRate",
                "read",
                "failed",
              ].map((key) => (
                <th key={key} className="px-3 py-2">
                  {t(`whatsapp.performance.columns.${key === "deliveryRate" ? "deliveryRate" : key}`)}
                  {key === "sent" || key === "delivered" || key === "deliveryRate"
                    ? ` · ${t("whatsapp.performance.sourceMeta")}`
                    : key === "date"
                      ? ""
                      : ` · ${t("whatsapp.performance.sourceWebhook")}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {view.series.map((row) => {
              const delivery =
                row.metaSent && row.metaDelivered != null
                  ? Math.round((row.metaDelivered / row.metaSent) * 1000) / 10
                  : null;
              const selected = row.date === selectedDay;
              return (
                <tr
                  key={row.date}
                  className={[
                    "cursor-pointer border-t border-slate-100",
                    selected ? "bg-emerald-50/70" : "hover:bg-slate-50",
                  ].join(" ")}
                  onClick={() => onSelectDay(row.date)}
                >
                  <td className="px-3 py-2 font-bold text-slate-800">
                    {new Date(`${row.date}T00:00:00.000Z`).toLocaleDateString(locale, {
                      timeZone: "UTC",
                    })}
                  </td>
                  <td className="px-3 py-2">{formatCount(row.metaSent, locale, unavailable)}</td>
                  <td className="px-3 py-2">{formatCount(row.metaDelivered, locale, unavailable)}</td>
                  <td className="px-3 py-2">{formatRate(delivery, unavailable)}</td>
                  <td className="px-3 py-2">{formatCount(row.localRead, locale, unavailable)}</td>
                  <td className="px-3 py-2">{formatCount(row.localFailed, locale, unavailable)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {messaging.coverage ? (
        <p className="text-xs font-semibold text-slate-500">
          {t("whatsapp.performance.coverage")}: {messaging.coverage.covered}/
          {messaging.coverage.requested}
        </p>
      ) : null}
    </div>
  );
}

export default function WhatsAppPerformanceMessages() {
  const { view, selectedDay, setSelectedDay } = useOutletContext<PerformanceContext>();
  if (!view) return null;
  return (
    <MessagesBody view={view} selectedDay={selectedDay} onSelectDay={setSelectedDay} />
  );
}
