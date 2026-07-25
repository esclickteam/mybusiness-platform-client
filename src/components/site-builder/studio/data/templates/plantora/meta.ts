import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import PlantoraPages, { plantoraPages } from "./pages";
import PlantoraPreview from "./preview";
import PlantoraThumbnail from "./thumbnail";
import { plantoraEditorCss } from "./editorCss";
import { plantoraSchema } from "./schema";
import { plantoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#65a30d", secondary: "#5c7a5c", accent: "#65a30d",
  background: "#f4f7f0", surface: "#ffffff", text: "#1a2e1a", muted: "#5c7a5c", dark: "#0f1a0f",
};

export const plantoraSeed = {
  id: "plantora", key: "plantora", name: "Plantora", title: "Plantora",
  description: "תבנית טבעונית: שורשים צומחים, ירק חי וטופס הזמנה ירוק — מטבח צמחי אלגנטי.",
  category: "food", categoryLabel: "אוכל ומסעדות", niche: "טבעוני · צמחי", layout: "full",
  image: (plantoraDefaultData as any).heroImage,
  heroTitle: (plantoraDefaultData as any).heroTitle,
  heroSubtitle: (plantoraDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "leaf-nav", title: "Leaf grow nav" },
    { type: "hero", variant: "root-grow-hero", title: "Root grow plant hero" },
    { type: "menu", variant: "root-trail-plates", title: "Root trail plates" },
    { type: "process", variant: "plant-process", title: "Plant process" },
    { type: "gallery", variant: "garden-gallery", title: "Garden gallery" },
    { type: "reviews", variant: "plant-reviews", title: "Plant reviews" },
    { type: "stats", variant: "garden-stats", title: "Garden stats + hours" },
    { type: "cta", variant: "plant-home-cta", title: "Home CTA teaser" },
    { type: "platesPage", variant: "full-plant-menu", title: "Full plant menu page" },
    { type: "gardenPage", variant: "garden-story", title: "Garden story page" },
    { type: "about", variant: "soil-timeline", title: "Soil timeline" },
    { type: "contact", variant: "garden-reserve-faq", title: "Garden reserve + FAQ" },
    { type: "footer", variant: "root-line", title: "Root line footer" },
  ].map((b, i) => ({ id: `plantora-${i+1}-${b.type}`, ...b })),
  pages: plantoraPages,
  editor: { pages: plantoraPages, css: plantoraEditorCss },
  css: plantoraEditorCss, data: plantoraDefaultData, defaultData: plantoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const plantoraTemplate = {
  id: "plantora", key: "plantora", name: "Plantora", title: "Plantora", author: "Bizuply", priceLabel: "כלול",
  category: "food", categoryLabel: "אוכל ומסעדות", badge: "חדש",
  description: "תבנית טבעונית: שורשים צומחים, ירק חי וטופס הזמנה ירוק — מטבח צמחי אלגנטי.",
  thumbnail: React.createElement(PlantoraThumbnail),
  preview: React.createElement(PlantoraPreview),
  component: PlantoraPages, Component: PlantoraPages,
  seed: plantoraSeed, pages: plantoraPages, editorCss: plantoraEditorCss, schema: plantoraSchema, defaultData: plantoraDefaultData,
  renderer: {
    key: "plantora", name: "Plantora", Component: PlantoraPages, component: PlantoraPages, pages: plantoraPages,
    editorMode: "visual-react", editorCss: plantoraEditorCss, schema: plantoraSchema, defaultData: plantoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default plantoraTemplate;
