import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import DentellePages, { dentellePages } from "./pages";
import DentellePreview from "./preview";
import DentelleThumbnail from "./thumbnail";
import { dentelleEditorCss } from "./editorCss";
import { dentelleSchema } from "./schema";
import { dentelleDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  "primary": "#2DD4BF",
  "secondary": "#F8FAFC",
  "accent": "#5EEAD4",
  "background": "#F8FAFC",
  "surface": "#FFFFFF",
  "text": "#0F172A",
  "muted": "#64748B",
  "dark": "#0B1220"
};

export const dentelleSeed = {
  id: "dentelle",
  key: "dentelle",
  name: "Dentelle",
  title: "Dentelle",
  description: "דף נחיתה מקצועי לתחום רפואת שיניים עם תנועה, אפקטים ועיצוב ייחודי.",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  niche: "dental",
  layout: "full",
  image: (dentelleDefaultData as any).heroImage,
  heroTitle: (dentelleDefaultData as any).heroTitle,
  heroSubtitle: (dentelleDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "dentelle-header", title: "header" },
    { type: "hero", variant: "dentelle-hero", title: "hero" },
    { type: "services", variant: "dentelle-services", title: "services" },
    { type: "showcase", variant: "dentelle-showcase", title: "showcase" },
    { type: "stats", variant: "dentelle-stats", title: "stats" },
    { type: "process", variant: "dentelle-process", title: "process" },
    { type: "testimonials", variant: "dentelle-testimonials", title: "testimonials" },
    { type: "faq", variant: "dentelle-faq", title: "faq" },
    { type: "contact", variant: "dentelle-contact", title: "contact" },
    { type: "footer", variant: "dentelle-footer", title: "footer" },
  ].map((block, index) => ({ id: `dentelle-${index + 1}-${block.type}`, ...block })),
  pages: dentellePages,
  editor: { pages: dentellePages, css: dentelleEditorCss },
  css: dentelleEditorCss,
  data: dentelleDefaultData,
  defaultData: dentelleDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const dentelleTemplate = {
  id: "dentelle",
  key: "dentelle",
  name: "Dentelle",
  title: "Dentelle",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  badge: "חדש",
  description: "דף נחיתה מקצועי לתחום רפואת שיניים עם תנועה, אפקטים ועיצוב ייחודי.",
  thumbnail: React.createElement(DentelleThumbnail),
  preview: React.createElement(DentellePreview),
  component: DentellePages,
  Component: DentellePages,
  seed: dentelleSeed,
  pages: dentellePages,
  editorCss: dentelleEditorCss,
  schema: dentelleSchema,
  defaultData: dentelleDefaultData,
  renderer: {
    key: "dentelle",
    name: "Dentelle",
    Component: DentellePages,
    component: DentellePages,
    pages: dentellePages,
    editorMode: "visual-react",
    editorCss: dentelleEditorCss,
    schema: dentelleSchema,
    defaultData: dentelleDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default dentelleTemplate;
