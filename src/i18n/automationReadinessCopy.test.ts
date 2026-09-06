import { beforeAll, describe, expect, it } from "vitest";
import i18n from "./i18n";
import { translateReadinessBlocker } from "./automationReadinessCopy";

const HEBREW = /[\u0590-\u05FF]/;

describe("translateReadinessBlocker", () => {
  beforeAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("translates known automation gallery blockers without leftover Hebrew", async () => {
    const t = i18n.t.bind(i18n);
    await i18n.changeLanguage("en");
    expect(
      translateReadinessBlocker(t, "חברו WhatsApp Business (Bizuply) כדי להפעיל"),
    ).not.toMatch(HEBREW);
    expect(
      translateReadinessBlocker(t, "האוטומציה עדיין לא זמינה להפעלה במערכת"),
    ).toMatch(/not available|cannot|enable/i);
    expect(
      translateReadinessBlocker(
        t,
        "חסרות תבניות WhatsApp מאושרות: lead_follow_up",
      ),
    ).toMatch(/lead_follow_up/);
    expect(
      translateReadinessBlocker(
        t,
        "חסרות תבניות WhatsApp מאושרות: lead_follow_up",
      ),
    ).not.toMatch(HEBREW);
    await i18n.changeLanguage("pt-BR");
    expect(
      translateReadinessBlocker(t, "בקרוב — עדיין לא זמין להפעלה"),
    ).not.toMatch(HEBREW);
    await i18n.changeLanguage("he");
    expect(
      translateReadinessBlocker(t, "לא ניתן להפעיל תבנית זו"),
    ).toMatch(HEBREW);
    await i18n.changeLanguage("es");
    expect(
      translateReadinessBlocker(t, "המתכון לא נמצא בשרת"),
    ).not.toMatch(HEBREW);
    expect(
      translateReadinessBlocker(t, "המתכון עדיין לא זמין להפעלה בחשבון הזה"),
    ).not.toMatch(HEBREW);
  });

  it("passes through already-translated blockers", async () => {
    const t = i18n.t.bind(i18n);
    await i18n.changeLanguage("en");
    expect(
      translateReadinessBlocker(
        t,
        "There is no matching approved WhatsApp template for this automation.",
      ),
    ).toMatch(/approved WhatsApp template/i);
  });
});
