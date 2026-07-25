import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import ArchoraPages, { archoraPages } from "./pages";
import ArchoraPreview from "./preview";
import ArchoraThumbnail from "./thumbnail";
import { archoraEditorCss } from "./editorCss";
import { archoraSchema } from "./schema";
import { archoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  "primary": "#D4FF00",
  "secondary": "#111111",
  "accent": "#F0FF66",
  "background": "#111111",
  "surface": "#1A1A1A",
  "text": "#F5F5F0",
  "muted": "#9A9A92",
  "dark": "#0A0A0A"
};

export const archoraSeed = {
  id: "archora",
  key: "archora",
  name: "Archora",
  title: "Archora",
  description: "דף נחיתה מקצועי לתחום אדריכלות עם תנועה, אפקטים ועיצוב ייחודי.",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  niche: "architecture",
  layout: "full",
  image: (archoraDefaultData as any).heroImage,
  heroTitle: (archoraDefaultData as any).heroTitle,
  heroSubtitle: (archoraDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "archora-header", title: "header" },
    { type: "hero", variant: "archora-hero", title: "hero" },
    { type: "services", variant: "archora-services", title: "services" },
    { type: "showcase", variant: "archora-showcase", title: "showcase" },
    { type: "stats", variant: "archora-stats", title: "stats" },
    { type: "process", variant: "archora-process", title: "process" },
    { type: "testimonials", variant: "archora-testimonials", title: "testimonials" },
    { type: "faq", variant: "archora-faq", title: "faq" },
    { type: "contact", variant: "archora-contact", title: "contact" },
    { type: "footer", variant: "archora-footer", title: "footer" },
  ].map((block, index) => ({ id: `archora-${index + 1}-${block.type}`, ...block })),
  pages: archoraPages,
  editor: { pages: archoraPages, css: archoraEditorCss },
  css: archoraEditorCss,
  data: archoraDefaultData,
  defaultData: archoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const archoraTemplate = {
  id: "archora",
  key: "archora",
  name: "Archora",
  title: "Archora",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  badge: "Premium",
  description: "דף נחיתה מקצועי לתחום אדריכלות עם תנועה, אפקטים ועיצוב ייחודי.",
  thumbnail: React.createElement(ArchoraThumbnail),
  preview: React.createElement(ArchoraPreview),
  component: ArchoraPages,
  Component: ArchoraPages,
  seed: archoraSeed,
  pages: archoraPages,
  editorCss: archoraEditorCss,
  schema: archoraSchema,
  defaultData: archoraDefaultData,
  renderer: {
    key: "archora",
    name: "Archora",
    Component: ArchoraPages,
    component: ArchoraPages,
    pages: archoraPages,
    editorMode: "visual-react",
    editorCss: archoraEditorCss,
    schema: archoraSchema,
    defaultData: archoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default archoraTemplate;
