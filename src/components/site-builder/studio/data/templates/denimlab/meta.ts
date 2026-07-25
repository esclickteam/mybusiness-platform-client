import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import DenimlabPages, { denimlabPages } from "./pages";
import DenimlabPreview from "./preview";
import DenimlabThumbnail from "./thumbnail";
import { denimlabEditorCss } from "./editorCss";
import { denimlabSchema } from "./schema";
import { denimlabDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#1E3A8A",
  secondary: "#020617",
  accent: "#F59E0B",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  text: "#0F172A",
  muted: "#475569",
  dark: "#020617",
};

export const denimlabSeed = {
  id: "denimlab",
  key: "denimlab",
  name: "Denimlab",
  title: "Denimlab",
  description: "חנות דנים וסטרית: 11 עמודים עשירים עם קטלוג חי מתוסף החנות.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "denim-street",
  layout: "indigoStack",
  image: (denimlabDefaultData as Record<string, any>).heroImage,
  heroTitle: (denimlabDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (denimlabDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "denimlab-header", title: "Header" },
    { type: "hero", variant: "denimlab-hero", title: "Hero" },
    { type: "categories", variant: "denimlab-categories", title: "Categories" },
    { type: "store", variant: "denimlab-products", title: "Products" },
    { type: "gallery", variant: "denimlab-lookbook", title: "Lookbook" },
    { type: "about", variant: "denimlab-about", title: "About" },
    { type: "testimonials", variant: "denimlab-reviews", title: "Testimonials" },
    { type: "faq", variant: "denimlab-faq", title: "FAQ" },
    { type: "contact", variant: "denimlab-contact", title: "Contact" },
    { type: "footer", variant: "denimlab-footer", title: "Footer" },
  ].map((block, index) => ({ id: `denimlab-${index + 1}-${block.type}`, ...block })),
  pages: denimlabPages,
  editor: { pages: denimlabPages, css: denimlabEditorCss },
  css: denimlabEditorCss,
  data: denimlabDefaultData,
  defaultData: denimlabDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const denimlabTemplate = {
  id: "denimlab",
  key: "denimlab",
  name: "Denimlab",
  title: "Denimlab",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "חנות דנים וסטרית: 11 עמודים עשירים עם קטלוג חי מתוסף החנות.",
  thumbnail: React.createElement(DenimlabThumbnail),
  preview: React.createElement(DenimlabPreview),
  component: DenimlabPages,
  Component: DenimlabPages,
  seed: denimlabSeed,
  pages: denimlabPages,
  editorCss: denimlabEditorCss,
  schema: denimlabSchema,
  defaultData: denimlabDefaultData,
  renderer: {
    key: "denimlab",
    name: "Denimlab",
    Component: DenimlabPages,
    component: DenimlabPages,
    pages: denimlabPages,
    editorMode: "visual-react",
    editorCss: denimlabEditorCss,
    schema: denimlabSchema,
    defaultData: denimlabDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default denimlabTemplate;
