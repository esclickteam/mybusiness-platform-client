import type { StudioTemplateSchema } from "../templateEditorTypes";

export const aelineSchema: StudioTemplateSchema = {
  sections: [
    {
      id: "header",
      label: "Header",
      description: "Brand and navigation content.",
      fields: [
        {
          key: "brand.name",
          label: "Brand Name",
          type: "text",
        },
        {
          key: "brand.tagline",
          label: "Tagline",
          type: "text",
        },
      ],
    },

    {
      id: "hero",
      label: "Hero",
      description: "Main hero section.",
      fields: [
        {
          key: "hero.badge",
          label: "Badge",
          type: "text",
        },
        {
          key: "hero.title",
          label: "Title",
          type: "text",
        },
        {
          key: "hero.subtitle",
          label: "Subtitle",
          type: "textarea",
        },
        {
          key: "hero.primaryButton",
          label: "Primary Button",
          type: "text",
        },
        {
          key: "hero.secondaryButton",
          label: "Secondary Button",
          type: "text",
        },
        {
          key: "hero.image",
          label: "Hero Image",
          type: "image",
        },
      ],
    },

    {
      id: "services",
      label: "Services",
      description: "Services section text.",
      fields: [
        {
          key: "services.label",
          label: "Small Label",
          type: "text",
        },
        {
          key: "services.title",
          label: "Title",
          type: "text",
        },
        {
          key: "services.button",
          label: "Button",
          type: "text",
        },
      ],
    },

    {
      id: "expertise",
      label: "Expertise",
      description: "Expertise section content.",
      fields: [
        {
          key: "expertise.label",
          label: "Small Label",
          type: "text",
        },
        {
          key: "expertise.title",
          label: "Title",
          type: "text",
        },
        {
          key: "expertise.text",
          label: "Text",
          type: "textarea",
        },
        {
          key: "expertise.image",
          label: "Image",
          type: "image",
        },
      ],
    },

    {
      id: "pricing",
      label: "Pricing",
      description: "Pricing headline content.",
      fields: [
        {
          key: "pricing.label",
          label: "Small Label",
          type: "text",
        },
        {
          key: "pricing.title",
          label: "Title",
          type: "text",
        },
      ],
    },

    {
      id: "testimonials",
      label: "Testimonials",
      description: "Testimonials headline content.",
      fields: [
        {
          key: "testimonials.label",
          label: "Small Label",
          type: "text",
        },
        {
          key: "testimonials.title",
          label: "Title",
          type: "text",
        },
      ],
    },

    {
      id: "blog",
      label: "Blog",
      description: "Blog headline content.",
      fields: [
        {
          key: "blog.label",
          label: "Small Label",
          type: "text",
        },
        {
          key: "blog.title",
          label: "Title",
          type: "text",
        },
      ],
    },

    {
      id: "cta",
      label: "CTA",
      description: "Final call to action section.",
      fields: [
        {
          key: "cta.label",
          label: "Small Label",
          type: "text",
        },
        {
          key: "cta.title",
          label: "Title",
          type: "text",
        },
        {
          key: "cta.text",
          label: "Text",
          type: "textarea",
        },
        {
          key: "cta.button",
          label: "Button",
          type: "text",
        },
        {
          key: "cta.image",
          label: "Image",
          type: "image",
        },
      ],
    },

    {
      id: "contact",
      label: "Contact",
      description: "Contact page content.",
      fields: [
        {
          key: "contact.title",
          label: "Title",
          type: "text",
        },
        {
          key: "contact.text",
          label: "Text",
          type: "textarea",
        },
        {
          key: "contact.button",
          label: "Button",
          type: "text",
        },
      ],
    },

    {
      id: "footer",
      label: "Footer",
      description: "Footer content.",
      fields: [
        {
          key: "brand.name",
          label: "Brand Name",
          type: "text",
        },
        {
          key: "brand.tagline",
          label: "Footer Text",
          type: "textarea",
        },
      ],
    },
  ],
};