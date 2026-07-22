import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import SkyholdPages, { skyholdPages } from "./pages";
import SkyholdPreview from "./preview";
import SkyholdThumbnail from "./thumbnail";
import { skyholdEditorCss } from "./editorCss";
import { skyholdSchema } from "./schema";
import { skyholdDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#38bdf8", secondary: "#7a8fa8", accent: "#38bdf8",
  background: "#0f1419", surface: "#1a2332", text: "#e8edf5", muted: "#7a8fa8", dark: "#080c10",
};

export const skyholdSeed = {
  id: "skyhold", key: "skyhold", name: "Skyhold", title: "Skyhold",
  description: "תבנית מגדל: הירו אנכי עם מעלית קומות מונפשת, כרטיסי penthouse מוערמים וסטטיסטיקות skyline.",
  category: "real-estate", categoryLabel: "נדל״ן", niche: "מגדלי מגורים · פנטהאוזים", layout: "full",
  image: (skyholdDefaultData as any).heroImage,
  heroTitle: (skyholdDefaultData as any).heroTitle,
  heroSubtitle: (skyholdDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "tower-nav", title: "Nav" },
    { type: "hero", variant: "elevator-floors", title: "Hero" },
    { type: "penthouses", variant: "stacked-cards", title: "Penthouses" },
    { type: "stats", variant: "skyline-stats", title: "Stats" },
    { type: "gallery", variant: "parallax-showcase", title: "Gallery" },
    { type: "team", variant: "agent-grid", title: "Agents" },
    { type: "testimonials", variant: "premium-carousel", title: "Testimonials" },
    { type: "awards", variant: "marquee-strip", title: "Awards" },
    { type: "about", variant: "height-story", title: "About" },
    { type: "faq", variant: "accordion-premium", title: "FAQ" },
    { type: "contact", variant: "view-form", title: "Contact" },
    { type: "footer", variant: "minimal", title: "Footer" },
  ].map((b, i) => ({ id: `skyhold-${i+1}-${b.type}`, ...b })),
  pages: skyholdPages,
  editor: { pages: skyholdPages, css: skyholdEditorCss },
  css: skyholdEditorCss, data: skyholdDefaultData, defaultData: skyholdDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const skyholdTemplate = {
  id: "skyhold", key: "skyhold", name: "Skyhold", title: "Skyhold", author: "Bizuply", priceLabel: "כלול",
  category: "real-estate", categoryLabel: "נדל״ן", badge: "חדש",
  description: "תבנית מגדל: הירו אנכי עם מעלית קומות מונפשת, כרטיסי penthouse מוערמים וסטטיסטיקות skyline.",
  thumbnail: React.createElement(SkyholdThumbnail),
  preview: React.createElement(SkyholdPreview),
  component: SkyholdPages, Component: SkyholdPages,
  seed: skyholdSeed, pages: skyholdPages, editorCss: skyholdEditorCss, schema: skyholdSchema, defaultData: skyholdDefaultData,
  renderer: {
    key: "skyhold", name: "Skyhold", Component: SkyholdPages, component: SkyholdPages, pages: skyholdPages,
    editorMode: "visual-react", editorCss: skyholdEditorCss, schema: skyholdSchema, defaultData: skyholdDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default skyholdTemplate;
