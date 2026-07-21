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
  description: "תבנית משפחתית חמה עם תמונת הירו עגולה יחידה, בתים בזיג-זג, רשימת שכונות טיפוגרפית, טלפון ענק ופוטר רך.",
  category: "real-estate", categoryLabel: "נדל״ן", niche: "real-estate", layout: "full",
  image: (homaraDefaultData as any).heroImage,
  heroTitle: (homaraDefaultData as any).heroTitle,
  heroSubtitle: (homaraDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "soft-family-nav", title: "Soft Header" },
    { type: "hero", variant: "single-circular-image", title: "Circular Hero" },
    { type: "listings", variant: "zig-zag-family-homes", title: "Zig Zag Homes" },
    { type: "neighborhoods", variant: "large-place-name-list", title: "Place Names" },
    { type: "about", variant: "family-promise-band", title: "Family Promise" },
    { type: "contact", variant: "giant-phone-small-form", title: "Giant Phone Contact" },
    { type: "footer", variant: "warm-three-column", title: "Warm Footer" },
  ].map((b, i) => ({ id: `homara-${i + 1}-${b.type}`, ...b })),
  pages: homaraPages,
  editor: { pages: homaraPages, css: homaraEditorCss },
  css: homaraEditorCss, data: homaraDefaultData, defaultData: homaraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const homaraTemplate = {
  id: "homara", key: "homara", name: "Homara", title: "Homara", author: "Bizuply", priceLabel: "כלול",
  category: "real-estate", categoryLabel: "נדל״ן", badge: "חדש",
  description: "תבנית משפחתית חמה עם תמונת הירו עגולה יחידה, בתים בזיג-זג, רשימת שכונות טיפוגרפית, טלפון ענק ופוטר רך.",
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
