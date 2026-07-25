import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import KidwisePages, { kidwisePages } from "./pages";
import KidwisePreview from "./preview";
import KidwiseThumbnail from "./thumbnail";
import { kidwiseEditorCss } from "./editorCss";
import { kidwiseSchema } from "./schema";
import { kidwiseDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#10B981",
  secondary: "#ECFDF5",
  accent: "#FBBF24",
  background: "#ECFDF5",
  surface: "#FFFFFF",
  text: "#064E3B",
  muted: "#6B7280",
  dark: "#022C22",
};

const blocks = [
  { type: "header", variant: "mintSunshine-header", title: "header" },
  { type: "hero", variant: "mintSunshine-hero", title: "hero" },
  { type: "pageHero", variant: "mintSunshine-pageHero", title: "pageHero" },
  { type: "about", variant: "mintSunshine-about", title: "about" },
  { type: "why", variant: "mintSunshine-why", title: "why" },
  { type: "method", variant: "mintSunshine-method", title: "method" },
  { type: "gallery", variant: "mintSunshine-gallery", title: "gallery" },
  { type: "outcomes", variant: "mintSunshine-outcomes", title: "outcomes" },
  { type: "pricing", variant: "mintSunshine-pricing", title: "pricing" },
  { type: "insights", variant: "mintSunshine-insights", title: "insights" },
  { type: "cta", variant: "mintSunshine-cta", title: "cta" },
  { type: "courses", variant: "mintSunshine-courses", title: "courses" },
  { type: "curriculum", variant: "mintSunshine-curriculum", title: "curriculum" },
  { type: "instructors", variant: "mintSunshine-instructors", title: "instructors" },
  { type: "stats", variant: "mintSunshine-stats", title: "stats" },
  { type: "testimonials", variant: "mintSunshine-testimonials", title: "testimonials" },
  { type: "faq", variant: "mintSunshine-faq", title: "faq" },
  { type: "contact", variant: "mintSunshine-contact", title: "contact" },
  { type: "footer", variant: "mintSunshine-footer", title: "footer" },
];

export const kidwiseSeed = {
  id: "kidwise",
  key: "kidwise",
  name: "Kidwise",
  title: "Kidwise",
  description: "חינוך לילדים: הירו שובב עם צורות רכות, מסלול צבעוני ומורים חברותיים.",
  category: "education",
  categoryLabel: "חינוך וקורסים",
  niche: "kids-education",
  layout: "full",
  image: (kidwiseDefaultData as Record<string, any>).heroImage,
  heroTitle: (kidwiseDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (kidwiseDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `kidwise-${index + 1}-${block.type}`, ...block })),
  pages: kidwisePages,
  editor: { pages: kidwisePages, css: kidwiseEditorCss },
  css: kidwiseEditorCss,
  data: kidwiseDefaultData,
  defaultData: kidwiseDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const kidwiseTemplate = {
  id: "kidwise",
  key: "kidwise",
  name: "Kidwise",
  title: "Kidwise",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "education",
  categoryLabel: "חינוך וקורסים",
  badge: "חדש",
  description: "חינוך לילדים: הירו שובב עם צורות רכות, מסלול צבעוני ומורים חברותיים.",
  thumbnail: React.createElement(KidwiseThumbnail),
  preview: React.createElement(KidwisePreview),
  component: KidwisePages,
  Component: KidwisePages,
  seed: kidwiseSeed,
  pages: kidwisePages,
  editorCss: kidwiseEditorCss,
  schema: kidwiseSchema,
  defaultData: kidwiseDefaultData,
  renderer: {
    key: "kidwise",
    name: "Kidwise",
    Component: KidwisePages,
    component: KidwisePages,
    pages: kidwisePages,
    editorMode: "visual-react",
    editorCss: kidwiseEditorCss,
    schema: kidwiseSchema,
    defaultData: kidwiseDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default kidwiseTemplate;
