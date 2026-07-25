import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import MentoraPages, { mentoraPages } from "./pages";
import MentoraPreview from "./preview";
import MentoraThumbnail from "./thumbnail";
import { mentoraEditorCss } from "./editorCss";
import { mentoraSchema } from "./schema";
import { mentoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#F59E0B",
  secondary: "#111827",
  accent: "#FBBF24",
  background: "#0F172A",
  surface: "#1E293B",
  text: "#F8FAFC",
  muted: "#94A3B8",
  dark: "#020617",
};

const blocks = [
  { type: "header", variant: "inkAmber-header", title: "header" },
  { type: "hero", variant: "inkAmber-hero", title: "hero" },
  { type: "courses", variant: "inkAmber-courses", title: "courses" },
  { type: "curriculum", variant: "inkAmber-curriculum", title: "curriculum" },
  { type: "instructors", variant: "inkAmber-instructors", title: "instructors" },
  { type: "stats", variant: "inkAmber-stats", title: "stats" },
  { type: "testimonials", variant: "inkAmber-testimonials", title: "testimonials" },
  { type: "faq", variant: "inkAmber-faq", title: "faq" },
  { type: "contact", variant: "inkAmber-contact", title: "contact" },
  { type: "footer", variant: "inkAmber-footer", title: "footer" },
];

export const mentoraSeed = {
  id: "mentora",
  key: "mentora",
  name: "Mentora",
  title: "Mentora",
  description: "אתר מנטורשיפ: הירו מפוצל דביק, מסלולי ליווי, תהליך מעגלי ומנטורים.",
  category: "education",
  categoryLabel: "חינוך וקורסים",
  niche: "mentorship",
  layout: "full",
  image: (mentoraDefaultData as Record<string, any>).heroImage,
  heroTitle: (mentoraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (mentoraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `mentora-${index + 1}-${block.type}`, ...block })),
  pages: mentoraPages,
  editor: { pages: mentoraPages, css: mentoraEditorCss },
  css: mentoraEditorCss,
  data: mentoraDefaultData,
  defaultData: mentoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const mentoraTemplate = {
  id: "mentora",
  key: "mentora",
  name: "Mentora",
  title: "Mentora",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "education",
  categoryLabel: "חינוך וקורסים",
  badge: "Premium",
  description: "אתר מנטורשיפ: הירו מפוצל דביק, מסלולי ליווי, תהליך מעגלי ומנטורים.",
  thumbnail: React.createElement(MentoraThumbnail),
  preview: React.createElement(MentoraPreview),
  component: MentoraPages,
  Component: MentoraPages,
  seed: mentoraSeed,
  pages: mentoraPages,
  editorCss: mentoraEditorCss,
  schema: mentoraSchema,
  defaultData: mentoraDefaultData,
  renderer: {
    key: "mentora",
    name: "Mentora",
    Component: MentoraPages,
    component: MentoraPages,
    pages: mentoraPages,
    editorMode: "visual-react",
    editorCss: mentoraEditorCss,
    schema: mentoraSchema,
    defaultData: mentoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default mentoraTemplate;
