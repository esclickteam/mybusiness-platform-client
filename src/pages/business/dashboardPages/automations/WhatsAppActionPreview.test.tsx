import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type {
  ApprovedWhatsAppTemplate,
  WhatsAppVariableMapping,
} from "../../../../api/whatsappApi";
import { WhatsAppActionPreview } from "./WhatsAppActionPreview";
import {
  WA_PREVIEW_EMPTY_HE,
  WA_PREVIEW_ERROR_HE,
  WA_PREVIEW_SAMPLE_DATA,
  buildWhatsAppPreviewModel,
  interpolateWhatsAppPreviewText,
} from "./whatsAppActionPreviewModel";

const CATALOG_BODIES: Record<string, string> = {
  new_lead_welcome:
    "Hello {{1}}, thank you for contacting us! We received your details and will get back to you shortly. You can also reply to this message.",
  new_lead_received_utility:
    "New lead: {{1}}\nPhone: {{2}}\nSource: {{3}}",
  appointment_reminder:
    "Hello {{1}}, reminder for your meeting {{2}} at {{3}} for {{4}}. We look forward to seeing you!",
  appointment_thanks:
    "Hello {{1}}, thank you for coming to the {{2}} meeting! We hope to see you again soon.",
  appointment_review:
    "Hello {{1}}, following your meeting for {{2}}, we would love a short review of our service. Thank you!",
  lead_follow_up:
    "Hello {{1}}, we wanted to make sure you received our previous message. Would a short call work for you?",
  lead_follow_up_2:
    "Hello {{1}}, just checking again whether this is still relevant for you. We are here for any question!",
  new_client_welcome:
    "Hello {{1}}, welcome aboard! We are here if you need anything.",
  inactive_client:
    "Hello {{1}}, it has been a while since we last connected. We would love to schedule a meeting or help with anything you need.",
};

const DEFAULT_MAPPINGS: Record<string, WhatsAppVariableMapping[]> = {
  new_lead_welcome: [{ variable: "1", source: "lead", field: "name" }],
  new_lead_received_utility: [
    { variable: "1", source: "lead", field: "name" },
    { variable: "2", source: "lead", field: "phone" },
    { variable: "3", source: "lead", field: "source" },
  ],
  appointment_reminder: [
    { variable: "1", source: "appointment", field: "clientSnapshot.name" },
    { variable: "2", source: "system", field: "relativeTime" },
    { variable: "3", source: "appointment", field: "time" },
    { variable: "4", source: "appointment", field: "serviceName" },
  ],
  appointment_thanks: [
    { variable: "1", source: "appointment", field: "clientSnapshot.name" },
    { variable: "2", source: "appointment", field: "serviceName" },
  ],
  appointment_review: [
    { variable: "1", source: "appointment", field: "clientSnapshot.name" },
    { variable: "2", source: "appointment", field: "serviceName" },
  ],
  lead_follow_up: [{ variable: "1", source: "lead", field: "name" }],
  lead_follow_up_2: [{ variable: "1", source: "lead", field: "name" }],
  new_client_welcome: [{ variable: "1", source: "contact", field: "fullName" }],
  inactive_client: [{ variable: "1", source: "contact", field: "fullName" }],
};

function tpl(
  name: string,
  extra: Partial<ApprovedWhatsAppTemplate> = {}
): ApprovedWhatsAppTemplate {
  return {
    _id: name,
    name,
    key: name,
    category: "custom",
    language: "he",
    body: CATALOG_BODIES[name] || "",
    variables: ["1"],
    metaTemplateName: name,
    status: "active",
    ...extra,
  } as ApprovedWhatsAppTemplate;
}

