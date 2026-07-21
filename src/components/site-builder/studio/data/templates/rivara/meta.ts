import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import RivaraPages, { rivaraPages } from "./pages";
import RivaraPreview from "./preview";
import RivaraThumbnail from "./thumbnail";
import { rivaraEditorCss } from "./editorCss";
import { rivaraSchema } from "./schema";
import { rivaraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#1f7a78", secondary: "#4f6d72", accent: "#1f7a78",
  background: "#e8f3f2", surface: "#d9ecea", text: "#12343a", muted: "#4f6d72", dark: "#0b1f24",
};

export const rivaraSeed = {
  id: "rivara", key: "rivara", name: "Rivara", title: "Rivara",
  description: "תבנית נדל״ן טבעית ליד מים: הירו עם שלושה פסי נוף אופקיים, נכסים כשורות צילום רחבות, רצועת טבע מרובעת ופאנל קשר רגוע בגוון טורקיז.",
  category: "real-estate", categoryLabel: "נדל״ן", niche: "real-estate", layout: "full",
  image: (rivaraDefaultData as any).bandOneImage,
  heroTitle: (rivaraDefaultData as any).heroTitle,
  heroSubtitle: (rivaraDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "soft-waterline", title: "Soft waterline header" },
    { type: "hero", variant: "three-wave-bands", title: "Wave band hero" },
    { type: "listings", variant: "landscape-rows", title: "Waterfront rows" },
    { type: "about", variant: "nature-squares", title: "Nature squares" },
    { type: "contact", variant: "serene-panel", title: "Serene contact" },
    { type: "footer", variant: "soft-centered", title: "Soft footer" },
  ].map((b, i) => ({ id: `rivara-${i + 1}-${b.type}`, ...b })),
  pages: rivaraPages,
  editor: { pages: rivaraPages, css: rivaraEditorCss },
  css: rivaraEditorCss, data: rivaraDefaultData, defaultData: rivaraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const rivaraTemplate = {
  id: "rivara", key: "rivara", name: "Rivara", title: "Rivara", author: "Bizuply", priceLabel: "כלול",
  category: "real-estate", categoryLabel: "נדל״ן", badge: "חדש",
  description: "תבנית נדל״ן טבעית ליד מים עם פסי נוף אופקיים, שורות נכסים רחבות ורצועת טבע ייחודית.",
  thumbnail: React.createElement(RivaraThumbnail),
  preview: React.createElement(RivaraPreview),
  component: RivaraPages, Component: RivaraPages,
  seed: rivaraSeed, pages: rivaraPages, editorCss: rivaraEditorCss, schema: rivaraSchema, defaultData: rivaraDefaultData,
  renderer: {
    key: "rivara", name: "Rivara", Component: RivaraPages, component: RivaraPages, pages: rivaraPages,
    editorMode: "visual-react", editorCss: rivaraEditorCss, schema: rivaraSchema, defaultData: rivaraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default rivaraTemplate;
