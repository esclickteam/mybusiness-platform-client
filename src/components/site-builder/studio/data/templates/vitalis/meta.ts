import React from "react";

import type {
  ReadyWebsitePalette,
  ReadyWebsiteTemplateSeed,
} from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";

import VitalisPages, { vitalisPages } from "./pages";
import VitalisPreview from "./preview";
import VitalisThumbnail from "./thumbnail";
import { vitalisEditorCss } from "./editorCss";
import { vitalisSchema } from "./schema";
import { vitalisDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#0891B2",
  secondary: "#0EA5A4",
  accent: "#38BDF8",
  background: "#F7FCFC",
  surface: "#FFFFFF",
  text: "#0F2A36",
  muted: "#7C95A0",
  dark: "#0A1F28",
};

const blocks = [
  { type: "header", variant: "clinic-pill-nav", title: "Header" },
  { type: "hero", variant: "medical-split", title: "Hero" },
  { type: "trust", variant: "badges-strip", title: "Trust" },
  { type: "about", variant: "image-badge", title: "About" },
  { type: "services", variant: "treatment-grid", title: "Treatments" },
  { type: "process", variant: "care-steps", title: "Process" },
  { type: "team", variant: "doctors-grid", title: "Team" },
  { type: "reviews", variant: "patient-reviews", title: "Reviews" },
  { type: "faq", variant: "split-faq", title: "FAQ" },
  { type: "contact", variant: "gradient-form", title: "Booking" },
  { type: "footer", variant: "cta-footer", title: "Footer" },
];

export const vitalisSeed = {
  id: "vitalis",
  key: "vitalis",
  name: "Vitalis",
  title: "Vitalis",
  description:
    "תבנית פרימיום למרפאת שיניים ובריאות עם הירו נקי, סרגל אמון, טיפולים, מסלול טיפול, צוות רפואי, ביקורות וקביעת תור.",
  category: "medical",
  categoryLabel: "רפואה ובריאות",
  niche: "dental-clinic",
  layout: "full",
  image: (vitalisDefaultData as Record<string, any>).heroImage,
  heroTitle: (vitalisDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (vitalisDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({
    id: `vitalis-${index + 1}-${block.type}`,
    ...block,
  })),
  pages: vitalisPages,
  editor: {
    pages: vitalisPages,
    css: vitalisEditorCss,
  },
  css: vitalisEditorCss,
  data: vitalisDefaultData,
  defaultData: vitalisDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const vitalisTemplate = {
  id: "vitalis",
  key: "vitalis",
  name: "Vitalis",
  title: "Vitalis",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "medical",
  categoryLabel: "רפואה ובריאות",
  badge: "חדש",
  description:
    "תבנית פרימיום למרפאת שיניים ובריאות: עיצוב נקי בטורקיז וכחול, טיפולים, צוות רפואי, ביקורות מטופלים וקביעת תור.",
  thumbnail: React.createElement(VitalisThumbnail),
  preview: React.createElement(VitalisPreview),
  component: VitalisPages,
  Component: VitalisPages,
  seed: vitalisSeed,
  pages: vitalisPages,
  editorCss: vitalisEditorCss,
  schema: vitalisSchema,
  defaultData: vitalisDefaultData,
  renderer: {
    key: "vitalis",
    name: "Vitalis",
    Component: VitalisPages,
    component: VitalisPages,
    pages: vitalisPages,
    editorMode: "visual-react",
    editorCss: vitalisEditorCss,
    schema: vitalisSchema,
    defaultData: vitalisDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default vitalisTemplate;
