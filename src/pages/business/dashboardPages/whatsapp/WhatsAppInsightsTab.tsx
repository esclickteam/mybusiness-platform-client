import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import {
  getWhatsAppAccountHealth,
  type WhatsAppAccountHealth,
} from "../../../../api/whatsappApi";
import { getIntlLocale, getTextDirection } from "../../../../i18n/localeUtils";
import { cardBase } from "../../../../styles/bizuplyUi";
import { useWhatsAppVisualQaOverride } from "../../../dev/whatsappVisualQaContext";
import { useWhatsAppHubContext } from "../../../dev/useWhatsAppHubContext";

function rate(part: number, whole: number): string | null {
  if (!whole) return null;
  return `${Math.round((part / whole) * 1000) / 10}%`;
}

export default function WhatsAppInsightsTab() {
  const { t, i18n } = useTranslation();
  const { businessId } = useWhatsAppHubContext();
  const visualQa = useWhatsAppVisualQaOverride();
  const [health, setHealth] = useState<WhatsAppAccountHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const locale = getIntlLocale(i18n.language);

  useEffect(() => {
    if (visualQa) {
      setHealth({
        connection: visualQa.connection,
        metrics: [],
        chart7d: [
          { date: "2026-09-17", sent: 4, delivered: 4, read: 2, failed: 0 },
          { date: "2026-09-18", sent: 7, delivered: 6, read: 4, failed: 1 },
          { date: "2026-09-19", sent: 5, delivered: 5, read: 3, failed: 0 },
          { date: "2026-09-20", sent: 9, delivered: 8, read: 5, failed: 0 },
          { date: "2026-09-21", sent: 6, delivered: 6, read: 4, failed: 0 },
          { date: "2026-09-22", sent: 8, delivered: 7, read: 5, failed: 1 },
          { date: "2026-09-23", sent: 9, delivered: 9, read: 8, failed: 0 },
        ],
        comparison: {
          current: {
            sent: 48,
            delivered: 45,
            read: 31,
            failed: 2,
            deliveryRate: "93.8%",
            readRate: "64.6%",
            failRate: "4.2%",
          },
          previous: {},
        },
      });
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
      try {
        const data = await getWhatsAppAccountHealth(businessId);
        if (!cancelled) setHealth(data);
      } catch {
        if (!cancelled) setHealth(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [businessId, visualQa]);

  const current = health?.comparison?.current || {};
  const sent = Number(current.sent ?? 0);
  const delivered = Number(current.delivered ?? 0);
  const read = Number(current.read ?? 0);
  const failed = Number(current.failed ?? 0);
  const deliveryRate =
    (current.deliveryRate as string | number | undefined) ??
    rate(delivered, sent);
  const readRate =
    (current.readRate as string | number | undefined) ?? rate(read, sent);
  const failRate =
    (current.failRate as string | number | undefined) ?? rate(failed, sent);

  const chart = health?.chart7d || [];
  const maxBar = useMemo(
    () => Math.max(1, ...chart.map((d) => d.sent || 0)),
    [chart]
  );

  if (loading) {
    return (
      <div className={`${cardBase} flex items-center gap-2 p-6 text-sm font-semibold text-slate-500`}>
        <Loader2 className="h-4 w-4 animate-spin" />
        {t("whatsapp.hub.loading")}
      </div>
    );
  }

  return (
    <div dir={getTextDirection(i18n.language)} className="space-y-3">
      <div>
        <h2 className="text-base font-black text-slate-900">
          {t("whatsapp.hub.insightsTitle")}
        </h2>
        <p className="text-xs font-semibold text-slate-500">
          {t("whatsapp.hub.insightsSubtitle")}
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: t("whatsapp.hub.sent"), value: sent },
          { label: t("whatsapp.hub.delivered"), value: delivered },
          { label: t("whatsapp.hub.read"), value: read },
          { label: t("whatsapp.hub.failed"), value: failed },
        ].map((item) => (
          <article key={item.label} className={`${cardBase} px-3 py-2.5`}>
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
              {item.label}
            </p>
            <p className="mt-1 text-xl font-black text-slate-900">
              {item.value.toLocaleString(locale)}
            </p>
            <p className="text-[10px] font-semibold text-slate-400">
              {t("whatsapp.hub.last7days")}
            </p>
          </article>
        ))}
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {[
          { label: t("whatsapp.hub.deliveryRate"), value: deliveryRate },
          { label: t("whatsapp.hub.readRate"), value: readRate },
          { label: t("whatsapp.hub.failureRate"), value: failRate },
        ].map((item) => (
          <article key={item.label} className={`${cardBase} px-3 py-2.5`}>
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
              {item.label}
            </p>
            <p className="mt-1 text-lg font-black text-slate-900">
              {item.value != null ? String(item.value) : "—"}
            </p>
          </article>
        ))}
      </div>

      <article className={`${cardBase} p-3 sm:p-4`}>
        <h3 className="text-sm font-black text-slate-900">
          {t("whatsapp.hub.dailyBreakdown")}
        </h3>
        {!chart.length ? (
          <p className="mt-3 text-xs font-semibold text-slate-400">
            {t("whatsapp.hub.noInsightsData")}
          </p>
        ) : (
          <div className="mt-3 flex h-36 items-end gap-1.5">
            {chart.map((day) => (
              <div
                key={day.date}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <div
                  className="w-full rounded-t bg-emerald-400/80"
                  style={{
                    height: `${Math.max(4, (day.sent / maxBar) * 100)}%`,
                  }}
                  title={`${day.sent} sent`}
                />
                <span className="text-[9px] font-bold text-slate-400">
                  {day.date.slice(5)}
                </span>
              </div>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
