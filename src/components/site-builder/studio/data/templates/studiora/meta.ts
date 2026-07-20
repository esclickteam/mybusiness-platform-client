import React from "react";

import type {
  ReadyWebsitePalette,
  ReadyWebsiteTemplateSeed,
} from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";

import StudioraPages, { studioraPages } from "./pages";
import StudioraPreview from "./preview";
import StudioraThumbnail from "./thumbnail";
import { studioraEditorCss } from "./editorCss";
import { studioraSchema } from "./schema";
import { studioraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#C3FF00",
  secondary: "#1A1A1A",
  accent: "#C3FF00",
  background: "#0A0A0A",
  surface: "#111111",
  text: "#FFFFFF",
  muted: "#8A8A8A",
  dark: "#000000",
};

const blocks = [
  { type: "header", variant: "bold-nav", title: "Header" },
  { type: "hero", variant: "editorial-oversized", title: "Hero" },
  { type: "clients", variant: "marquee", title: "Marquee" },
  { type: "services", variant: "split-grid", title: "Services" },
  { type: "projects", variant: "case-showcase", title: "Work" },
  { type: "results", variant: "stat-grid", title: "Stats" },
  { type: "process", variant: "numbered", title: "Process" },
  { type: "about", variant: "image-split", title: "About" },
  { type: "testimonials", variant: "cards", title: "Reviews" },
  { type: "contact", variant: "brief-form", title: "Contact" },
  { type: "footer", variant: "accent-cta", title: "Footer" },
];

export const studioraSeed = {
  id: "studiora",
  key: "studiora",
  name: "Studiora",
  title: "Studiora",
  description:
    "תבנית סטודיו קריאייטיב / סוכנות עם הירו טיפוגרפי נועז, טקסט רץ, שירותים, תיק עבודות, סטטיסטיקות, ביקורות וטופס בריף.",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  niche: "creative-agency",
  layout: "full",
  image: (studioraDefaultData as Record<string, any>).heroImage,
  heroTitle: (studioraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (studioraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({
    id: `studiora-${index + 1}-${block.type}`,
    ...block,
  })),
  pages: studioraPages,
  editor: {
    pages: studioraPages,
    css: studioraEditorCss,
  },
  css: studioraEditorCss,
  data: studioraDefaultData,
  defaultData: studioraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const studioraTemplate = {
  id: "studiora",
  key: "studiora",
  name: "Studiora",
  title: "Studiora",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  badge: "חדש",
  description:
    "תבנית סטודיו קריאייטיב / סוכנות בסגנון עריכה נועז: שחור ולַיים, טיפוגרפיה גדולה, תיק עבודות, שירותים וטופס בריף.",
  thumbnail: React.createElement(StudioraThumbnail),
  preview: React.createElement(StudioraPreview),
  component: StudioraPages,
  Component: StudioraPages,
  seed: studioraSeed,
  pages: studioraPages,
  editorCss: studioraEditorCss,
  schema: studioraSchema,
  defaultData: studioraDefaultData,
  renderer: {
    key: "studiora",
    name: "Studiora",
    Component: StudioraPages,
    component: StudioraPages,
    pages: studioraPages,
    editorMode: "visual-react",
    editorCss: studioraEditorCss,
    schema: studioraSchema,
    defaultData: studioraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default studioraTemplate;
