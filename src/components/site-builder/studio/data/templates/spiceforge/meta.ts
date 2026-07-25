import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import SpiceforgePages, { spiceforgePages } from "./pages";
import SpiceforgePreview from "./preview";
import SpiceforgeThumbnail from "./thumbnail";
import { spiceforgeEditorCss } from "./editorCss";
import { spiceforgeSchema } from "./schema";
import { spiceforgeDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#e76f51", secondary: "#c4a08a", accent: "#e76f51",
  background: "#1a0f0a", surface: "#2a1810", text: "#fff1e0", muted: "#c4a08a", dark: "#0e0805",
};

export const spiceforgeSeed = {
  id: "spiceforge", key: "spiceforge", name: "Spiceforge", title: "Spiceforge",
  description: "תבנית מטבח הודי: הירו עם חלקיקי תבלין נופלים, גלגל תבלינים רדיאלי, שלבי מתכון בספירלה וטופס כצלחת תאלי — צבעוניות חמה ותנועת spice-fall.",
  category: "food", categoryLabel: "אוכל ומסעדות", niche: "הודו · תבלינים", layout: "full",
  image: (spiceforgeDefaultData as any).heroImage,
  heroTitle: (spiceforgeDefaultData as any).heroTitle,
  heroSubtitle: (spiceforgeDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "ornate-bordered-nav", title: "Ornate bordered nav" },
    { type: "hero", variant: "spice-particle-fall", title: "Spice particle fall hero" },
    { type: "menu", variant: "conic-spice-wheel", title: "Conic-gradient spice wheel" },
    { type: "recipe", variant: "spiral-recipe-steps", title: "Spiral recipe steps" },
    { type: "about", variant: "terracotta-turmeric", title: "Terracotta turmeric about" },
    { type: "contact", variant: "thali-circular-form", title: "Thali circular contact" },
    { type: "footer", variant: "spice-dots", title: "Spice dots footer" },
  ].map((b, i) => ({ id: `spiceforge-${i+1}-${b.type}`, ...b })),
  pages: spiceforgePages,
  editor: { pages: spiceforgePages, css: spiceforgeEditorCss },
  css: spiceforgeEditorCss, data: spiceforgeDefaultData, defaultData: spiceforgeDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const spiceforgeTemplate = {
  id: "spiceforge", key: "spiceforge", name: "Spiceforge", title: "Spiceforge", author: "Bizuply", priceLabel: "כלול",
  category: "food", categoryLabel: "אוכל ומסעדות", badge: "חדש",
  description: "תבנית מטבח הודי: הירו עם חלקיקי תבלין נופלים, גלגל תבלינים רדיאלי, שלבי מתכון בספירלה וטופס כצלחת תאלי — צבעוניות חמה ותנועת spice-fall.",
  thumbnail: React.createElement(SpiceforgeThumbnail),
  preview: React.createElement(SpiceforgePreview),
  component: SpiceforgePages, Component: SpiceforgePages,
  seed: spiceforgeSeed, pages: spiceforgePages, editorCss: spiceforgeEditorCss, schema: spiceforgeSchema, defaultData: spiceforgeDefaultData,
  renderer: {
    key: "spiceforge", name: "Spiceforge", Component: SpiceforgePages, component: SpiceforgePages, pages: spiceforgePages,
    editorMode: "visual-react", editorCss: spiceforgeEditorCss, schema: spiceforgeSchema, defaultData: spiceforgeDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default spiceforgeTemplate;
