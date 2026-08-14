import { describe, expect, it } from "vitest";
import {
  SYSTEM_AUTOMATION_CATALOG,
  findMissingMessageTemplates,
  listAiAutomations,
  listReminderAutomations,
  listRequiredWhatsAppMessageTemplates,
} from "./systemAutomationCatalog";

describe("systemAutomationCatalog", () => {
  it("covers CRM, appointments, WhatsApp and AI flows with trigger→result", () => {
    expect(SYSTEM_AUTOMATION_CATALOG.length).toBeGreaterThanOrEqual(12);
    for (const row of SYSTEM_AUTOMATION_CATALOG) {
      expect(row.triggerLabel.trim().length).toBeGreaterThan(0);
      expect(row.resultLabels.length).toBeGreaterThan(0);
    }
  });

  it("lists AI automations tied to recipe keys", () => {
    const ai = listAiAutomations();
    expect(ai.map((row) => row.recipeKey)).toEqual(
      expect.arrayContaining([
        "ai_rank_leads",
        "ai_classify_lead",
        "ai_auto_tag",
        "ai_daily_leads_digest",
        "ai_daily_agenda_digest",
      ])
    );
    expect(ai.some((row) => row.recipeKey === "ai_auto_reply")).toBe(false);
  });

  it("includes 1-day and 2-day meeting reminders", () => {
    const reminders = listReminderAutomations();
    expect(reminders.some((r) => r.id === "appointment_reminder_1_day")).toBe(
      true
    );
    expect(reminders.some((r) => r.id === "appointment_reminder_2_days")).toBe(
      true
    );
  });

  it("lists all WhatsApp message templates businesses should prepare", () => {
    const required = listRequiredWhatsAppMessageTemplates([]);
    expect(required.map((g) => g.id)).toEqual(
      expect.arrayContaining([
        "wa_appointment_reminder",
        "wa_appointment_confirmation",
        "wa_welcome_lead",
        "wa_welcome_client",
        "wa_follow_up",
        "wa_follow_up_2",
        "wa_appointment_thanks",
        "wa_appointment_review",
        "wa_inactive_client",
      ])
    );
    expect(required.every((row) => !row.prepared)).toBe(true);

    const gaps = findMissingMessageTemplates([]);
    expect(gaps.length).toBe(required.length);

    const status = listRequiredWhatsAppMessageTemplates([
      {
        name: "תזכורת פגישה",
        category: "appointment_reminder",
        metaTemplateName: "appointment_reminder",
        status: "active",
        metaStatus: "APPROVED",
      },
      {
        name: "ליד חדש",
        key: "new_lead_welcome",
        category: "welcome",
        status: "active",
      },
      {
        name: "מעקב לליד",
        key: "lead_follow_up",
        category: "follow_up",
        status: "active",
      },
      {
        name: "תודה",
        key: "appointment_thanks",
        metaTemplateName: "appointment_thanks",
        category: "custom",
        status: "active",
      },
    ]);
    expect(status.find((r) => r.id === "wa_appointment_reminder")?.prepared).toBe(
      true
    );
    expect(status.find((r) => r.id === "wa_welcome_lead")?.prepared).toBe(true);
    expect(status.find((r) => r.id === "wa_appointment_thanks")?.prepared).toBe(
      true
    );
    expect(status.find((r) => r.id === "wa_appointment_review")?.prepared).toBe(
      false
    );
  });

  it("does not treat the owner alert as a lead welcome template", () => {
    const ownerOnly = listRequiredWhatsAppMessageTemplates([
      { metaTemplateName: "new_lead_received_utility", status: "active", metaStatus: "APPROVED" },
    ]);
    expect(ownerOnly.find((row) => row.id === "wa_welcome_lead")?.prepared).toBe(false);

    const customerWelcome = listRequiredWhatsAppMessageTemplates([
      { metaTemplateName: "new_lead_welcome", status: "active", metaStatus: "APPROVED" },
    ]);
    expect(customerWelcome.find((row) => row.id === "wa_welcome_lead")?.prepared).toBe(true);
  });
});
