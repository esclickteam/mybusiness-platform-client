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
  primary: "#E2C7A0", secondary: "#8E7554", accent: "#F4E4C8",
  background: "#0B0B0B", surface: "#161616", text: "#F5F0E8", muted: "#9C9488", dark: "#050505",
};

export const villaireSeed = {
  id: "villaire", key: "villaire", name: "Villaire", title: "Villaire",
  description: "תבנית וילות יוקרה: שחור ושמפניה, צילום דרמטי מלא מסך, רשימות נכסים אלגנטיות חדות.",
  category: "real-estate", categoryLabel: "נדל״ן", niche: "real-estate", layout: "full",
  image: (villaireDefaultData as any).heroImage,
  heroTitle: (villaireDefaultData as any).heroTitle,
  heroSubtitle: (villaireDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "sharp-nav", title: "Header" },
    { type: "hero", variant: "full-bleed", title: "Hero" },
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
  description: "תבנית וילות יוקרה: שחור ושמפניה, צילום דרמטי מלא מסך, רשימות נכסים אלגנטיות חדות.",
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
