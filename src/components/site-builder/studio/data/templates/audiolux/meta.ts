import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import AudioluxPages, { audioluxPages } from "./pages";
import AudioluxPreview from "./preview";
import AudioluxThumbnail from "./thumbnail";
import { audioluxEditorCss } from "./editorCss";
import { audioluxSchema } from "./schema";
import { audioluxDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#06B6D4",
  secondary: "#020617",
  accent: "#A78BFA",
  background: "#050915",
  surface: "#111827",
  text: "#E0F2FE",
  muted: "#94A3B8",
  dark: "#020617",
};

export const audioluxSeed = {
  id: "audiolux",
  key: "audiolux",
  name: "Audiolux",
  title: "Audiolux",
  description: "חנות אודיו קולנועית: אוזניות, רמקולים ומערכות — 11 עמודים עשירים.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "audio-gear",
  layout: "soundStage",
  image: (audioluxDefaultData as Record<string, any>).heroImage,
  heroTitle: (audioluxDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (audioluxDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "audiolux-header", title: "Header" },
    { type: "hero", variant: "audiolux-hero", title: "Hero" },
    { type: "categories", variant: "audiolux-categories", title: "Categories" },
    { type: "store", variant: "audiolux-products", title: "Products" },
    { type: "gallery", variant: "audiolux-lookbook", title: "Lookbook" },
    { type: "about", variant: "audiolux-about", title: "About" },
    { type: "testimonials", variant: "audiolux-reviews", title: "Testimonials" },
    { type: "faq", variant: "audiolux-faq", title: "FAQ" },
    { type: "contact", variant: "audiolux-contact", title: "Contact" },
    { type: "footer", variant: "audiolux-footer", title: "Footer" },
  ].map((block, index) => ({ id: `audiolux-${index + 1}-${block.type}`, ...block })),
  pages: audioluxPages,
  editor: { pages: audioluxPages, css: audioluxEditorCss },
  css: audioluxEditorCss,
  data: audioluxDefaultData,
  defaultData: audioluxDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const audioluxTemplate = {
  id: "audiolux",
  key: "audiolux",
  name: "Audiolux",
  title: "Audiolux",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "חנות אודיו קולנועית: אוזניות, רמקולים ומערכות — 11 עמודים עשירים.",
  thumbnail: React.createElement(AudioluxThumbnail),
  preview: React.createElement(AudioluxPreview),
  component: AudioluxPages,
  Component: AudioluxPages,
  seed: audioluxSeed,
  pages: audioluxPages,
  editorCss: audioluxEditorCss,
  schema: audioluxSchema,
  defaultData: audioluxDefaultData,
  renderer: {
    key: "audiolux",
    name: "Audiolux",
    Component: AudioluxPages,
    component: AudioluxPages,
    pages: audioluxPages,
    editorMode: "visual-react",
    editorCss: audioluxEditorCss,
    schema: audioluxSchema,
    defaultData: audioluxDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default audioluxTemplate;
