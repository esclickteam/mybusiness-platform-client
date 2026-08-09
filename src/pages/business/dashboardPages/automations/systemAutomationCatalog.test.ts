import { describe, expect, it } from "vitest";
import {
  SYSTEM_AUTOMATION_CATALOG,
  findMissingMessageTemplates,
  listAiAutomations,
  listReminderAutomations,
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
        "ai_summarize_calls",
        "ai_auto_reply",
        "ai_risk_lead",
        "ai_campaign_change",
        "ai_tasks_from_chat",
      ])
    );
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

  it("reports missing WhatsApp message templates", () => {
    const gaps = findMissingMessageTemplates([]);
    expect(gaps.map((g) => g.id)).toEqual(
      expect.arrayContaining([
        "wa_appointment_reminder",
        "wa_welcome_lead",
        "wa_follow_up",
        "wa_thanks_review",
      ])
    );

    const covered = findMissingMessageTemplates([
      {
        name: "תזכורת פגישה",
        category: "appointment_reminder",
        metaTemplateName: "appointment_reminder",
        status: "active",
        metaStatus: "APPROVED",
      },
      {
        name: "ליד חדש",
        key: "new_lead_received",
        category: "welcome",
        status: "active",
      },
      {
        name: "מעקב",
        category: "follow_up",
        status: "active",
      },
      {
        name: "תודה",
        key: "thanks",
        category: "custom",
        status: "active",
      },
    ]);
    expect(covered).toEqual([]);
  });
});
