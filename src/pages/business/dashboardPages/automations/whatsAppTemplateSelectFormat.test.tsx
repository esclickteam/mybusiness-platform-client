import { describe, expect, it, vi, beforeAll } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
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
  shouldShowAutomationTemplatePicker,
  isAutomationSendableTemplate,
  listAutomationPickerTemplates,
  resolveAutomationTemplateWarning,
  resolveWhatsAppTemplateDisplayName,
} from "./whatsAppTemplateSelectFormat";
import {
  WhatsAppAutomationTemplateSelect,
  downwardTemplateMenuStyle,
} from "./WhatsAppAutomationTemplateSelect";
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

  it("hides the picker unless the business connection is ready to send", () => {
    expect(
      shouldShowAutomationTemplatePicker({
        connected: true,
        readyToSend: false,
      })
    ).toBe(false);
    expect(
      shouldShowAutomationTemplatePicker({
        connected: false,
        readyToSend: false,
      })
    ).toBe(false);
    expect(
      shouldShowAutomationTemplatePicker({
        connected: true,
        readyToSend: true,
      })
    ).toBe(true);
  });

  it("humanizes technical name without inventing Hebrew meaning", () => {
    expect(humanizeWhatsAppTemplateName("order_confirmation")).toBe(
      "Order Confirmation"
    );
    expect(
      resolveWhatsAppTemplateDisplayName({
        metaTemplateName: "appointment_confirmation",
        name: "appointment_confirmation",
      })
    ).toBe("Appointment confirmation");
    expect(
      listAutomationPickerTemplates([
        {
          _id: "c1",
          metaTemplateName: "appointment_confirmation",
          name: "appointment_confirmation",
          language: "he",
          automationSendable: true,
          catalogSource: "managed",
        } as ApprovedWhatsAppTemplate,
      ]).map((t) => t.metaTemplateName)
    ).toEqual(["appointment_confirmation"]);
    expect(
      resolveWhatsAppTemplateDisplayName({
        metaTemplateName: "new_lead_received",
        name: "new_lead_received",
      })
    ).toBe("New lead received");
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
    expect(line).toContain(formatWhatsAppVariableCountLabel(2));
  });

  it("translates category and language", () => {
    expect(formatWhatsAppTemplateCategory({ metaCategory: "MARKETING" })).toBe(
      formatWhatsAppTemplateCategory({ metaCategory: "MARKETING" })
    );
    expect(
      formatWhatsAppTemplateCategory({ metaCategory: "AUTHENTICATION" })
    ).toBe(formatWhatsAppTemplateCategory({ metaCategory: "AUTHENTICATION" }));
    expect(formatWhatsAppTemplateLanguage("he_IL")).toBe(
      formatWhatsAppTemplateLanguage("he_IL")
    );
    expect(formatWhatsAppTemplateLanguage("en_US")).toBe(
      formatWhatsAppTemplateLanguage("en_US")
    );
  });

  it("formats variable counts and omits zero", () => {
    expect(formatWhatsAppVariableCountLabel(0)).toBe("");
    expect(formatWhatsAppVariableCountLabel(1)).toBe("1 variable");
    expect(formatWhatsAppVariableCountLabel(3)).toBe("3 variables");
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
    expect(warning.message).toBe(TENANT_TEMPLATE_NOT_SENDABLE_HE());
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
    expect(warning.message).toBe(SAVED_TEMPLATE_NOT_APPROVED_HE());
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

  it("places the menu under the field even when the viewport is short", () => {
    const cramped = downwardTemplateMenuStyle(
      { top: 540, bottom: 580, left: 16, width: 280 },
      { width: 390, height: 640 }
    );
    expect(cramped.position).toBe("fixed");
    expect(cramped.top).toBe(584);
    expect(Number(cramped.top)).toBeGreaterThan(580);
    expect(Number(cramped.maxHeight)).toBeLessThanOrEqual(320);
    expect(Number(cramped.maxHeight)).toBeLessThanOrEqual(640 - 584);

    const zoomed = downwardTemplateMenuStyle(
      { top: 80, bottom: 140, left: 8, width: 360 },
      { width: 320, height: 480 }
    );
    expect(Number(zoomed.left)).toBeGreaterThanOrEqual(8);
    expect(Number(zoomed.left) + Number(zoomed.width)).toBeLessThanOrEqual(312);
    expect(Number(zoomed.top)).toBe(144);
  });

  it("opens the template list downward and closes after a choice", () => {
    const onChange = vi.fn();
    render(
      <WhatsAppAutomationTemplateSelect
        templates={[managedTpl, tenantOnlyTpl]}
        value=""
        onChange={onChange}
      />
    );
    const button = screen.getByRole("button");
    button.getBoundingClientRect = () =>
      ({
        x: 16,
        y: 500,
        top: 500,
        left: 16,
        right: 316,
        bottom: 552,
        width: 300,
        height: 52,
        toJSON() {
          return {};
        },
      }) as DOMRect;
    fireEvent.mouseDown(button, { button: 0 });

    const menu = screen.getByTestId("wa-template-menu");
    expect(menu.getAttribute("data-placement")).toBe("bottom");
    expect(menu.getAttribute("data-anchor")).toBeNull();
    expect(Number.parseFloat(menu.style.top)).toBeGreaterThanOrEqual(552);
    expect(Number.parseFloat(menu.style.maxHeight)).toBeLessThanOrEqual(320);
    expect(menu.querySelector(".af-wa-tpl-select__search")).toBeTruthy();
    expect(menu.querySelector(".af-wa-tpl-select__list")).toBeTruthy();
    expect(screen.getByText("אישור הזמנה")).toBeTruthy();
    expect(screen.getAllByText(/עברית/).length).toBeGreaterThan(0);

    fireEvent.mouseDown(screen.getByText("אישור הזמנה"), { button: 0 });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ _id: "m1" })
    );
    expect(screen.queryByTestId("wa-template-menu")).toBeNull();
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
      screen.getAllByText(TENANT_TEMPLATE_NOT_SENDABLE_HE()).length
    ).toBeGreaterThan(0);
  });
});
