import type { StudioTemplateSchema } from "../templateEditorTypes";

export const novastraSchema = {
  sections: [
    {
      id: "brand",
      label: "Brand / Header",
      fields: [
        { key: "brandName", label: "Brand Name", type: "text" },
        { key: "announcement", label: "Announcement Bar", type: "text" },
        { key: "navShop", label: "Shop Link", type: "text" },
        { key: "navJournal", label: "Journal Link", type: "text" },
        { key: "navContact", label: "Contact Link", type: "text" },
      ],
    },
    {
      id: "hero",
      label: "Hero",
      fields: [
        { key: "heroEyebrow", label: "Hero Eyebrow", type: "text" },
        { key: "heroTitle", label: "Hero Title", type: "textarea" },
        { key: "heroText", label: "Hero Text", type: "textarea" },
        { key: "primaryCta", label: "Primary CTA", type: "text" },
        { key: "secondaryCta", label: "Secondary CTA", type: "text" },
        { key: "heroBadge", label: "Hero Badge", type: "text" },
        { key: "heroImages", label: "Hero Images", type: "image-list" },
      ],
    },
    {
      id: "collections",
      label: "Collections",
      fields: [
        { key: "categoryEyebrow", label: "Eyebrow", type: "text" },
        { key: "categoryTitle", label: "Title", type: "text" },
        { key: "categoryText", label: "Text", type: "textarea" },
        { key: "categories", label: "Collection Cards", type: "gallery" },
        { key: "promoCards", label: "Promo Cards", type: "gallery" },
      ],
    },
    {
      id: "products",
      label: "Products",
      fields: [
        { key: "productsEyebrow", label: "Eyebrow", type: "text" },
        { key: "productsTitle", label: "Title", type: "text" },
        { key: "productsText", label: "Text", type: "textarea" },
        { key: "products", label: "Products", type: "products" },
      ],
    },
    {
      id: "featured",
      label: "Featured Product",
      fields: [
        { key: "featuredEyebrow", label: "Eyebrow", type: "text" },
        { key: "featuredTitle", label: "Title", type: "text" },
        { key: "featuredImage", label: "Main Image", type: "image" },
        { key: "featuredProductName", label: "Product Name", type: "text" },
        { key: "featuredProductImage", label: "Product Image", type: "image" },
        { key: "featuredText", label: "Product Text", type: "textarea" },
      ],
    },
    {
      id: "social",
      label: "Community / Reviews",
      fields: [
        { key: "communityTitle", label: "Community Title", type: "textarea" },
        { key: "communityText", label: "Community Text", type: "textarea" },
        { key: "communityImage", label: "Community Image", type: "image" },
        { key: "reviewsTitle", label: "Reviews Title", type: "text" },
        { key: "reviews", label: "Reviews", type: "gallery" },
      ],
    },
    {
      id: "journal",
      label: "Journal",
      fields: [
        { key: "journalTitle", label: "Journal Title", type: "text" },
        { key: "journalText", label: "Journal Text", type: "textarea" },
        { key: "articles", label: "Articles", type: "gallery" },
      ],
    },
    {
      id: "faq",
      label: "FAQ / Newsletter",
      fields: [
        { key: "faqTitle", label: "FAQ Title", type: "text" },
        { key: "faqText", label: "FAQ Text", type: "textarea" },
        { key: "faqs", label: "FAQ Items", type: "gallery" },
        { key: "newsletterTitle", label: "Newsletter Title", type: "text" },
        { key: "newsletterText", label: "Newsletter Text", type: "textarea" },
        { key: "newsletterImage", label: "Newsletter Image", type: "image" },
      ],
    },
    {
      id: "contact",
      label: "Contact",
      fields: [
        { key: "contactTitle", label: "Contact Title", type: "text" },
        { key: "contactText", label: "Contact Text", type: "textarea" },
        { key: "contactEmail", label: "Email", type: "text" },
        { key: "contactPhone", label: "Phone", type: "text" },
        { key: "contactAddress", label: "Address", type: "textarea" },
      ],
    },
  ],
} as StudioTemplateSchema;