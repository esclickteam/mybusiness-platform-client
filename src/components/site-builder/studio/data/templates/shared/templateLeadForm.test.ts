import { describe, expect, it } from "vitest";
import {
  isGenericDefaultFormConfig,
  resolveTemplateLeadForm,
} from "./templateLeadForm";

describe("templateLeadForm", () => {
  it("detects generic form-builder defaults", () => {
    expect(
      isGenericDefaultFormConfig({
        id: "contact-form",
        title: "טופס יצירת קשר",
        submitText: "שליחת הודעה",
        successMessage: "ok",
        fields: [
          { id: "name", label: "שם", type: "text" },
          { id: "phone", label: "טלפון", type: "phone" },
          { id: "message", label: "הודעה", type: "textarea" },
        ],
      }),
    ).toBe(true);
  });

  it("keeps template-skinned configs", () => {
    expect(
      isGenericDefaultFormConfig({
        id: "serenova-contact-2",
        title: "טופס יצירת קשר",
        submitText: "שליחת הודעה",
        successMessage: "ok",
        preserveTemplateSkin: true,
        fields: [
          { id: "name", label: "שם", type: "text" },
          { id: "phone", label: "טלפון", type: "phone" },
          { id: "message", label: "הודעה", type: "textarea" },
        ],
      }),
    ).toBe(false);
  });

  it("falls back to template fields when generic default is saved", () => {
    const fallback = {
      fields: [
        { id: "name", label: "שם מלא", type: "text" as const },
        { id: "phone", label: "טלפון", type: "phone" as const },
        { id: "email", label: "אימייל", type: "email" as const },
        { id: "other", label: "הודעה", type: "textarea" as const },
      ],
      submitText: "שליחת פרטים",
      title: "",
      successMessage: "thanks",
    };

    const resolved = resolveTemplateLeadForm(
      {
        __formBuilderByElement: {
          "serenova-contact-2": {
            id: "serenova-contact-2",
            title: "טופס יצירת קשר",
            submitText: "שליחת הודעה",
            successMessage: "x",
            fields: [
              { id: "name", label: "שם", type: "text" },
              { id: "phone", label: "טלפון", type: "phone" },
              { id: "message", label: "הודעה", type: "textarea" },
            ],
          },
        },
      },
      "serenova-contact-2",
      fallback,
    );

    expect(resolved.submitText).toBe("שליחת פרטים");
    expect(resolved.fields.map((f) => f.id)).toEqual([
      "name",
      "phone",
      "email",
      "other",
    ]);
  });
});
