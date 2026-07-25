import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import PharmoraPages, { pharmoraPages } from "./pages";
import PharmoraPreview from "./preview";
import PharmoraThumbnail from "./thumbnail";
import { pharmoraEditorCss } from "./editorCss";
import { pharmoraSchema } from "./schema";
import { pharmoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#0369A1",
  secondary: "#082F49",
  accent: "#34D399",
  background: "#F0F9FF",
  surface: "#FFFFFF",
  text: "#0C4A6E",
  muted: "#0369A1",
  dark: "#082F49",
};

export const pharmoraSeed = {
  id: "pharmora",
  key: "pharmora",
  name: "Pharmora",
  title: "Pharmora",
  description: "חנות פארם וטיפוח: ויטמינים, טיפוח ועזרה ראשונה — 11 עמודים מלאים.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "pharmacy-care",
  layout: "cleanCabinet",
  image: (pharmoraDefaultData as Record<string, any>).heroImage,
  heroTitle: (pharmoraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (pharmoraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "pharmora-header", title: "Header" },
    { type: "hero", variant: "pharmora-hero", title: "Hero" },
    { type: "categories", variant: "pharmora-categories", title: "Categories" },
    { type: "store", variant: "pharmora-products", title: "Products" },
    { type: "gallery", variant: "pharmora-lookbook", title: "Lookbook" },
    { type: "about", variant: "pharmora-about", title: "About" },
    { type: "testimonials", variant: "pharmora-reviews", title: "Testimonials" },
    { type: "faq", variant: "pharmora-faq", title: "FAQ" },
    { type: "contact", variant: "pharmora-contact", title: "Contact" },
    { type: "footer", variant: "pharmora-footer", title: "Footer" },
  ].map((block, index) => ({ id: `pharmora-${index + 1}-${block.type}`, ...block })),
  pages: pharmoraPages,
  editor: { pages: pharmoraPages, css: pharmoraEditorCss },
  css: pharmoraEditorCss,
  data: pharmoraDefaultData,
  defaultData: pharmoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const pharmoraTemplate = {
  id: "pharmora",
  key: "pharmora",
  name: "Pharmora",
  title: "Pharmora",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "חנות פארם וטיפוח: ויטמינים, טיפוח ועזרה ראשונה — 11 עמודים מלאים.",
  thumbnail: React.createElement(PharmoraThumbnail),
  preview: React.createElement(PharmoraPreview),
  component: PharmoraPages,
  Component: PharmoraPages,
  seed: pharmoraSeed,
  pages: pharmoraPages,
  editorCss: pharmoraEditorCss,
  schema: pharmoraSchema,
  defaultData: pharmoraDefaultData,
  renderer: {
    key: "pharmora",
    name: "Pharmora",
    Component: PharmoraPages,
    component: PharmoraPages,
    pages: pharmoraPages,
    editorMode: "visual-react",
    editorCss: pharmoraEditorCss,
    schema: pharmoraSchema,
    defaultData: pharmoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default pharmoraTemplate;
