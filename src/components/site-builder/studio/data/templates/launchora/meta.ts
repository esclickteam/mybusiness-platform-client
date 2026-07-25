import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import LaunchoraPages, { launchoraPages } from "./pages";
import LaunchoraPreview from "./preview";
import LaunchoraThumbnail from "./thumbnail";
import { launchoraEditorCss } from "./editorCss";
import { launchoraSchema } from "./schema";
import { launchoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#EF4444",
  secondary: "#090303",
  accent: "#FBBF24",
  background: "#170B0B",
  surface: "#261111",
  text: "#FFF7ED",
  muted: "#FDBA74",
  dark: "#090303",
};

export const launchoraSeed = {
  id: "launchora",
  key: "launchora",
  name: "Launchora",
  title: "Launchora",
  description: "אתר מלא לסוכנות השקות מוצר: 8 עמודים, תנועה, אפקטים ועיצוב countdown ignition.",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  niche: "product-launch-agency",
  layout: "full-agency",
  image: (launchoraDefaultData as Record<string, any>).heroImage,
  heroTitle: (launchoraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (launchoraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "launchora-header", title: "Header" },
    { type: "hero", variant: "launchora-hero", title: "Hero" },
    { type: "about", variant: "launchora-about", title: "About" },
    { type: "services", variant: "launchora-services", title: "Services" },
    { type: "cases", variant: "launchora-cases", title: "Cases" },
    { type: "team", variant: "launchora-team", title: "Team" },
    { type: "gallery", variant: "launchora-gallery", title: "Gallery" },
    { type: "contact", variant: "launchora-contact", title: "Contact" },
    { type: "footer", variant: "launchora-footer", title: "Footer" },
  ].map((block, index) => ({ id: `launchora-${index + 1}-${block.type}`, ...block })),
  pages: launchoraPages,
  editor: { pages: launchoraPages, css: launchoraEditorCss },
  css: launchoraEditorCss,
  data: launchoraDefaultData,
  defaultData: launchoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const launchoraTemplate = {
  id: "launchora",
  key: "launchora",
  name: "Launchora",
  title: "Launchora",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  badge: "חדש",
  description: "אתר מלא לסוכנות השקות מוצר עם 8 עמודים, תנועה ואפקטים — countdown ignition.",
  thumbnail: React.createElement(LaunchoraThumbnail),
  preview: React.createElement(LaunchoraPreview),
  component: LaunchoraPages,
  Component: LaunchoraPages,
  seed: launchoraSeed,
  pages: launchoraPages,
  editorCss: launchoraEditorCss,
  schema: launchoraSchema,
  defaultData: launchoraDefaultData,
  renderer: {
    key: "launchora",
    name: "Launchora",
    Component: LaunchoraPages,
    component: LaunchoraPages,
    pages: launchoraPages,
    editorMode: "visual-react",
    editorCss: launchoraEditorCss,
    schema: launchoraSchema,
    defaultData: launchoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default launchoraTemplate;
