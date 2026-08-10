import React, { useMemo } from "react";
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
    <aside className="af-usage-estimate" dir="rtl" role="status">
      <strong className="af-usage-estimate__title">הערכת שימוש חודשי</strong>
      <p className="af-usage-estimate__line">
        עד{" "}
        <strong>{formatHeNumber(estimate.actionsPerRun)}</strong> פעולות
        להרצה · ≈{" "}
        <strong>{formatHeNumber(estimate.runsPerMonth)}</strong> הרצות בחודש
      </p>
      <p className="af-usage-estimate__total">
        הערכה:{" "}
        <strong>{formatHeNumber(estimate.actionsPerMonth)}</strong> פעולות
        בחודש
        {hasLimit ? (
          <>
            {" "}
            מתוך {formatHeNumber(limit)}
            {planName ? ` (${planName})` : ""}
          </>
        ) : null}
      </p>

      {overPlan || recommendHigher ? (
        <div className="af-usage-estimate__warn" role="alert">
          <AlertTriangle size={14} aria-hidden />
          <div>
            <strong>
              {overPlan
                ? "ההערכה חורגת ממכסת החבילה הנוכחית"
                : "מומלץ לשקול חבילה גבוהה יותר"}
            </strong>
            {recommendation.plan ? (
              <p>
                מומלץ: {recommendation.plan.name} ·{" "}
                {formatHeNumber(recommendation.plan.executionLimit)} פעולות
                בחודש
              </p>
            ) : recommendation.exceedsAll ? (
              <p>ההערכה גבוהה מכל החבילות הזמינות — כדאי להקטין את התדירות.</p>
            ) : null}
            {onOpenPlans ? (
              <button
                type="button"
                className="af-btn af-btn--primary"
                onClick={onOpenPlans}
              >
                צפייה בחבילות
              </button>
            ) : null}
            <p className="af-usage-estimate__note">
              זו הערכה בלבד — אין שדרוג אוטומטי.
            </p>
          </div>
        </div>
      ) : (
        <p className="af-usage-estimate__note">
          הערכה בלבד לפי המסלול היקר ביותר והתדירות שנבחרה.
        </p>
      )}
    </aside>
  );
}
