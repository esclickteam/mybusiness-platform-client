import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import SummitopsPages, { summitopsPages } from "./pages";
import SummitopsPreview from "./preview";
import SummitopsThumbnail from "./thumbnail";
import { summitopsEditorCss } from "./editorCss";
import { summitopsSchema } from "./schema";
import { summitopsDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#0F766E",
  secondary: "#042F2E",
  accent: "#134E4A",
  background: "#F0FDFA",
  surface: "#FFFFFF",
  text: "#134E4A",
  muted: "#5F7A76",
  dark: "#042F2E",
};

export const summitopsSeed = {
  id: "summitops",
  key: "summitops",
  name: "Summitops",
  title: "Summitops",
  description: "אתר מלא לסוכנות ייעוץ עסקי: 8 עמודים, תנועה, אפקטים ועיצוב ייחודי.",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  niche: "consulting-agency",
  layout: "full",
  image: (summitopsDefaultData as Record<string, any>).heroImage,
  heroTitle: (summitopsDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (summitopsDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "summitops-header", title: "Header" },
    { type: "hero", variant: "summitops-hero", title: "Hero" },
    { type: "services", variant: "summitops-services", title: "Services" },
    { type: "cases", variant: "summitops-cases", title: "Cases" },
    { type: "team", variant: "summitops-team", title: "Team" },
    { type: "contact", variant: "summitops-contact", title: "Contact" },
    { type: "footer", variant: "summitops-footer", title: "Footer" },
  ].map((block, index) => ({ id: `summitops-${index + 1}-${block.type}`, ...block })),
  pages: summitopsPages,
  editor: { pages: summitopsPages, css: summitopsEditorCss },
  css: summitopsEditorCss,
  data: summitopsDefaultData,
  defaultData: summitopsDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const summitopsTemplate = {
  id: "summitops",
  key: "summitops",
  name: "Summitops",
  title: "Summitops",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  badge: "חדש",
  description: "אתר מלא לסוכנות ייעוץ עסקי עם 8 עמודים, תנועה ואפקטים — עיצוב ייחודי.",
  thumbnail: React.createElement(SummitopsThumbnail),
  preview: React.createElement(SummitopsPreview),
  component: SummitopsPages,
  Component: SummitopsPages,
  seed: summitopsSeed,
  pages: summitopsPages,
  editorCss: summitopsEditorCss,
  schema: summitopsSchema,
  defaultData: summitopsDefaultData,
  renderer: {
    key: "summitops",
    name: "Summitops",
    Component: SummitopsPages,
    component: SummitopsPages,
    pages: summitopsPages,
    editorMode: "visual-react",
    editorCss: summitopsEditorCss,
    schema: summitopsSchema,
    defaultData: summitopsDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default summitopsTemplate;
