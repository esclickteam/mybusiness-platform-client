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
  metaTemplateName: "new_lead_welcome",
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
        gmailConnected: false,
        outlookConnected: false,
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
        gmailConnected: false,
        outlookConnected: false,
        aiEntitled: false,
      }).ready
    ).toBe(false);

    const ready = getTemplateReadiness(template, {
      recipes: [],
      triggers: [leadTrigger],
      waTemplates: [approvedWa],
      managedWaReady: true,
      calendarConnected: false,
      gmailConnected: false,
      outlookConnected: false,
      aiEntitled: false,
    });
    expect(ready.ready).toBe(true);
    expect(ready.suggestedWaTemplateId).toBe("wa1");
    expect(ready.resolvedTriggerKey).toBe("new_lead");
  });

  it("exposes supported AI templates as ready when their trigger exists", () => {
    const ai = WORKING_TEMPLATES.filter((t) => t.categories.includes("ai"));
    expect(ai).toHaveLength(10);
    expect(ai.every((template) => template.comingSoon === false)).toBe(true);
    expect(ai.every((template) => template.requiresAiEntitlement !== true)).toBe(
      true
    );
    expect(ai.map((template) => template.key)).toContain("ai_lead_scoring");
    expect(ai.map((template) => template.recipeKey)).toContain("ai_rank_leads");
    expect(WORKING_TEMPLATES.some((template) => template.key.startsWith("wf_ai_"))).toBe(false);

    const leadScoring = ai.find((template) => template.recipeKey === "ai_rank_leads")!;
    expect(leadScoring.keywords?.length).toBeGreaterThan(0);
    expect(leadScoring.requiredTriggerKeys).toEqual(
      expect.arrayContaining(["new_lead", "crm_lead_created"])
    );
    expect(leadScoring.categories).toEqual(
      expect.arrayContaining(["ai", "leads", "crm", "sales"])
    );

    const followup = ai.find((template) => template.recipeKey === "ai_followup_draft")!;
    expect(followup.requiredTriggerKeys).toEqual(
      expect.arrayContaining(["lead_status_changed"])
    );

    const digest = ai.find((template) => template.recipeKey === "ai_daily_leads_digest")!;
    expect(digest.requiredTriggerKeys).toEqual(["scheduled"]);
    expect(digest.categories).toEqual(expect.arrayContaining(["ai", "crm"]));

    const readiness = getTemplateReadiness(leadScoring, {
      recipes: [], triggers: [leadTrigger], waTemplates: [], managedWaReady: false,
      calendarConnected: false, gmailConnected: false, outlookConnected: false, aiEntitled: false,
    });
    expect(readiness.ready).toBe(true);
    expect(readiness.blocker).toBeUndefined();
    expect(readiness.resolvedTriggerKey).toBe("new_lead");
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
      gmailConnected: false,
      outlookConnected: false,
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
      gmailConnected: false,
      outlookConnected: false,
      aiEntitled: false,
    });
    expect(blocked.ready).toBe(false);

    const ready = getTemplateReadiness(template, {
      recipes: [],
      triggers: [leadTrigger],
      waTemplates: [approvedWa],
      managedWaReady: true,
      calendarConnected: false,
      gmailConnected: false,
      outlookConnected: false,
      aiEntitled: false,
    });
    expect(ready.ready).toBe(true);
    expect(ready.resolvedTriggerKey).toBe("new_lead");
  });

  it("enables client WhatsApp cards when approved Meta template + client trigger exist", () => {
    const clientTrigger = {
      key: "client_created",
      label: "Client",
      description: "",
      category: "crm",
      status: "active" as const,
      isSupported: true,
      isPublishable: true,
    };
    const inactiveTrigger = {
      key: "client_inactive",
      label: "Inactive",
      description: "",
      category: "crm",
      status: "active" as const,
      isSupported: true,
      isPublishable: true,
    };
    const welcomeTpl = {
      _id: "nc1",
      name: "New Client Welcome",
      category: "welcome",
      status: "active",
      metaStatus: "APPROVED",
      metaTemplateName: "new_client_welcome",
    } as never;
    const inactiveTpl = {
      _id: "ic1",
      name: "Inactive Client",
      category: "follow_up",
      status: "active",
      metaStatus: "APPROVED",
      metaTemplateName: "inactive_client",
    } as never;

    const welcome = WORKING_TEMPLATES.find((t) => t.key === "wa_new_client_welcome")!;
    const inactive = WORKING_TEMPLATES.find((t) => t.key === "wa_inactive_client")!;

    const welcomeReady = getTemplateReadiness(welcome, {
      recipes: [],
      triggers: [clientTrigger],
      waTemplates: [welcomeTpl],
      managedWaReady: true,
      calendarConnected: false,
      gmailConnected: false,
      outlookConnected: false,
      aiEntitled: false,
    });
    expect(welcomeReady.ready).toBe(true);
    expect(welcomeReady.resolvedTriggerKey).toBe("client_created");

    const inactiveReady = getTemplateReadiness(inactive, {
      recipes: [],
      triggers: [inactiveTrigger],
      waTemplates: [inactiveTpl],
      managedWaReady: true,
      calendarConnected: false,
      gmailConnected: false,
      outlookConnected: false,
      aiEntitled: false,
    });
    expect(inactiveReady.ready).toBe(true);
    expect(inactiveReady.resolvedTriggerKey).toBe("client_inactive");

    const missingMeta = getTemplateReadiness(welcome, {
      recipes: [],
      triggers: [clientTrigger],
      waTemplates: [approvedWa],
      managedWaReady: true,
      calendarConnected: false,
      gmailConnected: false,
      outlookConnected: false,
      aiEntitled: false,
    });
    expect(missingMeta.ready).toBe(false);
    expect(missingMeta.blocker).toMatch(/תבנית WhatsApp מאושרת/);
    expect(missingMeta.blocker).not.toMatch(/טריגר מאושר/);
  });

  it("keeps non-WA CRM templates ready with publishable trigger", () => {
    for (const key of ["wf_lead_desk_alert", "wf_lead_status_sales"]) {
      const template = WORKING_TEMPLATES.find((t) => t.key === key)!;
      const readiness = getTemplateReadiness(template, {
        recipes: [],
        triggers: [leadTrigger, statusTrigger],
        waTemplates: [],
        managedWaReady: false,
        calendarConnected: false,
        gmailConnected: false,
        outlookConnected: false,
        aiEntitled: false,
      });
      expect(readiness.ready).toBe(true);
    }
  });

  it("requires a connected email provider, not Gmail specifically", () => {
    const template = WORKING_TEMPLATES.find((t) => t.key === "wf_lead_email_only")!;
    const blocked = getTemplateReadiness(template, {
      recipes: [],
      triggers: [leadTrigger],
      waTemplates: [],
      managedWaReady: false,
      calendarConnected: false,
      gmailConnected: false,
      outlookConnected: false,
      aiEntitled: false,
    });
    expect(blocked.ready).toBe(false);
    expect(blocked.blocker).toBe(
      "כדי להשתמש באוטומציה הזו יש לחבר Gmail או Outlook / Microsoft 365"
    );

    const gmailOnly = getTemplateReadiness(template, {
      recipes: [],
      triggers: [leadTrigger],
      waTemplates: [],
      managedWaReady: false,
      calendarConnected: false,
      gmailConnected: true,
      outlookConnected: false,
      aiEntitled: false,
    });
    expect(gmailOnly.ready).toBe(true);
    expect(gmailOnly.suggestedEmailProvider).toBe("gmail");
    expect(gmailOnly.needsEmailProviderChoice).toBe(false);

    const outlookOnly = getTemplateReadiness(template, {
      recipes: [],
      triggers: [leadTrigger],
      waTemplates: [],
      managedWaReady: false,
      calendarConnected: false,
      gmailConnected: false,
      outlookConnected: true,
      aiEntitled: false,
    });
    expect(outlookOnly.ready).toBe(true);
    expect(outlookOnly.suggestedEmailProvider).toBe("outlook");
    expect(outlookOnly.needsEmailProviderChoice).toBe(false);

    const both = getTemplateReadiness(template, {
      recipes: [],
      triggers: [leadTrigger],
      waTemplates: [],
      managedWaReady: false,
      calendarConnected: false,
      gmailConnected: true,
      outlookConnected: true,
      aiEntitled: false,
    });
    expect(both.ready).toBe(true);
    expect(both.needsEmailProviderChoice).toBe(true);
    expect(both.connectedEmailProviders).toEqual(["gmail", "outlook"]);
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
      gmailConnected: false,
      outlookConnected: false,
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
      gmailConnected: false,
      outlookConnected: false,
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

  it("unifies lead reply sequence and hides fragmented follow-up cards", () => {
    const main = WORKING_TEMPLATES.find(
      (t) => t.key === "wf_lead_no_response_pack"
    )!;
    expect(main.comingSoon).toBeFalsy();
    expect(main.name).toMatch(/פתיחה \+ פולואפים לפי תגובה/);
    expect(main.requiredTriggerKeys).toEqual(
      expect.arrayContaining(["new_lead"])
    );
    expect(main.requiredMetaTemplateNames).toEqual([
      "new_lead_welcome",
      "lead_follow_up",
      "lead_follow_up_2",
    ]);
    const graph = main.buildGraph!({ triggerKey: "new_lead" });
    const conditionKeys = graph.nodes
      .filter((n) => n.type === "condition")
      .map((n) => String((n.data as { conditionKey?: string }).conditionKey || ""));
    expect(conditionKeys).toEqual(["no_response", "no_response"]);
    const metaNames = graph.nodes
      .filter(
        (n) =>
          n.type === "action" &&
          String((n.data as { actionKey?: string }).actionKey || "") ===
            "whatsapp_template"
      )
      .map((n) =>
        String((n.data as { metaTemplateName?: string }).metaTemplateName || "")
      );
    expect(metaNames).toEqual([
      "new_lead_welcome",
      "lead_follow_up",
      "lead_follow_up_2",
    ]);

    const hiddenStandalone = ["wa_lead_no_response", "wa_lead_followup_2"];
    for (const key of hiddenStandalone) {
      const tpl = WORKING_TEMPLATES.find((t) => t.key === key)!;
      expect(tpl.comingSoon).toBe(true);
    }

    const opening = WORKING_TEMPLATES.find((t) => t.key === "wa_new_lead_welcome")!;
    expect(opening.name).toMatch(/פתיחה בלבד/);
    expect(opening.description).toMatch(/ללא פולואפים/);
  });

  it("requires all three Meta templates for the reply sequence card", () => {
    const main = WORKING_TEMPLATES.find(
      (t) => t.key === "wf_lead_no_response_pack"
    )!;
    const fu1 = {
      _id: "fu1",
      name: "Lead Follow Up",
      category: "follow_up",
      status: "active",
      metaStatus: "APPROVED",
      metaTemplateName: "lead_follow_up",
    } as never;
    const fu2 = {
      _id: "fu2",
      name: "Lead Follow Up 2",
      category: "follow_up",
      status: "active",
      metaStatus: "APPROVED",
      metaTemplateName: "lead_follow_up_2",
    } as never;

    const missing = getTemplateReadiness(main, {
      recipes: [],
      triggers: [leadTrigger],
      waTemplates: [approvedWa],
      managedWaReady: true,
      calendarConnected: false,
      gmailConnected: false,
      outlookConnected: false,
      aiEntitled: false,
    });
    expect(missing.ready).toBe(false);
    expect(missing.blocker).toMatch(/lead_follow_up/);

    const ready = getTemplateReadiness(main, {
      recipes: [],
      triggers: [leadTrigger],
      waTemplates: [approvedWa, fu1, fu2],
      managedWaReady: true,
      calendarConnected: false,
      gmailConnected: false,
      outlookConnected: false,
      aiEntitled: false,
    });
    expect(ready.ready).toBe(true);
    expect(ready.resolvedTriggerKey).toBe("new_lead");
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
        { _id: "alert", name: "alert", category: "welcome", status: "active", metaStatus: "APPROVED", metaTemplateName: "new_lead_received_utility" } as never,
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

const appointmentTrigger = {
  key: "appointment_created",
  label: "Appointment",
  description: "",
  category: "appointments",
  status: "active" as const,
  isSupported: true,
  isPublishable: true,
};

const EMAIL_TEMPLATE_KEYS = [
  "wf_lead_wa_email",
  "wf_lead_full_onboarding",
  "wf_lead_email_task",
  "wf_lead_email_only",
  "wf_new_client_pack",
  "wf_appointment_email",
  "wf_appointment_email_notify",
  "wf_appointment_email_gcal",
  "wf_appointment_confirm_pack",
  "wf_appointment_done_email",
];

function emailGraphKeys(key: string, provider: "gmail" | "outlook") {
  const template = WORKING_TEMPLATES.find((row) => row.key === key)!;
  const triggerKey = template.requiredTriggerKeys?.[0] || "new_lead";
  return (template.buildGraph?.({ triggerKey, emailProvider: provider })?.nodes || [])
    .filter((node) => node.type === "action")
    .map((node) => String((node.data as { actionKey?: string }).actionKey || ""));
}

describe("provider-aware email templates", () => {
  it("builds Gmail or Outlook actions and never Bizuply email", () => {
    for (const key of EMAIL_TEMPLATE_KEYS) {
      const gmailKeys = emailGraphKeys(key, "gmail");
      const outlookKeys = emailGraphKeys(key, "outlook");
      expect(gmailKeys, key).toContain("send_gmail");
      expect(outlookKeys, key).toContain("send_outlook");
      expect(gmailKeys, key).not.toContain("send_email");
      expect(outlookKeys, key).not.toContain("send_email");
      expect(gmailKeys, key).not.toContain("connected_email");
      expect(outlookKeys, key).not.toContain("connected_email");
    }
  });

  it("audits Gmail-only, Outlook-only, both, and neither for activatable email cards", () => {
    const activatable = EMAIL_TEMPLATE_KEYS.filter((key) => {
      const template = WORKING_TEMPLATES.find((row) => row.key === key)!;
      return !template.comingSoon;
    });

    for (const key of activatable) {
      const template = WORKING_TEMPLATES.find((row) => row.key === key)!;
      const triggers = [
        leadTrigger,
        appointmentTrigger,
        {
          key: "client_created",
          label: "Client",
          description: "",
          category: "crm",
          status: "active" as const,
          isSupported: true,
          isPublishable: true,
        },
      ];
      const base = {
        recipes: [],
        triggers,
        waTemplates: template.requiresWaTemplate ? [approvedWa] : [],
        managedWaReady: Boolean(template.requiresWaTemplate),
        calendarConnected: Boolean(template.requiresCalendar),
        aiEntitled: false,
      };

      const none = getTemplateReadiness(template, {
        ...base,
        gmailConnected: false,
        outlookConnected: false,
      });
      expect(none.ready, key).toBe(false);
      expect(none.blocker, key).toBe(
        "כדי להשתמש באוטומציה הזו יש לחבר Gmail או Outlook / Microsoft 365"
      );

      const gmail = getTemplateReadiness(template, {
        ...base,
        gmailConnected: true,
        outlookConnected: false,
      });
      expect(gmail.ready, `${key} gmail`).toBe(true);
      expect(gmail.suggestedEmailProvider, key).toBe("gmail");
      expect(gmail.needsEmailProviderChoice, key).toBe(false);

      const outlook = getTemplateReadiness(template, {
        ...base,
        gmailConnected: false,
        outlookConnected: true,
      });
      expect(outlook.ready, `${key} outlook`).toBe(true);
      expect(outlook.suggestedEmailProvider, key).toBe("outlook");
      expect(outlook.needsEmailProviderChoice, key).toBe(false);

      const both = getTemplateReadiness(template, {
        ...base,
        gmailConnected: true,
        outlookConnected: true,
      });
      expect(both.ready, `${key} both`).toBe(true);
      expect(both.needsEmailProviderChoice, key).toBe(true);
    }
  });
});

