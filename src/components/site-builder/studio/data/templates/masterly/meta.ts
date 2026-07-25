import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import MasterlyPages, { masterlyPages } from "./pages";
import MasterlyPreview from "./preview";
import MasterlyThumbnail from "./thumbnail";
import { masterlyEditorCss } from "./editorCss";
import { masterlySchema } from "./schema";
import { masterlyDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#D4AF37",
  secondary: "#0A0A0A",
  accent: "#F5E6C8",
  background: "#0A0A0A",
  surface: "#171717",
  text: "#FAF7F0",
  muted: "#A3A3A3",
  dark: "#000000",
};

const blocks = [
  { type: "header", variant: "champagneNoir-header", title: "header" },
  { type: "hero", variant: "champagneNoir-hero", title: "hero" },
  { type: "pageHero", variant: "champagneNoir-pageHero", title: "pageHero" },
  { type: "about", variant: "champagneNoir-about", title: "about" },
  { type: "why", variant: "champagneNoir-why", title: "why" },
  { type: "method", variant: "champagneNoir-method", title: "method" },
  { type: "gallery", variant: "champagneNoir-gallery", title: "gallery" },
  { type: "outcomes", variant: "champagneNoir-outcomes", title: "outcomes" },
  { type: "pricing", variant: "champagneNoir-pricing", title: "pricing" },
  { type: "insights", variant: "champagneNoir-insights", title: "insights" },
  { type: "cta", variant: "champagneNoir-cta", title: "cta" },
  { type: "courses", variant: "champagneNoir-courses", title: "courses" },
  { type: "curriculum", variant: "champagneNoir-curriculum", title: "curriculum" },
  { type: "instructors", variant: "champagneNoir-instructors", title: "instructors" },
  { type: "stats", variant: "champagneNoir-stats", title: "stats" },
  { type: "testimonials", variant: "champagneNoir-testimonials", title: "testimonials" },
  { type: "faq", variant: "champagneNoir-faq", title: "faq" },
  { type: "contact", variant: "champagneNoir-contact", title: "contact" },
  { type: "footer", variant: "champagneNoir-footer", title: "footer" },
];

export const masterlySeed = {
  id: "masterly",
  key: "masterly",
  name: "Masterly",
  title: "Masterly",
  description: "מאסטרקלאס יוקרתי: הירו מותג־דומיננטי, כיתות מודגשות ומאסטרים באור זרקור.",
  category: "education",
  categoryLabel: "חינוך וקורסים",
  niche: "masterclass",
  layout: "full",
  image: (masterlyDefaultData as Record<string, any>).heroImage,
  heroTitle: (masterlyDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (masterlyDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `masterly-${index + 1}-${block.type}`, ...block })),
  pages: masterlyPages,
  editor: { pages: masterlyPages, css: masterlyEditorCss },
  css: masterlyEditorCss,
  data: masterlyDefaultData,
  defaultData: masterlyDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const masterlyTemplate = {
  id: "masterly",
  key: "masterly",
  name: "Masterly",
  title: "Masterly",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "education",
  categoryLabel: "חינוך וקורסים",
  badge: "Premium",
  description: "מאסטרקלאס יוקרתי: הירו מותג־דומיננטי, כיתות מודגשות ומאסטרים באור זרקור.",
  thumbnail: React.createElement(MasterlyThumbnail),
  preview: React.createElement(MasterlyPreview),
  component: MasterlyPages,
  Component: MasterlyPages,
  seed: masterlySeed,
  pages: masterlyPages,
  editorCss: masterlyEditorCss,
  schema: masterlySchema,
  defaultData: masterlyDefaultData,
  renderer: {
    key: "masterly",
    name: "Masterly",
    Component: MasterlyPages,
    component: MasterlyPages,
    pages: masterlyPages,
    editorMode: "visual-react",
    editorCss: masterlyEditorCss,
    schema: masterlySchema,
    defaultData: masterlyDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default masterlyTemplate;
