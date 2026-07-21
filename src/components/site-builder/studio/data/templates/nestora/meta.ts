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
  primary: "#3D5A80", secondary: "#8FA3B8", accent: "#1E2836",
  background: "#F3F5F8", surface: "#E6EBF2", text: "#1E2836", muted: "#667788", dark: "#0F141C",
};

export const nestoraSeed = {
  id: "nestora", key: "nestora", name: "Nestora", title: "Nestora",
  description: "תבנית בוטיק לסוכנות נדל״ן אישית: אבן קרה ודיו כחול, פריסה אווירית חדה בלי כרטיסיות.",
  category: "real-estate", categoryLabel: "נדל״ן", niche: "real-estate", layout: "full",
  image: (nestoraDefaultData as any).heroImage,
  heroTitle: (nestoraDefaultData as any).heroTitle,
  heroSubtitle: (nestoraDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "sharp-nav", title: "Header" },
    { type: "hero", variant: "full-bleed", title: "Hero" },
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
  description: "תבנית בוטיק לסוכנות נדל״ן אישית: אבן קרה ודיו כחול, פריסה אווירית חדה בלי כרטיסיות.",
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
