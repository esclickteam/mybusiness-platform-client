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
  description: "תבנית בוטיק שקטה: הירו ציטוט גדול עם נכס מוביל, שלושה נכסים בלבד בערימה מרווחת, גישה כמכתב אישי וטופס קטן לצד פתק.",
  category: "real-estate", categoryLabel: "נדל״ן", niche: "real-estate", layout: "full",
  image: (nestoraDefaultData as any).heroImage,
  heroTitle: (nestoraDefaultData as any).heroTitle,
  heroSubtitle: (nestoraDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "soft-stone-brand", title: "Soft stone header" },
    { type: "hero", variant: "quote-feature-strip", title: "Quote feature hero" },
    { type: "listings", variant: "three-spacious-stories", title: "Boutique properties" },
    { type: "about", variant: "personal-letter", title: "Personal letter" },
    { type: "contact", variant: "note-and-small-form", title: "Personal note contact" },
    { type: "footer", variant: "brand-only", title: "Quiet footer" },
  ].map((b, i) => ({ id: `nestora-${i + 1}-${b.type}`, ...b })),
  pages: nestoraPages,
  editor: { pages: nestoraPages, css: nestoraEditorCss },
  css: nestoraEditorCss, data: nestoraDefaultData, defaultData: nestoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const nestoraTemplate = {
  id: "nestora", key: "nestora", name: "Nestora", title: "Nestora", author: "Bizuply", priceLabel: "כלול",
  category: "real-estate", categoryLabel: "נדל״ן", badge: "חדש",
  description: "תבנית בוטיק שקטה עם ציטוט גדול, נכס מוביל, שלושה נכסים מרווחים ומכתב גישה אישי.",
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
