import { describe, expect, it } from "vitest";
import type { AutomationRecipeSummary } from "../../../../api/automationWorkflowApi";
import {
  WORKING_TEMPLATES,
  getTemplateReadiness,
  listUsableWaTemplates,
  pickBestWaTemplate,
  resolvePublishableTrigger,
} from "./workingTemplates";

describe("workingTemplates", () => {
  it("ships curated common-case templates across WhatsApp, email and AI", () => {
    expect(WORKING_TEMPLATES.length).toBeGreaterThanOrEqual(30);
    for (const row of WORKING_TEMPLATES) {
      expect(row.triggerLabel.trim().length).toBeGreaterThan(0);
      expect(row.resultLabels.length).toBeGreaterThan(0);
      expect(["whatsapp_simple", "workflow_recipe", "workflow_graph"]).toContain(
        row.engine
      );
    }
    expect(
      WORKING_TEMPLATES.filter((t) => t.engine === "whatsapp_simple").length
    ).toBeGreaterThanOrEqual(10);
    expect(
      WORKING_TEMPLATES.some((t) => t.categories.includes("email"))
    ).toBe(true);
    expect(WORKING_TEMPLATES.some((t) => t.categories.includes("ai"))).toBe(
      true
    );
    expect(
      WORKING_TEMPLATES.some((t) => t.key === "wf_lead_wa_email")
    ).toBe(true);
    expect(
      WORKING_TEMPLATES.some((t) => t.key === "wf_lead_full_onboarding")
    ).toBe(true);
  });

  it("includes common meeting reminder timings on WhatsApp simple", () => {
    const reminders = WORKING_TEMPLATES.filter((t) =>
      t.key.startsWith("wa_appointment_reminder")
    );
    expect(reminders.map((r) => r.key)).toEqual(
      expect.arrayContaining([
        "wa_appointment_reminder_1_day",
        "wa_appointment_reminder_2_days",
        "wa_appointment_reminder_3_days",
        "wa_appointment_reminder_2_hours",
        "wa_appointment_reminder_1_hour",
      ])
    );
    expect(
      reminders.find((r) => r.key === "wa_appointment_reminder_2_days")
        ?.hoursBefore
    ).toBe(48);
    expect(
      reminders.find((r) => r.key === "wa_appointment_reminder_3_days")
        ?.hoursBefore
    ).toBe(72);
    expect(
      reminders.find((r) => r.key === "wa_appointment_reminder_2_hours")
        ?.hoursBefore
    ).toBe(2);
  });

  it("filters unusable WhatsApp templates and picks the best match", () => {
    const usable = listUsableWaTemplates([
      {
        _id: "1",
        name: "Draft",
        status: "draft",
        category: "welcome",
      } as never,
      {
        _id: "2",
        name: "Rejected",
        status: "active",
        metaStatus: "REJECTED",
        category: "welcome",
      } as never,
      {
        _id: "3",
        name: "Welcome Lead",
        status: "active",
        metaStatus: "APPROVED",
        category: "welcome",
        key: "new_lead_welcome",
      } as never,
      {
        _id: "4",
        name: "Reminder",
        status: "active",
        metaStatus: "APPROVED",
        category: "appointment_reminder",
      } as never,
    ]);
    expect(usable.map((t) => String((t as { _id: string })._id))).toEqual([
      "3",
      "4",
    ]);

    const picked = pickBestWaTemplate(usable, {
      category: "welcome",
      hints: ["lead", "welcome"],
    });
    expect(picked?.id).toBe("3");
  });

  it("resolves publishable triggers by preferred keys", () => {
    const key = resolvePublishableTrigger(
      ["crm_lead_created", "lead_created"],
      [
        {
          key: "lead_created",
          label: "Lead created",
          description: "",
          category: "crm",
          status: "active",
          isSupported: true,
          isPublishable: true,
        },
        {
          key: "appointment_created",
          label: "Appointment",
          description: "",
          category: "calendar",
          status: "active",
          isSupported: true,
          isPublishable: false,
        },
      ]
    );
    expect(key).toBe("lead_created");
  });

  it("marks WhatsApp simple ready only when an approved template exists", () => {
    const template = WORKING_TEMPLATES.find(
      (t) => t.key === "wa_new_lead_welcome"
    )!;
    const blocked = getTemplateReadiness(template, {
      recipes: [],
      triggers: [],
      waTemplates: [],
      calendarConnected: false,
      aiEntitled: false,
    });
    expect(blocked.ready).toBe(false);

    const ready = getTemplateReadiness(template, {
      recipes: [],
      triggers: [],
      waTemplates: [
        {
          _id: "wa1",
          name: "ברוכים הבאים לליד",
          category: "welcome",
          status: "active",
          metaStatus: "APPROVED",
        } as never,
      ],
      calendarConnected: false,
      aiEntitled: false,
    });
    expect(ready.ready).toBe(true);
    expect(ready.suggestedWaTemplateId).toBe("wa1");
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
      calendarConnected: false,
      aiEntitled: false,
    });
    expect(blocked.ready).toBe(false);
    expect(blocked.blocker).toMatch(/Google Calendar/i);

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
      calendarConnected: true,
      aiEntitled: false,
    });
    expect(ready.ready).toBe(true);
    expect(ready.resolvedTriggerKey).toBe("appointment_created");
  });

  it("requires AI entitlement and recipe or publishable trigger graph", () => {
    const template = WORKING_TEMPLATES.find((t) => t.key === "wf_ai_rank_leads")!;
    const recipe: AutomationRecipeSummary = {
      key: "ai_rank_leads",
      name: "AI rank",
      description: "",
      triggerCount: 1,
      pathCount: 1,
      nodeCount: 2,
      canCreate: true,
      aiLocked: false,
    };
    const leadTrigger = {
      key: "lead_created",
      label: "Lead",
      description: "",
      category: "crm",
      status: "active",
      isSupported: true,
      isPublishable: true,
    };

    expect(
      getTemplateReadiness(template, {
        recipes: [recipe],
        triggers: [],
        waTemplates: [],
        calendarConnected: false,
        aiEntitled: false,
      }).ready
    ).toBe(false);

    expect(
      getTemplateReadiness(template, {
        recipes: [recipe],
        triggers: [],
        waTemplates: [],
        calendarConnected: false,
        aiEntitled: true,
      }).ready
    ).toBe(true);

    // Locked recipe can still activate via local AI graph + publishable trigger
    const viaGraph = getTemplateReadiness(template, {
      recipes: [{ ...recipe, aiLocked: true }],
      triggers: [leadTrigger],
      waTemplates: [],
      calendarConnected: false,
      aiEntitled: true,
    });
    expect(viaGraph.ready).toBe(true);
    expect(viaGraph.resolvedTriggerKey).toBe("lead_created");
  });

  it("bakes WhatsApp template id into multi-result lead graph", () => {
    const template = WORKING_TEMPLATES.find((t) => t.key === "wf_lead_multi")!;
    const readiness = getTemplateReadiness(template, {
      recipes: [
        {
          key: "lead_multi_route",
          name: "Lead multi",
          description: "",
          triggerCount: 1,
          pathCount: 3,
          nodeCount: 4,
          canCreate: true,
        },
      ],
      triggers: [
        {
          key: "lead_created",
          label: "Lead",
          description: "",
          category: "crm",
          status: "active",
          isSupported: true,
          isPublishable: true,
        },
      ],
      waTemplates: [
        {
          _id: "wa-lead",
          name: "Welcome",
          category: "welcome",
          status: "active",
          metaStatus: "APPROVED",
        } as never,
      ],
      calendarConnected: false,
      aiEntitled: false,
    });
    expect(readiness.ready).toBe(true);
    expect(readiness.resolvedTriggerKey).toBe("lead_created");

    const graph = template.buildGraph!({
      triggerKey: readiness.resolvedTriggerKey!,
      waTemplateId: readiness.suggestedWaTemplateId,
    });
    const waNode = graph.nodes.find(
      (n) => n.data && (n.data as { actionKey?: string }).actionKey === "whatsapp_template"
    );
    expect((waNode?.data as { templateId?: string }).templateId).toBe("wa-lead");
    expect(graph.edges.length).toBe(3);
  });

  it("builds WhatsApp + email dual-channel lead graph", () => {
    const template = WORKING_TEMPLATES.find((t) => t.key === "wf_lead_wa_email")!;
    const graph = template.buildGraph!({
      triggerKey: "lead_created",
      waTemplateId: "wa-123",
    });
    const keys = graph.nodes
      .filter((n) => n.type === "action")
      .map((n) => (n.data as { actionKey?: string }).actionKey);
    expect(keys).toEqual(["whatsapp_template", "send_email"]);
    expect(
      (graph.nodes.find((n) => n.id === "action_1")?.data as { templateId?: string })
        .templateId
    ).toBe("wa-123");
  });
});
