import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import LoteraPages, { loteraPages } from "./pages";
import LoteraPreview from "./preview";
import LoteraThumbnail from "./thumbnail";
import { loteraEditorCss } from "./editorCss";
import { loteraSchema } from "./schema";
import { loteraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#6EB6FF", secondary: "#1E4D7B", accent: "#B8D9FF",
  background: "#0C1520", surface: "#132033", text: "#EEF4F8", muted: "#8FA3B5", dark: "#060B12",
};

export const loteraSeed = {
  id: "lotera", key: "lotera", name: "Lotera", title: "Lotera",
  description: "תבנית נדל״ן יוקרתית לנכסי חוף: הירו צילום מלא, נייבי עמוק וכחול בהיר, רשימות נכסים חדות בלי כרטיסיות.",
  category: "real-estate", categoryLabel: "נדל״ן", niche: "real-estate", layout: "full",
  image: (loteraDefaultData as any).heroImage,
  heroTitle: (loteraDefaultData as any).heroTitle,
  heroSubtitle: (loteraDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "sharp-nav", title: "Header" },
    { type: "hero", variant: "full-bleed", title: "Hero" },
    { type: "services", variant: "list", title: "Listings" },
    { type: "contact", variant: "plain-form", title: "Contact" },
    { type: "footer", variant: "minimal", title: "Footer" },
  ].map((b, i) => ({ id: `lotera-${i+1}-${b.type}`, ...b })),
  pages: loteraPages,
  editor: { pages: loteraPages, css: loteraEditorCss },
  css: loteraEditorCss, data: loteraDefaultData, defaultData: loteraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const loteraTemplate = {
  id: "lotera", key: "lotera", name: "Lotera", title: "Lotera", author: "Bizuply", priceLabel: "כלול",
  category: "real-estate", categoryLabel: "נדל״ן", badge: "חדש",
  description: "תבנית נדל״ן יוקרתית לנכסי חוף: הירו צילום מלא, נייבי עמוק וכחול בהיר, רשימות נכסים חדות בלי כרטיסיות.",
  thumbnail: React.createElement(LoteraThumbnail),
  preview: React.createElement(LoteraPreview),
  component: LoteraPages, Component: LoteraPages,
  seed: loteraSeed, pages: loteraPages, editorCss: loteraEditorCss, schema: loteraSchema, defaultData: loteraDefaultData,
  renderer: {
    key: "lotera", name: "Lotera", Component: LoteraPages, component: LoteraPages, pages: loteraPages,
    editorMode: "visual-react", editorCss: loteraEditorCss, schema: loteraSchema, defaultData: loteraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default loteraTemplate;
