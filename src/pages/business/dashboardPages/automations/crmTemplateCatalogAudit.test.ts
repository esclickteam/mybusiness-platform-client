import { describe, expect, it } from "vitest";
import { ACTION_OPTIONS, findActionOption } from "./automationFlowTypes";
import { LOCAL_SYSTEM_TEMPLATES } from "./localTemplateGraphs";
import { SYSTEM_AUTOMATION_CATALOG } from "./systemAutomationCatalog";
import {
  TEMPLATE_CATEGORIES,
  type TemplateCategoryId,
} from "./templateCategoryMapping";
import {
  BLUEPRINT_PREFERRED_META,
  WA_DEFAULT_META_MAPPINGS,
  isBusinessAlertMetaTemplateName,
  isLegacyManagedMetaTemplateName,
  isTestTemplateName,
} from "./whatsappAutomationMetaTemplates";
import {
  WORKING_TEMPLATES,
  buildWhatsAppSimpleGraph,
  isEmailFacingTemplate,
  isTemplateVisibleInCatalog,
  isWhatsAppFacingTemplate,
  triggerKeysForWhatsAppSimple,
  type WorkingTemplate,
} from "./workingTemplates";

const FORMER_LEAD_TEMPLATE_KEYS = [
  "wa_new_lead_welcome",
  "wa_new_lead_owner_alert",
  "wa_lead_no_response",
  "wa_lead_followup_2",
  "wf_lead_multi",
  "wf_lead_wa_email",
  "wf_lead_full_onboarding",
  "wf_lead_email_task",
  "wf_lead_email_only",
  "wf_lead_desk_alert",
  "wf_lead_no_response_pack",
  "wf_lead_status_sales",
  "ai_lead_scoring",
  "ai_lead_classify",
  "ai_lead_auto_tag",
  "ai_hot_lead",
  "ai_lead_brief",
  "ai_followup_draft",
  "ai_email_draft",
  "ai_next_action",
  "ai_daily_leads_digest",
] as const;

const PUBLISHABLE_TRIGGER_KEYS = new Set([
  "new_lead",
  "crm_lead_created",
  "lead_created",
  "lead_new",
  "lead_status_changed",
  "crm_lead_status_changed",
  "lead_updated",
  "client_created",
  "crm_client_created",
  "new_client",
  "customer_created",
  "client_inactive",
  "crm_client_inactive",
  "inactive_client",
  "lead_no_response",
  "crm_lead_no_response",
  "lead_followup",
  "appointment_created",
  "crm_appointment_created",
  "booking_created",
  "appointment_completed",
  "appointment_ended",
  "appointment_done",
  "appointment_reminder",
  "scheduled",
  "store_order_paid",
  "payment_succeeded",
  "whatsapp_message_received",
  "whatsapp_inbound",
  "wa_message_received",
]);

const GRAPH_PLACEHOLDER_ACTIONS = new Set(["connected_email"]);

const LEAD_VARS = new Set([
  "lead.id",
  "lead.name",
  "lead.phone",
  "lead.email",
  "lead.status",
  "lead.source",
  "lead.tags",
  "lead.optionalDetailsHtml",
  "lead.optionalDetailsText",
  "lead.assignedToName",
  "lead.assignedToUserId",
  "previousStatus",
  "newStatus",
]);

const CLIENT_VARS = new Set([
  "contact.id",
  "contact.fullName",
  "contact.phone",
  "contact.email",
  "client.id",
  "client.fullName",
  "client.phone",
  "client.email",
]);

const BUSINESS_VARS = new Set([
  "business.id",
  "business.name",
  "business.phone",
  "business.email",
]);

const APPOINTMENT_VARS = new Set([
  "appointment.id",
  "appointment.date",
  "appointment.time",
  "appointment.duration",
  "appointment.service",
  "appointment.serviceName",
  "appointment.clientName",
  "appointment.clientPhone",
  "appointment.clientEmail",
  "appointment.address",
  "appointment.location",
  "appointment.notes",
  "appointment.note",
  "appointment.optionalDetailsHtml",
  "appointment.optionalDetailsText",
  "appointment.googleEventId",
  "appointment.googleCalendarId",
]);

const TEST_COPY_RE = /\b(E2E|FullMatrix|SOP|dummy|hello_world)\b|test@/i;

const VALID_LEAD_STATUSES = new Set([
  "new",
  "contacted",
  "interested",
  "converted",
  "lost",
  "old",
]);

function crmTemplates(): WorkingTemplate[] {
  return WORKING_TEMPLATES.filter((template) =>
    template.categories.includes("crm")
  );
}

function graphFor(template: WorkingTemplate) {
  if (template.engine === "whatsapp_simple") {
    const triggerKey = triggerKeysForWhatsAppSimple(template)[0] || "new_lead";
    return buildWhatsAppSimpleGraph(template, {
      triggerKey,
      waTemplateId: "wa1",
    });
  }
  if (!template.buildGraph) return null;
  const triggerKey = template.requiredTriggerKeys?.[0] || "new_lead";
  return template.buildGraph({
    triggerKey,
    waTemplateId: "wa1",
    emailProvider: "gmail",
  });
}

