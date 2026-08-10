import { describe, expect, it, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  SAVED_TEMPLATE_NOT_APPROVED_HE,
  TENANT_TEMPLATE_NOT_SENDABLE_HE,
  buildWhatsAppTemplateSearchText,
  buildWhatsAppTemplateSecondaryLine,
  canPersistAutomationTemplateSelection,
  filterWhatsAppTemplatesByQuery,
  formatWhatsAppTemplateCategory,
  formatWhatsAppTemplateLanguage,
  formatWhatsAppVariableCountLabel,
  humanizeWhatsAppTemplateName,
  isAutomationSendableTemplate,
  listAutomationPickerTemplates,
  resolveAutomationTemplateWarning,
  resolveWhatsAppTemplateDisplayName,
} from "./whatsAppTemplateSelectFormat";
import { WhatsAppAutomationTemplateSelect } from "./WhatsAppAutomationTemplateSelect";
import type { ApprovedWhatsAppTemplate } from "../../../../api/whatsappApi";

beforeAll(() => {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // Headless UI Combobox needs ResizeObserver in jsdom.
  (globalThis as { ResizeObserver?: unknown }).ResizeObserver =
    ResizeObserverStub;
});

const managedTpl = {
  _id: "m1",
  metaTemplateName: "order_confirmation",
  name: "אישור הזמנה",
  language: "he",
  languageLabelHe: "עברית",
  metaCategory: "UTILITY",
  categoryLabelHe: "שירות",
  variableCount: 2,
  automationSendable: true,
  catalogSource: "managed",
} as ApprovedWhatsAppTemplate;

const tenantOnlyTpl = {
  _id: "t1",
  metaTemplateName: "tenant_only_tpl",
  name: "תבנית עסקית",
  language: "he",
  languageLabelHe: "עברית",
  metaCategory: "UTILITY",
  categoryLabelHe: "שירות",
  variableCount: 1,
  automationSendable: false,
  catalogSource: "tenant",
} as ApprovedWhatsAppTemplate;

