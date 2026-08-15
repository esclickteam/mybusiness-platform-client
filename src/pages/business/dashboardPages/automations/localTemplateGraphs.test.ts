import { describe, expect, it } from "vitest";
import {
  LOCAL_SYSTEM_TEMPLATES,
  buildLocalAutomationGraph,
  isActiveSystemRecipeKey,
  listLocalAiTemplates,
  resolveTriggerKeyFromCatalog,
} from "./localTemplateGraphs";

describe("local system templates", () => {
  it("covers CRM, appointments, email, calendar and AI", () => {
    const cats = new Set(
      LOCAL_SYSTEM_TEMPLATES.flatMap((t) => t.categories)
    );
    expect(cats.has("crm")).toBe(true);
    expect(cats.has("appointments")).toBe(true);
    expect(cats.has("whatsapp")).toBe(true);
    expect(cats.has("email")).toBe(true);
    expect(cats.has("ai")).toBe(true);
  });

  it("builds trigger → parallel results graphs", () => {
    const multi = LOCAL_SYSTEM_TEMPLATES.find(
      (t) => t.key === "local_lead_multi_results"
    )!;
    const { nodes, edges } = buildLocalAutomationGraph(multi);
    expect(nodes[0].type).toBe("trigger");
    expect(nodes[0].data.routeCount).toBe(3);
    expect(nodes.filter((n) => n.type === "action")).toHaveLength(3);
    expect(edges).toHaveLength(3);
  });

  it("includes active AI templates with AI action keys", () => {
    const ai = listLocalAiTemplates();
    expect(ai.length).toBeGreaterThanOrEqual(6);
    for (const row of ai) {
      expect(row.actions.some((a) => a.actionKey.startsWith("ai_"))).toBe(true);
      expect(isActiveSystemRecipeKey(row.recipeKey || "")).toBe(true);
    }
  });

  it("resolves trigger keys from live catalog aliases", () => {
    const tpl = LOCAL_SYSTEM_TEMPLATES.find(
      (t) => t.key === "local_ai_rank_leads"
    )!;
    const resolved = resolveTriggerKeyFromCatalog(tpl, [
      {
        key: "lead_created",
        label: "ליד חדש",
        category: "crm",
        isPublishable: true,
      },
    ]);
    expect(resolved).toBe("lead_created");
  });

  it("marks known system recipes as active", () => {
    expect(isActiveSystemRecipeKey("lead_multi_route")).toBe(true);
    expect(isActiveSystemRecipeKey("ai_email_draft")).toBe(true);
    expect(isActiveSystemRecipeKey("ai_auto_reply")).toBe(false);
    expect(isActiveSystemRecipeKey("unknown_thing")).toBe(false);
  });

  it("resolves local email templates to Gmail or Outlook", () => {
    const emailLocals = LOCAL_SYSTEM_TEMPLATES.filter((template) =>
      template.actions.some((action) => action.actionKey === "connected_email")
    );
    expect(emailLocals.length).toBe(2);
    for (const template of emailLocals) {
      const gmail = buildLocalAutomationGraph(template, { emailProvider: "gmail" });
      const outlook = buildLocalAutomationGraph(template, {
        emailProvider: "outlook",
      });
      const business = buildLocalAutomationGraph(template, {
        emailProvider: "business",
        businessSender: {
          senderId: "sender-1",
          email: "support@invistimo.com",
          displayName: "Invistimo",
        },
      });
      const gmailKeys = gmail.nodes
        .filter((node) => node.type === "action")
        .map((node) => String(node.data.actionKey || ""));
      const outlookKeys = outlook.nodes
        .filter((node) => node.type === "action")
        .map((node) => String(node.data.actionKey || ""));
      expect(gmailKeys).toContain("send_gmail");
      expect(outlookKeys).toContain("send_outlook");
      expect(gmailKeys).not.toContain("send_email");
      expect(outlookKeys).not.toContain("send_email");
      const businessKeys = business.nodes
        .filter((node) => node.type === "action")
        .map((node) => String(node.data.actionKey || ""));
      expect(businessKeys).toContain("send_email");
      expect(businessKeys).not.toContain("connected_email");
    }
  });
});
