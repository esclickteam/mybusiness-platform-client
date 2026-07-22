import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import OpenhausPages, { openhausPages } from "./pages";
import OpenhausPreview from "./preview";
import OpenhausThumbnail from "./thumbnail";
import { openhausEditorCss } from "./editorCss";
import { openhausSchema } from "./schema";
import { openhausDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#ea580c", secondary: "#78716c", accent: "#ea580c",
  background: "#fffbf7", surface: "#ffffff", text: "#292524", muted: "#78716c", dark: "#1c1917",
};

export const openhausSeed = {
  id: "openhaus", key: "openhaus", name: "Openhaus", title: "Openhaus",
  description: "תבנית carousel 3D: הירו עם פאנלים מסתובבים, לוח open house וגלריית masonry.",
  category: "real-estate", categoryLabel: "נדל״ן", niche: "בתים פתוחים · סיורים", layout: "full",
  image: (openhausDefaultData as any).heroImage,
  heroTitle: (openhausDefaultData as any).heroTitle,
  heroSubtitle: (openhausDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "openhaus-nav", title: "Nav" },
    { type: "hero", variant: "rotate-3d", title: "Hero" },
    { type: "schedule", variant: "open-house-timeline", title: "Timeline" },
    { type: "gallery", variant: "masonry-grid", title: "Gallery" },
    { type: "about", variant: "tour-story", title: "About" },
    { type: "contact", variant: "tour-form", title: "Contact" },
    { type: "footer", variant: "minimal", title: "Footer" },
  ].map((b, i) => ({ id: `openhaus-${i+1}-${b.type}`, ...b })),
  pages: openhausPages,
  editor: { pages: openhausPages, css: openhausEditorCss },
  css: openhausEditorCss, data: openhausDefaultData, defaultData: openhausDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const openhausTemplate = {
  id: "openhaus", key: "openhaus", name: "Openhaus", title: "Openhaus", author: "Bizuply", priceLabel: "כלול",
  category: "real-estate", categoryLabel: "נדל״ן", badge: "חדש",
  description: "תבנית carousel 3D: הירו עם פאנלים מסתובבים, לוח open house וגלריית masonry.",
  thumbnail: React.createElement(OpenhausThumbnail),
  preview: React.createElement(OpenhausPreview),
  component: OpenhausPages, Component: OpenhausPages,
  seed: openhausSeed, pages: openhausPages, editorCss: openhausEditorCss, schema: openhausSchema, defaultData: openhausDefaultData,
  renderer: {
    key: "openhaus", name: "Openhaus", Component: OpenhausPages, component: OpenhausPages, pages: openhausPages,
    editorMode: "visual-react", editorCss: openhausEditorCss, schema: openhausSchema, defaultData: openhausDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default openhausTemplate;
