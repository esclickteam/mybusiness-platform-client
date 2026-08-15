import { describe, expect, it } from "vitest";
import type { AutomationRecipeSummary } from "../../../../api/automationWorkflowApi";
import {
  TEMPLATE_CATEGORIES,
  getRecipeCategories,
  getRecipeDisplayDescription,
  getRecipeDisplayName,
  getRecipeResultLabel,
  getRecipeTriggerLabel,
  recipeMatchesCategory,
} from "./templateCategoryMapping";

function recipe(partial: Partial<AutomationRecipeSummary>): AutomationRecipeSummary {
  return {
    key: "lead_multi_route",
    name: "ליד חדש — ריבוי מסלולים",
    description: "טריגר אחד מתפצל ל־3 מסלולים",
    triggerCount: 1,
    pathCount: 3,
    nodeCount: 5,
    ...partial,
  };
}

describe("templateCategoryMapping trigger/result labels", () => {
  it("exposes CRM instead of a separate leads browse category", () => {
    expect(TEMPLATE_CATEGORIES.map((item) => item.id)).toEqual([
      "all",
      "crm",
      "appointments",
      "email",
      "whatsapp",
      "sales",
      "store",
      "ai",
    ]);
    expect(TEMPLATE_CATEGORIES.some((item) => item.id === "crm")).toBe(true);
  });

  it("maps former lead recipes into CRM", () => {
    expect(getRecipeCategories(recipe({ key: "lead_multi_route" }))).toEqual(
      expect.arrayContaining(["crm", "whatsapp"])
    );
    expect(getRecipeCategories(recipe({ key: "lead_no_response" }))).toEqual(
      expect.arrayContaining(["crm", "whatsapp"])
    );
    expect(
      getRecipeCategories(recipe({ key: "lead_multi_route" })).join(" ")
    ).not.toMatch(/\bleads\b/);
  });

  it("exposes clear trigger and result for system recipes", () => {
    const row = recipe({ key: "lead_multi_route" });
    expect(getRecipeTriggerLabel(row)).toContain("ליד");
    expect(getRecipeResultLabel(row)).toMatch(/WhatsApp|משימה|התראה/);
  });

  it("overrides path-language names and descriptions", () => {
    const row = recipe({ key: "lead_multi_route" });
    expect(getRecipeDisplayName(row)).not.toMatch(/מסלול/);
    expect(getRecipeDisplayDescription(row)).not.toMatch(/מסלול/);
    expect(getRecipeDisplayDescription(row)).toMatch(/טריגר/);
    expect(getRecipeDisplayDescription(row)).toMatch(/תוצא/);
  });

  it("exposes AI recipe trigger→result", () => {
    const row = recipe({ key: "ai_rank_leads", isAiRecipe: true, tier: "ai_paid" });
    expect(getRecipeTriggerLabel(row)).toContain("ליד");
    // Customer-facing result copy is Hebrew from the catalog (not Latin "ai").
    expect(getRecipeResultLabel(row)).toMatch(/מדרג|דירוג|התראה/);
    // Canonical filter category key remains "ai".
    expect(getRecipeCategories(row)).toContain("ai");
    expect(recipeMatchesCategory(row, "ai")).toBe(true);
    expect(recipeMatchesCategory(row, "all")).toBe(true);
    expect(recipeMatchesCategory(row, "crm")).toBe(true);
    expect(recipeMatchesCategory(row, "appointments")).toBe(false);
  });
});
