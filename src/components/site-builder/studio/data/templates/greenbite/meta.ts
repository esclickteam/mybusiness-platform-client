import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import GreenbitePages, { greenbitePages } from "./pages";
import GreenbitePreview from "./preview";
import GreenbiteThumbnail from "./thumbnail";
import { greenbiteEditorCss } from "./editorCss";
import { greenbiteSchema } from "./schema";
import { greenbiteDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#15803D",
  secondary: "#052E16",
  accent: "#4ADE80",
  background: "#F7FBF4",
  surface: "#FFFFFF",
  text: "#14532D",
  muted: "#4D7C5C",
  dark: "#052E16",
};

export const greenbiteSeed = {
  id: "greenbite",
  key: "greenbite",
  name: "Greenbite",
  title: "Greenbite",
  description: "חנות מזון אורגני מלאה: 8 עמודים, קטגוריות, סינונים, סל ומוצרים מתוסף החנות.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "organic-grocery",
  layout: "full-store",
  image: (greenbiteDefaultData as Record<string, any>).heroImage,
  heroTitle: (greenbiteDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (greenbiteDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "greenbite-header", title: "Header" },
    { type: "hero", variant: "greenbite-hero", title: "Hero" },
    { type: "categories", variant: "greenbite-categories", title: "Categories" },
    { type: "store", variant: "greenbite-products", title: "Products" },
    { type: "gallery", variant: "greenbite-lookbook", title: "Lookbook" },
    { type: "testimonials", variant: "greenbite-reviews", title: "Testimonials" },
    { type: "faq", variant: "greenbite-faq", title: "FAQ" },
    { type: "contact", variant: "greenbite-contact", title: "Contact" },
    { type: "footer", variant: "greenbite-footer", title: "Footer" },
  ].map((block, index) => ({ id: `greenbite-${index + 1}-${block.type}`, ...block })),
  pages: greenbitePages,
  editor: { pages: greenbitePages, css: greenbiteEditorCss },
  css: greenbiteEditorCss,
  data: greenbiteDefaultData,
  defaultData: greenbiteDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const greenbiteTemplate = {
  id: "greenbite",
  key: "greenbite",
  name: "Greenbite",
  title: "Greenbite",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "חנות מזון אורגני מלאה עם 8 עמודים, סינונים ומוצרים מתוסף החנות.",
  thumbnail: React.createElement(GreenbiteThumbnail),
  preview: React.createElement(GreenbitePreview),
  component: GreenbitePages,
  Component: GreenbitePages,
  seed: greenbiteSeed,
  pages: greenbitePages,
  editorCss: greenbiteEditorCss,
  schema: greenbiteSchema,
  defaultData: greenbiteDefaultData,
  renderer: {
    key: "greenbite",
    name: "Greenbite",
    Component: GreenbitePages,
    component: GreenbitePages,
    pages: greenbitePages,
    editorMode: "visual-react",
    editorCss: greenbiteEditorCss,
    schema: greenbiteSchema,
    defaultData: greenbiteDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default greenbiteTemplate;
