import { describe, expect, it } from "vitest";
import {
  buildWhatsAppTemplateSearchText,
  buildWhatsAppTemplateSecondaryLine,
  filterWhatsAppTemplatesByQuery,
  formatWhatsAppTemplateCategory,
  formatWhatsAppTemplateLanguage,
  formatWhatsAppVariableCountLabel,
  humanizeWhatsAppTemplateName,
  resolveWhatsAppTemplateDisplayName,
} from "./whatsAppTemplateSelectFormat";

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
    expect(formatWhatsAppTemplateCategory({ metaCategory: "AUTHENTICATION" })).toBe(
      "אימות"
    );
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

    expect(filterWhatsAppTemplatesByQuery(templates, "ליד חדש").map((t) => t._id)).toEqual([
      "1",
    ]);
    expect(
      filterWhatsAppTemplatesByQuery(templates, "new_lead_received").map((t) => t._id)
    ).toEqual(["1"]);
    expect(filterWhatsAppTemplatesByQuery(templates, "עברית").map((t) => t._id)).toEqual([
      "1",
    ]);
    expect(filterWhatsAppTemplatesByQuery(templates, "שירות").map((t) => t._id)).toEqual([
      "2",
    ]);
    expect(buildWhatsAppTemplateSearchText(templates[0])).toContain("new_lead_received");
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
});
