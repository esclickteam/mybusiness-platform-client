import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import VitaraPages, { vitaraPages } from "./pages";
import VitaraPreview from "./preview";
import VitaraThumbnail from "./thumbnail";
import { vitaraEditorCss } from "./editorCss";
import { vitaraSchema } from "./schema";
import { vitaraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#15803D",
  secondary: "#052E16",
  accent: "#A3E635",
  background: "#F7FEE7",
  surface: "#FFFFFF",
  text: "#14532D",
  muted: "#3F6212",
  dark: "#052E16",
};

export const vitaraSeed = {
  id: "vitara",
  key: "vitara",
  name: "Vitara",
  title: "Vitara",
  description: "חנות ויטמינים ותוספי תזונה: 11 עמודים עם גריד נקי וקטלוג חי.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "vitamins-supplements",
  layout: "doseGrid",
  image: (vitaraDefaultData as Record<string, any>).heroImage,
  heroTitle: (vitaraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (vitaraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "vitara-header", title: "Header" },
    { type: "hero", variant: "vitara-hero", title: "Hero" },
    { type: "categories", variant: "vitara-categories", title: "Categories" },
    { type: "store", variant: "vitara-products", title: "Products" },
    { type: "gallery", variant: "vitara-lookbook", title: "Lookbook" },
    { type: "about", variant: "vitara-about", title: "About" },
    { type: "testimonials", variant: "vitara-reviews", title: "Testimonials" },
    { type: "faq", variant: "vitara-faq", title: "FAQ" },
    { type: "contact", variant: "vitara-contact", title: "Contact" },
    { type: "footer", variant: "vitara-footer", title: "Footer" },
  ].map((block, index) => ({ id: `vitara-${index + 1}-${block.type}`, ...block })),
  pages: vitaraPages,
  editor: { pages: vitaraPages, css: vitaraEditorCss },
  css: vitaraEditorCss,
  data: vitaraDefaultData,
  defaultData: vitaraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const vitaraTemplate = {
  id: "vitara",
  key: "vitara",
  name: "Vitara",
  title: "Vitara",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "חנות ויטמינים ותוספי תזונה: 11 עמודים עם גריד נקי וקטלוג חי.",
  thumbnail: React.createElement(VitaraThumbnail),
  preview: React.createElement(VitaraPreview),
  component: VitaraPages,
  Component: VitaraPages,
  seed: vitaraSeed,
  pages: vitaraPages,
  editorCss: vitaraEditorCss,
  schema: vitaraSchema,
  defaultData: vitaraDefaultData,
  renderer: {
    key: "vitara",
    name: "Vitara",
    Component: VitaraPages,
    component: VitaraPages,
    pages: vitaraPages,
    editorMode: "visual-react",
    editorCss: vitaraEditorCss,
    schema: vitaraSchema,
    defaultData: vitaraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default vitaraTemplate;
