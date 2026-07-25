import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import LinenhausPages, { linenhausPages } from "./pages";
import LinenhausPreview from "./preview";
import LinenhausThumbnail from "./thumbnail";
import { linenhausEditorCss } from "./editorCss";
import { linenhausSchema } from "./schema";
import { linenhausDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#9A3412",
  secondary: "#431407",
  accent: "#FDBA74",
  background: "#FFF7ED",
  surface: "#FFFFFF",
  text: "#7C2D12",
  muted: "#9A3412",
  dark: "#431407",
};

export const linenhausSeed = {
  id: "linenhaus",
  key: "linenhaus",
  name: "Linenhaus",
  title: "Linenhaus",
  description: "חנות טקסטיל לבית: מצעים, מגבות ווילונות — 11 עמודים עשירים.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "home-textiles",
  layout: "softFold",
  image: (linenhausDefaultData as Record<string, any>).heroImage,
  heroTitle: (linenhausDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (linenhausDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "linenhaus-header", title: "Header" },
    { type: "hero", variant: "linenhaus-hero", title: "Hero" },
    { type: "categories", variant: "linenhaus-categories", title: "Categories" },
    { type: "store", variant: "linenhaus-products", title: "Products" },
    { type: "gallery", variant: "linenhaus-lookbook", title: "Lookbook" },
    { type: "about", variant: "linenhaus-about", title: "About" },
    { type: "testimonials", variant: "linenhaus-reviews", title: "Testimonials" },
    { type: "faq", variant: "linenhaus-faq", title: "FAQ" },
    { type: "contact", variant: "linenhaus-contact", title: "Contact" },
    { type: "footer", variant: "linenhaus-footer", title: "Footer" },
  ].map((block, index) => ({ id: `linenhaus-${index + 1}-${block.type}`, ...block })),
  pages: linenhausPages,
  editor: { pages: linenhausPages, css: linenhausEditorCss },
  css: linenhausEditorCss,
  data: linenhausDefaultData,
  defaultData: linenhausDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const linenhausTemplate = {
  id: "linenhaus",
  key: "linenhaus",
  name: "Linenhaus",
  title: "Linenhaus",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "חנות טקסטיל לבית: מצעים, מגבות ווילונות — 11 עמודים עשירים.",
  thumbnail: React.createElement(LinenhausThumbnail),
  preview: React.createElement(LinenhausPreview),
  component: LinenhausPages,
  Component: LinenhausPages,
  seed: linenhausSeed,
  pages: linenhausPages,
  editorCss: linenhausEditorCss,
  schema: linenhausSchema,
  defaultData: linenhausDefaultData,
  renderer: {
    key: "linenhaus",
    name: "Linenhaus",
    Component: LinenhausPages,
    component: LinenhausPages,
    pages: linenhausPages,
    editorMode: "visual-react",
    editorCss: linenhausEditorCss,
    schema: linenhausSchema,
    defaultData: linenhausDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default linenhausTemplate;
