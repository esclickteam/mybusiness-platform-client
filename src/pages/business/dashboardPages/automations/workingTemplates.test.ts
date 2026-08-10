import { describe, expect, it } from "vitest";
import type { AutomationRecipeSummary } from "../../../../api/automationWorkflowApi";
import {
  WORKING_TEMPLATES,
  getTemplateReadiness,
  getWaTemplateId,
  isWhatsAppFacingTemplate,
  listUsableWaTemplates,
  pickBestWaTemplate,
  resolvePublishableTrigger,
} from "./workingTemplates";

const leadTrigger = {
  key: "new_lead",
  label: "Lead",
  description: "",
  category: "crm",
  status: "active" as const,
  isSupported: true,
  isPublishable: true,
};

const statusTrigger = {
  key: "lead_status_changed",
  label: "Status",
  description: "",
  category: "crm",
  status: "active" as const,
  isSupported: true,
  isPublishable: true,
};

const approvedWa = {
  _id: "wa1",
  name: "ברוכים הבאים לליד",
  category: "welcome",
  status: "active",
  metaStatus: "APPROVED",
  isSystem: true,
  metaTemplateName: "any_approved_name",
} as never;

describe("workingTemplates launch safety", () => {
  it("ships curated templates including WhatsApp / email / AI", () => {
    expect(WORKING_TEMPLATES.length).toBeGreaterThanOrEqual(30);
    expect(
      WORKING_TEMPLATES.filter((t) => t.engine === "whatsapp_simple").length
    ).toBeGreaterThanOrEqual(10);
    expect(WORKING_TEMPLATES.some((t) => t.categories.includes("ai"))).toBe(
      true
    );
  });

  it("only treats Meta APPROVED templates as usable", () => {
    const usable = listUsableWaTemplates([
      {
        _id: "1",
        name: "Draft",
        status: "draft",
        category: "welcome",
      } as never,
      {
        _id: "2",
        name: "Active local",
        status: "active",
        category: "follow_up",
      } as never,
      {
        _id: "3",
        name: "Welcome Lead",
        status: "active",
        metaStatus: "APPROVED",
        category: "welcome",
        key: "new_lead_welcome",
      } as never,
    ]);
    expect(usable.map((t) => getWaTemplateId(t))).toEqual(["3"]);
  });

  it("does not mark WhatsApp simple ready without connection or APPROVED template", () => {
    const template = WORKING_TEMPLATES.find(
      (t) => t.key === "wa_new_lead_welcome"
    )!;

    expect(
      getTemplateReadiness(template, {
        recipes: [],
        triggers: [],
        waTemplates: [],
        managedWaReady: false,
        calendarConnected: false,
        aiEntitled: false,
      }).ready
    ).toBe(false);

    expect(
      getTemplateReadiness(template, {
        recipes: [],
        triggers: [],
        waTemplates: [],
        managedWaReady: true,
        calendarConnected: false,
        aiEntitled: false,
      }).ready
    ).toBe(false);

    const ready = getTemplateReadiness(template, {
      recipes: [],
      triggers: [leadTrigger],
      waTemplates: [approvedWa],
      managedWaReady: true,
      calendarConnected: false,
      aiEntitled: false,
    });
    expect(ready.ready).toBe(true);
    expect(ready.suggestedWaTemplateId).toBe("wa1");
    expect(ready.resolvedTriggerKey).toBe("new_lead");
  });

  it("never marks AI templates ready (coming soon)", () => {
    const ai = WORKING_TEMPLATES.filter((t) => t.key.startsWith("wf_ai_"));
    expect(ai.length).toBeGreaterThanOrEqual(7);
    for (const template of ai) {
      expect(template.comingSoon).toBe(true);
      const readiness = getTemplateReadiness(template, {
        recipes: [
          {
            key: template.recipeKey || "ai_rank_leads",
            name: "AI",
            description: "",
            triggerCount: 1,
            pathCount: 1,
            nodeCount: 2,
            canCreate: true,
            comingSoon: false,
          } as AutomationRecipeSummary,
        ],
        triggers: [leadTrigger, statusTrigger],
        waTemplates: [approvedWa],
        managedWaReady: true,
        calendarConnected: true,
        aiEntitled: true,
      });
      expect(readiness.ready).toBe(false);
      expect(readiness.blocker).toMatch(/AI|בקרוב/i);
    }
  });

  it("marks appointment_done_email coming soon and not ready on appointment_created", () => {
    const template = WORKING_TEMPLATES.find(
      (t) => t.key === "wf_appointment_done_email"
    )!;
    expect(template.comingSoon).toBe(true);
    expect(template.requiredTriggerKeys).not.toContain("appointment_created");
    const readiness = getTemplateReadiness(template, {
      recipes: [],
      triggers: [
        {
          key: "appointment_created",
          label: "created",
          description: "",
          category: "appointments",
          status: "active",
          isSupported: true,
          isPublishable: true,
        },
      ],
      waTemplates: [],
      managedWaReady: true,
      calendarConnected: false,
      aiEntitled: false,
    });
    expect(readiness.ready).toBe(false);
  });

  it("requires APPROVED WA template for WA workflows", () => {
    const template = WORKING_TEMPLATES.find((t) => t.key === "wf_lead_multi")!;
    const blocked = getTemplateReadiness(template, {
      recipes: [],
      triggers: [leadTrigger],
      waTemplates: [],
      managedWaReady: true,
      calendarConnected: false,
      aiEntitled: false,
    });
    expect(blocked.ready).toBe(false);

    const ready = getTemplateReadiness(template, {
      recipes: [],
      triggers: [leadTrigger],
      waTemplates: [approvedWa],
      managedWaReady: true,
      calendarConnected: false,
      aiEntitled: false,
    });
    expect(ready.ready).toBe(true);
    expect(ready.resolvedTriggerKey).toBe("new_lead");
  });

  it("keeps non-WA lead email templates ready with publishable trigger", () => {
    for (const key of [
      "wf_lead_email_only",
      "wf_lead_email_task",
      "wf_lead_desk_alert",
      "wf_lead_status_sales",
    ]) {
      const template = WORKING_TEMPLATES.find((t) => t.key === key)!;
      const readiness = getTemplateReadiness(template, {
        recipes: [],
        triggers: [leadTrigger, statusTrigger],
        waTemplates: [],
        managedWaReady: false,
        calendarConnected: false,
        aiEntitled: false,
      });
      expect(readiness.ready).toBe(true);
    }
  });

  it("requires calendar connection for Google Calendar workflow", () => {
    const template = WORKING_TEMPLATES.find(
      (t) => t.key === "wf_appointment_gcal"
    )!;
    const blocked = getTemplateReadiness(template, {
      recipes: [],
      triggers: [
        {
          key: "appointment_created",
          label: "Appointment created",
          description: "",
          category: "calendar",
          status: "active",
          isSupported: true,
          isPublishable: true,
        },
      ],
      waTemplates: [],
      managedWaReady: true,
      calendarConnected: false,
      aiEntitled: false,
    });
    expect(blocked.ready).toBe(false);

    const ready = getTemplateReadiness(template, {
      recipes: [],
      triggers: [
        {
          key: "appointment_created",
          label: "Appointment created",
          description: "",
          category: "calendar",
          status: "active",
          isSupported: true,
          isPublishable: true,
        },
      ],
      waTemplates: [],
      managedWaReady: true,
      calendarConnected: true,
      aiEntitled: false,
    });
    expect(ready.ready).toBe(true);
  });

  it("duo copy no longer promises thanks-after-completed", () => {
    const duo = WORKING_TEMPLATES.find((t) => t.key === "wf_appointment_duo")!;
    expect(duo.name).not.toMatch(/תודה/);
    expect(duo.description).toMatch(/ללא הודעת תודה/);
  });

  it("marks WhatsApp simple templates as WhatsApp-facing", () => {
    const wa = WORKING_TEMPLATES.find((t) => t.key === "wa_new_lead_welcome")!;
    expect(isWhatsAppFacingTemplate(wa)).toBe(true);
  });

  it("resolves publishable triggers by preferred keys", () => {
    const key = resolvePublishableTrigger(
      ["crm_lead_created", "new_lead"],
      [leadTrigger]
    );
    expect(key).toBe("new_lead");
  });

  it("picks best APPROVED WhatsApp template by hints", () => {
    const picked = pickBestWaTemplate([approvedWa], {
      category: "welcome",
      hints: ["lead", "welcome"],
    });
    expect(picked?.id).toBe("wa1");
  });

  it("never chooses a test or business-alert template for customer welcome", () => {
    const picked = pickBestWaTemplate(
      [
        { _id: "test", name: "test", category: "welcome", status: "active", metaStatus: "APPROVED", metaTemplateName: "hello_world", isTestTemplate: true } as never,
        { _id: "alert", name: "alert", category: "welcome", status: "active", metaStatus: "APPROVED", metaTemplateName: "new_lead_received" } as never,
        { _id: "welcome", name: "welcome", category: "welcome", status: "active", metaStatus: "APPROVED", metaTemplateName: "new_lead_welcome" } as never,
      ],
      { preferredMetaName: "new_lead_welcome" }
    );
    expect(picked?.id).toBe("welcome");
  });

  it("gives an exact preferred Meta name priority", () => {
    const picked = pickBestWaTemplate(
      [
        { _id: "other", name: "other", category: "welcome", status: "active", metaStatus: "APPROVED", metaTemplateName: "other_welcome" } as never,
        { _id: "exact", name: "exact", category: "welcome", status: "active", metaStatus: "APPROVED", metaTemplateName: "appointment_reminder" } as never,
      ],
      { preferredMetaName: "appointment_reminder" }
    );
    expect(picked?.id).toBe("exact");
  });
});
