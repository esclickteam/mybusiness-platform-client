import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import ReelhausPages, { reelhausPages } from "./pages";
import ReelhausPreview from "./preview";
import ReelhausThumbnail from "./thumbnail";
import { reelhausEditorCss } from "./editorCss";
import { reelhausSchema } from "./schema";
import { reelhausDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#D4AF37",
  secondary: "#050403",
  accent: "#E11D48",
  background: "#0C0A09",
  surface: "#1C1917",
  text: "#FFF7ED",
  muted: "#D6D3D1",
  dark: "#050403",
};

export const reelhausSeed = {
  id: "reelhaus",
  key: "reelhaus",
  name: "Reelhaus",
  title: "Reelhaus",
  description: "אתר מלא לסוכנות וידאו: 8 עמודים, תנועה, אפקטים ועיצוב filmstrip cinema.",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  niche: "video-production",
  layout: "full-agency",
  image: (reelhausDefaultData as Record<string, any>).heroImage,
  heroTitle: (reelhausDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (reelhausDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "reelhaus-header", title: "Header" },
    { type: "hero", variant: "reelhaus-hero", title: "Hero" },
    { type: "about", variant: "reelhaus-about", title: "About" },
    { type: "services", variant: "reelhaus-services", title: "Services" },
    { type: "cases", variant: "reelhaus-cases", title: "Cases" },
    { type: "team", variant: "reelhaus-team", title: "Team" },
    { type: "gallery", variant: "reelhaus-gallery", title: "Gallery" },
    { type: "contact", variant: "reelhaus-contact", title: "Contact" },
    { type: "footer", variant: "reelhaus-footer", title: "Footer" },
  ].map((block, index) => ({ id: `reelhaus-${index + 1}-${block.type}`, ...block })),
  pages: reelhausPages,
  editor: { pages: reelhausPages, css: reelhausEditorCss },
  css: reelhausEditorCss,
  data: reelhausDefaultData,
  defaultData: reelhausDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const reelhausTemplate = {
  id: "reelhaus",
  key: "reelhaus",
  name: "Reelhaus",
  title: "Reelhaus",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  badge: "חדש",
  description: "אתר מלא לסוכנות וידאו עם 8 עמודים, תנועה ואפקטים — filmstrip cinema.",
  thumbnail: React.createElement(ReelhausThumbnail),
  preview: React.createElement(ReelhausPreview),
  component: ReelhausPages,
  Component: ReelhausPages,
  seed: reelhausSeed,
  pages: reelhausPages,
  editorCss: reelhausEditorCss,
  schema: reelhausSchema,
  defaultData: reelhausDefaultData,
  renderer: {
    key: "reelhaus",
    name: "Reelhaus",
    Component: ReelhausPages,
    component: ReelhausPages,
    pages: reelhausPages,
    editorMode: "visual-react",
    editorCss: reelhausEditorCss,
    schema: reelhausSchema,
    defaultData: reelhausDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default reelhausTemplate;