function collectVariables(value: unknown): string[] {
  const raw = JSON.stringify(value || "");
  return [...raw.matchAll(/\{\{\s*([a-zA-Z][\w.]*)\s*\}\}/g)].map(
    (match) => match[1]
  );
}

function allowedVarsFor(template: WorkingTemplate): Set<string> {
  const allowed = new Set<string>([...BUSINESS_VARS]);
  const triggerHay = [
    template.triggerLabel,
    ...(template.requiredTriggerKeys || []),
    template.whatsappTrigger || "",
  ]
    .join(" ")
    .toLowerCase();
  if (
    triggerHay.includes("lead") ||
    template.categories.includes("crm")
  ) {
    for (const token of LEAD_VARS) allowed.add(token);
  }
  if (triggerHay.includes("client") || triggerHay.includes("contact")) {
    for (const token of CLIENT_VARS) allowed.add(token);
  }
  if (
    triggerHay.includes("appointment") ||
    template.categories.includes("appointments")
  ) {
    for (const token of APPOINTMENT_VARS) allowed.add(token);
  }
  return allowed;
}

function actionKeys(template: WorkingTemplate): string[] {
  const graph = graphFor(template);
  if (!graph) return [];
  return graph.nodes
    .filter((node) => node.type === "action")
    .map((node) => String(node.data?.actionKey || ""));
}

