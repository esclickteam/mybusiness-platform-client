import React from "react";

import type {
  ReadyWebsitePalette,
  ReadyWebsiteTemplateSeed,
} from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";

import NexoraPages, { nexoraPages } from "./pages";
import NexoraPreview from "./preview";
import NexoraThumbnail from "./thumbnail";
import { nexoraEditorCss } from "./editorCss";
import { nexoraSchema } from "./schema";
import { nexoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#6366F1",
  secondary: "#8B5CF6",
  accent: "#22D3EE",
  background: "#0B1020",
  surface: "#131A2E",
  text: "#FFFFFF",
  muted: "#94A3B8",
  dark: "#050814",
};

const blocks = [
  { type: "header", variant: "saas-glass", title: "Header" },
  { type: "hero", variant: "product-showcase", title: "Hero" },
  { type: "clients", variant: "logo-strip", title: "Logos" },
  { type: "services", variant: "feature-grid", title: "Features" },
  { type: "process", variant: "three-steps", title: "Workflow" },
  { type: "pricing", variant: "saas-tiers", title: "Pricing" },
  { type: "testimonials", variant: "cards", title: "Testimonials" },
  { type: "faq", variant: "split-faq", title: "FAQ" },
  { type: "contact", variant: "demo-form", title: "Contact" },
  { type: "footer", variant: "gradient-cta", title: "Footer" },
];

export const nexoraSeed = {
  id: "nexora",
  key: "nexora",
  name: "Nexora",
  title: "Nexora",
  description:
    "תבנית דף נחיתה ל-SaaS / הייטק עם הירו מוצר, לוגואים, גריד יכולות, תהליך, תמחור, ביקורות, שאלות נפוצות וטופס דמו.",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  niche: "saas",
  layout: "full",
  image: (nexoraDefaultData as Record<string, any>).heroImage,
  heroTitle: (nexoraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (nexoraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({
    id: `nexora-${index + 1}-${block.type}`,
    ...block,
  })),
  pages: nexoraPages,
  editor: {
    pages: nexoraPages,
    css: nexoraEditorCss,
  },
  css: nexoraEditorCss,
  data: nexoraDefaultData,
  defaultData: nexoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const nexoraTemplate = {
  id: "nexora",
  key: "nexora",
  name: "Nexora",
  title: "Nexora",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  badge: "חדש",
  description:
    "תבנית דף נחיתה מודרנית ל-SaaS והייטק: הירו מוצר קולנועי, גריד יכולות, תמחור, ביקורות, FAQ וטופס תיאום דמו.",
  thumbnail: React.createElement(NexoraThumbnail),
  preview: React.createElement(NexoraPreview),
  component: NexoraPages,
  Component: NexoraPages,
  seed: nexoraSeed,
  pages: nexoraPages,
  editorCss: nexoraEditorCss,
  schema: nexoraSchema,
  defaultData: nexoraDefaultData,
  renderer: {
    key: "nexora",
    name: "Nexora",
    Component: NexoraPages,
    component: NexoraPages,
    pages: nexoraPages,
    editorMode: "visual-react",
    editorCss: nexoraEditorCss,
    schema: nexoraSchema,
    defaultData: nexoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default nexoraTemplate;
