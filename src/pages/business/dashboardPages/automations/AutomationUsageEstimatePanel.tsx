import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../../../i18n/localeUtils";
import { AlertTriangle } from "lucide-react";
import { formatHeNumber } from "./billing/automationBillingFormat";
import {
  estimateMonthlyActions,
  normalizeScheduleConfig,
  recommendPlanForActions,
  type AutomationScheduleConfig,
} from "./automationSchedule";
import type { EstimateGraphEdge, EstimateGraphNode } from "./automationActionCost";

type Props = {
  nodes: EstimateGraphNode[];
  edges: EstimateGraphEdge[];
  schedule: Partial<AutomationScheduleConfig> | null | undefined;
  planLimit?: number | null;
  planName?: string | null;
  onOpenPlans?: () => void;
};

export default function AutomationUsageEstimatePanel({
  nodes,
  edges,
  schedule,
  planLimit,
  planName,
  onOpenPlans,
}: Props) {
  const { t, i18n } = useTranslation();
  const normalized = useMemo(
    () => normalizeScheduleConfig(schedule || {}),
    [schedule]
  );

  const estimate = useMemo(
    () =>
      estimateMonthlyActions({
        nodes,
        edges,
        schedule: normalized,
      }),
    [nodes, edges, normalized]
  );

  const recommendation = useMemo(
    () => recommendPlanForActions(estimate.actionsPerMonth),
    [estimate.actionsPerMonth]
  );

  const limit = Number(planLimit);
  const hasLimit = Number.isFinite(limit) && limit > 0;
  const overPlan =
    hasLimit && estimate.actionsPerMonth > limit;
  const recommendHigher =
    overPlan ||
    (recommendation.plan &&
      hasLimit &&
      recommendation.plan.executionLimit > limit);

  if (!normalized) return null;

  return (
    <aside className="af-usage-estimate" dir={getTextDirection(i18n.language)} role="status">
      <strong className="af-usage-estimate__title">
        {t("automations.estimate.title", "Monthly usage estimate")}
      </strong>
      <p className="af-usage-estimate__line">
        {t("automations.estimate.line", {
          actions: formatHeNumber(estimate.actionsPerRun),
          runs: formatHeNumber(estimate.runsPerMonth),
          defaultValue:
            "Up to {{actions}} actions per run · ≈ {{runs}} runs per month",
        })}
      </p>
      <p className="af-usage-estimate__total">
        {t("automations.estimate.total", {
          count: formatHeNumber(estimate.actionsPerMonth),
          defaultValue: "Estimate: {{count}} actions per month",
        })}
        {hasLimit
          ? planName
            ? t("automations.estimate.ofLimitNamed", {
                limit: formatHeNumber(limit),
                plan: planName,
                defaultValue: " of {{limit}} ({{plan}})",
              })
            : t("automations.estimate.ofLimit", {
                limit: formatHeNumber(limit),
                defaultValue: " of {{limit}}",
              })
          : null}
      </p>

      {overPlan || recommendHigher ? (
        <div className="af-usage-estimate__warn" role="alert">
          <AlertTriangle size={14} aria-hidden />
          <div>
            <strong>
              {overPlan
                ? t(
                    "automations.estimate.overPlan",
                    "The estimate exceeds the current plan quota"
                  )
                : t(
                    "automations.estimate.considerHigher",
                    "Consider a higher plan"
                  )}
            </strong>
            {recommendation.plan ? (
              <p>
                {t("automations.estimate.recommended", {
                  plan: recommendation.plan.name,
                  count: formatHeNumber(recommendation.plan.executionLimit),
                  defaultValue:
                    "Recommended: {{plan}} · {{count}} actions per month",
                })}
              </p>
            ) : recommendation.exceedsAll ? (
              <p>
                {t(
                  "automations.estimate.exceedsAll",
                  "The estimate is higher than every available plan — consider lowering the frequency."
                )}
              </p>
            ) : null}
            {onOpenPlans ? (
              <button
                type="button"
                className="af-btn af-btn--primary"
                onClick={onOpenPlans}
              >
                {t("automations.estimate.viewPlans", "View plans")}
              </button>
            ) : null}
            <p className="af-usage-estimate__note">
              {t(
                "automations.estimate.estimateOnlyNoUpgrade",
                "This is an estimate only — there is no automatic upgrade."
              )}
            </p>
          </div>
        </div>
      ) : (
        <p className="af-usage-estimate__note">
          {t(
            "automations.estimate.estimateNote",
            "Estimate only, based on the most expensive path and the selected frequency."
          )}
        </p>
      )}
    </aside>
  );
}
