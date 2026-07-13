export const cycloraSchema = {
  brand: {
    type: "object",
    label: "Brand",
    fields: {
      name: { type: "text", label: "Brand name" },
      tagline: { type: "text", label: "Tagline" },
      email: { type: "text", label: "Email" },
      phone: { type: "text", label: "Phone" },
    },
  },
  hero: {
    type: "object",
    label: "Hero",
    fields: {
      marquee: { type: "text", label: "Scrolling headline (part 1)" },
      title: { type: "textarea", label: "Intro text" },
      accent: { type: "text", label: "Scrolling headline (accent)" },
      description: { type: "textarea", label: "Secondary description" },
      microcopy: { type: "textarea", label: "Supporting text" },
      primaryButton: { type: "text", label: "Primary button" },
      secondaryButton: { type: "text", label: "Secondary button" },
      scrollLabel: { type: "text", label: "Scroll label" },
      orbitMedia: {
        type: "array",
        label: "Floating media",
        itemLabel: "Media item",
        fields: {
          value: { type: "image", label: "Media" },
        },
      },
    },
  },
  strategyProof: {
    type: "object",
    label: "Strategy proof card",
    fields: {
      text: { type: "text", label: "Proof text" },
    },
  },
  strategies: {
    type: "array",
    label: "Solutions",
    itemLabel: "Solution",
    fields: {
      eyebrow: { type: "text", label: "Eyebrow" },
      title: { type: "text", label: "Title" },
      description: { type: "textarea", label: "Description" },
      metric: { type: "text", label: "Metric" },
    },
  },
  cases: {
    type: "array",
    label: "Case studies",
    itemLabel: "Project",
    fields: {
      eyebrow: { type: "text", label: "Eyebrow" },
      title: { type: "text", label: "Project name" },
      category: { type: "text", label: "Category" },
      year: { type: "text", label: "Year" },
      image: { type: "image", label: "Image or video" },
    },
  },
  testimonials: {
    type: "array",
    label: "Testimonials",
    itemLabel: "Testimonial",
    fields: {
      quote: { type: "textarea", label: "Quote" },
      name: { type: "text", label: "Name" },
      role: { type: "text", label: "Role" },
      avatar: { type: "image", label: "Avatar" },
      badge: { type: "text", label: "Badge" },
    },
  },
  plans: {
    type: "array",
    label: "Pricing plans",
    itemLabel: "Plan",
    fields: {
      name: { type: "text", label: "Name" },
      tag: { type: "text", label: "Tag" },
      price: { type: "text", label: "Price" },
      suffix: { type: "text", label: "Price suffix" },
      description: { type: "textarea", label: "Description" },
      button: { type: "text", label: "Button" },
      featured: { type: "boolean", label: "Featured" },
    },
  },
  faq: {
    type: "array",
    label: "FAQ",
    itemLabel: "Question",
    fields: {
      question: { type: "text", label: "Question" },
      answer: { type: "textarea", label: "Answer" },
    },
  },
  cta: {
    type: "object",
    label: "Call to action",
    fields: {
      eyebrow: { type: "text", label: "Eyebrow" },
      title: { type: "text", label: "Title" },
      accent: { type: "text", label: "Accent" },
      description: { type: "textarea", label: "Description" },
      button: { type: "text", label: "Button" },
    },
  },
};
