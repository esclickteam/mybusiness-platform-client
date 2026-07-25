import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import LexhavenPages, { lexhavenPages } from "./pages";
import LexhavenPreview from "./preview";
import LexhavenThumbnail from "./thumbnail";
import { lexhavenEditorCss } from "./editorCss";
import { lexhavenSchema } from "./schema";
import { lexhavenDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#7A1F2B",
  secondary: "#F7F3EE",
  accent: "#A33A48",
  background: "#F7F3EE",
  surface: "#FFFFFF",
  text: "#1C1412",
  muted: "#6E625C",
  dark: "#2A1518",
};

const blocks = [
  { type: "header", variant: "legalIvory-header", title: "header" },
  { type: "hero", variant: "legalIvory-hero", title: "hero" },
  { type: "services", variant: "legalIvory-services", title: "services" },
  { type: "stats", variant: "legalIvory-stats", title: "stats" },
  { type: "showcase", variant: "legalIvory-showcase", title: "showcase" },
  { type: "process", variant: "legalIvory-process", title: "process" },
  { type: "testimonials", variant: "legalIvory-testimonials", title: "testimonials" },
  { type: "faq", variant: "legalIvory-faq", title: "faq" },
  { type: "contact", variant: "legalIvory-contact", title: "contact" },
  { type: "footer", variant: "legalIvory-footer", title: "footer" },
];

export const lexhavenSeed = {
  id: "lexhaven",
  key: "lexhaven",
  name: "Lexhaven",
  title: "Lexhaven",
  description: "דף נחיתה למשרד עו״ד: הירו רציני, תחומי התמחות, צוות, אמינות וטופס ייעוץ.",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  niche: "legal",
  layout: "full",
  image: (lexhavenDefaultData as Record<string, any>).heroImage,
  heroTitle: (lexhavenDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (lexhavenDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `lexhaven-${index + 1}-${block.type}`, ...block })),
  pages: lexhavenPages,
  editor: { pages: lexhavenPages, css: lexhavenEditorCss },
  css: lexhavenEditorCss,
  data: lexhavenDefaultData,
  defaultData: lexhavenDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const lexhavenTemplate = {
  id: "lexhaven",
  key: "lexhaven",
  name: "Lexhaven",
  title: "Lexhaven",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  badge: "חדש",
  description: "דף נחיתה למשרד עו״ד: הירו רציני, תחומי התמחות, צוות, אמינות וטופס ייעוץ.",
  thumbnail: React.createElement(LexhavenThumbnail),
  preview: React.createElement(LexhavenPreview),
  component: LexhavenPages,
  Component: LexhavenPages,
  seed: lexhavenSeed,
  pages: lexhavenPages,
  editorCss: lexhavenEditorCss,
  schema: lexhavenSchema,
  defaultData: lexhavenDefaultData,
  renderer: {
    key: "lexhaven",
    name: "Lexhaven",
    Component: LexhavenPages,
    component: LexhavenPages,
    pages: lexhavenPages,
    editorMode: "visual-react",
    editorCss: lexhavenEditorCss,
    schema: lexhavenSchema,
    defaultData: lexhavenDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default lexhavenTemplate;
