import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import SoleoraPages, { soleoraPages } from "./pages";
import SoleoraPreview from "./preview";
import SoleoraThumbnail from "./thumbnail";
import { soleoraEditorCss } from "./editorCss";
import { soleoraSchema } from "./schema";
import { soleoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#78350F",
  secondary: "#1C1917",
  accent: "#CA8A04",
  background: "#FFFBEB",
  surface: "#FFFFFF",
  text: "#451A03",
  muted: "#92400E",
  dark: "#1C1917",
};

export const soleoraSeed = {
  id: "soleora",
  key: "soleora",
  name: "Soleora",
  title: "Soleora",
  description: "חנות נעליים מלאה: 11 עמודים, קטגוריות, סינון וחיבור לתוסף החנות.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "footwear",
  layout: "lastBench",
  image: (soleoraDefaultData as Record<string, any>).heroImage,
  heroTitle: (soleoraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (soleoraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "soleora-header", title: "Header" },
    { type: "hero", variant: "soleora-hero", title: "Hero" },
    { type: "categories", variant: "soleora-categories", title: "Categories" },
    { type: "store", variant: "soleora-products", title: "Products" },
    { type: "gallery", variant: "soleora-lookbook", title: "Lookbook" },
    { type: "about", variant: "soleora-about", title: "About" },
    { type: "testimonials", variant: "soleora-reviews", title: "Testimonials" },
    { type: "faq", variant: "soleora-faq", title: "FAQ" },
    { type: "contact", variant: "soleora-contact", title: "Contact" },
    { type: "footer", variant: "soleora-footer", title: "Footer" },
  ].map((block, index) => ({ id: `soleora-${index + 1}-${block.type}`, ...block })),
  pages: soleoraPages,
  editor: { pages: soleoraPages, css: soleoraEditorCss },
  css: soleoraEditorCss,
  data: soleoraDefaultData,
  defaultData: soleoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const soleoraTemplate = {
  id: "soleora",
  key: "soleora",
  name: "Soleora",
  title: "Soleora",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "חנות נעליים מלאה: 11 עמודים, קטגוריות, סינון וחיבור לתוסף החנות.",
  thumbnail: React.createElement(SoleoraThumbnail),
  preview: React.createElement(SoleoraPreview),
  component: SoleoraPages,
  Component: SoleoraPages,
  seed: soleoraSeed,
  pages: soleoraPages,
  editorCss: soleoraEditorCss,
  schema: soleoraSchema,
  defaultData: soleoraDefaultData,
  renderer: {
    key: "soleora",
    name: "Soleora",
    Component: SoleoraPages,
    component: SoleoraPages,
    pages: soleoraPages,
    editorMode: "visual-react",
    editorCss: soleoraEditorCss,
    schema: soleoraSchema,
    defaultData: soleoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default soleoraTemplate;
