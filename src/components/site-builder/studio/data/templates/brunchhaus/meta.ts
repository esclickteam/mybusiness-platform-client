import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import BrunchhausPages, { brunchhausPages } from "./pages";
import BrunchhausPreview from "./preview";
import BrunchhausThumbnail from "./thumbnail";
import { brunchhausEditorCss } from "./editorCss";
import { brunchhausSchema } from "./schema";
import { brunchhausDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#f4a261", secondary: "#9a7b62", accent: "#f4a261",
  background: "#fff8f0", surface: "#ffffff", text: "#3a2a1e", muted: "#9a7b62", dark: "#2a1c14",
};

export const brunchhausSeed = {
  id: "brunchhaus", key: "brunchhaus", name: "Brunchhaus", title: "Brunchhaus",
  description: "תבנית בראנץ׳ שמשית: הירו עם קרני שמש מסתובבות, גלריית פולארויד מסובבת, לוח סוף-שבוע כרשת וטופס גלויה — תנועה קלילה ושמחה.",
  category: "food", categoryLabel: "אוכל ומסעדות", niche: "בראנץ׳ · קפה", layout: "full",
  image: (brunchhausDefaultData as any).heroImage,
  heroTitle: (brunchhausDefaultData as any).heroTitle,
  heroSubtitle: (brunchhausDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "airy-sunny-circle", title: "Airy sunny circle logo nav" },
    { type: "hero", variant: "rotating-sun-rays", title: "Soft cream sun rays hero" },
    { type: "gallery", variant: "polaroid-scatter", title: "Polaroid scattered cards" },
    { type: "hours", variant: "weekend-calendar-grid", title: "Weekend calendar hours" },
    { type: "about", variant: "handwritten-note", title: "Handwritten note about" },
    { type: "contact", variant: "postcard-form", title: "Postcard contact" },
    { type: "footer", variant: "dotted-napkin", title: "Dotted napkin footer" },
  ].map((b, i) => ({ id: `brunchhaus-${i+1}-${b.type}`, ...b })),
  pages: brunchhausPages,
  editor: { pages: brunchhausPages, css: brunchhausEditorCss },
  css: brunchhausEditorCss, data: brunchhausDefaultData, defaultData: brunchhausDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const brunchhausTemplate = {
  id: "brunchhaus", key: "brunchhaus", name: "Brunchhaus", title: "Brunchhaus", author: "Bizuply", priceLabel: "כלול",
  category: "food", categoryLabel: "אוכל ומסעדות", badge: "חדש",
  description: "תבנית בראנץ׳ שמשית: הירו עם קרני שמש מסתובבות, גלריית פולארויד מסובבת, לוח סוף-שבוע כרשת וטופס גלויה — תנועה קלילה ושמחה.",
  thumbnail: React.createElement(BrunchhausThumbnail),
  preview: React.createElement(BrunchhausPreview),
  component: BrunchhausPages, Component: BrunchhausPages,
  seed: brunchhausSeed, pages: brunchhausPages, editorCss: brunchhausEditorCss, schema: brunchhausSchema, defaultData: brunchhausDefaultData,
  renderer: {
    key: "brunchhaus", name: "Brunchhaus", Component: BrunchhausPages, component: BrunchhausPages, pages: brunchhausPages,
    editorMode: "visual-react", editorCss: brunchhausEditorCss, schema: brunchhausSchema, defaultData: brunchhausDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default brunchhausTemplate;
