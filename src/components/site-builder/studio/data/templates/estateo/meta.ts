import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import EstateoPages, { estateoPages } from "./pages";
import EstateoPreview from "./preview";
import EstateoThumbnail from "./thumbnail";
import { estateoEditorCss } from "./editorCss";
import { estateoSchema } from "./schema";
import { estateoDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#D4AF6A", secondary: "#8A6E3B", accent: "#F0D9A8",
  background: "#14110F", surface: "#1E1A16", text: "#F5EFE6", muted: "#A89A86", dark: "#0A0908",
};

export const estateoSeed = {
  id: "estateo", key: "estateo", name: "Estateo", title: "Estateo",
  description: "תבנית נדל״ן קלאסית-יוקרתית: פחם וזהב, פריסת פוסטר אסימטרית, רשימות נכסים חדות.",
  category: "real-estate", categoryLabel: "נדל״ן", niche: "real-estate", layout: "full",
  image: (estateoDefaultData as any).heroImage,
  heroTitle: (estateoDefaultData as any).heroTitle,
  heroSubtitle: (estateoDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "sharp-nav", title: "Header" },
    { type: "hero", variant: "full-bleed", title: "Hero" },
    { type: "services", variant: "list", title: "Listings" },
    { type: "contact", variant: "plain-form", title: "Contact" },
    { type: "footer", variant: "minimal", title: "Footer" },
  ].map((b, i) => ({ id: `estateo-${i+1}-${b.type}`, ...b })),
  pages: estateoPages,
  editor: { pages: estateoPages, css: estateoEditorCss },
  css: estateoEditorCss, data: estateoDefaultData, defaultData: estateoDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const estateoTemplate = {
  id: "estateo", key: "estateo", name: "Estateo", title: "Estateo", author: "Bizuply", priceLabel: "כלול",
  category: "real-estate", categoryLabel: "נדל״ן", badge: "חדש",
  description: "תבנית נדל״ן קלאסית-יוקרתית: פחם וזהב, פריסת פוסטר אסימטרית, רשימות נכסים חדות.",
  thumbnail: React.createElement(EstateoThumbnail),
  preview: React.createElement(EstateoPreview),
  component: EstateoPages, Component: EstateoPages,
  seed: estateoSeed, pages: estateoPages, editorCss: estateoEditorCss, schema: estateoSchema, defaultData: estateoDefaultData,
  renderer: {
    key: "estateo", name: "Estateo", Component: EstateoPages, component: EstateoPages, pages: estateoPages,
    editorMode: "visual-react", editorCss: estateoEditorCss, schema: estateoSchema, defaultData: estateoDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default estateoTemplate;
