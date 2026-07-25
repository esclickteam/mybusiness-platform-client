import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import GelatixPages, { gelatixPages } from "./pages";
import GelatixPreview from "./preview";
import GelatixThumbnail from "./thumbnail";
import { gelatixEditorCss } from "./editorCss";
import { gelatixSchema } from "./schema";
import { gelatixDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#e85a8c", secondary: "#9a6b7c", accent: "#e85a8c",
  background: "#fff5f8", surface: "#ffffff", text: "#2b1822", muted: "#9a6b7c", dark: "#1a0f14",
};

export const gelatixSeed = {
  id: "gelatix", key: "gelatix", name: "Gelatix", title: "Gelatix",
  description: "תבנית ג׳לאטו: טפטופי המסה, כדורים צפים וטופס הזמנה מתוק — קרירות איטלקית רכה.",
  category: "food", categoryLabel: "אוכל ומסעדות", niche: "גלידה · ג׳לאטו", layout: "full",
  image: (gelatixDefaultData as any).heroImage,
  heroTitle: (gelatixDefaultData as any).heroTitle,
  heroSubtitle: (gelatixDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "scoop-pill-nav", title: "Scoop pill nav" },
    { type: "hero", variant: "melt-drip-hero", title: "Melt drip gelato hero" },
    { type: "menu", variant: "scoop-ring-flavors", title: "Scoop ring flavors" },
    { type: "process", variant: "gelato-process", title: "Gelato process" },
    { type: "gallery", variant: "gelato-gallery", title: "Gelato gallery" },
    { type: "reviews", variant: "gelato-reviews", title: "Gelato reviews" },
    { type: "stats", variant: "scoop-stats", title: "Scoop stats + hours" },
    { type: "cta", variant: "gelato-home-cta", title: "Home CTA teaser" },
    { type: "scoopsPage", variant: "full-flavor-menu", title: "Full flavor menu page" },
    { type: "labPage", variant: "lab-story", title: "Lab story page" },
    { type: "about", variant: "maestro-timeline", title: "Maestro timeline" },
    { type: "contact", variant: "sweet-reserve-faq", title: "Sweet reserve + FAQ" },
    { type: "footer", variant: "drip-line", title: "Drip line footer" },
  ].map((b, i) => ({ id: `gelatix-${i+1}-${b.type}`, ...b })),
  pages: gelatixPages,
  editor: { pages: gelatixPages, css: gelatixEditorCss },
  css: gelatixEditorCss, data: gelatixDefaultData, defaultData: gelatixDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const gelatixTemplate = {
  id: "gelatix", key: "gelatix", name: "Gelatix", title: "Gelatix", author: "Bizuply", priceLabel: "כלול",
  category: "food", categoryLabel: "אוכל ומסעדות", badge: "חדש",
  description: "תבנית ג׳לאטו: טפטופי המסה, כדורים צפים וטופס הזמנה מתוק — קרירות איטלקית רכה.",
  thumbnail: React.createElement(GelatixThumbnail),
  preview: React.createElement(GelatixPreview),
  component: GelatixPages, Component: GelatixPages,
  seed: gelatixSeed, pages: gelatixPages, editorCss: gelatixEditorCss, schema: gelatixSchema, defaultData: gelatixDefaultData,
  renderer: {
    key: "gelatix", name: "Gelatix", Component: GelatixPages, component: GelatixPages, pages: gelatixPages,
    editorMode: "visual-react", editorCss: gelatixEditorCss, schema: gelatixSchema, defaultData: gelatixDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default gelatixTemplate;
