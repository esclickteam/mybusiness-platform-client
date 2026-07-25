import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import BagoraPages, { bagoraPages } from "./pages";
import BagoraPreview from "./preview";
import BagoraThumbnail from "./thumbnail";
import { bagoraEditorCss } from "./editorCss";
import { bagoraSchema } from "./schema";
import { bagoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#7C2D12",
  secondary: "#1C1917",
  accent: "#FB923C",
  background: "#FFF7ED",
  surface: "#FFFFFF",
  text: "#431407",
  muted: "#9A3412",
  dark: "#1C1917",
};

export const bagoraSeed = {
  id: "bagora",
  key: "bagora",
  name: "Bagora",
  title: "Bagora",
  description: "חנות תיקים ואקססוריז: 11 עמודים, סטודיו רצועות, וקטלוג מתוסף החנות.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "bags-accessories",
  layout: "strapStudio",
  image: (bagoraDefaultData as Record<string, any>).heroImage,
  heroTitle: (bagoraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (bagoraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "bagora-header", title: "Header" },
    { type: "hero", variant: "bagora-hero", title: "Hero" },
    { type: "categories", variant: "bagora-categories", title: "Categories" },
    { type: "store", variant: "bagora-products", title: "Products" },
    { type: "gallery", variant: "bagora-lookbook", title: "Lookbook" },
    { type: "about", variant: "bagora-about", title: "About" },
    { type: "testimonials", variant: "bagora-reviews", title: "Testimonials" },
    { type: "faq", variant: "bagora-faq", title: "FAQ" },
    { type: "contact", variant: "bagora-contact", title: "Contact" },
    { type: "footer", variant: "bagora-footer", title: "Footer" },
  ].map((block, index) => ({ id: `bagora-${index + 1}-${block.type}`, ...block })),
  pages: bagoraPages,
  editor: { pages: bagoraPages, css: bagoraEditorCss },
  css: bagoraEditorCss,
  data: bagoraDefaultData,
  defaultData: bagoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const bagoraTemplate = {
  id: "bagora",
  key: "bagora",
  name: "Bagora",
  title: "Bagora",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "חנות תיקים ואקססוריז: 11 עמודים, סטודיו רצועות, וקטלוג מתוסף החנות.",
  thumbnail: React.createElement(BagoraThumbnail),
  preview: React.createElement(BagoraPreview),
  component: BagoraPages,
  Component: BagoraPages,
  seed: bagoraSeed,
  pages: bagoraPages,
  editorCss: bagoraEditorCss,
  schema: bagoraSchema,
  defaultData: bagoraDefaultData,
  renderer: {
    key: "bagora",
    name: "Bagora",
    Component: BagoraPages,
    component: BagoraPages,
    pages: bagoraPages,
    editorMode: "visual-react",
    editorCss: bagoraEditorCss,
    schema: bagoraSchema,
    defaultData: bagoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default bagoraTemplate;
