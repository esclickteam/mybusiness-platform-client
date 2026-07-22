import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import DwellistPages, { dwellistPages } from "./pages";
import DwellistPreview from "./preview";
import DwellistThumbnail from "./thumbnail";
import { dwellistEditorCss } from "./editorCss";
import { dwellistSchema } from "./schema";
import { dwellistDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#5c7c6a", secondary: "#8a7d6e", accent: "#5c7c6a",
  background: "#faf8f5", surface: "#ffffff", text: "#2c2419", muted: "#8a7d6e", dark: "#1a1510",
};

export const dwellistSeed = {
  id: "dwellist", key: "dwellist", name: "Dwellist", title: "Dwellist",
  description: "תבנית תוכנית קומה: הירו מפוצל עם SVG מונפש, כרטיסי חדרים, השוואת נכסים ומחשבון משכנתא דקורטיבי.",
  category: "real-estate", categoryLabel: "נדל״ן", niche: "תכנון מגורים · נדל״ן", layout: "full",
  image: (dwellistDefaultData as any).heroImage,
  heroTitle: (dwellistDefaultData as any).heroTitle,
  heroSubtitle: (dwellistDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "plan-nav", title: "Nav" },
    { type: "hero", variant: "floor-plan-split", title: "Hero" },
    { type: "rooms", variant: "hotspot-cards", title: "Hotspots" },
    { type: "compare", variant: "property-compare", title: "Compare" },
    { type: "mortgage", variant: "calc-visual", title: "Mortgage" },
    { type: "gallery", variant: "parallax-showcase", title: "Gallery" },
    { type: "team", variant: "agent-grid", title: "Agents" },
    { type: "testimonials", variant: "premium-carousel", title: "Testimonials" },
    { type: "stats", variant: "trust-badges", title: "Stats" },
    { type: "about", variant: "dwell-story", title: "About" },
    { type: "faq", variant: "accordion-premium", title: "FAQ" },
    { type: "contact", variant: "plan-form", title: "Contact" },
    { type: "footer", variant: "minimal", title: "Footer" },
  ].map((b, i) => ({ id: `dwellist-${i+1}-${b.type}`, ...b })),
  pages: dwellistPages,
  editor: { pages: dwellistPages, css: dwellistEditorCss },
  css: dwellistEditorCss, data: dwellistDefaultData, defaultData: dwellistDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const dwellistTemplate = {
  id: "dwellist", key: "dwellist", name: "Dwellist", title: "Dwellist", author: "Bizuply", priceLabel: "כלול",
  category: "real-estate", categoryLabel: "נדל״ן", badge: "חדש",
  description: "תבנית תוכנית קומה: הירו מפוצל עם SVG מונפש, כרטיסי חדרים, השוואת נכסים ומחשבון משכנתא דקורטיבי.",
  thumbnail: React.createElement(DwellistThumbnail),
  preview: React.createElement(DwellistPreview),
  component: DwellistPages, Component: DwellistPages,
  seed: dwellistSeed, pages: dwellistPages, editorCss: dwellistEditorCss, schema: dwellistSchema, defaultData: dwellistDefaultData,
  renderer: {
    key: "dwellist", name: "Dwellist", Component: DwellistPages, component: DwellistPages, pages: dwellistPages,
    editorMode: "visual-react", editorCss: dwellistEditorCss, schema: dwellistSchema, defaultData: dwellistDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default dwellistTemplate;
