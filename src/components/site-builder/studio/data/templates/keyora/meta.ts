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
  primary: "#0B5FFF", secondary: "#163A6B", accent: "#7AA7FF",
  background: "#F4F7FB", surface: "#E8EEF6", text: "#122033", muted: "#5B6B7C", dark: "#0A1424",
};

export const keyoraSeed = {
  id: "keyora", key: "keyora", name: "Keyora", title: "Keyora",
  description: "תבנית נדל״ן מודרנית לסוכנים: לבן-כחול חד, פיצול הירו, רשימות נכסים טיפוגרפיות בלי כרטיסים מעוגלים.",
  category: "real-estate", categoryLabel: "נדל״ן", niche: "real-estate", layout: "full",
  image: (keyoraDefaultData as any).heroImage,
  heroTitle: (keyoraDefaultData as any).heroTitle,
  heroSubtitle: (keyoraDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "sharp-nav", title: "Header" },
    { type: "hero", variant: "full-bleed", title: "Hero" },
    { type: "services", variant: "list", title: "Listings" },
    { type: "contact", variant: "plain-form", title: "Contact" },
    { type: "footer", variant: "minimal", title: "Footer" },
  ].map((b, i) => ({ id: `keyora-${i+1}-${b.type}`, ...b })),
  pages: keyoraPages,
  editor: { pages: keyoraPages, css: keyoraEditorCss },
  css: keyoraEditorCss, data: keyoraDefaultData, defaultData: keyoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const keyoraTemplate = {
  id: "keyora", key: "keyora", name: "Keyora", title: "Keyora", author: "Bizuply", priceLabel: "כלול",
  category: "real-estate", categoryLabel: "נדל״ן", badge: "חדש",
  description: "תבנית נדל״ן מודרנית לסוכנים: לבן-כחול חד, פיצול הירו, רשימות נכסים טיפוגרפיות בלי כרטיסים מעוגלים.",
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
