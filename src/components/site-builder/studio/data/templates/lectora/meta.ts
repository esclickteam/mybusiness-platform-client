import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import LectoraPages, { lectoraPages } from "./pages";
import LectoraPreview from "./preview";
import LectoraThumbnail from "./thumbnail";
import { lectoraEditorCss } from "./editorCss";
import { lectoraSchema } from "./schema";
import { lectoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#0D9488",
  secondary: "#041F1E",
  accent: "#F97316",
  background: "#041F1E",
  surface: "#0A2F2D",
  text: "#ECFDF5",
  muted: "#99F6E4",
  dark: "#021412",
};

const blocks = [
  { type: "header", variant: "cinemaTeal-header", title: "header" },
  { type: "hero", variant: "cinemaTeal-hero", title: "hero" },
  { type: "courses", variant: "cinemaTeal-courses", title: "courses" },
  { type: "curriculum", variant: "cinemaTeal-curriculum", title: "curriculum" },
  { type: "instructors", variant: "cinemaTeal-instructors", title: "instructors" },
  { type: "stats", variant: "cinemaTeal-stats", title: "stats" },
  { type: "testimonials", variant: "cinemaTeal-testimonials", title: "testimonials" },
  { type: "faq", variant: "cinemaTeal-faq", title: "faq" },
  { type: "contact", variant: "cinemaTeal-contact", title: "contact" },
  { type: "footer", variant: "cinemaTeal-footer", title: "footer" },
];

export const lectoraSeed = {
  id: "lectora",
  key: "lectora",
  name: "Lectora",
  title: "Lectora",
  description: "פלטפורמת קורסים קולנועית: הירו מלא, מארקי של קורסים, סילבוס ממוספר ומנטורים.",
  category: "education",
  categoryLabel: "חינוך וקורסים",
  niche: "online-courses",
  layout: "full",
  image: (lectoraDefaultData as Record<string, any>).heroImage,
  heroTitle: (lectoraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (lectoraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `lectora-${index + 1}-${block.type}`, ...block })),
  pages: lectoraPages,
  editor: { pages: lectoraPages, css: lectoraEditorCss },
  css: lectoraEditorCss,
  data: lectoraDefaultData,
  defaultData: lectoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const lectoraTemplate = {
  id: "lectora",
  key: "lectora",
  name: "Lectora",
  title: "Lectora",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "education",
  categoryLabel: "חינוך וקורסים",
  badge: "חדש",
  description: "פלטפורמת קורסים קולנועית: הירו מלא, מארקי של קורסים, סילבוס ממוספר ומנטורים.",
  thumbnail: React.createElement(LectoraThumbnail),
  preview: React.createElement(LectoraPreview),
  component: LectoraPages,
  Component: LectoraPages,
  seed: lectoraSeed,
  pages: lectoraPages,
  editorCss: lectoraEditorCss,
  schema: lectoraSchema,
  defaultData: lectoraDefaultData,
  renderer: {
    key: "lectora",
    name: "Lectora",
    Component: LectoraPages,
    component: LectoraPages,
    pages: lectoraPages,
    editorMode: "visual-react",
    editorCss: lectoraEditorCss,
    schema: lectoraSchema,
    defaultData: lectoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default lectoraTemplate;
