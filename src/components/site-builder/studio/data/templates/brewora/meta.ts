import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import BreworaPages, { breworaPages } from "./pages";
import BreworaPreview from "./preview";
import BreworaThumbnail from "./thumbnail";
import { breworaEditorCss } from "./editorCss";
import { breworaSchema } from "./schema";
import { breworaDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#8B4513",
  secondary: "#1C0A00",
  accent: "#D97706",
  background: "#FFF7ED",
  surface: "#FFFFFF",
  text: "#431407",
  muted: "#9A3412",
  dark: "#1C0A00",
};

export const breworaSeed = {
  id: "brewora",
  key: "brewora",
  name: "Brewora",
  title: "Brewora",
  description: "חנות קפה ספיישלטי עשירה: 11 עמודים, 10 סקשנים בכל עמוד, קטלוג מתוסף החנות.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "specialty-coffee",
  layout: "roastBar",
  image: (breworaDefaultData as Record<string, any>).heroImage,
  heroTitle: (breworaDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (breworaDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "brewora-header", title: "Header" },
    { type: "hero", variant: "brewora-hero", title: "Hero" },
    { type: "categories", variant: "brewora-categories", title: "Categories" },
    { type: "store", variant: "brewora-products", title: "Products" },
    { type: "gallery", variant: "brewora-lookbook", title: "Lookbook" },
    { type: "about", variant: "brewora-about", title: "About" },
    { type: "testimonials", variant: "brewora-reviews", title: "Testimonials" },
    { type: "faq", variant: "brewora-faq", title: "FAQ" },
    { type: "contact", variant: "brewora-contact", title: "Contact" },
    { type: "footer", variant: "brewora-footer", title: "Footer" },
  ].map((block, index) => ({ id: `brewora-${index + 1}-${block.type}`, ...block })),
  pages: breworaPages,
  editor: { pages: breworaPages, css: breworaEditorCss },
  css: breworaEditorCss,
  data: breworaDefaultData,
  defaultData: breworaDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const breworaTemplate = {
  id: "brewora",
  key: "brewora",
  name: "Brewora",
  title: "Brewora",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "חנות קפה ספיישלטי עשירה: 11 עמודים, 10 סקשנים בכל עמוד, קטלוג מתוסף החנות.",
  thumbnail: React.createElement(BreworaThumbnail),
  preview: React.createElement(BreworaPreview),
  component: BreworaPages,
  Component: BreworaPages,
  seed: breworaSeed,
  pages: breworaPages,
  editorCss: breworaEditorCss,
  schema: breworaSchema,
  defaultData: breworaDefaultData,
  renderer: {
    key: "brewora",
    name: "Brewora",
    Component: BreworaPages,
    component: BreworaPages,
    pages: breworaPages,
    editorMode: "visual-react",
    editorCss: breworaEditorCss,
    schema: breworaSchema,
    defaultData: breworaDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default breworaTemplate;
