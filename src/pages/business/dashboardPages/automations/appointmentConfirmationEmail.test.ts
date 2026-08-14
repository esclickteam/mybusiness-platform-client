import { describe, expect, it } from "vitest";
import {
  APPOINTMENT_CONFIRMATION_EMAIL_DEFAULTS,
  APPOINTMENT_CONFIRMATION_HTML,
  APPOINTMENT_CONFIRMATION_TEXT,
  APPOINTMENT_EMAIL_VARIABLES,
  REQUIRED_APPOINTMENT_EMAIL_TOKENS,
  buildEmailPreviewContext,
  emailVariablesForTrigger,
  insertTokenAtCursor,
  interpolateEmailTemplate,
} from "./appointmentConfirmationEmail";
import { WORKING_TEMPLATES } from "./workingTemplates";
import { LOCAL_SYSTEM_TEMPLATES } from "./localTemplateGraphs";

const APPOINTMENT_TEMPLATE_KEYS = [
  "wf_appointment_email",
  "wf_appointment_email_notify",
  "wf_appointment_email_gcal",
  "wf_appointment_confirm_pack",
] as const;

describe("appointment confirmation email templates", () => {
  it("exposes picker variables for store_order_paid", () => {
    const vars = emailVariablesForTrigger("store_order_paid");
    expect(vars.map((row) => row.token)).toContain("{{customer.firstName}}");
    expect(vars.map((row) => row.token)).toContain("{{order.number}}");
    expect(vars.map((row) => row.token)).toContain("{{order.total}}");
    expect(vars.map((row) => row.token)).toContain("{{order.items}}");
    expect(vars.map((row) => row.token)).toContain("{{order.shippingAddress}}");
    expect(vars.map((row) => row.token)).toContain("{{store.name}}");
  });

  it("exposes picker variables for appointment_created", () => {
    const vars = emailVariablesForTrigger("appointment_created");
    expect(vars.map((row) => row.token)).toEqual(
      APPOINTMENT_EMAIL_VARIABLES.map((row) => row.token)
    );
    expect(vars.map((row) => row.label)).toContain("\u05e9\u05dd \u05d4\u05dc\u05e7\u05d5\u05d7");
    expect(vars.map((row) => row.label)).toContain("\u05e9\u05dd \u05d4\u05e2\u05e1\u05e7");
  });

  it("inserts tokens into subject, html, and text", () => {
    expect(insertTokenAtCursor("A", "{{appointment.date}}", 1, 1)).toBe(
      "A{{appointment.date}}"
    );
    expect(insertTokenAtCursor("Hello", "{{x}}", 0, 0)).toBe("{{x}}Hello");
  });

  it("renders preview sample values instead of raw tokens", () => {
    const ctx = buildEmailPreviewContext("appointment_created");
    const html = interpolateEmailTemplate(APPOINTMENT_CONFIRMATION_HTML, ctx);
    const text = interpolateEmailTemplate(APPOINTMENT_CONFIRMATION_TEXT, ctx);
    const subject = interpolateEmailTemplate(
      APPOINTMENT_CONFIRMATION_EMAIL_DEFAULTS.subject,
      ctx
    );
    expect(subject).toBe("\u05d0\u05d9\u05e9\u05d5\u05e8 \u05e4\u05d2\u05d9\u05e9\u05d4");
    for (const token of REQUIRED_APPOINTMENT_EMAIL_TOKENS) {
      expect(html).not.toContain(token);
      expect(text).not.toContain(token);
    }
    expect(html).toContain("\u05d3\u05e0\u05d4 \u05db\u05d4\u05df");
    expect(html).toContain("\u05d4\u05e2\u05e1\u05e7 \u05e9\u05dc\u05d9");
    expect(html).toContain("13/04/2027");
    expect(html).toContain("14:40");
    expect(html).toContain("30 \u05d3\u05e7\u05d5\u05ea");
    expect(html).toContain("dir=\"rtl\"");
    expect(html).not.toMatch(/<img\b/i);
    expect(html).not.toContain("logo.png");
    expect(html).not.toMatch(/\{\{/);
    expect(html).not.toContain("undefined");
    expect(html).not.toContain("null");
    expect(html).not.toContain("[object Object]");
    expect(html.toLowerCase()).not.toContain("<script");
  });

  it("ships the same confirmation html on all visible appointment email templates", () => {
    for (const key of APPOINTMENT_TEMPLATE_KEYS) {
      const template = WORKING_TEMPLATES.find((row) => row.key === key);
      expect(template, key).toBeTruthy();
      const graph = template!.buildGraph?.({
        triggerKey: "appointment_created",
        emailProvider: "gmail",
      });
      const emailNode = graph?.nodes.find(
        (node) =>
          node.type === "action" &&
          String((node.data as { actionKey?: string }).actionKey) ===
            "send_gmail"
      );
      expect(emailNode, key).toBeTruthy();
      const data = emailNode!.data as {
        html?: string;
        text?: string;
        subject?: string;
        actionKey?: string;
      };
      expect(data.actionKey).toBe("send_gmail");
      expect(data.subject).toBe(APPOINTMENT_CONFIRMATION_EMAIL_DEFAULTS.subject);
      expect(String(data.html)).toContain("{{appointment.clientName}}");
      expect(String(data.html)).toContain("{{appointment.date}}");
      expect(String(data.html)).toContain("{{appointment.time}}");
      expect(String(data.html)).toContain("{{appointment.duration}}");
      expect(String(data.html)).toContain("{{business.name}}");
      expect(String(data.html)).not.toMatch(/<img\b/i);
      expect(String(data.html)).not.toContain("logo.png");
      expect(String(data.text)).toContain("{{appointment.clientName}}");
      expect(JSON.stringify(graph)).not.toContain("send_email");
    }
  });

  it("keeps local appointment email on the same defaults", () => {
    const local = LOCAL_SYSTEM_TEMPLATES.find(
      (row) => row.key === "local_appointment_email"
    );
    expect(local?.actions[0]?.defaults?.html).toContain(
      "{{appointment.clientName}}"
    );
    expect(local?.actions[0]?.defaults?.subject).toBe(
      APPOINTMENT_CONFIRMATION_EMAIL_DEFAULTS.subject
    );
  });
});
