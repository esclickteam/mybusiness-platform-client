import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import SportifyaPages, { sportifyaPages } from "./pages";
import SportifyaPreview from "./preview";
import SportifyaThumbnail from "./thumbnail";
import { sportifyaEditorCss } from "./editorCss";
import { sportifyaSchema } from "./schema";
import { sportifyaDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#EF4444",
  secondary: "#050507",
  accent: "#FCA5A5",
  background: "#0B0B0F",
  surface: "#1C1C26",
  text: "#F5F5F7",
  muted: "#A1A1AA",
  dark: "#050507",
};

export const sportifyaSeed = {
  id: "sportifya",
  key: "sportifya",
  name: "Sportifya",
  title: "Sportifya",
  description: "חנות ספורט וכושר מלאה: 8 עמודים, קטגוריות, סינונים, סל ומוצרים מתוסף החנות.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "sports-fitness",
  layout: "full-store",
  image: (sportifyaDefaultData as Record<string, any>).heroImage,
  heroTitle: (sportifyaDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (sportifyaDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "sportifya-header", title: "Header" },
    { type: "hero", variant: "sportifya-hero", title: "Hero" },
    { type: "categories", variant: "sportifya-categories", title: "Categories" },
    { type: "store", variant: "sportifya-products", title: "Products" },
    { type: "gallery", variant: "sportifya-lookbook", title: "Lookbook" },
    { type: "testimonials", variant: "sportifya-reviews", title: "Testimonials" },
    { type: "faq", variant: "sportifya-faq", title: "FAQ" },
    { type: "contact", variant: "sportifya-contact", title: "Contact" },
    { type: "footer", variant: "sportifya-footer", title: "Footer" },
  ].map((block, index) => ({ id: `sportifya-${index + 1}-${block.type}`, ...block })),
  pages: sportifyaPages,
  editor: { pages: sportifyaPages, css: sportifyaEditorCss },
  css: sportifyaEditorCss,
  data: sportifyaDefaultData,
  defaultData: sportifyaDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const sportifyaTemplate = {
  id: "sportifya",
  key: "sportifya",
  name: "Sportifya",
  title: "Sportifya",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "חנות ספורט וכושר מלאה עם 8 עמודים, סינונים ומוצרים מתוסף החנות.",
  thumbnail: React.createElement(SportifyaThumbnail),
  preview: React.createElement(SportifyaPreview),
  component: SportifyaPages,
  Component: SportifyaPages,
  seed: sportifyaSeed,
  pages: sportifyaPages,
  editorCss: sportifyaEditorCss,
  schema: sportifyaSchema,
  defaultData: sportifyaDefaultData,
  renderer: {
    key: "sportifya",
    name: "Sportifya",
    Component: SportifyaPages,
    component: SportifyaPages,
    pages: sportifyaPages,
    editorMode: "visual-react",
    editorCss: sportifyaEditorCss,
    schema: sportifyaSchema,
    defaultData: sportifyaDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default sportifyaTemplate;
