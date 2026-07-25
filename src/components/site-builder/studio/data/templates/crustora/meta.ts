import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import CrustoraPages, { crustoraPages } from "./pages";
import CrustoraPreview from "./preview";
import CrustoraThumbnail from "./thumbnail";
import { crustoraEditorCss } from "./editorCss";
import { crustoraSchema } from "./schema";
import { crustoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#c1121f", secondary: "#8b6b52", accent: "#c1121f",
  background: "#faf4eb", surface: "#ffffff", text: "#2a1810", muted: "#8b6b52", dark: "#1a0e0a",
};

export const crustoraSeed = {
  id: "crustora", key: "crustora", name: "Crustora", title: "Crustora",
  description: "תבנית פיצרייה: הירו באלכסון עם פיצה מסתובבת, תפריט כבלוקי משולשים, רצועת חום תנור וטופס כרטיס הזמנה — אבק קמח ואנימציית stretch.",
  category: "food", categoryLabel: "אוכל ומסעדות", niche: "פיצה · תנור עצים", layout: "full",
  image: (crustoraDefaultData as any).heroImage,
  heroTitle: (crustoraDefaultData as any).heroTitle,
  heroSubtitle: (crustoraDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "stretch-underline-logo", title: "Stretch underline logo nav" },
    { type: "hero", variant: "diagonal-rotating-pizza", title: "Diagonal rotating pizza hero" },
    { type: "menu", variant: "triangular-masonry", title: "Triangular masonry menu" },
    { type: "oven", variant: "heat-shimmer-strip", title: "Oven heat shimmer strip" },
    { type: "about", variant: "flour-dust-story", title: "Flour dust about" },
    { type: "contact", variant: "ticket-order-form", title: "Ticket-style contact" },
    { type: "footer", variant: "crust-edge", title: "Crust edge footer" },
  ].map((b, i) => ({ id: `crustora-${i+1}-${b.type}`, ...b })),
  pages: crustoraPages,
  editor: { pages: crustoraPages, css: crustoraEditorCss },
  css: crustoraEditorCss, data: crustoraDefaultData, defaultData: crustoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const crustoraTemplate = {
  id: "crustora", key: "crustora", name: "Crustora", title: "Crustora", author: "Bizuply", priceLabel: "כלול",
  category: "food", categoryLabel: "אוכל ומסעדות", badge: "חדש",
  description: "תבנית פיצרייה: הירו באלכסון עם פיצה מסתובבת, תפריט כבלוקי משולשים, רצועת חום תנור וטופס כרטיס הזמנה — אבק קמח ואנימציית stretch.",
  thumbnail: React.createElement(CrustoraThumbnail),
  preview: React.createElement(CrustoraPreview),
  component: CrustoraPages, Component: CrustoraPages,
  seed: crustoraSeed, pages: crustoraPages, editorCss: crustoraEditorCss, schema: crustoraSchema, defaultData: crustoraDefaultData,
  renderer: {
    key: "crustora", name: "Crustora", Component: CrustoraPages, component: CrustoraPages, pages: crustoraPages,
    editorMode: "visual-react", editorCss: crustoraEditorCss, schema: crustoraSchema, defaultData: crustoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default crustoraTemplate;
