import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import CraftoraPages, { craftoraPages } from "./pages";
import CraftoraPreview from "./preview";
import CraftoraThumbnail from "./thumbnail";
import { craftoraEditorCss } from "./editorCss";
import { craftoraSchema } from "./schema";
import { craftoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#4D7C0F",
  secondary: "#F5F5F4",
  accent: "#78716C",
  background: "#F5F5F4",
  surface: "#FFFFFF",
  text: "#1C1917",
  muted: "#78716C",
  dark: "#292524",
};

const blocks = [
  { type: "header", variant: "stoneOlive-header", title: "header" },
  { type: "hero", variant: "stoneOlive-hero", title: "hero" },
  { type: "courses", variant: "stoneOlive-courses", title: "courses" },
  { type: "curriculum", variant: "stoneOlive-curriculum", title: "curriculum" },
  { type: "instructors", variant: "stoneOlive-instructors", title: "instructors" },
  { type: "stats", variant: "stoneOlive-stats", title: "stats" },
  { type: "testimonials", variant: "stoneOlive-testimonials", title: "testimonials" },
  { type: "faq", variant: "stoneOlive-faq", title: "faq" },
  { type: "contact", variant: "stoneOlive-contact", title: "contact" },
  { type: "footer", variant: "stoneOlive-footer", title: "footer" },
];

export const craftoraSeed = {
  id: "craftora",
  key: "craftora",
  name: "Craftora",
  title: "Craftora",
  description: "סדנאות אמנות: הירו קולאז׳ עיתונאי, רשימת סדנאות אסימטרית ואטלייה.",
  category: "education",
  categoryLabel: "חינוך וקורסים",
  niche: "art-workshops",
  layout: "full",
  image: (craftoraDefaultData as Record<string, any>).heroImage,
  heroTitle: (craftoraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (craftoraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `craftora-${index + 1}-${block.type}`, ...block })),
  pages: craftoraPages,
  editor: { pages: craftoraPages, css: craftoraEditorCss },
  css: craftoraEditorCss,
  data: craftoraDefaultData,
  defaultData: craftoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const craftoraTemplate = {
  id: "craftora",
  key: "craftora",
  name: "Craftora",
  title: "Craftora",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "education",
  categoryLabel: "חינוך וקורסים",
  badge: "Premium",
  description: "סדנאות אמנות: הירו קולאז׳ עיתונאי, רשימת סדנאות אסימטרית ואטלייה.",
  thumbnail: React.createElement(CraftoraThumbnail),
  preview: React.createElement(CraftoraPreview),
  component: CraftoraPages,
  Component: CraftoraPages,
  seed: craftoraSeed,
  pages: craftoraPages,
  editorCss: craftoraEditorCss,
  schema: craftoraSchema,
  defaultData: craftoraDefaultData,
  renderer: {
    key: "craftora",
    name: "Craftora",
    Component: CraftoraPages,
    component: CraftoraPages,
    pages: craftoraPages,
    editorMode: "visual-react",
    editorCss: craftoraEditorCss,
    schema: craftoraSchema,
    defaultData: craftoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default craftoraTemplate;
