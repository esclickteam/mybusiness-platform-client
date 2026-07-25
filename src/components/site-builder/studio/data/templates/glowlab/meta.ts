import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import GlowlabPages, { glowlabPages } from "./pages";
import GlowlabPreview from "./preview";
import GlowlabThumbnail from "./thumbnail";
import { glowlabEditorCss } from "./editorCss";
import { glowlabSchema } from "./schema";
import { glowlabDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#BE185D",
  secondary: "#0C0509",
  accent: "#F9A8D4",
  background: "#1A0B14",
  surface: "#341828",
  text: "#FFF1F5",
  muted: "#E8A0BF",
  dark: "#0C0509",
};

export const glowlabSeed = {
  id: "glowlab",
  key: "glowlab",
  name: "Glowlab",
  title: "Glowlab",
  description: "חנות קוסמטיקה ויופי מלאה: 8 עמודים, קטגוריות, סינונים, סל ומוצרים מתוסף החנות.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "beauty-cosmetics",
  layout: "full-store",
  image: (glowlabDefaultData as Record<string, any>).heroImage,
  heroTitle: (glowlabDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (glowlabDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "glowlab-header", title: "Header" },
    { type: "hero", variant: "glowlab-hero", title: "Hero" },
    { type: "categories", variant: "glowlab-categories", title: "Categories" },
    { type: "store", variant: "glowlab-products", title: "Products" },
    { type: "gallery", variant: "glowlab-lookbook", title: "Lookbook" },
    { type: "testimonials", variant: "glowlab-reviews", title: "Testimonials" },
    { type: "faq", variant: "glowlab-faq", title: "FAQ" },
    { type: "contact", variant: "glowlab-contact", title: "Contact" },
    { type: "footer", variant: "glowlab-footer", title: "Footer" },
  ].map((block, index) => ({ id: `glowlab-${index + 1}-${block.type}`, ...block })),
  pages: glowlabPages,
  editor: { pages: glowlabPages, css: glowlabEditorCss },
  css: glowlabEditorCss,
  data: glowlabDefaultData,
  defaultData: glowlabDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const glowlabTemplate = {
  id: "glowlab",
  key: "glowlab",
  name: "Glowlab",
  title: "Glowlab",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "חנות קוסמטיקה ויופי מלאה עם 8 עמודים, סינונים ומוצרים מתוסף החנות.",
  thumbnail: React.createElement(GlowlabThumbnail),
  preview: React.createElement(GlowlabPreview),
  component: GlowlabPages,
  Component: GlowlabPages,
  seed: glowlabSeed,
  pages: glowlabPages,
  editorCss: glowlabEditorCss,
  schema: glowlabSchema,
  defaultData: glowlabDefaultData,
  renderer: {
    key: "glowlab",
    name: "Glowlab",
    Component: GlowlabPages,
    component: GlowlabPages,
    pages: glowlabPages,
    editorMode: "visual-react",
    editorCss: glowlabEditorCss,
    schema: glowlabSchema,
    defaultData: glowlabDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default glowlabTemplate;
