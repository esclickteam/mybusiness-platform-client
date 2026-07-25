import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import TrailhausPages, { trailhausPages } from "./pages";
import TrailhausPreview from "./preview";
import TrailhausThumbnail from "./thumbnail";
import { trailhausEditorCss } from "./editorCss";
import { trailhausSchema } from "./schema";
import { trailhausDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#166534",
  secondary: "#052E16",
  accent: "#F59E0B",
  background: "#F4F7F0",
  surface: "#FFFFFF",
  text: "#14532D",
  muted: "#3F6212",
  dark: "#052E16",
};

export const trailhausSeed = {
  id: "trailhaus",
  key: "trailhaus",
  name: "Trailhaus",
  title: "Trailhaus",
  description: "חנות outdoor מלאה: ציוד שטח, אוהלים ותרמילים — 11 עמודים עם 10 סקשנים בכל אחד.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "outdoor-camping",
  layout: "ridgeTrail",
  image: (trailhausDefaultData as Record<string, any>).heroImage,
  heroTitle: (trailhausDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (trailhausDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "trailhaus-header", title: "Header" },
    { type: "hero", variant: "trailhaus-hero", title: "Hero" },
    { type: "categories", variant: "trailhaus-categories", title: "Categories" },
    { type: "store", variant: "trailhaus-products", title: "Products" },
    { type: "gallery", variant: "trailhaus-lookbook", title: "Lookbook" },
    { type: "about", variant: "trailhaus-about", title: "About" },
    { type: "testimonials", variant: "trailhaus-reviews", title: "Testimonials" },
    { type: "faq", variant: "trailhaus-faq", title: "FAQ" },
    { type: "contact", variant: "trailhaus-contact", title: "Contact" },
    { type: "footer", variant: "trailhaus-footer", title: "Footer" },
  ].map((block, index) => ({ id: `trailhaus-${index + 1}-${block.type}`, ...block })),
  pages: trailhausPages,
  editor: { pages: trailhausPages, css: trailhausEditorCss },
  css: trailhausEditorCss,
  data: trailhausDefaultData,
  defaultData: trailhausDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const trailhausTemplate = {
  id: "trailhaus",
  key: "trailhaus",
  name: "Trailhaus",
  title: "Trailhaus",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "חנות outdoor מלאה: ציוד שטח, אוהלים ותרמילים — 11 עמודים עם 10 סקשנים בכל אחד.",
  thumbnail: React.createElement(TrailhausThumbnail),
  preview: React.createElement(TrailhausPreview),
  component: TrailhausPages,
  Component: TrailhausPages,
  seed: trailhausSeed,
  pages: trailhausPages,
  editorCss: trailhausEditorCss,
  schema: trailhausSchema,
  defaultData: trailhausDefaultData,
  renderer: {
    key: "trailhaus",
    name: "Trailhaus",
    Component: TrailhausPages,
    component: TrailhausPages,
    pages: trailhausPages,
    editorMode: "visual-react",
    editorCss: trailhausEditorCss,
    schema: trailhausSchema,
    defaultData: trailhausDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default trailhausTemplate;
