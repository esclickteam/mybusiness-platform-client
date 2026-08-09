import { describe, expect, it } from "vitest";
import type { AutomationRecipeSummary } from "../../../../api/automationWorkflowApi";
import {
  getRecipeResultLabel,
  getRecipeTriggerLabel,
} from "./templateCategoryMapping";

function recipe(partial: Partial<AutomationRecipeSummary>): AutomationRecipeSummary {
  return {
    key: "lead_multi_route",
    name: "test",
    description: "desc",
    triggerCount: 1,
    pathCount: 3,
    nodeCount: 5,
    ...partial,
  };
}

describe("templateCategoryMapping trigger/result labels", () => {
  it("exposes clear trigger and result for system recipes", () => {
    const row = recipe({ key: "lead_multi_route" });
    expect(getRecipeTriggerLabel(row)).toContain("ליד");
    expect(getRecipeResultLabel(row)).toMatch(/WhatsApp|משימה|התראה/);
  });

  it("exposes AI recipe trigger→result", () => {
    const row = recipe({ key: "ai_rank_leads", isAiRecipe: true, tier: "ai_paid" });
    expect(getRecipeTriggerLabel(row)).toContain("ליד");
    expect(getRecipeResultLabel(row).toLowerCase()).toContain("ai");
  });
});
