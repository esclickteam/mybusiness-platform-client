import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import CodehausPages, { codehausPages } from "./pages";
import CodehausPreview from "./preview";
import CodehausThumbnail from "./thumbnail";
import { codehausEditorCss } from "./editorCss";
import { codehausSchema } from "./schema";
import { codehausDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#22C55E",
  secondary: "#020617",
  accent: "#4ADE80",
  background: "#020617",
  surface: "#0F172A",
  text: "#E2E8F0",
  muted: "#64748B",
  dark: "#000000",
};

const blocks = [
  { type: "header", variant: "terminalGreen-header", title: "header" },
  { type: "hero", variant: "terminalGreen-hero", title: "hero" },
  { type: "pageHero", variant: "terminalGreen-pageHero", title: "pageHero" },
  { type: "about", variant: "terminalGreen-about", title: "about" },
  { type: "why", variant: "terminalGreen-why", title: "why" },
  { type: "method", variant: "terminalGreen-method", title: "method" },
  { type: "gallery", variant: "terminalGreen-gallery", title: "gallery" },
  { type: "outcomes", variant: "terminalGreen-outcomes", title: "outcomes" },
  { type: "pricing", variant: "terminalGreen-pricing", title: "pricing" },
  { type: "insights", variant: "terminalGreen-insights", title: "insights" },
  { type: "cta", variant: "terminalGreen-cta", title: "cta" },
  { type: "courses", variant: "terminalGreen-courses", title: "courses" },
  { type: "curriculum", variant: "terminalGreen-curriculum", title: "curriculum" },
  { type: "instructors", variant: "terminalGreen-instructors", title: "instructors" },
  { type: "stats", variant: "terminalGreen-stats", title: "stats" },
  { type: "testimonials", variant: "terminalGreen-testimonials", title: "testimonials" },
  { type: "faq", variant: "terminalGreen-faq", title: "faq" },
  { type: "contact", variant: "terminalGreen-contact", title: "contact" },
  { type: "footer", variant: "terminalGreen-footer", title: "footer" },
];

export const codehausSeed = {
  id: "codehaus",
  key: "codehaus",
  name: "Codehaus",
  title: "Codehaus",
  description: "בוטקמפ תכנות בסגנון טרמינל: הירו עם שורות מוקלדות, קורסי קוד וטיימליין.",
  category: "education",
  categoryLabel: "חינוך וקורסים",
  niche: "coding-bootcamp",
  layout: "full",
  image: (codehausDefaultData as Record<string, any>).heroImage,
  heroTitle: (codehausDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (codehausDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `codehaus-${index + 1}-${block.type}`, ...block })),
  pages: codehausPages,
  editor: { pages: codehausPages, css: codehausEditorCss },
  css: codehausEditorCss,
  data: codehausDefaultData,
  defaultData: codehausDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const codehausTemplate = {
  id: "codehaus",
  key: "codehaus",
  name: "Codehaus",
  title: "Codehaus",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "education",
  categoryLabel: "חינוך וקורסים",
  badge: "Premium",
  description: "בוטקמפ תכנות בסגנון טרמינל: הירו עם שורות מוקלדות, קורסי קוד וטיימליין.",
  thumbnail: React.createElement(CodehausThumbnail),
  preview: React.createElement(CodehausPreview),
  component: CodehausPages,
  Component: CodehausPages,
  seed: codehausSeed,
  pages: codehausPages,
  editorCss: codehausEditorCss,
  schema: codehausSchema,
  defaultData: codehausDefaultData,
  renderer: {
    key: "codehaus",
    name: "Codehaus",
    Component: CodehausPages,
    component: CodehausPages,
    pages: codehausPages,
    editorMode: "visual-react",
    editorCss: codehausEditorCss,
    schema: codehausSchema,
    defaultData: codehausDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default codehausTemplate;
