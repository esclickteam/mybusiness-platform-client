import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import ClothoraPages, { clothoraPages } from "./pages";
import ClothoraPreview from "./preview";
import ClothoraThumbnail from "./thumbnail";
import { clothoraEditorCss } from "./editorCss";
import { clothoraSchema } from "./schema";
import { clothoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#111827",
  secondary: "#0C0A09",
  accent: "#F43F5E",
  background: "#FAFAF9",
  surface: "#FFFFFF",
  text: "#111827",
  muted: "#57534E",
  dark: "#0C0A09",
};

export const clothoraSeed = {
  id: "clothora",
  key: "clothora",
  name: "Clothora",
  title: "Clothora",
  description: "חנות בגדים עשירה: 11 עמודים, 10 סקשנים בכל עמוד, קטלוג מתוסף החנות.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "fashion-apparel",
  layout: "runwayRail",
  image: (clothoraDefaultData as Record<string, any>).heroImage,
  heroTitle: (clothoraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (clothoraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "clothora-header", title: "Header" },
    { type: "hero", variant: "clothora-hero", title: "Hero" },
    { type: "categories", variant: "clothora-categories", title: "Categories" },
    { type: "store", variant: "clothora-products", title: "Products" },
    { type: "gallery", variant: "clothora-lookbook", title: "Lookbook" },
    { type: "about", variant: "clothora-about", title: "About" },
    { type: "testimonials", variant: "clothora-reviews", title: "Testimonials" },
    { type: "faq", variant: "clothora-faq", title: "FAQ" },
    { type: "contact", variant: "clothora-contact", title: "Contact" },
    { type: "footer", variant: "clothora-footer", title: "Footer" },
  ].map((block, index) => ({ id: `clothora-${index + 1}-${block.type}`, ...block })),
  pages: clothoraPages,
  editor: { pages: clothoraPages, css: clothoraEditorCss },
  css: clothoraEditorCss,
  data: clothoraDefaultData,
  defaultData: clothoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const clothoraTemplate = {
  id: "clothora",
  key: "clothora",
  name: "Clothora",
  title: "Clothora",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "חנות בגדים עשירה: 11 עמודים, 10 סקשנים בכל עמוד, קטלוג מתוסף החנות.",
  thumbnail: React.createElement(ClothoraThumbnail),
  preview: React.createElement(ClothoraPreview),
  component: ClothoraPages,
  Component: ClothoraPages,
  seed: clothoraSeed,
  pages: clothoraPages,
  editorCss: clothoraEditorCss,
  schema: clothoraSchema,
  defaultData: clothoraDefaultData,
  renderer: {
    key: "clothora",
    name: "Clothora",
    Component: ClothoraPages,
    component: ClothoraPages,
    pages: clothoraPages,
    editorMode: "visual-react",
    editorCss: clothoraEditorCss,
    schema: clothoraSchema,
    defaultData: clothoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default clothoraTemplate;
