import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import BabynestPages, { babynestPages } from "./pages";
import BabynestPreview from "./preview";
import BabynestThumbnail from "./thumbnail";
import { babynestEditorCss } from "./editorCss";
import { babynestSchema } from "./schema";
import { babynestDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#F472B6",
  secondary: "#2A1024",
  accent: "#FBCFE8",
  background: "#FFF7FB",
  surface: "#FFFFFF",
  text: "#4A1942",
  muted: "#9D6B8A",
  dark: "#2A1024",
};

export const babynestSeed = {
  id: "babynest",
  key: "babynest",
  name: "Babynest",
  title: "Babynest",
  description: "חנות תינוקות וילדים מלאה: 8 עמודים, קטגוריות, סינונים, סל ומוצרים מתוסף החנות.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "baby-kids",
  layout: "full-store",
  image: (babynestDefaultData as Record<string, any>).heroImage,
  heroTitle: (babynestDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (babynestDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "babynest-header", title: "Header" },
    { type: "hero", variant: "babynest-hero", title: "Hero" },
    { type: "categories", variant: "babynest-categories", title: "Categories" },
    { type: "store", variant: "babynest-products", title: "Products" },
    { type: "gallery", variant: "babynest-lookbook", title: "Lookbook" },
    { type: "testimonials", variant: "babynest-reviews", title: "Testimonials" },
    { type: "faq", variant: "babynest-faq", title: "FAQ" },
    { type: "contact", variant: "babynest-contact", title: "Contact" },
    { type: "footer", variant: "babynest-footer", title: "Footer" },
  ].map((block, index) => ({ id: `babynest-${index + 1}-${block.type}`, ...block })),
  pages: babynestPages,
  editor: { pages: babynestPages, css: babynestEditorCss },
  css: babynestEditorCss,
  data: babynestDefaultData,
  defaultData: babynestDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const babynestTemplate = {
  id: "babynest",
  key: "babynest",
  name: "Babynest",
  title: "Babynest",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "חנות תינוקות וילדים מלאה עם 8 עמודים, סינונים ומוצרים מתוסף החנות.",
  thumbnail: React.createElement(BabynestThumbnail),
  preview: React.createElement(BabynestPreview),
  component: BabynestPages,
  Component: BabynestPages,
  seed: babynestSeed,
  pages: babynestPages,
  editorCss: babynestEditorCss,
  schema: babynestSchema,
  defaultData: babynestDefaultData,
  renderer: {
    key: "babynest",
    name: "Babynest",
    Component: BabynestPages,
    component: BabynestPages,
    pages: babynestPages,
    editorMode: "visual-react",
    editorCss: babynestEditorCss,
    schema: babynestSchema,
    defaultData: babynestDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default babynestTemplate;
