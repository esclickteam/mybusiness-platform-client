import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import ScentoraPages, { scentoraPages } from "./pages";
import ScentoraPreview from "./preview";
import ScentoraThumbnail from "./thumbnail";
import { scentoraEditorCss } from "./editorCss";
import { scentoraSchema } from "./schema";
import { scentoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#9D174D",
  secondary: "#2D0A1A",
  accent: "#F9A8D4",
  background: "#FFF7F9",
  surface: "#FFFFFF",
  text: "#500724",
  muted: "#9D174D",
  dark: "#2D0A1A",
};

export const scentoraSeed = {
  id: "scentora",
  key: "scentora",
  name: "Scentora",
  title: "Scentora",
  description: "חנות נרות וריחות יוקרתית: נרות, דיפיוזרים ומארזים — 11 עמודים רכים ועשירים.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "candles-fragrance",
  layout: "aromaSalon",
  image: (scentoraDefaultData as Record<string, any>).heroImage,
  heroTitle: (scentoraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (scentoraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "scentora-header", title: "Header" },
    { type: "hero", variant: "scentora-hero", title: "Hero" },
    { type: "categories", variant: "scentora-categories", title: "Categories" },
    { type: "store", variant: "scentora-products", title: "Products" },
    { type: "gallery", variant: "scentora-lookbook", title: "Lookbook" },
    { type: "about", variant: "scentora-about", title: "About" },
    { type: "testimonials", variant: "scentora-reviews", title: "Testimonials" },
    { type: "faq", variant: "scentora-faq", title: "FAQ" },
    { type: "contact", variant: "scentora-contact", title: "Contact" },
    { type: "footer", variant: "scentora-footer", title: "Footer" },
  ].map((block, index) => ({ id: `scentora-${index + 1}-${block.type}`, ...block })),
  pages: scentoraPages,
  editor: { pages: scentoraPages, css: scentoraEditorCss },
  css: scentoraEditorCss,
  data: scentoraDefaultData,
  defaultData: scentoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const scentoraTemplate = {
  id: "scentora",
  key: "scentora",
  name: "Scentora",
  title: "Scentora",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "חנות נרות וריחות יוקרתית: נרות, דיפיוזרים ומארזים — 11 עמודים רכים ועשירים.",
  thumbnail: React.createElement(ScentoraThumbnail),
  preview: React.createElement(ScentoraPreview),
  component: ScentoraPages,
  Component: ScentoraPages,
  seed: scentoraSeed,
  pages: scentoraPages,
  editorCss: scentoraEditorCss,
  schema: scentoraSchema,
  defaultData: scentoraDefaultData,
  renderer: {
    key: "scentora",
    name: "Scentora",
    Component: ScentoraPages,
    component: ScentoraPages,
    pages: scentoraPages,
    editorMode: "visual-react",
    editorCss: scentoraEditorCss,
    schema: scentoraSchema,
    defaultData: scentoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default scentoraTemplate;
