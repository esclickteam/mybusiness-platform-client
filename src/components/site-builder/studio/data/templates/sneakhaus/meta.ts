import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import SneakhausPages, { sneakhausPages } from "./pages";
import SneakhausPreview from "./preview";
import SneakhausThumbnail from "./thumbnail";
import { sneakhausEditorCss } from "./editorCss";
import { sneakhausSchema } from "./schema";
import { sneakhausDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#09090B",
  secondary: "#09090B",
  accent: "#22D3EE",
  background: "#FAFAFA",
  surface: "#FFFFFF",
  text: "#09090B",
  muted: "#52525B",
  dark: "#09090B",
};

export const sneakhausSeed = {
  id: "sneakhaus",
  key: "sneakhaus",
  name: "Sneakhaus",
  title: "Sneakhaus",
  description: "חנות סניקרס ותרבות רחוב: 11 עמודים עשירים עם מוצרים מתוסף החנות.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "sneakers",
  layout: "courtDrop",
  image: (sneakhausDefaultData as Record<string, any>).heroImage,
  heroTitle: (sneakhausDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (sneakhausDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "sneakhaus-header", title: "Header" },
    { type: "hero", variant: "sneakhaus-hero", title: "Hero" },
    { type: "categories", variant: "sneakhaus-categories", title: "Categories" },
    { type: "store", variant: "sneakhaus-products", title: "Products" },
    { type: "gallery", variant: "sneakhaus-lookbook", title: "Lookbook" },
    { type: "about", variant: "sneakhaus-about", title: "About" },
    { type: "testimonials", variant: "sneakhaus-reviews", title: "Testimonials" },
    { type: "faq", variant: "sneakhaus-faq", title: "FAQ" },
    { type: "contact", variant: "sneakhaus-contact", title: "Contact" },
    { type: "footer", variant: "sneakhaus-footer", title: "Footer" },
  ].map((block, index) => ({ id: `sneakhaus-${index + 1}-${block.type}`, ...block })),
  pages: sneakhausPages,
  editor: { pages: sneakhausPages, css: sneakhausEditorCss },
  css: sneakhausEditorCss,
  data: sneakhausDefaultData,
  defaultData: sneakhausDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const sneakhausTemplate = {
  id: "sneakhaus",
  key: "sneakhaus",
  name: "Sneakhaus",
  title: "Sneakhaus",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "חנות סניקרס ותרבות רחוב: 11 עמודים עשירים עם מוצרים מתוסף החנות.",
  thumbnail: React.createElement(SneakhausThumbnail),
  preview: React.createElement(SneakhausPreview),
  component: SneakhausPages,
  Component: SneakhausPages,
  seed: sneakhausSeed,
  pages: sneakhausPages,
  editorCss: sneakhausEditorCss,
  schema: sneakhausSchema,
  defaultData: sneakhausDefaultData,
  renderer: {
    key: "sneakhaus",
    name: "Sneakhaus",
    Component: SneakhausPages,
    component: SneakhausPages,
    pages: sneakhausPages,
    editorMode: "visual-react",
    editorCss: sneakhausEditorCss,
    schema: sneakhausSchema,
    defaultData: sneakhausDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default sneakhausTemplate;
