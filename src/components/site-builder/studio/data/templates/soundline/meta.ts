import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import SoundlinePages, { soundlinePages } from "./pages";
import SoundlinePreview from "./preview";
import SoundlineThumbnail from "./thumbnail";
import { soundlineEditorCss } from "./editorCss";
import { soundlineSchema } from "./schema";
import { soundlineDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  "primary": "#FF4D6D",
  "secondary": "#0B0B12",
  "accent": "#FF8FA3",
  "background": "#0B0B12",
  "surface": "#151522",
  "text": "#F7F7FB",
  "muted": "#9B9BB0",
  "dark": "#05050A"
};

export const soundlineSeed = {
  id: "soundline",
  key: "soundline",
  name: "Soundline",
  title: "Soundline",
  description: "דף נחיתה מקצועי לתחום בית ספר למוזיקה עם תנועה, אפקטים ועיצוב ייחודי.",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  niche: "music",
  layout: "full",
  image: (soundlineDefaultData as any).heroImage,
  heroTitle: (soundlineDefaultData as any).heroTitle,
  heroSubtitle: (soundlineDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "soundline-header", title: "header" },
    { type: "hero", variant: "soundline-hero", title: "hero" },
    { type: "services", variant: "soundline-services", title: "services" },
    { type: "showcase", variant: "soundline-showcase", title: "showcase" },
    { type: "stats", variant: "soundline-stats", title: "stats" },
    { type: "process", variant: "soundline-process", title: "process" },
    { type: "testimonials", variant: "soundline-testimonials", title: "testimonials" },
    { type: "faq", variant: "soundline-faq", title: "faq" },
    { type: "contact", variant: "soundline-contact", title: "contact" },
    { type: "footer", variant: "soundline-footer", title: "footer" },
  ].map((block, index) => ({ id: `soundline-${index + 1}-${block.type}`, ...block })),
  pages: soundlinePages,
  editor: { pages: soundlinePages, css: soundlineEditorCss },
  css: soundlineEditorCss,
  data: soundlineDefaultData,
  defaultData: soundlineDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const soundlineTemplate = {
  id: "soundline",
  key: "soundline",
  name: "Soundline",
  title: "Soundline",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  badge: "Premium",
  description: "דף נחיתה מקצועי לתחום בית ספר למוזיקה עם תנועה, אפקטים ועיצוב ייחודי.",
  thumbnail: React.createElement(SoundlineThumbnail),
  preview: React.createElement(SoundlinePreview),
  component: SoundlinePages,
  Component: SoundlinePages,
  seed: soundlineSeed,
  pages: soundlinePages,
  editorCss: soundlineEditorCss,
  schema: soundlineSchema,
  defaultData: soundlineDefaultData,
  renderer: {
    key: "soundline",
    name: "Soundline",
    Component: SoundlinePages,
    component: SoundlinePages,
    pages: soundlinePages,
    editorMode: "visual-react",
    editorCss: soundlineEditorCss,
    schema: soundlineSchema,
    defaultData: soundlineDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default soundlineTemplate;
