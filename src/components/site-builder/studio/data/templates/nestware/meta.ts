import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import NestwarePages, { nestwarePages } from "./pages";
import NestwarePreview from "./preview";
import NestwareThumbnail from "./thumbnail";
import { nestwareEditorCss } from "./editorCss";
import { nestwareSchema } from "./schema";
import { nestwareDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#0F766E",
  secondary: "#042F2E",
  accent: "#F59E0B",
  background: "#F0FDFA",
  surface: "#FFFFFF",
  text: "#134E4A",
  muted: "#0F766E",
  dark: "#042F2E",
};

export const nestwareSeed = {
  id: "nestware",
  key: "nestware",
  name: "Nestware",
  title: "Nestware",
  description: "חנות מוצרי בית: ארגון, דקור וכלים — 11 עמודים עם 10 סקשנים בכל אחד.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "home-goods",
  layout: "roomShelf",
  image: (nestwareDefaultData as Record<string, any>).heroImage,
  heroTitle: (nestwareDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (nestwareDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "nestware-header", title: "Header" },
    { type: "hero", variant: "nestware-hero", title: "Hero" },
    { type: "categories", variant: "nestware-categories", title: "Categories" },
    { type: "store", variant: "nestware-products", title: "Products" },
    { type: "gallery", variant: "nestware-lookbook", title: "Lookbook" },
    { type: "about", variant: "nestware-about", title: "About" },
    { type: "testimonials", variant: "nestware-reviews", title: "Testimonials" },
    { type: "faq", variant: "nestware-faq", title: "FAQ" },
    { type: "contact", variant: "nestware-contact", title: "Contact" },
    { type: "footer", variant: "nestware-footer", title: "Footer" },
  ].map((block, index) => ({ id: `nestware-${index + 1}-${block.type}`, ...block })),
  pages: nestwarePages,
  editor: { pages: nestwarePages, css: nestwareEditorCss },
  css: nestwareEditorCss,
  data: nestwareDefaultData,
  defaultData: nestwareDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const nestwareTemplate = {
  id: "nestware",
  key: "nestware",
  name: "Nestware",
  title: "Nestware",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "חנות מוצרי בית: ארגון, דקור וכלים — 11 עמודים עם 10 סקשנים בכל אחד.",
  thumbnail: React.createElement(NestwareThumbnail),
  preview: React.createElement(NestwarePreview),
  component: NestwarePages,
  Component: NestwarePages,
  seed: nestwareSeed,
  pages: nestwarePages,
  editorCss: nestwareEditorCss,
  schema: nestwareSchema,
  defaultData: nestwareDefaultData,
  renderer: {
    key: "nestware",
    name: "Nestware",
    Component: NestwarePages,
    component: NestwarePages,
    pages: nestwarePages,
    editorMode: "visual-react",
    editorCss: nestwareEditorCss,
    schema: nestwareSchema,
    defaultData: nestwareDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default nestwareTemplate;
