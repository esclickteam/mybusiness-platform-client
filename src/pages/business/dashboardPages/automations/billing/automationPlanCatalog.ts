import {
  AUTOMATION_PLAN_KEYS,
  type AutomationPlanKey,
} from "../../../../../api/automationBillingApi";

export type AutomationPlanDefinition = {
  key: AutomationPlanKey;
  name: string;
  priceIls: number;
  executionLimit: number;
  popular?: boolean;
};

/** Customer-facing catalog — mirrors server canonical keys only. */
export const AUTOMATION_PLAN_DEFINITIONS: AutomationPlanDefinition[] = [
  {
    key: AUTOMATION_PLAN_KEYS.BASIC,
    name: "Automation Basic",
    priceIls: 39,
    executionLimit: 2500,
  },
  {
    key: AUTOMATION_PLAN_KEYS.GROWTH,
    name: "Automation Growth",
    priceIls: 79,
    executionLimit: 10000,
    popular: true,
  },
  {
    key: AUTOMATION_PLAN_KEYS.PRO,
    name: "Automation Pro",
    priceIls: 149,
    executionLimit: 30000,
  },
];

const PLAN_RANK: Record<string, number> = {
  [AUTOMATION_PLAN_KEYS.BASIC]: 1,
  [AUTOMATION_PLAN_KEYS.GROWTH]: 2,
  [AUTOMATION_PLAN_KEYS.PRO]: 3,
};

export function getAutomationPlanDefinition(planKey: string | null | undefined) {
  const key = String(planKey || "").trim();
  return AUTOMATION_PLAN_DEFINITIONS.find((plan) => plan.key === key) || null;
}

type TranslateFn = (key: string, options?: { defaultValue?: string }) => string;

export function getAutomationPlanDisplayName(
  planKey: string | null | undefined,
  t?: TranslateFn
) {
  const def = getAutomationPlanDefinition(planKey);
  const fallback = def?.name || planKey || "חבילת אוטומציות";
  if (!t) return fallback;
  if (def?.key) {
    return t(`automations.billing.planNames.${def.key}`, { defaultValue: fallback });
  }
  return t("automations.billing.fallbackPlanName", { defaultValue: fallback });
}

export function planRank(planKey: string | null | undefined) {
  return PLAN_RANK[String(planKey || "").trim()] || 0;
}

export function isUpgradePlan(fromKey: string | null | undefined, toKey: string) {
  return planRank(toKey) > planRank(fromKey);
}

export function isDowngradePlan(
  fromKey: string | null | undefined,
  toKey: string
) {
  return planRank(toKey) > 0 && planRank(fromKey) > planRank(toKey);
}
