import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import JewelisPages, { jewelisPages } from "./pages";
import JewelisPreview from "./preview";
import JewelisThumbnail from "./thumbnail";
import { jewelisEditorCss } from "./editorCss";
import { jewelisSchema } from "./schema";
import { jewelisDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#A16207",
  secondary: "#050403",
  accent: "#E7C873",
  background: "#0C0A09",
  surface: "#292524",
  text: "#FAF7F0",
  muted: "#A8A29E",
  dark: "#050403",
};

export const jewelisSeed = {
  id: "jewelis",
  key: "jewelis",
  name: "Jewelis",
  title: "Jewelis",
  description: "חנות תכשיטים ושעונים מלאה: 8 עמודים, קטגוריות, סינונים, סל ומוצרים מתוסף החנות.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "jewelry-watches",
  layout: "full-store",
  image: (jewelisDefaultData as Record<string, any>).heroImage,
  heroTitle: (jewelisDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (jewelisDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "jewelis-header", title: "Header" },
    { type: "hero", variant: "jewelis-hero", title: "Hero" },
    { type: "categories", variant: "jewelis-categories", title: "Categories" },
    { type: "store", variant: "jewelis-products", title: "Products" },
    { type: "gallery", variant: "jewelis-lookbook", title: "Lookbook" },
    { type: "testimonials", variant: "jewelis-reviews", title: "Testimonials" },
    { type: "faq", variant: "jewelis-faq", title: "FAQ" },
    { type: "contact", variant: "jewelis-contact", title: "Contact" },
    { type: "footer", variant: "jewelis-footer", title: "Footer" },
  ].map((block, index) => ({ id: `jewelis-${index + 1}-${block.type}`, ...block })),
  pages: jewelisPages,
  editor: { pages: jewelisPages, css: jewelisEditorCss },
  css: jewelisEditorCss,
  data: jewelisDefaultData,
  defaultData: jewelisDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const jewelisTemplate = {
  id: "jewelis",
  key: "jewelis",
  name: "Jewelis",
  title: "Jewelis",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "חנות תכשיטים ושעונים מלאה עם 8 עמודים, סינונים ומוצרים מתוסף החנות.",
  thumbnail: React.createElement(JewelisThumbnail),
  preview: React.createElement(JewelisPreview),
  component: JewelisPages,
  Component: JewelisPages,
  seed: jewelisSeed,
  pages: jewelisPages,
  editorCss: jewelisEditorCss,
  schema: jewelisSchema,
  defaultData: jewelisDefaultData,
  renderer: {
    key: "jewelis",
    name: "Jewelis",
    Component: JewelisPages,
    component: JewelisPages,
    pages: jewelisPages,
    editorMode: "visual-react",
    editorCss: jewelisEditorCss,
    schema: jewelisSchema,
    defaultData: jewelisDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default jewelisTemplate;
