import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import SmokepitPages, { smokepitPages } from "./pages";
import SmokepitPreview from "./preview";
import SmokepitThumbnail from "./thumbnail";
import { smokepitEditorCss } from "./editorCss";
import { smokepitSchema } from "./schema";
import { smokepitDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#ea580c", secondary: "#a89078", accent: "#ea580c",
  background: "#120c08", surface: "#1c140e", text: "#f3e8d8", muted: "#a89078", dark: "#080604",
};

export const smokepitSeed = {
  id: "smokepit", key: "smokepit", name: "Smokepit", title: "Smokepit",
  description: "תבנית ברביקיו: עמודות עשן, בשר מעושן וטופס הזמנה כהה — בור כפרי לוהט.",
  category: "food", categoryLabel: "אוכל ומסעדות", niche: "ברביקיו · מעשנה", layout: "full",
  image: (smokepitDefaultData as any).heroImage,
  heroTitle: (smokepitDefaultData as any).heroTitle,
  heroSubtitle: (smokepitDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "smoke-nav", title: "Smoke plume nav" },
    { type: "hero", variant: "smoke-plume-hero", title: "Smoke plume BBQ hero" },
    { type: "menu", variant: "smoke-meat-grid", title: "Smoke meat grid" },
    { type: "process", variant: "bbq-process", title: "BBQ process" },
    { type: "gallery", variant: "pit-gallery", title: "Pit gallery" },
    { type: "reviews", variant: "bbq-reviews", title: "BBQ reviews" },
    { type: "stats", variant: "smoke-stats", title: "Smoke stats + hours" },
    { type: "cta", variant: "bbq-home-cta", title: "Home CTA teaser" },
    { type: "meatsPage", variant: "full-meat-menu", title: "Full meat menu page" },
    { type: "smokePage", variant: "smoke-story", title: "Smoke story page" },
    { type: "about", variant: "pit-timeline", title: "Pit timeline" },
    { type: "contact", variant: "ember-reserve-faq", title: "Ember reserve + FAQ" },
    { type: "footer", variant: "ash-line", title: "Ash line footer" },
  ].map((b, i) => ({ id: `smokepit-${i+1}-${b.type}`, ...b })),
  pages: smokepitPages,
  editor: { pages: smokepitPages, css: smokepitEditorCss },
  css: smokepitEditorCss, data: smokepitDefaultData, defaultData: smokepitDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const smokepitTemplate = {
  id: "smokepit", key: "smokepit", name: "Smokepit", title: "Smokepit", author: "Bizuply", priceLabel: "כלול",
  category: "food", categoryLabel: "אוכל ומסעדות", badge: "חדש",
  description: "תבנית ברביקיו: עמודות עשן, בשר מעושן וטופס הזמנה כהה — בור כפרי לוהט.",
  thumbnail: React.createElement(SmokepitThumbnail),
  preview: React.createElement(SmokepitPreview),
  component: SmokepitPages, Component: SmokepitPages,
  seed: smokepitSeed, pages: smokepitPages, editorCss: smokepitEditorCss, schema: smokepitSchema, defaultData: smokepitDefaultData,
  renderer: {
    key: "smokepit", name: "Smokepit", Component: SmokepitPages, component: SmokepitPages, pages: smokepitPages,
    editorMode: "visual-react", editorCss: smokepitEditorCss, schema: smokepitSchema, defaultData: smokepitDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default smokepitTemplate;
