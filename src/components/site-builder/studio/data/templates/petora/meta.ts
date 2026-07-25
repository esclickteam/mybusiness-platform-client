import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import PetoraPages, { petoraPages } from "./pages";
import PetoraPreview from "./preview";
import PetoraThumbnail from "./thumbnail";
import { petoraEditorCss } from "./editorCss";
import { petoraSchema } from "./schema";
import { petoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#EA580C",
  secondary: "#1C1917",
  accent: "#FB923C",
  background: "#FFF8F1",
  surface: "#FFFFFF",
  text: "#431407",
  muted: "#9A3412",
  dark: "#1C1917",
};

export const petoraSeed = {
  id: "petora",
  key: "petora",
  name: "Petora",
  title: "Petora",
  description: "חנות ציוד לחיות מחמד מלאה: 8 עמודים, קטגוריות, סינונים, סל ומוצרים מתוסף החנות.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "pet-supplies",
  layout: "full-store",
  image: (petoraDefaultData as Record<string, any>).heroImage,
  heroTitle: (petoraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (petoraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "petora-header", title: "Header" },
    { type: "hero", variant: "petora-hero", title: "Hero" },
    { type: "categories", variant: "petora-categories", title: "Categories" },
    { type: "store", variant: "petora-products", title: "Products" },
    { type: "gallery", variant: "petora-lookbook", title: "Lookbook" },
    { type: "testimonials", variant: "petora-reviews", title: "Testimonials" },
    { type: "faq", variant: "petora-faq", title: "FAQ" },
    { type: "contact", variant: "petora-contact", title: "Contact" },
    { type: "footer", variant: "petora-footer", title: "Footer" },
  ].map((block, index) => ({ id: `petora-${index + 1}-${block.type}`, ...block })),
  pages: petoraPages,
  editor: { pages: petoraPages, css: petoraEditorCss },
  css: petoraEditorCss,
  data: petoraDefaultData,
  defaultData: petoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const petoraTemplate = {
  id: "petora",
  key: "petora",
  name: "Petora",
  title: "Petora",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "חנות ציוד לחיות מחמד מלאה עם 8 עמודים, סינונים ומוצרים מתוסף החנות.",
  thumbnail: React.createElement(PetoraThumbnail),
  preview: React.createElement(PetoraPreview),
  component: PetoraPages,
  Component: PetoraPages,
  seed: petoraSeed,
  pages: petoraPages,
  editorCss: petoraEditorCss,
  schema: petoraSchema,
  defaultData: petoraDefaultData,
  renderer: {
    key: "petora",
    name: "Petora",
    Component: PetoraPages,
    component: PetoraPages,
    pages: petoraPages,
    editorMode: "visual-react",
    editorCss: petoraEditorCss,
    schema: petoraSchema,
    defaultData: petoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default petoraTemplate;
