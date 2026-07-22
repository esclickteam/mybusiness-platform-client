import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import PrimeviewPages, { primeviewPages } from "./pages";
import PrimeviewPreview from "./preview";
import PrimeviewThumbnail from "./thumbnail";
import { primeviewEditorCss } from "./editorCss";
import { primeviewSchema } from "./schema";
import { primeviewDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#059669", secondary: "#64748b", accent: "#059669",
  background: "#f8fafc", surface: "#ffffff", text: "#0f172a", muted: "#64748b", dark: "#020617",
};

export const primeviewSeed = {
  id: "primeview", key: "primeview", name: "Primeview", title: "Primeview",
  description: "תבנית compare slider: הירo מפוצל עם ידית CSS, תצוגת before/after ופסי value proposition.",
  category: "real-estate", categoryLabel: "נדל״ן", niche: "השוואת נכסים · before/after", layout: "full",
  image: (primeviewDefaultData as any).heroImage,
  heroTitle: (primeviewDefaultData as any).heroTitle,
  heroSubtitle: (primeviewDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "compare-nav", title: "Nav" },
    { type: "hero", variant: "split-slider", title: "Hero" },
    { type: "showcase", variant: "before-after", title: "Showcase" },
    { type: "bands", variant: "value-props", title: "Bands" },
    { type: "about", variant: "transform-story", title: "About" },
    { type: "contact", variant: "estimate-form", title: "Contact" },
    { type: "footer", variant: "minimal", title: "Footer" },
  ].map((b, i) => ({ id: `primeview-${i+1}-${b.type}`, ...b })),
  pages: primeviewPages,
  editor: { pages: primeviewPages, css: primeviewEditorCss },
  css: primeviewEditorCss, data: primeviewDefaultData, defaultData: primeviewDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const primeviewTemplate = {
  id: "primeview", key: "primeview", name: "Primeview", title: "Primeview", author: "Bizuply", priceLabel: "כלול",
  category: "real-estate", categoryLabel: "נדל״ן", badge: "חדש",
  description: "תבנית compare slider: הירo מפוצל עם ידית CSS, תצוגת before/after ופסי value proposition.",
  thumbnail: React.createElement(PrimeviewThumbnail),
  preview: React.createElement(PrimeviewPreview),
  component: PrimeviewPages, Component: PrimeviewPages,
  seed: primeviewSeed, pages: primeviewPages, editorCss: primeviewEditorCss, schema: primeviewSchema, defaultData: primeviewDefaultData,
  renderer: {
    key: "primeview", name: "Primeview", Component: PrimeviewPages, component: PrimeviewPages, pages: primeviewPages,
    editorMode: "visual-react", editorCss: primeviewEditorCss, schema: primeviewSchema, defaultData: primeviewDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default primeviewTemplate;
