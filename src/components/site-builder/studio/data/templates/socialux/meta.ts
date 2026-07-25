import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import SocialuxPages, { socialuxPages } from "./pages";
import SocialuxPreview from "./preview";
import SocialuxThumbnail from "./thumbnail";
import { socialuxEditorCss } from "./editorCss";
import { socialuxSchema } from "./schema";
import { socialuxDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#00C2FF",
  secondary: "#030812",
  accent: "#F72585",
  background: "#08111F",
  surface: "#0E1B2E",
  text: "#F2FBFF",
  muted: "#9BD8EB",
  dark: "#030812",
};

export const socialuxSeed = {
  id: "socialux",
  key: "socialux",
  name: "Socialux",
  title: "Socialux",
  description: "אתר מלא לסוכנות סושיאל: 8 עמודים, תנועה, אפקטים ועיצוב kinetic feed grid.",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  niche: "social-media-agency",
  layout: "full-agency",
  image: (socialuxDefaultData as Record<string, any>).heroImage,
  heroTitle: (socialuxDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (socialuxDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "socialux-header", title: "Header" },
    { type: "hero", variant: "socialux-hero", title: "Hero" },
    { type: "about", variant: "socialux-about", title: "About" },
    { type: "services", variant: "socialux-services", title: "Services" },
    { type: "cases", variant: "socialux-cases", title: "Cases" },
    { type: "team", variant: "socialux-team", title: "Team" },
    { type: "gallery", variant: "socialux-gallery", title: "Gallery" },
    { type: "contact", variant: "socialux-contact", title: "Contact" },
    { type: "footer", variant: "socialux-footer", title: "Footer" },
  ].map((block, index) => ({ id: `socialux-${index + 1}-${block.type}`, ...block })),
  pages: socialuxPages,
  editor: { pages: socialuxPages, css: socialuxEditorCss },
  css: socialuxEditorCss,
  data: socialuxDefaultData,
  defaultData: socialuxDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const socialuxTemplate = {
  id: "socialux",
  key: "socialux",
  name: "Socialux",
  title: "Socialux",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  badge: "חדש",
  description: "אתר מלא לסוכנות סושיאל עם 8 עמודים, תנועה ואפקטים — kinetic feed grid.",
  thumbnail: React.createElement(SocialuxThumbnail),
  preview: React.createElement(SocialuxPreview),
  component: SocialuxPages,
  Component: SocialuxPages,
  seed: socialuxSeed,
  pages: socialuxPages,
  editorCss: socialuxEditorCss,
  schema: socialuxSchema,
  defaultData: socialuxDefaultData,
  renderer: {
    key: "socialux",
    name: "Socialux",
    Component: SocialuxPages,
    component: SocialuxPages,
    pages: socialuxPages,
    editorMode: "visual-react",
    editorCss: socialuxEditorCss,
    schema: socialuxSchema,
    defaultData: socialuxDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default socialuxTemplate;
