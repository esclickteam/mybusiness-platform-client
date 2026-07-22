import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import AxispointPages, { axispointPages } from "./pages";
import AxispointPreview from "./preview";
import AxispointThumbnail from "./thumbnail";
import { axispointEditorCss } from "./editorCss";
import { axispointSchema } from "./schema";
import { axispointDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#f43f5e", secondary: "#94a3b8", accent: "#f43f5e",
  background: "#0c1222", surface: "#151d32", text: "#e2e8f0", muted: "#94a3b8", dark: "#060a14",
};

export const axispointSeed = {
  id: "axispoint", key: "axispoint", name: "Axispoint", title: "Axispoint",
  description: "תבנית diagonal: הירo מפוצל אלכסוני, כרטיסים על grid skewed וטופס קשר על פanel זווית.",
  category: "real-estate", categoryLabel: "נדל״ן", niche: "נדל״ן גאומטרי · diagonal", layout: "full",
  image: (axispointDefaultData as any).heroImage,
  heroTitle: (axispointDefaultData as any).heroTitle,
  heroSubtitle: (axispointDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "axis-nav", title: "Nav" },
    { type: "hero", variant: "diagonal-split", title: "Hero" },
    { type: "listings", variant: "skewed-grid", title: "Grid" },
    { type: "contact-panel", variant: "angled-form", title: "Panel" },
    { type: "gallery", variant: "parallax-showcase", title: "Gallery" },
    { type: "team", variant: "agent-grid", title: "Agents" },
    { type: "testimonials", variant: "premium-carousel", title: "Testimonials" },
    { type: "stats", variant: "trust-badges", title: "Stats" },
    { type: "about", variant: "geometry-story", title: "About" },
    { type: "faq", variant: "accordion-premium", title: "FAQ" },
    { type: "contact", variant: "axis-form", title: "Contact" },
    { type: "footer", variant: "minimal", title: "Footer" },
  ].map((b, i) => ({ id: `axispoint-${i+1}-${b.type}`, ...b })),
  pages: axispointPages,
  editor: { pages: axispointPages, css: axispointEditorCss },
  css: axispointEditorCss, data: axispointDefaultData, defaultData: axispointDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const axispointTemplate = {
  id: "axispoint", key: "axispoint", name: "Axispoint", title: "Axispoint", author: "Bizuply", priceLabel: "כלול",
  category: "real-estate", categoryLabel: "נדל״ן", badge: "חדש",
  description: "תבנית diagonal: הירo מפוצל אלכסוני, כרטיסים על grid skewed וטופס קשר על פanel זווית.",
  thumbnail: React.createElement(AxispointThumbnail),
  preview: React.createElement(AxispointPreview),
  component: AxispointPages, Component: AxispointPages,
  seed: axispointSeed, pages: axispointPages, editorCss: axispointEditorCss, schema: axispointSchema, defaultData: axispointDefaultData,
  renderer: {
    key: "axispoint", name: "Axispoint", Component: AxispointPages, component: AxispointPages, pages: axispointPages,
    editorMode: "visual-react", editorCss: axispointEditorCss, schema: axispointSchema, defaultData: axispointDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default axispointTemplate;
