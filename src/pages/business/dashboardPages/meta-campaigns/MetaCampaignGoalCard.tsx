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
  evaluationWindow?: string;
  paused?: boolean;
};

export default function MetaCampaignGoalCard({
  goalName,
  target,
  current,
  differencePct,
  status,
  started,
  evaluationWindow,
  paused,
}: Props) {
  const { t } = useTranslation();
  return (
    <article className={`${cardBase} p-4`} data-testid="campaign-goal-card">
      <p className="text-xs font-black uppercase tracking-wide text-violet-700">
        {t("metaCampaigns.ux.yourGoal")}
      </p>
      <h3 className="mt-1 text-base font-black text-slate-900">{goalName}</h3>
      {evaluationWindow ? (
        <p className="mt-2 text-xs font-black uppercase tracking-wide text-slate-500" data-testid="goal-window">
          {t("metaCampaigns.goals.evaluationWindow", { window: evaluationWindow })}
        </p>
      ) : null}
      {paused ? (
        <p className="mt-2 text-xs font-semibold text-amber-800">{t("metaCampaigns.ux.pausedHistorical")}</p>
      ) : null}
      <p className="mt-2 text-sm font-bold text-slate-700">
        {t("metaCampaigns.ux.keepLeadsUnder", { target })}
      </p>
      <p className="text-sm font-semibold text-slate-600">
        {t("metaCampaigns.ux.currentValue", { value: current == null ? "—" : current })}
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
      <p className="mt-2 text-xs font-bold text-violet-700">{t("metaCampaigns.ux.viewDetails")}</p>
    </article>
  );
}
