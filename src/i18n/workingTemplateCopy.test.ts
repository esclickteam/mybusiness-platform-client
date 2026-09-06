import { describe, expect, it } from "vitest";
import i18n from "./i18n";
import {
  workingTemplateCopy,
  workingTemplateSearchHaystack,
} from "./workingTemplateCopy";

const template = {
  key: "wa_new_lead_welcome",
  name: "ליד חדש → WhatsApp פתיחה בלבד",
  description: "הודעת פתיחה מיידית בלבד.",
  triggerLabel: "ליד חדש ב-CRM",
  resultLabels: ["הודעת פתיחה WhatsApp"],
  keywords: ["welcome"],
};

describe("workingTemplateCopy", () => {
  it("uses catalog keys and keeps Hebrew defaults", () => {
    const copy = workingTemplateCopy((key, options) => {
      if (key.endsWith(".name")) return "New lead → WhatsApp opening only";
      return options?.defaultValue || key;
    }, template);
    expect(copy.name).toBe("New lead → WhatsApp opening only");
    expect(copy.triggerLabel).toBe("ליד חדש ב-CRM");
    expect(copy.resultLabels).toEqual(["הודעת פתיחה WhatsApp"]);
  });

  it("includes translated and source copy in search haystack", () => {
    const hay = workingTemplateSearchHaystack((key, options) => {
      if (key.endsWith(".name")) return "New lead opening";
      return options?.defaultValue || key;
    }, template);
    expect(hay).toMatch(/New lead opening/);
    expect(hay).toMatch(/ליד חדש/);
    expect(hay).toMatch(/welcome/);
  });

  it("reads real catalogs in en/es/pt-BR/ar without leftover Hebrew", async () => {
    for (const lang of ["en", "es", "pt-BR", "ar"] as const) {
      await i18n.changeLanguage(lang);
      const copy = workingTemplateCopy(
        (key, options) => i18n.t(key, options as { defaultValue?: string }),
        template,
      );
      expect(copy.name).not.toMatch(/[\u0590-\u05FF]/);
      expect(copy.description).not.toMatch(/[\u0590-\u05FF]/);
      expect(copy.triggerLabel).not.toMatch(/[\u0590-\u05FF]/);
      expect(copy.resultLabels.join(" ")).not.toMatch(/[\u0590-\u05FF]/);
    }
    await i18n.changeLanguage("he");
    const he = workingTemplateCopy(
      (key, options) => i18n.t(key, options as { defaultValue?: string }),
      template,
    );
    expect(he.name).toBe(template.name);
  });
});
