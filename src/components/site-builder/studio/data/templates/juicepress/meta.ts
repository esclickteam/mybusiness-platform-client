import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import JuicepressPages, { juicepressPages } from "./pages";
import JuicepressPreview from "./preview";
import JuicepressThumbnail from "./thumbnail";
import { juicepressEditorCss } from "./editorCss";
import { juicepressSchema } from "./schema";
import { juicepressDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#f59e0b", secondary: "#78716c", accent: "#f59e0b",
  background: "#fffbeb", surface: "#ffffff", text: "#1c1917", muted: "#78716c", dark: "#0c0a09",
};

export const juicepressSeed = {
  id: "juicepress", key: "juicepress", name: "Juicepress", title: "Juicepress",
  description: "תבנית מיצים: פרצי הדרים, בקבוקים זוהרים וטופס הזמנה רענן — בר מיצים אנרגטי.",
  category: "food", categoryLabel: "אוכל ומסעדות", niche: "מיצים · בר בריאות", layout: "full",
  image: (juicepressDefaultData as any).heroImage,
  heroTitle: (juicepressDefaultData as any).heroTitle,
  heroSubtitle: (juicepressDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "citrus-nav", title: "Citrus burst nav" },
    { type: "hero", variant: "citrus-burst-hero", title: "Citrus burst juice hero" },
    { type: "menu", variant: "burst-juice-circles", title: "Burst juice circles" },
    { type: "process", variant: "press-process", title: "Press process" },
    { type: "gallery", variant: "juice-gallery", title: "Juice gallery" },
    { type: "reviews", variant: "juice-reviews", title: "Juice reviews" },
    { type: "stats", variant: "press-stats", title: "Press stats + hours" },
    { type: "cta", variant: "juice-home-cta", title: "Home CTA teaser" },
    { type: "juicesPage", variant: "full-juice-menu", title: "Full juice menu page" },
    { type: "pressPage", variant: "press-story", title: "Press story page" },
    { type: "about", variant: "orchard-timeline", title: "Orchard timeline" },
    { type: "contact", variant: "bottle-reserve-faq", title: "Bottle reserve + FAQ" },
    { type: "footer", variant: "citrus-dots", title: "Citrus dots footer" },
  ].map((b, i) => ({ id: `juicepress-${i+1}-${b.type}`, ...b })),
  pages: juicepressPages,
  editor: { pages: juicepressPages, css: juicepressEditorCss },
  css: juicepressEditorCss, data: juicepressDefaultData, defaultData: juicepressDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const juicepressTemplate = {
  id: "juicepress", key: "juicepress", name: "Juicepress", title: "Juicepress", author: "Bizuply", priceLabel: "כלול",
  category: "food", categoryLabel: "אוכל ומסעדות", badge: "חדש",
  description: "תבנית מיצים: פרצי הדרים, בקבוקים זוהרים וטופס הזמנה רענן — בר מיצים אנרגטי.",
  thumbnail: React.createElement(JuicepressThumbnail),
  preview: React.createElement(JuicepressPreview),
  component: JuicepressPages, Component: JuicepressPages,
  seed: juicepressSeed, pages: juicepressPages, editorCss: juicepressEditorCss, schema: juicepressSchema, defaultData: juicepressDefaultData,
  renderer: {
    key: "juicepress", name: "Juicepress", Component: JuicepressPages, component: JuicepressPages, pages: juicepressPages,
    editorMode: "visual-react", editorCss: juicepressEditorCss, schema: juicepressSchema, defaultData: juicepressDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default juicepressTemplate;
