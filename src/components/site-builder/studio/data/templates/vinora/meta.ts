import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import VinoraPages, { vinoraPages } from "./pages";
import VinoraPreview from "./preview";
import VinoraThumbnail from "./thumbnail";
import { vinoraEditorCss } from "./editorCss";
import { vinoraSchema } from "./schema";
import { vinoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#7F1D1D",
  secondary: "#1A0A08",
  accent: "#F59E0B",
  background: "#FFFBF5",
  surface: "#FFFFFF",
  text: "#3F1D12",
  muted: "#7C2D12",
  dark: "#1A0A08",
};

export const vinoraSeed = {
  id: "vinora",
  key: "vinora",
  name: "Vinora",
  title: "Vinora",
  description: "חנות יינות ומרתף: 11 עמודים עשירים, קולקציות יקבים ומוצרים מתוסף החנות.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "wine-cellar",
  layout: "cellarVault",
  image: (vinoraDefaultData as Record<string, any>).heroImage,
  heroTitle: (vinoraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (vinoraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "vinora-header", title: "Header" },
    { type: "hero", variant: "vinora-hero", title: "Hero" },
    { type: "categories", variant: "vinora-categories", title: "Categories" },
    { type: "store", variant: "vinora-products", title: "Products" },
    { type: "gallery", variant: "vinora-lookbook", title: "Lookbook" },
    { type: "about", variant: "vinora-about", title: "About" },
    { type: "testimonials", variant: "vinora-reviews", title: "Testimonials" },
    { type: "faq", variant: "vinora-faq", title: "FAQ" },
    { type: "contact", variant: "vinora-contact", title: "Contact" },
    { type: "footer", variant: "vinora-footer", title: "Footer" },
  ].map((block, index) => ({ id: `vinora-${index + 1}-${block.type}`, ...block })),
  pages: vinoraPages,
  editor: { pages: vinoraPages, css: vinoraEditorCss },
  css: vinoraEditorCss,
  data: vinoraDefaultData,
  defaultData: vinoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const vinoraTemplate = {
  id: "vinora",
  key: "vinora",
  name: "Vinora",
  title: "Vinora",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "חנות יינות ומרתף: 11 עמודים עשירים, קולקציות יקבים ומוצרים מתוסף החנות.",
  thumbnail: React.createElement(VinoraThumbnail),
  preview: React.createElement(VinoraPreview),
  component: VinoraPages,
  Component: VinoraPages,
  seed: vinoraSeed,
  pages: vinoraPages,
  editorCss: vinoraEditorCss,
  schema: vinoraSchema,
  defaultData: vinoraDefaultData,
  renderer: {
    key: "vinora",
    name: "Vinora",
    Component: VinoraPages,
    component: VinoraPages,
    pages: vinoraPages,
    editorMode: "visual-react",
    editorCss: vinoraEditorCss,
    schema: vinoraSchema,
    defaultData: vinoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default vinoraTemplate;
