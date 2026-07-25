import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import PanoraPages, { panoraPages } from "./pages";
import PanoraPreview from "./preview";
import PanoraThumbnail from "./thumbnail";
import { panoraEditorCss } from "./editorCss";
import { panoraSchema } from "./schema";
import { panoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#C2410C",
  secondary: "#1C1917",
  accent: "#FDBA74",
  background: "#FFFAF5",
  surface: "#FFFFFF",
  text: "#431407",
  muted: "#9A3412",
  dark: "#1C1917",
};

export const panoraSeed = {
  id: "panora",
  key: "panora",
  name: "Panora",
  title: "Panora",
  description: "חנות כלי מטבח בסגנון ספר מתכונים: סירים, סכינים ואביזרים — 11 עמודים עשירים.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "kitchen-cookware",
  layout: "chefAtelier",
  image: (panoraDefaultData as Record<string, any>).heroImage,
  heroTitle: (panoraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (panoraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "panora-header", title: "Header" },
    { type: "hero", variant: "panora-hero", title: "Hero" },
    { type: "categories", variant: "panora-categories", title: "Categories" },
    { type: "store", variant: "panora-products", title: "Products" },
    { type: "gallery", variant: "panora-lookbook", title: "Lookbook" },
    { type: "about", variant: "panora-about", title: "About" },
    { type: "testimonials", variant: "panora-reviews", title: "Testimonials" },
    { type: "faq", variant: "panora-faq", title: "FAQ" },
    { type: "contact", variant: "panora-contact", title: "Contact" },
    { type: "footer", variant: "panora-footer", title: "Footer" },
  ].map((block, index) => ({ id: `panora-${index + 1}-${block.type}`, ...block })),
  pages: panoraPages,
  editor: { pages: panoraPages, css: panoraEditorCss },
  css: panoraEditorCss,
  data: panoraDefaultData,
  defaultData: panoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const panoraTemplate = {
  id: "panora",
  key: "panora",
  name: "Panora",
  title: "Panora",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "חנות כלי מטבח בסגנון ספר מתכונים: סירים, סכינים ואביזרים — 11 עמודים עשירים.",
  thumbnail: React.createElement(PanoraThumbnail),
  preview: React.createElement(PanoraPreview),
  component: PanoraPages,
  Component: PanoraPages,
  seed: panoraSeed,
  pages: panoraPages,
  editorCss: panoraEditorCss,
  schema: panoraSchema,
  defaultData: panoraDefaultData,
  renderer: {
    key: "panora",
    name: "Panora",
    Component: PanoraPages,
    component: PanoraPages,
    pages: panoraPages,
    editorMode: "visual-react",
    editorCss: panoraEditorCss,
    schema: panoraSchema,
    defaultData: panoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default panoraTemplate;
