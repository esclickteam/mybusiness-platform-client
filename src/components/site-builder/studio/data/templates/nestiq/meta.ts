import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import NestiqPages, { nestiqPages } from "./pages";
import NestiqPreview from "./preview";
import NestiqThumbnail from "./thumbnail";
import { nestiqEditorCss } from "./editorCss";
import { nestiqSchema } from "./schema";
import { nestiqDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#7c3aed", secondary: "#6366f1", accent: "#7c3aed",
  background: "#faf5ff", surface: "#ffffff", text: "#1e1b4b", muted: "#6366f1", dark: "#0f0a1e",
};

export const nestiqSeed = {
  id: "nestiq", key: "nestiq", name: "Nestiq", title: "Nestiq",
  description: "תבנית counters: הירo עם סטטיסטיקות מונפשות, כרטיסי נכס עם badges ו-FAQ ויזואלי.",
  category: "real-estate", categoryLabel: "נדל״ן", niche: "נדל״ן חכם · נתונים", layout: "full",
  image: (nestiqDefaultData as any).heroImage,
  heroTitle: (nestiqDefaultData as any).heroTitle,
  heroSubtitle: (nestiqDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "counter-nav", title: "Nav" },
    { type: "hero", variant: "live-stats", title: "Hero" },
    { type: "listings", variant: "badge-cards", title: "Cards" },
    { type: "faq", variant: "accordion-visual", title: "FAQ" },
    { type: "gallery", variant: "parallax-showcase", title: "Gallery" },
    { type: "team", variant: "agent-grid", title: "Agents" },
    { type: "testimonials", variant: "premium-carousel", title: "Testimonials" },
    { type: "stats", variant: "trust-badges", title: "Stats" },
    { type: "insights", variant: "market-cards", title: "Insights" },
    { type: "about", variant: "data-story", title: "About" },
    { type: "contact", variant: "smart-form", title: "Contact" },
    { type: "footer", variant: "minimal", title: "Footer" },
  ].map((b, i) => ({ id: `nestiq-${i+1}-${b.type}`, ...b })),
  pages: nestiqPages,
  editor: { pages: nestiqPages, css: nestiqEditorCss },
  css: nestiqEditorCss, data: nestiqDefaultData, defaultData: nestiqDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const nestiqTemplate = {
  id: "nestiq", key: "nestiq", name: "Nestiq", title: "Nestiq", author: "Bizuply", priceLabel: "כלול",
  category: "real-estate", categoryLabel: "נדל״ן", badge: "חדש",
  description: "תבנית counters: הירo עם סטטיסטיקות מונפשות, כרטיסי נכס עם badges ו-FAQ ויזואלי.",
  thumbnail: React.createElement(NestiqThumbnail),
  preview: React.createElement(NestiqPreview),
  component: NestiqPages, Component: NestiqPages,
  seed: nestiqSeed, pages: nestiqPages, editorCss: nestiqEditorCss, schema: nestiqSchema, defaultData: nestiqDefaultData,
  renderer: {
    key: "nestiq", name: "Nestiq", Component: NestiqPages, component: NestiqPages, pages: nestiqPages,
    editorMode: "visual-react", editorCss: nestiqEditorCss, schema: nestiqSchema, defaultData: nestiqDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default nestiqTemplate;
