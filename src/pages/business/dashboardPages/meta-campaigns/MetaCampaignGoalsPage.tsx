import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  activateCampaignGoal,
  draftCampaignGoal,
  evaluateCampaignGoal,
  getCampaignGoalHistory,
  listCampaignGoals,
  updateCampaignGoal,
  type CampaignGoal,
} from "../../../../api/metaCampaignsApi";
import { btnPrimary, btnSecondary, cardBase, inputBase } from "../../../../styles/bizuplyUi";
import MetaCampaignGoalCard from "./MetaCampaignGoalCard";

const OBJECTIVES = [
  { id: "MORE_LEADS", labelKey: "metaCampaigns.goals.moreLeads" },
  { id: "LOWER_CPL", labelKey: "metaCampaigns.goals.lowerCpl" },
  { id: "MORE_CONVERSIONS", labelKey: "metaCampaigns.goals.moreConversions" },
  { id: "IMPROVE_EFFICIENCY", labelKey: "metaCampaigns.goals.improveEfficiency" },
  { id: "SCALE_PERFORMANCE", labelKey: "metaCampaigns.goals.scale" },
];

export default function MetaCampaignGoalsPage() {
  const { t } = useTranslation();
  const { businessId } = useOutletContext<{ businessId: string }>();
  const [step, setStep] = useState(1);
  const [goals, setGoals] = useState<CampaignGoal[]>([]);
  const [draft, setDraft] = useState<CampaignGoal | null>(null);
  const [explanation, setExplanation] = useState("");
  const [history, setHistory] = useState<Array<Record<string, unknown>>>([]);
  const [form, setForm] = useState({
    objective: "LOWER_CPL",
    targetValue: "25",
    currentBudget: "20",
    maxDailyBudget: "40",
    maxIncreasePct: "10",
    maxDecreasePct: "15",
    automationPreference: "RECOMMEND",
    metaCampaignId: "120251636463900469",
    freeText: "Keep CPL under 25 ILS",
    scope: "CAMPAIGN",
  });

  async function reload() {
    if (!businessId) return;
    setGoals(await listCampaignGoals(businessId));
  }

  useEffect(() => {
    void reload();
  }, [businessId]);

  async function onDraft() {
    const result = await draftCampaignGoal(businessId, {
      ...form,
      targetValue: Number(form.targetValue),
      currentBudget: Number(form.currentBudget),
      maxDailyBudget: Number(form.maxDailyBudget),
      maxIncreasePct: Number(form.maxIncreasePct),
      maxDecreasePct: Number(form.maxDecreasePct),
    });
    setDraft(result.goal);
    setExplanation(result.explanation);
    setStep(5);
    await reload();
  }

  return (
    <div className="space-y-4" data-testid="campaign-goals-page">
      <section className={`${cardBase} p-4`}>
        <h2 className="text-lg font-black">{t("metaCampaigns.goals.title")}</h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">{t("metaCampaigns.goals.subtitle")}</p>
      </section>

      <section className={`${cardBase} space-y-3 p-4`}>
        <p className="text-sm font-black">{t("metaCampaigns.goals.setGoal")} · {step}/4</p>
        {step === 1 ? (
          <div className="grid gap-2">
            {OBJECTIVES.map((row) => (
              <button
                key={row.id}
                type="button"
                className={form.objective === row.id ? btnPrimary : btnSecondary}
                onClick={() => setForm((prev) => ({ ...prev, objective: row.id }))}
              >
                {t(row.labelKey)}
              </button>
            ))}
            <button type="button" className={btnPrimary} onClick={() => setStep(2)}>
              {t("metaCampaigns.goals.step2")}
            </button>
          </div>
        ) : null}
        {step === 2 ? (
          <label className="text-xs font-black uppercase text-slate-500">
            {t("metaCampaigns.goals.targetCpl")}
            <input
              className={`${inputBase} mt-1`}
              value={form.targetValue}
              onChange={(e) => setForm((prev) => ({ ...prev, targetValue: e.target.value }))}
            />
            <button type="button" className={`${btnPrimary} mt-3`} onClick={() => setStep(3)}>
              {t("metaCampaigns.goals.step3")}
            </button>
          </label>
        ) : null}
        {step === 3 ? (
          <div className="grid gap-2 md:grid-cols-2">
            {[
              ["currentBudget", "metaCampaigns.goals.currentBudget"],
              ["maxDailyBudget", "metaCampaigns.goals.maxBudget"],
              ["maxIncreasePct", "metaCampaigns.goals.maxIncrease"],
              ["maxDecreasePct", "metaCampaigns.goals.maxDecrease"],
            ].map(([key, label]) => (
              <label key={key} className="text-xs font-black uppercase text-slate-500">
                {t(label)}
                <input
                  className={`${inputBase} mt-1`}
                  value={(form as Record<string, string>)[key]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                />
              </label>
            ))}
            <button type="button" className={btnPrimary} onClick={() => setStep(4)}>
              {t("metaCampaigns.goals.step4")}
            </button>
          </div>
        ) : null}
        {step === 4 ? (
          <div className="space-y-2">
            <button
              type="button"
              className={form.automationPreference === "RECOMMEND" ? btnPrimary : btnSecondary}
              onClick={() => setForm((prev) => ({ ...prev, automationPreference: "RECOMMEND" }))}
            >
              {t("metaCampaigns.goals.recommendOnly")}
            </button>
            <button
              type="button"
              className={form.automationPreference === "AUTOMATIC" ? btnPrimary : btnSecondary}
              onClick={() => setForm((prev) => ({ ...prev, automationPreference: "AUTOMATIC" }))}
            >
              {t("metaCampaigns.goals.safeAuto")}
            </button>
            <button type="button" className={btnPrimary} onClick={() => void onDraft()}>
              {t("metaCampaigns.goals.draft")}
            </button>
          </div>
        ) : null}
        {step === 5 && draft ? (
          <div className="space-y-3" data-testid="goal-review">
            <p className="text-sm font-black">{t("metaCampaigns.goals.reviewTitle")}: CPL, CTR, Frequency, Spend</p>
            <p className="text-sm text-slate-600">{explanation}</p>
            <p className="text-xs font-semibold text-slate-500">{t("metaCampaigns.goals.editRules")}</p>
            {(draft.generatedRules || []).map((rule, index) => (
              <div key={String(rule.key || index)} className="rounded-lg border border-slate-200 p-3 text-sm">
                <p className="font-black">{String(rule.name)}</p>
                <p>{String(rule.action)} · {String(rule.mode)}</p>
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={async () => {
                    const next = (draft.generatedRules || []).filter((_, i) => i !== index);
                    const updated = await updateCampaignGoal(businessId, draft.id, { generatedRules: next });
                    setDraft(updated);
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className={btnPrimary}
              data-testid="goal-start-monitoring"
              onClick={async () => {
                await activateCampaignGoal(businessId, draft.id);
                await reload();
              }}
            >
              {t("metaCampaigns.goals.start")}
            </button>
          </div>
        ) : null}
      </section>

      {goals.length === 0 ? (
        <p className="text-sm font-semibold text-slate-500">{t("metaCampaigns.goals.noGoals")}</p>
      ) : (
        goals.map((goal) => (
          <div key={goal.id} className="space-y-2">
            <MetaCampaignGoalCard
              goalName={goal.name}
              target={goal.targetValue}
              current={goal.lastSnapshot?.cpl}
              differencePct={
                goal.lastSnapshot?.cpl != null
                  ? Number((((goal.lastSnapshot.cpl - goal.targetValue) / goal.targetValue) * 100).toFixed(1))
                  : null
              }
              status={goal.lastHealth || "INSUFFICIENT_DATA"}
              started={goal.startingSnapshot?.cpl}
            />
            <div className="flex gap-2">
              <button
                type="button"
                className={btnSecondary}
                onClick={async () => {
                  await evaluateCampaignGoal(businessId, goal.id);
                  await reload();
                }}
              >
                Evaluate
              </button>
              <button
                type="button"
                className={btnSecondary}
                onClick={async () => setHistory(await getCampaignGoalHistory(businessId, goal.id))}
              >
                History
              </button>
            </div>
          </div>
        ))
      )}
      {history.length ? (
        <pre className={`${cardBase} overflow-auto p-3 text-xs`}>{JSON.stringify(history, null, 2)}</pre>
      ) : null}
    </div>
  );
}
