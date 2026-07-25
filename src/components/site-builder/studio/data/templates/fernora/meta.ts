import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import FernoraPages, { fernoraPages } from "./pages";
import FernoraPreview from "./preview";
import FernoraThumbnail from "./thumbnail";
import { fernoraEditorCss } from "./editorCss";
import { fernoraSchema } from "./schema";
import { fernoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#15803D",
  secondary: "#052E16",
  accent: "#86EFAC",
  background: "#F3FAF4",
  surface: "#FFFFFF",
  text: "#14532D",
  muted: "#4D7C5C",
  dark: "#052E16",
};

export const fernoraSeed = {
  id: "fernora",
  key: "fernora",
  name: "Fernora",
  title: "Fernora",
  description: "משתלה דיגיטלית: צמחי בית, עציצים וכלי גינון — 11 עמודים עשירים.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "plants-nursery",
  layout: "greenhouseGrid",
  image: (fernoraDefaultData as Record<string, any>).heroImage,
  heroTitle: (fernoraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (fernoraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "fernora-header", title: "Header" },
    { type: "hero", variant: "fernora-hero", title: "Hero" },
    { type: "categories", variant: "fernora-categories", title: "Categories" },
    { type: "store", variant: "fernora-products", title: "Products" },
    { type: "gallery", variant: "fernora-lookbook", title: "Lookbook" },
    { type: "about", variant: "fernora-about", title: "About" },
    { type: "testimonials", variant: "fernora-reviews", title: "Testimonials" },
    { type: "faq", variant: "fernora-faq", title: "FAQ" },
    { type: "contact", variant: "fernora-contact", title: "Contact" },
    { type: "footer", variant: "fernora-footer", title: "Footer" },
  ].map((block, index) => ({ id: `fernora-${index + 1}-${block.type}`, ...block })),
  pages: fernoraPages,
  editor: { pages: fernoraPages, css: fernoraEditorCss },
  css: fernoraEditorCss,
  data: fernoraDefaultData,
  defaultData: fernoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const fernoraTemplate = {
  id: "fernora",
  key: "fernora",
  name: "Fernora",
  title: "Fernora",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "משתלה דיגיטלית: צמחי בית, עציצים וכלי גינון — 11 עמודים עשירים.",
  thumbnail: React.createElement(FernoraThumbnail),
  preview: React.createElement(FernoraPreview),
  component: FernoraPages,
  Component: FernoraPages,
  seed: fernoraSeed,
  pages: fernoraPages,
  editorCss: fernoraEditorCss,
  schema: fernoraSchema,
  defaultData: fernoraDefaultData,
  renderer: {
    key: "fernora",
    name: "Fernora",
    Component: FernoraPages,
    component: FernoraPages,
    pages: fernoraPages,
    editorMode: "visual-react",
    editorCss: fernoraEditorCss,
    schema: fernoraSchema,
    defaultData: fernoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default fernoraTemplate;
