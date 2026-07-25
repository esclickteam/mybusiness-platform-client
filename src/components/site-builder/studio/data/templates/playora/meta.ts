import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import PlayoraPages, { playoraPages } from "./pages";
import PlayoraPreview from "./preview";
import PlayoraThumbnail from "./thumbnail";
import { playoraEditorCss } from "./editorCss";
import { playoraSchema } from "./schema";
import { playoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#DB2777",
  secondary: "#500724",
  accent: "#FDE047",
  background: "#FFF7FB",
  surface: "#FFFFFF",
  text: "#831843",
  muted: "#9D174D",
  dark: "#500724",
};

export const playoraSeed = {
  id: "playora",
  key: "playora",
  name: "Playora",
  title: "Playora",
  description: "חנות צעצועים ארקיידית: משחקים, דמויות ויצירה — 11 עמודים צבעוניים ועשירים.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "toys-games",
  layout: "toyArcade",
  image: (playoraDefaultData as Record<string, any>).heroImage,
  heroTitle: (playoraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (playoraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "playora-header", title: "Header" },
    { type: "hero", variant: "playora-hero", title: "Hero" },
    { type: "categories", variant: "playora-categories", title: "Categories" },
    { type: "store", variant: "playora-products", title: "Products" },
    { type: "gallery", variant: "playora-lookbook", title: "Lookbook" },
    { type: "about", variant: "playora-about", title: "About" },
    { type: "testimonials", variant: "playora-reviews", title: "Testimonials" },
    { type: "faq", variant: "playora-faq", title: "FAQ" },
    { type: "contact", variant: "playora-contact", title: "Contact" },
    { type: "footer", variant: "playora-footer", title: "Footer" },
  ].map((block, index) => ({ id: `playora-${index + 1}-${block.type}`, ...block })),
  pages: playoraPages,
  editor: { pages: playoraPages, css: playoraEditorCss },
  css: playoraEditorCss,
  data: playoraDefaultData,
  defaultData: playoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const playoraTemplate = {
  id: "playora",
  key: "playora",
  name: "Playora",
  title: "Playora",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "חנות צעצועים ארקיידית: משחקים, דמויות ויצירה — 11 עמודים צבעוניים ועשירים.",
  thumbnail: React.createElement(PlayoraThumbnail),
  preview: React.createElement(PlayoraPreview),
  component: PlayoraPages,
  Component: PlayoraPages,
  seed: playoraSeed,
  pages: playoraPages,
  editorCss: playoraEditorCss,
  schema: playoraSchema,
  defaultData: playoraDefaultData,
  renderer: {
    key: "playora",
    name: "Playora",
    Component: PlayoraPages,
    component: PlayoraPages,
    pages: playoraPages,
    editorMode: "visual-react",
    editorCss: playoraEditorCss,
    schema: playoraSchema,
    defaultData: playoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default playoraTemplate;
