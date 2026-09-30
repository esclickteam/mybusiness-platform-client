import React from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";
import { cardBase } from "../../../../styles/bizuplyUi";
import type { WhatsAppCalmStatusRow } from "./whatsappStatusUx";

export default function WhatsAppAccountStatusCard({
  rows,
}: {
  rows: WhatsAppCalmStatusRow[];
}) {
  const { t } = useTranslation();
  if (!rows.length) return null;

  return (
    <article
      className={`${cardBase} border-slate-200/80 bg-white px-4 py-3 shadow-none`}
    >
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
        {t("whatsapp.accountStatus.title")}
      </p>
      <ul className="mt-2 space-y-2">
        {rows.map((row) => (
          <li key={row.titleKey} className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {t(row.titleKey)}
              </p>
              <p className="mt-0.5 text-xs font-medium leading-relaxed text-slate-500">
                {t(row.hintKey)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}