describe("CRM template catalog audit", () => {
  const templates = crmTemplates();

  it("removes leads as a browse category and keeps CRM", () => {
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

  it("moves every former lead template into CRM without losing keys", () => {
    const keys = new Set(WORKING_TEMPLATES.map((template) => template.key));
    for (const key of FORMER_LEAD_TEMPLATE_KEYS) {
      expect(keys.has(key), key).toBe(true);
      const template = WORKING_TEMPLATES.find((row) => row.key === key)!;
      expect(template.categories, key).toContain("crm");
      expect(template.categories, key).not.toContain(
        "leads" as TemplateCategoryId
      );
    }
    expect(templates.length).toBeGreaterThanOrEqual(
      FORMER_LEAD_TEMPLATE_KEYS.length
    );
  });

  it("never exposes a leads category on gallery / catalog sources", () => {
    for (const template of WORKING_TEMPLATES) {
      expect(template.categories, template.key).not.toContain(
        "leads" as TemplateCategoryId
      );
    }
    for (const row of SYSTEM_AUTOMATION_CATALOG) {
      expect(row.categories, row.id).not.toContain("leads");
    }
    for (const row of LOCAL_SYSTEM_TEMPLATES) {
      expect(row.categories, row.key).not.toContain("leads");
    }
  });

  it("audits every CRM template one-by-one", () => {
    expect(templates.length).toBeGreaterThan(0);
    const audited: string[] = [];
    const triggerFailures: string[] = [];
    const actionFailures: string[] = [];
    const invalidVariables: string[] = [];
    const titleMismatches: string[] = [];
    const testCopy: string[] = [];
    const waFailures: string[] = [];
    const emailFailures: string[] = [];
    const crmActionFailures: string[] = [];
    const activationFailures: string[] = [];

    for (const template of templates) {
      audited.push(template.key);
      const haystack = [
        template.name,
        template.description,
        template.triggerLabel,
        ...(template.resultLabels || []),
        ...(template.keywords || []),
      ].join(" ");
      if (TEST_COPY_RE.test(haystack)) {
        testCopy.push(`${template.key}: catalog copy`);
      }

      const requiredTriggers =
        template.engine === "whatsapp_simple"
          ? triggerKeysForWhatsAppSimple(template)
          : template.requiredTriggerKeys || [];
      if (!requiredTriggers.length) {
        triggerFailures.push(`${template.key}: missing trigger keys`);
      }
      for (const key of requiredTriggers) {
        if (!PUBLISHABLE_TRIGGER_KEYS.has(key)) {
          triggerFailures.push(`${template.key}: unknown trigger ${key}`);
        }
      }

      const graph = graphFor(template);
      const keys = actionKeys(template);
      if (!graph && template.engine !== "workflow_recipe") {
        actionFailures.push(`${template.key}: missing graph`);
      }
      if (graph) {
        const triggerNode = graph.nodes.find((node) => node.type === "trigger");
        const triggerKey = String(triggerNode?.data?.triggerKey || "");
        if (!triggerKey) {
          triggerFailures.push(`${template.key}: empty trigger node`);
        }
        if (
          triggerKey === "lead_status_changed" &&
          !String(triggerNode?.data?.toStatus || "").trim()
        ) {
          activationFailures.push(
            `${template.key}: lead_status_changed missing toStatus`
          );
        }
        const toStatus = String(triggerNode?.data?.toStatus || "").trim();
        if (toStatus && !VALID_LEAD_STATUSES.has(toStatus)) {
          crmActionFailures.push(
            `${template.key}: deprecated status ${toStatus}`
          );
        }

        for (const key of keys) {
          if (GRAPH_PLACEHOLDER_ACTIONS.has(key)) continue;
          const option = findActionOption(key);
          if (!option || option.supported !== true) {
            actionFailures.push(`${template.key}: unsupported action ${key}`);
          }
        }
        for (const node of graph.nodes) {
          if (String(node.data?.actionKey || "") !== "create_task") continue;
          if (!String(node.data?.title || "").trim()) {
            crmActionFailures.push(`${template.key}: create_task missing title`);
          }
        }
        if (JSON.stringify(graph).includes("noreply")) {
          emailFailures.push(`${template.key}: noreply fallback`);
        }
        if (TEST_COPY_RE.test(JSON.stringify(graph))) {
          testCopy.push(`${template.key}: graph copy`);
        }

        const vars = [...new Set(collectVariables({ template, graph }))];
        const allowed = allowedVarsFor(template);
        for (const token of vars) {
          if (!allowed.has(token)) {
            invalidVariables.push(`${template.key}: {{${token}}}`);
          }
        }
      }

      if (isWhatsAppFacingTemplate(template) && !template.comingSoon) {
        const preferred =
          template.waPreferredMetaName ||
          BLUEPRINT_PREFERRED_META[template.key];
        if (preferred) {
          if (isTestTemplateName(preferred)) {
            waFailures.push(`${template.key}: test meta template`);
          }
          if (
            isLegacyManagedMetaTemplateName(preferred) &&
            !template.allowBusinessAlert
          ) {
            waFailures.push(`${template.key}: deprecated meta template`);
          }
          const mappings = WA_DEFAULT_META_MAPPINGS[preferred] || [];
          if (!mappings.length && preferred !== "appointment_confirmation") {
            waFailures.push(`${template.key}: missing variable mapping`);
          }
        }
      }

      if (isEmailFacingTemplate(template) && !template.comingSoon) {
        if (!template.requiresEmailProvider) {
          emailFailures.push(`${template.key}: email card without provider gate`);
        }
        const hasConnected =
          keys.includes("send_gmail") ||
          keys.includes("send_outlook") ||
          keys.includes("send_email");
        if (!hasConnected && template.buildGraph) {
          emailFailures.push(`${template.key}: no Gmail/Outlook action`);
        }
      }

      if (
        template.key === "wa_new_lead_owner_alert" &&
        !isBusinessAlertMetaTemplateName(
          template.waPreferredMetaName || "new_lead_received_utility"
        )
      ) {
        titleMismatches.push(
          `${template.key}: owner alert is not a business-owner template`
        );
      }
      if (
        template.key === "wa_new_client_welcome" &&
        !triggerKeysForWhatsAppSimple(template).some((key) =>
          key.includes("client")
        )
      ) {
        titleMismatches.push(`${template.key}: welcome is not client_created`);
      }
      if (template.key === "wa_inactive_client") {
        const graphNodes = graphFor(template)?.nodes || [];
        const hasDelay = graphNodes.some((node) => node.type === "delay");
        if (hasDelay) {
          titleMismatches.push(
            `${template.key}: inactivity uses a delay instead of client_inactive`
          );
        }
        if (
          !triggerKeysForWhatsAppSimple(template).includes("client_inactive")
        ) {
          titleMismatches.push(`${template.key}: missing client_inactive`);
        }
      }
    }

    expect(audited.sort()).toEqual(
      templates.map((template) => template.key).sort()
    );
    expect(audited).toHaveLength(templates.length);
    expect(triggerFailures).toEqual([]);
    expect(actionFailures).toEqual([]);
    expect(invalidVariables).toEqual([]);
    expect(titleMismatches).toEqual([]);
    expect(testCopy).toEqual([]);
    expect(waFailures).toEqual([]);
    expect(emailFailures).toEqual([]);
    expect(crmActionFailures).toEqual([]);
    expect(activationFailures).toEqual([]);
    expect(ACTION_OPTIONS.some((row) => row.value === "send_gmail")).toBe(true);
    expect(ACTION_OPTIONS.some((row) => row.value === "send_outlook")).toBe(
      true
    );
    expect(ACTION_OPTIONS.some((row) => row.value === "send_email")).toBe(true);
  });

  it("keeps CRM templates visible under the CRM filter", () => {
    const visible = templates.filter((template) =>
      isTemplateVisibleInCatalog(template, { ready: true }, "crm")
    );
    const hiddenComingSoon = templates.filter(
      (template) => template.comingSoon
    );
    expect(visible.length + hiddenComingSoon.length).toBe(templates.length);
    for (const key of FORMER_LEAD_TEMPLATE_KEYS) {
      const template = WORKING_TEMPLATES.find((row) => row.key === key)!;
      if (template.comingSoon) continue;
      expect(
        isTemplateVisibleInCatalog(template, { ready: true }, "crm"),
        key
      ).toBe(true);
    }
  });
});
