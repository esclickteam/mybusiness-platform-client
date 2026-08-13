import { describe, expect, it } from "vitest";
import {
  LEAD_OPENING_EMAIL_DEFAULTS,
  LEAD_OPENING_HTML,
  LEAD_OPENING_SUBJECT,
  LEAD_OPENING_TEXT,
  LEAD_WELCOME_EMAIL_DEFAULTS,
  LEAD_WELCOME_HTML,
  LEAD_WELCOME_SUBJECT,
  LEAD_WELCOME_TEXT,
  REQUIRED_LEAD_EMAIL_TOKENS,
} from "./leadWelcomeEmail";
import {
  buildEmailPreviewContext,
  interpolateEmailTemplate,
} from "./appointmentConfirmationEmail";
import { WORKING_TEMPLATES } from "./workingTemplates";

const WELCOME_KEYS = [
  "wf_lead_wa_email",
  "wf_lead_full_onboarding",
  "wf_lead_email_task",
] as const;
const OPENING_KEYS = ["wf_lead_email_only"] as const;
const APPOINTMENT_KEYS = [
  "wf_appointment_email",
  "wf_appointment_email_notify",
  "wf_appointment_email_gcal",
  "wf_appointment_confirm_pack",
] as const;

function emailNode(key: string, provider: "gmail" | "outlook") {
  const template = WORKING_TEMPLATES.find((row) => row.key === key)!;
  const graph = template.buildGraph?.({
    triggerKey: template.requiredTriggerKeys?.[0] || "new_lead",
    emailProvider: provider,
  });
  return (graph?.nodes || []).find((node) => {
    const actionKey = String((node.data as { actionKey?: string }).actionKey || "");
    return actionKey === "send_gmail" || actionKey === "send_outlook";
  });
}

describe("lead welcome email defaults", () => {
  it("renders preview sample values instead of tokens or test strings", () => {
    const ctx = buildEmailPreviewContext("new_lead");
    const html = interpolateEmailTemplate(LEAD_WELCOME_HTML, ctx);
    const text = interpolateEmailTemplate(LEAD_WELCOME_TEXT, ctx);
    const subject = interpolateEmailTemplate(LEAD_WELCOME_SUBJECT, ctx);
    expect(subject).toContain("העסק שלי");
    expect(html).toContain("ישראל ישראלי");
    expect(html).toContain("העסק שלי");
    expect(html).toContain("050-0000000");
    expect(html).toContain("אתר");
    expect(html).toContain('dir="rtl"');
    expect(html).toContain("bizuply.com/email/logo.png");
    expect(html).not.toMatch(/\{\{/);
    expect(html).not.toContain("Email E2E");
    expect(html).not.toContain("undefined");
    expect(html.toLowerCase()).not.toContain("<script");
    expect(text).toContain("ישראל ישראלי");
    expect(text).not.toMatch(/\{\{/);
  });

  it("keeps opening copy distinct but on the same design system", () => {
    const ctx = buildEmailPreviewContext("new_lead");
    const html = interpolateEmailTemplate(LEAD_OPENING_HTML, ctx);
    expect(LEAD_OPENING_SUBJECT).toBe("תודה על הפנייה");
    expect(html).toContain("תודה שפנית אלינו");
    expect(html).toContain("bizuply.com/email/logo.png");
    expect(html).toContain("מופעל באמצעות Bizuply");
    expect(html).not.toMatch(/\{\{/);
  });

  it("ships welcome defaults on mixed lead email templates", () => {
    for (const key of WELCOME_KEYS) {
      for (const provider of ["gmail", "outlook"] as const) {
        const node = emailNode(key, provider);
        const data = node?.data as {
          actionKey?: string;
          subject?: string;
          html?: string;
          text?: string;
        };
        expect(data?.actionKey).toBe(provider === "outlook" ? "send_outlook" : "send_gmail");
        expect(data?.subject).toBe(LEAD_WELCOME_EMAIL_DEFAULTS.subject);
        expect(String(data?.html)).toBe(LEAD_WELCOME_HTML);
        expect(String(data?.text)).toBe(LEAD_WELCOME_TEXT);
        for (const token of REQUIRED_LEAD_EMAIL_TOKENS) {
          expect(String(data?.html)).toContain(token);
        }
        expect(JSON.stringify(data)).not.toContain("Email E2E");
        expect(JSON.stringify(data)).not.toMatch(/send_email/);
      }
    }
  });

  it("ships opening defaults on lead-email-only", () => {
    for (const provider of ["gmail", "outlook"] as const) {
      const node = emailNode("wf_lead_email_only", provider);
      const data = node?.data as { subject?: string; html?: string; text?: string };
      expect(data?.subject).toBe(LEAD_OPENING_EMAIL_DEFAULTS.subject);
      expect(String(data?.html)).toBe(LEAD_OPENING_HTML);
      expect(String(data?.text)).toBe(LEAD_OPENING_TEXT);
    }
  });

  it("keeps professional appointment confirmation html on all 4 appointment email templates", () => {
    for (const key of APPOINTMENT_KEYS) {
      for (const provider of ["gmail", "outlook"] as const) {
        const node = emailNode(key, provider);
        const data = node?.data as { html?: string; text?: string; subject?: string };
        expect(String(data?.html)).toContain("{{appointment.clientName}}");
        expect(String(data?.html)).toContain("{{appointment.date}}");
        expect(String(data?.html)).toContain("{{appointment.time}}");
        expect(String(data?.html)).toContain("{{appointment.duration}}");
        expect(String(data?.html)).toContain("bizuply.com/email/logo.png");
        expect(String(data?.text)).toContain("{{appointment.clientName}}");
        expect(String(data?.subject)).toBe("אישור פגישה");
      }
    }
  });

  it("does not leak internal task or notification copy into customer email", () => {
    const bodies = [LEAD_WELCOME_HTML, LEAD_OPENING_HTML, LEAD_WELCOME_TEXT, LEAD_OPENING_TEXT];
    for (const body of bodies) {
      expect(body).not.toContain("משימה");
      expect(body).not.toContain("התראה");
      expect(body).not.toContain("WhatsApp");
      expect(body).not.toContain("Google Calendar");
    }
  });
});
