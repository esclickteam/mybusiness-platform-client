import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import VowlinePages, { vowlinePages } from "./pages";
import VowlinePreview from "./preview";
import VowlineThumbnail from "./thumbnail";
import { vowlineEditorCss } from "./editorCss";
import { vowlineSchema } from "./schema";
import { vowlineDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#5B7C99",
  secondary: "#F8F4F0",
  accent: "#8FA9C0",
  background: "#F8F4F0",
  surface: "#FFFFFF",
  text: "#243040",
  muted: "#7A8490",
  dark: "#1A2430",
};

const blocks = [
  { type: "header", variant: "weddingBlue-header", title: "header" },
  { type: "hero", variant: "weddingBlue-hero", title: "hero" },
  { type: "services", variant: "weddingBlue-services", title: "services" },
  { type: "stats", variant: "weddingBlue-stats", title: "stats" },
  { type: "showcase", variant: "weddingBlue-showcase", title: "showcase" },
  { type: "process", variant: "weddingBlue-process", title: "process" },
  { type: "testimonials", variant: "weddingBlue-testimonials", title: "testimonials" },
  { type: "faq", variant: "weddingBlue-faq", title: "faq" },
  { type: "contact", variant: "weddingBlue-contact", title: "contact" },
  { type: "footer", variant: "weddingBlue-footer", title: "footer" },
];

export const vowlineSeed = {
  id: "vowline",
  key: "vowline",
  name: "Vowline",
  title: "Vowline",
  description: "דף נחיתה לתכנון חתונות: הירו רומנטי-מודרני, חבילות, תהליך, גלריה וטופס ייעוץ.",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  niche: "wedding-planning",
  layout: "full",
  image: (vowlineDefaultData as Record<string, any>).heroImage,
  heroTitle: (vowlineDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (vowlineDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `vowline-${index + 1}-${block.type}`, ...block })),
  pages: vowlinePages,
  editor: { pages: vowlinePages, css: vowlineEditorCss },
  css: vowlineEditorCss,
  data: vowlineDefaultData,
  defaultData: vowlineDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const vowlineTemplate = {
  id: "vowline",
  key: "vowline",
  name: "Vowline",
  title: "Vowline",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  badge: "חדש",
  description: "דף נחיתה לתכנון חתונות: הירו רומנטי-מודרני, חבילות, תהליך, גלריה וטופס ייעוץ.",
  thumbnail: React.createElement(VowlineThumbnail),
  preview: React.createElement(VowlinePreview),
  component: VowlinePages,
  Component: VowlinePages,
  seed: vowlineSeed,
  pages: vowlinePages,
  editorCss: vowlineEditorCss,
  schema: vowlineSchema,
  defaultData: vowlineDefaultData,
  renderer: {
    key: "vowline",
    name: "Vowline",
    Component: VowlinePages,
    component: VowlinePages,
    pages: vowlinePages,
    editorMode: "visual-react",
    editorCss: vowlineEditorCss,
    schema: vowlineSchema,
    defaultData: vowlineDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default vowlineTemplate;
