import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import BrokeriaPages, { brokeriaPages } from "./pages";
import BrokeriaPreview from "./preview";
import BrokeriaThumbnail from "./thumbnail";
import { brokeriaEditorCss } from "./editorCss";
import { brokeriaSchema } from "./schema";
import { brokeriaDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#c9a962", secondary: "#8b9cb5", accent: "#c9a962",
  background: "#0a0f18", surface: "#141c2a", text: "#f0f4fa", muted: "#8b9cb5", dark: "#050810",
};

export const brokeriaSeed = {
  id: "brokeria", key: "brokeria", name: "Brokeria", title: "Brokeria",
  description: "תבנית קולנועית: הירו מסך מלא, טיקר נכסים נגלל, כרטיסי נכס עם זום, צוות סוכנים וסטטיסטיקות מונפשות.",
  category: "real-estate", categoryLabel: "נדל״ן", niche: "נדל״ן פרימיום · תל אביב", layout: "full",
  image: (brokeriaDefaultData as any).heroImage,
  heroTitle: (brokeriaDefaultData as any).heroTitle,
  heroSubtitle: (brokeriaDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "broker-ticker-nav", title: "Ticker nav" },
    { type: "hero", variant: "cinematic-ticker-hero", title: "Hero" },
    { type: "listings", variant: "featured-zoom-cards", title: "Cards" },
    { type: "team", variant: "agent-strip", title: "Agents" },
    { type: "stats", variant: "animated-stats", title: "Stats" },
    { type: "testimonials", variant: "premium-carousel", title: "Testimonials" },
    { type: "gallery", variant: "parallax-showcase", title: "Gallery" },
    { type: "insights", variant: "market-cards", title: "Insights" },
    { type: "about", variant: "broker-story", title: "About" },
    { type: "faq", variant: "accordion-premium", title: "FAQ" },
    { type: "contact", variant: "broker-form", title: "Contact" },
    { type: "footer", variant: "minimal", title: "Footer" },
  ].map((b, i) => ({ id: `brokeria-${i+1}-${b.type}`, ...b })),
  pages: brokeriaPages,
  editor: { pages: brokeriaPages, css: brokeriaEditorCss },
  css: brokeriaEditorCss, data: brokeriaDefaultData, defaultData: brokeriaDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const brokeriaTemplate = {
  id: "brokeria", key: "brokeria", name: "Brokeria", title: "Brokeria", author: "Bizuply", priceLabel: "כלול",
  category: "real-estate", categoryLabel: "נדל״ן", badge: "חדש",
  description: "תבנית קולנועית: הירו מסך מלא, טיקר נכסים נגלל, כרטיסי נכס עם זום, צוות סוכנים וסטטיסטיקות מונפשות.",
  thumbnail: React.createElement(BrokeriaThumbnail),
  preview: React.createElement(BrokeriaPreview),
  component: BrokeriaPages, Component: BrokeriaPages,
  seed: brokeriaSeed, pages: brokeriaPages, editorCss: brokeriaEditorCss, schema: brokeriaSchema, defaultData: brokeriaDefaultData,
  renderer: {
    key: "brokeria", name: "Brokeria", Component: BrokeriaPages, component: BrokeriaPages, pages: brokeriaPages,
    editorMode: "visual-react", editorCss: brokeriaEditorCss, schema: brokeriaSchema, defaultData: brokeriaDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default brokeriaTemplate;
