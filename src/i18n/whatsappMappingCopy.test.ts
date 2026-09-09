import { beforeAll, describe, expect, it } from "vitest";
import i18n from "./i18n";
import {
  mappingFieldLabel,
  mappingFormatLabel,
  mappingFriendlyName,
  mappingSourceLabel,
  metaTemplateStatusLabel,
} from "./whatsappMappingCopy";

const HEBREW = /[\u0590-\u05FF]/;

describe("whatsappMappingCopy", () => {
  beforeAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("translates Meta template statuses instead of leftover Hebrew", async () => {
    const t = i18n.t.bind(i18n);
    await i18n.changeLanguage("en");
    expect(metaTemplateStatusLabel(t, "APPROVED", "GREEN")).toMatch(/active|high/i);
    expect(metaTemplateStatusLabel(t, "APPROVED", "GREEN")).not.toMatch(HEBREW);
    expect(metaTemplateStatusLabel(t, "PENDING")).toMatch(/review/i);
    expect(metaTemplateStatusLabel(t, "LIMIT_EXCEEDED")).toMatch(/paused|rate/i);
    await i18n.changeLanguage("es");
    expect(metaTemplateStatusLabel(t, "REJECTED")).not.toMatch(HEBREW);
    await i18n.changeLanguage("pt-BR");
    expect(metaTemplateStatusLabel(t, "PAUSED")).not.toMatch(HEBREW);
    await i18n.changeLanguage("ar");
    expect(metaTemplateStatusLabel(t, "PENDING")).not.toMatch(HEBREW);
    await i18n.changeLanguage("he");
    expect(metaTemplateStatusLabel(t, "PENDING")).toMatch(HEBREW);
  });

  it("translates mapping sources, fields, and formats by id", async () => {
    const t = i18n.t.bind(i18n);
    await i18n.changeLanguage("en");
    expect(mappingSourceLabel(t, "appointment", "פגישה")).toBe("Appointment");
    expect(mappingFieldLabel(t, "appointment", "date", "תאריך הפגישה")).toBe(
      "Appointment date",
    );
    expect(mappingFieldLabel(t, "contact", "firstName", "שם פרטי")).toBe(
      "First name",
    );
    expect(mappingFormatLabel(t, "dd/MM/yyyy", "יום/חודש/שנה")).toMatch(
      /day|month|year/i,
    );
    await i18n.changeLanguage("pt-BR");
    expect(mappingSourceLabel(t, "contact", "לקוח / איש קשר")).toMatch(/contato/i);
    expect(mappingFieldLabel(t, "business", "address.city", "עיר")).toMatch(
      /cidade/i,
    );
    await i18n.changeLanguage("ar");
    expect(mappingSourceLabel(t, "meta_lead", "ליד מ־Meta")).not.toMatch(HEBREW);
  });

  it("keeps custom friendly names and hides auto Hebrew labels on non-he dashboards", async () => {
    const t = i18n.t.bind(i18n);
    await i18n.changeLanguage("en");
    expect(
      mappingFriendlyName(t, {
        friendlyName: "שם פרטי",
        source: "contact",
        field: "firstName",
        apiFieldLabel: "שם פרטי",
      }),
    ).toBe("First name");
    expect(
      mappingFriendlyName(t, {
        friendlyName: "Pet nickname",
        source: "contact",
        field: "firstName",
      }),
    ).toBe("Pet nickname");
    expect(
      mappingFriendlyName(t, {
        friendlyName: "שם הכלב שלי",
        source: "contact",
        field: "firstName",
      }),
    ).toBe("שם הכלב שלי");
  });

  it("keeps user-created custom field labels", async () => {
    const t = i18n.t.bind(i18n);
    await i18n.changeLanguage("en");
    expect(
      mappingFieldLabel(t, "contact", "custom:dogName", "שם הכלב"),
    ).toBe("שם הכלב");
  });
});
