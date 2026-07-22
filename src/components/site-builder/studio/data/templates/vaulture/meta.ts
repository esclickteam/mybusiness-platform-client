import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import VaulturePages, { vaulturePages } from "./pages";
import VaulturePreview from "./preview";
import VaultureThumbnail from "./thumbnail";
import { vaultureEditorCss } from "./editorCss";
import { vaultureSchema } from "./schema";
import { vaultureDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#d4af37", secondary: "#a89880", accent: "#d4af37",
  background: "#0c0a08", surface: "#1a1612", text: "#f5f0e8", muted: "#a89880", dark: "#050403",
};

export const vaultureSeed = {
  id: "vaulture", key: "vaulture", name: "Vaulture", title: "Vaulture",
  description: "תבנית יוקרה כהה: הירו עם זהב, אנימציית curtain wipe, כרטיסי כספת וקרוסלת המלצות.",
  category: "real-estate", categoryLabel: "נדל״ן", niche: "נדל״ן יוקרה · כסף וזהב", layout: "full",
  image: (vaultureDefaultData as any).heroImage,
  heroTitle: (vaultureDefaultData as any).heroTitle,
  heroSubtitle: (vaultureDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "vault-nav", title: "Nav" },
    { type: "hero", variant: "curtain-gold", title: "Hero" },
    { type: "listings", variant: "vault-cards", title: "Cards" },
    { type: "testimonials", variant: "carousel-strip", title: "Testimonials" },
    { type: "about", variant: "luxury-story", title: "About" },
    { type: "contact", variant: "vip-form", title: "Contact" },
    { type: "footer", variant: "minimal", title: "Footer" },
  ].map((b, i) => ({ id: `vaulture-${i+1}-${b.type}`, ...b })),
  pages: vaulturePages,
  editor: { pages: vaulturePages, css: vaultureEditorCss },
  css: vaultureEditorCss, data: vaultureDefaultData, defaultData: vaultureDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const vaultureTemplate = {
  id: "vaulture", key: "vaulture", name: "Vaulture", title: "Vaulture", author: "Bizuply", priceLabel: "כלול",
  category: "real-estate", categoryLabel: "נדל״ן", badge: "חדש",
  description: "תבנית יוקרה כהה: הירו עם זהב, אנימציית curtain wipe, כרטיסי כספת וקרוסלת המלצות.",
  thumbnail: React.createElement(VaultureThumbnail),
  preview: React.createElement(VaulturePreview),
  component: VaulturePages, Component: VaulturePages,
  seed: vaultureSeed, pages: vaulturePages, editorCss: vaultureEditorCss, schema: vaultureSchema, defaultData: vaultureDefaultData,
  renderer: {
    key: "vaulture", name: "Vaulture", Component: VaulturePages, component: VaulturePages, pages: vaulturePages,
    editorMode: "visual-react", editorCss: vaultureEditorCss, schema: vaultureSchema, defaultData: vaultureDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default vaultureTemplate;
