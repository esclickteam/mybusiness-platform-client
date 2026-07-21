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
  description: "תבנית וילות יוקרתית בשחור ושמפניה: כותרת קולנועית ממורכזת, תמונת 21:9, וילה מרכזית ענקית, רשימת וילות בשורות דקות ועקרונות אדריכלות אלגנטיים.",
  category: "real-estate", categoryLabel: "נדל״ן", niche: "real-estate", layout: "full",
  image: (villaireDefaultData as any).heroImage,
  heroTitle: (villaireDefaultData as any).heroTitle,
  heroSubtitle: (villaireDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "brand-and-cta-only", title: "Minimal black header" },
    { type: "hero", variant: "centered-cinema", title: "Cinema hero" },
    { type: "feature", variant: "massive-villa", title: "Featured villa" },
    { type: "listings", variant: "thin-villa-ledger", title: "Villa ledger" },
    { type: "about", variant: "champagne-principles", title: "Architecture principles" },
    { type: "contact", variant: "narrow-centered-form", title: "Private request" },
    { type: "footer", variant: "black-thin", title: "Thin footer" },
  ].map((b, i) => ({ id: `villaire-${i + 1}-${b.type}`, ...b })),
  pages: villairePages,
  editor: { pages: villairePages, css: villaireEditorCss },
  css: villaireEditorCss, data: villaireDefaultData, defaultData: villaireDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const villaireTemplate = {
  id: "villaire", key: "villaire", name: "Villaire", title: "Villaire", author: "Bizuply", priceLabel: "כלול",
  category: "real-estate", categoryLabel: "נדל״ן", badge: "חדש",
  description: "תבנית וילות יוקרתית עם הירו קולנועי, וילה מרכזית ענקית, שורות נכסים דקות וטופס פרטי ממורכז.",
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
