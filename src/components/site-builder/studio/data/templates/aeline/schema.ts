import type { StudioTemplateSchema } from "../templateEditorTypes";

export const aelineSchema: StudioTemplateSchema = {
  sections: [
    {
      id: "header",
      label: "כותרת עליונה",
      description: "תוכן המותג והניווט.",
      fields: [
        {
          key: "brand.name",
          label: "שם המותג",
          type: "text",
        },
        {
          key: "brand.tagline",
          label: "סלוגן",
          type: "text",
        },
      ],
    },

    {
      id: "hero",
      label: "הירו",
      description: "סקשן ההירו הראשי.",
      fields: [
        {
          key: "hero.badge",
          label: "תגית",
          type: "text",
        },
        {
          key: "hero.title",
          label: "כותרת",
          type: "text",
        },
        {
          key: "hero.subtitle",
          label: "כותרת משנה",
          type: "textarea",
        },
        {
          key: "hero.primaryButton",
          label: "כפתור ראשי",
          type: "text",
        },
        {
          key: "hero.secondaryButton",
          label: "כפתור משני",
          type: "text",
        },
        {
          key: "hero.image",
          label: "תמונת הירו",
          type: "image",
        },
      ],
    },

    {
      id: "services",
      label: "שירותים",
      description: "טקסט סקשן השירותים.",
      fields: [
        {
          key: "services.label",
          label: "תווית קטנה",
          type: "text",
        },
        {
          key: "services.title",
          label: "כותרת",
          type: "text",
        },
        {
          key: "services.button",
          label: "כפתור",
          type: "text",
        },
      ],
    },

    {
      id: "expertise",
      label: "מומחיות",
      description: "תוכן סקשן המומחיות.",
      fields: [
        {
          key: "expertise.label",
          label: "תווית קטנה",
          type: "text",
        },
        {
          key: "expertise.title",
          label: "כותרת",
          type: "text",
        },
        {
          key: "expertise.text",
          label: "טקסט",
          type: "textarea",
        },
        {
          key: "expertise.image",
          label: "תמונה",
          type: "image",
        },
      ],
    },

    {
      id: "pricing",
      label: "מחירים",
      description: "כותרות סקשן המחירים.",
      fields: [
        {
          key: "pricing.label",
          label: "תווית קטנה",
          type: "text",
        },
        {
          key: "pricing.title",
          label: "כותרת",
          type: "text",
        },
      ],
    },

    {
      id: "testimonials",
      label: "המלצות",
      description: "כותרות סקשן ההמלצות.",
      fields: [
        {
          key: "testimonials.label",
          label: "תווית קטנה",
          type: "text",
        },
        {
          key: "testimonials.title",
          label: "כותרת",
          type: "text",
        },
      ],
    },

    {
      id: "blog",
      label: "בלוג",
      description: "כותרות סקשן הבלוג.",
      fields: [
        {
          key: "blog.label",
          label: "תווית קטנה",
          type: "text",
        },
        {
          key: "blog.title",
          label: "כותרת",
          type: "text",
        },
      ],
    },

    {
      id: "cta",
      label: "קריאה לפעולה",
      description: "סקשן הקריאה לפעולה בסיום.",
      fields: [
        {
          key: "cta.label",
          label: "תווית קטנה",
          type: "text",
        },
        {
          key: "cta.title",
          label: "כותרת",
          type: "text",
        },
        {
          key: "cta.text",
          label: "טקסט",
          type: "textarea",
        },
        {
          key: "cta.button",
          label: "כפתור",
          type: "text",
        },
        {
          key: "cta.image",
          label: "תמונה",
          type: "image",
        },
      ],
    },

    {
      id: "contact",
      label: "צור קשר",
      description: "תוכן עמוד יצירת הקשר.",
      fields: [
        {
          key: "contact.title",
          label: "כותרת",
          type: "text",
        },
        {
          key: "contact.text",
          label: "טקסט",
          type: "textarea",
        },
        {
          key: "contact.button",
          label: "כפתור",
          type: "text",
        },
      ],
    },

    {
      id: "footer",
      label: "פוטר",
      description: "תוכן הפוטר.",
      fields: [
        {
          key: "brand.name",
          label: "שם המותג",
          type: "text",
        },
        {
          key: "brand.tagline",
          label: "טקסט פוטר",
          type: "textarea",
        },
      ],
    },
  ],
};
