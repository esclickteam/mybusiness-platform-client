import { describe, expect, it } from "vitest";
import {
  AI_AUTOMATION_CATALOG,
  buildAiTemplateGraph,
  getAiTemplateByKey,
  isSupportedAiActionKey,
  listSupportedAiTemplates,
  searchAiTemplates,
  buildAiTemplateDiscoveryHref,
} from "./aiAutomationCatalog";

describe("AI automation catalog", () => {
  it("exposes only the ten end-to-end templates", () => {
    const templates = listSupportedAiTemplates();
    expect(templates).toHaveLength(10);
    expect(templates.every((template) => template.supported.endToEnd)).toBe(true);
    expect(isSupportedAiActionKey("ai_draft_email")).toBe(true);
    expect(isSupportedAiActionKey("ai_auto_reply")).toBe(false);
    expect(AI_AUTOMATION_CATALOG.length).toBeGreaterThan(10);
  });

  it("hides unsupported templates from the supported list", () => {
    const supportedKeys = new Set(listSupportedAiTemplates().map((t) => t.recipeKey));
    expect(supportedKeys.has("ai_summarize_calls")).toBe(false);
    expect(supportedKeys.has("ai_auto_reply")).toBe(false);
    expect(supportedKeys.has("ai_rank_leads")).toBe(true);
  });

  it("resolves templateKey and recipeKey deep links", () => {
    expect(getAiTemplateByKey("ai_lead_scoring")?.recipeKey).toBe("ai_rank_leads");
    expect(getAiTemplateByKey("ai_rank_leads")?.templateKey).toBe("ai_lead_scoring");
    expect(getAiTemplateByKey("ai_summarize_calls")?.supported.endToEnd).toBe(false);
  });

  it("uses scheduled and lead_status_changed triggers correctly", () => {
    expect(getAiTemplateByKey("ai_daily_leads_digest")?.recommendedTrigger).toBe("scheduled");
    expect(getAiTemplateByKey("ai_followup_draft")?.recommendedTrigger).toBe("lead_status_changed");
    expect(getAiTemplateByKey("ai_email_draft")?.recommendedTrigger).toBe("lead_status_changed");
  });

  it("searches by AI, lead, and summary keywords", () => {
    expect(searchAiTemplates("AI").length).toBeGreaterThan(0);
    expect(searchAiTemplates("\u05dc\u05d9\u05d3").length).toBeGreaterThan(0);
    expect(searchAiTemplates("\u05e1\u05d9\u05db\u05d5\u05dd").length).toBeGreaterThan(0);
    expect(searchAiTemplates("\u05d3\u05d9\u05e8\u05d5\u05d2").some((t) => t.recipeKey === "ai_rank_leads")).toBe(true);
    expect(searchAiTemplates("zzz-nope")).toHaveLength(0);
  });

  it("builds customer-safe trigger graphs with handles and labels", () => {
    const digest = listSupportedAiTemplates().find((template) => template.recipeKey === "ai_daily_leads_digest")!;
    const graph = buildAiTemplateGraph(digest);
    expect(graph.nodes[0].id).toBe("trigger_1");
    expect(graph.nodes[0].data.triggerKey).toBe("scheduled");
    expect(graph.nodes[0].data.label).toBeTruthy();
    expect(graph.nodes[0].data.scheduleDefaults?.hour).toBe(8);
    expect(graph.edges[0].sourceHandle).toBe("route_1");
    expect(graph.nodes.some((n) => n.data.actionKey === "notify")).toBe(true);

    const scoring = getAiTemplateByKey("ai_lead_scoring")!;
    const scoringGraph = buildAiTemplateGraph(scoring);
    expect(scoringGraph.nodes[0].data.label).toBe("\u05dc\u05d9\u05d3 \u05d7\u05d3\u05e9");
    expect(String(scoringGraph.nodes[1].data.label || "")).toContain("\u05d3\u05d9\u05e8\u05d5\u05d2");
    expect(scoringGraph.edges.find((e) => e.id === "ai-notify")?.sourceHandle).toBe("out");
  });

  it("builds discovery href without activate params", () => {
    const template = listSupportedAiTemplates()[0];
    const href = buildAiTemplateDiscoveryHref("biz123", template);
    expect(href).toContain("/business/biz123/dashboard/automations/templates?");
    expect(href).toContain("focus=ai");
    expect(href).toContain("highlight=" + encodeURIComponent(template.templateKey));
    expect(href).not.toContain("configureAi");
    expect(href).not.toContain("recipe=");
  });
});
