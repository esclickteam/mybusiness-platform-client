import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import HomaraPages, { homaraPages } from "./pages";
import HomaraPreview from "./preview";
import HomaraThumbnail from "./thumbnail";
import { homaraEditorCss } from "./editorCss";
import { homaraSchema } from "./schema";
import { homaraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#3f6f5a", secondary: "#6d7568", accent: "#3f6f5a",
  background: "#f3f0e8", surface: "#ebe6da", text: "#243028", muted: "#6d7568", dark: "#1a221c",
};

export const homaraSeed = {
  id: "homara", key: "homara", name: "Homara", title: "Homara",
  description: "תבנית משפחתית רכה: תמונה עגולה במרכז, טקסט מתחת, ירוק אבן חם, אנימציות עדינות.",
  category: "real-estate", categoryLabel: "נדל״ן", niche: "real-estate", layout: "full",
  image: (homaraDefaultData as any).heroImage,
  heroTitle: (homaraDefaultData as any).heroTitle,
  heroSubtitle: (homaraDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "sharp-nav", title: "Header" },
    { type: "hero", variant: "circleCenter", title: "Hero" },
    { type: "services", variant: "list", title: "Listings" },
    { type: "contact", variant: "plain-form", title: "Contact" },
    { type: "footer", variant: "minimal", title: "Footer" },
  ].map((b, i) => ({ id: `homara-${i+1}-${b.type}`, ...b })),
  pages: homaraPages,
  editor: { pages: homaraPages, css: homaraEditorCss },
  css: homaraEditorCss, data: homaraDefaultData, defaultData: homaraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const homaraTemplate = {
  id: "homara", key: "homara", name: "Homara", title: "Homara", author: "Bizuply", priceLabel: "כלול",
  category: "real-estate", categoryLabel: "נדל״ן", badge: "חדש",
  description: "תבנית משפחתית רכה: תמונה עגולה במרכז, טקסט מתחת, ירוק אבן חם, אנימציות עדינות.",
  thumbnail: React.createElement(HomaraThumbnail),
  preview: React.createElement(HomaraPreview),
  component: HomaraPages, Component: HomaraPages,
  seed: homaraSeed, pages: homaraPages, editorCss: homaraEditorCss, schema: homaraSchema, defaultData: homaraDefaultData,
  renderer: {
    key: "homara", name: "Homara", Component: HomaraPages, component: HomaraPages, pages: homaraPages,
    editorMode: "visual-react", editorCss: homaraEditorCss, schema: homaraSchema, defaultData: homaraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default homaraTemplate;
