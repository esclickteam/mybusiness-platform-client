import { beforeAll, describe, expect, it } from "vitest";
import i18n from "./i18n";
import {
  localizePartnerDemoName,
  localizePartnerDemoText,
  partnerDemoProductLabel,
  partnerDemoTaskTitle,
} from "./partnerDemoCopy";

const HEBREW = /[\u0590-\u05FF]/;

describe("partnerDemoCopy", () => {
  beforeAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("localizes demo Hebrew names and tasks in English", async () => {
    await i18n.changeLanguage("en");
    const t = i18n.t.bind(i18n);
    expect(localizePartnerDemoName(t, "סטודיו נועה")).toBe("Noa Studio");
    expect(localizePartnerDemoName(t, "[Demo] סטודיו נועה")).toBe("[Demo] Noa Studio");
    expect(localizePartnerDemoName(t, "נועה לוי")).toBe("Noa Levi");
    expect(partnerDemoTaskTitle(t, { title: "שיחת הדרכה" })).toBe("Onboarding call");
    expect(
      partnerDemoTaskTitle(t, {
        titleKey: "partner.demo.task.renewalCheck",
        title: "בדיקת חידוש מנוי",
      }),
    ).toBe("Check subscription renewal");
    expect(localizePartnerDemoText(t, "נשלחה הצעת מחיר")).not.toMatch(HEBREW);
    expect(partnerDemoProductLabel(t, "מנוי Bizuply חודשי")).not.toMatch(HEBREW);
    expect(partnerDemoProductLabel(t, "אחוזים בלבד")).toMatch(/percent/i);
  });

  it("uses personaKey when present", async () => {
    await i18n.changeLanguage("es");
    const t = i18n.t.bind(i18n);
    expect(
      localizePartnerDemoName(t, "anything", {
        personaKey: "studio-noa",
        field: "businessName",
      }),
    ).toBe("Estudio Noa");
  });

  it("keeps unknown user content unchanged", async () => {
    await i18n.changeLanguage("en");
    const t = i18n.t.bind(i18n);
    expect(localizePartnerDemoText(t, "My real client note")).toBe("My real client note");
  });

  it("keeps Hebrew when UI language is Hebrew", async () => {
    await i18n.changeLanguage("he");
    const t = i18n.t.bind(i18n);
    expect(localizePartnerDemoName(t, "סטודיו נועה")).toMatch(HEBREW);
    expect(partnerDemoTaskTitle(t, { title: "שיחת הדרכה" })).toBe("שיחת הדרכה");
  });

  it("localizes showcase free partner name for all locales", async () => {
    const expected: Record<string, string> = {
      he: "פרטנר דמו חינמי",
      en: "Free Demo Partner",
      ar: "شريك تجريبي مجاني",
      es: "Socio demo gratuito",
      "pt-BR": "Parceiro demo gratuito",
    };
    for (const [lang, label] of Object.entries(expected)) {
      await i18n.changeLanguage(lang);
      const t = i18n.t.bind(i18n);
      expect(localizePartnerDemoName(t, "פרטנר דמו חינמי")).toBe(label);
    }
  });

  it("localizes demo content for ar and pt-BR without Hebrew mix", async () => {
    for (const lang of ["ar", "pt-BR"] as const) {
      await i18n.changeLanguage(lang);
      const t = i18n.t.bind(i18n);
      expect(localizePartnerDemoName(t, "סטודיו נועה")).not.toMatch(HEBREW);
      expect(partnerDemoTaskTitle(t, { title: "שיחת הדרכה" })).not.toMatch(HEBREW);
      expect(partnerDemoProductLabel(t, "אחוזים בלבד")).not.toMatch(HEBREW);
    }
  });
});
