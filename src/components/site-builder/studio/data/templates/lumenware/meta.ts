import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import LumenwarePages, { lumenwarePages } from "./pages";
import LumenwarePreview from "./preview";
import LumenwareThumbnail from "./thumbnail";
import { lumenwareEditorCss } from "./editorCss";
import { lumenwareSchema } from "./schema";
import { lumenwareDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#0EA5E9",
  secondary: "#02070C",
  accent: "#38BDF8",
  background: "#07111A",
  surface: "#122232",
  text: "#E8F4FF",
  muted: "#8AA9C2",
  dark: "#02070C",
};

export const lumenwareSeed = {
  id: "lumenware",
  key: "lumenware",
  name: "Lumenware",
  title: "Lumenware",
  description: "חנות אלקטרוניקה וגאדג׳טים מלאה: 8 עמודים, קטגוריות, סינונים, סל ומוצרים מתוסף החנות.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "electronics",
  layout: "full-store",
  image: (lumenwareDefaultData as Record<string, any>).heroImage,
  heroTitle: (lumenwareDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (lumenwareDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "lumenware-header", title: "Header" },
    { type: "hero", variant: "lumenware-hero", title: "Hero" },
    { type: "categories", variant: "lumenware-categories", title: "Categories" },
    { type: "store", variant: "lumenware-products", title: "Products" },
    { type: "gallery", variant: "lumenware-lookbook", title: "Lookbook" },
    { type: "testimonials", variant: "lumenware-reviews", title: "Testimonials" },
    { type: "faq", variant: "lumenware-faq", title: "FAQ" },
    { type: "contact", variant: "lumenware-contact", title: "Contact" },
    { type: "footer", variant: "lumenware-footer", title: "Footer" },
  ].map((block, index) => ({ id: `lumenware-${index + 1}-${block.type}`, ...block })),
  pages: lumenwarePages,
  editor: { pages: lumenwarePages, css: lumenwareEditorCss },
  css: lumenwareEditorCss,
  data: lumenwareDefaultData,
  defaultData: lumenwareDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const lumenwareTemplate = {
  id: "lumenware",
  key: "lumenware",
  name: "Lumenware",
  title: "Lumenware",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "חנות אלקטרוניקה וגאדג׳טים מלאה עם 8 עמודים, סינונים ומוצרים מתוסף החנות.",
  thumbnail: React.createElement(LumenwareThumbnail),
  preview: React.createElement(LumenwarePreview),
  component: LumenwarePages,
  Component: LumenwarePages,
  seed: lumenwareSeed,
  pages: lumenwarePages,
  editorCss: lumenwareEditorCss,
  schema: lumenwareSchema,
  defaultData: lumenwareDefaultData,
  renderer: {
    key: "lumenware",
    name: "Lumenware",
    Component: LumenwarePages,
    component: LumenwarePages,
    pages: lumenwarePages,
    editorMode: "visual-react",
    editorCss: lumenwareEditorCss,
    schema: lumenwareSchema,
    defaultData: lumenwareDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default lumenwareTemplate;
