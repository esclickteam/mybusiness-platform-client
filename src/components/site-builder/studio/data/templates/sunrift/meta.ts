import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import SunriftPages, { sunriftPages } from "./pages";
import SunriftPreview from "./preview";
import SunriftThumbnail from "./thumbnail";
import { sunriftEditorCss } from "./editorCss";
import { sunriftSchema } from "./schema";
import { sunriftDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#ff8c42", secondary: "#c9a484", accent: "#ff8c42",
  background: "#1a0f0a", surface: "#2a1810", text: "#fff4e8", muted: "#c9a484", dark: "#0d0704",
};

export const sunriftSeed = {
  id: "sunrift", key: "sunrift", name: "Sunrift", title: "Sunrift",
  description: "תבנית מועדון חוף: הירו split עם shimmer זהוב, מארקי DJ, כרטיסי קוקטיילים וטופס הזמנת שולחן — אנרגיה שקיעה.",
  category: "travel", categoryLabel: "תיירות וחוף", niche: "Beach Club · שקיעה", layout: "full",
  image: (sunriftDefaultData as any).heroImage,
  heroTitle: (sunriftDefaultData as any).heroTitle,
  heroSubtitle: (sunriftDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "club-nav", title: "Club nav" },
    { type: "hero", variant: "split-shimmer", title: "Split sunset hero" },
    { type: "marquee", variant: "dj-marquee", title: "DJ marquee" },
    { type: "events", variant: "cocktail-cards", title: "Event cards" },
    { type: "about", variant: "club-story", title: "Club story" },
    { type: "contact", variant: "table-booking", title: "Table booking" },
    { type: "footer", variant: "minimal", title: "Footer" },
  ].map((b, i) => ({ id: `sunrift-${i+1}-${b.type}`, ...b })),
  pages: sunriftPages,
  editor: { pages: sunriftPages, css: sunriftEditorCss },
  css: sunriftEditorCss, data: sunriftDefaultData, defaultData: sunriftDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const sunriftTemplate = {
  id: "sunrift", key: "sunrift", name: "Sunrift", title: "Sunrift", author: "Bizuply", priceLabel: "כלול",
  category: "travel", categoryLabel: "תיירות וחוף", badge: "חדש",
  description: "תבנית מועדון חוף: הירו split עם shimmer זהוב, מארקי DJ, כרטיסי קוקטיילים וטופס הזמנת שולחן — אנרגיה שקיעה.",
  thumbnail: React.createElement(SunriftThumbnail),
  preview: React.createElement(SunriftPreview),
  component: SunriftPages, Component: SunriftPages,
  seed: sunriftSeed, pages: sunriftPages, editorCss: sunriftEditorCss, schema: sunriftSchema, defaultData: sunriftDefaultData,
  renderer: {
    key: "sunrift", name: "Sunrift", Component: SunriftPages, component: SunriftPages, pages: sunriftPages,
    editorMode: "visual-react", editorCss: sunriftEditorCss, schema: sunriftSchema, defaultData: sunriftDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default sunriftTemplate;
