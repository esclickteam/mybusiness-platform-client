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
  primary: "#0D5C63",
  secondary: "#0A3D42",
  accent: "#B8D8D4",
  background: "#F5F7F8",
  surface: "#FFFFFF",
  text: "#163033",
  muted: "#5F6F72",
  dark: "#0A1F22",
};

const blocks = [
  { type: "header", variant: "premium-clinical-header", title: "Header" },
  { type: "hero", variant: "premium-clinical-hero", title: "Hero" },
  { type: "specialties", variant: "premium-clinical-specialties", title: "Specialties" },
  { type: "stats", variant: "premium-clinical-trust-stats", title: "Trust stats" },
  { type: "doctors", variant: "premium-clinical-doctors", title: "Doctors" },
  { type: "insurance", variant: "premium-clinical-insurance", title: "Insurance partners" },
  { type: "testimonials", variant: "premium-clinical-testimonials", title: "Patient testimonials" },
  { type: "faq", variant: "premium-clinical-faq", title: "Medical FAQ" },
  { type: "appointment", variant: "premium-clinical-appointment", title: "Appointment form" },
  { type: "footer", variant: "premium-clinical-footer-cta", title: "Footer CTA" },
];

export const vitalcareSeed = {
  id: "vitalcare",
  key: "vitalcare",
  name: "Vitalcare",
  title: "Vitalcare",
  description:
    "דף נחיתה פרימיום למרפאה רב-תחומית: הירו צילום מלא, התמחויות, נתוני אמון, רופאים, ביטוחים, המלצות, FAQ וטופס תור בגווני טורקיז עמוק ומינט.",
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
  description:
    "דף נחיתה פרימיום למרפאה רב-תחומית: הירו צילום מלא, התמחויות, נתוני אמון, רופאים, ביטוחים, המלצות, FAQ וטופס תור בגווני טורקיז עמוק ומינט.",
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
