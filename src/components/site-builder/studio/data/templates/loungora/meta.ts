import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import LoungoraPages, { loungoraPages } from "./pages";
import LoungoraPreview from "./preview";
import LoungoraThumbnail from "./thumbnail";
import { loungoraEditorCss } from "./editorCss";
import { loungoraSchema } from "./schema";
import { loungoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#5B21B6",
  secondary: "#2E1065",
  accent: "#C4B5FD",
  background: "#FAF5FF",
  surface: "#FFFFFF",
  text: "#4C1D95",
  muted: "#6D28D9",
  dark: "#2E1065",
};

export const loungoraSeed = {
  id: "loungora",
  key: "loungora",
  name: "Loungora",
  title: "Loungora",
  description: "חנות הלבשת בית ולאונג׳: 11 עמודים רגועים עם קטלוג מתוסף החנות.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "loungewear",
  layout: "quietLounge",
  image: (loungoraDefaultData as Record<string, any>).heroImage,
  heroTitle: (loungoraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (loungoraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "loungora-header", title: "Header" },
    { type: "hero", variant: "loungora-hero", title: "Hero" },
    { type: "categories", variant: "loungora-categories", title: "Categories" },
    { type: "store", variant: "loungora-products", title: "Products" },
    { type: "gallery", variant: "loungora-lookbook", title: "Lookbook" },
    { type: "about", variant: "loungora-about", title: "About" },
    { type: "testimonials", variant: "loungora-reviews", title: "Testimonials" },
    { type: "faq", variant: "loungora-faq", title: "FAQ" },
    { type: "contact", variant: "loungora-contact", title: "Contact" },
    { type: "footer", variant: "loungora-footer", title: "Footer" },
  ].map((block, index) => ({ id: `loungora-${index + 1}-${block.type}`, ...block })),
  pages: loungoraPages,
  editor: { pages: loungoraPages, css: loungoraEditorCss },
  css: loungoraEditorCss,
  data: loungoraDefaultData,
  defaultData: loungoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const loungoraTemplate = {
  id: "loungora",
  key: "loungora",
  name: "Loungora",
  title: "Loungora",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "חנות הלבשת בית ולאונג׳: 11 עמודים רגועים עם קטלוג מתוסף החנות.",
  thumbnail: React.createElement(LoungoraThumbnail),
  preview: React.createElement(LoungoraPreview),
  component: LoungoraPages,
  Component: LoungoraPages,
  seed: loungoraSeed,
  pages: loungoraPages,
  editorCss: loungoraEditorCss,
  schema: loungoraSchema,
  defaultData: loungoraDefaultData,
  renderer: {
    key: "loungora",
    name: "Loungora",
    Component: LoungoraPages,
    component: LoungoraPages,
    pages: loungoraPages,
    editorMode: "visual-react",
    editorCss: loungoraEditorCss,
    schema: loungoraSchema,
    defaultData: loungoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default loungoraTemplate;
