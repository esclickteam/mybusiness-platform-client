import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import InsurevaPages, { insurevaPages } from "./pages";
import InsurevaPreview from "./preview";
import InsurevaThumbnail from "./thumbnail";
import { insurevaEditorCss } from "./editorCss";
import { insurevaSchema } from "./schema";
import { insurevaDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#1D4ED8",
  secondary: "#0B1B3A",
  accent: "#60A5FA",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  text: "#0F172A",
  muted: "#64748B",
  dark: "#0B1B3A",
};

export const insurevaSeed = {
  id: "insureva",
  key: "insureva",
  name: "Insureva",
  title: "Insureva",
  description: "אתר מלא לסוכנות ביטוח: 8 עמודים, תנועה, אפקטים ועיצוב ייחודי.",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  niche: "insurance-agency",
  layout: "full",
  image: (insurevaDefaultData as Record<string, any>).heroImage,
  heroTitle: (insurevaDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (insurevaDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "insureva-header", title: "Header" },
    { type: "hero", variant: "insureva-hero", title: "Hero" },
    { type: "services", variant: "insureva-services", title: "Services" },
    { type: "cases", variant: "insureva-cases", title: "Cases" },
    { type: "team", variant: "insureva-team", title: "Team" },
    { type: "contact", variant: "insureva-contact", title: "Contact" },
    { type: "footer", variant: "insureva-footer", title: "Footer" },
  ].map((block, index) => ({ id: `insureva-${index + 1}-${block.type}`, ...block })),
  pages: insurevaPages,
  editor: { pages: insurevaPages, css: insurevaEditorCss },
  css: insurevaEditorCss,
  data: insurevaDefaultData,
  defaultData: insurevaDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const insurevaTemplate = {
  id: "insureva",
  key: "insureva",
  name: "Insureva",
  title: "Insureva",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  badge: "חדש",
  description: "אתר מלא לסוכנות ביטוח עם 8 עמודים, תנועה ואפקטים — עיצוב ייחודי.",
  thumbnail: React.createElement(InsurevaThumbnail),
  preview: React.createElement(InsurevaPreview),
  component: InsurevaPages,
  Component: InsurevaPages,
  seed: insurevaSeed,
  pages: insurevaPages,
  editorCss: insurevaEditorCss,
  schema: insurevaSchema,
  defaultData: insurevaDefaultData,
  renderer: {
    key: "insureva",
    name: "Insureva",
    Component: InsurevaPages,
    component: InsurevaPages,
    pages: insurevaPages,
    editorMode: "visual-react",
    editorCss: insurevaEditorCss,
    schema: insurevaSchema,
    defaultData: insurevaDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default insurevaTemplate;
