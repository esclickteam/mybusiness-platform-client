import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import SignetPages, { signetPages } from "./pages";
import SignetPreview from "./preview";
import SignetThumbnail from "./thumbnail";
import { signetEditorCss } from "./editorCss";
import { signetSchema } from "./schema";
import { signetDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#b8860b", secondary: "#b8a898", accent: "#b8860b",
  background: "#1a1814", surface: "#2a2620", text: "#f5f0e6", muted: "#b8a898", dark: "#0d0c0a",
};

export const signetSeed = {
  id: "signet", key: "signet", name: "Signet", title: "Signet",
  description: "תבנית stamp: הירo עם אנימציית חותמת, 4 שלבי תהליך עם stamp reveal ונכס spotlight.",
  category: "real-estate", categoryLabel: "נדל״ן", niche: "תהליך עסקה · חותמת", layout: "full",
  image: (signetDefaultData as any).heroImage,
  heroTitle: (signetDefaultData as any).heroTitle,
  heroSubtitle: (signetDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "signet-nav", title: "Nav" },
    { type: "hero", variant: "stamp-seal", title: "Hero" },
    { type: "process", variant: "stamp-steps", title: "Steps" },
    { type: "spotlight", variant: "listing-spotlight", title: "Spotlight" },
    { type: "gallery", variant: "parallax-showcase", title: "Gallery" },
    { type: "team", variant: "agent-grid", title: "Agents" },
    { type: "testimonials", variant: "premium-carousel", title: "Testimonials" },
    { type: "stats", variant: "trust-badges", title: "Stats" },
    { type: "insights", variant: "market-cards", title: "Insights" },
    { type: "about", variant: "trust-story", title: "About" },
    { type: "faq", variant: "accordion-premium", title: "FAQ" },
    { type: "contact", variant: "deal-form", title: "Contact" },
    { type: "footer", variant: "minimal", title: "Footer" },
  ].map((b, i) => ({ id: `signet-${i+1}-${b.type}`, ...b })),
  pages: signetPages,
  editor: { pages: signetPages, css: signetEditorCss },
  css: signetEditorCss, data: signetDefaultData, defaultData: signetDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const signetTemplate = {
  id: "signet", key: "signet", name: "Signet", title: "Signet", author: "Bizuply", priceLabel: "כלול",
  category: "real-estate", categoryLabel: "נדל״ן", badge: "חדש",
  description: "תבנית stamp: הירo עם אנימציית חותמת, 4 שלבי תהליך עם stamp reveal ונכס spotlight.",
  thumbnail: React.createElement(SignetThumbnail),
  preview: React.createElement(SignetPreview),
  component: SignetPages, Component: SignetPages,
  seed: signetSeed, pages: signetPages, editorCss: signetEditorCss, schema: signetSchema, defaultData: signetDefaultData,
  renderer: {
    key: "signet", name: "Signet", Component: SignetPages, component: SignetPages, pages: signetPages,
    editorMode: "visual-react", editorCss: signetEditorCss, schema: signetSchema, defaultData: signetDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default signetTemplate;
