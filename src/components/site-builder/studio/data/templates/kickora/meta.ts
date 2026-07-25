import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import KickoraPages, { kickoraPages } from "./pages";
import KickoraPreview from "./preview";
import KickoraThumbnail from "./thumbnail";
import { kickoraEditorCss } from "./editorCss";
import { kickoraSchema } from "./schema";
import { kickoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#111827",
  secondary: "#050507",
  accent: "#F43F5E",
  background: "#0B0B0F",
  surface: "#1C1C26",
  text: "#F5F5F7",
  muted: "#A1A1AA",
  dark: "#050507",
};

export const kickoraSeed = {
  id: "kickora",
  key: "kickora",
  name: "Kickora",
  title: "Kickora",
  description: "חנות סניקרס וסטריט: דרופים, קולקציות ואביזרים — 11 עמודים עם אנרגיית רחוב.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "sneakers-streetwear",
  layout: "streetDrop",
  image: (kickoraDefaultData as Record<string, any>).heroImage,
  heroTitle: (kickoraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (kickoraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "kickora-header", title: "Header" },
    { type: "hero", variant: "kickora-hero", title: "Hero" },
    { type: "categories", variant: "kickora-categories", title: "Categories" },
    { type: "store", variant: "kickora-products", title: "Products" },
    { type: "gallery", variant: "kickora-lookbook", title: "Lookbook" },
    { type: "about", variant: "kickora-about", title: "About" },
    { type: "testimonials", variant: "kickora-reviews", title: "Testimonials" },
    { type: "faq", variant: "kickora-faq", title: "FAQ" },
    { type: "contact", variant: "kickora-contact", title: "Contact" },
    { type: "footer", variant: "kickora-footer", title: "Footer" },
  ].map((block, index) => ({ id: `kickora-${index + 1}-${block.type}`, ...block })),
  pages: kickoraPages,
  editor: { pages: kickoraPages, css: kickoraEditorCss },
  css: kickoraEditorCss,
  data: kickoraDefaultData,
  defaultData: kickoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const kickoraTemplate = {
  id: "kickora",
  key: "kickora",
  name: "Kickora",
  title: "Kickora",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "חנות סניקרס וסטריט: דרופים, קולקציות ואביזרים — 11 עמודים עם אנרגיית רחוב.",
  thumbnail: React.createElement(KickoraThumbnail),
  preview: React.createElement(KickoraPreview),
  component: KickoraPages,
  Component: KickoraPages,
  seed: kickoraSeed,
  pages: kickoraPages,
  editorCss: kickoraEditorCss,
  schema: kickoraSchema,
  defaultData: kickoraDefaultData,
  renderer: {
    key: "kickora",
    name: "Kickora",
    Component: KickoraPages,
    component: KickoraPages,
    pages: kickoraPages,
    editorMode: "visual-react",
    editorCss: kickoraEditorCss,
    schema: kickoraSchema,
    defaultData: kickoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default kickoraTemplate;
