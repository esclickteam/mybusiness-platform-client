import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import NestoraPages, { nestoraPages } from "./pages";
import NestoraPreview from "./preview";
import NestoraThumbnail from "./thumbnail";
import { nestoraEditorCss } from "./editorCss";
import { nestoraSchema } from "./schema";
import { nestoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#3d5a80", secondary: "#6a7585", accent: "#3d5a80",
  background: "#eef1f5", surface: "#e2e7ee", text: "#1e2836", muted: "#6a7585", dark: "#121820",
};

export const nestoraSeed = {
  id: "nestora", key: "nestora", name: "Nestora", title: "Nestora",
  description: "תבנית בוטיק אינטימית: ציטוט גדול, נכס אחד בפוקוס, אבן קרה וכחול דיו, תנועה עדינה.",
  category: "real-estate", categoryLabel: "נדל״ן", niche: "real-estate", layout: "full",
  image: (nestoraDefaultData as any).heroImage,
  heroTitle: (nestoraDefaultData as any).heroTitle,
  heroSubtitle: (nestoraDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "sharp-nav", title: "Header" },
    { type: "hero", variant: "quoteFeature", title: "Hero" },
    { type: "services", variant: "list", title: "Listings" },
    { type: "contact", variant: "plain-form", title: "Contact" },
    { type: "footer", variant: "minimal", title: "Footer" },
  ].map((b, i) => ({ id: `nestora-${i+1}-${b.type}`, ...b })),
  pages: nestoraPages,
  editor: { pages: nestoraPages, css: nestoraEditorCss },
  css: nestoraEditorCss, data: nestoraDefaultData, defaultData: nestoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const nestoraTemplate = {
  id: "nestora", key: "nestora", name: "Nestora", title: "Nestora", author: "Bizuply", priceLabel: "כלול",
  category: "real-estate", categoryLabel: "נדל״ן", badge: "חדש",
  description: "תבנית בוטיק אינטימית: ציטוט גדול, נכס אחד בפוקוס, אבן קרה וכחול דיו, תנועה עדינה.",
  thumbnail: React.createElement(NestoraThumbnail),
  preview: React.createElement(NestoraPreview),
  component: NestoraPages, Component: NestoraPages,
  seed: nestoraSeed, pages: nestoraPages, editorCss: nestoraEditorCss, schema: nestoraSchema, defaultData: nestoraDefaultData,
  renderer: {
    key: "nestora", name: "Nestora", Component: NestoraPages, component: NestoraPages, pages: nestoraPages,
    editorMode: "visual-react", editorCss: nestoraEditorCss, schema: nestoraSchema, defaultData: nestoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default nestoraTemplate;
