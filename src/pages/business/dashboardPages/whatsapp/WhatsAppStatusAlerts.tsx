import React from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle } from "lucide-react";
import type { WhatsAppVisibleAlert } from "./whatsappStatusUx";

export default function WhatsAppStatusAlerts({
  alerts,
  actions,
}: {
  alerts: WhatsAppVisibleAlert[];
  actions?: (alert: WhatsAppVisibleAlert) => React.ReactNode;
}) {
  const { t } = useTranslation();
  const blocking = alerts.filter((row) => row.level === "blocking");
  if (!blocking.length) return null;

  return (
    <div className="space-y-2">
      {blocking.map((alert) => (
        <div
          key={`${alert.key}-${alert.i18nKey}`}
          className="flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-950 sm:flex-row sm:items-start sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p>{t(alert.i18nKey)}</p>
            </div>
          </div>
          {actions?.(alert)}
        </div>
      ))}
    </div>
  );
}
