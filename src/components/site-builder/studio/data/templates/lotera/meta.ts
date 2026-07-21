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
  primary: "#5eb4ff", secondary: "#8fa8bd", accent: "#5eb4ff",
  background: "#07131f", surface: "#0f2133", text: "#eef5fb", muted: "#8fa8bd", dark: "#030910",
};

export const loteraSeed = {
  id: "lotera", key: "lotera", name: "Lotera", title: "Lotera",
  description: "תבנית קולנועית לנכסי חוף: הירו מלא מסך עם זום איטי, נייבי עמוק וכחול בהיר, תנועה ופריסה שונה לגמרי.",
  category: "real-estate", categoryLabel: "נדל״ן", niche: "real-estate", layout: "full",
  image: (loteraDefaultData as any).heroImage,
  heroTitle: (loteraDefaultData as any).heroTitle,
  heroSubtitle: (loteraDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "sharp-nav", title: "Header" },
    { type: "hero", variant: "cinematic", title: "Hero" },
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
  description: "תבנית קולנועית לנכסי חוף: הירו מלא מסך עם זום איטי, נייבי עמוק וכחול בהיר, תנועה ופריסה שונה לגמרי.",
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
