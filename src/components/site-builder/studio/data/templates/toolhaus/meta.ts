import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import ToolhausPages, { toolhausPages } from "./pages";
import ToolhausPreview from "./preview";
import ToolhausThumbnail from "./thumbnail";
import { toolhausEditorCss } from "./editorCss";
import { toolhausSchema } from "./schema";
import { toolhausDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#CA8A04",
  secondary: "#030712",
  accent: "#FACC15",
  background: "#111827",
  surface: "#243044",
  text: "#F8FAFC",
  muted: "#94A3B8",
  dark: "#030712",
};

export const toolhausSeed = {
  id: "toolhaus",
  key: "toolhaus",
  name: "Toolhaus",
  title: "Toolhaus",
  description: "חנות כלי עבודה ו-DIY מלאה: 8 עמודים, קטגוריות, סינונים, סל ומוצרים מתוסף החנות.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "tools-diy",
  layout: "full-store",
  image: (toolhausDefaultData as Record<string, any>).heroImage,
  heroTitle: (toolhausDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (toolhausDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "toolhaus-header", title: "Header" },
    { type: "hero", variant: "toolhaus-hero", title: "Hero" },
    { type: "categories", variant: "toolhaus-categories", title: "Categories" },
    { type: "store", variant: "toolhaus-products", title: "Products" },
    { type: "gallery", variant: "toolhaus-lookbook", title: "Lookbook" },
    { type: "testimonials", variant: "toolhaus-reviews", title: "Testimonials" },
    { type: "faq", variant: "toolhaus-faq", title: "FAQ" },
    { type: "contact", variant: "toolhaus-contact", title: "Contact" },
    { type: "footer", variant: "toolhaus-footer", title: "Footer" },
  ].map((block, index) => ({ id: `toolhaus-${index + 1}-${block.type}`, ...block })),
  pages: toolhausPages,
  editor: { pages: toolhausPages, css: toolhausEditorCss },
  css: toolhausEditorCss,
  data: toolhausDefaultData,
  defaultData: toolhausDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const toolhausTemplate = {
  id: "toolhaus",
  key: "toolhaus",
  name: "Toolhaus",
  title: "Toolhaus",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "חנות כלי עבודה ו-DIY מלאה עם 8 עמודים, סינונים ומוצרים מתוסף החנות.",
  thumbnail: React.createElement(ToolhausThumbnail),
  preview: React.createElement(ToolhausPreview),
  component: ToolhausPages,
  Component: ToolhausPages,
  seed: toolhausSeed,
  pages: toolhausPages,
  editorCss: toolhausEditorCss,
  schema: toolhausSchema,
  defaultData: toolhausDefaultData,
  renderer: {
    key: "toolhaus",
    name: "Toolhaus",
    Component: ToolhausPages,
    component: ToolhausPages,
    pages: toolhausPages,
    editorMode: "visual-react",
    editorCss: toolhausEditorCss,
    schema: toolhausSchema,
    defaultData: toolhausDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default toolhausTemplate;
