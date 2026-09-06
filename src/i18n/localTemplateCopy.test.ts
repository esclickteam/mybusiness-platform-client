import { describe, expect, it } from "vitest";
import i18n from "./i18n";
import { localTemplateCopy } from "./localTemplateCopy";

const template = {
  key: "local_appointment_reminder_1_day",
  name: "תזכורת פגישה — יום לפני",
  description: "טריגר: פגישה קרובה יום לפני. תוצאה: הודעת תזכורת WhatsApp.",
  triggerLabel: "פגישה קרובה (יום לפני)",
  resultLabels: ["הודעת תזכורת WhatsApp"],
};

describe("localTemplateCopy", () => {
  it("uses catalog keys and keeps Hebrew defaults", () => {
    const copy = localTemplateCopy((key, options) => {
      if (key.endsWith(".name")) return "Appointment reminder — 1 day before";
      return options?.defaultValue || key;
    }, template);
    expect(copy.name).toBe("Appointment reminder — 1 day before");
    expect(copy.triggerLabel).toBe("פגישה קרובה (יום לפני)");
    expect(copy.resultLabels).toEqual(["הודעת תזכורת WhatsApp"]);
  });

  it("reads real catalogs in en/es/pt-BR/ar without leftover Hebrew", async () => {
    for (const lang of ["en", "es", "pt-BR", "ar"] as const) {
      await i18n.changeLanguage(lang);
      const copy = localTemplateCopy(
        (key, options) => i18n.t(key, options as { defaultValue?: string }),
        template,
      );
      expect(copy.name).not.toMatch(/[\u0590-\u05FF]/);
      expect(copy.description).not.toMatch(/[\u0590-\u05FF]/);
      expect(copy.triggerLabel).not.toMatch(/[\u0590-\u05FF]/);
      expect(copy.resultLabels.join(" ")).not.toMatch(/[\u0590-\u05FF]/);
    }
    await i18n.changeLanguage("he");
    const he = localTemplateCopy(
      (key, options) => i18n.t(key, options as { defaultValue?: string }),
      template,
    );
    expect(he.name).toBe(template.name);
  });
});
