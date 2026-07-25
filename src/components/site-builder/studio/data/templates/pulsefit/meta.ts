import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import PulsefitPages, { pulsefitPages } from "./pages";
import PulsefitPreview from "./preview";
import PulsefitThumbnail from "./thumbnail";
import { pulsefitEditorCss } from "./editorCss";
import { pulsefitSchema } from "./schema";
import { pulsefitDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#C8FF3D",
  secondary: "#121212",
  accent: "#E0FF7A",
  background: "#121212",
  surface: "#1C1C1C",
  text: "#F4F4F4",
  muted: "#9A9A9A",
  dark: "#0A0A0A",
};

const blocks = [
  { type: "header", variant: "neonFit-header", title: "header" },
  { type: "hero", variant: "neonFit-hero", title: "hero" },
  { type: "services", variant: "neonFit-services", title: "services" },
  { type: "stats", variant: "neonFit-stats", title: "stats" },
  { type: "showcase", variant: "neonFit-showcase", title: "showcase" },
  { type: "process", variant: "neonFit-process", title: "process" },
  { type: "testimonials", variant: "neonFit-testimonials", title: "testimonials" },
  { type: "faq", variant: "neonFit-faq", title: "faq" },
  { type: "contact", variant: "neonFit-contact", title: "contact" },
  { type: "footer", variant: "neonFit-footer", title: "footer" },
];

export const pulsefitSeed = {
  id: "pulsefit",
  key: "pulsefit",
  name: "Pulsefit",
  title: "Pulsefit",
  description: "דף נחיתה למאמן כושר: הירו אנרגטי, תוכניות אימון, תוצאות, מחירון וטופס התחלה.",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  niche: "fitness",
  layout: "full",
  image: (pulsefitDefaultData as Record<string, any>).heroImage,
  heroTitle: (pulsefitDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (pulsefitDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `pulsefit-${index + 1}-${block.type}`, ...block })),
  pages: pulsefitPages,
  editor: { pages: pulsefitPages, css: pulsefitEditorCss },
  css: pulsefitEditorCss,
  data: pulsefitDefaultData,
  defaultData: pulsefitDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const pulsefitTemplate = {
  id: "pulsefit",
  key: "pulsefit",
  name: "Pulsefit",
  title: "Pulsefit",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  badge: "חדש",
  description: "דף נחיתה למאמן כושר: הירו אנרגטי, תוכניות אימון, תוצאות, מחירון וטופס התחלה.",
  thumbnail: React.createElement(PulsefitThumbnail),
  preview: React.createElement(PulsefitPreview),
  component: PulsefitPages,
  Component: PulsefitPages,
  seed: pulsefitSeed,
  pages: pulsefitPages,
  editorCss: pulsefitEditorCss,
  schema: pulsefitSchema,
  defaultData: pulsefitDefaultData,
  renderer: {
    key: "pulsefit",
    name: "Pulsefit",
    Component: PulsefitPages,
    component: PulsefitPages,
    pages: pulsefitPages,
    editorMode: "visual-react",
    editorCss: pulsefitEditorCss,
    schema: pulsefitSchema,
    defaultData: pulsefitDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default pulsefitTemplate;
