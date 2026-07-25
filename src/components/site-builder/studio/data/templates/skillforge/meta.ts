import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import SkillforgePages, { skillforgePages } from "./pages";
import SkillforgePreview from "./preview";
import SkillforgeThumbnail from "./thumbnail";
import { skillforgeEditorCss } from "./editorCss";
import { skillforgeSchema } from "./schema";
import { skillforgeDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#A3E635",
  secondary: "#18181B",
  accent: "#84CC16",
  background: "#18181B",
  surface: "#27272A",
  text: "#FAFAFA",
  muted: "#A1A1AA",
  dark: "#09090B",
};

const blocks = [
  { type: "header", variant: "steelLime-header", title: "header" },
  { type: "hero", variant: "steelLime-hero", title: "hero" },
  { type: "pageHero", variant: "steelLime-pageHero", title: "pageHero" },
  { type: "about", variant: "steelLime-about", title: "about" },
  { type: "why", variant: "steelLime-why", title: "why" },
  { type: "method", variant: "steelLime-method", title: "method" },
  { type: "gallery", variant: "steelLime-gallery", title: "gallery" },
  { type: "outcomes", variant: "steelLime-outcomes", title: "outcomes" },
  { type: "pricing", variant: "steelLime-pricing", title: "pricing" },
  { type: "insights", variant: "steelLime-insights", title: "insights" },
  { type: "cta", variant: "steelLime-cta", title: "cta" },
  { type: "courses", variant: "steelLime-courses", title: "courses" },
  { type: "curriculum", variant: "steelLime-curriculum", title: "curriculum" },
  { type: "instructors", variant: "steelLime-instructors", title: "instructors" },
  { type: "stats", variant: "steelLime-stats", title: "stats" },
  { type: "testimonials", variant: "steelLime-testimonials", title: "testimonials" },
  { type: "faq", variant: "steelLime-faq", title: "faq" },
  { type: "contact", variant: "steelLime-contact", title: "contact" },
  { type: "footer", variant: "steelLime-footer", title: "footer" },
];

export const skillforgeSeed = {
  id: "skillforge",
  key: "skillforge",
  name: "Skillforge",
  title: "Skillforge",
  description: "כישורי קריירה בסגנון תעשייתי: טיפוגרפיה נועזת, לוחות מתכת ותהליך חישול.",
  category: "education",
  categoryLabel: "חינוך וקורסים",
  niche: "career-skills",
  layout: "full",
  image: (skillforgeDefaultData as Record<string, any>).heroImage,
  heroTitle: (skillforgeDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (skillforgeDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `skillforge-${index + 1}-${block.type}`, ...block })),
  pages: skillforgePages,
  editor: { pages: skillforgePages, css: skillforgeEditorCss },
  css: skillforgeEditorCss,
  data: skillforgeDefaultData,
  defaultData: skillforgeDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const skillforgeTemplate = {
  id: "skillforge",
  key: "skillforge",
  name: "Skillforge",
  title: "Skillforge",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "education",
  categoryLabel: "חינוך וקורסים",
  badge: "חדש",
  description: "כישורי קריירה בסגנון תעשייתי: טיפוגרפיה נועזת, לוחות מתכת ותהליך חישול.",
  thumbnail: React.createElement(SkillforgeThumbnail),
  preview: React.createElement(SkillforgePreview),
  component: SkillforgePages,
  Component: SkillforgePages,
  seed: skillforgeSeed,
  pages: skillforgePages,
  editorCss: skillforgeEditorCss,
  schema: skillforgeSchema,
  defaultData: skillforgeDefaultData,
  renderer: {
    key: "skillforge",
    name: "Skillforge",
    Component: SkillforgePages,
    component: SkillforgePages,
    pages: skillforgePages,
    editorMode: "visual-react",
    editorCss: skillforgeEditorCss,
    schema: skillforgeSchema,
    defaultData: skillforgeDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default skillforgeTemplate;
