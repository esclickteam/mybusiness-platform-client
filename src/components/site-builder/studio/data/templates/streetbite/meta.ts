import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import StreetbitePages, { streetbitePages } from "./pages";
import StreetbitePreview from "./preview";
import StreetbiteThumbnail from "./thumbnail";
import { streetbiteEditorCss } from "./editorCss";
import { streetbiteSchema } from "./schema";
import { streetbiteDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#39d353", secondary: "#8b949e", accent: "#39d353",
  background: "#0d1117", surface: "#161b22", text: "#e6edf3", muted: "#8b949e", dark: "#010409",
};

export const streetbiteSeed = {
  id: "streetbite", key: "streetbite", name: "Streetbite", title: "Streetbite",
  description: "תבנית אוכל רחוב: הירו עם משאית נעה וניאון מהבהב, ערימת כרטיסי לילה, סיכות מפה קופצות וטופס בסגנון צ׳אט SMS — אנרגיה עירונית ותנועה.",
  category: "food", categoryLabel: "אוכל ומסעדות", niche: "אוכל רחוב · פודטראק", layout: "full",
  image: (streetbiteDefaultData as any).heroImage,
  heroTitle: (streetbiteDefaultData as any).heroTitle,
  heroSubtitle: (streetbiteDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "sticker-badge-nav", title: "Sticker badge nav" },
    { type: "hero", variant: "truck-slide-neon-title", title: "Food truck + neon title hero" },
    { type: "stack", variant: "night-market-card-stack", title: "Night market vertical stack" },
    { type: "process", variant: "street-process", title: "Street process" },
    { type: "gallery", variant: "street-gallery", title: "Street gallery" },
    { type: "reviews", variant: "street-reviews", title: "Street reviews" },
    { type: "stats", variant: "street-stats-pins", title: "Street stats + hours" },
    { type: "cta", variant: "street-home-cta", title: "Home CTA teaser" },
    { type: "trucksPage", variant: "full-truck-menu", title: "Full truck menu page" },
    { type: "spotsPage", variant: "city-spots-story", title: "City spots story page" },
    { type: "about", variant: "comic-timeline", title: "Comic timeline + chef" },
    { type: "contact", variant: "sms-reserve-faq", title: "SMS reserve + FAQ" },
    { type: "footer", variant: "ticket-tear", title: "Ticket tear footer" },
  ].map((b, i) => ({ id: `streetbite-${i+1}-${b.type}`, ...b })),
  pages: streetbitePages,
  editor: { pages: streetbitePages, css: streetbiteEditorCss },
  css: streetbiteEditorCss, data: streetbiteDefaultData, defaultData: streetbiteDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const streetbiteTemplate = {
  id: "streetbite", key: "streetbite", name: "Streetbite", title: "Streetbite", author: "Bizuply", priceLabel: "כלול",
  category: "food", categoryLabel: "אוכל ומסעדות", badge: "חדש",
  description: "תבנית אוכל רחוב: הירו עם משאית נעה וניאון מהבהב, ערימת כרטיסי לילה, סיכות מפה קופצות וטופס בסגנון צ׳אט SMS — אנרגיה עירונית ותנועה.",
  thumbnail: React.createElement(StreetbiteThumbnail),
  preview: React.createElement(StreetbitePreview),
  component: StreetbitePages, Component: StreetbitePages,
  seed: streetbiteSeed, pages: streetbitePages, editorCss: streetbiteEditorCss, schema: streetbiteSchema, defaultData: streetbiteDefaultData,
  renderer: {
    key: "streetbite", name: "Streetbite", Component: StreetbitePages, component: StreetbitePages, pages: streetbitePages,
    editorMode: "visual-react", editorCss: streetbiteEditorCss, schema: streetbiteSchema, defaultData: streetbiteDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default streetbiteTemplate;