describe("whatsAppTemplateSelectFormat", () => {
  it("uses catalog friendly name when present", () => {
    expect(
      resolveWhatsAppTemplateDisplayName({
        metaTemplateName: "new_lead_received",
        name: "ליד חדש התקבל",
      })
    ).toBe("ליד חדש התקבל");
  });

  it("humanizes technical name without inventing Hebrew meaning", () => {
    expect(humanizeWhatsAppTemplateName("order_confirmation")).toBe(
      "Order Confirmation"
    );
    expect(
      resolveWhatsAppTemplateDisplayName({
        metaTemplateName: "new_lead_received",
        name: "new_lead_received",
      })
    ).toBe("New Lead Received");
  });

  it("keeps technical name visible in secondary line", () => {
    const line = buildWhatsAppTemplateSecondaryLine({
      metaTemplateName: "appointment_confirmation",
      language: "he",
      languageLabelHe: "עברית",
      metaCategory: "UTILITY",
      categoryLabelHe: "שירות",
      variableCount: 2,
    });
    expect(line).toContain("appointment_confirmation");
    expect(line).toContain("עברית");
    expect(line).toContain("שירות");
    expect(line).toContain("2 משתנים");
  });

  it("translates category and language", () => {
    expect(formatWhatsAppTemplateCategory({ metaCategory: "MARKETING" })).toBe(
      "שיווק"
    );
    expect(
      formatWhatsAppTemplateCategory({ metaCategory: "AUTHENTICATION" })
    ).toBe("אימות");
    expect(formatWhatsAppTemplateLanguage("he_IL")).toBe("עברית");
    expect(formatWhatsAppTemplateLanguage("en_US")).toBe("English");
  });

  it("formats variable counts and omits zero", () => {
    expect(formatWhatsAppVariableCountLabel(0)).toBe("");
    expect(formatWhatsAppVariableCountLabel(1)).toBe("1 משתנה");
    expect(formatWhatsAppVariableCountLabel(3)).toBe("3 משתנים");
  });

  it("searches by friendly name, technical name, language and category", () => {
    const templates = [
      {
        _id: "1",
        metaTemplateName: "new_lead_received",
        name: "ליד חדש התקבל",
        language: "he",
        languageLabelHe: "עברית",
        metaCategory: "MARKETING",
        categoryLabelHe: "שיווק",
        variableCount: 3,
      },
      {
        _id: "2",
        metaTemplateName: "hello_world",
        name: "Hello World",
        language: "en_US",
        languageLabelHe: "English",
        metaCategory: "UTILITY",
        categoryLabelHe: "שירות",
        variableCount: 0,
      },
    ];

    expect(
      filterWhatsAppTemplatesByQuery(templates, "ליד חדש").map((t) => t._id)
    ).toEqual(["1"]);
    expect(
      filterWhatsAppTemplatesByQuery(templates, "new_lead_received").map(
        (t) => t._id
      )
    ).toEqual(["1"]);
    expect(
      filterWhatsAppTemplatesByQuery(templates, "עברית").map((t) => t._id)
    ).toEqual(["1"]);
    expect(
      filterWhatsAppTemplatesByQuery(templates, "שירות").map((t) => t._id)
    ).toEqual(["2"]);
    expect(buildWhatsAppTemplateSearchText(templates[0])).toContain(
      "new_lead_received"
    );
  });

  it("does not hard-code selector dependency on fixed template names", () => {
    const source = [
      resolveWhatsAppTemplateDisplayName,
      filterWhatsAppTemplatesByQuery,
      buildWhatsAppTemplateSecondaryLine,
    ]
      .map((fn) => String(fn))
      .join("\n");
    expect(source.includes("hello_world")).toBe(false);
    expect(source.includes("new_lead_received")).toBe(false);
  });

  it("marks tenant approved but automationSendable=false as not newly selectable", () => {
    expect(isAutomationSendableTemplate(tenantOnlyTpl)).toBe(false);
    expect(canPersistAutomationTemplateSelection(tenantOnlyTpl)).toBe(false);
  });

  it("marks managed approved sendable template as selectable", () => {
    expect(isAutomationSendableTemplate(managedTpl)).toBe(true);
    expect(canPersistAutomationTemplateSelection(managedTpl)).toBe(true);
  });

  it("prioritizes sendable templates ahead of disabled tenant templates", () => {
    const ordered = listAutomationPickerTemplates([tenantOnlyTpl, managedTpl]);
    expect(ordered.map((t) => t._id)).toEqual(["m1", "t1"]);
  });

  it("keeps search visibility for disabled tenant templates", () => {
    const rows = listAutomationPickerTemplates([managedTpl, tenantOnlyTpl]);
    expect(
      filterWhatsAppTemplatesByQuery(rows, "tenant_only_tpl").map((t) => t._id)
    ).toEqual(["t1"]);
  });

  it("shows warning for existing saved unsendable template", () => {
    const warning = resolveAutomationTemplateWarning({
      value: "t1",
      selected: tenantOnlyTpl,
      templates: [managedTpl, tenantOnlyTpl],
      savedMeta: {
        templateId: "t1",
        metaTemplateName: "tenant_only_tpl",
      },
    });
    expect(warning.kind).toBe("tenant_not_sendable");
    expect(warning.message).toBe(TENANT_TEMPLATE_NOT_SENDABLE_HE);
  });

  it("shows not-approved warning when saved template is missing from list", () => {
    const warning = resolveAutomationTemplateWarning({
      value: "gone",
      selected: null,
      templates: [managedTpl],
      savedMeta: {
        templateId: "gone",
        metaTemplateName: "old_template",
      },
    });
    expect(warning.kind).toBe("not_approved");
    expect(warning.message).toBe(SAVED_TEMPLATE_NOT_APPROVED_HE);
  });
});

describe("WhatsAppAutomationTemplateSelect selection guards", () => {
  it("does not persist automationSendable=false selections", () => {
    const onChange = vi.fn();
    // Guard used by the combobox onChange path and AutomationFlowEditor.
    if (canPersistAutomationTemplateSelection(tenantOnlyTpl)) {
      onChange(tenantOnlyTpl);
    }
    if (canPersistAutomationTemplateSelection(managedTpl)) {
      onChange(managedTpl);
    }
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ _id: "m1", automationSendable: true })
    );
  });

  it("keeps existing saved unsendable template visible with warning", () => {
    render(
      <WhatsAppAutomationTemplateSelect
        templates={[managedTpl, tenantOnlyTpl]}
        value="t1"
        onChange={vi.fn()}
        savedMeta={{
          templateId: "t1",
          metaTemplateName: "tenant_only_tpl",
          displayName: "תבנית עסקית",
        }}
      />
    );

    expect(screen.getByText("תבנית עסקית")).toBeTruthy();
    expect(
      screen.getAllByText(TENANT_TEMPLATE_NOT_SENDABLE_HE).length
    ).toBeGreaterThan(0);
  });
});
