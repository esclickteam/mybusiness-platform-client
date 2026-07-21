import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import VillairePages, { villairePages } from "./pages";
import VillairePreview from "./preview";
import VillaireThumbnail from "./thumbnail";
import { villaireEditorCss } from "./editorCss";
import { villaireSchema } from "./schema";
import { villaireDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#e2c7a0", secondary: "#a89a86", accent: "#e2c7a0",
  background: "#0a0a0a", surface: "#141414", text: "#f4efe6", muted: "#a89a86", dark: "#000000",
};

export const villaireSeed = {
  id: "villaire", key: "villaire", name: "Villaire", title: "Villaire",
  description: "תבנית וילות יוקרתית: שחור מלא, כותרת ממורכזת, תמונה קולנועית מתחת, קו שמפניה נמשך.",
  category: "real-estate", categoryLabel: "נדל״ן", niche: "real-estate", layout: "full",
  image: (villaireDefaultData as any).heroImage,
  heroTitle: (villaireDefaultData as any).heroTitle,
  heroSubtitle: (villaireDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "sharp-nav", title: "Header" },
    { type: "hero", variant: "centeredCinema", title: "Hero" },
    { type: "services", variant: "list", title: "Listings" },
    { type: "contact", variant: "plain-form", title: "Contact" },
    { type: "footer", variant: "minimal", title: "Footer" },
  ].map((b, i) => ({ id: `villaire-${i+1}-${b.type}`, ...b })),
  pages: villairePages,
  editor: { pages: villairePages, css: villaireEditorCss },
  css: villaireEditorCss, data: villaireDefaultData, defaultData: villaireDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const villaireTemplate = {
  id: "villaire", key: "villaire", name: "Villaire", title: "Villaire", author: "Bizuply", priceLabel: "כלול",
  category: "real-estate", categoryLabel: "נדל״ן", badge: "חדש",
  description: "תבנית וילות יוקרתית: שחור מלא, כותרת ממורכזת, תמונה קולנועית מתחת, קו שמפניה נמשך.",
  thumbnail: React.createElement(VillaireThumbnail),
  preview: React.createElement(VillairePreview),
  component: VillairePages, Component: VillairePages,
  seed: villaireSeed, pages: villairePages, editorCss: villaireEditorCss, schema: villaireSchema, defaultData: villaireDefaultData,
  renderer: {
    key: "villaire", name: "Villaire", Component: VillairePages, component: VillairePages, pages: villairePages,
    editorMode: "visual-react", editorCss: villaireEditorCss, schema: villaireSchema, defaultData: villaireDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default villaireTemplate;
