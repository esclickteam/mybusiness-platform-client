import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import ParcelPages, { parcelPages } from "./pages";
import ParcelPreview from "./preview";
import ParcelThumbnail from "./thumbnail";
import { parcelEditorCss } from "./editorCss";
import { parcelSchema } from "./schema";
import { parcelDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#6B5A2E", secondary: "#A8945A", accent: "#3D3418",
  background: "#F3EFE6", surface: "#E7E1D2", text: "#243018", muted: "#6E684F", dark: "#16140C",
};

export const parcelSeed = {
  id: "parcel", key: "parcel", name: "Parcel", title: "Parcel",
  description: "תבנית קרקעות ומגרשים: פרגמנט וזית, פריסת מגזין דו-טורית, בלי כרטיסים ובלי טבלאות.",
  category: "real-estate", categoryLabel: "נדל״ן", niche: "real-estate", layout: "full",
  image: (parcelDefaultData as any).heroImage,
  heroTitle: (parcelDefaultData as any).heroTitle,
  heroSubtitle: (parcelDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "sharp-nav", title: "Header" },
    { type: "hero", variant: "full-bleed", title: "Hero" },
    { type: "services", variant: "list", title: "Listings" },
    { type: "contact", variant: "plain-form", title: "Contact" },
    { type: "footer", variant: "minimal", title: "Footer" },
  ].map((b, i) => ({ id: `parcel-${i+1}-${b.type}`, ...b })),
  pages: parcelPages,
  editor: { pages: parcelPages, css: parcelEditorCss },
  css: parcelEditorCss, data: parcelDefaultData, defaultData: parcelDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const parcelTemplate = {
  id: "parcel", key: "parcel", name: "Parcel", title: "Parcel", author: "Bizuply", priceLabel: "כלול",
  category: "real-estate", categoryLabel: "נדל״ן", badge: "חדש",
  description: "תבנית קרקעות ומגרשים: פרגמנט וזית, פריסת מגזין דו-טורית, בלי כרטיסים ובלי טבלאות.",
  thumbnail: React.createElement(ParcelThumbnail),
  preview: React.createElement(ParcelPreview),
  component: ParcelPages, Component: ParcelPages,
  seed: parcelSeed, pages: parcelPages, editorCss: parcelEditorCss, schema: parcelSchema, defaultData: parcelDefaultData,
  renderer: {
    key: "parcel", name: "Parcel", Component: ParcelPages, component: ParcelPages, pages: parcelPages,
    editorMode: "visual-react", editorCss: parcelEditorCss, schema: parcelSchema, defaultData: parcelDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default parcelTemplate;
