import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import GleamoraPages, { gleamoraPages } from "./pages";
import GleamoraPreview from "./preview";
import GleamoraThumbnail from "./thumbnail";
import { gleamoraEditorCss } from "./editorCss";
import { gleamoraSchema } from "./schema";
import { gleamoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#A16207",
  secondary: "#0C0A09",
  accent: "#FDE68A",
  background: "#FFFBEB",
  surface: "#FFFFFF",
  text: "#1C1917",
  muted: "#78716C",
  dark: "#0C0A09",
};

export const gleamoraSeed = {
  id: "gleamora",
  key: "gleamora",
  name: "Gleamora",
  title: "Gleamora",
  description: "חנות תכשיטים יוקרתית: 11 עמודים, ויטרינות, וקטלוג מתוסף החנות.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "fine-jewelry",
  layout: "luxeVitrine",
  image: (gleamoraDefaultData as Record<string, any>).heroImage,
  heroTitle: (gleamoraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (gleamoraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "gleamora-header", title: "Header" },
    { type: "hero", variant: "gleamora-hero", title: "Hero" },
    { type: "categories", variant: "gleamora-categories", title: "Categories" },
    { type: "store", variant: "gleamora-products", title: "Products" },
    { type: "gallery", variant: "gleamora-lookbook", title: "Lookbook" },
    { type: "about", variant: "gleamora-about", title: "About" },
    { type: "testimonials", variant: "gleamora-reviews", title: "Testimonials" },
    { type: "faq", variant: "gleamora-faq", title: "FAQ" },
    { type: "contact", variant: "gleamora-contact", title: "Contact" },
    { type: "footer", variant: "gleamora-footer", title: "Footer" },
  ].map((block, index) => ({ id: `gleamora-${index + 1}-${block.type}`, ...block })),
  pages: gleamoraPages,
  editor: { pages: gleamoraPages, css: gleamoraEditorCss },
  css: gleamoraEditorCss,
  data: gleamoraDefaultData,
  defaultData: gleamoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const gleamoraTemplate = {
  id: "gleamora",
  key: "gleamora",
  name: "Gleamora",
  title: "Gleamora",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "חנות תכשיטים יוקרתית: 11 עמודים, ויטרינות, וקטלוג מתוסף החנות.",
  thumbnail: React.createElement(GleamoraThumbnail),
  preview: React.createElement(GleamoraPreview),
  component: GleamoraPages,
  Component: GleamoraPages,
  seed: gleamoraSeed,
  pages: gleamoraPages,
  editorCss: gleamoraEditorCss,
  schema: gleamoraSchema,
  defaultData: gleamoraDefaultData,
  renderer: {
    key: "gleamora",
    name: "Gleamora",
    Component: GleamoraPages,
    component: GleamoraPages,
    pages: gleamoraPages,
    editorMode: "visual-react",
    editorCss: gleamoraEditorCss,
    schema: gleamoraSchema,
    defaultData: gleamoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default gleamoraTemplate;
