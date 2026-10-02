import React from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { WhatsAppPerformanceView } from "../../../../../api/whatsappAnalyticsApi";
import { cardBase } from "../../../../../styles/bizuplyUi";
import { getIntlLocale } from "../../../../../i18n/localeUtils";
import {
  DayDetail,
  MetricCard,
  PerformanceChart,
  formatCount,
  formatDelta,
  formatRate,
  reasonText,
} from "./performanceUi";
import type { PerformanceContext } from "./WhatsAppPerformanceLayout";

export function OverviewBody({
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
  const messaging = view.meta.messaging;
  const local = view.local;
  const point = view.series.find((row) => row.date === selectedDay) || null;
  const sentDelta = formatDelta(messaging.comparison.deltas?.sent);
  const deliveredDelta = formatDelta(messaging.comparison.deltas?.delivered);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-black text-slate-900">{t("whatsapp.performance.metaSection")}</h3>
        <p className="text-xs font-semibold text-slate-500">{t("whatsapp.performance.timezoneNote")}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <MetricCard
          label={t("whatsapp.performance.cards.sent")}
          value={formatCount(messaging.available ? messaging.sent : null, locale, unavailable)}
          hint={messaging.available ? undefined : reasonText(t, messaging.reason)}
          source={t("whatsapp.performance.sourceMeta")}
          delta={sentDelta}
          deltaLabel={sentDelta ? t("whatsapp.performance.vsPrevious") : undefined}
        />
        <MetricCard
          label={t("whatsapp.performance.cards.delivered")}
          value={formatCount(
            messaging.available ? messaging.delivered : null,
            locale,
            unavailable
          )}
          hint={
            !messaging.available
              ? reasonText(t, messaging.reason)
              : messaging.reason === "EMPTY_META"
                ? reasonText(t, "EMPTY_META")
                : undefined
          }
          source={t("whatsapp.performance.sourceMeta")}
          delta={deliveredDelta}
          deltaLabel={deliveredDelta ? t("whatsapp.performance.vsPrevious") : undefined}
        />
        <MetricCard
          label={t("whatsapp.performance.cards.deliveryRate")}
          value={formatRate(messaging.available ? messaging.deliveryRate : null, unavailable)}
          hint={
            messaging.deliveryRate == null
              ? reasonText(t, messaging.deliveryRateReason || messaging.reason || "UNAVAILABLE")
              : t("whatsapp.performance.rateOfSent")
          }
          source={t("whatsapp.performance.sourceMeta")}
        />
        <MetricCard
          label={t("whatsapp.performance.cards.read")}
          value={unavailable}
          hint={reasonText(t, messaging.readReason || "NOT_IN_MESSAGING_ANALYTICS")}
          source={t("whatsapp.performance.sourceMeta")}
        />
      </div>
      {!messaging.comparison.available ? (
        <p className="text-xs font-semibold text-slate-500">
          {t("whatsapp.performance.noComparison")}
          {messaging.comparison.reason
            ? ` — ${reasonText(t, messaging.comparison.reason)}`
            : ""}
        </p>
      ) : null}
      {messaging.partial ? (
        <p className="text-xs font-semibold text-amber-700">{t("whatsapp.performance.partialNote")}</p>
      ) : null}

      <section className={`${cardBase} p-4`}>
        <h3 className="text-sm font-black text-slate-900">{t("whatsapp.performance.chartTitle")}</h3>
        <p className="mb-3 text-xs font-semibold text-slate-500">{t("whatsapp.performance.chartHint")}</p>
        <PerformanceChart
          series={view.series}
          selectedDay={selectedDay}
          onSelectDay={onSelectDay}
        />
      </section>
      {point ? <DayDetail point={point} onClose={() => onSelectDay(null)} /> : null}

      <div>
        <h3 className="text-sm font-black text-slate-900">{t("whatsapp.performance.localSection")}</h3>
        <p className="text-xs font-semibold text-slate-500">{t("whatsapp.performance.localHint")}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <MetricCard
          label={t("whatsapp.performance.cards.read")}
          value={formatCount(local.available ? local.read : null, locale, unavailable)}
          hint={local.available ? t("whatsapp.performance.rateOfDelivered") : reasonText(t, local.reason)}
          source={t("whatsapp.performance.sourceWebhook")}
          delta={formatDelta(local.comparison.deltas?.read)}
          deltaLabel={
            formatDelta(local.comparison.deltas?.read)
              ? t("whatsapp.performance.vsPrevious")
              : undefined
          }
        />
        <MetricCard
          label={t("whatsapp.performance.cards.readRate")}
          value={formatRate(local.available ? local.readRate : null, unavailable)}
          hint={t("whatsapp.performance.rateOfDelivered")}
          source={t("whatsapp.performance.sourceWebhook")}
        />
        <MetricCard
          label={t("whatsapp.performance.cards.failed")}
          value={formatCount(local.available ? local.failed : null, locale, unavailable)}
          hint={reasonText(t, local.reason) || undefined}
          source={t("whatsapp.performance.sourceWebhook")}
          delta={formatDelta(local.comparison.deltas?.failed)}
          deltaLabel={
            formatDelta(local.comparison.deltas?.failed)
              ? t("whatsapp.performance.vsPrevious")
              : undefined
          }
        />
        <MetricCard
          label={t("whatsapp.performance.cards.sent")}
          value={formatCount(local.available ? local.sent : null, locale, unavailable)}
          hint={t("whatsapp.performance.localHint")}
          source={t("whatsapp.performance.sourceWebhook")}
        />
      </div>
      {local.apiRejected ? (
        <p className="text-xs font-semibold text-slate-500">
          {t("whatsapp.performance.apiRejected")}: {local.apiRejected.toLocaleString(locale)}
        </p>
      ) : null}
      {local.truncated ? (
        <p className="text-xs font-semibold text-amber-700">{t("whatsapp.performance.truncated")}</p>
      ) : null}
    </div>
  );
}

export default function WhatsAppPerformanceOverview() {
  const { view, selectedDay, setSelectedDay } = useOutletContext<PerformanceContext>();
  if (!view) return null;
  return (
    <OverviewBody view={view} selectedDay={selectedDay} onSelectDay={setSelectedDay} />
  );
}
