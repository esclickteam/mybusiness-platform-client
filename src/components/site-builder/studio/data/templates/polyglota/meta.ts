import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import PolyglotaPages, { polyglotaPages } from "./pages";
import PolyglotaPreview from "./preview";
import PolyglotaThumbnail from "./thumbnail";
import { polyglotaEditorCss } from "./editorCss";
import { polyglotaSchema } from "./schema";
import { polyglotaDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#0284C7",
  secondary: "#F0F9FF",
  accent: "#38BDF8",
  background: "#F0F9FF",
  surface: "#FFFFFF",
  text: "#0C4A6E",
  muted: "#64748B",
  dark: "#082F49",
};

const blocks = [
  { type: "header", variant: "skyBlue-header", title: "header" },
  { type: "hero", variant: "skyBlue-hero", title: "hero" },
  { type: "pageHero", variant: "skyBlue-pageHero", title: "pageHero" },
  { type: "about", variant: "skyBlue-about", title: "about" },
  { type: "why", variant: "skyBlue-why", title: "why" },
  { type: "method", variant: "skyBlue-method", title: "method" },
  { type: "gallery", variant: "skyBlue-gallery", title: "gallery" },
  { type: "outcomes", variant: "skyBlue-outcomes", title: "outcomes" },
  { type: "pricing", variant: "skyBlue-pricing", title: "pricing" },
  { type: "insights", variant: "skyBlue-insights", title: "insights" },
  { type: "cta", variant: "skyBlue-cta", title: "cta" },
  { type: "courses", variant: "skyBlue-courses", title: "courses" },
  { type: "curriculum", variant: "skyBlue-curriculum", title: "curriculum" },
  { type: "instructors", variant: "skyBlue-instructors", title: "instructors" },
  { type: "stats", variant: "skyBlue-stats", title: "stats" },
  { type: "testimonials", variant: "skyBlue-testimonials", title: "testimonials" },
  { type: "faq", variant: "skyBlue-faq", title: "faq" },
  { type: "contact", variant: "skyBlue-contact", title: "contact" },
  { type: "footer", variant: "skyBlue-footer", title: "footer" },
];

export const polyglotaSeed = {
  id: "polyglota",
  key: "polyglota",
  name: "Polyglota",
  title: "Polyglota",
  description: "בית ספר לשפות: הירו ממורכז, מארקי שפות, מסלול זיגזג ומורים.",
  category: "education",
  categoryLabel: "חינוך וקורסים",
  niche: "language-school",
  layout: "full",
  image: (polyglotaDefaultData as Record<string, any>).heroImage,
  heroTitle: (polyglotaDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (polyglotaDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `polyglota-${index + 1}-${block.type}`, ...block })),
  pages: polyglotaPages,
  editor: { pages: polyglotaPages, css: polyglotaEditorCss },
  css: polyglotaEditorCss,
  data: polyglotaDefaultData,
  defaultData: polyglotaDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const polyglotaTemplate = {
  id: "polyglota",
  key: "polyglota",
  name: "Polyglota",
  title: "Polyglota",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "education",
  categoryLabel: "חינוך וקורסים",
  badge: "חדש",
  description: "בית ספר לשפות: הירו ממורכז, מארקי שפות, מסלול זיגזג ומורים.",
  thumbnail: React.createElement(PolyglotaThumbnail),
  preview: React.createElement(PolyglotaPreview),
  component: PolyglotaPages,
  Component: PolyglotaPages,
  seed: polyglotaSeed,
  pages: polyglotaPages,
  editorCss: polyglotaEditorCss,
  schema: polyglotaSchema,
  defaultData: polyglotaDefaultData,
  renderer: {
    key: "polyglota",
    name: "Polyglota",
    Component: PolyglotaPages,
    component: PolyglotaPages,
    pages: polyglotaPages,
    editorMode: "visual-react",
    editorCss: polyglotaEditorCss,
    schema: polyglotaSchema,
    defaultData: polyglotaDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default polyglotaTemplate;
