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
  primary: "#1F7A78", secondary: "#4EAAA7", accent: "#0F4E4C",
  background: "#EEF6F5", surface: "#DFECEB", text: "#16323A", muted: "#5F7578", dark: "#0D1E22",
};

export const rivaraSeed = {
  id: "rivara", key: "rivara", name: "Rivara", title: "Rivara",
  description: "תבנית נדל״ן לנכסי טבע ונהר: טורקיז ערפילי, פסים אופקיים רחבים, עיצוב חד ונקי.",
  category: "real-estate", categoryLabel: "נדל״ן", niche: "real-estate", layout: "full",
  image: (rivaraDefaultData as any).heroImage,
  heroTitle: (rivaraDefaultData as any).heroTitle,
  heroSubtitle: (rivaraDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "sharp-nav", title: "Header" },
    { type: "hero", variant: "full-bleed", title: "Hero" },
    { type: "services", variant: "list", title: "Listings" },
    { type: "contact", variant: "plain-form", title: "Contact" },
    { type: "footer", variant: "minimal", title: "Footer" },
  ].map((b, i) => ({ id: `rivara-${i+1}-${b.type}`, ...b })),
  pages: rivaraPages,
  editor: { pages: rivaraPages, css: rivaraEditorCss },
  css: rivaraEditorCss, data: rivaraDefaultData, defaultData: rivaraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const rivaraTemplate = {
  id: "rivara", key: "rivara", name: "Rivara", title: "Rivara", author: "Bizuply", priceLabel: "כלול",
  category: "real-estate", categoryLabel: "נדל״ן", badge: "חדש",
  description: "תבנית נדל״ן לנכסי טבע ונהר: טורקיז ערפילי, פסים אופקיים רחבים, עיצוב חד ונקי.",
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
