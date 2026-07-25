import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import MediavaultPages, { mediavaultPages } from "./pages";
import MediavaultPreview from "./preview";
import MediavaultThumbnail from "./thumbnail";
import { mediavaultEditorCss } from "./editorCss";
import { mediavaultSchema } from "./schema";
import { mediavaultDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#2563EB",
  secondary: "#020617",
  accent: "#38BDF8",
  background: "#0B1220",
  surface: "#111827",
  text: "#E2E8F0",
  muted: "#94A3B8",
  dark: "#020617",
};

export const mediavaultSeed = {
  id: "mediavault",
  key: "mediavault",
  name: "Mediavault",
  title: "Mediavault",
  description: "אתר מלא לסוכנות מדיה: 8 עמודים, תנועה, אפקטים ועיצוב ייחודי.",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  niche: "media-agency",
  layout: "full",
  image: (mediavaultDefaultData as Record<string, any>).heroImage,
  heroTitle: (mediavaultDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (mediavaultDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "mediavault-header", title: "Header" },
    { type: "hero", variant: "mediavault-hero", title: "Hero" },
    { type: "services", variant: "mediavault-services", title: "Services" },
    { type: "cases", variant: "mediavault-cases", title: "Cases" },
    { type: "team", variant: "mediavault-team", title: "Team" },
    { type: "contact", variant: "mediavault-contact", title: "Contact" },
    { type: "footer", variant: "mediavault-footer", title: "Footer" },
  ].map((block, index) => ({ id: `mediavault-${index + 1}-${block.type}`, ...block })),
  pages: mediavaultPages,
  editor: { pages: mediavaultPages, css: mediavaultEditorCss },
  css: mediavaultEditorCss,
  data: mediavaultDefaultData,
  defaultData: mediavaultDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const mediavaultTemplate = {
  id: "mediavault",
  key: "mediavault",
  name: "Mediavault",
  title: "Mediavault",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  badge: "חדש",
  description: "אתר מלא לסוכנות מדיה עם 8 עמודים, תנועה ואפקטים — עיצוב ייחודי.",
  thumbnail: React.createElement(MediavaultThumbnail),
  preview: React.createElement(MediavaultPreview),
  component: MediavaultPages,
  Component: MediavaultPages,
  seed: mediavaultSeed,
  pages: mediavaultPages,
  editorCss: mediavaultEditorCss,
  schema: mediavaultSchema,
  defaultData: mediavaultDefaultData,
  renderer: {
    key: "mediavault",
    name: "Mediavault",
    Component: MediavaultPages,
    component: MediavaultPages,
    pages: mediavaultPages,
    editorMode: "visual-react",
    editorCss: mediavaultEditorCss,
    schema: mediavaultSchema,
    defaultData: mediavaultDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default mediavaultTemplate;
