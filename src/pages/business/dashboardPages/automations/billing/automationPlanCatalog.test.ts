import { describe, expect, it } from "vitest";
import { AUTOMATION_PLAN_KEYS } from "../../../../../api/automationBillingApi";
import {
  isDowngradePlan,
  isUpgradePlan,
  planRank,
} from "./automationPlanCatalog";

describe("automationPlanCatalog upgrade/downgrade helpers", () => {
  it("isUpgradePlan: Basic to Growth", () => {
    expect(
      isUpgradePlan(AUTOMATION_PLAN_KEYS.BASIC, AUTOMATION_PLAN_KEYS.GROWTH)
    ).toBe(true);
  });

  it("isUpgradePlan: Growth to Pro", () => {
    expect(
      isUpgradePlan(AUTOMATION_PLAN_KEYS.GROWTH, AUTOMATION_PLAN_KEYS.PRO)
    ).toBe(true);
  });

  it("isDowngradePlan: Pro to Basic", () => {
    expect(
      isDowngradePlan(AUTOMATION_PLAN_KEYS.PRO, AUTOMATION_PLAN_KEYS.BASIC)
    ).toBe(true);
  });

  it("isDowngradePlan: same plan is false", () => {
    expect(
      isDowngradePlan(AUTOMATION_PLAN_KEYS.BASIC, AUTOMATION_PLAN_KEYS.BASIC)
    ).toBe(false);
  });

  it("planRank orders Basic less than Growth less than Pro", () => {
    expect(planRank(AUTOMATION_PLAN_KEYS.BASIC)).toBeLessThan(
      planRank(AUTOMATION_PLAN_KEYS.GROWTH)
    );
    expect(planRank(AUTOMATION_PLAN_KEYS.GROWTH)).toBeLessThan(
      planRank(AUTOMATION_PLAN_KEYS.PRO)
    );
  });
});
