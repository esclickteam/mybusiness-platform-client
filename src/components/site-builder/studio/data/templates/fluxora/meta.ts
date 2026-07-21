import React from "react";

import type {
  ReadyWebsitePalette,
  ReadyWebsiteTemplateSeed,
} from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";

import FluxoraPages, { fluxoraPages } from "./pages";
import FluxoraPreview from "./preview";
import FluxoraThumbnail from "./thumbnail";
import { fluxoraEditorCss } from "./editorCss";
import { fluxoraSchema } from "./schema";
import { fluxoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#3DFFA8",
  secondary: "#38BDF8",
  accent: "#9DFFC9",
  background: "#070B10",
  surface: "#0D131B",
  text: "#E8EEF5",
  muted: "#94A3B8",
  dark: "#04070B",
};

const blocks = [
  { type: "header", variant: "saas-glass", title: "Header" },
  { type: "hero", variant: "product-showcase", title: "Hero" },
  { type: "clients", variant: "logo-strip", title: "Logos" },
  { type: "services", variant: "feature-grid", title: "Feed" },
  { type: "services", variant: "feature-grid", title: "Features" },
  { type: "process", variant: "three-steps", title: "Workflow" },
  { type: "testimonials", variant: "cards", title: "Community" },
  { type: "pricing", variant: "saas-tiers", title: "Pricing" },
  { type: "testimonials", variant: "cards", title: "Testimonials" },
  { type: "faq", variant: "split-faq", title: "FAQ" },
  { type: "contact", variant: "demo-form", title: "Contact" },
  { type: "footer", variant: "gradient-cta", title: "Footer" },
];

export const fluxoraSeed = {
  id: "fluxora",
  key: "fluxora",
  name: "Fluxora",
  title: "Fluxora",
  description:
    "תבנית מקצועית בעברית לפלטפורמת ידע ופיד למפתחים: הירו עם כרטיסי פיד, קהילה, יכולות, תמחור, ביקורות וטופס הדגמה.",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  niche: "saas",
  layout: "full",
  image: (fluxoraDefaultData as Record<string, any>).heroImage,
  heroTitle: (fluxoraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (fluxoraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({
    id: `fluxora-${index + 1}-${block.type}`,
    ...block,
  })),
  pages: fluxoraPages,
  editor: {
    pages: fluxoraPages,
    css: fluxoraEditorCss,
  },
  css: fluxoraEditorCss,
  data: fluxoraDefaultData,
  defaultData: fluxoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const fluxoraTemplate = {
  id: "fluxora",
  key: "fluxora",
  name: "Fluxora",
  title: "Fluxora",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  badge: "חדש",
  description:
    "תבנית בעברית בהשראת פלטפורמות ידע למפתחים: פיד מותאם, קהילה מקצועית, תמחור שקוף ועיצוב כהה נקי.",
  thumbnail: React.createElement(FluxoraThumbnail),
  preview: React.createElement(FluxoraPreview),
  component: FluxoraPages,
  Component: FluxoraPages,
  seed: fluxoraSeed,
  pages: fluxoraPages,
  editorCss: fluxoraEditorCss,
  schema: fluxoraSchema,
  defaultData: fluxoraDefaultData,
  renderer: {
    key: "fluxora",
    name: "Fluxora",
    Component: FluxoraPages,
    component: FluxoraPages,
    pages: fluxoraPages,
    editorMode: "visual-react",
    editorCss: fluxoraEditorCss,
    schema: fluxoraSchema,
    defaultData: fluxoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default fluxoraTemplate;
