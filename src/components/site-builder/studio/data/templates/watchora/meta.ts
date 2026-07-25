import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import WatchoraPages, { watchoraPages } from "./pages";
import WatchoraPreview from "./preview";
import WatchoraThumbnail from "./thumbnail";
import { watchoraEditorCss } from "./editorCss";
import { watchoraSchema } from "./schema";
import { watchoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#1F2937",
  secondary: "#030712",
  accent: "#D4AF37",
  background: "#F3F4F6",
  surface: "#FFFFFF",
  text: "#111827",
  muted: "#4B5563",
  dark: "#030712",
};

export const watchoraSeed = {
  id: "watchora",
  key: "watchora",
  name: "Watchora",
  title: "Watchora",
  description: "חנות שעונים: קלאסיקה, ספורט וסמארט — 11 עמודים עם ויטרינה עשירה.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "watches",
  layout: "dialAtelier",
  image: (watchoraDefaultData as Record<string, any>).heroImage,
  heroTitle: (watchoraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (watchoraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "watchora-header", title: "Header" },
    { type: "hero", variant: "watchora-hero", title: "Hero" },
    { type: "categories", variant: "watchora-categories", title: "Categories" },
    { type: "store", variant: "watchora-products", title: "Products" },
    { type: "gallery", variant: "watchora-lookbook", title: "Lookbook" },
    { type: "about", variant: "watchora-about", title: "About" },
    { type: "testimonials", variant: "watchora-reviews", title: "Testimonials" },
    { type: "faq", variant: "watchora-faq", title: "FAQ" },
    { type: "contact", variant: "watchora-contact", title: "Contact" },
    { type: "footer", variant: "watchora-footer", title: "Footer" },
  ].map((block, index) => ({ id: `watchora-${index + 1}-${block.type}`, ...block })),
  pages: watchoraPages,
  editor: { pages: watchoraPages, css: watchoraEditorCss },
  css: watchoraEditorCss,
  data: watchoraDefaultData,
  defaultData: watchoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const watchoraTemplate = {
  id: "watchora",
  key: "watchora",
  name: "Watchora",
  title: "Watchora",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "חנות שעונים: קלאסיקה, ספורט וסמארט — 11 עמודים עם ויטרינה עשירה.",
  thumbnail: React.createElement(WatchoraThumbnail),
  preview: React.createElement(WatchoraPreview),
  component: WatchoraPages,
  Component: WatchoraPages,
  seed: watchoraSeed,
  pages: watchoraPages,
  editorCss: watchoraEditorCss,
  schema: watchoraSchema,
  defaultData: watchoraDefaultData,
  renderer: {
    key: "watchora",
    name: "Watchora",
    Component: WatchoraPages,
    component: WatchoraPages,
    pages: watchoraPages,
    editorMode: "visual-react",
    editorCss: watchoraEditorCss,
    schema: watchoraSchema,
    defaultData: watchoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default watchoraTemplate;
