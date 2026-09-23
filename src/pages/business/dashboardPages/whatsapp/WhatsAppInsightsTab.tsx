import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import {
  getWhatsAppAccountHealth,
  type WhatsAppAccountHealth,
} from "../../../../api/whatsappApi";
import { getIntlLocale, getTextDirection } from "../../../../i18n/localeUtils";
import { cardBase } from "../../../../styles/bizuplyUi";
import type { WhatsAppHubOutletContext } from "./WhatsAppMain";

function rate(part: number, whole: number): string | null {
  if (!whole) return null;
  return `${Math.round((part / whole) * 1000) / 10}%`;
}

export default function WhatsAppInsightsTab() {
  const { t, i18n } = useTranslation();
  const { businessId } = useOutletContext<WhatsAppHubOutletContext>();
  const [health, setHealth] = useState<WhatsAppAccountHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const locale = getIntlLocale(i18n.language);

  useEffect(() => {
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
  }, [businessId]);

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
      <div className={`${cardBase} flex items-center gap-2 p-8 text-sm font-semibold text-slate-500`}>
        <Loader2 className="h-4 w-4 animate-spin" />
        {t("whatsapp.hub.loading")}
      </div>
    );
  }

  return (
    <div dir={getTextDirection(i18n.language)} className="space-y-4">
      <div>
        <h2 className="text-lg font-black text-slate-900">
          {t("whatsapp.hub.insightsTitle")}
        </h2>
        <p className="mt-0.5 text-sm font-semibold text-slate-500">
          {t("whatsapp.hub.insightsSubtitle")}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: t("whatsapp.hub.sent"), value: sent },
          { label: t("whatsapp.hub.delivered"), value: delivered },
          { label: t("whatsapp.hub.read"), value: read },
          { label: t("whatsapp.hub.failed"), value: failed },
        ].map((item) => (
          <article key={item.label} className={`${cardBase} p-4`}>
            <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
              {item.label}
            </p>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {item.value.toLocaleString(locale)}
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-400">
              {t("whatsapp.hub.last7days")}
            </p>
          </article>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: t("whatsapp.hub.deliveryRate"), value: deliveryRate },
          { label: t("whatsapp.hub.readRate"), value: readRate },
          { label: t("whatsapp.hub.failureRate"), value: failRate },
        ].map((item) => (
          <article key={item.label} className={`${cardBase} p-4`}>
            <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
              {item.label}
            </p>
            <p className="mt-2 text-xl font-black text-slate-900">
              {item.value != null ? String(item.value) : "—"}
            </p>
          </article>
        ))}
      </div>

      <article className={`${cardBase} p-4`}>
        <h3 className="text-sm font-black text-slate-900">
          {t("whatsapp.hub.dailyBreakdown")}
        </h3>
        {!chart.length ? (
          <p className="mt-4 text-sm font-semibold text-slate-400">
            {t("whatsapp.hub.noInsightsData")}
          </p>
        ) : (
          <div className="mt-4 flex h-40 items-end gap-2">
            {chart.map((day) => (
              <div key={day.date} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-emerald-400/80"
                  style={{
                    height: `${Math.max(4, (day.sent / maxBar) * 100)}%`,
                  }}
                  title={`${day.sent} sent`}
                />
                <span className="text-[10px] font-bold text-slate-400">
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
