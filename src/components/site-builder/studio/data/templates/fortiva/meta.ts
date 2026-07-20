import React from "react";

import type {
  ReadyWebsitePalette,
  ReadyWebsiteTemplateSeed,
} from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";

import FortivaPages, { fortivaPages } from "./pages";
import FortivaPreview from "./preview";
import FortivaThumbnail from "./thumbnail";
import { fortivaEditorCss } from "./editorCss";
import { fortivaSchema } from "./schema";
import { fortivaDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#0F1E3D",
  secondary: "#13294B",
  accent: "#B8935A",
  background: "#F6F5F1",
  surface: "#FFFFFF",
  text: "#0F1E3D",
  muted: "#7A8395",
  dark: "#0A1428",
};

const blocks = [
  { type: "header", variant: "corporate-underline", title: "Header" },
  { type: "hero", variant: "editorial-split", title: "Hero" },
  { type: "benefits", variant: "value-cards", title: "Values" },
  { type: "about", variant: "image-badge", title: "About" },
  { type: "services", variant: "dark-practice-areas", title: "Practice Areas" },
  { type: "process", variant: "numbered-steps", title: "Process" },
  { type: "results", variant: "case-cards", title: "Cases" },
  { type: "team", variant: "attorney-grid", title: "Team" },
  { type: "contact", variant: "dark-form", title: "Contact" },
  { type: "footer", variant: "cta-footer", title: "Footer" },
];

export const fortivaSeed = {
  id: "fortiva",
  key: "fortiva",
  name: "Fortiva",
  title: "Fortiva",
  description:
    "תבנית פרימיום למשרד עורכי דין וייעוץ פיננסי עם הירו אלגנטי, ערכים, תחומי עיסוק, תהליך עבודה, הצלחות, צוות וטופס פנייה.",
  category: "business",
  categoryLabel: "עסקים ושירותים",
  niche: "law-finance",
  layout: "full",
  image: (fortivaDefaultData as Record<string, any>).heroImage,
  heroTitle: (fortivaDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (fortivaDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({
    id: `fortiva-${index + 1}-${block.type}`,
    ...block,
  })),
  pages: fortivaPages,
  editor: {
    pages: fortivaPages,
    css: fortivaEditorCss,
  },
  css: fortivaEditorCss,
  data: fortivaDefaultData,
  defaultData: fortivaDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const fortivaTemplate = {
  id: "fortiva",
  key: "fortiva",
  name: "Fortiva",
  title: "Fortiva",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "business",
  categoryLabel: "עסקים ושירותים",
  badge: "חדש",
  description:
    "תבנית פרימיום למשרד עורכי דין וייעוץ פיננסי בסגנון קורפורייט יוקרתי: נייבי וזהב, תחומי עיסוק, הצלחות, צוות וטופס פנייה.",
  thumbnail: React.createElement(FortivaThumbnail),
  preview: React.createElement(FortivaPreview),
  component: FortivaPages,
  Component: FortivaPages,
  seed: fortivaSeed,
  pages: fortivaPages,
  editorCss: fortivaEditorCss,
  schema: fortivaSchema,
  defaultData: fortivaDefaultData,
  renderer: {
    key: "fortiva",
    name: "Fortiva",
    Component: FortivaPages,
    component: FortivaPages,
    pages: fortivaPages,
    editorMode: "visual-react",
    editorCss: fortivaEditorCss,
    schema: fortivaSchema,
    defaultData: fortivaDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default fortivaTemplate;
