import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import BrewlinePages, { brewlinePages } from "./pages";
import BrewlinePreview from "./preview";
import BrewlineThumbnail from "./thumbnail";
import { brewlineEditorCss } from "./editorCss";
import { brewlineSchema } from "./schema";
import { brewlineDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  "primary": "#8B5E3C",
  "secondary": "#1A1410",
  "accent": "#C4A484",
  "background": "#1A1410",
  "surface": "#241C16",
  "text": "#F6EFE6",
  "muted": "#B3A294",
  "dark": "#0E0A08"
};

export const brewlineSeed = {
  id: "brewline",
  key: "brewline",
  name: "Brewline",
  title: "Brewline",
  description: "דף נחיתה מקצועי לתחום בית קפה עם תנועה, אפקטים ועיצוב ייחודי.",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  niche: "cafe",
  layout: "full",
  image: (brewlineDefaultData as any).heroImage,
  heroTitle: (brewlineDefaultData as any).heroTitle,
  heroSubtitle: (brewlineDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "brewline-header", title: "header" },
    { type: "hero", variant: "brewline-hero", title: "hero" },
    { type: "services", variant: "brewline-services", title: "services" },
    { type: "showcase", variant: "brewline-showcase", title: "showcase" },
    { type: "stats", variant: "brewline-stats", title: "stats" },
    { type: "process", variant: "brewline-process", title: "process" },
    { type: "testimonials", variant: "brewline-testimonials", title: "testimonials" },
    { type: "faq", variant: "brewline-faq", title: "faq" },
    { type: "contact", variant: "brewline-contact", title: "contact" },
    { type: "footer", variant: "brewline-footer", title: "footer" },
  ].map((block, index) => ({ id: `brewline-${index + 1}-${block.type}`, ...block })),
  pages: brewlinePages,
  editor: { pages: brewlinePages, css: brewlineEditorCss },
  css: brewlineEditorCss,
  data: brewlineDefaultData,
  defaultData: brewlineDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const brewlineTemplate = {
  id: "brewline",
  key: "brewline",
  name: "Brewline",
  title: "Brewline",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  badge: "חדש",
  description: "דף נחיתה מקצועי לתחום בית קפה עם תנועה, אפקטים ועיצוב ייחודי.",
  thumbnail: React.createElement(BrewlineThumbnail),
  preview: React.createElement(BrewlinePreview),
  component: BrewlinePages,
  Component: BrewlinePages,
  seed: brewlineSeed,
  pages: brewlinePages,
  editorCss: brewlineEditorCss,
  schema: brewlineSchema,
  defaultData: brewlineDefaultData,
  renderer: {
    key: "brewline",
    name: "Brewline",
    Component: BrewlinePages,
    component: BrewlinePages,
    pages: brewlinePages,
    editorMode: "visual-react",
    editorCss: brewlineEditorCss,
    schema: brewlineSchema,
    defaultData: brewlineDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default brewlineTemplate;
