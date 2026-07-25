import React from "react";

import type {
  ReadyWebsitePalette,
  ReadyWebsiteTemplateSeed,
} from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";

import VitalcarePages, { vitalcarePages } from "./pages";
import VitalcarePreview from "./preview";
import VitalcareThumbnail from "./thumbnail";
import { vitalcareEditorCss } from "./editorCss";
import { vitalcareSchema } from "./schema";
import { vitalcareDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#0EA5E9",
  secondary: "#0C4A6E",
  accent: "#38BDF8",
  background: "#F0F9FF",
  surface: "#FFFFFF",
  text: "#0C4A6E",
  muted: "#64748B",
  dark: "#082F49",
};

const blocks = [
  { type: "header", variant: "clinical-clean-header", title: "header" },
  { type: "hero", variant: "clinical-clean-hero", title: "hero" },
  { type: "specialties", variant: "clinical-clean-specialties", title: "specialties" },
  { type: "stats", variant: "clinical-clean-stats", title: "stats" },
  { type: "doctors", variant: "clinical-clean-doctors", title: "doctors" },
  { type: "insurance", variant: "clinical-clean-insurance", title: "insurance" },
  { type: "testimonials", variant: "clinical-clean-testimonials", title: "testimonials" },
  { type: "faq", variant: "clinical-clean-faq", title: "faq" },
  { type: "appointment", variant: "clinical-clean-appointment", title: "appointment" },
  { type: "footer", variant: "clinical-clean-footer", title: "footer" },
];

export const vitalcareSeed = {
  id: "vitalcare",
  key: "vitalcare",
  name: "Vitalcare",
  title: "Vitalcare",
  description: "דף נחיתה למרפאה: הירו עם תור, התמחויות, צוות רופאים, ביטוחים, ביקורות מטופלים, FAQ רפואי וטופס — כחול-לבן קlinי.",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  niche: "health",
  layout: "full",
  image: (vitalcareDefaultData as Record<string, any>).heroImage,
  heroTitle: (vitalcareDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (vitalcareDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({
    id: `vitalcare-${index + 1}-${block.type}`,
    ...block,
  })),
  pages: vitalcarePages,
  editor: { pages: vitalcarePages, css: vitalcareEditorCss },
  css: vitalcareEditorCss,
  data: vitalcareDefaultData,
  defaultData: vitalcareDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const vitalcareTemplate = {
  id: "vitalcare",
  key: "vitalcare",
  name: "Vitalcare",
  title: "Vitalcare",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  badge: "Premium",
  description: "דף נחיתה למרפאה: הירו עם תור, התמחויות, צוות רופאים, ביטוחים, ביקורות מטופלים, FAQ רפואי וטופס — כחול-לבן קlinי.",
  thumbnail: React.createElement(VitalcareThumbnail),
  preview: React.createElement(VitalcarePreview),
  component: VitalcarePages,
  Component: VitalcarePages,
  seed: vitalcareSeed,
  pages: vitalcarePages,
  editorCss: vitalcareEditorCss,
  schema: vitalcareSchema,
  defaultData: vitalcareDefaultData,
  renderer: {
    key: "vitalcare",
    name: "Vitalcare",
    Component: VitalcarePages,
    component: VitalcarePages,
    pages: vitalcarePages,
    editorMode: "visual-react",
    editorCss: vitalcareEditorCss,
    schema: vitalcareSchema,
    defaultData: vitalcareDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default vitalcareTemplate;
