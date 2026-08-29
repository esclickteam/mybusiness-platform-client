import { describe, expect, it } from "vitest";
import he from "../../../../../i18n/locales/he.json";
import en from "../../../../../i18n/locales/en.json";
import { META_AD_CTA_VALUES, metaCtaLabel, metaCtaOptions } from "./metaAdCtas";

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
    expect(metaCtaLabel("SIGN_UP", t)).toBe("להרשמה");
    expect(metaCtaLabel("WHATSAPP_MESSAGE", t)).toBe("שלח WhatsApp");
    expect(options.map((item) => item.label).join(" ")).not.toMatch(
      /See details|Learn more|Sign up|OPEN_LINK|LEARN_MORE/
    );
  });

  it("keeps English labels in EN", () => {
    const t = (key: string) => String(lookup(en, key) || "");
    expect(metaCtaLabel("LEARN_MORE", t)).toBe("Learn more");
    expect(metaCtaLabel("BOOK_TRAVEL", t)).toBe("Book now");
    expect(metaCtaOptions(t).some((item) => item.label === "מידע נוסף")).toBe(false);
  });
});
