import React from "react";
import { useTranslation } from "react-i18next";
import { cardBase } from "../../../../styles/bizuplyUi";

type Props = {
  goalName: string;
  target: number;
  current?: number | null;
  differencePct?: number | null;
  status: string;
  started?: number | null;
};

export default function MetaCampaignGoalCard({
  goalName,
  target,
  current,
  differencePct,
  status,
  started,
}: Props) {
  const { t } = useTranslation();
  return (
    <article className={`${cardBase} p-4`} data-testid="campaign-goal-card">
      <p className="text-xs font-black uppercase tracking-wide text-violet-700">
        {t("metaCampaigns.goals.title")}
      </p>
      <h3 className="mt-1 text-base font-black text-slate-900">{goalName}</h3>
      <p className="mt-2 text-sm font-bold text-slate-700">
        {t("metaCampaigns.goals.targetCpl")}: ≤ {target} ILS
      </p>
      <p className="text-sm font-semibold text-slate-600">
        {t("metaCampaigns.goals.current")}: {current == null ? "—" : `${current} ILS`}
      </p>
      <p className="text-sm font-semibold text-slate-600">
        {t("metaCampaigns.goals.difference")}:{" "}
        {differencePct == null ? "—" : `${differencePct > 0 ? "+" : ""}${differencePct}%`}
      </p>
      {started != null ? (
        <p className="text-xs font-semibold text-slate-500">
          {t("metaCampaigns.goals.started")}: {started} ILS
        </p>
      ) : null}
      <p className="mt-2 text-sm font-black text-slate-900" data-testid="campaign-goal-status">
        {t(`metaCampaigns.goals.status.${status}`, { defaultValue: status })}
      </p>
    </article>
  );
}
