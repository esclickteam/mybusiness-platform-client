import { describe, expect, it } from "vitest";
import {
  ACTION_OPTIONS,
  FLOW_ACTION_PALETTE,
  findActionOption,
  isCustomerFacingAction,
  listCustomerActionOptions,
  listInspectorActionOptions,
} from "./automationFlowTypes";
import { LOCAL_SYSTEM_TEMPLATES } from "./localTemplateGraphs";
import { WORKING_TEMPLATES } from "./workingTemplates";

function paletteActionKeys() {
  return FLOW_ACTION_PALETTE.filter((item) => item.type === "action").map(
    (item) => item.key
  );
}

function graphActionKeys(
  template: (typeof WORKING_TEMPLATES)[number],
  emailProvider?: "gmail" | "outlook"
) {
  if (!template.buildGraph) return [];
  const graph = template.buildGraph({
    triggerKey: "new_lead",
    waTemplateId: "wa1",
    emailProvider,
  });
  return graph.nodes
    .filter((node) => node.type === "action")
    .map((node) => String((node.data as { actionKey?: string })?.actionKey || ""));
}

describe("automation action catalog", () => {
  it("shows only unique supported publishable actions in the picker", () => {
    const actionKeys = paletteActionKeys();
    expect(actionKeys).toEqual([...new Set(actionKeys)]);
    expect(actionKeys).not.toContain("send_email");
    expect(actionKeys).not.toContain("create_appointment");
    expect(actionKeys).not.toContain("update_status");
    expect(actionKeys).not.toContain("send_whatsapp");
    expect(actionKeys).not.toContain("internal_notification");

    for (const key of actionKeys) {
      const option = findActionOption(key);
      expect(option, key).toBeTruthy();
      expect(isCustomerFacingAction(option!)).toBe(true);
    }

    for (const item of FLOW_ACTION_PALETTE) {
      expect(item.supported).not.toBe(false);
      expect(item.comingSoon).not.toBe(true);
      expect(item.label).not.toMatch(/בקרוב/);
      expect(item.description).not.toMatch(/בקרוב/);
    }
  });

  it("hides Bizuply-hosted email and unfinished appointment from customer choices", () => {
    const visible = listCustomerActionOptions();
    expect(visible.some((row) => row.value === "send_email")).toBe(false);
    expect(visible.some((row) => row.label.includes("Bizuply"))).toBe(false);
    expect(visible.some((row) => row.value === "create_appointment")).toBe(false);
    expect(visible.some((row) => row.label.includes("בקרוב"))).toBe(false);

    const sendEmail = findActionOption("send_email")!;
    expect(sendEmail.supported).toBe(true);
    expect(sendEmail.customerVisible).toBe(false);

    const appointment = findActionOption("create_appointment")!;
    expect(appointment.supported).toBe(false);
    expect(appointment.customerVisible).toBe(false);
    expect(appointment.comingSoon).not.toBe(true);
  });

  it("keeps one canonical choice for aliased CRM / WhatsApp / notify actions", () => {
    const visible = listCustomerActionOptions().map((row) => row.value);
    expect(visible).toContain("update_lead_status");
    expect(visible).toContain("whatsapp_template");
    expect(visible).toContain("notify");
    expect(visible).not.toContain("update_status");
    expect(visible).not.toContain("send_whatsapp");
    expect(visible).not.toContain("internal_notification");

    const labels = listCustomerActionOptions().map((row) => row.label);
    expect(labels).toEqual([...new Set(labels)]);
  });

  it("does not offer duplicate or coming-soon actions in the inspector", () => {
    const options = listInspectorActionOptions();
    expect(options.every((row) => isCustomerFacingAction(row))).toBe(true);
    expect(options.some((row) => row.value === "send_gmail")).toBe(true);
    expect(options.some((row) => row.value === "send_outlook")).toBe(true);
    expect(options.some((row) => row.label.includes("בקרוב"))).toBe(false);

    const legacy = listInspectorActionOptions("send_email");
    expect(legacy[0].value).toBe("send_email");
    expect(legacy.filter((row) => row.value === "send_email")).toHaveLength(1);
  });

  it("keeps alias rows only for label lookup of existing graphs", () => {
    expect(findActionOption("update_status")?.aliasOf).toBe("update_lead_status");
    expect(findActionOption("notify")?.aliasOf).toBeUndefined();
    expect(ACTION_OPTIONS.filter((row) => row.aliasOf).map((row) => row.value)).toEqual(
      ["update_status", "send_whatsapp", "internal_notification"]
    );
  });
});

describe("automation templates after action cleanup", () => {
  it("does not reference Bizuply email or hidden appointment actions", () => {
    const forbidden = new Set(["send_email", "create_appointment"]);
    for (const template of WORKING_TEMPLATES) {
      const keys = graphActionKeys(template);
      expect(keys.some((key) => forbidden.has(key)), template.key).toBe(false);
      expect(template.name).not.toMatch(/אימייל \(Bizuply\)|אימייל Bizuply/);
      expect(template.description).not.toMatch(/אימייל \(Bizuply\)|מ-Bizuply/);
      expect(template.resultLabels.join(" ")).not.toMatch(/Bizuply/);
    }
    for (const template of LOCAL_SYSTEM_TEMPLATES) {
      const keys = template.actions.map((action) => action.actionKey);
      expect(keys.some((key) => forbidden.has(key)), template.key).toBe(false);
    }
  });

  it("keeps email templates provider-agnostic", () => {
    const emailTemplates = WORKING_TEMPLATES.filter(
      (template) => template.requiresEmailProvider
    );
    expect(emailTemplates.length).toBeGreaterThan(0);
    expect(
      emailTemplates.every((template) => template.requiresEmailProvider === true)
    ).toBe(true);
    for (const template of emailTemplates) {
      expect(graphActionKeys(template, "gmail")).toContain("send_gmail");
      expect(graphActionKeys(template, "outlook")).toContain("send_outlook");
      expect(graphActionKeys(template, "gmail")).not.toContain("send_email");
    }
  });
});
