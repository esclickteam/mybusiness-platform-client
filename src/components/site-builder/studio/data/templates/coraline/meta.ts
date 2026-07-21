import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import CoralinePages, { coralinePages } from "./pages";
import CoralinePreview from "./preview";
import CoralineThumbnail from "./thumbnail";
import { coralineEditorCss } from "./editorCss";
import { coralineSchema } from "./schema";
import { coralineDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#3dffd4", secondary: "#7eb8d4", accent: "#3dffd4",
  background: "#041824", surface: "#0a2438", text: "#e8f4ff", muted: "#7eb8d4", dark: "#020c14",
};

export const coralineSeed = {
  id: "coraline", key: "coraline", name: "Coraline", title: "Coraline",
  description: "תבנית בית ספר לצלילה: הירו תת-ימי עם בועות צפות, כרטיסי זכוכית, ציר עומק וטופס טבילה — אפקט shimmer ייחודי.",
  category: "travel", categoryLabel: "תיירות וחוף", niche: "צלילה · שונית", layout: "full",
  image: (coralineDefaultData as any).heroImage,
  heroTitle: (coralineDefaultData as any).heroTitle,
  heroSubtitle: (coralineDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "deep-nav", title: "Deep nav" },
    { type: "hero", variant: "bubble-depth", title: "Underwater bubble hero" },
    { type: "services", variant: "glass-cards", title: "Glass morphism cards" },
    { type: "timeline", variant: "depth-timeline", title: "Depth timeline" },
    { type: "about", variant: "dive-school", title: "Dive school" },
    { type: "contact", variant: "signup-form", title: "Signup form" },
    { type: "footer", variant: "minimal", title: "Footer" },
  ].map((b, i) => ({ id: `coraline-${i+1}-${b.type}`, ...b })),
  pages: coralinePages,
  editor: { pages: coralinePages, css: coralineEditorCss },
  css: coralineEditorCss, data: coralineDefaultData, defaultData: coralineDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const coralineTemplate = {
  id: "coraline", key: "coraline", name: "Coraline", title: "Coraline", author: "Bizuply", priceLabel: "כלול",
  category: "travel", categoryLabel: "תיירות וחוף", badge: "חדש",
  description: "תבנית בית ספר לצלילה: הירו תת-ימי עם בועות צפות, כרטיסי זכוכית, ציר עומק וטופס טבילה — אפקט shimmer ייחודי.",
  thumbnail: React.createElement(CoralineThumbnail),
  preview: React.createElement(CoralinePreview),
  component: CoralinePages, Component: CoralinePages,
  seed: coralineSeed, pages: coralinePages, editorCss: coralineEditorCss, schema: coralineSchema, defaultData: coralineDefaultData,
  renderer: {
    key: "coraline", name: "Coraline", Component: CoralinePages, component: CoralinePages, pages: coralinePages,
    editorMode: "visual-react", editorCss: coralineEditorCss, schema: coralineSchema, defaultData: coralineDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default coralineTemplate;
