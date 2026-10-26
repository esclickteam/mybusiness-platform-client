import { describe, expect, it } from "vitest";
import he from "../../../../../i18n/locales/he.json";
import en from "../../../../../i18n/locales/en.json";
import {
  INSTANT_FORM_ADS_MANAGER_ORDER,
  INSTANT_FORM_CTA_VALUES,
  META_AD_CTA_VALUES,
  inspectCtaForContext,
  metaCtaLabel,
  metaCtaOptions,
  metaCtaOptionsForContext,
} from "./metaAdCtas";

function lookup(locale: Record<string, unknown>, key: string) {
  return key.split(".").reduce<unknown>(
    (acc, part) =>
      acc && typeof acc === "object"
        ? (acc as Record<string, unknown>)[part]
        : undefined,
    locale
  );
}

describe("metaAdCtas i18n", () => {
  it("renders every CTA in Hebrew without raw Meta enums", () => {
    const t = (key: string) => String(lookup(he, key) || "");
    const options = metaCtaOptions(t);
    expect(options).toHaveLength(META_AD_CTA_VALUES.length);
    expect(metaCtaLabel("LEARN_MORE", t)).toBe("מידע נוסף");
    expect(metaCtaLabel("SIGN_UP", t)).toBe("הרשמה");
    expect(metaCtaLabel("OPEN_LINK", t)).toBe("לפרטים");
    expect(metaCtaLabel("APPLY_NOW", t)).toBe("להגיש מועמדות");
    expect(metaCtaLabel("GET_QUOTE", t)).toBe("לקבלת הצעת מחיר");
    expect(metaCtaLabel("WHATSAPP_MESSAGE", t)).toBe("שלח WhatsApp");
    expect(options.map((item) => item.label).join(" ")).not.toMatch(
      /See details|Learn more|Sign up|OPEN_LINK|LEARN_MORE/
    );
  });

  it("shows Ads Manager Instant Form options and marks OPEN_LINK incompatible", () => {
    expect(INSTANT_FORM_CTA_VALUES).toContain("GET_OFFER");
    expect(INSTANT_FORM_CTA_VALUES).toContain("ORDER_NOW");
    expect(INSTANT_FORM_CTA_VALUES).toContain("CONTACT_US");
    expect(INSTANT_FORM_ADS_MANAGER_ORDER).toContain("OPEN_LINK");
    expect(inspectCtaForContext("OPEN_LINK", { usesInstantForms: true })).toEqual({
      current: "OPEN_LINK",
      compatible: false,
      suggested: "SIGN_UP",
    });
    expect(inspectCtaForContext("GET_QUOTE", { usesInstantForms: true }).compatible).toBe(
      true
    );
    const leadOptions = metaCtaOptionsForContext({ usesInstantForms: true });
    expect(leadOptions.find((item) => item.value === "OPEN_LINK")?.compatible).toBe(
      false
    );
    expect(leadOptions.find((item) => item.value === "GET_OFFER")?.compatible).toBe(
      true
    );
    expect(leadOptions.map((item) => item.value)).toContain("SIGN_UP");
  });

  it("keeps English labels in EN", () => {
    const t = (key: string) => String(lookup(en, key) || "");
    expect(metaCtaLabel("LEARN_MORE", t)).toBe("Learn more");
    expect(metaCtaLabel("BOOK_TRAVEL", t)).toBe("Book now");
    expect(metaCtaOptions(t).some((item) => item.label === "מידע נוסף")).toBe(false);
  });
});