describe("whatsApp action preview interpolation", () => {
  it("renders actual catalog copy for all visible WhatsApp templates", () => {
    for (const name of Object.keys(CATALOG_BODIES)) {
      const model = buildWhatsAppPreviewModel({
        template: tpl(name, {
          variables: DEFAULT_MAPPINGS[name].map((row) => row.variable),
        }),
        mappings: DEFAULT_MAPPINGS[name],
        hasSelection: true,
      });
      expect(model.state, name).toBe("ready");
      expect(model.body, name).toContain(WA_PREVIEW_SAMPLE_DATA.leadName);
      expect(model.body, name).not.toMatch(/\{\{\s*\d+\s*\}\}/);
      expect(model.body, name).not.toBe(name);
      const fragments = CATALOG_BODIES[name]
        .split(/\{\{\s*[a-zA-Z0-9_]+\s*\}\}/g)
        .map((part) => part.trim())
        .filter((part) => part.length >= 8);
      expect(fragments.length, name).toBeGreaterThan(0);
      expect(model.body, name).toContain(fragments[0]);
    }
  });

  it("updates live when a mapping is filled in", () => {
    const template = tpl("new_lead_welcome");
    const empty = interpolateWhatsAppPreviewText(
      template.body,
      [{ variable: "1", source: "", field: "" }],
      "new_lead_welcome"
    );
    expect(empty).toContain("[שם הליד]");
    expect(empty).not.toContain("{{1}}");
    const mapped = interpolateWhatsAppPreviewText(
      template.body,
      [{ variable: "1", source: "lead", field: "name" }],
      "new_lead_welcome"
    );
    expect(mapped).toContain(WA_PREVIEW_SAMPLE_DATA.leadName);
    expect(mapped).not.toContain("{{1}}");
    expect(mapped).not.toContain("[שם הליד]");
  });

  it("uses appointment date/time samples when mapped", () => {
    const model = buildWhatsAppPreviewModel({
      template: tpl("appointment_reminder", { variables: ["1", "2", "3", "4"] }),
      mappings: DEFAULT_MAPPINGS.appointment_reminder,
      hasSelection: true,
    });
    expect(model.body).toContain(WA_PREVIEW_SAMPLE_DATA.leadName);
    expect(model.body).toContain(WA_PREVIEW_SAMPLE_DATA.appointmentTime);
    expect(model.body).toContain("[זמן עד הפגישה]");
    expect(model.body).toContain("[שירות]");
  });

  it("keeps preview sample data out of returned mappings", () => {
    const mappings: WhatsAppVariableMapping[] = [
      { variable: "1", source: "lead", field: "name" },
    ];
    buildWhatsAppPreviewModel({
      template: tpl("new_lead_welcome"),
      mappings,
      hasSelection: true,
    });
    expect(JSON.stringify(mappings)).not.toContain(
      WA_PREVIEW_SAMPLE_DATA.leadName
    );
  });

  it("extracts buttons and media from Meta components", () => {
    const model = buildWhatsAppPreviewModel({
      template: tpl("new_lead_welcome", {
        body: "",
        components: [
          { type: "HEADER", format: "IMAGE" },
          { type: "BODY", text: "Hello {{1}}, tap below." },
          { type: "FOOTER", text: "BizUply" },
          {
            type: "BUTTONS",
            buttons: [
              { type: "URL", text: "לאתר", url: "https://bizuply.com" },
              { type: "QUICK_REPLY", text: "תודה" },
            ],
          },
        ],
      } as Partial<ApprovedWhatsAppTemplate>),
      mappings: DEFAULT_MAPPINGS.new_lead_welcome,
      hasSelection: true,
    });
    expect(model.headerType).toBe("image");
    expect(model.body).toContain(WA_PREVIEW_SAMPLE_DATA.leadName);
    expect(model.footer).toBe("BizUply");
    expect(model.buttons.map((b) => b.text)).toEqual(["לאתר", "תודה"]);
  });
});

describe("WhatsAppActionPreview", () => {
  it("shows empty state when no template is selected", () => {
    render(<WhatsAppActionPreview template={null} hasSelection={false} />);
    expect(screen.getByText("תצוגה מקדימה")).toBeTruthy();
    expect(screen.getByText(WA_PREVIEW_EMPTY_HE)).toBeTruthy();
  });

  it("shows error copy without throwing", () => {
    render(
      <WhatsAppActionPreview
        template={tpl("broken", { body: "", metaTemplateName: "broken" })}
        hasSelection
      />
    );
    expect(screen.getByText(WA_PREVIEW_ERROR_HE)).toBeTruthy();
  });

  it("renders a live new-lead bubble with RTL and no raw tokens", () => {
    const { container } = render(
      <WhatsAppActionPreview
        template={tpl("new_lead_welcome")}
        mappings={DEFAULT_MAPPINGS.new_lead_welcome}
        recipientType="lead_phone"
        senderLabel="מספר BizUply המנוהל"
        hasSelection
      />
    );
    const root = container.querySelector('[data-testid="wa-action-preview"]');
    expect(root?.getAttribute("dir")).toBe("rtl");
    expect(screen.getByText(/ישראל ישראלי/)).toBeTruthy();
    expect(screen.getByText(/טלפון הליד/)).toBeTruthy();
    expect(container.textContent).not.toContain("{{1}}");
    expect(container.querySelector(".af-wa-preview__button")).toBeNull();
  });

  it("renders appointment reminder preview with mapped time", () => {
    render(
      <WhatsAppActionPreview
        template={tpl("appointment_reminder", {
          variables: ["1", "2", "3", "4"],
        })}
        mappings={DEFAULT_MAPPINGS.appointment_reminder}
        recipientType="lead_phone"
        hasSelection
      />
    );
    expect(screen.getByText(/18:00/)).toBeTruthy();
    expect(screen.getByText(/ישראל ישראלי/)).toBeTruthy();
  });

  it("renders buttons as non-interactive preview chrome", () => {
    const { container } = render(
      <WhatsAppActionPreview
        template={tpl("new_lead_welcome", {
          headerType: "image",
          buttons: [{ type: "url", text: "פתח קישור", url: "https://x.test" }],
        })}
        mappings={DEFAULT_MAPPINGS.new_lead_welcome}
        hasSelection
      />
    );
    expect(screen.getByText("תמונה")).toBeTruthy();
    const btn = container.querySelector(".af-wa-preview__button");
    expect(btn?.textContent).toBe("פתח קישור");
    expect(btn?.getAttribute("role")).toBe("presentation");
    expect(container.querySelector("a")).toBeNull();
    expect(container.querySelector("button.af-wa-preview__button")).toBeNull();
  });
});
