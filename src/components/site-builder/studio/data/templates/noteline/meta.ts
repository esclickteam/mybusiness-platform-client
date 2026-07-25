import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import NotelinePages, { notelinePages } from "./pages";
import NotelinePreview from "./preview";
import NotelineThumbnail from "./thumbnail";
import { notelineEditorCss } from "./editorCss";
import { notelineSchema } from "./schema";
import { notelineDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#C2410C",
  secondary: "#1C1917",
  accent: "#EA580C",
  background: "#1C1917",
  surface: "#292524",
  text: "#FAFAF9",
  muted: "#A8A29E",
  dark: "#0C0A09",
};

const blocks = [
  { type: "header", variant: "copperCharcoal-header", title: "header" },
  { type: "hero", variant: "copperCharcoal-hero", title: "hero" },
  { type: "courses", variant: "copperCharcoal-courses", title: "courses" },
  { type: "curriculum", variant: "copperCharcoal-curriculum", title: "curriculum" },
  { type: "instructors", variant: "copperCharcoal-instructors", title: "instructors" },
  { type: "stats", variant: "copperCharcoal-stats", title: "stats" },
  { type: "testimonials", variant: "copperCharcoal-testimonials", title: "testimonials" },
  { type: "faq", variant: "copperCharcoal-faq", title: "faq" },
  { type: "contact", variant: "copperCharcoal-contact", title: "contact" },
  { type: "footer", variant: "copperCharcoal-footer", title: "footer" },
];

export const notelineSeed = {
  id: "noteline",
  key: "noteline",
  name: "Noteline",
  title: "Noteline",
  description: "בית ספר למוזיקה: הירו עם גלי קול, טרקליסט קורסים וקו מנחים על הבמה.",
  category: "education",
  categoryLabel: "חינוך וקורסים",
  niche: "music-school",
  layout: "full",
  image: (notelineDefaultData as Record<string, any>).heroImage,
  heroTitle: (notelineDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (notelineDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `noteline-${index + 1}-${block.type}`, ...block })),
  pages: notelinePages,
  editor: { pages: notelinePages, css: notelineEditorCss },
  css: notelineEditorCss,
  data: notelineDefaultData,
  defaultData: notelineDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const notelineTemplate = {
  id: "noteline",
  key: "noteline",
  name: "Noteline",
  title: "Noteline",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "education",
  categoryLabel: "חינוך וקורסים",
  badge: "חדש",
  description: "בית ספר למוזיקה: הירו עם גלי קול, טרקליסט קורסים וקו מנחים על הבמה.",
  thumbnail: React.createElement(NotelineThumbnail),
  preview: React.createElement(NotelinePreview),
  component: NotelinePages,
  Component: NotelinePages,
  seed: notelineSeed,
  pages: notelinePages,
  editorCss: notelineEditorCss,
  schema: notelineSchema,
  defaultData: notelineDefaultData,
  renderer: {
    key: "noteline",
    name: "Noteline",
    Component: NotelinePages,
    component: NotelinePages,
    pages: notelinePages,
    editorMode: "visual-react",
    editorCss: notelineEditorCss,
    schema: notelineSchema,
    defaultData: notelineDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default notelineTemplate;
