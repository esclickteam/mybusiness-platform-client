import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import HomecraftPages, { homecraftPages } from "./pages";
import HomecraftPreview from "./preview";
import HomecraftThumbnail from "./thumbnail";
import { homecraftEditorCss } from "./editorCss";
import { homecraftSchema } from "./schema";
import { homecraftDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#B45309",
  secondary: "#1C140C",
  accent: "#F59E0B",
  background: "#FFFBF5",
  surface: "#FFFFFF",
  text: "#3F2A14",
  muted: "#8B7355",
  dark: "#1C140C",
};

export const homecraftSeed = {
  id: "homecraft",
  key: "homecraft",
  name: "Homecraft",
  title: "Homecraft",
  description: "חנות בית ועיצוב מלאה: 8 עמודים, קטגוריות, סינונים, סל ומוצרים מתוסף החנות.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "home-decor",
  layout: "full-store",
  image: (homecraftDefaultData as Record<string, any>).heroImage,
  heroTitle: (homecraftDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (homecraftDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "homecraft-header", title: "Header" },
    { type: "hero", variant: "homecraft-hero", title: "Hero" },
    { type: "categories", variant: "homecraft-categories", title: "Categories" },
    { type: "store", variant: "homecraft-products", title: "Products" },
    { type: "gallery", variant: "homecraft-lookbook", title: "Lookbook" },
    { type: "testimonials", variant: "homecraft-reviews", title: "Testimonials" },
    { type: "faq", variant: "homecraft-faq", title: "FAQ" },
    { type: "contact", variant: "homecraft-contact", title: "Contact" },
    { type: "footer", variant: "homecraft-footer", title: "Footer" },
  ].map((block, index) => ({ id: `homecraft-${index + 1}-${block.type}`, ...block })),
  pages: homecraftPages,
  editor: { pages: homecraftPages, css: homecraftEditorCss },
  css: homecraftEditorCss,
  data: homecraftDefaultData,
  defaultData: homecraftDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const homecraftTemplate = {
  id: "homecraft",
  key: "homecraft",
  name: "Homecraft",
  title: "Homecraft",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "חנות בית ועיצוב מלאה עם 8 עמודים, סינונים ומוצרים מתוסף החנות.",
  thumbnail: React.createElement(HomecraftThumbnail),
  preview: React.createElement(HomecraftPreview),
  component: HomecraftPages,
  Component: HomecraftPages,
  seed: homecraftSeed,
  pages: homecraftPages,
  editorCss: homecraftEditorCss,
  schema: homecraftSchema,
  defaultData: homecraftDefaultData,
  renderer: {
    key: "homecraft",
    name: "Homecraft",
    Component: HomecraftPages,
    component: HomecraftPages,
    pages: homecraftPages,
    editorMode: "visual-react",
    editorCss: homecraftEditorCss,
    schema: homecraftSchema,
    defaultData: homecraftDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default homecraftTemplate;
