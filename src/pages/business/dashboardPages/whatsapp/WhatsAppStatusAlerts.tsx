import React from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import type { WhatsAppVisibleAlert } from "./whatsappStatusUx";

const LEVEL_CLASS: Record<WhatsAppVisibleAlert["level"], string> = {
  blocking:
    "border-rose-200 bg-rose-50 text-rose-950",
  warning:
    "border-amber-200 bg-amber-50 text-amber-950",
  info: "border-sky-200 bg-sky-50 text-sky-950",
};

export default function WhatsAppStatusAlerts({
  alerts,
  actions,
}: {
  alerts: WhatsAppVisibleAlert[];
  actions?: (alert: WhatsAppVisibleAlert) => React.ReactNode;
}) {
  const { t } = useTranslation();
  if (!alerts.length) return null;

  return (
    <div className="space-y-2">
      {alerts.map((alert) => {
        const Icon =
          alert.level === "blocking"
            ? AlertCircle
            : alert.level === "warning"
              ? AlertTriangle
              : Info;
        return (
          <div
            key={`${alert.key}-${alert.i18nKey}`}
            className={`flex flex-col gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold sm:flex-row sm:items-start sm:justify-between ${LEVEL_CLASS[alert.level]}`}
          >
            <div className="flex items-start gap-3">
              <Icon className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-wide opacity-70">
                  {t(`whatsapp.alertLevel.${alert.level}`)}
                </p>
                <p className="mt-0.5">{t(alert.i18nKey)}</p>
              </div>
            </div>
            {actions?.(alert)}
          </div>
        );
      })}
    </div>
  );
}
