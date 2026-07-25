import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import WheeloraPages, { wheeloraPages } from "./pages";
import WheeloraPreview from "./preview";
import WheeloraThumbnail from "./thumbnail";
import { wheeloraEditorCss } from "./editorCss";
import { wheeloraSchema } from "./schema";
import { wheeloraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#DC2626",
  secondary: "#0F172A",
  accent: "#FDE047",
  background: "#FAFAFA",
  surface: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
  dark: "#0F172A",
};

export const wheeloraSeed = {
  id: "wheelora",
  key: "wheelora",
  name: "Wheelora",
  title: "Wheelora",
  description: "חנות אופניים מלאה: כביש, שטח ואביזרי רכיבה — 11 עמודים עם תוכן עשיר.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "bicycles",
  layout: "veloTrack",
  image: (wheeloraDefaultData as Record<string, any>).heroImage,
  heroTitle: (wheeloraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (wheeloraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "wheelora-header", title: "Header" },
    { type: "hero", variant: "wheelora-hero", title: "Hero" },
    { type: "categories", variant: "wheelora-categories", title: "Categories" },
    { type: "store", variant: "wheelora-products", title: "Products" },
    { type: "gallery", variant: "wheelora-lookbook", title: "Lookbook" },
    { type: "about", variant: "wheelora-about", title: "About" },
    { type: "testimonials", variant: "wheelora-reviews", title: "Testimonials" },
    { type: "faq", variant: "wheelora-faq", title: "FAQ" },
    { type: "contact", variant: "wheelora-contact", title: "Contact" },
    { type: "footer", variant: "wheelora-footer", title: "Footer" },
  ].map((block, index) => ({ id: `wheelora-${index + 1}-${block.type}`, ...block })),
  pages: wheeloraPages,
  editor: { pages: wheeloraPages, css: wheeloraEditorCss },
  css: wheeloraEditorCss,
  data: wheeloraDefaultData,
  defaultData: wheeloraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const wheeloraTemplate = {
  id: "wheelora",
  key: "wheelora",
  name: "Wheelora",
  title: "Wheelora",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "חנות אופניים מלאה: כביש, שטח ואביזרי רכיבה — 11 עמודים עם תוכן עשיר.",
  thumbnail: React.createElement(WheeloraThumbnail),
  preview: React.createElement(WheeloraPreview),
  component: WheeloraPages,
  Component: WheeloraPages,
  seed: wheeloraSeed,
  pages: wheeloraPages,
  editorCss: wheeloraEditorCss,
  schema: wheeloraSchema,
  defaultData: wheeloraDefaultData,
  renderer: {
    key: "wheelora",
    name: "Wheelora",
    Component: WheeloraPages,
    component: WheeloraPages,
    pages: wheeloraPages,
    editorMode: "visual-react",
    editorCss: wheeloraEditorCss,
    schema: wheeloraSchema,
    defaultData: wheeloraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default wheeloraTemplate;
