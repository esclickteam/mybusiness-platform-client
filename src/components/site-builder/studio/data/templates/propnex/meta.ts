import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import PropnexPages, { propnexPages } from "./pages";
import PropnexPreview from "./preview";
import PropnexThumbnail from "./thumbnail";
import { propnexEditorCss } from "./editorCss";
import { propnexSchema } from "./schema";
import { propnexDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#2563eb", secondary: "#6b7280", accent: "#2563eb",
  background: "#f4f6f9", surface: "#ffffff", text: "#111827", muted: "#6b7280", dark: "#0f172a",
};

export const propnexSeed = {
  id: "propnex", key: "propnex", name: "Propnex", title: "Propnex",
  description: "תבנית בento אסימטרי: הירו מעורב תמונה/טקסט, תצוגת נכסים בento, מארקי שכונות ותהליך עם אנימציית קו.",
  category: "real-estate", categoryLabel: "נדל״ן", niche: "סוכנות נדל״ן חכמה", layout: "full",
  image: (propnexDefaultData as any).heroImage,
  heroTitle: (propnexDefaultData as any).heroTitle,
  heroSubtitle: (propnexDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "bento-nav", title: "Nav" },
    { type: "hero", variant: "asymmetric-bento", title: "Hero" },
    { type: "listings", variant: "bento-showcase", title: "Showcase" },
    { type: "marquee", variant: "neighborhood-tags", title: "Marquee" },
    { type: "process", variant: "line-draw-steps", title: "Process" },
    { type: "team", variant: "agent-grid", title: "Agents" },
    { type: "testimonials", variant: "premium-carousel", title: "Testimonials" },
    { type: "stats", variant: "trust-badges", title: "Stats" },
    { type: "insights", variant: "market-cards", title: "Insights" },
    { type: "about", variant: "agency-story", title: "About" },
    { type: "contact", variant: "inquiry-form", title: "Contact" },
    { type: "footer", variant: "minimal", title: "Footer" },
  ].map((b, i) => ({ id: `propnex-${i+1}-${b.type}`, ...b })),
  pages: propnexPages,
  editor: { pages: propnexPages, css: propnexEditorCss },
  css: propnexEditorCss, data: propnexDefaultData, defaultData: propnexDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const propnexTemplate = {
  id: "propnex", key: "propnex", name: "Propnex", title: "Propnex", author: "Bizuply", priceLabel: "כלול",
  category: "real-estate", categoryLabel: "נדל״ן", badge: "חדש",
  description: "תבנית בento אסימטרי: הירו מעורב תמונה/טקסט, תצוגת נכסים בento, מארקי שכונות ותהליך עם אנימציית קו.",
  thumbnail: React.createElement(PropnexThumbnail),
  preview: React.createElement(PropnexPreview),
  component: PropnexPages, Component: PropnexPages,
  seed: propnexSeed, pages: propnexPages, editorCss: propnexEditorCss, schema: propnexSchema, defaultData: propnexDefaultData,
  renderer: {
    key: "propnex", name: "Propnex", Component: PropnexPages, component: PropnexPages, pages: propnexPages,
    editorMode: "visual-react", editorCss: propnexEditorCss, schema: propnexSchema, defaultData: propnexDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default propnexTemplate;
