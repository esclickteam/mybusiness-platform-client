import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import BooknookPages, { booknookPages } from "./pages";
import BooknookPreview from "./preview";
import BooknookThumbnail from "./thumbnail";
import { booknookEditorCss } from "./editorCss";
import { booknookSchema } from "./schema";
import { booknookDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#1D4ED8",
  secondary: "#020617",
  accent: "#93C5FD",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  text: "#0F172A",
  muted: "#64748B",
  dark: "#020617",
};

export const booknookSeed = {
  id: "booknook",
  key: "booknook",
  name: "Booknook",
  title: "Booknook",
  description: "חנות ספרים ומכתבים מלאה: 8 עמודים, קטגוריות, סינונים, סל ומוצרים מתוסף החנות.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "books-stationery",
  layout: "full-store",
  image: (booknookDefaultData as Record<string, any>).heroImage,
  heroTitle: (booknookDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (booknookDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "booknook-header", title: "Header" },
    { type: "hero", variant: "booknook-hero", title: "Hero" },
    { type: "categories", variant: "booknook-categories", title: "Categories" },
    { type: "store", variant: "booknook-products", title: "Products" },
    { type: "gallery", variant: "booknook-lookbook", title: "Lookbook" },
    { type: "testimonials", variant: "booknook-reviews", title: "Testimonials" },
    { type: "faq", variant: "booknook-faq", title: "FAQ" },
    { type: "contact", variant: "booknook-contact", title: "Contact" },
    { type: "footer", variant: "booknook-footer", title: "Footer" },
  ].map((block, index) => ({ id: `booknook-${index + 1}-${block.type}`, ...block })),
  pages: booknookPages,
  editor: { pages: booknookPages, css: booknookEditorCss },
  css: booknookEditorCss,
  data: booknookDefaultData,
  defaultData: booknookDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const booknookTemplate = {
  id: "booknook",
  key: "booknook",
  name: "Booknook",
  title: "Booknook",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "חנות ספרים ומכתבים מלאה עם 8 עמודים, סינונים ומוצרים מתוסף החנות.",
  thumbnail: React.createElement(BooknookThumbnail),
  preview: React.createElement(BooknookPreview),
  component: BooknookPages,
  Component: BooknookPages,
  seed: booknookSeed,
  pages: booknookPages,
  editorCss: booknookEditorCss,
  schema: booknookSchema,
  defaultData: booknookDefaultData,
  renderer: {
    key: "booknook",
    name: "Booknook",
    Component: BooknookPages,
    component: BooknookPages,
    pages: booknookPages,
    editorMode: "visual-react",
    editorCss: booknookEditorCss,
    schema: booknookSchema,
    defaultData: booknookDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default booknookTemplate;
