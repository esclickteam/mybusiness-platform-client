import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import CampuslyPages, { campuslyPages } from "./pages";
import CampuslyPreview from "./preview";
import CampuslyThumbnail from "./thumbnail";
import { campuslyEditorCss } from "./editorCss";
import { campuslySchema } from "./schema";
import { campuslyDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#1D4ED8",
  secondary: "#EFF6FF",
  accent: "#3B82F6",
  background: "#EFF6FF",
  surface: "#FFFFFF",
  text: "#1E3A8A",
  muted: "#64748B",
  dark: "#1E3A8A",
};

const blocks = [
  { type: "header", variant: "campusBlue-header", title: "header" },
  { type: "hero", variant: "campusBlue-hero", title: "hero" },
  { type: "courses", variant: "campusBlue-courses", title: "courses" },
  { type: "curriculum", variant: "campusBlue-curriculum", title: "curriculum" },
  { type: "instructors", variant: "campusBlue-instructors", title: "instructors" },
  { type: "stats", variant: "campusBlue-stats", title: "stats" },
  { type: "testimonials", variant: "campusBlue-testimonials", title: "testimonials" },
  { type: "faq", variant: "campusBlue-faq", title: "faq" },
  { type: "contact", variant: "campusBlue-contact", title: "contact" },
  { type: "footer", variant: "campusBlue-footer", title: "footer" },
];

export const campuslySeed = {
  id: "campusly",
  key: "campusly",
  name: "Campusly",
  title: "Campusly",
  description: "שיעורים פרטיים אקדמיים: הירו ספרייה, טבלת מקצועות ולוח סמסטר.",
  category: "education",
  categoryLabel: "חינוך וקורסים",
  niche: "academic-tutoring",
  layout: "full",
  image: (campuslyDefaultData as Record<string, any>).heroImage,
  heroTitle: (campuslyDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (campuslyDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `campusly-${index + 1}-${block.type}`, ...block })),
  pages: campuslyPages,
  editor: { pages: campuslyPages, css: campuslyEditorCss },
  css: campuslyEditorCss,
  data: campuslyDefaultData,
  defaultData: campuslyDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const campuslyTemplate = {
  id: "campusly",
  key: "campusly",
  name: "Campusly",
  title: "Campusly",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "education",
  categoryLabel: "חינוך וקורסים",
  badge: "חדש",
  description: "שיעורים פרטיים אקדמיים: הירו ספרייה, טבלת מקצועות ולוח סמסטר.",
  thumbnail: React.createElement(CampuslyThumbnail),
  preview: React.createElement(CampuslyPreview),
  component: CampuslyPages,
  Component: CampuslyPages,
  seed: campuslySeed,
  pages: campuslyPages,
  editorCss: campuslyEditorCss,
  schema: campuslySchema,
  defaultData: campuslyDefaultData,
  renderer: {
    key: "campusly",
    name: "Campusly",
    Component: CampuslyPages,
    component: CampuslyPages,
    pages: campuslyPages,
    editorMode: "visual-react",
    editorCss: campuslyEditorCss,
    schema: campuslySchema,
    defaultData: campuslyDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default campuslyTemplate;
