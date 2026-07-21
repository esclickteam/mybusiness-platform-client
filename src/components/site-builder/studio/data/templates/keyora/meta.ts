import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import KeyoraPages, { keyoraPages } from "./pages";
import KeyoraPreview from "./preview";
import KeyoraThumbnail from "./thumbnail";
import { keyoraEditorCss } from "./editorCss";
import { keyoraSchema } from "./schema";
import { keyoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#0b5fff", secondary: "#5b6b7c", accent: "#0b5fff",
  background: "#f5f8fc", surface: "#ffffff", text: "#0f1b2d", muted: "#5b6b7c", dark: "#0a1424",
};

export const keyoraSeed = {
  id: "keyora", key: "keyora", name: "Keyora", title: "Keyora",
  description: "תבנית ברוקראז׳ מודרנית עם הירו טיפוגרפי, חיפוש ללא תמונה, שורות נכסים ממוספרות, תהליך 01/02/03 וטופס עם פאנל כחול.",
  category: "real-estate", categoryLabel: "נדל״ן", niche: "real-estate", layout: "full",
  image: (keyoraDefaultData as any).heroImage,
  heroTitle: (keyoraDefaultData as any).heroTitle,
  heroSubtitle: (keyoraDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "white-underline-nav", title: "Underline Header" },
    { type: "hero", variant: "typographic-search-counters", title: "Search Hero" },
    { type: "listings", variant: "numbered-index-rows", title: "Numbered Listings" },
    { type: "process", variant: "three-step-strip", title: "Process Strip" },
    { type: "about", variant: "clarity-brief", title: "Clarity Brief" },
    { type: "contact", variant: "blue-side-panel-form", title: "Blue Panel Contact" },
    { type: "footer", variant: "utility-links", title: "Utility Footer" },
  ].map((b, i) => ({ id: `keyora-${i + 1}-${b.type}`, ...b })),
  pages: keyoraPages,
  editor: { pages: keyoraPages, css: keyoraEditorCss },
  css: keyoraEditorCss, data: keyoraDefaultData, defaultData: keyoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const keyoraTemplate = {
  id: "keyora", key: "keyora", name: "Keyora", title: "Keyora", author: "Bizuply", priceLabel: "כלול",
  category: "real-estate", categoryLabel: "נדל״ן", badge: "חדש",
  description: "תבנית ברוקראז׳ מודרנית עם הירו טיפוגרפי, חיפוש ללא תמונה, שורות נכסים ממוספרות, תהליך 01/02/03 וטופס עם פאנל כחול.",
  thumbnail: React.createElement(KeyoraThumbnail),
  preview: React.createElement(KeyoraPreview),
  component: KeyoraPages, Component: KeyoraPages,
  seed: keyoraSeed, pages: keyoraPages, editorCss: keyoraEditorCss, schema: keyoraSchema, defaultData: keyoraDefaultData,
  renderer: {
    key: "keyora", name: "Keyora", Component: KeyoraPages, component: KeyoraPages, pages: keyoraPages,
    editorMode: "visual-react", editorCss: keyoraEditorCss, schema: keyoraSchema, defaultData: keyoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default keyoraTemplate;
