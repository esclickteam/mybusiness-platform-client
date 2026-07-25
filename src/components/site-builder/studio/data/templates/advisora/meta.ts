import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import AdvisoraPages, { advisoraPages } from "./pages";
import AdvisoraPreview from "./preview";
import AdvisoraThumbnail from "./thumbnail";
import { advisoraEditorCss } from "./editorCss";
import { advisoraSchema } from "./schema";
import { advisoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#C9A227",
  secondary: "#0B1F3A",
  accent: "#E6C65C",
  background: "#0B1F3A",
  surface: "#132B4D",
  text: "#F4F1E8",
  muted: "#A8B3C4",
  dark: "#071428",
};

const blocks = [
  { type: "header", variant: "navyGold-header", title: "header" },
  { type: "hero", variant: "navyGold-hero", title: "hero" },
  { type: "services", variant: "navyGold-services", title: "services" },
  { type: "stats", variant: "navyGold-stats", title: "stats" },
  { type: "showcase", variant: "navyGold-showcase", title: "showcase" },
  { type: "process", variant: "navyGold-process", title: "process" },
  { type: "testimonials", variant: "navyGold-testimonials", title: "testimonials" },
  { type: "faq", variant: "navyGold-faq", title: "faq" },
  { type: "contact", variant: "navyGold-contact", title: "contact" },
  { type: "footer", variant: "navyGold-footer", title: "footer" },
];

export const advisoraSeed = {
  id: "advisora",
  key: "advisora",
  name: "Advisora",
  title: "Advisora",
  description: "דף נחיתה לייעוץ עסקי: הירו סמכותי, שירותי ייעוץ, תהליך עבודה, מקרי בוחן וטופס שיחה.",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  niche: "business-consulting",
  layout: "full",
  image: (advisoraDefaultData as Record<string, any>).heroImage,
  heroTitle: (advisoraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (advisoraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `advisora-${index + 1}-${block.type}`, ...block })),
  pages: advisoraPages,
  editor: { pages: advisoraPages, css: advisoraEditorCss },
  css: advisoraEditorCss,
  data: advisoraDefaultData,
  defaultData: advisoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const advisoraTemplate = {
  id: "advisora",
  key: "advisora",
  name: "Advisora",
  title: "Advisora",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  badge: "חדש",
  description: "דף נחיתה לייעוץ עסקי: הירו סמכותי, שירותי ייעוץ, תהליך עבודה, מקרי בוחן וטופס שיחה.",
  thumbnail: React.createElement(AdvisoraThumbnail),
  preview: React.createElement(AdvisoraPreview),
  component: AdvisoraPages,
  Component: AdvisoraPages,
  seed: advisoraSeed,
  pages: advisoraPages,
  editorCss: advisoraEditorCss,
  schema: advisoraSchema,
  defaultData: advisoraDefaultData,
  renderer: {
    key: "advisora",
    name: "Advisora",
    Component: AdvisoraPages,
    component: AdvisoraPages,
    pages: advisoraPages,
    editorMode: "visual-react",
    editorCss: advisoraEditorCss,
    schema: advisoraSchema,
    defaultData: advisoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default advisoraTemplate;
