import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import NarrativaPages, { narrativaPages } from "./pages";
import NarrativaPreview from "./preview";
import NarrativaThumbnail from "./thumbnail";
import { narrativaEditorCss } from "./editorCss";
import { narrativaSchema } from "./schema";
import { narrativaDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#BE123C",
  secondary: "#1F0A12",
  accent: "#FB7185",
  background: "#FFF1F2",
  surface: "#FFFFFF",
  text: "#4C0519",
  muted: "#9F1239",
  dark: "#1F0A12",
};

export const narrativaSeed = {
  id: "narrativa",
  key: "narrativa",
  name: "Narrativa",
  title: "Narrativa",
  description: "אתר מלא לסוכנות יחסי ציבור: 8 עמודים כולל אודות, שירותים, פרויקטים, צוות, תובנות, תהליך וצור קשר.",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  niche: "pr-agency",
  layout: "full",
  image: (narrativaDefaultData as Record<string, any>).heroImage,
  heroTitle: (narrativaDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (narrativaDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "narrativa-header", title: "Header" },
    { type: "hero", variant: "narrativa-hero", title: "Hero" },
    { type: "services", variant: "narrativa-services", title: "Services" },
    { type: "cases", variant: "narrativa-cases", title: "Cases" },
    { type: "team", variant: "narrativa-team", title: "Team" },
    { type: "contact", variant: "narrativa-contact", title: "Contact" },
    { type: "footer", variant: "narrativa-footer", title: "Footer" },
  ].map((block, index) => ({ id: `narrativa-${index + 1}-${block.type}`, ...block })),
  pages: narrativaPages,
  editor: { pages: narrativaPages, css: narrativaEditorCss },
  css: narrativaEditorCss,
  data: narrativaDefaultData,
  defaultData: narrativaDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const narrativaTemplate = {
  id: "narrativa",
  key: "narrativa",
  name: "Narrativa",
  title: "Narrativa",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  badge: "חדש",
  description: "אתר מלא לסוכנות יחסי ציבור עם 8 עמודים, ניווט פנימי ותוכן מוכן לעריכה.",
  thumbnail: React.createElement(NarrativaThumbnail),
  preview: React.createElement(NarrativaPreview),
  component: NarrativaPages,
  Component: NarrativaPages,
  seed: narrativaSeed,
  pages: narrativaPages,
  editorCss: narrativaEditorCss,
  schema: narrativaSchema,
  defaultData: narrativaDefaultData,
  renderer: {
    key: "narrativa",
    name: "Narrativa",
    Component: NarrativaPages,
    component: NarrativaPages,
    pages: narrativaPages,
    editorMode: "visual-react",
    editorCss: narrativaEditorCss,
    schema: narrativaSchema,
    defaultData: narrativaDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default narrativaTemplate;
